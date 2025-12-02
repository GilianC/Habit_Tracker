'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type NotificationType = 'success' | 'levelup' | 'star' | 'challenge';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function AnimatedNotification({
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="animate-checkmark text-green-600 text-3xl font-bold">
            ✓
          </div>
        );
      case 'levelup':
        return (
          <div className="animate-level-up text-yellow-500 text-3xl">
            🏆
          </div>
        );
      case 'star':
        return (
          <div className="animate-star-burst text-yellow-400 text-3xl">
            ⭐
          </div>
        );
      case 'challenge':
        return (
          <div className="animate-trophy-shine text-purple-600 text-3xl">
            🎯
          </div>
        );
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'levelup':
        return 'bg-yellow-50 border-yellow-200';
      case 'star':
        return 'bg-blue-50 border-blue-200';
      case 'challenge':
        return 'bg-purple-50 border-purple-200';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-notification">
      <div
        className={`
          ${getBgColor()}
          border-2 rounded-lg shadow-lg p-4 max-w-sm
          hover-lift
        `}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 animate-fade-in">
              {title}
            </h3>
            <p className="text-sm text-gray-700 animate-fade-in delay-100">
              {message}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook personnalisé pour gérer les notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<
    Array<NotificationProps & { id: string }>
  >([]);

  const addNotification = (notification: NotificationProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}

// Composant pour afficher toutes les notifications
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <AnimatedNotification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
