import { useState, useEffect, useCallback, useRef } from 'react';

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
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    setVisibleNotifications(notifications.slice(-3)); 
  }, [notifications]);

  // Create auto-dismiss timers for new notifications
  useEffect(() => {
    const timers = timersRef.current;
    
    visibleNotifications.forEach(notification => {
      // Only create timer if it doesn't exist and has a positive duration
      if (notification.duration > 0 && !timers.has(notification.id)) {
        console.log('Creating timer for notification:', notification.id, 'duration:', notification.duration);
        const timer = setTimeout(() => {
          console.log('Auto-dismissing notification:', notification.id);
          onDismiss(notification.id);
          timers.delete(notification.id);
        }, notification.duration);
        
        timers.set(notification.id, timer);
      }
    });

    // Clean up timers for notifications that are no longer visible
    const visibleIds = new Set(visibleNotifications.map(n => n.id));
    timers.forEach((timer, id) => {
      if (!visibleIds.has(id)) {
        console.log('Clearing timer for removed notification:', id);
        clearTimeout(timer);
        timers.delete(id);
      }
    });

    // Cleanup on unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      timers.clear();
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
