import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import Link from 'next/link';

export default async function QuickSetupPage() {
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

  // Vérifier si l'utilisateur est déjà admin
  const isAdmin = user.role === 'admin';

  // Vérifier si l'événement existe déjà
  const existingEvent = await prisma.$queryRaw`
    SELECT * FROM events WHERE name LIKE '%Calendrier%' LIMIT 1
  `;

  const eventExists = Array.isArray(existingEvent) && existingEvent.length > 0;

  async function setupEverything() {
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

    try {
      // 1. Mettre l'utilisateur en admin
      await prisma.$executeRaw`
        UPDATE users SET role = 'admin' WHERE id = ${user.id}
      `;

      // 2. Créer l'événement
      await prisma.$executeRaw`
        INSERT INTO events (name, description, start_date, end_date, is_active, created_by, created_at)
        VALUES (
          '🎄 Calendrier de l''Avent Sportif',
          'Relevez le défi de décembre ! Faites du sport chaque jour jusqu''à Noël et gagnez des étoiles. Un défi quotidien pour rester actif pendant les fêtes ! 💪',
          '2025-12-01',
          '2025-12-25',
          true,
          ${user.id},
          NOW()
        )
        ON CONFLICT DO NOTHING
      `;

      // 3. Récupérer l'ID de l'événement
      const events: Array<{ id: number }> = await prisma.$queryRaw`
        SELECT id FROM events WHERE name LIKE '%Calendrier%' ORDER BY created_at DESC LIMIT 1
      `;

      if (events && events.length > 0) {
        const eventId = events[0].id;

        // 4. Créer le défi
        await prisma.$executeRaw`
          INSERT INTO event_challenges (event_id, title, description, target_value, unit, star_reward, icon, color, created_at)
          VALUES (
            ${eventId},
            '💪 Activité sportive quotidienne',
            'Faites du sport au moins 1 fois par jour jusqu''au 25 décembre',
            1,
            'fois',
            50,
            '🏃',
            '#FF1493',
            NOW()
          )
          ON CONFLICT DO NOTHING
        `;

        // 5. Créer des notifications pour tous les utilisateurs
        const allUsers = await prisma.user.findMany();
        
        for (const targetUser of allUsers) {
          await prisma.$executeRaw`
            INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at)
            VALUES (
              ${targetUser.id},
              'event_started',
              '🎄 Nouvel événement : Calendrier de l''Avent Sportif !',
              'Un nouveau défi vous attend : faites du sport 1 fois par jour jusqu''à Noël et gagnez 50 étoiles ! 💪',
              '/dashboard/challenges',
              false,
              NOW()
            )
          `;
        }
      }

      redirect('/dashboard/admin/events');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      redirect('/dashboard/home');
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-rose-100 to-pink-200 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-200">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎄</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Configuration Rapide
            </h1>
            <p className="text-gray-600">
              Calendrier de l&apos;Avent Sportif 2025
            </p>
          </div>

          {/* Statut actuel */}
          <div className="bg-pink-50 rounded-2xl p-6 mb-8 border border-pink-200">
            <h2 className="font-bold text-lg text-gray-800 mb-4">📊 Statut actuel :</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <>
                    <span className="text-2xl">✅</span>
                    <span className="text-gray-700">Vous êtes <strong>admin</strong></span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">⏳</span>
                    <span className="text-gray-700">Vous serez défini comme <strong>admin</strong></span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                {eventExists ? (
                  <>
                    <span className="text-2xl">✅</span>
                    <span className="text-gray-700">L&apos;événement <strong>existe déjà</strong></span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">⏳</span>
                    <span className="text-gray-700">L&apos;événement sera <strong>créé</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Détails */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-8 border border-pink-200">
            <h2 className="font-bold text-lg text-gray-800 mb-4">🎁 Ce qui sera créé :</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span><strong>Événement :</strong> Du 1er au 25 décembre 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span><strong>Défi :</strong> Sport 1 fois par jour</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span><strong>Récompense :</strong> 50 étoiles ⭐</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span><strong>Notifications :</strong> Envoyées à tous les utilisateurs</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          {eventExists ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                <p className="text-green-700 font-medium">
                  ✅ L&apos;événement existe déjà !
                </p>
              </div>
              <Link
                href="/dashboard/admin/events"
                className="block w-full bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center"
              >
                Gérer l&apos;événement →
              </Link>
            </div>
          ) : (
            <form action={setupEverything} className="space-y-4">
              <button
                type="submit"
                className="w-full bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                🚀 Créer l&apos;événement maintenant
              </button>
              <p className="text-center text-sm text-gray-500">
                Un seul clic pour tout configurer automatiquement
              </p>
            </form>
          )}

          {/* Liens utiles */}
          <div className="mt-8 pt-6 border-t border-pink-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Accès rapides :</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                href="/dashboard/home"
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors text-sm font-medium"
              >
                🏠 Accueil
              </Link>
              <Link 
                href="/dashboard/challenges"
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors text-sm font-medium"
              >
                🏆 Défis
              </Link>
              <Link 
                href="/dashboard/notifications"
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors text-sm font-medium"
              >
                🔔 Notifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
