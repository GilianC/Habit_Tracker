'use client';

import { useState } from 'react';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { logActivity } from '@/app/lib/actions';

interface ActivityToggleProps {
  activityId: string;
  initialCompleted: boolean;
}

export default function ActivityToggle({ activityId, initialCompleted }: ActivityToggleProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const newState = !completed;
    setCompleted(newState);

    try {
      await logActivity(activityId, newState);
    } catch (error) {
      // Revenir à l'état précédent en cas d'erreur
      setCompleted(!newState);
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
        completed
          ? 'bg-green-500 text-white scale-110'
          : 'bg-gray-200 text-gray-400 hover:bg-pink-100 hover:text-pink-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {completed ? (
        <CheckCircleIcon className="w-7 h-7" />
      ) : (
        <ClockIcon className="w-7 h-7" />
      )}
    </button>
  );
}
