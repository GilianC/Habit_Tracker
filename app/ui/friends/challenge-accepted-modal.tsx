'use client';

import { useEffect } from 'react';

interface ChallengeAcceptedModalProps {
  challengeTitle: string;
  challengerName: string;
  targetValue: number;
  unit: string;
  starReward: number;
  durationDays: number;
  onClose: () => void;
}

export default function ChallengeAcceptedModal({
  challengeTitle,
  challengerName,
  targetValue,
  unit,
  starReward,
  durationDays,
  onClose,
}: ChallengeAcceptedModalProps) {
  useEffect(() => {
    // Fermer automatiquement après 3 secondes
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn">
        {/* En-tête avec gradient */}
        <div className="bg-linear-to-r from-green-500 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
          {/* Animation de confettis */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-confetti-1"></div>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-pink-300 rounded-full animate-confetti-2"></div>
            <div className="absolute top-0 left-3/4 w-2 h-2 bg-blue-300 rounded-full animate-confetti-3"></div>
          </div>

          {/* Icône de succès animée */}
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-once">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">🎉 Défi accepté !</h2>
          <p className="text-green-100 text-sm">
            Le combat commence maintenant
          </p>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Titre du défi */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-3">
              <span className="text-2xl">⚔️</span>
              <span className="font-bold text-gray-800">{challengeTitle}</span>
            </div>
            <p className="text-gray-600 text-sm">
              Vous affrontez <span className="font-bold text-pink-600">{challengerName}</span>
            </p>
          </div>

          {/* Détails du défi */}
          <div className="bg-linear-to-br from-pink-50 to-rose-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Objectif</span>
              <span className="font-bold text-gray-800">
                🎯 {targetValue} {unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Durée</span>
              <span className="font-bold text-gray-800">
                📅 {durationDays} jours
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Récompense</span>
              <span className="font-bold text-yellow-600 flex items-center gap-1">
                ⭐ +{starReward} étoiles
              </span>
            </div>
          </div>

          {/* Message de motivation */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 italic">
              &quot;Que le meilleur gagne !&quot;
            </p>
          </div>

          {/* Bouton */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Voir mes défis
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes confetti1 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(300px) rotate(360deg); opacity: 0; }
        }
        @keyframes confetti2 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(350px) rotate(-360deg); opacity: 0; }
        }
        @keyframes confetti3 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(320px) rotate(180deg); opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-bounce-once {
          animation: bounceOnce 0.6s ease-out;
        }
        .animate-confetti-1 {
          animation: confetti1 2s ease-out infinite;
        }
        .animate-confetti-2 {
          animation: confetti2 2.2s ease-out infinite;
        }
        .animate-confetti-3 {
          animation: confetti3 1.8s ease-out infinite;
        }
      `}</style>
    </div>
  );
}
