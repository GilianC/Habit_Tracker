import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchUserChallenges, fetchUserActivitiesWithTodayStatus, fetchUserStars } from '@/app/lib/data';
import ChallengesList from '@/app/ui/challenges/challenges-list';
import CreateChallengeButton from '@/app/ui/challenges/create-challenge-button';
import { StarIcon } from '@heroicons/react/24/solid';

export default async function ChallengesPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const [challenges, activities, userStars] = await Promise.all([
    fetchUserChallenges(session.user.email),
    fetchUserActivitiesWithTodayStatus(session.user.email),
    fetchUserStars(session.user.email)
  ]);

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 pb-20">
      <div className="max-w-4xl mx-auto p-4 pt-6">
        {/* Header avec étoiles */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes Défis</h1>
              <p className="text-pink-100">Relève des défis pour gagner des étoiles ⭐</p>
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

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-pink-600">{activeChallenges.length}</p>
            <p className="text-sm text-gray-600">En cours</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-green-600">{completedChallenges.length}</p>
            <p className="text-sm text-gray-600">Complétés</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-yellow-600">{challenges.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>

        {/* Bouton créer un défi */}
        {activities.length > 0 && (
          <CreateChallengeButton activities={activities} />
        )}

        {/* Liste des défis */}
        <ChallengesList challenges={challenges} />
      </div>
    </div>
  );
}
