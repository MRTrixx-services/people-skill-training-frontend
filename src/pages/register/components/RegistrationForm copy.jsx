import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

import CountryList from 'country-list-with-dial-code-and-flag';
import Select from 'components/ui/Select';

const RegistrationForm = ({ onSubmit, loading }) => {
  const navigate = useNavigate();
  const countriesRaw = CountryList.getAll();
  // sort alphabetically by country name
  const countries = countriesRaw
    .filter(c => c.dial_code && c.code) // filter out malformed
    .sort((a, b) => a.name.localeCompare(b.name));
const countryOptions = countries.map(country => ({
  value: country.dial_code,
  label: `${country.flag} ${country.name} (${country.dial_code})`
}));

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'attendee',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value?.trim()) newErrors.firstName = 'First name is required';
        else if (value.length < 2) newErrors.firstName = 'First name must be at least 2 characters';
        else delete newErrors.firstName;
        break;

      case 'lastName':
        if (!value?.trim()) newErrors.lastName = 'Last name is required';
        else if (value.length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
        else delete newErrors.lastName;
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value?.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(value)) newErrors.email = 'Please enter a valid email address';
        else delete newErrors.email;
        break;

      case 'phone':
        const phoneRegex = /^[\d\s\-\(\)]{4,}$/;
        if (!value?.trim()) newErrors.phone = 'Phone number is required';
        else if (!phoneRegex.test(value)) newErrors.phone = 'Please enter a valid phone number';
        else delete newErrors.phone;
        break;

      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) newErrors.password = 'Password must contain uppercase, lowercase, and number';
        else delete newErrors.password;
        break;

      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Please confirm your password';
        else if (value !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;

      case 'agreeToTerms':
        if (!value) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        else delete newErrors.agreeToTerms;
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleCountryCodeChange = (e) => {
  //   const newCode = e.target.value;
  //   setFormData((prev) => ({ ...prev, countryCode: newCode }));
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    validateField(name, fieldValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) isValid = false;
    });

    if (isValid) {
      // Combine country code and phone number if needed or send separately
      const fullPhoneNumber = `${formData.countryCode} ${formData.phone}`;
      onSubmit({ ...formData, phone: fullPhoneNumber });
    }
  };

  const getFormProgress = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'password',
      'confirmPassword',
      'agreeToTerms'
    ];
    if (formData.role === 'instructor') {
      requiredFields.push('qualifications', 'experience');
    }

    const filledFields = requiredFields.filter((field) =>
      field === 'agreeToTerms' ? formData[field] : formData[field]?.toString().trim()
    );

    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Registration Progress</span>
          <span className="text-sm text-muted-foreground">{getFormProgress()}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${getFormProgress()}%` }}
          />
        </div>
      </div>
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="User" size={20} className="mr-2" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            required
          />

          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          description="We'll use this for account verification and notifications"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
  label="Country Code"
  name="countryCode"
  placeholder="Select Country Code"
  options={countryOptions}
  value={formData.countryCode}
  onChange={(value) => handleInputChange({
    target: { name: 'countryCode', value }
  })}
  error={errors.countryCode}
  required
  searchable
/>



          <Input
            label="Phone Number"
            type="tel"
               id="phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            description="(e.g., 234 567 8900)"
            required
          />
        </div>
      </div>

      {/* Account Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Lock" size={20} className="mr-2" />
          Account Security
        </h3>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            description="Must be at least 8 characters with uppercase, lowercase, and number"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <Checkbox
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          error={errors.agreeToTerms}
          label={
            <span>
              I agree to the{' '}
              <button
                type="button"
                onClick={() => window.open('/terms-conditions', '_blank')}
                className="text-primary hover:underline"
              >
                Terms and Conditions
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => window.open('/privacy-policy', '_blank')}
                className="text-primary hover:underline"
              >
                Privacy Policy
              </button>
            </span>
          }
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={loading}
        disabled={Object.keys(errors).length > 0 || !formData.agreeToTerms}
        iconName="UserPlus"
        iconPosition="left"
      >
        Create Account
      </Button>

    
    </form>
  );
};

export default RegistrationForm;
