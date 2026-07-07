// pages/payment/components/CheckoutStepOne.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CountryList from 'country-list-with-dial-code-and-flag';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const CheckoutStepOne = ({
  formData,
  handleCountryChange,
  handleInputChange,
  handleNext,
  isFormComplete,
}) => {
  const navigate = useNavigate();

  // Prepare country options from CountryList package (unique and sorted)
  const allCountries = CountryList.getAll(); // returns name, code, dialcode, flag [web:2]
  const uniqueCountriesMap = new Map();
  allCountries.forEach((country) => {
    if (!uniqueCountriesMap.has(country.code)) {
      uniqueCountriesMap.set(country.code, country);
    }
  });

  const countryOptions = Array.from(uniqueCountriesMap.values())
    .map((country) => ({
      value: country.code,
      label: country.name,
      dialCode: country.dialcode,
      flag: country.flag,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6 lg:space-y-8"
    >
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
          Contact Information
        </h2>
        <div className="flex items-center justify-center lg:justify-start mb-3 sm:mb-4">
          <div className="h-px bg-gradient-to-r from-indigo-200 to-purple-200 w-12 sm:w-16" />
          <Icon name="User" size={16} className="mx-3 text-indigo-500" />
          <div className="h-px bg-gradient-to-r from-purple-200 to-indigo-200 w-12 sm:w-16" />
        </div>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
          Please provide your contact details for order confirmation and access to your webinars.
        </p>
      </div>

      {/* Personal Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="User" size={16} className="text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Personal Information</h3>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Address *
            </label>
            <input
              type="text"
              name="billingAddress"
              required
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="Enter your billing address"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code *
              </label>
              <input
                type="text"
                name="zipCode"
                required
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              name="country"
              required
              value={formData.country}
              onChange={handleCountryChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base bg-white/70"
            >
              {countryOptions.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.flag} {country.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Terms and Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="Shield" size={16} className="text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Terms & Preferences
          </h3>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <motion.label
            className="flex items-start space-x-3 sm:space-x-4 cursor-pointer p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="checkbox"
              name="agreeTerms"
              required
              checked={!!formData.agreeTerms}
              onChange={handleInputChange}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5 flex-shrink-0"
            />
            <div className="text-sm sm:text-base">
              <span className="font-medium text-gray-900">I agree to the </span>
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 underline font-medium transition-colors"
              >
                Terms of Service
              </button>
              <span className="font-medium text-gray-900"> and </span>
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 underline font-medium transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-red-500 ml-1">*</span>
            </div>
          </motion.label>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-200/50 space-y-3 sm:space-y-0"
      >
        <Button
          variant="outline"
          onClick={() => navigate('/cart')}
          className="w-full sm:w-auto flex items-center justify-center border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-all duration-300"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Back to Cart
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isFormComplete()}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continue to Payment
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutStepOne;
