import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleContactAdmin = () => {
    navigate('/support', {
      state: {
        issue: 'access_denied',
        url: window.location.href,
        requestType: 'permission_request'
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
          {/* Access Denied Message[6][10] */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-error/10 rounded-full mb-6">
              <Icon name="Lock" size={64} className="text-error" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Access Denied
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              You don't have permission to access this page. This might be due to restricted content or insufficient account privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Clear explanation of restriction[6] */}
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Why am I seeing this?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-card border border-border rounded-lg">
                  <Icon name="Users" size={20} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Account Permissions</h3>
                    <p className="text-sm text-muted-foreground">
                      This content may require specific account permissions or subscription level.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-card border border-border rounded-lg">
                  <Icon name="CreditCard" size={20} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Subscription Required</h3>
                    <p className="text-sm text-muted-foreground">
                      This content might be available to premium subscribers only.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-card border border-border rounded-lg">
                  <Icon name="Clock" size={20} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Time-Restricted Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Content may only be available during specific time periods.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Options[6][10] */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">What can I do?</h2>

              {/* Login/signup prompts */}
              <div className="space-y-4">
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="LogIn" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Sign In to Your Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Log in to access your enrolled content
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="default"
                      onClick={() => navigate('/login')}
                      iconName="LogIn"
                      iconPosition="left"
                      className="flex-1"
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/register')}
                      iconName="UserPlus"
                      iconPosition="left"
                      className="flex-1"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>

                {/* Account upgrade information */}
                <div className="p-6 bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="Star" size={24} className="text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Upgrade Your Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Get access to premium content and exclusive webinars
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => navigate('/pricing')}
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="w-full bg-warning hover:bg-warning/90 text-white"
                  >
                    View Pricing Plans
                  </Button>
                </div>

                {/* Contact admin option */}
                <div className="p-6 bg-card border border-border rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="MessageSquare" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Need Special Access?</h3>
                      <p className="text-sm text-muted-foreground">
                        Contact our support team for permission requests
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleContactAdmin}
                    iconName="HelpCircle"
                    iconPosition="left"
                    className="w-full"
                  >
                    Request Access
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Account status check */}
          <div className="mt-16 p-8 bg-muted rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">Check Your Account Status</h2>
            <p className="text-muted-foreground mb-6">
              If you believe you should have access to this content, please verify your account status and subscription details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/account/subscription')}
                iconName="CreditCard"
                iconPosition="left"
              >
                View Subscription
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/account/profile')}
                iconName="User"
                iconPosition="left"
              >
                Account Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnauthorizedPage;
