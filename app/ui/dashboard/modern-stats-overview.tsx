import { ArrowUpIcon, ArrowDownIcon, FireIcon } from '@heroicons/react/24/outline';

// Données mockées avec nouvelles métriques modernes
const stats = [
  {
    id: '1',
    title: 'Habitudes complétées',
    value: '67',
    unit: '/89',
    change: '+12%',
    trending: 'up',
    icon: '✅',
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-50 to-rose-50',
    description: 'Cette semaine'
  },
  {
    id: '2',
    title: 'Streak le plus long',
    value: '23',
    unit: 'jours',
    change: '+3',
    trending: 'up',
    icon: '🔥',
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-100',
    description: 'Méditation matinale'
  },
  {
    id: '3',
    title: 'Taux de réussite',
    value: '78',
    unit: '%',
    change: '+5%',
    trending: 'up',
    icon: '📈',
    gradient: 'from-fuchsia-500 to-pink-500',
    bgGradient: 'from-fuchsia-50 to-pink-50',
    description: 'Moyenne mensuelle'
  },
  {
    id: '4',
    title: 'Jours consécutifs',
    value: '12',
    unit: 'jours',
    change: '-2',
    trending: 'down',
    icon: '🗓️',
    gradient: 'from-pink-600 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-50',
    description: 'Record actuel'
  },
];

const weeklyProgress = [
  { day: 'L', completed: 8, total: 10, percentage: 80 },
  { day: 'M', completed: 9, total: 10, percentage: 90 },
  { day: 'M', completed: 7, total: 10, percentage: 70 },
  { day: 'J', completed: 10, total: 10, percentage: 100 },
  { day: 'V', completed: 6, total: 10, percentage: 60 },
  { day: 'S', completed: 8, total: 10, percentage: 80 },
  { day: 'D', completed: 5, total: 10, percentage: 50 },
];

export default function ModernStatsOverview() {
  return (
    <div className="space-y-6">
      {/* Stats principales avec design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
          >
            {/* Background gradient subtil */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}></div>
            
            {/* Contenu */}
            <div className="relative z-10">
              {/* Header avec icône */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{stat.icon}</div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trending === 'up' 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trending === 'up' ? (
                    <ArrowUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              
              {/* Valeur principale */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                  <span className="text-lg text-gray-600">{stat.unit}</span>
                </div>
              </div>
              
              {/* Titre et description */}
              <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphique de progression hebdomadaire */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Progression de la semaine</h2>
          <p className="text-gray-600">Aperçu de vos habitudes des 7 derniers jours</p>
        </div>
        
        {/* Graphique en barres moderne */}
        <div className="flex items-end justify-between gap-4 h-40">
          {weeklyProgress.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Barre de progression */}
              <div className="relative w-full bg-gray-200 rounded-full h-32 mb-3 overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-pink-500 to-rose-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ height: `${day.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
                
                {/* Pourcentage sur la barre */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                  {day.percentage}%
                </div>
              </div>
              
              {/* Labels */}
              <div className="text-center">
                <div className="font-bold text-gray-900">{day.day}</div>
                <div className="text-xs text-gray-600">{day.completed}/{day.total}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Légende */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"></div>
            Habitudes complétées
          </div>
        </div>
      </div>

      {/* Section insights avec design moderne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meilleure catégorie */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center text-2xl shadow-md">
              🏆
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Catégorie champion</h3>
              <p className="text-gray-600 text-sm">Votre meilleure performance</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-rose-700 mb-1">Bien-être</div>
            <div className="text-rose-600">94% de réussite cette semaine</div>
          </div>
        </div>

        {/* Zone d'amélioration */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-md">
              💪
            </div>
            <div>
              <h3 className="font-bold text-gray-900">À améliorer</h3>
              <p className="text-gray-600 text-sm">Concentrez vos efforts ici</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-fuchsia-700 mb-1">Sport</div>
            <div className="text-fuchsia-600">58% de réussite - On peut faire mieux !</div>
          </div>
        </div>
      </div>
    </div>
  );
}