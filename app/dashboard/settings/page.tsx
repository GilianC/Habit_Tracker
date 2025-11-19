import { lusitana } from '@/app/ui/fonts';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
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
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Thème de couleur
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border-2 border-emerald-500 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 cursor-pointer">
                    <div className="w-full h-8 rounded-lg bg-white/20"></div>
                  </div>
                  <div className="p-3 border-2 border-gray-300 rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 cursor-pointer opacity-60">
                    <div className="w-full h-8 rounded-lg bg-white/20"></div>
                  </div>
                  <div className="p-3 border-2 border-gray-300 rounded-xl bg-linear-to-br from-purple-400 to-pink-500 cursor-pointer opacity-60">
                    <div className="w-full h-8 rounded-lg bg-white/20"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mode d&apos;affichage
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl" disabled>
                  <option>Mode clair</option>
                  <option>Mode sombre</option>
                  <option>Automatique</option>
                </select>
              </div>
            </div>
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