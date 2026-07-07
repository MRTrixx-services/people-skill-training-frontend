// pages/CheckoutPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import { useCart } from 'contexts/CartContext';
import { useAuth } from 'contexts/AuthContext';
import { API_BASE_URL } from 'contexts/AuthContext';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total, itemCount, clearCart, getCartSummary } = useCart();
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Payment gateway states
  const [availableGateways, setAvailableGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [paymentContext, setPaymentContext] = useState(null);
  const [gatewaysLoading, setGatewaysLoading] = useState(true);
  
  // Get passed data from cart or initialize with cart data
  const [checkoutData, setCheckoutData] = useState(location.state || {
    items,
    summary: {
      subtotal: total,
      discount: 0,
      tax: total * 0.08,
      total: total + (total * 0.08),
      itemCount
    }
  });

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    agreeTerms: false,
    subscribeNewsletter: false
  });

  // Fetch payment context and available gateways
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setGatewaysLoading(true);
        
        // Get payment context (cart + gateways)
        const contextResponse = await axios.get(`${API_BASE_URL}/payments/context/`, {
          headers: getAuthHeaders()
        });

        if (contextResponse.data.success) {
          setPaymentContext(contextResponse.data);
          setAvailableGateways(contextResponse.data.available_gateways);
          setSelectedGateway(contextResponse.data.default_gateway);
          
          // Update checkout data with backend cart summary
          setCheckoutData(prev => ({
            ...prev,
            summary: contextResponse.data.cart
          }));
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
        // Fallback to basic gateways
        const gatewaysResponse = await axios.get(`${API_BASE_URL}/payments/gateways/`);
        if (gatewaysResponse.data.success) {
          setAvailableGateways(gatewaysResponse.data.gateways);
          setSelectedGateway(gatewaysResponse.data.default_gateway);
        }
      } finally {
        setGatewaysLoading(false);
      }
    };

    fetchPaymentData();
  }, [isAuthenticated, getAuthHeaders, navigate]);

  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const steps = [
    { id: 1, name: 'Information', icon: 'User', description: 'Contact & Billing Details' },
    { id: 2, name: 'Payment', icon: 'CreditCard', description: 'Secure Payment' },
    { id: 3, name: 'Confirmation', icon: 'CheckCircle', description: 'Order Confirmation' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.agreeTerms) {
        alert('Please fill in all required fields and agree to terms.');
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Process payment with selected gateway
  const processPayment = async () => {
    if (!selectedGateway) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await axios.post(`${API_BASE_URL}/payments/checkout/`, {
        payment_method: selectedGateway,
        return_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancel`
      }, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        setOrderDetails(response.data);

        // Handle different gateways
        if (selectedGateway === 'razorpay') {
          handleRazorpayPayment(response.data);
        } else if (selectedGateway === 'paypal') {
          // PayPal redirect will be handled by PayPal buttons
          return response.data;
        } else if (selectedGateway === 'stripe') {
          handleStripePayment(response.data);
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Razorpay payment handler
  const handleRazorpayPayment = (paymentData) => {
    const options = {
      key: paymentData.gateway_key,
      amount: paymentData.amount * 100, // Amount in paise
      currency: paymentData.currency,
      order_id: paymentData.gateway_order_id,
      name: 'PeopleSkillTraining',
      description: 'Webinar Purchase',
      handler: async (response) => {
        try {
          const verifyResponse = await axios.post(`${API_BASE_URL}/payments/verify/`, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            payment_method: 'razorpay'
          }, {
            headers: getAuthHeaders()
          });

          if (verifyResponse.data.success) {
            clearCart();
            setCurrentStep(3);
            setTimeout(() => {
              navigate('/checkout/success', {
                state: {
                  orderId: verifyResponse.data.payment_id,
                  transactionId: verifyResponse.data.transaction_id
                }
              });
            }, 3000);
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: '#6366f1'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // PayPal payment handlers
  const createPayPalOrder = async (data, actions) => {
    const paymentData = await processPayment();
    return paymentData.gateway_order_id;
  };

  const onPayPalApprove = async (data, actions) => {
    try {
      const verifyResponse = await axios.post(`${API_BASE_URL}/payments/verify/`, {
        paypal_order_id: data.orderID,
        payment_method: 'paypal'
      }, {
        headers: getAuthHeaders()
      });

      if (verifyResponse.data.success) {
        clearCart();
        setCurrentStep(3);
        setTimeout(() => {
          navigate('/checkout/success', {
            state: {
              orderId: verifyResponse.data.payment_id,
              transactionId: verifyResponse.data.transaction_id
            }
          });
        }, 3000);
      }
    } catch (error) {
      console.error('PayPal payment verification failed:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };

  // Form completion check
  const isFormComplete = () => {
    return formData?.firstName && 
           formData?.lastName && 
           formData?.email && 
           formData?.agreeTerms;
  };

  if (!items || items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-14 sm:pt-16 md:pt-18 lg:pt-20">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header with responsive design */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 lg:mb-10 text-center"
        >
          <div className="relative">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Secure Checkout
            </h1>
            {/* Decorative line */}
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-16 sm:w-24 lg:w-32"></div>
              <div className="mx-3 sm:mx-4">
                <Icon name="Sparkles" size={16} className="text-indigo-400" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-16 sm:w-24 lg:w-32"></div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Complete your purchase with our secure payment system
            </p>
          </div>
        </motion.div>

        {/* Enhanced Progress Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="flex items-center justify-center px-4 sm:px-0">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 md:space-x-8 lg:space-x-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center transition-all duration-500 ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'
                  }`}>
                    <motion.div 
                      className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${
                        currentStep >= step.id 
                          ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 text-white transform scale-105' 
                          : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
                      }`}
                      whileHover={{ scale: currentStep >= step.id ? 1.05 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {currentStep > step.id ? (
                        <Icon name="Check" size={window.innerWidth < 640 ? 14 : window.innerWidth < 768 ? 16 : 20} />
                      ) : (
                        <Icon name={step.icon} size={window.innerWidth < 640 ? 14 : window.innerWidth < 768 ? 16 : 20} />
                      )}
                    </motion.div>
                    <div className="mt-2 sm:mt-3 text-center">
                      <span className="hidden xs:block font-medium text-xs sm:text-sm md:text-base">{step.name}</span>
                      <span className="hidden sm:block text-xs md:text-sm opacity-75 text-text-secondary mt-1">{step.description}</span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <motion.div 
                      className={`w-4 xs:w-6 sm:w-8 md:w-12 lg:w-16 h-0.5 mx-1 xs:mx-2 sm:mx-4 transition-all duration-500 ${
                        currentStep > step.id 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                          : 'bg-gray-300'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: currentStep > step.id ? 1 : 0.3 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Information (same as before) */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-6 lg:space-y-8"
                >
                  {/* Information form content - keeping same as original */}
                  {/* [Previous Step 1 content remains the same] */}
                </motion.div>
              )}

              {/* Step 2: Enhanced Payment with Multiple Gateways */}
              {currentStep === 2 && (
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
                      Choose Payment Method
                    </h2>
                    <div className="flex items-center justify-center lg:justify-start mb-3 sm:mb-4">
                      <div className="h-px bg-gradient-to-r from-blue-200 to-indigo-200 w-12 sm:w-16"></div>
                      <Icon name="CreditCard" size={16} className="mx-3 text-blue-500" />
                      <div className="h-px bg-gradient-to-r from-indigo-200 to-blue-200 w-12 sm:w-16"></div>
                    </div>
                    <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                      Select your preferred payment method to complete your purchase securely.
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
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Methods</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                        {availableGateways.map((gateway) => (
                          <motion.div
                            key={gateway.id}
                            className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                              selectedGateway === gateway.id
                                ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                            }`}
                            onClick={() => setSelectedGateway(gateway.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {selectedGateway === gateway.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                              >
                                <Icon name="Check" size={14} className="text-white" />
                              </motion.div>
                            )}

                            <div className="flex items-center space-x-3">
                              {gateway.logo_url && (
                                <img
                                  src={gateway.logo_url}
                                  alt={gateway.name}
                                  className="w-8 h-8 rounded"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{gateway.name}</h4>
                                <p className="text-xs text-gray-600">{gateway.description}</p>
                                {gateway.test_mode && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    Test Mode
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Payment Processing Section */}
                      {selectedGateway && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="border-t border-gray-200 pt-6"
                        >
                          {selectedGateway === 'paypal' && (
                            <PayPalScriptProvider options={{
                              "client-id": paymentContext?.gateway_config?.client_id || "test",
                              currency: paymentContext?.cart?.currency || "USD",
                              intent: "capture"
                            }}>
                              <PayPalButtons
                                createOrder={createPayPalOrder}
                                onApprove={onPayPalApprove}
                                onError={(err) => {
                                  console.error('PayPal error:', err);
                                  alert('Payment failed. Please try again.');
                                }}
                                disabled={isProcessing}
                                style={{
                                  layout: "vertical",
                                  color: "blue",
                                  shape: "rect",
                                  height: 50
                                }}
                              />
                            </PayPalScriptProvider>
                          )}

                          {selectedGateway === 'razorpay' && (
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
                                  <span>Pay ₹{paymentContext?.cart?.total?.toFixed(2)}</span>
                                </div>
                              )}
                            </Button>
                          )}

                          {(selectedGateway === 'stripe' || selectedGateway === 'cashfree' || selectedGateway === 'payu') && (
                            <div className="text-center py-8">
                              <Icon name="Construction" size={48} className="text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600">
                                {availableGateways.find(g => g.id === selectedGateway)?.name} integration coming soon!
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-200/50 space-y-3 sm:space-y-0"
                  >
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={isProcessing}
                      className="w-full sm:w-auto flex items-center justify-center border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      <Icon name="ArrowLeft" size={16} className="mr-2" />
                      Back to Information
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Confirmation (same as before) */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 lg:space-y-8"
                >
                  {/* [Previous Step 3 content remains the same] */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/50 sticky top-20 sm:top-24"
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Icon name="Receipt" size={16} className="text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Order Summary</h3>
              </div>

              {/* Order Items (same as before) */}
              {/* [Previous order summary content] */}

              {/* Enhanced Price Breakdown with backend data */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 mb-6 p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-xl border border-gray-200/50 shadow-inner"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center text-sm">
                    <Icon name="ShoppingBag" size={14} className="mr-2" />
                    Subtotal
                  </span>
                  <span className="font-semibold text-gray-900">
                    {paymentContext?.cart?.currency} {paymentContext?.cart?.subtotal?.toFixed(2) || checkoutData.summary?.subtotal?.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center text-sm">
                    <Icon name="Receipt" size={14} className="mr-2" />
                    Tax
                  </span>
                  <span className="font-semibold text-gray-900">
                    {paymentContext?.cart?.currency} {paymentContext?.cart?.tax?.toFixed(2) || checkoutData.summary?.tax?.toFixed(2)}
                  </span>
                </div>
                
                {paymentContext?.cart?.processing_fee && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center text-sm">
                      <Icon name="CreditCard" size={14} className="mr-2" />
                      Processing Fee
                    </span>
                    <span className="font-semibold text-gray-900">
                      {paymentContext.cart.currency} {paymentContext.cart.processing_fee.toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {paymentContext?.cart?.currency} {paymentContext?.cart?.total?.toFixed(2) || checkoutData.summary?.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Payment Gateway Info */}
              {selectedGateway && availableGateways.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 border border-gray-200 rounded-xl p-4 mb-6 shadow-inner"
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Icon name="Shield" size={16} className="mr-2 text-green-600" />
                    Selected Payment Method
                  </h3>
                  
                  {(() => {
                    const gateway = availableGateways.find(g => g.id === selectedGateway);
                    return gateway ? (
                      <div className="flex items-center space-x-3">
                        {gateway.logo_url && (
                          <img src={gateway.logo_url} alt={gateway.name} className="w-6 h-6 rounded" />
                        )}
                        <div>
                          <p className="font-medium text-sm text-gray-900">{gateway.name}</p>
                          <p className="text-xs text-gray-600">{gateway.description}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </motion.div>
              )}

              {/* [Rest of sidebar content remains the same] */}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
