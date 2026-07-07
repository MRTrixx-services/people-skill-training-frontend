import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const ServerErrorPage = () => {
  const navigate = useNavigate();
  const [errorTime] = useState(new Date().toISOString());
  const [refreshCount, setRefreshCount] = useState(0);

  // Generate error ID for support reference[7]
  const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;

  const handleRefreshPage = () => {
    setRefreshCount(prev => prev + 1);
    window.location.reload();
  };

  const handleContactSupport = () => {
    navigate('/support', {
      state: {
        issue: 'server_error',
        errorId: errorId,
        timestamp: errorTime,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-primary hover:text-primary/80"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Video" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">PeopleSkillTraining</span>
            </button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              iconName="Home"
              iconPosition="left"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full text-center">
          {/* Error Notification[7] */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-error/10 rounded-full mb-6">
              <Icon name="AlertTriangle" size={64} className="text-error" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Something Went Wrong
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're experiencing technical difficulties on our end. Our team has been notified and is working to fix this issue.
            </p>

            {/* Technical error information[7] */}
            <div className="bg-card border border-border rounded-lg p-4 max-w-md mx-auto mb-8">
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Error Code: <span className="font-mono text-foreground">500</span></div>
                <div>Reference ID: <span className="font-mono text-foreground">{errorId}</span></div>
                <div>Time: <span className="font-mono text-foreground">
                  {new Date(errorTime).toLocaleString()}
                </span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* User Actions[7] */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">What You Can Do</h2>

              <div className="space-y-4">
                {/* Refresh page button */}
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="RefreshCw" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Try Refreshing the Page</h3>
                      <p className="text-sm text-muted-foreground">
                        Sometimes a simple refresh can resolve temporary issues
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    onClick={handleRefreshPage}
                    iconName="RefreshCw"
                    iconPosition="left"
                    className="w-full"
                  >
                    Refresh Page {refreshCount > 0 && `(${refreshCount})`}
                  </Button>
                </div>

                {/* Try again later message */}
                <div className="p-6 bg-warning/10 border border-warning/20 rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="Clock" size={24} className="text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Wait a Few Minutes</h3>
                      <p className="text-sm text-muted-foreground">
                        Our servers might be experiencing high traffic. Try again in a few minutes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact support */}
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="MessageSquare" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Contact Support</h3>
                      <p className="text-sm text-muted-foreground">
                        If the problem persists, our support team can help
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleContactSupport}
                    iconName="HelpCircle"
                    iconPosition="left"
                    className="w-full"
                  >
                    Get Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Information[7] */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">System Status</h2>

              <div className="space-y-4">
                {/* System status link */}
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="Activity" size={24} className="text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Check System Status</h3>
                      <p className="text-sm text-muted-foreground">
                        View real-time status of all our services
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://status.peopleskilltraining.com', '_blank')}
                    iconName="ExternalLink"
                    iconPosition="left"
                    className="w-full"
                  >
                    System Status Page
                  </Button>
                </div>

                {/* Estimated resolution time */}
                <div className="p-6 bg-muted rounded-xl">
                  <h3 className="font-semibold text-foreground mb-3">Expected Resolution</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minor Issues:</span>
                      <span className="text-foreground">15-30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Major Issues:</span>
                      <span className="text-foreground">1-4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Emergency Issues:</span>
                      <span className="text-foreground">ASAP</span>
                    </div>
                  </div>
                </div>

                {/* Alternative access methods */}
                <div className="p-6 bg-card border border-border rounded-xl">
                  <h3 className="font-semibold text-foreground mb-4">Alternative Options</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/mobile-app')}
                      iconName="Smartphone"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Try Mobile App
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/offline-resources')}
                      iconName="Download"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Access Offline Resources
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reassuring message */}
          <div className="mt-16 p-8 bg-blue-50 border border-blue-200 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">We're On It!</h2>
            <p className="text-muted-foreground mb-4">
              Our technical team has been automatically notified about this issue. 
              We're working around the clock to restore normal service as quickly as possible.
            </p>
            <p className="text-sm text-muted-foreground">
              We apologize for any inconvenience this may cause and appreciate your patience.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServerErrorPage;
