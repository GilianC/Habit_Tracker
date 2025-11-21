'use client';

import { StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { completeChallenge } from '@/app/lib/actions';
import { useState } from 'react';

interface UserChallenge {
  user_challenge_id: string;
  challenge_name: string;
  challenge_description: string;
  goal_type: string;
  goal_value: number;
  star_reward: number;
  icon: string;
  difficulty: string;
  progress: number;
  status: string;
  completed_at: string | null;
}

interface ChallengesInProgressProps {
  challenges: UserChallenge[];
}

export default function ChallengesInProgress({ challenges }: ChallengesInProgressProps) {
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

  const getGoalText = (goal_type: string, goal_value: number) => {
    if (goal_type === 'consecutive_days') {
      return `${goal_value} jours consécutifs`;
    } else if (goal_type === 'total_completions') {
      return `${goal_value} complétions`;
    }
    return `${goal_value}`;
  };

  const getProgressPercentage = (progress: number, goal: number) => {
    return Math.min((progress / goal) * 100, 100);
  };

  const handleComplete = async (userChallengeId: string) => {
    setCompletingId(userChallengeId);
    try {
      await completeChallenge(userChallengeId);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la récupération des étoiles');
    } finally {
      setCompletingId(null);
    }
  };

  const inProgress = challenges.filter(c => c.status === 'in_progress');
  const completed = challenges.filter(c => c.status === 'completed');

  if (challenges.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
        <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun défi accepté
        </h3>
        <p className="text-gray-600">
          Accepte un défi pour commencer à gagner des étoiles ! ⭐
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Défis en cours */}
      {inProgress.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">En cours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgress.map(challenge => {
              const progressPercent = getProgressPercentage(challenge.progress, challenge.goal_value);
              const isComplete = challenge.progress >= challenge.goal_value;

              return (
                <div
                  key={challenge.user_challenge_id}
                  className="bg-white rounded-xl p-5 shadow-sm border-2 border-gray-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-4xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{challenge.challenge_name}</h4>
                      <p className="text-xs text-gray-600">{challenge.challenge_description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                      {getDifficultyLabel(challenge.difficulty)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-semibold text-gray-900">
                        {challenge.progress}/{challenge.goal_value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isComplete ? 'bg-linear-to-r from-green-400 to-emerald-500' : 'bg-linear-to-r from-pink-400 to-rose-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold flex items-center gap-1">
                      <StarIcon className="w-3 h-3" />
                      {challenge.star_reward} étoile{challenge.star_reward > 1 ? 's' : ''}
                    </span>
                    {isComplete && (
                      <button
                        onClick={() => handleComplete(challenge.user_challenge_id)}
                        disabled={completingId === challenge.user_challenge_id}
                        className="text-sm bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg px-4 py-1.5 font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        {completingId === challenge.user_challenge_id ? 'Validation...' : 'Récupérer mes étoiles'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Défis terminés */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Terminés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map(challenge => (
              <div
                key={challenge.user_challenge_id}
                className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 shadow-sm border-2 border-green-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{challenge.challenge_name}</h4>
                    <p className="text-xs text-gray-600">
                      {challenge.completed_at && new Date(challenge.completed_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {getGoalText(challenge.goal_type, challenge.goal_value)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 font-semibold flex items-center gap-1">
                    <StarIcon className="w-3 h-3" />
                    +{challenge.star_reward}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
