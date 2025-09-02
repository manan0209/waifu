import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  duration: number;
  timestamp: Date;
}

interface NotificationManagerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function NotificationManager({ notifications, onDismiss }: NotificationManagerProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(-3)); 
  }, [notifications]);

  useEffect(() => {
    
    const timers = visibleNotifications.map(notification => {
      if (notification.duration > 0) {
        return setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
      }
      return null;
    }).filter(Boolean);

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [visibleNotifications, onDismiss]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="notification-manager">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          style={{
            bottom: 50 + (index * 80),
            right: 10
          }}
        >
          <div className="notification-header">
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-title">{notification.title}</div>
            <button
              className="notification-close"
              onClick={() => onDismiss(notification.id)}
            >
              ✕
            </button>
          </div>
          <div className="notification-message">{notification.message}</div>
          <div className="notification-time">
            {notification.timestamp.toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}
