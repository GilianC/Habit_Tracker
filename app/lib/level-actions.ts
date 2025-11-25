'use server';

import { auth } from '@/auth';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { calculateLevel } from './level-system';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Ajouter de l'XP et gérer la montée de level automatiquement
export async function addUserXp(userEmail: string, xpAmount: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Non connecté');
    }

    console.log(`✨ [ADD XP] +${xpAmount} XP pour ${userEmail}`);

    // Récupérer les infos actuelles de l'utilisateur
    const userResult = await sql`
      SELECT id, xp, level, stars
      FROM users
      WHERE email = ${userEmail}
    `;

    if (userResult.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const user = userResult[0];
    const currentXp = Number(user.xp) || 0;
    const currentLevel = Number(user.level) || 1;
    const newXp = currentXp + xpAmount;

    // Calculer le nouveau level
    const newLevel = calculateLevel(newXp);

    console.log(`📊 XP: ${currentXp} -> ${newXp} | Level: ${currentLevel} -> ${newLevel}`);

    // Mettre à jour XP et level
    await sql`
      UPDATE users
      SET xp = ${newXp},
          level = ${newLevel},
          stars = ${Number(user.stars) + xpAmount}
      WHERE id = ${user.id}
    `;

    // Si level up, débloquer automatiquement le badge correspondant
    if (newLevel > currentLevel) {
      console.log(`🎉 [LEVEL UP] Niveau ${currentLevel} -> ${newLevel}!`);
      
      // Récupérer les badges de level correspondants
      const levelBadges = await sql`
        SELECT id, title 
        FROM badges 
        WHERE category = 'level'
        AND (
          (title = 'Débutant' AND ${newLevel} >= 2) OR
          (title = 'Apprenti' AND ${newLevel} >= 3) OR
          (title = 'Habitué' AND ${newLevel} >= 4) OR
          (title = 'Expert' AND ${newLevel} >= 5) OR
          (title = 'Maître' AND ${newLevel} >= 6) OR
          (title = 'Légende' AND ${newLevel} >= 7) OR
          (title = 'Champion' AND ${newLevel} >= 8) OR
          (title = 'Titan' AND ${newLevel} >= 9) OR
          (title = 'Dieu Vivant' AND ${newLevel} >= 10) OR
          (title = 'Immortel' AND ${newLevel} >= 11)
        )
      `;

      // Débloquer tous les badges de level jusqu'au niveau actuel
      for (const badge of levelBadges) {
        await sql`
          INSERT INTO user_badges (user_id, badge_id)
          VALUES (${user.id}, ${badge.id})
          ON CONFLICT (user_id, badge_id) DO NOTHING
        `;
        console.log(`🏆 Badge débloqué: ${badge.title}`);
      }

      revalidatePath('/dashboard/badges');
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/challenges');

    return {
      success: true,
      oldXp: currentXp,
      newXp,
      oldLevel: currentLevel,
      newLevel,
      leveledUp: newLevel > currentLevel
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout d\'XP:', error);
    throw error;
  }
}
