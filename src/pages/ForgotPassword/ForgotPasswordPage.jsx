import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';
import { ToastContext } from 'contexts/ToastContext';
import axiosInstance from 'config/axiosInstance';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/reset-password/', { email });
      
      if (response.data.success) {
        setIsSubmitted(true);
        showToast('Password reset link sent! Check your email.', 'success');
      }
    } catch (error) {
      console.error('Password reset request failed:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to send reset email. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-16 sm:pt-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Icon name="Mail" size={32} className="text-white" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
                <p className="text-gray-600">
                  We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/login')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Login
                </Button>
                
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full text-sm text-primary hover:text-primary/80 transition-colors duration-150"
                >
                  Resend Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
              <Icon name="Lock" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-gray-600">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={handleInputChange}
              error={validationError}
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              iconName="Send"
              iconPosition="left"
              iconSize={20}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-150 inline-flex items-center space-x-2"
                disabled={isLoading}
              >
                <Icon name="ArrowLeft" size={16} />
                <span>Back to Login</span>
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <Icon name="HelpCircle" size={16} className="mr-2" />
                Need Help?
              </p>
              <p className="text-xs text-gray-600">
                If you don't have access to your email, please contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
