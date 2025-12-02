'use client';

import { FireIcon, CheckCircleIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import { completeChallenge } from '@/app/lib/actions';
import { useState } from 'react';
import { Challenge } from '@/app/lib/definitions';

interface ChallengesListProps {
  challenges: Challenge[];
}

export default function ChallengesList({ challenges }: ChallengesListProps) {
  const [completingId, setCompletingId] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return difficulty;
    }
  };

  const handleComplete = async (challengeId: string) => {
    setCompletingId(challengeId);
    try {
      await completeChallenge(challengeId);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setCompletingId(null);
    }
  };

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  if (challenges.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <FireIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun défi pour le moment
        </h3>
        <p className="text-gray-600">
          Crée ton premier défi pour commencer à gagner des étoiles !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Défis actifs */}
      {activeChallenges.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-pink-600" />
            Défis en cours ({activeChallenges.length})
          </h2>
          <div className="space-y-3">
            {activeChallenges.map(challenge => {
              const goalDays = challenge.goal_days || 1;
              const progressPercent = (challenge.progress / goalDays) * 100;
              const isCompletable = challenge.progress >= goalDays;

              return (
                <div
                  key={challenge.id}
                  className="bg-white rounded-xl p-5 shadow-sm border-2 border-pink-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{challenge.activity_icon}</span>
                        <h3 className="font-bold text-gray-900">{challenge.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                          {getDifficultyLabel(challenge.difficulty)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold flex items-center gap-1">
                          <StarIcon className="w-3 h-3" />
                          {challenge.star_reward} étoile{challenge.star_reward > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        Progression: {challenge.progress}/{challenge.goal_days} jours
                      </span>
                      <span className="font-bold text-pink-600">{progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Bouton compléter */}
                  {isCompletable && (
                    <button
                      onClick={() => handleComplete(challenge.id)}
                      disabled={completingId === challenge.id}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg py-2 font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      {completingId === challenge.id ? 'Validation...' : 'Récupérer mes étoiles !'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Défis complétés */}
      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            Défis complétés ({completedChallenges.length})
          </h2>
          <div className="space-y-3">
            {completedChallenges.map(challenge => (
              <div
                key={challenge.id}
                className="bg-white rounded-xl p-5 shadow-sm border-2 border-green-200 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{challenge.activity_icon}</span>
                      <h3 className="font-bold text-gray-900">{challenge.name}</h3>
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-semibold">
                        ✓ Complété
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        +{challenge.star_reward} étoile{challenge.star_reward > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
