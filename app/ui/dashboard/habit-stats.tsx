import { FireIcon, TrophyIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Données mockées pour l'instant
const mockStats = {
  currentStreak: 7,
  longestStreak: 23,
  totalCompleted: 156,
  weeklyAverage: 85,
  badges: [
    { name: 'Premier pas', icon: '🌟', earned: true },
    { name: 'Régularité', icon: '🔥', earned: true },
    { name: 'Persévérance', icon: '💪', earned: false },
  ]
};

export default function HabitStats() {
  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="rounded-lg bg-white p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes statistiques</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FireIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Série actuelle</p>
              <p className="text-xl font-bold text-gray-900">{mockStats.currentStreak} jours</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrophyIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Meilleure série</p>
              <p className="text-xl font-bold text-gray-900">{mockStats.longestStreak} jours</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total complétées</p>
              <p className="text-xl font-bold text-gray-900">{mockStats.totalCompleted}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Moyenne semaine</p>
              <p className="text-xl font-bold text-gray-900">{mockStats.weeklyAverage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-lg bg-white p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes badges</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {mockStats.badges.map((badge, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-3 rounded-lg border ${
                badge.earned 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <span className="text-2xl mb-1">{badge.icon}</span>
              <span className="text-xs text-center text-gray-700 font-medium">
                {badge.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-500">
            Voir tous les badges
          </button>
        </div>
      </div>

      {/* Graphique de la semaine */}
      <div className="rounded-lg bg-white p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cette semaine</h3>
        
        <div className="flex items-end justify-between h-20 gap-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
            const height = Math.random() * 80 + 20; // Mock data
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="w-6 bg-green-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-600">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}