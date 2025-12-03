'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from './prisma';
import { createNotification } from './notification-actions';

// Schémas de validation
const EventSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  startDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Date de début invalide'),
  endDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Date de fin invalide'),
});

const EventChallengeSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  targetValue: z.number().min(1),
  unit: z.string().default('fois'),
  starReward: z.number().min(1).max(100),
  icon: z.string().default('🎯'),
  color: z.string().default('#EC4899'),
});

/**
 * Vérifie si l'utilisateur est admin
 */
async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    return { isAdmin: false, error: 'Non authentifié' };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { isAdmin: false, error: 'Utilisateur introuvable' };
  }

  if (user.role !== 'admin') {
    return { isAdmin: false, error: 'Accès refusé - Admin uniquement' };
  }

  return { isAdmin: true, user };
}

/**
 * Crée un nouvel événement (Admin uniquement)
 */
export async function createEvent(formData: FormData) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return { success: false, error: adminCheck.error };
    }

    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    };

    const validatedFields = EventSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0]?.message || 'Données invalides',
      };
    }

    const { name, description, startDate, endDate } = validatedFields.data;

    // Vérifier que la date de fin est après la date de début
    if (new Date(endDate) <= new Date(startDate)) {
      return {
        success: false,
        error: 'La date de fin doit être après la date de début',
      };
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy: adminCheck.user!.id,
      },
    });

    revalidatePath('/dashboard/admin/events');
    return { success: true, event };
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return { success: false, error: 'Erreur lors de la création de l\'événement' };
  }
}

/**
 * Met à jour un événement (Admin uniquement)
 */
export async function updateEvent(eventId: number, formData: FormData) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return { success: false, error: adminCheck.error };
    }

    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    };

    const validatedFields = EventSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0]?.message || 'Données invalides',
      };
    }

    const { name, description, startDate, endDate } = validatedFields.data;

    if (new Date(endDate) <= new Date(startDate)) {
      return {
        success: false,
        error: 'La date de fin doit être après la date de début',
      };
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    revalidatePath('/dashboard/admin/events');
    return { success: true, event };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    return { success: false, error: 'Erreur lors de la mise à jour de l\'événement' };
  }
}

/**
 * Active/Désactive un événement (Admin uniquement)
 */
export async function toggleEventStatus(eventId: number) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return { success: false, error: adminCheck.error };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return { success: false, error: 'Événement introuvable' };
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { isActive: !event.isActive },
    });

    revalidatePath('/dashboard/admin/events');
    return { success: true, event: updatedEvent };
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    return { success: false, error: 'Erreur lors du changement de statut' };
  }
}

/**
 * Supprime un événement (Admin uniquement)
 */
export async function deleteEvent(eventId: number) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return { success: false, error: adminCheck.error };
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidatePath('/dashboard/admin/events');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    return { success: false, error: 'Erreur lors de la suppression de l\'événement' };
  }
}

/**
 * Récupère tous les événements (avec filtres optionnels)
 */
export async function getEvents(activeOnly = false) {
  try {
    const where = activeOnly ? { isActive: true } : {};

    const events = await prisma.event.findMany({
      where,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        eventChallenges: true,
        _count: {
          select: {
            userEvents: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return { success: true, events };
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return { success: false, error: 'Erreur lors de la récupération des événements' };
  }
}

/**
 * Ajoute un défi à un événement (Admin uniquement)
 */
export async function addEventChallenge(eventId: number, formData: FormData) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return { success: false, error: adminCheck.error };
    }

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      targetValue: Number(formData.get('targetValue')),
      unit: formData.get('unit') || 'fois',
      starReward: Number(formData.get('starReward')),
      icon: formData.get('icon') || '🎯',
      color: formData.get('color') || '#EC4899',
    };

    const validatedFields = EventChallengeSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0]?.message || 'Données invalides',
      };
    }

    const challenge = await prisma.eventChallenge.create({
      data: {
        eventId,
        ...validatedFields.data,
      },
    });

    // Notifier tous les utilisateurs du nouveau défi
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (event) {
      const users = await prisma.user.findMany();
      
      for (const user of users) {
        await createNotification({
          userId: user.id,
          type: 'event_started',
          title: '🎯 Nouveau défi disponible !',
          message: `Un nouveau défi "${validatedFields.data.title}" a été ajouté à l'événement "${event.name}"`,
          link: '/dashboard/challenges',
        });
      }
    }

    revalidatePath('/dashboard/admin/events');
    return { success: true, challenge };
  } catch (error) {
    console.error('Erreur lors de l\'ajout du défi:', error);
    return { success: false, error: 'Erreur lors de l\'ajout du défi' };
  }
}

/**
 * Supprime un défi d'événement (Admin uniquement)
 */
export async function deleteEventChallenge(challengeId: number) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return { success: false, error: adminCheck.error };
    }

    await prisma.eventChallenge.delete({
      where: { id: challengeId },
    });

    revalidatePath('/dashboard/admin/events');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du défi:', error);
    return { success: false, error: 'Erreur lors de la suppression du défi' };
  }
}

/**
 * Récupère les événements actifs pour un utilisateur
 */
export async function getActiveEventsForUser() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        startDate: { lte: today },
        endDate: { gte: today },
      },
      include: {
        eventChallenges: true,
      },
      orderBy: { endDate: 'asc' },
    });

    return { success: true, events };
  } catch (error) {
    console.error('Erreur lors de la récupération des événements actifs:', error);
    return { success: false, error: 'Erreur lors de la récupération' };
  }
}
