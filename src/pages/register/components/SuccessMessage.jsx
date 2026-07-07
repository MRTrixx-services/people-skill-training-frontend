import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessMessage = ({ userRole, userEmail, showVerificationMessage = true }) => {
  const navigate = useNavigate();

  const getSuccessContent = () => {
    if (userRole === 'instructor') {
      return {
        icon: 'Mail',
        iconColor: 'text-blue-600',
        title: 'Registration Submitted Successfully!',
        message: `Thank you for registering as an instructor. Please verify your email address to complete the registration process.`,
        details: [
          'Check your email inbox for a verification link',
          'Click the verification link to activate your account',
          'After verification, your application will be reviewed by our admin team',
          'Admin review typically takes 1-2 business days',
          'You\'ll be notified via email once approved'
        ],
        actionText: 'Go to Sign In',
        actionPath: '/login',
        verificationRequired: true
      };
    } else {
      return {
        icon: 'Mail',
        iconColor: 'text-blue-600',
        title: 'Registration Successful!',
        message: `Welcome to PeopleSkillTraining! Please verify your email address to access your account.`,
        details: [
          'Check your email inbox for a verification link',
          'Click the verification link to activate your account',
          'After verification, you can sign in and access your dashboard',
          'Browse and enroll in upcoming webinars',
          'Access recorded sessions and track your learning progress'
        ],
        actionText: 'Go to Sign In',
        actionPath: '/login',
        verificationRequired: true
      };
    }
  };

  const content = getSuccessContent();

  const handleResendEmail = async () => {
    try {
      // Implement resend verification email functionality here
      console.log('Resending verification email to:', userEmail);
      // You can add API call to resend email and show toast
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className={`w-20 h-20 rounded-full bg-muted flex items-center justify-center ${content?.iconColor}`}>
          <Icon name={content?.icon} size={40} />
        </div>
      </div>

      {/* Success Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {content?.title}
        </h2>
        <p className="text-muted-foreground">
          {content?.message}
        </p>
      </div>

      {/* Email Verification Notice */}
      {showVerificationMessage && content?.verificationRequired && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-blue-600 mt-0.5" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-blue-800">
                Email Verification Required
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                We've sent a verification email to <strong>{userEmail}</strong>. 
                You must verify your email address before you can sign in to your account.
              </p>
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleResendEmail}
                  className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Resend verification email
                </button>
                <span className="hidden sm:block text-blue-400">|</span>
                <span className="text-sm text-blue-600">
                  Check your spam folder if you don't see it
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Mail" size={20} className="text-primary" />
          <span className="font-medium text-foreground">Verification Email Sent</span>
        </div>
        <p className="text-sm text-muted-foreground">
          A verification email has been sent to{' '}
          <span className="font-medium text-foreground">{userEmail}</span>
        </p>
      </div>

      {/* Next Steps */}
      <div className="bg-card border border-border rounded-lg p-6 text-left">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Icon name="List" size={20} className="mr-2" />
          What happens next?
        </h3>
        <ul className="space-y-3">
          {content?.details?.map((detail, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">{index + 1}</span>
              </div>
              <span className="text-sm text-muted-foreground">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={() => navigate(content?.actionPath)}
          iconName="LogIn"
          iconPosition="left"
        >
          {content?.actionText}
        </Button>

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
      </div>

      {/* Important Notice */}
      {userRole === 'attendee' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-yellow-600 mt-0.5" />
            <div className="text-left">
              <h4 className="font-medium text-yellow-800">Account Security</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Your account will remain inactive until email verification is complete. 
                This helps us ensure the security of your account and platform.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Review Notice */}
      {userRole === 'instructor' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={20} className="text-amber-600 mt-0.5" />
            <div className="text-left">
              <h4 className="font-medium text-amber-800">Instructor Review Process</h4>
              <p className="text-sm text-amber-700 mt-1">
                After email verification, your instructor application will undergo a review process. 
                Our team will evaluate your qualifications and experience before approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Support Information */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="HelpCircle" size={20} className="text-accent mt-0.5" />
          <div className="text-left">
            <h4 className="font-medium text-accent-foreground">Need Help?</h4>
            <p className="text-sm text-muted-foreground mt-1">
              If you have any questions or don't receive the verification email within a few minutes, please contact our support team at{' '}
              <a href="mailto:support@peopleskilltraining.com" className="text-primary hover:underline">
                support@peopleskilltraining.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
