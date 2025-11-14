import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

// Données mockées avec design moderne
const todayHabits = [
  { id: '1', name: 'Méditation matinale', icon: '🧘‍♀️', completed: true, streak: 12, category: 'Bien-être' },
  { id: '2', name: 'Boire 2L d\'eau', icon: '💧', completed: true, streak: 7, category: 'Santé' },
  { id: '3', name: '30min d\'exercice', icon: '🏃‍♂️', completed: false, streak: 5, category: 'Sport' },
  { id: '4', name: 'Lire 20 pages', icon: '📚', completed: false, streak: 3, category: 'Développement' },
  { id: '5', name: 'Écrire dans mon journal', icon: '✍️', completed: true, streak: 8, category: 'Personnel' },
  { id: '6', name: 'Prendre mes vitamines', icon: '💊', completed: false, streak: 15, category: 'Santé' },
];

const categoryColors = {
  'Bien-être': 'from-purple-500 to-pink-500',
  'Santé': 'from-emerald-500 to-teal-500',
  'Sport': 'from-orange-500 to-red-500',
  'Développement': 'from-blue-500 to-indigo-500',
  'Personnel': 'from-yellow-500 to-orange-500',
};

export default function ModernDailyHabits() {
  const completedCount = todayHabits.filter(habit => habit.completed).length;
  const totalCount = todayHabits.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      {/* Header avec progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Mes habitudes du jour</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{completedCount}/{totalCount}</div>
            <div className="text-sm text-gray-600">complétées</div>
          </div>
        </div>

        {/* Barre de progression moderne */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="absolute right-0 -top-8 text-lg font-bold text-emerald-600">
            {progressPercentage}%
          </div>
        </div>
      </div>

      {/* Liste des habitudes avec design cards */}
      <div className="space-y-3">
        {todayHabits.map((habit) => (
          <div
            key={habit.id}
            className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 border ${
              habit.completed 
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Checkbox moderne */}
              <button
                className={`relative flex-shrink-0 w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  habit.completed
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-500 shadow-lg'
                    : 'border-gray-300 hover:border-emerald-400 hover:shadow-md'
                }`}
              >
                {habit.completed && (
                  <CheckCircleSolid className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </button>
              
              {/* Icône de l'habitude */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl">
                {habit.icon}
              </div>
              
              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-lg ${habit.completed ? 'text-emerald-800' : 'text-gray-900'}`}>
                  {habit.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                    categoryColors[habit.category as keyof typeof categoryColors]
                  } text-white`}>
                    {habit.category}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    🔥 {habit.streak} jours
                  </span>
                </div>
              </div>
              
              {/* Status */}
              <div className="flex-shrink-0">
                {habit.completed ? (
                  <div className="text-emerald-600">
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <ClockIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Effet de survol */}
            {!habit.completed && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300 rounded-xl"></div>
            )}
          </div>
        ))}
      </div>

      {/* Message motivant */}
      {progressPercentage === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-bold">Félicitations ! Journée parfaite !</div>
        </div>
      )}
    </div>
  );
}