'use client';

import { useState } from 'react';
import { logActivity } from '@/app/lib/actions';

interface QuickActivityButtonProps {
  activityId: string;
  activityName: string;
  activityIcon: string;
  activityColor: string;
  initialCompleted: boolean;
}

export default function QuickActivityButton({
  activityId,
  activityName,
  activityIcon,
  activityColor,
  initialCompleted
}: QuickActivityButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const newState = !completed;
    setCompleted(newState); // Optimistic update

    try {
      await logActivity(activityId, newState);
    } catch (error) {
      // Rollback on error
      setCompleted(!newState);
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`group flex flex-col items-center gap-2 p-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg border-2 ${
        completed 
          ? 'bg-green-50 border-green-300' 
          : 'bg-white border-gray-100'
      } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
    >
      <span 
        className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative ${
          completed ? 'opacity-75' : ''
        }`}
        style={{ backgroundColor: activityColor }}
      >
        {activityIcon}
        {completed && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
            ✓
          </span>
        )}
      </span>
      <span className={`text-xs font-medium text-center line-clamp-2 ${
        completed 
          ? 'text-green-700 line-through' 
          : 'text-gray-700 group-hover:text-gray-900'
      }`}>
        {activityName}
      </span>
    </button>
  );
}
