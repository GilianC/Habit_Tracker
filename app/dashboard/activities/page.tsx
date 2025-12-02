import Link from 'next/link';
import { PlusIcon, CheckCircleIcon, ClockIcon, HomeIcon, ChartBarIcon, TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { auth } from '@/auth';
import { fetchUserActivitiesWithTodayStatus } from '@/app/lib/data';
import { redirect } from 'next/navigation';

export default async function ActivitiesPage() {
  // Récupérer la session
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Récupérer les activités de l'utilisateur
  const activities = await fetchUserActivitiesWithTodayStatus(session.user.email);

  const completedCount = activities.filter((a) => a.completed_today).length;
  const totalCount = activities.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-pink-100 pb-24">
      <div className="p-6">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Habitudes</h1>
          <p className="text-gray-600">
            {completedCount} sur {totalCount} complétées aujourd&apos;hui
          </p>
        </div>

        {/* Barre de progression globale */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Progression du jour</span>
            <span className="text-sm font-bold text-pink-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-linear-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Bouton ajouter une activité */}
        <Link
          href="/dashboard/activities/create"
          className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-pink-500 to-rose-600 text-white rounded-2xl py-4 px-6 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mb-6"
        >
          <PlusIcon className="w-6 h-6" />
          <span>Ajouter une activité</span>
        </Link>

        {/* Liste des activités */}
        <div className="space-y-4">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/dashboard/activities/${activity.id}`}
              className={`block bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 ${
                activity.completed_today ? 'border-2 border-green-300' : 'border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icône de l'activité */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0"
                  style={{ backgroundColor: activity.color }}
                >
                  {activity.icon}
                </div>

                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-gray-800 mb-1 ${activity.completed_today ? 'line-through text-gray-500' : ''}`}>
                    {activity.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium capitalize">
                      {activity.frequency === 'daily' ? 'Quotidien' : activity.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                    </span>
                    <span className="flex items-center gap-1">
                      🔥 <span className="font-semibold">{activity.streak || 0}</span> jours
                    </span>
                  </div>
                </div>

                {/* Statut */}
                {activity.completed_today ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-500 shrink-0" />
                ) : (
                  <ClockIcon className="w-8 h-8 text-gray-400 shrink-0" />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Message si aucune activité */}
        {activities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune activité pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer votre première activité !
            </p>
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

            <Link href="/dashboard/activities" className="flex flex-col items-center gap-1 text-pink-600">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
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
  );
}
