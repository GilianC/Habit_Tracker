'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import prisma from './prisma';
import { createNotification } from './notification-actions';

// Types
export type FriendChallengeStatus = 'pending' | 'accepted' | 'declined' | 'active' | 'completed' | 'cancelled';

interface FriendChallengeData {
  friendId: number;
  activityId?: number;
  eventId?: number;
  title: string;
  description?: string;
  targetValue: number;
  unit: string;
  starReward: number;
  durationDays: number;
}

/**
 * Lance un défi à un ami
 */
export async function challengeFriend(data: FriendChallengeData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    // Vérifier que les deux utilisateurs sont amis
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: currentUser.id, addresseeId: data.friendId, status: 'accepted' },
          { requesterId: data.friendId, addresseeId: currentUser.id, status: 'accepted' },
        ],
      },
    });

    if (!friendship) {
      return { success: false, error: 'Vous n&apos;êtes pas amis avec cet utilisateur' };
    }

    // Calculer les dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + data.durationDays);

    // Créer le défi
    const challenge = await prisma.friendChallenge.create({
      data: {
        challengerId: currentUser.id,
        challengedId: data.friendId,
        activityId: data.activityId || null,
        eventId: data.eventId || null,
        title: data.title,
        description: data.description || null,
        targetValue: data.targetValue,
        unit: data.unit,
        starReward: data.starReward,
        status: 'pending',
        startDate: startDate,
        endDate: endDate,
      },
    });

    // Notifier l&apos;ami
    await createNotification({
      userId: data.friendId,
      type: 'friend_challenge',
      title: '⚔️ Défi reçu !',
      message: `${currentUser.name} vous lance un défi : ${data.title}`,
      link: `/dashboard/friends?challenge=${challenge.id}`,
    });

    revalidatePath('/dashboard');
    return { success: true, challenge };
  } catch (error) {
    console.error('Erreur lors de la création du défi:', error);
    return { success: false, error: 'Erreur lors de la création du défi' };
  }
}

/**
 * Accepte un défi d&apos;ami
 */
export async function acceptFriendChallenge(challengeId: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    const challenge = await prisma.friendChallenge.findUnique({
      where: { id: challengeId },
      include: { challenger: true },
    });

    if (!challenge) {
      return { success: false, error: 'Défi introuvable' };
    }

    if (challenge.challengedId !== currentUser.id) {
      return { success: false, error: 'Non autorisé' };
    }

    if (challenge.status !== 'pending') {
      return { success: false, error: 'Ce défi a déjà été traité' };
    }

    // Mettre à jour le statut
    await prisma.friendChallenge.update({
      where: { id: challengeId },
      data: { status: 'active' },
    });

    // Notifier le challenger
    await createNotification({
      userId: challenge.challengerId,
      type: 'friend_challenge_accepted',
      title: '🎯 Défi accepté !',
      message: `${currentUser.name} a accepté votre défi : ${challenge.title}`,
      link: '/dashboard/challenges',
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/challenges');
    revalidatePath('/dashboard/friends');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l&apos;acceptation du défi:', error);
    return { success: false, error: 'Erreur lors de l&apos;acceptation' };
  }
}

/**
 * Décline un défi d&apos;ami
 */
export async function declineFriendChallenge(challengeId: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    const challenge = await prisma.friendChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return { success: false, error: 'Défi introuvable' };
    }

    if (challenge.challengedId !== currentUser.id) {
      return { success: false, error: 'Non autorisé' };
    }

    await prisma.friendChallenge.update({
      where: { id: challengeId },
      data: { status: 'declined' },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors du refus du défi:', error);
    return { success: false, error: 'Erreur lors du refus' };
  }
}

/**
 * Récupère les défis d&apos;ami en attente
 */
export async function getPendingFriendChallenges() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    const challenges = await prisma.friendChallenge.findMany({
      where: {
        challengedId: currentUser.id,
        status: 'pending',
      },
      include: {
        challenger: {
          select: { id: true, name: true, email: true, level: true },
        },
        activity: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, challenges };
  } catch (error) {
    console.error('Erreur lors de la récupération des défis:', error);
    return { success: false, error: 'Erreur lors de la récupération' };
  }
}

/**
 * Récupère les défis actifs de l&apos;utilisateur
 */
export async function getActiveFriendChallenges() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    const challenges = await prisma.friendChallenge.findMany({
      where: {
        OR: [
          { challengerId: currentUser.id },
          { challengedId: currentUser.id },
        ],
        status: 'active',
      },
      include: {
        challenger: {
          select: { id: true, name: true, level: true },
        },
        challenged: {
          select: { id: true, name: true, level: true },
        },
        activity: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, challenges };
  } catch (error) {
    console.error('Erreur lors de la récupération des défis actifs:', error);
    return { success: false, error: 'Erreur lors de la récupération' };
  }
}

/**
 * Récupère les détails d'un défi spécifique
 */
export async function getFriendChallengeById(challengeId: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    const challenge = await prisma.friendChallenge.findUnique({
      where: { id: challengeId },
      include: {
        challenger: {
          select: { id: true, name: true, email: true, level: true },
        },
        challenged: {
          select: { id: true, name: true, email: true, level: true },
        },
        activity: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    if (!challenge) {
      return { success: false, error: 'Défi non trouvé' };
    }

    // Vérifier que l'utilisateur fait partie du défi
    if (challenge.challengerId !== currentUser.id && challenge.challengedId !== currentUser.id) {
      return { success: false, error: 'Accès non autorisé' };
    }

    return { success: true, challenge };
  } catch (error) {
    console.error('Erreur lors de la récupération du défi:', error);
    return { success: false, error: 'Erreur lors de la récupération' };
  }
}

/**
 * Enregistre la progression pour un défi d'ami (validation quotidienne)
 */
export async function recordFriendChallengeProgress(challengeId: number, value: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    // Récupérer le défi
    const challenge = await prisma.friendChallenge.findUnique({
      where: { id: challengeId },
      include: {
        challenger: true,
        challenged: true,
      },
      // Inclure tous les champs pour avoir accès à lastValidation
    });

    if (!challenge) {
      return { success: false, error: 'Défi non trouvé' };
    }

    // Vérifier que le défi est actif
    if (challenge.status !== 'active') {
      return { success: false, error: 'Le défi n\'est pas actif' };
    }

    // Vérifier que l'utilisateur fait partie du défi
    const isChallenger = challenge.challengerId === currentUser.id;
    const isChallenged = challenge.challengedId === currentUser.id;

    if (!isChallenger && !isChallenged) {
      return { success: false, error: 'Vous ne faites pas partie de ce défi' };
    }

    // Vérifier si l'utilisateur a déjà validé aujourd'hui
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const lastValidation = isChallenger 
      ? challenge.lastValidationChallenger 
      : challenge.lastValidationChallenged;

    if (lastValidation) {
      const lastValidationDate = new Date(lastValidation);
      const lastValidationDay = new Date(
        lastValidationDate.getFullYear(),
        lastValidationDate.getMonth(),
        lastValidationDate.getDate()
      );

      if (lastValidationDay.getTime() === today.getTime()) {
        return { 
          success: false, 
          error: 'Vous avez déjà validé cette activité aujourd\'hui. Revenez demain !' 
        };
      }
    }

    // Mettre à jour la progression et la date de dernière validation
    const updateData = isChallenger
      ? { 
          challengerProgress: challenge.challengerProgress + value,
          lastValidationChallenger: now
        }
      : { 
          challengedProgress: challenge.challengedProgress + value,
          lastValidationChallenged: now
        };

    const updatedChallenge = await prisma.friendChallenge.update({
      where: { id: challengeId },
      data: updateData,
    });

    // Vérifier si quelqu'un a atteint l'objectif
    const challengerReachedGoal = updatedChallenge.challengerProgress >= updatedChallenge.targetValue;
    const challengedReachedGoal = updatedChallenge.challengedProgress >= updatedChallenge.targetValue;

    if (challengerReachedGoal || challengedReachedGoal) {
      // Déterminer le gagnant
      let winnerId = null;
      if (challengerReachedGoal && !challengedReachedGoal) {
        winnerId = challenge.challengerId;
      } else if (challengedReachedGoal && !challengerReachedGoal) {
        winnerId = challenge.challengedId;
      } else if (challengerReachedGoal && challengedReachedGoal) {
        // Les deux ont atteint l'objectif, le plus rapide gagne
        winnerId = updatedChallenge.challengerProgress >= updatedChallenge.challengedProgress
          ? challenge.challengerId
          : challenge.challengedId;
      }

      // Marquer le défi comme complété
      await prisma.friendChallenge.update({
        where: { id: challengeId },
        data: {
          status: 'completed',
          winnerId: winnerId,
        },
      });

      // Notifier les participants
      const winner = winnerId === challenge.challengerId ? challenge.challenger : challenge.challenged;
      const loser = winnerId === challenge.challengerId ? challenge.challenged : challenge.challenger;

      // Notifier le gagnant
      await createNotification({
        userId: winner.id,
        type: 'friend_challenge_completed',
        title: '🏆 Victoire !',
        message: `Vous avez gagné le défi "${challenge.title}" contre ${loser.name} !`,
        link: '/dashboard/challenges',
      });

      // Notifier le perdant
      await createNotification({
        userId: loser.id,
        type: 'friend_challenge_completed',
        title: '⚔️ Défi terminé',
        message: `${winner.name} a gagné le défi "${challenge.title}". Continuez vos efforts !`,
        link: '/dashboard/challenges',
      });

      // Attribuer les étoiles au gagnant
      await prisma.user.update({
        where: { id: winner.id },
        data: {
          stars: { increment: challenge.starReward },
        },
      });
    }

    revalidatePath('/dashboard/activities');
    revalidatePath('/dashboard/challenges');
    revalidatePath('/dashboard/home');

    return { success: true, progress: updatedChallenge };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la progression:', error);
    return { success: false, error: 'Erreur lors de l\'enregistrement' };
  }
}
