import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchUserStars, fetchTodayDailyChallenges } from '@/app/lib/data';
import { getActiveFriendChallenges } from '@/app/lib/friend-challenge-actions';
import { StarIcon, HomeIcon, ChartBarIcon, TrophyIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import DailyChallengesCard from '@/app/ui/challenges/daily-challenges-card';
import ActiveFriendChallengeCard from '@/app/ui/friends/active-friend-challenge-card';
import Link from 'next/link';
import prisma from '@/app/lib/prisma';

export default async function ChallengesPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Récupérer l'utilisateur actuel
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!currentUser) {
    redirect('/login');
  }

  const [userStars, dailyChallenges, friendChallengesResult] = await Promise.all([
    fetchUserStars(session.user.email),
    fetchTodayDailyChallenges(session.user.email),
    getActiveFriendChallenges(),
  ]);

  const friendChallenges = friendChallengesResult.success ? friendChallengesResult.challenges || [] : [];
  
  // Debug: Afficher le nombre de défis
  console.log('🔍 Défis avec amis:', {
    success: friendChallengesResult.success,
    count: friendChallenges.length,
    challenges: friendChallenges,
  });

  return (
    <div className="pb-20">
      <div className="max-w-6xl mx-auto p-4 pt-6">
        {/* Header avec étoiles */}
        <div className="bg-linear-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Défis Journaliers</h1>
              <p className="text-pink-100">Complète tes défis pour gagner des étoiles ⭐</p>
            </div>
            <div className="text-center bg-white/20 rounded-xl px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 justify-center mb-1">
                <StarIcon className="w-8 h-8 text-yellow-300" />
                <span className="text-4xl font-bold">{userStars}</span>
              </div>
              <p className="text-sm text-pink-100">Étoiles</p>
            </div>
          </div>
        </div>

        {/* Défis journaliers */}
        <DailyChallengesCard challenges={dailyChallenges} />

        {/* Défis avec amis */}
        {friendChallenges.length > 0 ? (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚔️</span>
              <h2 className="text-2xl font-bold text-gray-800">Défis avec amis</h2>
              <span className="px-2 py-1 bg-pink-100 text-pink-600 text-sm font-bold rounded-full">
                {friendChallenges.length}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {friendChallenges.map((challenge: any) => (
                <ActiveFriendChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  currentUserId={currentUser.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-3">⚔️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Aucun défi avec amis en cours
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Défiez vos amis pour rendre vos habitudes plus motivantes !
            </p>
            <Link
              href="/dashboard/home"
              className="inline-block px-6 py-3 bg-linear-to-r from-pink-500 to-rose-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              Voir mes amis
            </Link>
          </div>
        )}
      </div>

      {/* Navigation du bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-2xl">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            <Link href="/dashboard/home" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors">
                <HomeIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Accueil</span>
            </Link>

            <Link href="/dashboard/activities" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Activités</span>
            </Link>

            <Link href="/dashboard/challenges" className="flex flex-col items-center gap-1 text-pink-600">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium">Défis</span>
            </Link>

            <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors">
                <UserCircleIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Profil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
