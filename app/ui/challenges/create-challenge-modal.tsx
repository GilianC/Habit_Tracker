'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createChallenge } from '@/app/lib/actions';

interface Activity {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CreateChallengeModalProps {
  activities: Activity[];
  onClose: () => void;
}

export default function CreateChallengeModal({ activities, onClose }: CreateChallengeModalProps) {
  const [formData, setFormData] = useState({
    activityId: activities[0]?.id || '',
    goalDays: 7,
    difficulty: 'easy',
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const difficultyOptions = [
    { value: 'easy', label: 'Facile', days: 7, stars: 1, color: 'text-green-600' },
    { value: 'medium', label: 'Moyen', days: 14, stars: 3, color: 'text-yellow-600' },
    { value: 'hard', label: 'Difficile', days: 30, stars: 5, color: 'text-red-600' }
  ];

  const selectedDifficulty = difficultyOptions.find(d => d.value === formData.difficulty) || difficultyOptions[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const form = new FormData();
      form.append('activityId', formData.activityId);
      form.append('goalDays', String(selectedDifficulty.days));
      form.append('difficulty', formData.difficulty);
      form.append('starReward', String(selectedDifficulty.stars));
      form.append('name', formData.name || `Défi ${selectedDifficulty.label}`);
      form.append('description', formData.description || `Complète ${selectedDifficulty.days} jours d'activité`);

      const result = await createChallenge(undefined, form);
      
      if (result) {
        setError(result);
        setIsSubmitting(false);
      } else {
        onClose();
      }
    } catch (err) {
      setError('Une erreur est survenue');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Créer un défi</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Sélection de l'activité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activité
            </label>
            <select
              value={formData.activityId}
              onChange={(e) => setFormData({ ...formData, activityId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            >
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.icon} {activity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulté */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Difficulté
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficultyOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: option.value })}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${formData.difficulty === option.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className={`text-lg font-bold ${option.color}`}>
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {option.days} jours
                  </div>
                  <div className="text-xs text-yellow-600 font-semibold mt-1">
                    ⭐ {option.stars} étoile{option.stars > 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Nom personnalisé (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du défi (optionnel)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`Défi ${selectedDifficulty.label}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Description personnalisée (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Complète ${selectedDifficulty.days} jours d'activité`}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Création...' : 'Créer le défi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
