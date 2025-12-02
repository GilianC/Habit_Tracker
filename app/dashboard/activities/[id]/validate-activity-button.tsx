'use client';

import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { logActivity } from '@/app/lib/actions';

interface ValidateActivityButtonProps {
  activityId: string;
  activityName: string;
  initialCompleted: boolean;
}

export default function ValidateActivityButton({ 
  activityId, 
  initialCompleted 
}: ValidateActivityButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const newState = !completed;
    
    // Optimistic update
    setCompleted(newState);
    
    try {
      await logActivity(activityId, newState);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      // Rollback en cas d'erreur
      setCompleted(!newState);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg ${
        completed
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
          : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
    >
      <div className="flex items-center justify-center gap-3">
        {completed ? (
          <>
            <CheckCircleIcon className="w-7 h-7" />
            <span>Complétée aujourd&apos;hui ✓</span>
          </>
        ) : (
          <>
            <XMarkIcon className="w-7 h-7" />
            <span>Marquer comme complétée</span>
          </>
        )}
      </div>
      {completed && (
        <div className="text-sm text-green-50 mt-2 opacity-90">
          Cliquez pour annuler
        </div>
      )}
    </button>
  );
}
