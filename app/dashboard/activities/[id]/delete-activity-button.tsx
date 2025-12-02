'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteActivity } from '@/app/lib/actions';

interface DeleteActivityButtonProps {
  activityId: string;
  userId: string;
  activityName: string;
}

export default function DeleteActivityButton({ activityId, userId, activityName }: DeleteActivityButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteActivity(activityId, userId);
      router.push('/dashboard/activities');
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Une erreur est survenue lors de la suppression');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full bg-red-500 text-white rounded-xl py-3 font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <TrashIcon className="w-5 h-5" />
        Supprimer l&apos;activité
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
        <p className="text-red-800 font-semibold text-center mb-2">
          ⚠️ Confirmer la suppression
        </p>
        <p className="text-red-700 text-sm text-center">
          Voulez-vous vraiment supprimer &quot;{activityName}&quot; ?
          <br />
          Cette action est irréversible.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 text-white rounded-xl py-3 font-semibold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Suppression...
            </>
          ) : (
            <>
              <TrashIcon className="w-5 h-5" />
              Confirmer
            </>
          )}
        </button>
      </div>
    </div>
  );
}
