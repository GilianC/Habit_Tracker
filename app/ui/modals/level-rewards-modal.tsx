'use client';

import { useState } from 'react';
import { XMarkIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { getUnlockedRewards, getNextReward, type LevelReward } from '@/app/lib/level-rewards';

interface LevelRewardsModalProps {
  currentLevel: number;
  currentXp: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function LevelRewardsModal({ currentLevel, currentXp, isOpen, onClose }: LevelRewardsModalProps) {
  if (!isOpen) return null;

  const rewards = getUnlockedRewards(currentLevel);
  const nextReward = getNextReward(currentLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-pink-500 to-rose-600 p-6 text-white z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              🏆
            </div>
            <div>
              <h2 className="text-2xl font-bold">Récompenses par niveau</h2>
              <p className="text-pink-100 text-sm">Niveau actuel: {currentLevel} ({currentXp} XP)</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Next Reward */}
          {nextReward && (
            <div className="mb-6 bg-linear-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{nextReward.icon}</span>
                <div>
                  <h3 className="font-bold text-amber-900">🎯 Prochaine récompense</h3>
                  <p className="text-sm text-amber-700">Niveau {nextReward.level} - {nextReward.title}</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 mb-2">{nextReward.description}</p>
              <ul className="space-y-1">
                {nextReward.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                    <LockClosedIcon className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* All Rewards */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Toutes les récompenses</h3>
            {rewards.map((reward: LevelReward) => (
              <div
                key={reward.level}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  reward.unlocked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${!reward.unlocked && 'grayscale'}`}>
                      {reward.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">Niveau {reward.level}</h4>
                        {reward.unlocked && (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                        {!reward.unlocked && (
                          <LockClosedIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700">{reward.title}</p>
                      <p className="text-xs text-gray-500">{reward.description}</p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-1 mt-3">
                  {reward.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`text-sm flex items-start gap-2 ${
                        reward.unlocked ? 'text-green-700' : 'text-gray-500'
                      }`}
                    >
                      {reward.unlocked ? (
                        <CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0" />
                      ) : (
                        <LockClosedIcon className="w-4 h-4 mt-0.5 shrink-0" />
                      )}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
