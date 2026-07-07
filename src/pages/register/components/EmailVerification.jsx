import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
// import { API_BASE_URL } from 'contexts/AuthContext';
import { ToastContext } from 'contexts/ToastContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import axiosInstance from 'config/axiosInstance';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    setUserEmail(email || '');

    if (!token) {
      setIsVerifying(false);
      setVerificationStatus('invalid');
      return;
    }

    verifyEmail(token, email);
  }, [searchParams]);

  const verifyEmail = async (token, email) => {
    try {
      const response = await axiosInstance.post(`/auth/verify-email/`, {
        token,
        email
      });

      setVerificationStatus('success');
      showToast('Email verified successfully! You can now login.', 'success');

    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      
      let errorMessage = 'Email verification failed.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid verification token.';
      } else if (error.response?.status === 410) {
        errorMessage = 'Verification token has expired.';
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await axiosInstance.post(`/auth/resend-verification/`, {
        email: userEmail
      });
      showToast('Verification email sent! Please check your inbox.', 'success');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      showToast('Failed to resend email. Please try again.', 'error');
    }
  };

  const getVerificationContent = () => {
    if (isVerifying) {
      return {
        icon: 'Loader',
        iconColor: 'text-blue-600 animate-spin',
        title: 'Verifying Your Email...',
        message: 'Please wait while we verify your email address.',
        showSpinner: true
      };
    }

    if (verificationStatus === 'success') {
      return {
        icon: 'CheckCircle',
        iconColor: 'text-green-600',
        title: 'Email Verified Successfully!',
        message: 'Your email address has been verified. You can now sign in to your account.',
        details: [
          'Your account is now active and ready to use',
          'You have full access to all platform features',
          'You can sign in using your email and password',
          'Welcome to PeopleSkillTraining!'
        ],
        actionText: 'Sign In Now',
        actionPath: '/login',
        showSuccess: true
      };
    }

    if (verificationStatus === 'error') {
      return {
        icon: 'XCircle',
        iconColor: 'text-red-600',
        title: 'Verification Failed',
        message: 'We were unable to verify your email address. The link may be invalid or expired.',
        details: [
          'The verification link may have expired (links are valid for 24 hours)',
          'The link may have already been used',
          'There might be a technical issue on our end',
          'You can request a new verification email below'
        ],
        actionText: 'Back to Sign In',
        actionPath: '/login',
        showError: true
      };
    }

    return {
      icon: 'AlertTriangle',
      iconColor: 'text-yellow-600',
      title: 'Invalid Verification Link',
      message: 'The verification link appears to be invalid or malformed.',
      details: [
        'Please check that you clicked the correct link from your email',
        'Make sure the entire link was copied if you pasted it',
        'The link should contain a verification token',
        'Contact support if you continue to have issues'
      ],
      actionText: 'Back to Sign In',
      actionPath: '/login',
      showError: true
    };
  };

  const content = getVerificationContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Pattern - Same as Register component */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-rose-600/10 rounded-full blur-2xl animate-bounce"></div>
        <main className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-14 md:pt-16 lg:pt-24">
      <div className="w-full max-w-3xl items-center">
          
          {/* Verification Card - Same styling as Register component */}
          <div className="bg-card border border-border rounded-2xl shadow-card p-8">
            <div className="text-center space-y-6">
              
              {/* Status Icon */}
              <div className="flex justify-center">
                <div className={`w-20 h-20 rounded-full bg-muted flex items-center justify-center ${content?.iconColor}`}>
                  <Icon name={content?.icon} size={40} />
                </div>
              </div>

              {/* Status Title */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {content?.title}
                </h2>
                <p className="text-muted-foreground">
                  {content?.message}
                </p>
              </div>

              {/* Email Display */}
              {userEmail && !isVerifying && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Icon name="Mail" size={20} className="text-primary" />
                    <span className="font-medium text-foreground">Email Address</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{userEmail}</span>
                  </p>
                </div>
              )}

              {/* Success/Error Details */}
              {content?.details && !isVerifying && (
                <div className="bg-card border border-border rounded-lg p-6 text-left">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="Info" size={20} className="mr-2" />
                    {content?.showSuccess ? 'What you can do now:' : 'Possible reasons:'}
                  </h3>
                  <ul className="space-y-3">
                    {content?.details?.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          content?.showSuccess ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {content?.showSuccess ? (
                            <Icon name="Check" size={12} className="text-green-600" />
                          ) : (
                            <span className="text-xs font-medium text-red-600">{index + 1}</span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              {!isVerifying && (
                <div className="space-y-3">
                  <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    onClick={() => navigate(content?.actionPath)}
                    iconName={verificationStatus === 'success' ? 'LogIn' : 'ArrowLeft'}
                    iconPosition="left"
                  >
                    {content?.actionText}
                  </Button>

                  {/* Resend Email Button for Error States */}
                  {(verificationStatus === 'error' || verificationStatus === 'invalid') && userEmail && (
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={handleResendEmail}
                      iconName="RefreshCw"
                      iconPosition="left"
                    >
                      Resend Verification Email
                    </Button>
                  )}

                  {/* Register New Account Button for Error States */}
                  {(verificationStatus === 'error' || verificationStatus === 'invalid') && (
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={() => navigate('/register')}
                      iconName="UserPlus"
                      iconPosition="left"
                    >
                      Create New Account
                    </Button>
                  )}
                </div>
              )}

              {/* Status-specific Information */}
              {verificationStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="Shield" size={20} className="text-green-600 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-medium text-green-800">Account Activated</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your account is now fully activated and secure. You can access all features of PeopleSkillTraining.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-red-600 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-medium text-red-800">Verification Failed</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Don't worry! You can request a new verification email or try creating a new account if needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Support Information - Same as SuccessMessage */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="HelpCircle" size={20} className="text-accent mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-medium text-black">Need Help?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      If you continue to have issues with email verification, please contact our support team at{' '}
                      <a href="mailto:support@peopleskilltraining.com" className="text-primary hover:underline">
                        support@peopleskilltraining.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Same as Register component */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PeopleSkillTraining. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <button 
                onClick={() => window.open('/terms-conditions', '_blank')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => window.open('/privacy-policy', '_blank')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => window.open('/contact', '_blank')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default EmailVerification;
