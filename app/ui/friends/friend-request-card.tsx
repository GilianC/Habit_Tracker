'use client';

import { useState } from 'react';
import { acceptFriendRequest, declineFriendRequest } from '@/app/lib/friend-actions';
import { useRouter } from 'next/navigation';

interface FriendRequest {
  id: number;
  requesterId: number;
  requesterName: string;
  requesterEmail: string;
  requesterLevel: number;
  createdAt: Date;
}

interface Props {
  request: FriendRequest;
}

export default function FriendRequestCard({ request }: Props) {
  const [processing, setProcessing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setProcessing(true);
    const result = await acceptFriendRequest(request.id);
    if (result.success) {
      setHidden(true);
      setTimeout(() => router.refresh(), 500);
    }
    setProcessing(false);
  };

  const handleDecline = async () => {
    setProcessing(true);
    const result = await declineFriendRequest(request.id);
    if (result.success) {
      setHidden(true);
      setTimeout(() => router.refresh(), 500);
    }
    setProcessing(false);
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="bg-theme-surface border-2 border-theme-border rounded-2xl p-5 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 bg-linear-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {request.requesterName.charAt(0).toUpperCase()}
          </div>
          
          {/* Info */}
          <div>
            <h3 className="text-lg font-bold text-theme-text">
              {request.requesterName}
            </h3>
            <p className="text-sm text-theme-text-muted">
              {request.requesterEmail}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-theme-text-muted">
                Niveau {request.requesterLevel}
              </span>
              <span className="text-xs text-theme-text-muted">•</span>
              <span className="text-xs text-theme-text-muted">
                {new Date(request.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            disabled={processing}
            className="px-4 py-2 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Accepter
          </button>
          <button
            onClick={handleDecline}
            disabled={processing}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
