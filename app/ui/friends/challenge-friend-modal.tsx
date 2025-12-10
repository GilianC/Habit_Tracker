'use client';

import { useEffect, useState } from 'react';
import { challengeFriend } from '@/app/lib/friend-challenge-actions';

interface Friend {
  id: number;
  name: string;
  email: string;
  level: number;
  stars: number;
  friendshipId: number;
}

interface Activity {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface ChallengeFriendModalProps {
  friend: Friend;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChallengeFriendModal({ friend, onClose, onSuccess }: ChallengeFriendModalProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Formulaire
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState(7);
  const [unit, setUnit] = useState('jours');
  const [durationDays, setDurationDays] = useState(7);
  const [starReward, setStarReward] = useState(20);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des activités:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Veuillez donner un titre au défi');
      return;
    }

    setSending(true);
    setError('');

    const result = await challengeFriend({
      friendId: friend.id,
      activityId: selectedActivity || undefined,
      title: title.trim(),
      description: description.trim() || undefined,
      targetValue,
      unit,
      starReward,
      durationDays,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(result.error || 'Erreur lors de la création du défi');
    }
    setSending(false);
  };

  const handleActivitySelect = (activityId: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activityId);
      if (!title) {
        setTitle(`Défi ${activity.name}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* En-tête */}
        <div className="bg-linear-to-r from-pink-500 to-rose-600 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">⚔️ Défier {friend.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-pink-100 text-sm mt-2">
            Créez un défi et affrontez votre ami !
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Défi envoyé !</h3>
              <p className="text-gray-600">
                {friend.name} recevra votre défi
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sélection d'activité (optionnel) */}
              {!loading && activities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lier à une activité (optionnel)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activities.slice(0, 6).map((activity) => (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => handleActivitySelect(activity.id)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                          selectedActivity === activity.id
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{activity.icon}</span>
                        <span>{activity.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Titre du défi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du défi *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Qui fera le plus de sport cette semaine ?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez les règles du défi..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors resize-none"
                  rows={2}
                  maxLength={250}
                />
              </div>

              {/* Objectif */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectif
                  </label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unité
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="jours">jours</option>
                    <option value="fois">fois</option>
                    <option value="heures">heures</option>
                    <option value="points">points</option>
                  </select>
                </div>
              </div>

              {/* Durée et Récompense */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (jours)
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value={3}>3 jours</option>
                    <option value={7}>1 semaine</option>
                    <option value={14}>2 semaines</option>
                    <option value={30}>1 mois</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Récompense ⭐
                  </label>
                  <select
                    value={starReward}
                    onChange={(e) => setStarReward(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value={10}>10 ⭐</option>
                    <option value={20}>20 ⭐</option>
                    <option value={30}>30 ⭐</option>
                    <option value={50}>50 ⭐</option>
                  </select>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Bouton Envoyer */}
              <button
                type="submit"
                disabled={sending || !title.trim()}
                className="w-full py-4 bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi du défi...
                  </>
                ) : (
                  <>
                    <span>⚔️</span>
                    Lancer le défi !
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
