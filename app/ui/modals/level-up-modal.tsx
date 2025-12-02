'use client';

import { useEffect, useState } from 'react';

interface LevelUpModalProps {
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ oldLevel, newLevel, onClose }: LevelUpModalProps) {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Fermer automatiquement après 4 secondes
    const timer = setTimeout(() => {
      setShowModal(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="relative">
        {/* Rayons de lumière en arrière-plan */}
        <div className="absolute inset-0 animate-light-rays">
          <div className="absolute inset-0 bg-gradient-radial from-yellow-400/30 to-transparent rounded-full"></div>
        </div>

        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: '24px',
              }}
            >
              {['⭐', '🎉', '✨', '🏆'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-level-up">
          {/* Badge de niveau */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-level-pulse">
              <div className="text-6xl font-bold text-white">
                {newLevel}
              </div>
            </div>
            {/* Étoiles autour du badge */}
            <div className="absolute -top-2 -right-2 text-3xl animate-star-twinkle">⭐</div>
            <div className="absolute -bottom-2 -left-2 text-3xl animate-star-twinkle delay-200">⭐</div>
          </div>

          {/* Texte */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-down">
            NIVEAU SUPÉRIEUR !
          </h2>
          <p className="text-xl text-gray-600 mb-4 animate-fade-in delay-200">
            Niveau {oldLevel} → Niveau {newLevel}
          </p>

          {/* Message de félicitations */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 animate-slide-up delay-300">
            <p className="text-lg font-semibold text-yellow-900 mb-1">
              🎊 Félicitations ! 🎊
            </p>
            <p className="text-sm text-yellow-800">
              Vous avez débloqué de nouvelles fonctionnalités !
            </p>
          </div>

          {/* Bouton de fermeture */}
          <button
            onClick={() => {
              setShowModal(false);
              setTimeout(onClose, 300);
            }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover-grow transition-all shadow-lg"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook pour gérer le passage de niveau
export function useLevelUp() {
  const [levelUpData, setLevelUpData] = useState<{
    oldLevel: number;
    newLevel: number;
  } | null>(null);

  const triggerLevelUp = (oldLevel: number, newLevel: number) => {
    setLevelUpData({ oldLevel, newLevel });
  };

  const closeLevelUp = () => {
    setLevelUpData(null);
  };

  return {
    levelUpData,
    triggerLevelUp,
    closeLevelUp,
  };
}
