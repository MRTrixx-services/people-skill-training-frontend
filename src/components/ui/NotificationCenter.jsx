import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ notifications = [], onNotificationClick, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'webinar':
        return 'Video';
      case 'payment':
        return 'CreditCard';
      case 'system':
        return 'Settings';
      case 'reminder':
        return 'Clock';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'webinar':
        return 'text-primary';
      case 'payment':
        return 'text-success';
      case 'system':
        return 'text-warning';
      case 'reminder':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`relative ${className}`} ref={notificationRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal z-[1010] animate-slide-in-from-top">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-medium text-popover-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications?.length > 0 ? (
              notifications?.slice(0, 5)?.map((notification) => (
                <button
                  key={notification?.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full p-3 text-left hover:bg-muted transition-colors duration-150 border-b border-border last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${getNotificationColor(notification?.type)}`}>
                      <Icon name={getNotificationIcon(notification?.type)} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-popover-foreground truncate">
                          {notification?.title}
                        </p>
                        {!notification?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification?.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {notification?.time}
                        </p>
                        {notification?.priority === 'high' && (
                          <span className="text-xs bg-error text-error-foreground px-2 py-0.5 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <Icon name="Bell" size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications?.length > 5 && (
            <div className="p-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => {
                  // Navigate to full notifications page
                  setIsOpen(false);
                }}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;