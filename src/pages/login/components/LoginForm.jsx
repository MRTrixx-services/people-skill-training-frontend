import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from 'contexts/AuthContext';

const LoginForm = ({ onLogin,  }) => {
   const { isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onLogin(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Authentication Failed</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleInputChange}
          error={validationErrors?.email}
          required
          disabled={isLoading}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={validationErrors?.password}
          required
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
          disabled={isLoading}
        >
          Forgot Password?
        </button>
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="LogIn"
        iconPosition="left"
        iconSize={20}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          New to PeopleSkillTraining?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
            disabled={isLoading}
          >
            Create an account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;