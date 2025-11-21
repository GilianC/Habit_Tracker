'use client';

import { StarIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { claimDailyChallenge } from '@/app/lib/actions';
import { useState } from 'react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: number;
  claimed: boolean;
  category: string;
}

interface DailyChallengesCardProps {
  challenges: {
    id: string;
    date: string;
    challenges: Challenge[];
  };
}

export default function DailyChallengesCard({ challenges }: DailyChallengesCardProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (challengeId: string) => {
    setClaimingId(challengeId);
    try {
      await claimDailyChallenge(challengeId);
      window.location.reload(); // Rafraîchir pour voir les nouvelles étoiles
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la réclamation de la récompense');
    } finally {
      setClaimingId(null);
    }
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
  };

  const isCompleted = (progress: number, target: number) => {
    return progress >= target;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Défis du {new Date(challenges.date).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.challenges.map((challenge) => {
            const completed = isCompleted(challenge.progress, challenge.target);
            const progressPercent = getProgressPercentage(challenge.progress, challenge.target);

            return (
              <div
                key={challenge.id}
                className={`rounded-xl p-5 border-2 transition-all ${
                  challenge.claimed
                    ? 'bg-green-50 border-green-300 opacity-75'
                    : completed
                    ? 'bg-yellow-50 border-yellow-400 shadow-lg'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{challenge.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>

                {/* Barre de progression */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-semibold text-gray-900">
                      {challenge.progress}/{challenge.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        completed
                          ? 'bg-linear-to-r from-green-400 to-emerald-500'
                          : 'bg-linear-to-r from-pink-400 to-rose-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Récompense et action */}
                <div className="flex items-center justify-between">
                  <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-300 text-yellow-800 font-semibold flex items-center gap-1">
                    <StarIcon className="w-4 h-4" />
                    {challenge.reward} étoile{challenge.reward > 1 ? 's' : ''}
                  </span>

                  {challenge.claimed ? (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-green-100 border border-green-300 text-green-800 font-semibold flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      Réclamé
                    </span>
                  ) : completed ? (
                    <button
                      onClick={() => handleClaim(challenge.id)}
                      disabled={claimingId === challenge.id}
                      className="text-sm bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg px-4 py-1.5 font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1"
                    >
                      {claimingId === challenge.id ? 'Réclamation...' : 'Récupérer'}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">En cours...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info supplémentaire */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Astuce :</span> Les défis journaliers se réinitialisent chaque jour à minuit.
          Complète tes activités avec les catégories correspondantes pour progresser automatiquement !
        </p>
      </div>
    </div>
  );
}
