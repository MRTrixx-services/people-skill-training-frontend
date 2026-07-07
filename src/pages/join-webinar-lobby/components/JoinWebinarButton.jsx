import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JoinWebinarButton = ({ 
  canJoin = false, 
  systemStatus = 'checking',
  onJoinWebinar 
}) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinWebinar = async () => {
    if (!canJoin) return;
    
    setIsJoining(true);
    
    try {
      // Simulate joining process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onJoinWebinar) {
        onJoinWebinar();
      } else {
        // Default behavior - redirect to Zoom
        window.open('https://zoom.us/j/1234567890', '_blank');
      }
    } catch (error) {
      console.error('Failed to join webinar:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const getButtonVariant = () => {
    if (!canJoin) return 'outline';
    if (systemStatus === 'error') return 'destructive';
    if (systemStatus === 'warning') return 'warning';
    return 'default';
  };

  const getButtonText = () => {
    if (isJoining) return 'Joining...';
    if (!canJoin) return 'Please Wait';
    if (systemStatus === 'error') return 'Fix Issues to Join';
    return 'Join Webinar';
  };

  const getStatusMessage = () => {
    if (isJoining) return 'Connecting to webinar session...';
    if (!canJoin) return 'Join button will be enabled 5 minutes before the session starts';
    if (systemStatus === 'error') return 'Please resolve technical issues before joining';
    if (systemStatus === 'warning') return 'Some issues detected, but you can still join';
    return 'All systems ready! Click to join the webinar';
  };

  const getStatusIcon = () => {
    if (isJoining) return 'Loader';
    if (!canJoin) return 'Clock';
    if (systemStatus === 'error') return 'AlertTriangle';
    if (systemStatus === 'warning') return 'AlertCircle';
    return 'Video';
  };

  const getStatusColor = () => {
    if (isJoining) return 'text-primary';
    if (!canJoin) return 'text-text-secondary';
    if (systemStatus === 'error') return 'text-error';
    if (systemStatus === 'warning') return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-elevation-2 border border-border">
      {/* Status Indicator */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
          canJoin && systemStatus === 'good' ? 'bg-success/10 text-success' :
          canJoin && systemStatus === 'warning' ? 'bg-warning/10 text-warning' :
          systemStatus === 'error'? 'bg-error/10 text-error' : 'bg-muted text-text-secondary'
        }`}>
          <Icon 
            name={getStatusIcon()} 
            size={16} 
            className={`${getStatusColor()} ${isJoining ? 'animate-spin' : ''}`} 
          />
          <span className="text-sm font-medium">
            {getStatusMessage()}
          </span>
        </div>
      </div>

      {/* Join Button */}
      <div className="text-center mb-6">
        <Button
          variant={getButtonVariant()}
          size="lg"
          onClick={handleJoinWebinar}
          disabled={!canJoin || isJoining || systemStatus === 'error'}
          loading={isJoining}
          iconName={isJoining ? undefined : "Video"}
          iconPosition="left"
          iconSize={20}
          className="px-8 py-4 text-lg font-semibold min-w-48"
        >
          {getButtonText()}
        </Button>
      </div>

      {/* Additional Actions */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="TestTube"
            iconPosition="left"
            iconSize={16}
            disabled={isJoining}
          >
            Test Audio/Video
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            disabled={isJoining}
            onClick={() => window.open('https://zoom.us/download', '_blank')}
          >
            Download Zoom
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          fullWidth
          iconName="HelpCircle"
          iconPosition="left"
          iconSize={16}
          disabled={isJoining}
        >
          Need Help Joining?
        </Button>
      </div>

      {/* Connection Info */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-text-secondary mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium mb-1">Connection Details:</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Meeting ID:</span>
                <span className="font-mono">123-456-7890</span>
              </div>
              <div className="flex justify-between">
                <span>Passcode:</span>
                <span className="font-mono">ReactLMS</span>
              </div>
              <div className="flex justify-between">
                <span>Dial-in:</span>
                <span>+1-234-567-8900</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="mt-4 text-center">
        <p className="text-xs text-text-secondary">
          Having trouble? Contact support at{' '}
          <a href="mailto:support@eduportal.com" className="text-primary hover:underline">
            support@eduportal.com
          </a>{' '}
          or call{' '}
          <a href="tel:+1234567890" className="text-primary hover:underline">
            +1 (234) 567-8900
          </a>
        </p>
      </div>
    </div>
  );
};

export default JoinWebinarButton;