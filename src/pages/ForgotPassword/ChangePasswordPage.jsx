import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { ToastContext } from '../../../contexts/ToastContext';
import api from '../../../services/api';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useContext(ToastContext);
  
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    
    if (!formData.current_password) {
      errors.current_password = 'Current password is required';
    }
    
    const passwordError = validatePassword(formData.new_password);
    if (passwordError) {
      errors.new_password = passwordError;
    }
    
    if (formData.current_password && formData.new_password && 
        formData.current_password === formData.new_password) {
      errors.new_password = 'New password must be different from current password';
    }
    
    if (!formData.confirm_password) {
      errors.confirm_password = 'Please confirm your new password';
    } else if (formData.new_password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
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
      const response = await api.put('/auth/change-password/', {
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      });
      
      if (response.data.success) {
        showToast('Password changed successfully! Please login again.', 'success');
        
        // Auto-logout after password change for security
        setTimeout(async () => {
          await logout();
          navigate('/login', { 
            state: { 
              message: 'Your password has been changed. Please login with your new password.',
              action: 'password_changed'
            }
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Password change failed:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.current_password?.[0] ||
                          error.response?.data?.new_password?.[0] ||
                          error.response?.data?.message || 
                          'Failed to change password. Please try again.';
      showToast(errorMessage, 'error');
      
      // Handle specific validation errors from backend
      if (error.response?.data) {
        const backendErrors = {};
        if (error.response.data.current_password) {
          backendErrors.current_password = error.response.data.current_password[0];
        }
        if (error.response.data.new_password) {
          backendErrors.new_password = error.response.data.new_password[0];
        }
        if (Object.keys(backendErrors).length > 0) {
          setValidationErrors(backendErrors);
        }
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
    if (/(?=.*[@$!%*?&#])/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 4) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen pt-16 sm:pt-12  bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Icon name="Lock" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
                <p className="text-gray-600 mt-1">Update your account password for {user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Security Notice</h3>
              <p className="text-sm text-blue-800 mt-1">
                You will be logged out after changing your password and will need to log in again with your new credentials.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  name="current_password"
                  placeholder="Enter your current password"
                  value={formData.current_password}
                  onChange={handleInputChange}
                  error={validationErrors.current_password}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  <Icon name={showCurrentPassword ? "EyeOff" : "Eye"} size={20} />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">New Password</h3>
              
              {/* New Password */}
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      name="new_password"
                      placeholder="Enter new password"
                      value={formData.new_password}
                      onChange={handleInputChange}
                      error={validationErrors.new_password}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      <Icon name={showNewPassword ? "EyeOff" : "Eye"} size={20} />
                    </button>
                  </div>
                  
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

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Re-enter new password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    error={validationErrors.confirm_password}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-900 mb-3">Password Requirements:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={formData.new_password.length >= 8 ? "CheckCircle" : "Circle"} 
                    size={14} 
                    className={formData.new_password.length >= 8 ? "text-green-600" : "text-gray-300"} 
                  />
                  <span className="text-xs text-gray-700">At least 8 characters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={/(?=.*[a-z])/.test(formData.new_password) ? "CheckCircle" : "Circle"} 
                    size={14} 
                    className={/(?=.*[a-z])/.test(formData.new_password) ? "text-green-600" : "text-gray-300"} 
                  />
                  <span className="text-xs text-gray-700">One lowercase letter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={/(?=.*[A-Z])/.test(formData.new_password) ? "CheckCircle" : "Circle"} 
                    size={14} 
                    className={/(?=.*[A-Z])/.test(formData.new_password) ? "text-green-600" : "text-gray-300"} 
                  />
                  <span className="text-xs text-gray-700">One uppercase letter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={/(?=.*\d)/.test(formData.new_password) ? "CheckCircle" : "Circle"} 
                    size={14} 
                    className={/(?=.*\d)/.test(formData.new_password) ? "text-green-600" : "text-gray-300"} 
                  />
                  <span className="text-xs text-gray-700">One number</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={formData.new_password !== formData.current_password && formData.new_password.length > 0 ? "CheckCircle" : "Circle"} 
                    size={14} 
                    className={formData.new_password !== formData.current_password && formData.new_password.length > 0 ? "text-green-600" : "text-gray-300"} 
                  />
                  <span className="text-xs text-gray-700">Different from current</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="sm:flex-1"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="sm:flex-1"
                loading={isLoading}
                disabled={isLoading}
                iconName="Check"
                iconPosition="left"
                iconSize={20}
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <Icon name="HelpCircle" size={20} className="text-gray-400 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Forgot your current password?</p>
                <p>
                  Use the{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Forgot Password
                  </button>
                  {' '}feature to reset it via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
