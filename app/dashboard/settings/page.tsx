import { lusitana } from '@/app/ui/fonts';
import { Cog6ToothIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchUserLevelInfo } from '@/app/lib/data';
import ThemeSelector from '@/app/ui/settings/theme-selector';
import postgres from 'postgres';
import Link from 'next/link';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Récupérer les infos utilisateur
  const userInfo = await fetchUserLevelInfo(session.user.email);
  const themeResult = await sql`SELECT theme FROM users WHERE email = ${session.user.email}`;
  const currentTheme = ((themeResult[0]?.theme as string) || 'light') as 'light' | 'dark' | 'sunset' | 'ocean' | 'forest';

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium transition-colors shadow-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Retour au tableau de bord
        </Link>

        <div className="mb-8">
          <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900 mb-2`}>
            Paramètres
          </h1>
          <p className="text-gray-600 text-lg">Personnalisez votre expérience HabitFlow</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Paramètres du compte */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Paramètres du compte
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom d&apos;affichage
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Votre nom"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="votre@email.com"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fuseau horaire
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" disabled>
                  <option>Europe/Paris (UTC+1)</option>
                </select>
              </div>
              <button className="w-full py-3 bg-linear-to-r from-gray-300 to-gray-400 text-gray-600 rounded-xl cursor-not-allowed font-semibold">
                Sauvegarder (bientôt disponible)
              </button>
            </div>
          </div>

          {/* Paramètres de notification */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🔔</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Notifications
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-semibold text-gray-900">Rappels quotidiens</span>
                  <p className="text-sm text-gray-600">Recevez un rappel pour vos habitudes</p>
                </div>
                <div className="relative">
                  <input type="checkbox" disabled className="sr-only" />
                  <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-semibold text-gray-900">Notifications de défis</span>
                  <p className="text-sm text-gray-600">Alertes pour les défis entre amis</p>
                </div>
                <div className="relative">
                  <input type="checkbox" disabled className="sr-only" />
                  <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-semibold text-gray-900">Rapports hebdomadaires</span>
                  <p className="text-sm text-gray-600">Résumé de vos performances</p>
                </div>
                <div className="relative">
                  <input type="checkbox" disabled className="sr-only" />
                  <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres d'apparence */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🎨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Apparence
              </h2>
            </div>
            
            <ThemeSelector currentTheme={currentTheme} userLevel={userInfo.level} />
          </div>

          {/* Paramètres de confidentialité */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🔒</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Confidentialité
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-semibold text-gray-900">Profil public</span>
                  <p className="text-sm text-gray-600">Permettre aux autres de voir vos statistiques</p>
                </div>
                <div className="relative">
                  <input type="checkbox" disabled className="sr-only" />
                  <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-semibold text-gray-900">Partage de données</span>
                  <p className="text-sm text-gray-600">Aider à améliorer l&apos;application</p>
                </div>
                <div className="relative">
                  <input type="checkbox" disabled className="sr-only" />
                  <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message informatif */}
        <div className="mt-8 bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <Cog6ToothIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-800 mb-2">Paramètres en développement</h3>
              <p className="text-yellow-700">
                Les paramètres avancés, la personnalisation complète et la synchronisation 
                seront disponibles dans les prochaines versions de HabitFlow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}