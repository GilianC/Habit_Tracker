'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' }); 

// Schémas de validation
const UserSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const ActivitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, 'Le nom de l\'activité est requis'),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  createdAt: z.string(),
});

const CreateActivity = ActivitySchema.omit({ id: true, createdAt: true });

// Actions pour les utilisateurs
export async function signup(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const rawFormData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    const validatedFields = UserSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return validatedFields.error.errors[0]?.message || 'Données invalides';
    }

    const { name, email, password } = validatedFields.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return 'Un utilisateur avec cet email existe déjà';
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    await sql`
      INSERT INTO users (name, email, password_hash, created_at, last_login)
      VALUES (${name}, ${email}, ${hashedPassword}, ${new Date().toISOString()}, ${new Date().toISOString()})
    `;

    console.log('✅ Utilisateur créé avec succès:', email);
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    if ((error as any).code === '23505') { // Duplicate key error
      return 'Un utilisateur avec cet email existe déjà';
    }
    return 'Une erreur est survenue lors de la création du compte';
  }
  
  // Rediriger vers la page de connexion avec un message de succès
  redirect('/login?success=inscription');
}

// Actions pour les activités
export async function createActivity(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // Récupérer l'utilisateur connecté depuis la session
    const session = await auth();
    if (!session?.user?.email) {
      return 'Vous devez être connecté pour créer une activité';
    }

    // Récupérer l'ID de l'utilisateur
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `;
    
    if (userResult.length === 0) {
      return 'Utilisateur non trouvé';
    }

    const userId = userResult[0].id;
    const name = formData.get('name') as string;
    const frequency = formData.get('frequency') as string;
    const color = formData.get('color') as string || '#10B981';
    const icon = formData.get('icon') as string || '✅';
    const startDate = formData.get('startDate') as string || new Date().toISOString().split('T')[0];
    const category = formData.get('category') as string || 'other';
    const imageUrl = formData.get('imageUrl') as string || null;

    // Validation
    if (!name || name.trim().length === 0) {
      return 'Le nom de l\'activité est requis';
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return 'Fréquence invalide';
    }

    // Créer l'activité
    await sql`
      INSERT INTO activities (user_id, name, frequency, color, icon, start_date, category, image_url, created_at)
      VALUES (${userId}, ${name}, ${frequency}, ${color}, ${icon}, ${startDate}, ${category}, ${imageUrl}, ${new Date().toISOString()})
    `;

    console.log('✅ Activité créée avec succès:', name);
    revalidatePath('/dashboard/activities');
    revalidatePath('/dashboard/home');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'activité:', error);
    return 'Une erreur est survenue lors de la création de l\'activité';
  }

  // Rediriger vers la page des activités
  redirect('/dashboard/activities');
}

export async function updateActivity(id: string, formData: FormData) {
  const { userId, name, frequency } = CreateActivity.parse({
    userId: formData.get('userId'),
    name: formData.get('name'),
    frequency: formData.get('frequency'),
  });

  await sql`
    UPDATE activities
    SET name = ${name}, frequency = ${frequency}
    WHERE id = ${id} AND user_id = ${userId}
  `;

  revalidatePath('/dashboard/activities');
  redirect('/dashboard/activities');
}

export async function deleteActivity(id: string, userId: string) {
  try {
    // Supprimer les logs associés (bien que CASCADE devrait le faire automatiquement)
    await sql`DELETE FROM activity_logs WHERE activity_id = ${id}`;
    
    // Supprimer l'activité
    await sql`DELETE FROM activities WHERE id = ${id} AND user_id = ${userId}`;
    
    console.log(`🗑️ Activité ${id} supprimée avec succès`);
    revalidatePath('/dashboard/activities');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
}

export async function logActivity(activityId: string, isDone: boolean) {
  const today = new Date().toISOString().split('T')[0];
  
  // Récupérer la session pour obtenir l'utilisateur
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  // Récupérer l'utilisateur et l'activité
  const userResult = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  const activityResult = await sql`SELECT category FROM activities WHERE id = ${activityId}`;
  
  if (userResult.length === 0 || activityResult.length === 0) {
    throw new Error('Utilisateur ou activité non trouvé');
  }

  const userId = userResult[0].id;
  const activityCategory = activityResult[0].category;
  
  // Vérifier si un log existe déjà pour aujourd'hui
  const existingLog = await sql`
    SELECT id FROM activity_logs 
    WHERE activity_id = ${activityId} AND date = ${today}
  `;

  if (existingLog.length > 0) {
    // Mettre à jour le log existant
    await sql`
      UPDATE activity_logs
      SET is_done = ${isDone}
      WHERE activity_id = ${activityId} AND date = ${today}
    `;
  } else {
    // Créer un nouveau log
    await sql`
      INSERT INTO activity_logs (activity_id, date, is_done)
      VALUES (${activityId}, ${today}, ${isDone})
    `;
  }

  // Mettre à jour les défis journaliers si l'activité est complétée
  if (isDone) {
    // S'assurer que les défis journaliers existent pour aujourd'hui
    const dailyChallengeExists = await sql`
      SELECT id FROM daily_challenges
      WHERE user_id = ${userId} AND challenge_date = ${today}
    `;

    if (dailyChallengeExists.length === 0) {
      await sql`
        INSERT INTO daily_challenges (user_id, challenge_date)
        VALUES (${userId}, ${today})
      `;
    }

    // Compter le nombre d'activités complétées aujourd'hui
    const activitiesCount = await sql`
      SELECT COUNT(DISTINCT al.activity_id) as count
      FROM activity_logs al
      INNER JOIN activities a ON al.activity_id = a.id
      WHERE a.user_id = ${userId}
      AND al.date = ${today}
      AND al.is_done = true
    `;

    // Compter les activités de sport complétées aujourd'hui
    const sportCount = await sql`
      SELECT COUNT(DISTINCT al.activity_id) as count
      FROM activity_logs al
      INNER JOIN activities a ON al.activity_id = a.id
      WHERE a.user_id = ${userId}
      AND a.category = 'sport'
      AND al.date = ${today}
      AND al.is_done = true
    `;

    // Compter les activités de santé complétées aujourd'hui
    const healthCount = await sql`
      SELECT COUNT(DISTINCT al.activity_id) as count
      FROM activity_logs al
      INNER JOIN activities a ON al.activity_id = a.id
      WHERE a.user_id = ${userId}
      AND a.category = 'health'
      AND al.date = ${today}
      AND al.is_done = true
    `;

    // Mettre à jour les défis journaliers
    await sql`
      UPDATE daily_challenges
      SET 
        activities_completed = ${activitiesCount[0].count},
        sport_completed = ${sportCount[0].count},
        health_completed = ${healthCount[0].count}
      WHERE user_id = ${userId}
      AND challenge_date = ${today}
    `;
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/challenges');
}

// Authentification
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  console.log('🔐 [AUTHENTICATE] Tentative de connexion...');
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    console.log('📧 Email:', email);
    
    // NE PAS passer redirectTo à signIn - ça crée des URLs avec localhost
    await signIn('credentials', {
      email,
      password,
      redirect: false, // IMPORTANT: Désactive la redirection automatique
    });
    
    console.log('✅ [AUTHENTICATE] Connexion réussie!');
  } catch (error) {
    console.error('❌ [AUTHENTICATE] Erreur:', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Identifiants invalides.';
        default:
          return 'Une erreur est survenue.';
      }
    }
    throw error;
  }
  
  // Redirection manuelle APRÈS la connexion réussie
  redirect('/dashboard/home');
}

// Actions pour les défis
export async function acceptChallenge(challengeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non connecté');
    }

    // Récupérer l'ID de l'utilisateur
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `;
    
    if (userResult.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const userId = userResult[0].id;

    // Vérifier si le défi existe et est actif
    const challengeResult = await sql`
      SELECT id, goal_type FROM challenges 
      WHERE id = ${challengeId} AND is_active = true
    `;

    if (challengeResult.length === 0) {
      throw new Error('Défi non trouvé ou inactif');
    }

    // Vérifier si l'utilisateur n'a pas déjà accepté ce défi
    const existingResult = await sql`
      SELECT id FROM user_challenges
      WHERE user_id = ${userId} AND challenge_id = ${challengeId}
    `;

    if (existingResult.length > 0) {
      throw new Error('Défi déjà accepté');
    }

    // Accepter le défi
    await sql`
      INSERT INTO user_challenges (user_id, challenge_id, status, progress, start_date)
      VALUES (${userId}, ${challengeId}, 'in_progress', 0, ${new Date().toISOString().split('T')[0]})
    `;

    console.log('✅ Défi accepté avec succès');
    revalidatePath('/dashboard/challenges');
  } catch (error) {
    console.error('❌ Erreur lors de l\'acceptation du défi:', error);
    throw error;
  }
}

export async function completeChallenge(userChallengeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non connect�');
    }

    // R�cup�rer le user_challenge
    const userChallengeResult = await sql`
      SELECT 
        uc.*,
        c.star_reward,
        c.goal_value,
        u.id as user_id,
        u.stars
      FROM user_challenges uc
      INNER JOIN challenges c ON uc.challenge_id = c.id
      INNER JOIN users u ON uc.user_id = u.id
      WHERE uc.id = ${userChallengeId} AND u.email = ${session.user.email}
    `;

    if (userChallengeResult.length === 0) {
      throw new Error('D�fi non trouv�');
    }

    const userChallenge = userChallengeResult[0];

    // V�rifier que le d�fi est compl�t�
    if (userChallenge.progress < userChallenge.goal_value) {
      throw new Error('D�fi pas encore compl�t�');
    }

    // Marquer le d�fi comme compl�t�
    await sql`
      UPDATE user_challenges
      SET status = 'completed', completed_at = ${new Date().toISOString()}
      WHERE id = ${userChallengeId}
    `;

    // Ajouter XP et stars avec le syst�me de level
    const { addUserXp } = await import('./level-actions');
    await addUserXp(session.user.email, userChallenge.star_reward);

    console.log(` D�fi compl�t�! +${userChallenge.star_reward} �toiles/XP`);
    revalidatePath('/dashboard/challenges');
    revalidatePath('/dashboard/badges');
    revalidatePath('/dashboard/profile');
  } catch (error) {
    console.error(' Erreur lors de la compl�tion du d�fi:', error);
    throw error;
  }
}

// Réclamer la récompense d'un défi journalier
export async function claimDailyChallenge(challengeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non connecté');
    }

    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `;

    if (userResult.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const userId = userResult[0].id;
    const today = new Date().toISOString().split('T')[0];

    const challengeResult = await sql`
      SELECT * FROM daily_challenges
      WHERE user_id = ${userId}
      AND challenge_date = ${today}
    `;

    if (challengeResult.length === 0) {
      throw new Error('Défi non trouvé');
    }

    const challenge = challengeResult[0];
    const claimedKey = `${challengeId}_claimed`;
    const completedKey = `${challengeId}_completed`;
    const targetKey = `${challengeId}_target`;
    const rewardKey = `${challengeId}_reward`;

    if (challenge[claimedKey]) {
      throw new Error('Récompense déjà réclamée');
    }

    if (challenge[completedKey] < challenge[targetKey]) {
      throw new Error('Défi pas encore complété');
    }

    const reward = Number(challenge[rewardKey]);

    // Mettre à jour le champ claimed en fonction du challenge
    if (challengeId === 'activities') {
      await sql`
        UPDATE daily_challenges
        SET activities_claimed = true
        WHERE user_id = ${userId}
        AND challenge_date = ${today}
      `;
    } else if (challengeId === 'sport') {
      await sql`
        UPDATE daily_challenges
        SET sport_claimed = true
        WHERE user_id = ${userId}
        AND challenge_date = ${today}
      `;
    } else if (challengeId === 'health') {
      await sql`
        UPDATE daily_challenges
        SET health_claimed = true
        WHERE user_id = ${userId}
        AND challenge_date = ${today}
      `;
    }

    const { addUserXp } = await import('./level-actions');
    await addUserXp(session.user.email, reward);

    console.log(`🎁 Récompense réclamée! +${reward} étoiles`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/challenges');
  } catch (error) {
    console.error('❌ Erreur lors de la réclamation:', error);
    throw error;
  }
}

// Débloquer un badge avec des étoiles
export async function unlockBadge(badgeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non connecté');
    }

    const userResult = await sql`
      SELECT id, stars FROM users WHERE email = ${session.user.email}
    `;

    if (userResult.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const user = userResult[0];

    const badgeResult = await sql`
      SELECT id, star_cost, title FROM badges WHERE id = ${badgeId}
    `;

    if (badgeResult.length === 0) {
      throw new Error('Badge non trouvé');
    }

    const badge = badgeResult[0];

    if (user.stars < badge.star_cost) {
      throw new Error("Pas assez d'étoiles");
    }

    const alreadyUnlocked = await sql`
      SELECT id FROM user_badges
      WHERE user_id = ${user.id} AND badge_id = ${badgeId}
    `;

    if (alreadyUnlocked.length > 0) {
      throw new Error('Badge déjà débloqué');
    }

    await sql`
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (${user.id}, ${badgeId})
    `;

    await sql`
      UPDATE users
      SET stars = stars - ${badge.star_cost}
      WHERE id = ${user.id}
    `;

    console.log(`🏆 Badge débloqué: ${badge.title} (-${badge.star_cost} étoiles)`);
    revalidatePath('/dashboard/badges');
    revalidatePath('/dashboard/challenges');
  } catch (error) {
    console.error('❌ Erreur lors du déblocage du badge:', error);
    throw error;
  }
}

// Changer le thème de l'utilisateur
export async function updateUserTheme(theme: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non connecté');
    }

    await sql`
      UPDATE users
      SET theme = ${theme}
      WHERE email = ${session.user.email}
    `;

    console.log(`🎨 Thème changé: ${theme}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/profile');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors du changement de thème:', error);
    throw error;
  }
}

// ==================== CUSTOM CHALLENGES (Niveau 5+) ====================

export async function createCustomChallenge(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return 'Vous devez être connecté';
    }

    const userResult = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
    if (userResult.length === 0) {
      return 'Utilisateur non trouvé';
    }

    const userId = userResult[0].id;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const targetValue = parseInt(formData.get('targetValue') as string) || 1;
    const unit = formData.get('unit') as string || 'fois';
    const starReward = parseInt(formData.get('starReward') as string) || 10;
    const icon = formData.get('icon') as string || '🎯';
    const color = formData.get('color') as string || '#EC4899';
    const difficulty = formData.get('difficulty') as string || 'medium';
    const durationDays = parseInt(formData.get('durationDays') as string) || 7;

    if (!title || title.trim().length === 0) {
      return 'Le titre est requis';
    }

    if (targetValue < 1) {
      return 'La valeur cible doit être supérieure à 0';
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    await sql`
      INSERT INTO custom_challenges (
        user_id, title, description, target_value, unit, star_reward,
        icon, color, difficulty, expires_at, created_at
      )
      VALUES (
        ${userId}, ${title}, ${description}, ${targetValue}, ${unit}, ${starReward},
        ${icon}, ${color}, ${difficulty}, ${expiresAt.toISOString()}, ${new Date().toISOString()}
      )
    `;

    console.log('✅ Défi personnalisé créé:', title);
    revalidatePath('/dashboard/challenges');
    
    return undefined; // Succès
  } catch (error) {
    console.error('❌ Erreur création défi personnalisé:', error);
    return 'Une erreur est survenue';
  }
}

export async function updateCustomChallengeProgress(
  challengeId: number,
  incrementValue: number = 1
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non authentifié');
    }

    const userResult = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
    if (userResult.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const userId = userResult[0].id;

    // Récupérer le défi
    const challenge = await sql`
      SELECT * FROM custom_challenges
      WHERE id = ${challengeId} AND user_id = ${userId}
    `;

    if (challenge.length === 0) {
      throw new Error('Défi non trouvé');
    }

    const currentChallenge = challenge[0];
    const newValue = currentChallenge.current_value + incrementValue;
    const isCompleted = newValue >= currentChallenge.target_value;

    // Mettre à jour le défi
    await sql`
      UPDATE custom_challenges
      SET 
        current_value = ${newValue},
        is_completed = ${isCompleted},
        completed_at = ${isCompleted ? new Date().toISOString() : null}
      WHERE id = ${challengeId}
    `;

    // Si complété, donner des XP
    if (isCompleted && !currentChallenge.is_completed) {
      await addUserXp(session.user.email, currentChallenge.star_reward);
      console.log(`🎉 Défi personnalisé complété: ${currentChallenge.title}`);
    }

    revalidatePath('/dashboard/challenges');
    return { success: true, isCompleted };
  } catch (error) {
    console.error('❌ Erreur mise à jour défi:', error);
    throw error;
  }
}

export async function deleteCustomChallenge(challengeId: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non authentifié');
    }

    const userResult = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
    if (userResult.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const userId = userResult[0].id;

    await sql`
      DELETE FROM custom_challenges
      WHERE id = ${challengeId} AND user_id = ${userId}
    `;

    console.log('🗑️ Défi personnalisé supprimé');
    revalidatePath('/dashboard/challenges');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur suppression défi:', error);
    throw error;
  }
}

