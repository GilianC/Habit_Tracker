'use client';

import { useEffect, useState } from 'react';

interface StarCollectionProps {
  count: number;
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export function StarCollection({ count, position, onComplete }: StarCollectionProps) {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: position?.x || window.innerWidth / 2,
      y: position?.y || window.innerHeight / 2,
    }));
    setStars(newStars);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [count, position, onComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-collect-star"
          style={{
            left: star.x,
            top: star.y,
            animationDelay: `${star.id * 0.1}s`,
          }}
        >
          <div className="text-5xl">⭐</div>
        </div>
      ))}
    </div>
  );
}

// Composant d'affichage de compteur d'étoiles avec animation
interface StarCounterProps {
  current: number;
  previous: number;
  className?: string;
}

export function StarCounter({ current, previous, className = '' }: StarCounterProps) {
  const [displayCount, setDisplayCount] = useState(previous);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (current !== previous) {
      setIsAnimating(true);
      
      // Animation de comptage
      const diff = current - previous;
      const duration = 1000;
      const steps = Math.min(Math.abs(diff), 50);
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const newValue = Math.floor(previous + diff * progress);
        setDisplayCount(newValue);

        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayCount(current);
          setIsAnimating(false);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [current, previous]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`text-4xl ${
          isAnimating ? 'animate-star-burst' : 'animate-star-twinkle'
        }`}
      >
        ⭐
      </span>
      <span
        className={`text-3xl font-bold text-yellow-600 ${
          isAnimating ? 'animate-number-count' : ''
        }`}
      >
        {displayCount}
      </span>
    </div>
  );
}

// Composant de trainée d'étoile
export function StarTrail() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-star-trail"
          style={{
            top: `${20 + i * 15}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: '2s',
          }}
        />
      ))}
    </div>
  );
}
