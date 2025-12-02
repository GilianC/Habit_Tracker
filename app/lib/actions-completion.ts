'use server';

import { auth } from '@/auth';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Cette partie sera ajoutée à la fin d'actions.ts

// Compléter un défi et ajouter les étoiles/XP
export async function completeChallenge(userChallengeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non connecté');
    }

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
      throw new Error('Défi non trouvé');
    }

    const userChallenge = userChallengeResult[0];

    if (userChallenge.progress < userChallenge.goal_value) {
      throw new Error('Défi pas encore complété');
    }

    await sql`
      UPDATE user_challenges
      SET status = 'completed', completed_at = ${new Date().toISOString()}
      WHERE id = ${userChallengeId}
    `;

    const { addUserXp } = await import('./level-actions');
    await addUserXp(session.user.email, userChallenge.star_reward);

    console.log(`✅ Défi complété! +${userChallenge.star_reward} étoiles/XP`);
    revalidatePath('/dashboard/challenges');
    revalidatePath('/dashboard/badges');
    revalidatePath('/dashboard/profile');
  } catch (error) {
    console.error('❌ Erreur lors de la complétion du défi:', error);
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
      AND challenge_id = ${challengeId}
    `;

    if (challengeResult.length === 0) {
      throw new Error('Défi non trouvé');
    }

    const challenge = challengeResult[0];

    if (challenge[`${challengeId}_claimed`]) {
      throw new Error('Récompense déjà réclamée');
    }

    if (challenge[`${challengeId}_completed`] < challenge[`${challengeId}_target`]) {
      throw new Error('Défi pas encore complété');
    }

    const reward = Number(challenge[`${challengeId}_reward`]);

    await sql`
      UPDATE daily_challenges
      SET ${sql(`${challengeId}_claimed`)} = true
      WHERE user_id = ${userId}
      AND challenge_date = ${today}
    `;

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
      throw new Error('Pas assez d\'étoiles');
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
