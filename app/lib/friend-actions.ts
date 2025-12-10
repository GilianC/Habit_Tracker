'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import prisma from './prisma';
import { createNotification } from './notification-actions';

// Types
export type FriendshipStatus = 'pending' | 'accepted' | 'declined';

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

