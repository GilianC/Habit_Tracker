import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export default async function SeedAdventPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  async function createAdventEvent() {
    'use server';
    
    const session = await auth();
    if (!session?.user?.email) {
      redirect('/login');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      redirect('/login');
    }

    // Mettre l'utilisateur en admin
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' },
    });

    // Créer l'événement
    const event = await prisma.event.create({
      data: {
        name: '🎄 Calendrier de l\'Avent Sportif',
        description: 'Relevez le défi de décembre ! Faites du sport chaque jour jusqu\'à Noël et gagnez des étoiles. Un défi quotidien pour rester actif pendant les fêtes ! 💪',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-25'),
        isActive: true,
        createdBy: user.id,
      },
    });

    // Créer le défi
    await prisma.eventChallenge.create({
      data: {
        eventId: event.id,
        title: '💪 Activité sportive quotidienne',
        description: 'Faites du sport au moins 1 fois par jour jusqu\'au 25 décembre',
        targetValue: 1,
        unit: 'fois',
        starReward: 50,
        icon: '🏃',
        color: '#FF1493',
      },
    });

    // Créer des notifications pour tous les utilisateurs
    const allUsers = await prisma.user.findMany();
    
    for (const targetUser of allUsers) {
      await prisma.notification.create({
        data: {
          userId: targetUser.id,
          type: 'event_started',
          title: '🎄 Nouvel événement : Calendrier de l\'Avent Sportif !',
          message: 'Un nouveau défi vous attend : faites du sport 1 fois par jour jusqu\'à Noël et gagnez 50 étoiles ! 💪',
          link: '/dashboard/challenges',
          isRead: false,
        },
      });
    }

    revalidatePath('/dashboard/challenges');
    revalidatePath('/dashboard/admin/events');
    
    redirect('/dashboard/admin/events');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-rose-100 to-pink-200 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              🎄 Configuration Événement
            </h1>
            <p className="text-gray-600">
              Créer l&apos;événement &quot;Calendrier de l&apos;Avent Sportif&quot;
            </p>
          </div>

          <div className="bg-pink-50 rounded-2xl p-6 mb-8 border border-pink-200">
            <h2 className="font-bold text-lg text-gray-800 mb-4">📋 Détails de l&apos;événement :</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-pink-600">✓</span>
                <span><strong>Nom :</strong> 🎄 Calendrier de l&apos;Avent Sportif</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">✓</span>
                <span><strong>Période :</strong> 1er décembre - 25 décembre 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">✓</span>
                <span><strong>Défi :</strong> Faire du sport 1 fois par jour</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">✓</span>
                <span><strong>Récompense :</strong> 50 étoiles ⭐</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">✓</span>
                <span><strong>Action :</strong> Vous serez défini comme admin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">✓</span>
                <span><strong>Notifications :</strong> Tous les utilisateurs seront notifiés</span>
              </li>
            </ul>
          </div>

          <form action={createAdventEvent} className="space-y-4">
            <button
              type="submit"
              className="w-full bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              🎁 Créer l&apos;événement maintenant
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Après création, vous pourrez gérer l&apos;événement depuis
            </p>
            <a 
              href="/dashboard/admin/events"
              className="text-pink-600 font-medium hover:text-pink-700"
            >
              /dashboard/admin/events →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
