import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckCircleIcon, XMarkIcon, HomeIcon, ChartBarIcon, TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { fetchActivityDetails, fetchActivityHistory } from '@/app/lib/data';
import ValidateActivityButton from './validate-activity-button';
import DeleteActivityButton from './delete-activity-button';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Await params pour Next.js 15
  const { id } = await params;

  const activity = await fetchActivityDetails(id, session.user.email);
  
  if (!activity) {
    notFound();
  }

  // Récupérer l'ID utilisateur pour le bouton de suppression
  const userResult = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  const userId = String(userResult[0].id);

  const history = await fetchActivityHistory(id, session.user.email);

  // Calculer la série actuelle
  let currentStreak = 0;
  for (const day of history) {
    if (day.completed) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header avec retour */}
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/activities"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors shadow-md"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Détails de l&apos;activité</h1>
        </div>

        {/* Carte principale de l'activité */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-pink-100">
          {/* Icône et nom */}
          <div className="flex items-start gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              style={{ backgroundColor: activity.color }}
            >
              {activity.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{activity.name}</h2>
              <p className="text-gray-600 text-sm">
                {activity.frequency === 'daily' ? 'Quotidien' : 
                 activity.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
              </p>
            </div>
          </div>

          {/* Description */}
          {activity.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700">{activity.description}</p>
            </div>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 text-center border border-pink-200">
              <div className="text-3xl font-bold text-pink-600">{activity.total_completions}</div>
              <div className="text-xs text-gray-600 mt-1">Complétions totales</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 text-center border border-pink-200">
              <div className="text-3xl font-bold text-pink-600">{currentStreak}</div>
              <div className="text-xs text-gray-600 mt-1">Série actuelle</div>
            </div>
          </div>

          {/* Dernière complétion */}
          {activity.last_completed && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Dernière complétion</h3>
              <p className="text-gray-700">
                {new Date(activity.last_completed).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Bouton de validation */}
          <ValidateActivityButton
            activityId={id}
            activityName={activity.name}
            initialCompleted={activity.completed_today}
          />

          {/* Bouton de suppression */}
          <div className="mt-4">
            <DeleteActivityButton
              activityId={id}
              userId={userId}
              activityName={activity.name}
            />
          </div>
        </div>

        {/* Historique des 7 derniers jours */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-pink-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Historique (7 derniers jours)</h3>
          <div className="space-y-3">
            {history.map((day: any) => {
              const date = new Date(day.date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={day.date}
                  className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                    day.completed 
                      ? 'bg-green-50 border-2 border-green-300' 
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {day.completed ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <XMarkIcon className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium text-gray-800 capitalize">
                        {date.toLocaleDateString('fr-FR', { weekday: 'long' })}
                        {isToday && <span className="ml-2 text-xs text-pink-500 font-semibold">(Aujourd&apos;hui)</span>}
                      </div>
                      <div className="text-sm text-gray-500">
                        {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      </div>
                    </div>
                  </div>
                  {day.completed && (
                    <div className="text-green-600 font-semibold text-sm">✓ Complété</div>
                  )}
                </div>
              );
            })}
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
