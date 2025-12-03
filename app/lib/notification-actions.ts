'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import prisma from './prisma';

// Types
export type NotificationType = 
  | 'activity_late' 
  | 'event_started' 
  | 'event_ending' 
  | 'challenge_completed'
  | 'badge_earned'
  | 'level_up';

interface CreateNotificationParams {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Crée une nouvelle notification pour un utilisateur
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, notification };
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return { success: false, error: 'Erreur lors de la création de la notification' };
  }
}

/**
 * Récupère toutes les notifications d'un utilisateur
 */
export async function getUserNotifications(limit = 20) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });

    return { 
      success: true, 
      notifications,
      unreadCount 
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return { success: false, error: 'Erreur lors de la récupération des notifications' };
  }
}

/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(notificationId: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== user.id) {
      return { success: false, error: 'Notification introuvable' };
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    return { success: false, error: 'Erreur lors de la mise à jour de la notification' };
  }
}

/**
 * Marque toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error);
    return { success: false, error: 'Erreur lors de la mise à jour des notifications' };
  }
}

/**
 * Supprime une notification
 */
export async function deleteNotification(notificationId: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Non authentifié' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== user.id) {
      return { success: false, error: 'Notification introuvable' };
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return { success: false, error: 'Erreur lors de la suppression de la notification' };
  }
}

/**
 * Vérifie les activités en retard et crée des notifications
 */
export async function checkLateActivities() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Récupérer tous les utilisateurs avec leurs activités quotidiennes
    const users = await prisma.user.findMany({
      include: {
        activities: {
          where: {
            frequency: 'daily',
            startDate: {
              lte: today,
            },
          },
          include: {
            activityLogs: {
              where: {
                date: today,
              },
            },
          },
        },
      },
    });

    let notificationsCreated = 0;

    for (const user of users) {
      // Trouver les activités non complétées aujourd'hui
      const lateActivities = user.activities.filter(
        (activity) => 
          activity.activityLogs.length === 0 || 
          !activity.activityLogs[0]?.isDone
      );

      if (lateActivities.length > 0) {
        // Vérifier si une notification n'a pas déjà été envoyée aujourd'hui
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: user.id,
            type: 'activity_late',
            createdAt: {
              gte: today,
            },
          },
        });

        if (!existingNotification) {
          const activityNames = lateActivities.map(a => a.name).join(', ');
          const message = lateActivities.length === 1
            ? `Vous n'avez pas encore complété "${lateActivities[0].name}" aujourd'hui !`
            : `Vous avez ${lateActivities.length} activités en attente : ${activityNames}`;

          await createNotification({
            userId: user.id,
            type: 'activity_late',
            title: '⏰ Activités en attente',
            message,
            link: '/dashboard/activities',
          });

          notificationsCreated++;
        }
      }
    }

    return { 
      success: true, 
      message: `${notificationsCreated} notifications créées` 
    };
  } catch (error) {
    console.error('Erreur lors de la vérification des activités en retard:', error);
    return { success: false, error: 'Erreur lors de la vérification' };
  }
}

/**
 * Notifie les utilisateurs des événements qui commencent aujourd'hui
 */
export async function notifyEventStart() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Trouver les événements qui commencent aujourd'hui
    const startingEvents = await prisma.event.findMany({
      where: {
        startDate: today,
        isActive: true,
      },
      include: {
        eventChallenges: true,
      },
    });

    let notificationsCreated = 0;

    for (const event of startingEvents) {
      // Notifier tous les utilisateurs
      const users = await prisma.user.findMany();

      for (const user of users) {
        const challengeInfo = event.eventChallenges.length > 0
          ? ` avec ${event.eventChallenges.length} défi${event.eventChallenges.length > 1 ? 's' : ''} !`
          : '';

        await createNotification({
          userId: user.id,
          type: 'event_started',
          title: '🎉 Nouvel événement !',
          message: `"${event.name}" commence aujourd'hui${challengeInfo}`,
          link: '/dashboard/challenges',
        });

        notificationsCreated++;
      }
    }

    return { 
      success: true, 
      message: `${notificationsCreated} notifications créées` 
    };
  } catch (error) {
    console.error('Erreur lors de la notification des événements:', error);
    return { success: false, error: 'Erreur lors de la notification' };
  }
}

/**
 * Notifie les utilisateurs des événements qui se terminent bientôt (dans 2 jours)
 */
export async function notifyEventEnding() {
  try {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    const endingEvents = await prisma.event.findMany({
      where: {
        endDate: twoDaysFromNow,
        isActive: true,
      },
    });

    let notificationsCreated = 0;

    for (const event of endingEvents) {
      const users = await prisma.user.findMany();

      for (const user of users) {
        await createNotification({
          userId: user.id,
          type: 'event_ending',
          title: '⏳ Événement bientôt terminé',
          message: `"${event.name}" se termine dans 2 jours ! Dernière chance de participer.`,
          link: '/dashboard/challenges',
        });

        notificationsCreated++;
      }
    }

    return { 
      success: true, 
      message: `${notificationsCreated} notifications créées` 
    };
  } catch (error) {
    console.error('Erreur lors de la notification de fin d\'événements:', error);
    return { success: false, error: 'Erreur lors de la notification' };
  }
}
