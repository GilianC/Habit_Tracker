'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptFriendChallenge, declineFriendChallenge } from '@/app/lib/friend-actions';
import ChallengeAcceptedModal from './challenge-accepted-modal';

interface ChallengeDetailModalProps {
  challenge: {
    id: number;
    title: string;
    description: string | null;
    targetValue: number;
    unit: string;
    starReward: number;
    durationDays: number;
    startDate: Date;
    endDate: Date;
    status: string;
    challenger: {
      id: number;
      name: string;
      email: string;
      level: number;
    };
    challenged: {
      id: number;
      name: string;
      email: string;
      level: number;
    };
    activity: {
      id: number;
      name: string;
      icon: string;
      color: string;
    } | null;
  };
  onClose: () => void;
}

export default function ChallengeDetailModal({ challenge, onClose }: ChallengeDetailModalProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const result = await acceptFriendChallenge(challenge.id);
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        alert('Erreur lors de l&apos;acceptation du défi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l&apos;acceptation du défi');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!confirm('Êtes-vous sûr de vouloir refuser ce défi ?')) {
      return;
    }

    setIsDeclining(true);
    try {
      const result = await declineFriendChallenge(challenge.id);
      if (result.success) {
        onClose();
        router.refresh();
      } else {
        alert('Erreur lors du refus du défi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du refus du défi');
    } finally {
      setIsDeclining(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
    router.push('/dashboard/challenges');
  };

  // Calculer les jours restants
  const now = new Date();
  const endDate = new Date(challenge.endDate);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  if (showSuccessModal) {
    return (
      <ChallengeAcceptedModal
        challengeTitle={challenge.title}
        challengerName={challenge.challenger.name}
        targetValue={challenge.targetValue}
        unit={challenge.unit}
        starReward={challenge.starReward}
        durationDays={challenge.durationDays}
        onClose={handleCloseSuccessModal}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header avec icône */}
        <div className="relative bg-linear-to-br from-pink-500 to-rose-600 p-8 rounded-t-3xl text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
          
          <div className="text-center">
            <div className="text-6xl mb-3">⚔️</div>
            <h2 className="text-3xl font-bold mb-2">Défi reçu !</h2>
            <p className="text-white/90">
              {challenge.challenger.name} vous lance un défi
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          {/* Titre du défi */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {challenge.title}
            </h3>
            {challenge.description && (
              <p className="text-gray-600">
                {challenge.description}
              </p>
            )}
          </div>

          {/* Activité */}
          {challenge.activity && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: challenge.activity.color + '20' }}
                >
                  {challenge.activity.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Activité</p>
                  <p className="font-semibold text-gray-800">
                    {challenge.activity.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Objectif */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 text-center">
              <p className="text-sm text-blue-600 mb-1">Objectif</p>
              <p className="text-2xl font-bold text-blue-900">
                {challenge.targetValue} {challenge.unit}
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200 text-center">
              <p className="text-sm text-yellow-600 mb-1">Récompense</p>
              <p className="text-2xl font-bold text-yellow-900">
                {challenge.starReward} ⭐
              </p>
            </div>
          </div>

          {/* Durée */}
          <div className="mb-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Durée du défi</p>
                <p className="font-semibold text-purple-900">
                  {challenge.durationDays} jours ({daysRemaining} jours restants)
                </p>
              </div>
              <div className="text-3xl">⏱️</div>
            </div>
          </div>

          {/* Info challenger */}
          <div className="mb-8 p-4 bg-linear-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Lancé par</p>
                <p className="font-bold text-gray-800 text-lg">
                  {challenge.challenger.name}
                </p>
                <p className="text-sm text-gray-500">
                  Niveau {challenge.challenger.level}
                </p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </div>

          {/* Boutons d'action */}
          {challenge.status === 'pending' && (
            <div className="flex gap-4">
              <button
                onClick={handleDecline}
                disabled={isDeclining || isAccepting}
                className="flex-1 py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeclining ? 'Refus...' : '❌ Refuser'}
              </button>
              <button
                onClick={handleAccept}
                disabled={isAccepting || isDeclining}
                className="flex-1 py-4 px-6 bg-linear-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAccepting ? 'Acceptation...' : '✅ Accepter le défi'}
              </button>
            </div>
          )}

          {challenge.status === 'active' && (
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200 text-center">
              <p className="text-green-800 font-semibold">
                ✅ Défi déjà accepté !
              </p>
              <button
                onClick={() => router.push('/dashboard/challenges')}
                className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Voir mes défis
              </button>
            </div>
          )}

          {challenge.status === 'declined' && (
            <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200 text-center">
              <p className="text-red-800 font-semibold">
                ❌ Défi refusé
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
