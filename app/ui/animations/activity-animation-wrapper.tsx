'use client';

import { useState } from 'react';
import { ChallengeValidation } from './challenge-animations';
import { StarCollection } from './star-animations';

interface ActivityCompletionAnimationProps {
  activityName: string;
  points: number;
  onComplete?: () => void;
}

export function useActivityAnimation() {
  const [animationData, setAnimationData] = useState<{
    activityName: string;
    points: number;
    position?: { x: number; y: number };
  } | null>(null);
  const [showStars, setShowStars] = useState(false);

  const triggerCompletion = (
    activityName: string,
    points: number,
    element?: HTMLElement
  ) => {
    // Récupérer la position de l'élément pour l'animation
    const position = element
      ? {
          x: element.getBoundingClientRect().left + element.offsetWidth / 2,
          y: element.getBoundingClientRect().top + element.offsetHeight / 2,
        }
      : undefined;

    setAnimationData({ activityName, points, position });
    setShowStars(true);

    // Fermer après un délai
    setTimeout(() => {
      setShowStars(false);
    }, 1500);
  };

  const closeAnimation = () => {
    setAnimationData(null);
  };

  return {
    animationData,
    showStars,
    triggerCompletion,
    closeAnimation,
  };
}

interface ActivityAnimationContainerProps {
  animationData: {
    activityName: string;
    points: number;
    position?: { x: number; y: number };
  } | null;
  showStars: boolean;
  onClose: () => void;
}

export function ActivityAnimationContainer({
  animationData,
  showStars,
  onClose,
}: ActivityAnimationContainerProps) {
  if (!animationData) return null;

  return (
    <>
      {/* Validation du défi */}
      <ChallengeValidation
        challengeName={animationData.activityName}
        points={animationData.points}
        onClose={onClose}
      />

      {/* Animation d'étoiles */}
      {showStars && (
        <StarCollection
          count={Math.min(Math.floor(animationData.points / 20), 5)}
          position={animationData.position}
          onComplete={() => {}}
        />
      )}
    </>
  );
}
