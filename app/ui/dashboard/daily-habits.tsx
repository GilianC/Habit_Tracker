import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

// Pour l'instant, données statiques. Plus tard, on récupérera depuis la DB
const mockHabits = [
  { id: '1', name: 'Boire 2L d\'eau', completed: false, icon: '💧' },
  { id: '2', name: 'Faire 30min d\'exercice', completed: true, icon: '🏃‍♂️' },
  { id: '3', name: 'Lire 20 pages', completed: false, icon: '📚' },
  { id: '4', name: 'Méditer 10min', completed: true, icon: '🧘‍♀️' },
  { id: '5', name: 'Prendre vitamines', completed: false, icon: '💊' },
];

export default function DailyHabits() {
  const completedCount = mockHabits.filter(habit => habit.completed).length;
  const totalCount = mockHabits.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Habitudes du jour</h2>
        <div className="text-sm text-gray-600">
          {completedCount}/{totalCount} complétées
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progression quotidienne</span>
          <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Liste des habitudes */}
      <div className="space-y-3">
        {mockHabits.map((habit) => (
          <div
            key={habit.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              habit.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <button
              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                habit.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {habit.completed && <CheckCircleSolid className="w-4 h-4" />}
            </button>
            
            <span className="text-xl">{habit.icon}</span>
            
            <span className={`flex-1 ${habit.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
              {habit.name}
            </span>
            
            {habit.completed ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : (
              <ClockIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {mockHabits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune habitude pour aujourd&apos;hui</p>
          <p className="text-sm">Commencez par en créer une&nbsp;!</p>
        </div>
      )}
    </div>
  );
}