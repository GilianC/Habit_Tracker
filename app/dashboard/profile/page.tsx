import { lusitana } from '@/app/ui/fonts';
import { ChartBarIcon, TrophyIcon, FireIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900 mb-2`}>
            Mon profil et statistiques
          </h1>
          <p className="text-gray-600 text-lg">Suivez vos performances et vos accomplissements</p>
        </div>

        {/* Statistiques principales */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <FireIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Série actuelle</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">7 jours</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Record personnel</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">23 jours</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total complétées</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Taux de réussite</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique et badges */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Progression cette semaine</h2>
            <div className="flex items-end justify-between h-40 gap-3">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
                const heights = [80, 60, 90, 75, 40, 95, 70];
                const colors = [
                  'from-emerald-400 to-teal-500',
                  'from-blue-400 to-indigo-500', 
                  'from-purple-400 to-pink-500',
                  'from-orange-400 to-red-500',
                  'from-yellow-400 to-orange-500',
                  'from-green-400 to-emerald-500',
                  'from-indigo-400 to-purple-500'
                ];
                return (
                  <div key={index} className="flex flex-col items-center gap-3 flex-1">
                    <div className="relative w-full">
                      <div
                        className={`w-full bg-gradient-to-t ${colors[index]} rounded-t-lg shadow-lg relative overflow-hidden`}
                        style={{ height: `${heights[index]}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges modernes */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes accomplissements</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Premier pas', icon: '🌟', earned: true, gradient: 'from-yellow-400 to-orange-500' },
                { name: 'Régularité', icon: '🔥', earned: true, gradient: 'from-orange-400 to-red-500' },
                { name: 'Persévérance', icon: '💪', earned: false, gradient: 'from-blue-400 to-indigo-500' },
                { name: 'Champion', icon: '🏆', earned: false, gradient: 'from-purple-400 to-pink-500' },
                { name: 'Marathonien', icon: '🎯', earned: false, gradient: 'from-emerald-400 to-teal-500' },
                { name: 'Motivateur', icon: '🤝', earned: false, gradient: 'from-indigo-400 to-purple-500' },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${
                    badge.earned 
                      ? `bg-gradient-to-br ${badge.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105` 
                      : 'bg-gray-100 border-gray-300 opacity-60 hover:opacity-80'
                  }`}
                >
                  {badge.earned && (
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-300"></div>
                  )}
                  <span className="text-3xl mb-2 relative z-10">{badge.icon}</span>
                  <span className={`text-sm font-semibold text-center relative z-10 ${
                    badge.earned ? 'text-white' : 'text-gray-600'
                  }`}>
                    {badge.name}
                  </span>
                  {badge.earned && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message informatif modernisé */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-blue-800 mb-2">Fonctionnalités avancées à venir</h3>
              <p className="text-blue-700">
                Des statistiques détaillées, des graphiques interactifs et des analyses personnalisées 
                seront disponibles une fois la base de données complètement intégrée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}