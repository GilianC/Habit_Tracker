'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/app/lib/notification-actions';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsListProps {
  initialNotifications: Notification[];
}

export default function NotificationsList({ initialNotifications }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const router = useRouter();

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const handleMarkAsRead = async (notificationId: number) => {
    const result = await markNotificationAsRead(notificationId);
    if (result.success) {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsRead();
    if (result.success) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  const handleDelete = async (notificationId: number) => {
    const result = await deleteNotification(notificationId);
    if (result.success) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  };

  const handleDeleteAllRead = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications lues ?')) return;
    
    const readNotifications = notifications.filter(n => n.isRead);
    
    for (const notification of readNotifications) {
      await deleteNotification(notification.id);
    }
    
    setNotifications(notifications.filter(n => !n.isRead));
    router.refresh();
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      activity_late: '⏰',
      event_started: '🎉',
      event_ending: '⏳',
      challenge_completed: '🏆',
      badge_earned: '🏅',
      level_up: '⬆️',
    };
    return icons[type] || '🔔';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  return (
    <div className="space-y-4">
      {/* Barre d'actions */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Filtres */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === 'all'
                  ? 'bg-linear-to-r from-pink-500 to-rose-600 text-white shadow-md'
                  : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === 'unread'
                  ? 'bg-linear-to-r from-pink-500 to-rose-600 text-white shadow-md'
                  : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
              }`}
            >
              Non lues ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === 'read'
                  ? 'bg-linear-to-r from-pink-500 to-rose-600 text-white shadow-md'
                  : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
              }`}
            >
              Lues ({readCount})
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-linear-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm"
              >
                Tout marquer comme lu
              </button>
            )}
            {readCount > 0 && (
              <button
                onClick={handleDeleteAllRead}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:shadow-lg transition-all font-medium text-sm"
              >
                Supprimer les lues
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-pink-200 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg font-medium">
              {filter === 'all' && 'Aucune notification'}
              {filter === 'unread' && 'Aucune notification non lue'}
              {filter === 'read' && 'Aucune notification lue'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                bg-white rounded-2xl p-5 shadow-lg border transition-all hover:shadow-xl
                ${!notification.isRead 
                  ? 'border-pink-300 ring-2 ring-pink-200/50 bg-pink-50/30' 
                  : 'border-pink-200'
                }
              `}
            >
              <div className="flex gap-4">
                {/* Icône */}
                <div className="shrink-0">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md
                    ${!notification.isRead 
                      ? 'bg-linear-to-br from-pink-400 to-rose-500' 
                      : 'bg-gray-100'
                    }
                  `}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`
                      text-lg font-semibold text-gray-800
                      ${!notification.isRead ? 'font-bold' : ''}
                    `}>
                      {notification.title}
                    </h3>
                    
                    {!notification.isRead && (
                      <span className="shrink-0 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-3 text-sm">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(notification.createdAt)}
                    </span>

                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="px-3 py-1.5 text-sm text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg transition-all font-medium"
                        >
                          Marquer comme lu
                        </button>
                      )}
                      
                      {notification.link && (
                        <Link
                          href={notification.link}
                          onClick={() => {
                            if (!notification.isRead) {
                              handleMarkAsRead(notification.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-linear-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:shadow-md transition-all text-sm font-medium"
                        >
                          Voir →
                        </Link>
                      )}
                      
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="px-3 py-1.5 text-sm text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
