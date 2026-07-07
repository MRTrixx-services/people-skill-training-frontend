import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SessionLobbyHeader = ({ 
  sessionTitle = 'Advanced React Patterns',
  sessionTime = '2:00 PM - 3:30 PM',
  timeRemaining = 300, // seconds until session starts
  onLeaveSession,
  onGetSupport
}) => {
  const [countdown, setCountdown] = useState(timeRemaining);
  const [systemStatus, setSystemStatus] = useState({
    camera: 'checking',
    microphone: 'checking',
    connection: 'good'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate system checks
    const checkSystems = async () => {
      setTimeout(() => {
        setSystemStatus({
          camera: 'good',
          microphone: 'warning',
          connection: 'good'
        });
      }, 2000);
    };

    checkSystems();
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return { icon: 'CheckCircle', color: 'text-success' };
      case 'warning': return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'error': return { icon: 'XCircle', color: 'text-error' };
      default: return { icon: 'Loader', color: 'text-text-secondary animate-spin' };
    }
  };

  const handleLeaveSession = () => {
    if (onLeaveSession) {
      onLeaveSession();
    } else {
      window.history?.back();
    }
  };

  const handleGetSupport = () => {
    if (onGetSupport) {
      onGetSupport();
    } else {
      // Default support action
      console.log('Opening support...');
    }
  };

  return (
    <header className="relative bg-surface border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Session Info */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Video" size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">{sessionTitle}</h1>
            <p className="text-sm text-text-secondary">{sessionTime}</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary">
              {formatTime(countdown)}
            </div>
            <p className="text-xs text-text-secondary">
              {countdown > 0 ? 'Session starts in' : 'Session starting...'}
            </p>
          </div>

          {/* System Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {Object.entries(systemStatus)?.map(([system, status]) => {
                const statusInfo = getStatusIcon(status);
                return (
                  <div key={system} className="flex items-center space-x-1" title={`${system}: ${status}`}>
                    <Icon 
                      name={statusInfo?.icon} 
                      size={16} 
                      className={statusInfo?.color} 
                    />
                    <span className="text-xs text-text-secondary capitalize">
                      {system}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetSupport}
              iconName="HelpCircle"
              iconPosition="left"
              iconSize={16}
              className="hidden sm:flex"
            >
              Support
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLeaveSession}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="text-text-secondary hover:text-error"
            >
              Leave
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile System Status */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center justify-center space-x-6">
          {Object.entries(systemStatus)?.map(([system, status]) => {
            const statusInfo = getStatusIcon(status);
            return (
              <div key={system} className="flex items-center space-x-2">
                <Icon 
                  name={statusInfo?.icon} 
                  size={16} 
                  className={statusInfo?.color} 
                />
                <span className="text-sm text-text-secondary capitalize">
                  {system}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Connection Quality Indicator */}
      <div className="absolute top-2 right-2">
        <div className="flex items-center space-x-1">
          <div className="w-1 h-3 bg-success rounded-full"></div>
          <div className="w-1 h-4 bg-success rounded-full"></div>
          <div className="w-1 h-5 bg-success rounded-full"></div>
          <div className="w-1 h-3 bg-muted rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default SessionLobbyHeader;