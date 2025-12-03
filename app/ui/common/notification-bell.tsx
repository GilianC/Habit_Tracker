'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/app/lib/notification-actions';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    // Recharger les notifications toutes les 2 minutes
    const interval = setInterval(loadNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const result = await getUserNotifications(20);
    if (result.success && result.notifications) {
      setNotifications(result.notifications as Notification[]);
      setUnreadCount(result.unreadCount || 0);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    const result = await markNotificationAsRead(notificationId);
    if (result.success) {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsRead();
    if (result.success) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleDelete = async (notificationId: number) => {
    const result = await deleteNotification(notificationId);
    if (result.success) {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    }
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

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <div className="relative">
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-theme-surface transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6 text-theme-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Badge de compteur */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel des notifications */}
          <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-theme-surface border border-theme-border rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-theme-border">
              <h3 className="text-lg font-semibold text-theme-text">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-theme-accent hover:text-theme-accent/80 transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Liste des notifications */}
            <div className="overflow-y-auto max-h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-accent"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-theme-text-muted">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-center">Aucune notification</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      group relative p-4 border-b border-theme-border transition-colors
                      ${!notification.isRead ? 'bg-theme-accent/5' : 'hover:bg-theme-surface/50'}
                    `}
                  >
                    <div className="flex gap-3">
                      {/* Icône */}
                      <div className="shrink-0 text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`
                            text-sm font-medium text-theme-text
                            ${!notification.isRead ? 'font-semibold' : ''}
                          `}>
                            {notification.title}
                          </h4>
                          
                          {/* Bouton supprimer */}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-theme-text-muted hover:text-red-500"
                            aria-label="Supprimer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <p className="mt-1 text-sm text-theme-text-muted">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-theme-text-muted">
                            {formatDate(notification.createdAt)}
                          </span>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-theme-accent hover:text-theme-accent/80 transition-colors"
                              >
                                Marquer comme lu
                              </button>
                            )}
                            
                            {notification.link && (
                              <Link
                                href={notification.link}
                                onClick={() => {
                                  setIsOpen(false);
                                  if (!notification.isRead) {
                                    handleMarkAsRead(notification.id);
                                  }
                                }}
                                className="text-xs text-theme-accent hover:text-theme-accent/80 transition-colors"
                              >
                                Voir →
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Indicateur non lu */}
                        {!notification.isRead && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-theme-accent rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-theme-border bg-theme-surface">
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-sm text-theme-accent hover:text-theme-accent/80 transition-colors font-medium"
                >
                  Voir toutes les notifications →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
