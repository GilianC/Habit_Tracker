'use client';

import { useState } from 'react';
import LevelRewardsModal from '@/app/ui/modals/level-rewards-modal';

interface LevelProgressBarProps {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
  xpNeeded: number;
  badgeIcon?: string;
  badgeTitle?: string;
}

export default function LevelProgressBar({
  level,
  currentXp,
  progress,
  xpNeeded,
  badgeIcon,
  badgeTitle
}: LevelProgressBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-linear-to-r from-pink-50 to-rose-50 rounded-2xl p-4 mb-4 hover:shadow-lg transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Niveau {level}</span>
            {badgeIcon && (
              <span className="text-lg group-hover:scale-110 transition-transform">{badgeIcon}</span>
            )}
          </div>
          <span className="text-xs text-gray-600">{currentXp} XP</span>
        </div>
        <div className="w-full bg-white rounded-full h-3 shadow-inner overflow-hidden">
          <div 
            className="bg-linear-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2 group-hover:text-pink-600 transition-colors">
          Plus que {xpNeeded} XP pour le niveau {level + 1}
          {badgeTitle && <span className="ml-1">• {badgeTitle}</span>}
          <span className="block text-pink-500 font-medium mt-1">👆 Clique pour voir les récompenses</span>
        </p>
      </button>

      <LevelRewardsModal
        currentLevel={level}
        currentXp={currentXp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
