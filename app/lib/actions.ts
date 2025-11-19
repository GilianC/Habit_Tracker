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

    // Validation
    if (!name || name.trim().length === 0) {
      return 'Le nom de l\'activité est requis';
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return 'Fréquence invalide';
    }

    // Créer l'activité
    await sql`
      INSERT INTO activities (user_id, name, frequency, color, icon, created_at)
      VALUES (${userId}, ${name}, ${frequency}, ${color}, ${icon}, ${new Date().toISOString()})
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
  // Supprimer les logs associés
  await sql`DELETE FROM activity_logs WHERE activity_id = ${id}`;
  
  // Supprimer l'activité
  await sql`DELETE FROM activities WHERE id = ${id} AND user_id = ${userId}`;
  
  revalidatePath('/dashboard/activities');
}

export async function logActivity(activityId: string, isDone: boolean) {
  const today = new Date().toISOString().split('T')[0];
  
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

  revalidatePath('/dashboard');
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