'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserNotifications, markNotificationAsRead } from '@/app/lib/notification-actions';
import { getFriendChallengeById } from '@/app/lib/friend-actions';
import ChallengeDetailModal from '@/app/ui/friends/challenge-detail-modal';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

export default function NotificationsBox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState<number | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const result = await getUserNotifications(3); // Seulement 3 dernières
    if (result.success && result.notifications) {
      setNotifications(result.notifications as Notification[]);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    const result = await markNotificationAsRead(notificationId);
    if (result.success) {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      console.log('🔍 Clic sur notification:', notification);
      
      // Marquer comme lu
      if (!notification.isRead) {
        await handleMarkAsRead(notification.id);
      }

      // Si c'est un défi d'ami, ouvrir la modal
      if (notification.type === 'friend_challenge' && notification.link) {
        console.log('📧 Lien de notification:', notification.link);
        
        // Extraire l'ID du challenge depuis l'URL
        let challengeId: string | null = null;
        
        try {
          const url = new URL(notification.link, window.location.origin);
          challengeId = url.searchParams.get('challenge');
        } catch (urlError) {
          // Si le lien n'est pas une URL valide, essayer d'extraire l'ID directement
          const match = notification.link.match(/challenge[=\/](\d+)/);
          challengeId = match ? match[1] : null;
        }
        
        console.log('🆔 Challenge ID extrait:', challengeId);
        
        if (challengeId) {
          const result = await getFriendChallengeById(parseInt(challengeId));
          console.log('📦 Résultat getFriendChallengeById:', result);
          
          if (result.success && result.challenge) {
            setSelectedChallenge(result.challenge);
            setShowChallengeModal(true);
            console.log('✅ Modal ouverte avec challenge:', result.challenge);
          } else {
            console.error('❌ Erreur lors de la récupération du défi:', result.error);
            alert(`Erreur: ${result.error || 'Impossible de charger le défi'}`);
          }
        } else {
          console.error('❌ Aucun ID de challenge trouvé dans l&apos;URL');
          alert('Le lien du défi est invalide. Veuillez aller dans la page Amis pour voir vos défis.');
        }
      }
    } catch (error) {
      console.error('❌ Erreur dans handleNotificationClick:', error);
      alert('Erreur lors de l&apos;ouverture du défi');
    }
  };

  const handleCloseChallengeModal = () => {
    setShowChallengeModal(false);
    setSelectedChallenge(null);
    loadNotifications(); // Recharger les notifications
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      activity_late: '⏰',
      event_started: '🎉',
      event_ending: '⏳',
      challenge_completed: '🏆',
      badge_earned: '🏅',
      level_up: '⬆️',
      friend_request: '👋',
      friend_request_accepted: '🤝',
      friend_request_declined: '😢',
      friend_challenge: '⚔️',
      friend_challenge_accepted: '🎯',
      friend_challenge_completed: '🏆',
    };
    return icons[type] || '🔔';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days}j`;
    return new Date(date).toLocaleDateString('fr-FR');
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

  if (notifications.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de notifications
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-200">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">
            🔔 Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Link
          href="/dashboard/notifications"
          className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
        >
          Voir tout →
        </Link>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              relative p-4 rounded-xl border-2 transition-all hover:shadow-md
              ${!notification.isRead 
                ? 'bg-pink-50 border-pink-300' 
                : 'bg-gray-50 border-gray-200'
              }
            `}
          >
            {/* Indicateur non lu */}
            {!notification.isRead && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-500 rounded-full"></div>
            )}

            <div className="flex gap-3 pl-2">
              {/* Icône */}
              <div className="shrink-0 text-2xl">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <h3 className={`
                  text-sm font-semibold text-gray-800 mb-1
                  ${!notification.isRead ? 'font-bold' : ''}
                `}>
                  {notification.title}
                </h3>
                
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </span>

                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Lu
                      </button>
                    )}
                    {notification.link && (
                      <>
                        {notification.type === 'friend_challenge' ? (
                          <button
                            onClick={() => handleNotificationClick(notification)}
                            className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                          >
                            Voir →
                          </button>
                        ) : (
                          <Link
                            href={notification.link}
                            onClick={() => {
                              if (!notification.isRead) {
                                handleMarkAsRead(notification.id);
                              }
                            }}
                            className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                          >
                            Voir →
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer avec bouton voir tout */}
      <Link
        href="/dashboard/notifications"
        className="mt-4 block w-full text-center py-2 text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors rounded-lg hover:bg-pink-50"
      >
        Voir toutes les notifications
      </Link>

      {/* Modal de détail du défi */}
      {showChallengeModal && selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          onClose={handleCloseChallengeModal}
        />
      )}
    </div>
  );
}
