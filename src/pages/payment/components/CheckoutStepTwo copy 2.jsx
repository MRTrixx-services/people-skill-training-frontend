import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const PaymentGatewayIcons = {
  razorpay: () => (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white shadow-md">
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902z" />
      </svg>
    </div>
  ),
  paypal: () => (
    <div className="flex items-center justify-center w-full h-full bg-blue-500 rounded-lg">
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
        <path fill="currentColor" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
      </svg>
    </div>
  ),
  stripe: () => (
    <div className="flex items-center justify-center w-full h-full bg-indigo-600 rounded-lg">
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
        <path fill="currentColor" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.943 0 14.422 0c-4.81 0-8.27 2.605-8.27 6.267 0 2.551 1.56 4.283 4.646 5.42 2.328.9 3.104 1.565 3.104 2.509 0 .871-.719 1.371-1.997 1.371-2.876 0-5.154-1.283-6.561-2.225l-.922 5.494C5.455 19.68 8.253 20 9.671 20c5.055 0 8.467-2.58 8.467-6.339 0-2.834-1.711-4.463-4.162-5.51z" />
      </svg>
    </div>
  ),
};

// Stripe Payment Form Component
const StripePaymentForm = ({ 
  checkoutData, 
  isProcessing, 
  setIsProcessing,
  onPaymentSuccess,
  onPaymentError,
  resumePayment 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Validate the form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        setIsProcessing(false);
        return;
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        onPaymentError?.(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess?.(paymentIntent);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Payment failed');
      onPaymentError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <PaymentElement 
          onReady={() => setIsReady(true)}
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
            fields: {
              billingDetails: {
                address: {
                  country: 'auto',
                }
              }
            },
            business: {
              name: 'PeopleSkillTraining'
            }
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !isReady}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Icon name="CreditCard" size={20} />
            <span>
              {resumePayment ? 'Continue Payment' : 'Pay'} ${checkoutData.summary?.total?.toFixed(2)}
            </span>
          </div>
        )}
      </Button>

      <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
        <Icon name="Lock" size={14} />
        <span>Payments secured by Stripe</span>
      </div>
    </form>
  );
};

// Stripe Elements Wrapper
const StripeElementsWrapper = ({
  stripePromise,
  clientSecret,
  checkoutData,
  isProcessing,
  setIsProcessing,
  onPaymentSuccess,
  onPaymentError,
  resumePayment
}) => {
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4f46e5',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        padding: '12px',
      },
      '.Input:focus': {
        border: '2px solid #4f46e5',
        boxShadow: '0 0 0 1px #4f46e5',
      },
      '.Label': {
        fontWeight: '500',
        marginBottom: '8px',
      },
      '.Tab': {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
      },
      '.Tab--selected': {
        border: '2px solid #4f46e5',
        backgroundColor: '#eef2ff',
      },
    }
  };

  // UPI only works with INR - if UPI is needed, currency must be INR
  const currency = 'usd'; // or dynamically set based on user selection
  
  const options = clientSecret ? {
    clientSecret,
    appearance,
  } : {
    mode: 'payment',
    amount: Math.round((checkoutData.summary?.total || 0) * 100),
    currency: currency.toLowerCase(),
    appearance,
    paymentMethodTypes: currency.toLowerCase() === 'inr' 
      ? ['card', 'upi'] 
      : ['card'], // UPI only available for INR
  };

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icon name="Loader2" size={24} className="animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading Stripe...</span>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm
        checkoutData={checkoutData}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        resumePayment={resumePayment}
      />
    </Elements>
  );
};
const CheckoutStepTwo = ({
  availableGateways,
  selectedGateway,
  setSelectedGateway,
  isProcessing,
  setIsProcessing,
  processPayment,
  createPayPalOrder,
  onPayPalApprove,
  onPayPalError,
  onPayPalCancel,
  checkoutData,
  handleBack,
  getGatewayDisplayInfo,
  gatewaysLoading,
  resumePayment,
  stripeClientSecret,
  onStripePaymentSuccess,
  onStripePaymentError,
}) => {
  const [stripePromise, setStripePromise] = useState(null);

  // Initialize Stripe when gateway is selected
  useEffect(() => {
    if (selectedGateway === 'stripe') {
      const stripeGateway = availableGateways.find(g => g.id === 'stripe');
      if (stripeGateway?.configuration?.publishable_key) {
        const promise = loadStripe(stripeGateway.configuration.publishable_key);
        setStripePromise(promise);
      }
    }
  }, [selectedGateway, availableGateways]);

  // ✅ ADD THIS: Trigger payment creation when Stripe is selected
  useEffect(() => {
    const initializeStripePayment = async () => {
      if (selectedGateway === 'stripe' && !stripeClientSecret && !resumePayment && !isProcessing) {
        console.log('🎯 Stripe selected, initializing payment...');
        await processPayment();
      }
    };

    initializeStripePayment();
  }, [selectedGateway]); // Only run when selectedGateway changes
  
  // Rest of your component...

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6 lg:space-y-8"
    >
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
          {resumePayment ? 'Complete Your Payment' : 'Choose Payment Method'}
        </h2>
        <div className="flex items-center justify-center lg:justify-start mb-3 sm:mb-4">
          <div className="h-px bg-gradient-to-r from-blue-200 to-indigo-200 w-12 sm:w-16"></div>
          <Icon name="CreditCard" size={16} className="mx-3 text-blue-500" />
          <div className="h-px bg-gradient-to-r from-indigo-200 to-blue-200 w-12 sm:w-16"></div>
        </div>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
          {resumePayment
            ? 'Continue with your pending payment using the selected payment method.'
            : 'Select your preferred payment method to complete your purchase securely.'
          }
        </p>
      </div>

      {/* Payment Gateway Selection */}
      {gatewaysLoading ? (
        <div className="bg-white/80 rounded-2xl p-8 shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-indigo-600" />
            <span className="text-gray-600">Loading payment methods...</span>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <Icon name="Wallet" size={16} className="text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {resumePayment ? 'Selected Payment Method' : 'Payment Methods'}
            </h3>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Secure</span>
            </div>
          </div>

          {/* Payment Gateway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {availableGateways 
            .filter(gateway => !gateway.test_mode) 
            .map((gateway) => {
              const displayInfo = getGatewayDisplayInfo(gateway);
              const IconComponent = PaymentGatewayIcons[gateway.id];
              const isSelected = selectedGateway === gateway.id;
              const isDisabled = resumePayment && !isSelected;

              return (
                <motion.div
                  key={gateway.id}
                  className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                    isSelected
                      ? `${displayInfo.borderColor} ${displayInfo.bgColor} shadow-lg transform scale-105`
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md cursor-pointer'
                  }`}
                  onClick={() => !isDisabled && setSelectedGateway(gateway.id)}
                  whileHover={{ scale: isDisabled ? 1 : (isSelected ? 1.05 : 1.02) }}
                  whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10"
                    >
                      <Icon name="Check" size={14} className="text-white" />
                    </motion.div>
                  )}

                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 relative">
                      {gateway.logo_url ? (
                        <img
                          src={gateway.logo_url}
                          alt={gateway.name}
                          className="w-full h-full rounded-lg shadow-md object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div style={{ display: gateway.logo_url ? 'none' : 'block' }}>
                        {IconComponent && <IconComponent />}
                      </div>
                    </div>

                    <div className="text-center">
                      <h4 className={`font-bold text-lg ${
                        isSelected ? displayInfo.textColor : 'text-gray-900'
                      }`}>
                        {gateway.name}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-1 justify-center">
                      {gateway.test_mode && (
                        <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                          Test Mode
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Payment Processing Section */}
          {selectedGateway && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-200 pt-6"
            >
              {/* Stripe Payment Form */}
             {/* Stripe Payment - Show button first, then form */}
{selectedGateway === 'stripe' && (
  <>
    {!stripeClientSecret ? (
      // ✅ Show "Initialize Payment" button
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <Icon name="Info" size={16} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Stripe Payment</h4>
            <p className="text-sm text-gray-600">
              Total: ${checkoutData.summary?.total?.toFixed(2)}
            </p>
          </div>
        </div>
        
        <Button
          onClick={processPayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Loader2" size={20} className="animate-spin" />
              <span>Initializing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Icon name="CreditCard" size={20} />
              <span>Continue to Payment</span>
            </div>
          )}
        </Button>
      </div>
    ) : (
      // ✅ Show Stripe Elements form after client_secret is received
      <StripeElementsWrapper
        stripePromise={stripePromise}
        clientSecret={stripeClientSecret}
        checkoutData={checkoutData}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        onPaymentSuccess={onStripePaymentSuccess}
        onPaymentError={onStripePaymentError}
        resumePayment={resumePayment}
      />
    )}
  </>
)}


              {/* Razorpay Button */}
              {selectedGateway === 'razorpay' && (
                <>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Icon name="Info" size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Razorpay Payment</h4>
                        <p className="text-sm text-gray-600">
                          Total: ${checkoutData.summary?.total?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={processPayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="Loader2" size={20} className="animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="CreditCard" size={20} />
                        <span>
                          {resumePayment ? 'Continue Payment' : 'Pay'} ${checkoutData.summary?.total?.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </Button>
                </>
              )}

              {/* PayPal Button */}
              {selectedGateway === 'paypal' && (
                <div className="w-full">
                  <PayPalScriptProvider options={{
                    "client-id": availableGateways.find(g => g.id === 'paypal')?.configuration?.client_id || "test",
                    currency: checkoutData.summary?.currency || "USD",
                    intent: "capture"
                  }}>
                    <PayPalButtons
                      createOrder={createPayPalOrder}
                      onApprove={onPayPalApprove}
                      onError={onPayPalError}
                      onCancel={onPayPalCancel}
                      disabled={isProcessing}
                      style={{
                        layout: "vertical",
                        color: "blue",
                        shape: "rect",
                        height: 50,
                        tagline: false
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border border-indigo-200/50 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-center space-x-4 text-indigo-700">
            <Icon name="Loader2" size={32} className="animate-spin" />
            <div className="text-center">
              <span className="font-semibold text-xl">Processing your payment...</span>
              <p className="text-sm opacity-75 mt-1">Please don't close this window</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center pt-6 border-t border-gray-200/50"
      >
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isProcessing}
          className="flex items-center border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Back to Information
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutStepTwo;