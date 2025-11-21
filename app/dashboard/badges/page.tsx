import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchAllBadges, fetchUserBadges, fetchUserStars } from '@/app/lib/data';
import BadgesGallery from '@/app/ui/badges/badges-gallery';
import { StarIcon } from '@heroicons/react/24/solid';

export default async function BadgesPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const [allBadges, userBadges, userStars] = await Promise.all([
    fetchAllBadges(),
    fetchUserBadges(session.user.email),
    fetchUserStars(session.user.email)
  ]);

  const unlockedBadgeIds = userBadges.map(b => b.badge_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 pb-20">
      <div className="max-w-6xl mx-auto p-4 pt-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Collection de Badges</h1>
              <p className="text-pink-100">Débloque des badges avec tes étoiles ⭐</p>
            </div>
            <div className="text-center bg-white/20 rounded-xl px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 justify-center mb-1">
                <StarIcon className="w-8 h-8 text-yellow-300" />
                <span className="text-4xl font-bold">{userStars}</span>
              </div>
              <p className="text-sm text-pink-100">Étoiles disponibles</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-pink-600">{userBadges.length}</p>
            <p className="text-sm text-gray-600">Débloqués</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-gray-400">{allBadges.length - userBadges.length}</p>
            <p className="text-sm text-gray-600">Verrouillés</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-purple-600">{allBadges.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {allBadges.length > 0 ? Math.round((userBadges.length / allBadges.length) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Progression</p>
          </div>
        </div>

        {/* Galerie de badges */}
        <BadgesGallery
          allBadges={allBadges}
          unlockedBadgeIds={unlockedBadgeIds}
          userStars={userStars}
        />
      </div>
    </div>
  );
}
