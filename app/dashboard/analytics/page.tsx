import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchUserLevelInfo, fetchXpProgressData, fetchActivityCompletionData } from '@/app/lib/data';
import ProgressChart from '@/app/ui/charts/progress-chart';
import ActivityChart from '@/app/ui/charts/activity-chart';
import { ChartBarIcon, FireIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default async function AnalyticsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const userInfo = await fetchUserLevelInfo(session.user.email);
  const xpData = await fetchXpProgressData(session.user.email, 30);
  const activityData = await fetchActivityCompletionData(session.user.email, 7);

  // Calculer quelques stats
  const totalActivities = activityData.reduce((sum, day) => sum + day.count, 0);
  const averagePerDay = totalActivities / activityData.length;
  const bestDay = activityData.reduce((max, day) => day.count > max.count ? day : max, activityData[0] || { count: 0, day: '-' });

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">📊 Analytics</h1>
              <p className="text-white/90">Visualisez votre progression</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Niveau Actuel</p>
                <p className="text-2xl font-bold text-gray-900">{userInfo.level}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{userInfo.xp} XP total</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center">
                <FireIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cette Semaine</p>
                <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{averagePerDay.toFixed(1)} activités/jour</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Meilleur Jour</p>
                <p className="text-2xl font-bold text-gray-900">{bestDay.count}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{bestDay.day}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Étoiles</p>
                <p className="text-2xl font-bold text-gray-900">{userInfo.stars}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{userInfo.totalBadges} badges débloqués</p>
          </div>
        </div>

        {/* Progression XP/Niveau */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">📈 Progression XP & Niveau</h2>
            <p className="text-sm text-gray-600">Évolution de votre expérience sur les 30 derniers jours</p>
          </div>
          <ProgressChart 
            data={xpData}
            currentXp={userInfo.xp}
            currentLevel={userInfo.level}
          />
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-800">
              💡 <span className="font-semibold">Astuce :</span> Complétez des défis et validez vos activités pour gagner de l'XP et monter de niveau !
            </p>
          </div>
        </div>

        {/* Activités Complétées */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">✅ Activités Complétées</h2>
            <p className="text-sm text-gray-600">Nombre d'activités complétées par jour cette semaine</p>
          </div>
          <ActivityChart data={activityData} period="week" />
          <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
            <p className="text-xs text-pink-800">
              🔥 <span className="font-semibold">Objectif :</span> Essayez de compléter au moins 3 activités par jour pour maintenir votre streak !
            </p>
          </div>
        </div>

        {/* Info Card - Niveau 3 Feature */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center shrink-0">
              <ChartBarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 mb-1">🎉 Fonctionnalité Niveau 3 débloquée !</h3>
              <p className="text-sm text-amber-700">
                Les graphiques avancés vous permettent de suivre votre progression en détail. 
                Plus de statistiques et d'insights seront ajoutés régulièrement !
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
