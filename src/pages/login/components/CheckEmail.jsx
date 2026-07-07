import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// import { API_BASE_URL } from 'contexts/AuthContext';
import { ToastContext } from 'contexts/ToastContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import axiosInstance from 'config/axiosInstance';

const CheckEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  const { showToast } = useContext(ToastContext);
  
  // Get email from location state (passed from login)
  const email = location.state?.email || '';
  const accessToken = location.state?.token || '';
  const message = location.state?.message || 'Please check your email to verify your account.';

  const handleResendEmail = async () => {
    if (!email) {
      showToast('Email address is required to resend verification.', 'error');
      return;
    }

    setIsResending(true);
    try {
      await axiosInstance.post(`/auth/resend-verification/`, {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
      showToast('Verification email sent! Please check your inbox.', 'success');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      
      let errorMessage = 'Failed to resend email. Please try again.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleTryDifferentEmail = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Pattern - Same as other pages */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-rose-600/10 rounded-full blur-2xl animate-bounce"></div>

      <main className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-14 md:pt-16 lg:pt-24">
        <div className="w-full max-w-3xl items-center">
          
          {/* Check Email Card */}
          <div className="bg-card border border-border rounded-2xl shadow-card p-8">
            <div className="text-center space-y-6">
              
              {/* Email Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon name="Mail" size={40} className="text-blue-600" />
                </div>
              </div>

              {/* Title and Message */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Check Your Email
                </h2>
                <p className="text-muted-foreground">
                  {message}
                </p>
              </div>

              {/* Email Display */}
              {email && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Icon name="AtSign" size={20} className="text-primary" />
                    <span className="font-medium text-foreground">Verification Email Sent To</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-card border border-border rounded-lg p-6 text-left">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="CheckCircle" size={20} className="mr-2 text-green-600" />
                  What to do next:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Open your email inbox and look for a message from PeopleSkillTraining
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Click the "Verify Email" button in the email to confirm your account
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Return to the login page to access your account
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {email && (
                  <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    onClick={handleResendEmail}
                    loading={isResending}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleBackToLogin}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Sign In
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleTryDifferentEmail}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Try Different Email
                </Button>
              </div>

              {/* Help Section */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-medium text-yellow-800">Don't see the email?</h4>
                    <div className="text-sm text-yellow-700 mt-1 space-y-1">
                      <p>• Check your spam or junk folder</p>
                      <p>• Make sure you entered the correct email address</p>
                      <p>• Wait a few minutes - emails can sometimes be delayed</p>
                      <p>• Click "Resend" if you still don't see it</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Information */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="HelpCircle" size={20} className="text-accent mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-medium text-black">Need Help?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Still having trouble? Contact our support team at{' '}
                      <a href="mailto:support@peopleskilltraining.com" className="text-primary hover:underline">
                        support@PeopleSkillTraining.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PeopleSkillTraining. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckEmail;
