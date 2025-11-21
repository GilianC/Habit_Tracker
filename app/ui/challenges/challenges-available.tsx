'use client';

import { StarIcon, FireIcon } from '@heroicons/react/24/outline';
import { acceptChallenge } from '@/app/lib/actions';
import { useState } from 'react';

interface Challenge {
  id: string;
  name: string;
  description: string;
  goal_type: string;
  goal_value: number;
  star_reward: number;
  difficulty: string;
  icon: string;
  category: string;
}

interface ChallengesAvailableProps {
  challenges: Challenge[];
}

export default function ChallengesAvailable({ challenges }: ChallengesAvailableProps) {
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

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

  const handleAccept = async (challengeId: string) => {
    setAcceptingId(challengeId);
    try {
      await acceptChallenge(challengeId);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'acceptation du défi');
    } finally {
      setAcceptingId(null);
    }
  };

  if (challenges.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
        <FireIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tous les défis acceptés !
        </h3>
        <p className="text-gray-600">
          Tu as accepté tous les défis disponibles. Continue comme ça ! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {challenges.map(challenge => (
        <div
          key={challenge.id}
          className="bg-white rounded-xl p-5 shadow-sm border-2 border-gray-200 hover:border-pink-300 hover:shadow-md transition-all"
        >
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">{challenge.icon}</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{challenge.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Objectif:</span>
              <span className="font-semibold text-gray-900">
                {getGoalText(challenge.goal_type, challenge.goal_value)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                {getDifficultyLabel(challenge.difficulty)}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold flex items-center gap-1">
                <StarIcon className="w-3 h-3" />
                {challenge.star_reward} étoile{challenge.star_reward > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleAccept(challenge.id)}
            disabled={acceptingId === challenge.id}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg py-2 font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {acceptingId === challenge.id ? 'Acceptation...' : 'Accepter le défi'}
          </button>
        </div>
      ))}
    </div>
  );
}
