import Link from 'next/link';
import { Cog6ToothIcon, ArrowRightOnRectangleIcon, FireIcon, ChartBarIcon, TrophyIcon, CalendarIcon, HomeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  // Récupérer la session
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Données du profil (à connecter plus tard à la base de données)
  const user = {
    name: session.user.name || 'Utilisateur',
    email: session.user.email,
    joinDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    level: 3,
    currentPoints: 280,
    nextLevelPoints: 300,
    stats: {
      streak: 7,
      totalActivities: 12,
      totalPoints: 280,
      bestStreak: 15
    },
    badges: [
      { id: 1, name: 'Premier pas', icon: '🌟', earned: true, color: 'from-yellow-400 to-orange-500' },
      { id: 2, name: 'Régularité', icon: '🔥', earned: true, color: 'from-orange-400 to-red-500' },
      { id: 3, name: 'Champion', icon: '🏆', earned: false, color: 'from-blue-400 to-purple-500' },
      { id: 4, name: 'Marathonien', icon: '🎯', earned: false, color: 'from-green-400 to-teal-500' }
    ]
  };

  const levelProgress = (user.currentPoints / user.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-pink-100 pb-24">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* En-tête profil */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
          {/* Avatar et info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shrink-0">
              <UserCircleIcon className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{user.name}</h1>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">Membre depuis {user.joinDate}</p>
            </div>
          </div>

          {/* Niveau et progression */}
          <div className="bg-linear-to-r from-pink-50 to-rose-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Niveau {user.level}</span>
              <span className="text-xs text-gray-600">{user.currentPoints}/{user.nextLevelPoints} XP</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 shadow-inner">
              <div 
                className="bg-linear-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 text-center mt-2">
              Plus que {user.nextLevelPoints - user.currentPoints} XP pour le niveau {user.level + 1}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/dashboard/settings"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Paramètres</span>
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}
            >
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-600">Déconnexion</span>
              </button>
            </form>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mes Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Streak actuel */}
            <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FireIcon className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.stats.streak}</p>
              <p className="text-xs text-gray-600">jours de suite</p>
            </div>

            {/* Total activités */}
            <div className="bg-linear-to-br from-pink-50 to-rose-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <ChartBarIcon className="w-8 h-8 text-pink-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.stats.totalActivities}</p>
              <p className="text-xs text-gray-600">activités créées</p>
            </div>

            {/* Points totaux */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrophyIcon className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.stats.totalPoints}</p>
              <p className="text-xs text-gray-600">points gagnés</p>
            </div>

            {/* Meilleur streak */}
            <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CalendarIcon className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.stats.bestStreak}</p>
              <p className="text-xs text-gray-600">meilleur streak</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mes Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl p-4 text-center transition-all ${
                  badge.earned
                    ? `bg-linear-to-br ${badge.color} shadow-lg`
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className={`text-4xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                  {badge.icon}
                </div>
                <p className={`text-sm font-semibold ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                  {badge.name}
                </p>
                {!badge.earned && (
                  <p className="text-xs text-gray-400 mt-1">Verrouillé</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-xl">✅</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Activité complétée</p>
                <p className="text-xs text-gray-600">Il y a 2 heures</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-xl">🎯</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Nouveau défi débloqué</p>
                <p className="text-xs text-gray-600">Hier</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-xl">⭐</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Badge obtenu</p>
                <p className="text-xs text-gray-600">Il y a 3 jours</p>
              </div>
            </div>
          </div>
        </div>
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

            <Link href="/dashboard/challenges" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors">
                <TrophyIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Défis</span>
            </Link>

            <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 text-pink-600">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium">Profil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
