import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Données mockées pour l'instant
const mockActivities = [
  { 
    id: '1', 
    name: 'Boire 2L d\'eau', 
    frequency: 'daily', 
    icon: '💧',
    color: '#3B82F6',
    createdAt: '2024-01-15'
  },
  { 
    id: '2', 
    name: 'Faire 30min d\'exercice', 
    frequency: 'daily', 
    icon: '🏃‍♂️',
    color: '#10B981',
    createdAt: '2024-01-10'
  },
  { 
    id: '3', 
    name: 'Lire 20 pages', 
    frequency: 'daily', 
    icon: '📚',
    color: '#8B5CF6',
    createdAt: '2024-01-08'
  },
  { 
    id: '4', 
    name: 'Appeler la famille', 
    frequency: 'weekly', 
    icon: '📞',
    color: '#F59E0B',
    createdAt: '2024-01-05'
  },
];

const frequencyLabels = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel'
};

export default function ActivitiesList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mockActivities.map((activity) => (
        <div
          key={activity.id}
          className="rounded-lg bg-white p-6 shadow-sm border hover:shadow-md transition-shadow"
        >
          {/* Header avec icône et actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${activity.color}20` }}
              >
                {activity.icon}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                <p className="text-sm text-gray-600">
                  {frequencyLabels[activity.frequency as keyof typeof frequencyLabels]}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                <PencilIcon className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cette semaine</span>
              <span className="font-medium">5/7 jours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: '71%',
                  backgroundColor: activity.color 
                }}
              ></div>
            </div>
          </div>

          {/* Date de création */}
          <div className="mt-4 text-xs text-gray-500">
            Créée le {new Date(activity.createdAt).toLocaleDateString('fr-FR')}
          </div>
        </div>
      ))}

      {/* Carte pour ajouter une nouvelle activité */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-green-400 transition-colors">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-2xl">➕</span>
        </div>
        <h3 className="font-medium text-gray-900 mb-1">Nouvelle activité</h3>
        <p className="text-sm text-gray-600">Ajoutez une nouvelle habitude à suivre</p>
      </div>
    </div>
  );
}