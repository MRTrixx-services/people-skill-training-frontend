import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';

const MaintenancePage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Mock maintenance data[8][11]
  const maintenanceInfo = {
    startTime: '2025-11-18T06:00:00Z',
    endTime: '2025-11-18T10:00:00Z',
    progress: 65, // percentage
    currentTask: 'Database optimization',
    estimatedCompletion: '2025-01-01T05:30:00Z'
  };

  const maintenanceChecklist = [
    { task: 'Server updates', status: 'completed', duration: '30 min' },
    { task: 'Database optimization', status: 'in-progress', duration: '2 hours' },
    { task: 'Security patches', status: 'pending', duration: '45 min' },
    { task: 'Performance testing', status: 'pending', duration: '1 hour' },
    { task: 'Final verification', status: 'pending', duration: '15 min' }
  ];

  useEffect(() => {
    // Calculate time remaining
    const updateCountdown = () => {
      const now = new Date();
      const endTime = new Date(maintenanceInfo.estimatedCompletion);
      const diff = endTime - now;

      if (diff > 0) {
        setTimeRemaining(diff);
      } else {
        setTimeRemaining(0);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (milliseconds) => {
    if (!milliseconds) return "Completing soon...";
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'in-progress':
        return { icon: 'RefreshCw', color: 'text-warning animate-spin' };
      case 'pending':
        return { icon: 'Clock', color: 'text-muted-foreground' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const handleEmailSubscription = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      console.log('Subscribed email:', email);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {/* <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-2 text-primary">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Video" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">PeopleSkillTraining</span>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full text-center">
          {/* Maintenance Notice[8][11] */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-warning/10 rounded-full mb-6">
              <Icon name="Tool" size={64} className="text-warning" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Under Maintenance
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back online shortly!
            </p>

            {/* Expected downtime duration */}
            <div className="bg-card border border-border rounded-xl p-6 max-w-lg mx-auto mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">Maintenance Window</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started:</span>
                  <span className="text-foreground">
                    {new Date(maintenanceInfo.startTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected End:</span>
                  <span className="text-foreground">
                    {new Date(maintenanceInfo.endTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-warning font-medium">
                    {formatCountdown(timeRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Progress Information[8][11] */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Maintenance Progress</h2>

              {/* Progress bar */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-foreground">Overall Progress</h3>
                  <span className="text-lg font-bold text-primary">{maintenanceInfo.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 mb-4">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${maintenanceInfo.progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Currently working on: <span className="font-medium text-foreground">
                    {maintenanceInfo.currentTask}
                  </span>
                </p>
              </div>

              {/* Maintenance checklist[8] */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Maintenance Tasks</h3>
                <div className="space-y-3">
                  {maintenanceChecklist.map((item, index) => {
                    const statusConfig = getStatusIcon(item.status);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon name={statusConfig.icon} size={16} className={statusConfig.color} />
                          <span className="text-sm font-medium text-foreground">{item.task}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.duration}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Alternative Actions[8][11] */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Stay Updated</h2>

              {/* Email notification signup[8] */}
              {/* <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Get Notified When We're Back</h3>
                
                {!isSubscribed ? (
                  <form onSubmit={handleEmailSubscription} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      variant="default"
                      iconName="Bell"
                      iconPosition="left"
                      className="w-full"
                    >
                      Notify Me
                    </Button>
                  </form>
                ) : (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-success font-medium">You're subscribed!</span>
                    </div>
                    <p className="text-success/80 text-sm mt-1">
                      We'll email you when maintenance is complete.
                    </p>
                  </div>
                )}
              </div> */}

              {/* System status updates[8] */}
              {/* <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Live Updates</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://status.peopleskilltraining.com', '_blank')}
                    iconName="ExternalLink"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    System Status Page
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://twitter.com/peopleskilltraining', '_blank')}
                    iconName="Twitter"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Follow on Twitter
                  </Button>
                </div>
              </div> */}

              {/* Emergency contact information[8] */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Need Immediate Help?</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                    <h4 className="font-medium text-error mb-2">Emergency Support</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      For urgent technical issues during maintenance
                    </p>
                    <div className="space-y-2 text-sm">
                      {/* <div className="flex items-center space-x-2">
                        <Icon name="Phone" size={14} className="text-muted-foreground" />
                        <span className="text-foreground">+1 (555) 123-4567</span>
                      </div> */}
                      <div className="flex items-center space-x-2">
                        <Icon name="Mail" size={14} className="text-muted-foreground" />
                        <span className="text-foreground">support@peopleskilltraining.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thank you message[11] */}
          <div className="mt-16 p-8 bg-gradient-to-r from-primary to-blue-700 rounded-xl text-white">
            <h2 className="text-2xl font-bold mb-4">Thank You for Your Patience</h2>
            <p className="text-blue-100 mb-6">
              We're working hard to bring you an even better learning experience. 
              These improvements will enhance performance, security, and reliability.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-blue-100">
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} />
                <span>Faster Loading</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} />
                <span>Enhanced Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Smile" size={16} />
                <span>Better Experience</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span>© 2025 PeopleSkillTraining. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MaintenancePage;
