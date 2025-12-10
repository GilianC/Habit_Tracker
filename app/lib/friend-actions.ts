'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import prisma from './prisma';
import { createNotification } from './notification-actions';

// Types
export type FriendshipStatus = 'pending' | 'accepted' | 'declined';
export type FriendChallengeStatus = 'pending' | 'accepted' | 'declined' | 'active' | 'completed' | 'cancelled';

interface Friend {
  id: number;
  name: string;
  email: string;
  level: number;
  stars: number;
  friendshipId: number;
}

interface FriendRequest {
  id: number;
  requesterId: number;
  requesterName: string;
  requesterEmail: string;
  requesterLevel: number;
  createdAt: Date;
}

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
 * Recherche un utilisateur par email
 */
export async function searchUserByEmail(email: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    // Ne pas se trouver soi-même
    if (email.toLowerCase() === session.user.email.toLowerCase()) {
      return { success: false, error: 'Vous ne pouvez pas vous ajouter vous-même' };
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        level: true,
      },
    });

    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    // Vérifier si déjà amis ou demande en cours
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: 'Utilisateur courant introuvable' };
    }

    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: currentUser.id, addresseeId: user.id },
          { requesterId: user.id, addresseeId: currentUser.id },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return { success: false, error: 'Vous êtes déjà amis' };
      }
      if (existingFriendship.status === 'pending') {
        return { success: false, error: 'Une demande d&apos;ami est déjà en cours' };
      }
    }

    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
      }
    };
  } catch (error) {
    console.error('Erreur lors de la recherche d&apos;utilisateur:', error);
    return { success: false, error: 'Erreur lors de la recherche' };
  }
}

/**
 * Envoie une demande d&apos;ami
 */
export async function sendFriendRequest(addresseeId: number) {
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

    if (currentUser.id === addresseeId) {
      return { success: false, error: 'Vous ne pouvez pas vous ajouter vous-même' };
    }

    // Vérifier si une relation existe déjà
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: currentUser.id, addresseeId: addresseeId },
          { requesterId: addresseeId, addresseeId: currentUser.id },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return { success: false, error: 'Vous êtes déjà amis' };
      }
      if (existingFriendship.status === 'pending') {
        return { success: false, error: 'Une demande est déjà en cours' };
      }
      // Si déclinée, on peut renvoyer une demande - supprimer l&apos;ancienne
      await prisma.friendship.delete({
        where: { id: existingFriendship.id },
      });
    }

    // Créer la demande d&apos;amitié
    const friendship = await prisma.friendship.create({
      data: {
        requesterId: currentUser.id,
        addresseeId: addresseeId,
        status: 'pending',
      },
    });

    // Créer une notification pour le destinataire
    await createNotification({
      userId: addresseeId,
      type: 'friend_request',
      title: '👋 Nouvelle demande d&apos;ami',
      message: `${currentUser.name} souhaite devenir votre ami !`,
      link: '/dashboard/friends',
    });

    revalidatePath('/dashboard');
    return { success: true, friendship };
  } catch (error) {
    console.error('Erreur lors de l&apos;envoi de la demande d&apos;ami:', error);
    return { success: false, error: 'Erreur lors de l&apos;envoi de la demande' };
  }
}

/**
 * Accepte une demande d&apos;ami
 */
export async function acceptFriendRequest(friendshipId: number) {
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

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
      include: { requester: true },
    });

    if (!friendship) {
      return { success: false, error: 'Demande introuvable' };
    }

    if (friendship.addresseeId !== currentUser.id) {
      return { success: false, error: 'Non autorisé' };
    }

    if (friendship.status !== 'pending') {
      return { success: false, error: 'Cette demande a déjà été traitée' };
    }

    // Mettre à jour le statut
    await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'accepted' },
    });

    // Notifier le demandeur
    await createNotification({
      userId: friendship.requesterId,
      type: 'friend_request_accepted',
      title: '🎉 Demande acceptée !',
      message: `${currentUser.name} a accepté votre demande d&apos;ami !`,
      link: '/dashboard/home',
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l&apos;acceptation de la demande:', error);
    return { success: false, error: 'Erreur lors de l&apos;acceptation' };
  }
}

/**
 * Décline une demande d&apos;ami
 */
export async function declineFriendRequest(friendshipId: number) {
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

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      return { success: false, error: 'Demande introuvable' };
    }

    if (friendship.addresseeId !== currentUser.id) {
      return { success: false, error: 'Non autorisé' };
    }

    // Supprimer la demande
    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors du refus de la demande:', error);
    return { success: false, error: 'Erreur lors du refus' };
  }
}

/**
 * Supprime un ami
 */
export async function removeFriend(friendshipId: number) {
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

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      return { success: false, error: 'Amitié introuvable' };
    }

    // Vérifier que l&apos;utilisateur fait partie de cette amitié
    if (friendship.requesterId !== currentUser.id && friendship.addresseeId !== currentUser.id) {
      return { success: false, error: 'Non autorisé' };
    }

    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression de l&apos;ami:', error);
    return { success: false, error: 'Erreur lors de la suppression' };
  }
}

/**
 * Récupère la liste des amis
 */
export async function getFriends(): Promise<{ success: boolean; friends?: Friend[]; error?: string }> {
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

    // Récupérer toutes les amitiés acceptées
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: currentUser.id, status: 'accepted' },
          { addresseeId: currentUser.id, status: 'accepted' },
        ],
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, level: true, stars: true },
        },
        addressee: {
          select: { id: true, name: true, email: true, level: true, stars: true },
        },
      },
    });

    // Mapper les amis (l&apos;ami est l&apos;autre personne dans la relation)
    const friends: Friend[] = friendships.map((friendship) => {
      const friend = friendship.requesterId === currentUser.id 
        ? friendship.addressee 
        : friendship.requester;
      
      return {
        id: friend.id,
        name: friend.name,
        email: friend.email,
        level: friend.level,
        stars: friend.stars,
        friendshipId: friendship.id,
      };
    });

    return { success: true, friends };
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    return { success: false, error: 'Erreur lors de la récupération' };
  }
}

/**
 * Récupère les demandes d&apos;ami en attente
 */
export async function getPendingFriendRequests(): Promise<{ success: boolean; requests?: FriendRequest[]; error?: string }> {
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

    const pendingRequests = await prisma.friendship.findMany({
      where: {
        addresseeId: currentUser.id,
        status: 'pending',
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, level: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const requests: FriendRequest[] = pendingRequests.map((req) => ({
      id: req.id,
      requesterId: req.requester.id,
      requesterName: req.requester.name,
      requesterEmail: req.requester.email,
      requesterLevel: req.requester.level,
      createdAt: req.createdAt,
    }));

    return { success: true, requests };
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    return { success: false, error: 'Erreur lors de la récupération' };
  }
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

    // Mettre à jour la progression
    const updateData = isChallenger
      ? { challengerProgress: challenge.challengerProgress + value }
      : { challengedProgress: challenge.challengedProgress + value };

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

