import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';
import { ToastContext } from 'contexts/ToastContext';

import axiosInstance from 'config/axiosInstance';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useContext(ToastContext);
  
  const [formData, setFormData] = useState({
    new_password: '',
    new_password_confirm: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setTokenValid(false);
      showToast('Invalid reset link. Please request a new one.', 'error');
    }
  }, [token, email, showToast]);

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const validateForm = () => {
    const errors = {};
    
    const passwordError = validatePassword(formData.new_password);
    if (passwordError) {
      errors.new_password = passwordError;
    }
    
    if (!formData.new_password_confirm) {
      errors.new_password_confirm = 'Please confirm your password';
    } else if (formData.new_password !== formData.new_password_confirm) {
      errors.new_password_confirm = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/reset-password/confirm/', {
        token,
        email,
        new_password: formData.new_password,
        new_password_confirm: formData.new_password_confirm
      });
      
      if (response.data.success) {
        showToast('Password reset successfully! You can now login.', 'success');
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Your password has been reset. Please login with your new password.' }
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to reset password. The link may have expired.';
      showToast(errorMessage, 'error');
      
      if (error.response?.status === 400) {
        setTokenValid(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.new_password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 4) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  if (!tokenValid) {
    return (
      <div className="min-h-screen pt-16 sm:pt-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="XCircle" size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={() => navigate('/forgot-password')}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pt-16 sm:pt-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
              <Icon name="Key" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600">
              Enter your new password for <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  label="New Password"
                  type="password"
                  name="new_password"
                  placeholder="Enter new password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  error={validationErrors.new_password}
                  disabled={isLoading}
                  required
                />
                
                {/* Password Strength Indicator */}
                {formData.new_password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Password Strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.label === 'Weak' ? 'text-red-600' :
                        passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                name="new_password_confirm"
                placeholder="Re-enter new password"
                value={formData.new_password_confirm}
                onChange={handleInputChange}
                error={validationErrors.new_password_confirm}
                disabled={isLoading}
                required
              />
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-medium text-blue-900 mb-2">Password must contain:</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li className="flex items-center space-x-2">
                  <Icon name={formData.new_password.length >= 8 ? "Check" : "Circle"} size={12} 
                        className={formData.new_password.length >= 8 ? "text-green-600" : "text-gray-400"} />
                  <span>At least 8 characters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name={/(?=.*[a-z])/.test(formData.new_password) ? "Check" : "Circle"} size={12} 
                        className={/(?=.*[a-z])/.test(formData.new_password) ? "text-green-600" : "text-gray-400"} />
                  <span>One lowercase letter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name={/(?=.*[A-Z])/.test(formData.new_password) ? "Check" : "Circle"} size={12} 
                        className={/(?=.*[A-Z])/.test(formData.new_password) ? "text-green-600" : "text-gray-400"} />
                  <span>One uppercase letter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name={/(?=.*\d)/.test(formData.new_password) ? "Check" : "Circle"} size={12} 
                        className={/(?=.*\d)/.test(formData.new_password) ? "text-green-600" : "text-gray-400"} />
                  <span>One number</span>
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              iconName="Lock"
              iconPosition="left"
              iconSize={20}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
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
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
