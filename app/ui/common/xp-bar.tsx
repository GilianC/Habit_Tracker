'use client';

import { useEffect, useState } from 'react';

interface XpBarProps {
  currentXp: number;
  xpForNextLevel: number;
  level: number;
  className?: string;
  onLevelUp?: (newLevel: number) => void;
}

export function AnimatedXpBar({
  currentXp,
  xpForNextLevel,
  level,
  className = '',
  onLevelUp,
}: XpBarProps) {
  const [displayXp, setDisplayXp] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const percentage = Math.min((currentXp / xpForNextLevel) * 100, 100);

  useEffect(() => {
    // Vérifier le passage de niveau
    if (currentXp >= xpForNextLevel) {
      setIsLevelingUp(true);
      setTimeout(() => {
        onLevelUp?.(level + 1);
        setIsLevelingUp(false);
      }, 1500);
    }

    // Animation de remplissage
    const timer = setTimeout(() => {
      setDisplayXp(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentXp, xpForNextLevel, percentage, level, onLevelUp]);

  return (
    <div className={`w-full ${className}`}>
      {/* Label avec niveau */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Niveau {level}</span>
          {isLevelingUp && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full animate-bounce">
              Niveau supérieur !
            </span>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {currentXp} / {xpForNextLevel} XP
        </span>
      </div>

      {/* Barre de progression */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        {/* Barre de progression principale */}
        <div
          className={`
            absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out
            ${isLevelingUp ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-level-pulse' : 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'}
          `}
          style={{ width: `${displayXp}%` }}
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Particules d'étoiles quand proche du niveau suivant */}
        {percentage > 80 && !isLevelingUp && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-yellow-400 text-xs animate-star-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}

        {/* Effet de niveau complet */}
        {isLevelingUp && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white animate-bounce">
              🎉 NIVEAU SUPÉRIEUR ! 🎉
            </span>
          </div>
        )}
      </div>

      {/* Indicateur de progression en pourcentage */}
      {percentage > 0 && (
        <div className="mt-1 text-xs text-center text-gray-500 animate-fade-in">
          {Math.round(percentage)}% vers le prochain niveau
        </div>
      )}
    </div>
  );
}

// Animation de shimmer (brillance)
const shimmerStyle = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

// Injecter le style dans le document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerStyle;
  document.head.appendChild(style);
}

// Composant simplifié pour afficher les stats d'XP
interface XpDisplayProps {
  currentXp: number;
  totalXp: number;
  level: number;
}

export function XpDisplay({ currentXp, totalXp, level }: XpDisplayProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = currentXp;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [currentXp]);

  return (
    <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 shadow-md hover-lift">
      {/* Badge de niveau */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <div className="text-center">
            <div className="text-xs text-white font-semibold">Niv.</div>
            <div className="text-2xl text-white font-bold">{level}</div>
          </div>
        </div>
      </div>

      {/* Stats XP */}
      <div className="flex-1">
        <div className="text-sm text-gray-600 mb-1">Expérience totale</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 animate-number-count">
            {count.toLocaleString()}
          </span>
          <span className="text-lg text-gray-500">XP</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Total gagné: {totalXp.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}
