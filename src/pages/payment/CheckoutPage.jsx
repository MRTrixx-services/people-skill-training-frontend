
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useCart } from 'contexts/CartContext';
import { useAuth } from 'contexts/AuthContext';
import Icon from 'components/AppIcon';

// Import modular components
import CheckoutProgressSteps from './components/CheckoutProgressSteps';
import CheckoutStepOne from './components/CheckoutStepOne';
import CheckoutStepTwo from './components/CheckoutStepTwo';
import CheckoutStepThree from './components/CheckoutStepThree';
import OrderSummary from './components/OrderSummary';
import CheckoutHeader from './components/CheckoutHeader';
import axiosInstance from 'config/axiosInstance';
import { loadRazorpayScript } from 'utils/loadRazorpay';

// Stripe imports
import { loadStripe } from '@stripe/stripe-js';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, total, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  // Check if resuming pending payment
  const resumePayment = location.state?.resumePayment;
  const existingPaymentId = location.state?.existingPaymentId;
  const existingTransactionId = location.state?.existingTransactionId;
  const orderDetails = location.state?.orderDetails;
  
  // Use order details if resuming, otherwise use cart items
  const items = resumePayment ? orderDetails?.items : cartItems;
  const checkoutTotal = resumePayment ? orderDetails?.amount : total;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [existingPayment, setExistingPayment] = useState(null);
  const [loadingExistingPayment, setLoadingExistingPayment] = useState(false);
  const [storedOrderDetails, setOrderDetails] = useState(null);
  
  // Stripe states
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  
  // Payment gateway states
  const [availableGateways, setAvailableGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [gatewaysLoading, setGatewaysLoading] = useState(true);
  
  // Get passed data from cart or initialize with cart data
  const [checkoutData, setCheckoutData] = useState({
    items: items || [],
    summary: {
      subtotal: checkoutTotal,
      total: checkoutTotal,
      itemCount: items?.length || 0,
      currency: 'USD'
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
    country: 'US',
    agreeTerms: false,
    subscribeNewsletter: false,
  });

  // ✅ Initialize Stripe AFTER gateways are loaded
  useEffect(() => {
    const initializeStripe = async () => {
      if (!stripePromise && availableGateways.length > 0) {
        try {
          const stripeGateway = availableGateways.find(g => g.id === 'stripe');
          
          if (stripeGateway?.configuration?.publishable_key) {
            console.log('🔄 Initializing Stripe from gateway config...');
            const stripePromiseInstance = loadStripe(stripeGateway.configuration.publishable_key);
            setStripePromise(stripePromiseInstance);
            console.log('✅ Stripe loaded successfully!');
          } else {
            console.warn('⚠️ No Stripe gateway found or publishable_key missing');
          }
        } catch (error) {
          console.error('❌ Stripe init failed:', error);
        }
      }
    };
    
    initializeStripe();
  }, [availableGateways, stripePromise]);

  // Fetch existing payment if resuming
  useEffect(() => {
    if (resumePayment && existingPaymentId) {
      fetchExistingPayment();
    }
  }, [resumePayment, existingPaymentId]);

  const fetchExistingPayment = async () => {
    try {
      setLoadingExistingPayment(true);
      console.log('♻️ Fetching existing payment:', existingPaymentId);
      
      const response = await axiosInstance.get(`/payments/${existingPaymentId}/`);
      
      if (response.data.status === 'pending') {
        setExistingPayment(response.data);
        setSelectedGateway(response.data.payment_method);
        
        if (response.data.payment_method === 'stripe') {
          const clientSecret = response.data.gateway_response?.client_secret;
          if (clientSecret) {
            setStripeClientSecret(clientSecret);
          }
        }
      } else {
        navigate('/orders', {
          state: { message: `Payment ${response.data.transaction_id} is ${response.data.status}` }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching payment:', error);
      navigate('/orders', { state: { error: 'Failed to load payment details' } });
    } finally {
      setLoadingExistingPayment(false);
    }
  };

  // Load Razorpay script on component mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Fetch available payment gateways
  useEffect(() => {
    const fetchPaymentGateways = async () => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      try {
        setGatewaysLoading(true);
        const gatewaysResponse = await axiosInstance.get(`/payments/gateways/`);
        
        if (gatewaysResponse.data.success) {
          setAvailableGateways(gatewaysResponse.data.gateways);
          if (!resumePayment) {
            setSelectedGateway(gatewaysResponse.data.default_gateway);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching payment gateways:', error);
        setAvailableGateways([
          {
            id: 'stripe',
            name: 'Stripe',
            description: 'Pay with card',
            logo_url: '',
            test_mode: true,
            features: { instant_refunds: true },
            configuration: {
              publishable_key: 'pk_test_51SRs6pSgblgLeWtDnDfFqpJRFNPgu6b5zdpdzjHjsVmHMDaB9ghu9aUvd1izIUZCDpQ0Y2wsHLGdTaTWZoqB7Nzo00eShwDPt8'
            }
          }
        ]);
        if (!resumePayment) {
          setSelectedGateway('stripe');
        }
      } finally {
        setGatewaysLoading(false);
      }
    };

    fetchPaymentGateways();
  }, [isAuthenticated, navigate, resumePayment]);

  useEffect(() => {
    if (!resumePayment && (!items || items.length === 0)) {
      navigate('/cart');
    }
  }, [items, navigate, resumePayment]);

  useEffect(() => {
    if (items && items.length > 0) {
      setCheckoutData({
        items: items,
        summary: {
          subtotal: checkoutTotal,
          total: checkoutTotal,
          itemCount: items.length,
          currency: 'USD'
        }
      });
    }
  }, [items, checkoutTotal]);

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

  const handleCountryChange = (e) => {
    setFormData(prev => ({ ...prev, country: e.target.value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
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

  // ✅ COMPLETE STRIPE PAYMENT HANDLERS (PaymentIntent mode fallback)
  const handleStripePaymentSuccess = async (paymentIntent) => {
    try {
      console.log('✅ Stripe payment succeeded:', paymentIntent.id);
      setIsProcessing(true);
      
      const transactionId = storedOrderDetails?.payment?.transaction_id || existingPayment?.transaction_id;
      
      if (!transactionId) {
        throw new Error('Transaction ID not found');
      }
      
      const verifyResponse = await axiosInstance.post(`/payments/verify/`, {
        payment_method: 'stripe',
        transaction_id: transactionId,
        payment_data: {
          payment_intent_id: paymentIntent.id,
          order_id: paymentIntent.id,
          payment_intent_details: paymentIntent
        }
      });

      if (verifyResponse.data.success) {
        if (!resumePayment) clearCart();
        localStorage.removeItem('pendingOrder');
        setCurrentStep(3);
        
        const invoiceNumber = verifyResponse.data.payment.invoice_number || `PENDING-${verifyResponse.data.payment.id}`;
        
        setTimeout(() => {
          navigate(`/checkout/payment-success/${invoiceNumber}`, {
            state: {
              orderId: verifyResponse.data.payment.id,
              transactionId: verifyResponse.data.payment.transaction_id,
              invoiceNumber: invoiceNumber,
              amount: verifyResponse.data.payment.amount,
              currency: verifyResponse.data.payment.currency,
              items: checkoutData.items,
              paymentMethod: 'stripe'
            }
          });
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Stripe payment verification failed:', error);
      handleStripePaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePaymentError = (error) => {
    console.error('❌ Stripe payment error:', error);
    
    const errorMessage = error?.message || error?.error?.message || 'Payment failed';
    const invoiceNumber = `PENDING-${storedOrderDetails?.payment?.id || existingPayment?.id}`;
    
    navigate(`/checkout/payment-failed/${invoiceNumber}`, {
      state: {
        orderId: storedOrderDetails?.payment?.id || existingPayment?.id,
        transactionId: storedOrderDetails?.payment?.transaction_id || existingPayment?.transaction_id,
        invoiceNumber: invoiceNumber,
        amount: checkoutData.summary?.total,
        currency: 'USD',
        items: checkoutData.items,
        reason: errorMessage,
        paymentMethod: 'stripe'
      }
    });
  };

  // ✅ MAIN PROCESS PAYMENT - STRIPE CHECKOUT SESSION + MULTIPLE ITEMS
  const processPayment = async () => {
    if (!selectedGateway) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // RESUME FLOW
      if (resumePayment && (existingPayment || existingPaymentId)) {
        console.log('♻️ Resuming pending payment...');
        
        let paymentData = existingPayment;
        if (!paymentData && existingPaymentId) {
          const response = await axiosInstance.get(`/payments/${existingPaymentId}/`);
          paymentData = response.data;
        }
        
        if (!paymentData) {
          throw new Error('No payment data available');
        }
        
        if (selectedGateway === 'razorpay') {
          await handleRazorpayPayment({
            gateway_key: paymentData.gateway_config?.key_id,
            amount: paymentData.amount,
            currency: paymentData.currency,
            gateway_order_id: paymentData.gateway_order_id,
            transaction_id: paymentData.transaction_id,
            payment_id: paymentData.id
          });
        } else if (selectedGateway === 'stripe') {
          // ✅ Check for checkout_url (Checkout Session) OR client_secret (PaymentIntent)
          const checkoutUrl = paymentData.gateway_response?.checkout_url;
          const clientSecret = paymentData.gateway_response?.client_secret;
          
          if (checkoutUrl) {
            console.log('✅ Redirecting to existing Stripe Checkout Session');
            window.location.href = checkoutUrl;
            return;
          } else if (clientSecret) {
            setStripeClientSecret(clientSecret);
            setOrderDetails({ payment: paymentData, client_secret: clientSecret });
          }
        }
        
        setIsProcessing(false);
        return;
      }
      
      // ✅ NEW PAYMENT FLOW - MULTIPLE LINE ITEMS
      console.log('✅ Creating new payment for gateway:', selectedGateway);
      
      const itemsPayload = checkoutData.items?.map(item => ({
        webinar_id: item.webinarId || item.id,
        access_type: item.itemType || item.type,
        price: parseFloat(item.price),
        title: item.title || `Webinar ${item.webinarId || item.id}`,           // ✅ For Stripe
        description: item.description || `${item.itemType || item.type} Access`  // ✅ For Stripe
      })) || [];

      if (itemsPayload.length === 0) {
        alert('No items selected for checkout');
        setIsProcessing(false);
        return;
      }

      const response = await axiosInstance.post(`/payments/checkout/`, {
        payment_method: selectedGateway,
        currency: 'USD',
        webinars: itemsPayload,  // ✅ Multiple items with titles/descriptions
        billing_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          billingAddress: formData.billingAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        return_url: `${window.location.origin}/checkout/stripe-return`,  // ✅ Stripe Checkout
        cancel_url: `${window.location.origin}/checkout/payment-failed`
      });

      console.log('✅ Backend response:', response.data);

      if (response.data.success) {
        const { payment, gateway_order_id, gateway_config, client_secret, checkout_url } = response.data;

        const orderDetails = {
          payment,
          gateway_order_id,
          gateway_config,
          client_secret,
          checkout_url
        };
        
        localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
        setOrderDetails(orderDetails);

        // ✅ STRIPE: Check for checkout_url first (Checkout Session)
        if (selectedGateway === 'stripe') {
          if (checkout_url) {
            console.log('✅ Stripe Checkout URL received:', checkout_url);
            console.log('🚀 Redirecting to checkout.stripe.com...');
            
            // Save session info
            localStorage.setItem('pendingStripeSession', JSON.stringify({
              session_id: gateway_order_id,
              transaction_id: payment.transaction_id,
              payment_id: payment.id,
              amount: payment.amount
            }));
            
            // Redirect to Stripe
            window.location.href = checkout_url;
            return;
          } else if (client_secret) {
            console.log('✅ Stripe client_secret received (PaymentIntent mode)');
            setStripeClientSecret(client_secret);
          } else {
            throw new Error('No Stripe checkout_url or client_secret received');
          }
        } 
        // RAZORPAY
        else if (selectedGateway === 'razorpay') {
          await handleRazorpayPayment({
            gateway_key: gateway_config?.key_id,
            amount: payment.amount,
            currency: payment.currency,
            gateway_order_id: gateway_order_id,
            transaction_id: payment.transaction_id,
            payment_id: payment.id
          });
        }
      }
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      alert(error.response?.data?.error || error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ RAZORPAY HANDLER (unchanged)
  const handleRazorpayPayment = async (paymentData) => {
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded || !window.Razorpay) {
      alert('Payment gateway loading. Please try again.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: paymentData.gateway_key,
      amount: paymentData.amount * 100,
      currency: paymentData.currency,
      order_id: paymentData.gateway_order_id,
      name: 'PeopleSkillTraining',
      description: `Order #${paymentData.transaction_id}`,
      handler: async (response) => {
        try {
          const verifyResponse = await axiosInstance.post(`/payments/verify/`, {
            payment_method: 'razorpay',
            transaction_id: paymentData.transaction_id,
            payment_data: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }
          });

          if (verifyResponse.data.success) {
            if (!resumePayment) clearCart();
            setCurrentStep(3);
            
            const invoiceNumber = verifyResponse.data.payment.invoice_number || `PENDING-${verifyResponse.data.payment.id}`;
            
            setTimeout(() => {
              navigate(`/checkout/payment-success/${invoiceNumber}`, {
                state: {
                  orderId: verifyResponse.data.payment.id,
                  transactionId: verifyResponse.data.payment.transaction_id,
                  invoiceNumber: invoiceNumber,
                  amount: verifyResponse.data.payment.amount,
                  currency: verifyResponse.data.payment.currency,
                  items: checkoutData.items,
                  paymentMethod: 'razorpay'
                }
              });
            }, 1500);
          }
        } catch (error) {
          console.error('❌ Payment verification failed:', error);
          navigate(`/checkout/payment-failed/PENDING-${paymentData.payment_id}`, {
            state: { reason: error.response?.data?.error || 'Payment verification failed' }
          });
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: '#6366f1' },
      modal: {
        ondismiss: () => setIsProcessing(false)
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('❌ Razorpay error:', error);
      alert('Failed to open payment gateway.');
      setIsProcessing(false);
    }
  };

  // PayPal handlers (unchanged)
  const createPayPalOrder = async (data, actions) => {
    try {
      if (resumePayment && existingPayment) {
        setOrderDetails({ payment: existingPayment });
        return existingPayment.gateway_order_id;
      }
      
      const itemsPayload = checkoutData.items?.map(item => ({
        webinar_id: item.webinarId || item.id,
        access_type: item.itemType || item.type,
        price: parseFloat(item.price)
      })) || [];

      const response = await axiosInstance.post(`/payments/checkout/`, {
        payment_method: 'paypal',
        currency: checkoutData.summary?.currency || 'USD',
        webinars: itemsPayload,
        billing_info: formData,
        return_url: `${window.location.origin}/checkout/payment-success`,
        cancel_url: `${window.location.origin}/checkout/payment-failed`
      });

      const { payment } = response.data;
      setOrderDetails(response.data);
      
      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: payment.currency || 'USD',
            value: parseFloat(payment.amount).toFixed(2),
          },
          description: `Webinar Purchase - Order #${payment.transaction_id}`,
          custom_id: payment.transaction_id,
        }],
        application_context: {
          brand_name: 'PeopleSkillTraining',
          shipping_preference: 'NO_SHIPPING',
        },
      });
    } catch (error) {
      console.error('❌ PayPal order creation error:', error);
      throw error;
    }
  };

  const onPayPalApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      const transactionId = storedOrderDetails?.payment?.transaction_id || existingPayment?.transaction_id;

      const verifyResponse = await axiosInstance.post(`/payments/verify/`, {
        payment_method: 'paypal',
        transaction_id: transactionId,
        payment_data: {
          payment_id: details.id,
          order_id: details.id,
          payer_id: data.payerID,
          capture_details: details,
        }
      });

      if (verifyResponse.data.success) {
        if (!resumePayment) clearCart();
        setCurrentStep(3);
        
        const invoiceNumber = verifyResponse.data.payment.invoice_number || `PENDING-${verifyResponse.data.payment.id}`;
        
        setTimeout(() => {
          navigate(`/checkout/payment-success/${invoiceNumber}`, {
            state: {
              orderId: verifyResponse.data.payment.id,
              transactionId: verifyResponse.data.payment.transaction_id,
              invoiceNumber: invoiceNumber,
              amount: verifyResponse.data.payment.amount,
              currency: verifyResponse.data.payment.currency,
              items: checkoutData.items,
              paymentMethod: 'paypal'
            }
          });
        }, 1500);
      }
    } catch (error) {
      console.error('❌ PayPal payment approval error:', error);
    }
  };

  const onPayPalError = (error) => {
    console.error('❌ PayPal error:', error);
    alert('PayPal payment failed.');
    setIsProcessing(false);
  };

  const onPayPalCancel = () => {
    setIsProcessing(false);
  };

  const isFormComplete = () => {
    return formData?.firstName && formData?.lastName && formData?.email && formData?.agreeTerms;
  };

  const getGatewayDisplayInfo = (gateway) => {
    const gatewayInfo = {
           razorpay: {
        color: 'from-blue-600 to-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      paypal: {
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      stripe: {
        color: 'from-indigo-600 to-purple-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        textColor: 'text-indigo-800',
        badgeColor: 'bg-indigo-100 text-indigo-800'
      }
    };
    return gatewayInfo[gateway?.id] || gatewayInfo.razorpay;
  };

  if (loadingExistingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-14 sm:pt-16 md:pt-18 lg:pt-20">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-4 sm:py-6 lg:py-8">
        <CheckoutHeader 
          resumePayment={resumePayment}
          existingTransactionId={existingTransactionId}
        />
        
        {resumePayment && existingPayment && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={20} className="text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-yellow-800">Resuming Pending Payment</p>
                <p className="text-sm text-yellow-700">
                  Transaction ID: <span className="font-mono">{existingTransactionId}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <CheckoutProgressSteps currentStep={currentStep} steps={steps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <CheckoutStepOne
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleCountryChange={handleCountryChange}
                  handleNext={handleNext}
                  isFormComplete={isFormComplete}
                />
              )}

              {currentStep === 2 && (
                <CheckoutStepTwo
                  availableGateways={availableGateways}
                  selectedGateway={selectedGateway}
                  setSelectedGateway={setSelectedGateway}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  processPayment={processPayment}
                  createPayPalOrder={createPayPalOrder}
                  onPayPalApprove={onPayPalApprove}
                  onPayPalError={onPayPalError}
                  onPayPalCancel={onPayPalCancel}
                  checkoutData={checkoutData}
                  handleBack={handleBack}
                  getGatewayDisplayInfo={getGatewayDisplayInfo}
                  gatewaysLoading={gatewaysLoading}
                  resumePayment={resumePayment}
                  stripeClientSecret={stripeClientSecret}
                  stripePromise={stripePromise}
                  stripeLoading={stripeLoading}
                  onStripePaymentSuccess={handleStripePaymentSuccess}
                  onStripePaymentError={handleStripePaymentError}
                />
              )}

              {currentStep === 3 && <CheckoutStepThree />}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              checkoutData={checkoutData}
              selectedGateway={selectedGateway}
              availableGateways={availableGateways}
              getGatewayDisplayInfo={getGatewayDisplayInfo}
              resumePayment={resumePayment}
              existingTransactionId={existingTransactionId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
