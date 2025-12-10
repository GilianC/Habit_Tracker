'use client';

import { useState } from 'react';
import { acceptFriendChallenge, declineFriendChallenge } from '@/app/lib/friend-challenge-actions';
import { useRouter } from 'next/navigation';
import ChallengeAcceptedModal from './challenge-accepted-modal';

interface FriendChallenge {
  id: number;
  challengerId: number;
  challengedId: number;
  title: string;
  description: string | null;
  targetValue: number;
  unit: string;
  starReward: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  challenger: {
    id: number;
    name: string;
    level: number;
  };
  activity: {
    id: number;
    name: string;
    icon: string;
    color: string;
  } | null;
}

interface Props {
  challenge: FriendChallenge;
}

export default function FriendChallengeCard({ challenge }: Props) {
  const [processing, setProcessing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setProcessing(true);
    const result = await acceptFriendChallenge(challenge.id);
    if (result.success) {
      setShowSuccessModal(true);
    }
    setProcessing(false);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setHidden(true);
    router.push('/dashboard/challenges');
  };

  const handleDecline = async () => {
    setProcessing(true);
    const result = await declineFriendChallenge(challenge.id);
    if (result.success) {
      setHidden(true);
      setTimeout(() => router.refresh(), 500);
    }
    setProcessing(false);
  };

  if (hidden) {
    return null;
  }

  const durationDays = challenge.startDate && challenge.endDate
    ? Math.ceil((new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 7;

  return (
    <div className="bg-theme-surface border-2 border-theme-border rounded-2xl p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Avatar du challenger */}
          <div className="w-14 h-14 bg-linear-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
            {challenge.challenger.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Info du défi */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⚔️</span>
              <h3 className="text-lg font-bold text-theme-text">
                {challenge.title}
              </h3>
            </div>
            <p className="text-sm text-theme-text-muted mb-2">
              <span className="font-medium">{challenge.challenger.name}</span> vous défie !
            </p>
            
            {challenge.description && (
              <p className="text-sm text-theme-text-muted mb-2">
                {challenge.description}
              </p>
            )}

            {/* Détails du défi */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {challenge.activity && (
                <div className="flex items-center gap-1 px-3 py-1 bg-theme-bg rounded-lg">
                  <span>{challenge.activity.icon}</span>
                  <span className="text-xs font-medium text-theme-text">
                    {challenge.activity.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 px-3 py-1 bg-theme-bg rounded-lg">
                <span className="text-xs font-medium text-theme-text">
                  🎯 {challenge.targetValue} {challenge.unit}
                </span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-theme-bg rounded-lg">
                <span className="text-xs font-medium text-theme-text">
                  📅 {durationDays} jours
                </span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-lg">
                <span className="text-xs font-bold text-yellow-700">
                  ⭐ +{challenge.starReward}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleAccept}
          disabled={processing}
          className="flex-1 px-4 py-3 bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Accepter le défi !
        </button>
        <button
          onClick={handleDecline}
          disabled={processing}
          className="px-4 py-3 bg-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Refuser
        </button>
      </div>

      {/* Modal de succès */}
      {showSuccessModal && (
        <ChallengeAcceptedModal
          challengeTitle={challenge.title}
          challengerName={challenge.challenger.name}
          targetValue={challenge.targetValue}
          unit={challenge.unit}
          starReward={challenge.starReward}
          durationDays={durationDays}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
