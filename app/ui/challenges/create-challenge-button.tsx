'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import CreateChallengeModal from './create-challenge-modal';

interface Activity {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CreateChallengeButtonProps {
  activities: Activity[];
}

export default function CreateChallengeButton({ activities }: CreateChallengeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl p-4 mb-6 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
      >
        <PlusIcon className="w-5 h-5" />
        Créer un nouveau défi
      </button>

      {isModalOpen && (
        <CreateChallengeModal
          activities={activities}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
