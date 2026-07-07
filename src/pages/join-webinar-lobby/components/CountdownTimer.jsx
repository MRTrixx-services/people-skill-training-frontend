import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CountdownTimer = ({ 
  sessionTitle = "Advanced React Patterns & Performance Optimization",
  instructor = "Dr. Sarah Johnson",
  duration = "90 minutes",
  startTime = new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
  onJoinEnabled
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((startTime - now) / 1000));
      setTimeRemaining(diff);
      
      // Enable join button 5 minutes before start
      const joinEnabled = diff <= 300 && diff >= 0;
      setCanJoin(joinEnabled);
      
      if (onJoinEnabled) {
        onJoinEnabled(joinEnabled);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, onJoinEnabled]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (timeRemaining === 0) return "Session is starting now!";
    if (timeRemaining <= 300) return "You can join the session now";
    if (timeRemaining <= 900) return "Session starting soon";
    return "Please wait for the session to begin";
  };

  const getStatusColor = () => {
    if (timeRemaining === 0) return "text-success";
    if (timeRemaining <= 300) return "text-primary";
    if (timeRemaining <= 900) return "text-warning";
    return "text-text-secondary";
  };

  return (
    <div className="bg-card rounded-xl p-6 lg:p-8 shadow-elevation-2 border border-border">
      {/* Session Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Video" size={32} color="white" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
          {sessionTitle}
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="User" size={16} />
            <span>Instructor: {instructor}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>Duration: {duration}</span>
          </div>
        </div>
      </div>
      {/* Countdown Display */}
      <div className="text-center mb-6">
        <div className="text-6xl lg:text-7xl font-mono font-bold text-primary mb-4">
          {formatTime(timeRemaining)}
        </div>
        <p className={`text-lg font-medium ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
      </div>
      {/* Session Details */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-text-secondary" />
            <span className="text-text-secondary">Start Time:</span>
            <span className="font-medium text-text-primary">
              {startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} className="text-text-secondary" />
            <span className="text-text-secondary">Platform:</span>
            <span className="font-medium text-text-primary">Zoom Webinar</span>
          </div>
        </div>
      </div>
      {/* Join Status Indicator */}
      <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${
        canJoin ? 'bg-success/10 text-success' : 'bg-muted text-text-secondary'
      }`}>
        <Icon 
          name={canJoin ? "CheckCircle" : "Clock"} 
          size={20} 
          className={canJoin ? "text-success" : "text-text-secondary"} 
        />
        <span className="font-medium">
          {canJoin ? "Ready to join" : "Waiting to join"}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;