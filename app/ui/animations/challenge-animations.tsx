'use client';

import { useState, useEffect } from 'react';

interface ChallengeValidationProps {
  challengeName: string;
  points: number;
  onClose: () => void;
}

export function ChallengeValidation({
  challengeName,
  points,
  onClose,
}: ChallengeValidationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-scale-in">
        {/* Checkmark animé */}
        <div className="mb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center animate-success-pulse">
            <svg
              className="w-12 h-12 text-white animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Titre */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-slide-down">
          Défi validé ! 🎉
        </h2>

        {/* Nom du défi */}
        <p className="text-lg text-gray-700 mb-4 animate-fade-in delay-100">
          {challengeName}
        </p>

        {/* Points gagnés */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 animate-reward-drop delay-200">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl animate-coin-flip">🪙</span>
            <span className="text-2xl font-bold text-yellow-600">
              +{points} XP
            </span>
          </div>
        </div>

        {/* Étoiles décoratives */}
        <div className="absolute top-4 left-4 text-2xl animate-star-burst delay-100">⭐</div>
        <div className="absolute top-4 right-4 text-2xl animate-star-burst delay-200">⭐</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl animate-star-burst delay-300">✨</div>
      </div>
    </div>
  );
}

// Composant pour l'animation de carte de défi qui se retourne
interface ChallengeCardProps {
  children: React.ReactNode;
  isCompleted?: boolean;
  onClick?: () => void;
}

export function AnimatedChallengeCard({
  children,
  isCompleted = false,
  onClick,
}: ChallengeCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (!isCompleted) {
      setIsFlipping(true);
      setTimeout(() => {
        setIsFlipping(false);
        onClick?.();
      }, 600);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative cursor-pointer
        ${isFlipping ? 'animate-card-flip' : ''}
        ${isCompleted ? 'opacity-75' : 'hover-lift'}
        transition-all duration-300
      `}
    >
      {children}
      
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center animate-checkmark">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour la barre de progression de défi avec animation
interface ChallengeProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ChallengeProgressBar({
  current,
  total,
  label,
}: ChallengeProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const percentage = Math.min((current / total) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{label}</span>
          <span className="font-semibold">
            {current} / {total}
          </span>
        </div>
      )}
      
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${displayProgress}%`,
          }}
        >
          {percentage === 100 && (
            <div className="h-full w-full animate-success-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}
