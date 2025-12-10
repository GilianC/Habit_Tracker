'use client';

import { useEffect, useState } from 'react';
import { getFriends, getPendingFriendRequests, acceptFriendRequest, declineFriendRequest } from '@/app/lib/friend-actions';
import AddFriendModal from './add-friend-modal';
import ChallengeFriendModal from './challenge-friend-modal';

interface Friend {
  id: number;
  name: string;
  email: string;
  level: number;
  stars: number;
  friendshipId: number;
}

interface FriendRequest {
  id: number;
  requesterId: number;
  requesterName: string;
  requesterEmail: string;
  requesterLevel: number;
  createdAt: Date;
}

export default function FriendsBox() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [friendsResult, requestsResult] = await Promise.all([
      getFriends(),
      getPendingFriendRequests(),
    ]);

    if (friendsResult.success && friendsResult.friends) {
      setFriends(friendsResult.friends);
    }
    if (requestsResult.success && requestsResult.requests) {
      setPendingRequests(requestsResult.requests);
    }
    setLoading(false);
  };

  const handleAcceptRequest = async (requestId: number) => {
    setProcessingRequest(requestId);
    const result = await acceptFriendRequest(requestId);
    if (result.success) {
      await loadData();
    }
    setProcessingRequest(null);
  };

  const handleDeclineRequest = async (requestId: number) => {
    setProcessingRequest(requestId);
    const result = await declineFriendRequest(requestId);
    if (result.success) {
      setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    }
    setProcessingRequest(null);
  };

  const handleChallengeFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowChallengeModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-200 animate-pulse">
        <div className="h-6 bg-pink-100 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-pink-50 rounded-xl"></div>
          <div className="h-16 bg-pink-50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-200">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">
              👥 Mes Amis
            </h2>
            {friends.length > 0 && (
              <span className="px-2 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full">
                {friends.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-linear-to-r from-pink-500 to-rose-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
        </div>

        {/* Demandes en attente */}
        {pendingRequests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              🔔 Demandes en attente ({pendingRequests.length})
            </h3>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-pink-50 border-2 border-pink-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                      {request.requesterName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{request.requesterName}</p>
                      <p className="text-xs text-gray-500">Niveau {request.requesterLevel}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={processingRequest === request.id}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      disabled={processingRequest === request.id}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liste des amis */}
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">👋</div>
            <p className="text-gray-600 mb-2">Pas encore d&apos;amis</p>
            <p className="text-sm text-gray-500">
              Ajoutez des amis pour les défier !
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.slice(0, 5).map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-pink-200 hover:bg-pink-50 transition-all cursor-pointer group"
                onClick={() => handleChallengeFriend(friend)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{friend.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Niv. {friend.level}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {friend.stars}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-pink-600 font-medium">Défier →</span>
                </div>
              </div>
            ))}
            {friends.length > 5 && (
              <p className="text-center text-sm text-gray-500 mt-2">
                + {friends.length - 5} autre{friends.length - 5 > 1 ? 's' : ''} ami{friends.length - 5 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal Ajouter un ami */}
      {showAddModal && (
        <AddFriendModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadData();
          }}
        />
      )}

      {/* Modal Défier un ami */}
      {showChallengeModal && selectedFriend && (
        <ChallengeFriendModal
          friend={selectedFriend}
          onClose={() => {
            setShowChallengeModal(false);
            setSelectedFriend(null);
          }}
          onSuccess={() => {
            setShowChallengeModal(false);
            setSelectedFriend(null);
          }}
        />
      )}
    </>
  );
}
