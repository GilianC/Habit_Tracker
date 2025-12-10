'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recordFriendChallengeProgress } from '@/app/lib/friend-actions';

interface FriendChallengeActivityCardProps {
  challenge: {
    id: number;
    title: string;
    targetValue: number;
    unit: string;
    challengerProgress: number;
    challengedProgress: number;
    challenger: {
      id: number;
      name: string;
    };
    challenged: {
      id: number;
      name: string;
    };
    activity: {
      id: number;
      name: string;
      icon: string;
      color: string;
    };
  };
  currentUserId: number;
}

export default function FriendChallengeActivityCard({ challenge, currentUserId }: FriendChallengeActivityCardProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // Déterminer qui est qui
  const isChallenger = challenge.challenger.id === currentUserId;
  const myProgress = isChallenger ? challenge.challengerProgress : challenge.challengedProgress;
  const opponentProgress = isChallenger ? challenge.challengedProgress : challenge.challengerProgress;
  const opponentName = isChallenger ? challenge.challenged.name : challenge.challenger.name;

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await recordFriendChallengeProgress(challenge.id, 1);
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.refresh();
        }, 2000);
      } else {
        alert(result.error || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-pink-200 relative overflow-hidden">
      {/* Badge défi */}
      <div className="absolute top-3 right-3 px-3 py-1 bg-linear-to-r from-pink-500 to-rose-600 text-white text-xs font-bold rounded-full">
        ⚔️ DÉFI
      </div>

      <div className="flex items-start gap-4">
        {/* Icône de l'activité */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0"
          style={{ backgroundColor: challenge.activity.color }}
        >
          {challenge.activity.icon}
        </div>

        {/* Informations */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 mb-1">
            {challenge.activity.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {challenge.title}
          </p>
          
          {/* Adversaire */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-500">VS</span>
            <span className="text-sm font-semibold text-pink-600">
              {opponentName}
            </span>
          </div>

          {/* Progression */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600">Vous</span>
              <span className="font-bold text-gray-800">
                {myProgress} / {challenge.targetValue} {challenge.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-linear-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((myProgress / challenge.targetValue) * 100, 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600">{opponentName}</span>
              <span className="font-bold text-gray-800">
                {opponentProgress} / {challenge.targetValue} {challenge.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-linear-to-r from-pink-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((opponentProgress / challenge.targetValue) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            onClick={handleValidate}
            disabled={isValidating || showSuccess}
            className={`
              w-full py-3 px-4 rounded-xl font-bold transition-all duration-300
              ${showSuccess 
                ? 'bg-green-500 text-white' 
                : 'bg-linear-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:scale-105'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {showSuccess ? (
              <span className="flex items-center justify-center gap-2">
                ✅ Validé !
              </span>
            ) : isValidating ? (
              'Validation...'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>✅</span>
                <span>Valider aujourd&apos;hui</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Animation de succès */}
      {showSuccess && (
        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fadeIn">
          <div className="text-6xl animate-bounce-once">🎉</div>
        </div>
      )}
    </div>
  );
}
