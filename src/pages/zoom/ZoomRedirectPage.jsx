import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ZoomRedirectPage = () => {
  const navigate = useNavigate();
  const { webinarId } = useParams();
  const location = useLocation();
  const [redirectStatus, setRedirectStatus] = useState('launching');
  const [countdown, setCountdown] = useState(10);

  // Get user preferences from previous page
  const userPreferences = location.state || {
    displayName: 'User',
    audioEnabled: false,
    videoEnabled: false
  };

  // Mock webinar data
  const webinar = {
    id: webinarId,
    title: "Advanced React Patterns and Performance Optimization",
    zoomMeetingId: "123-456-789",
    zoomJoinUrl: "https://zoom.us/j/123456789?pwd=example",
    zoomPassword: "webinar123"
  };

  useEffect(() => {
    // Simulate redirect process
    const timer = setTimeout(() => {
      setRedirectStatus('redirecting');
      
      // Try to launch Zoom
      launchZoom();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (redirectStatus === 'manual' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, redirectStatus]);

  const launchZoom = () => {
    try {
      // Construct Zoom URL with preferences
      let zoomUrl = webinar.zoomJoinUrl;
      
      // Add user preferences to URL
      const urlParams = new URLSearchParams();
      if (userPreferences.displayName) {
        urlParams.append('uname', userPreferences.displayName);
      }
      
      const finalUrl = `${zoomUrl}&${urlParams.toString()}`;
      
      // Try to redirect to Zoom
      window.location.href = finalUrl;
      
      // Set timer for manual join option
      setTimeout(() => {
        setRedirectStatus('manual');
      }, 5000);
      
    } catch (error) {
      console.error('Failed to launch Zoom:', error);
      setRedirectStatus('error');
    }
  };

  const handleManualJoin = () => {
    window.open(webinar.zoomJoinUrl, '_blank');
  };

  const handleDownloadZoom = () => {
    window.open('https://zoom.us/download', '_blank');
  };

  const handleReportIssue = () => {
    navigate('/support', {
      state: {
        issue: 'zoom_launch_failed',
        webinarId: webinar.id,
        userAgent: navigator.userAgent
      }
    });
  };

  const handleReturnToLobby = () => {
    navigate(`/webinar-lobby/${webinarId}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          {/* Zoom Branding */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {redirectStatus === 'launching' && 'Launching Webinar...'}
              {redirectStatus === 'redirecting' && 'Redirecting to Zoom...'}
              {redirectStatus === 'manual' && 'Having trouble joining?'}
              {redirectStatus === 'error' && 'Launch Failed'}
            </h1>
            <p className="text-muted-foreground">
              {redirectStatus === 'launching' && 'Please wait while we prepare your webinar session'}
              {redirectStatus === 'redirecting' && 'You will be redirected to Zoom automatically'}
              {redirectStatus === 'manual' && 'Try these alternative options to join the webinar'}
              {redirectStatus === 'error' && 'We encountered an issue launching the webinar'}
            </p>
          </div>

          {/* Loading Animation */}
          {(redirectStatus === 'launching' || redirectStatus === 'redirecting') && (
            <div className="mb-8">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-muted rounded-full animate-spin mx-auto">
                  <div className="absolute top-0 left-0 w-4 h-4 bg-primary rounded-full"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {redirectStatus === 'launching' ? 'Initializing session...' : 'Opening Zoom...'}
                </p>
              </div>
            </div>
          )}

          {/* Manual Join Options */}
          {redirectStatus === 'manual' && (
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-medium text-primary mb-2">Auto-join in {countdown} seconds</h3>
                <p className="text-sm text-primary/80">
                  If Zoom doesn't open automatically, use the manual options below
                </p>
              </div>

              <Button
                variant="default"
                onClick={handleManualJoin}
                iconName="ExternalLink"
                iconPosition="left"
                className="w-full"
              >
                Open Zoom Manually
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadZoom}
                iconName="Download"
                iconPosition="left"
                className="w-full"
              >
                Download Zoom App
              </Button>
            </div>
          )}

          {/* Error State */}
          {redirectStatus === 'error' && (
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                <Icon name="AlertTriangle" size={24} className="text-error mx-auto mb-2" />
                <h3 className="font-medium text-error mb-2">Unable to Launch Zoom</h3>
                <p className="text-sm text-error/80">
                  There was an issue opening the webinar. Please try the alternatives below.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="default"
                  onClick={handleManualJoin}
                  iconName="ExternalLink"
                  iconPosition="left"
                >
                  Manual Join
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownloadZoom}
                  iconName="Download"
                  iconPosition="left"
                >
                  Get Zoom App
                </Button>
              </div>
            </div>
          )}

          {/* Webinar Information */}
          <div className="border-t border-border pt-6 mb-6">
            <h3 className="font-medium text-foreground mb-3">Webinar Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Title:</span>
                <span className="text-foreground font-medium line-clamp-1">
                  {webinar.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Meeting ID:</span>
                <span className="text-foreground font-medium font-mono">
                  {webinar.zoomMeetingId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Display Name:</span>
                <span className="text-foreground font-medium">
                  {userPreferences.displayName}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {redirectStatus !== 'launching' && (
              <Button
                variant="outline"
                onClick={handleReturnToLobby}
                iconName="ArrowLeft"
                iconPosition="left"
                className="w-full"
              >
                Back to Lobby
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={handleReportIssue}
              iconName="AlertTriangle"
              iconPosition="left"
              className="w-full text-muted-foreground"
            >
              Report Issue
            </Button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Browser Requirements</h4>
            <p className="text-sm text-muted-foreground mb-3">
              For the best experience, use Chrome, Firefox, Safari, or Edge
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={12} />
                <span>Secure Connection</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={12} />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Only join webinars from trusted sources. If you're unsure about this webinar,{' '}
            <button 
              onClick={handleReportIssue}
              className="text-primary hover:underline"
            >
              report it here
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZoomRedirectPage;
