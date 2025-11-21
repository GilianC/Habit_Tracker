import Link from 'next/link';
import { PlusIcon, HomeIcon, ChartBarIcon, TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { auth } from '@/auth';
import { fetchDashboardStats, fetchUserActivitiesWithTodayStatus, fetchUserStars } from '@/app/lib/data';
import { redirect } from 'next/navigation';
import QuickActivityButton from './quick-activity-button';

export default async function HomePage() {
  // Récupérer la session
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Récupérer les statistiques et activités
  const [stats, activities, userStars] = await Promise.all([
    fetchDashboardStats(session.user.email),
    fetchUserActivitiesWithTodayStatus(session.user.email),
    fetchUserStars(session.user.email)
  ]);

  // Calculer la progression hebdomadaire
  const weekProgress = {
    current: Number(stats.completed_this_week),
    total: Number(stats.daily_activities) * 7,
    percentage: Number(stats.daily_activities) > 0 
      ? Math.round((Number(stats.completed_this_week) / (Number(stats.daily_activities) * 7)) * 100)
      : 0,
    today: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  };

  // Prendre les 3 premières activités pour les raccourcis
  const quickActivities = activities.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* En-tête avec progression */}
        <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-6 shadow-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👋</span>
              <h1 className="text-xl font-bold">Bonjour !</h1>
            </div>
            {/* Badge d'étoiles */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-yellow-300" />
              <span className="font-bold text-lg">{userStars}</span>
            </div>
          </div>
          <p className="text-pink-100 text-sm mb-6 capitalize">{weekProgress.today}</p>

          {/* Progression hebdomadaire */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression hebdomadaire</span>
              <span className="text-sm font-bold">{weekProgress.current}/{weekProgress.total}</span>
            </div>
            
            {/* Barre de progression */}
            <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-linear-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${weekProgress.percentage}%` }}
              ></div>
            </div>

            {/* Statistiques */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-2xl">📅</span>
                <span className="text-sm">Aujourd&apos;hui: 0</span>
              </div>
              <div className="ml-auto text-sm text-pink-100">{weekProgress.percentage}%</div>
            </div>
          </div>
        </div>

        {/* Section "Commencez votre parcours" */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-dashed border-pink-200">
          <h2 className="text-center text-gray-800 font-semibold mb-3">
            Commencez votre parcours
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Créez votre première activité et commencez à construire de meilleures habitudes dès aujourd&apos;hui !
          </p>

          {/* Bouton principal - Créer une activité */}
          <Link
            href="/dashboard/activities/create"
            className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-pink-500 to-rose-600 text-white rounded-2xl py-4 px-6 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mb-6"
          >
            <PlusIcon className="w-6 h-6" />
            <span>Créer ma première activité</span>
          </Link>

          {/* Activités rapides */}
          <div className="grid grid-cols-3 gap-3">
            {quickActivities.map((activity: any) => (
              <QuickActivityButton
                key={activity.id}
                activityId={activity.id.toString()}
                activityName={activity.name}
                activityIcon={activity.icon}
                activityColor={activity.color}
                initialCompleted={activity.completed_today || false}
              />
            ))}
          </div>
        </div>

        {/* Navigation du bas */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-2xl">
          <div className="max-w-md mx-auto px-6 py-4">
            <div className="flex items-center justify-around">
              <Link href="/dashboard/home" className="flex flex-col items-center gap-1 text-pink-600">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <HomeIcon className="w-6 h-6 text-white" />
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
    </div>
  );
}
