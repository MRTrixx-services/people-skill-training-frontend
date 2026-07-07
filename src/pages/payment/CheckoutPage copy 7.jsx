// pages/payment/CheckoutPage.jsx
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

  // ✅ FIXED: Use gateway_config from response OR availableGateways
useEffect(() => {
  const initializeStripe = async () => {
    if (selectedGateway === 'stripe' && stripeClientSecret && !stripePromise && !stripeLoading) {
      
      let stripeGateway = null;
      if (storedOrderDetails?.gateway_config?.publishable_key) {
        stripeGateway = { id: 'stripe', configuration: storedOrderDetails.gateway_config };
      } else {
        stripeGateway = availableGateways.find(g => g.id === 'stripe');
      }
      
      if (stripeGateway?.configuration?.publishable_key) {
        setStripeLoading(true);
        try {
          console.log('🔄 Initializing Stripe:', stripeGateway.configuration.publishable_key.slice(0, 15) + '...');
          
          // ✅ FIXED: Set Promise directly (NOT awaited)
          const stripePromiseInstance = loadStripe(stripeGateway.configuration.publishable_key);
          setStripePromise(stripePromiseInstance);
          
          console.log('✅ Stripe Promise set!');
        } catch (error) {
          console.error('❌ Stripe init failed:', error);
        } finally {
          setStripeLoading(false);
        }
      }
    }
  };
  
  initializeStripe();
}, [selectedGateway, stripeClientSecret, availableGateways, stripePromise, stripeLoading, storedOrderDetails]);

  // Fetch existing payment if resuming
  useEffect(() => {
    if (resumePayment && existingPaymentId) {
      fetchExistingPayment();
    }
  }, [resumePayment, existingPaymentId]);

  // ✅ Fetch existing payment with client_secret handling
  const fetchExistingPayment = async () => {
    try {
      setLoadingExistingPayment(true);
      console.log('♻️ Fetching existing payment:', existingPaymentId);
      
      const response = await axiosInstance.get(`/payments/${existingPaymentId}/`);
      
      if (response.data.status === 'pending') {
        setExistingPayment(response.data);
        setSelectedGateway(response.data.payment_method);
        
        // ✅ Handle Stripe client_secret from gateway_response
        if (response.data.payment_method === 'stripe') {
          const clientSecret = response.data.gateway_response?.client_secret;
          
          if (clientSecret) {
            setStripeClientSecret(clientSecret);
            console.log('✅ Loaded existing Stripe client_secret for resume');
          } else {
            console.warn('⚠️ No client_secret found in existing Stripe payment');
          }
        }
        
        console.log('✅ Loaded existing payment:', response.data.transaction_id);
      } else {
        console.warn('⚠️ Payment is no longer pending:', response.data.status);
        navigate('/orders', {
          state: {
            message: `Payment ${response.data.transaction_id} is ${response.data.status}`
          }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching payment:', error);
      navigate('/orders', {
        state: {
          error: 'Failed to load payment details'
        }
      });
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
        console.log('🔄 Fetching payment gateways...');
        const gatewaysResponse = await axiosInstance.get(`/payments/gateways/`);
        
        if (gatewaysResponse.data.success) {
          setAvailableGateways(gatewaysResponse.data.gateways);
          console.log('✅ Available gateways:', gatewaysResponse.data.gateways.map(g => g.id));
          
          if (!resumePayment) {
            setSelectedGateway(gatewaysResponse.data.default_gateway);
            console.log('✅ Default gateway selected:', gatewaysResponse.data.default_gateway);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching payment gateways:', error);
        
        // Fallback gateways
        setAvailableGateways([
          {
            id: 'razorpay',
            name: 'Razorpay',
            description: 'Pay securely with Razorpay - UPI, Cards, Net Banking',
            logo_url: '',
            test_mode: true,
            features: { instant_refunds: true }
          }
        ]);
        
        if (!resumePayment) {
          setSelectedGateway('razorpay');
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
    setFormData(prev => ({
      ...prev,
      country: e.target.value,
    }));
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

  // ✅ Handle Stripe payment success
  const handleStripePaymentSuccess = async (paymentIntent) => {
    try {
      console.log('✅ Stripe payment succeeded:', paymentIntent.id);
      setIsProcessing(true);
      
      const transactionId = storedOrderDetails?.payment?.transaction_id || existingPayment?.transaction_id;
      
      if (!transactionId) {
        throw new Error('Transaction ID not found');
      }
      
      console.log('🔄 Verifying payment with backend:', transactionId);
      
      // Verify payment with backend
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
        console.log('✅ Payment verified successfully');
        
        // Clear cart if new purchase
        if (!resumePayment) {
          clearCart();
        }
        
        // Clear stored data
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('checkoutData');
        localStorage.removeItem('billingInfo');
        
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

  // ✅ Handle Stripe payment error
  const handleStripePaymentError = (error) => {
    console.error('❌ Stripe payment error:', error);
    
    const errorMessage = error?.message || 
                         error?.error?.message || 
                         error?.response?.data?.error || 
                         'Payment failed';
    
    const invoiceNumber = storedOrderDetails?.payment?.invoice_number || 
                         existingPayment?.invoice_number ||
                         `PENDING-${storedOrderDetails?.payment?.id || existingPayment?.id}`;
    
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

  // ✅ FIXED: Process payment (unified for all gateways)
  // const processPayment = async () => {
  //   if (!selectedGateway) {
  //     alert('Please select a payment method');
  //     return;
  //   }

  //   setIsProcessing(true);

  //   try {
  //     // ✅ RESUME FLOW: Handle existing pending payment
  //     if (resumePayment && (existingPayment || existingPaymentId)) {
  //       console.log('♻️ Resuming pending payment...');
        
  //       let paymentData = existingPayment;
        
  //       if (!paymentData && existingPaymentId) {
  //         const response = await axiosInstance.get(`/payments/${existingPaymentId}/`);
  //         paymentData = response.data;
  //       }
        
  //       if (!paymentData) {
  //         throw new Error('No payment data available');
  //       }
        
  //       // Handle Razorpay resume
  //       if (selectedGateway === 'razorpay') {
  //         await handleRazorpayPayment({
  //           gateway_key: paymentData.gateway_config?.key_id,
  //           amount: paymentData.amount,
  //           currency: paymentData.currency,
  //           gateway_order_id: paymentData.gateway_order_id,
  //           transaction_id: paymentData.transaction_id,
  //           payment_id: paymentData.id
  //         });
  //       }
  //       // ✅ Handle Stripe resume
  //       else if (selectedGateway === 'stripe') {
  //         const clientSecret = paymentData.gateway_response?.client_secret || 
  //                             stripeClientSecret;
          
  //         if (clientSecret) {
  //           setStripeClientSecret(clientSecret);
  //           setOrderDetails({ payment: paymentData, client_secret: clientSecret });
  //           console.log('✅ Resumed Stripe payment with client_secret');
  //         } else {
  //           console.warn('⚠️ No client_secret available');
  //         }
  //       }
        
  //       setIsProcessing(false);
  //       return;
  //     }
      
  //     // ✅ NEW PAYMENT FLOW
  //     console.log('✅ Creating new payment for gateway:', selectedGateway);
      
  //     const itemsPayload = checkoutData.items?.map(item => ({
  //       webinar_id: item.webinarId || item.id,
  //       access_type: item.itemType || item.type,
  //       price: parseFloat(item.price)
  //     })) || [];

  //     if (itemsPayload.length === 0) {
  //       alert('No items selected for checkout');
  //       setIsProcessing(false);
  //       return;
  //     }

  //     const response = await axiosInstance.post(`/payments/checkout/`, {
  //       payment_method: selectedGateway,
  //       currency: 'USD',
  //       webinars: itemsPayload,
  //       billing_info: {
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         email: formData.email,
  //         phone: formData.phone,
  //         billingAddress: formData.billingAddress,
  //         city: formData.city,
  //         state: formData.state,
  //         zipCode: formData.zipCode,
  //         country: formData.country,
  //       },
  //       return_url: `${window.location.origin}/checkout/payment-success`,
  //       cancel_url: `${window.location.origin}/checkout/payment-failed`
  //     });

  //     console.log('✅ Backend response received:', response.data.success);

  //     if (response.data.success) {
  // const { payment, gateway_order_id, gateway_config, client_secret } = response.data;

  // const orderDetails = {
  //   payment,
  //   gateway_order_id,
  //   gateway_config,  // ✅ This has the publishable_key!
  //   client_secret
  // };
  
  // localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
  // setOrderDetails(orderDetails);  
  //       // Handle Razorpay
  //       if (selectedGateway === 'razorpay') {
  //         await handleRazorpayPayment({
  //           gateway_key: gateway_config?.key_id,
  //           amount: payment.amount,
  //           currency: payment.currency,
  //           gateway_order_id: gateway_order_id,
  //           transaction_id: payment.transaction_id,
  //           payment_id: payment.id
  //         });
  //       } 
  //       // ✅ FIXED: Handle Stripe - Set client_secret to trigger initialization
  //       else if (selectedGateway === 'stripe') {
  //         if (!client_secret) {
  //           throw new Error('Stripe client_secret not received from server');
  //         }
          
  //         console.log('✅ Stripe client_secret received:', client_secret.slice(0, 25) + '...');
          
  //         // ✅ Set client_secret - this will trigger the useEffect to initialize Stripe
  //         setStripeClientSecret(client_secret);
          
  //         console.log('🎯 Stripe initialization triggered - Payment form will appear');
  //       }
  //     }
  //   } catch (error) {
  //     console.error('❌ Payment processing error:', error);
  //     const errorMessage = error.response?.data?.error || error.message || 'Payment processing failed.';
  //     alert(errorMessage);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const processPayment = async () => {
  if (!selectedGateway) {
    alert('Please select a payment method');
    return;
  }

  setIsProcessing(true);

  try {
    // ✅ MOCK STRIPE CHECKOUT (FRONTEND TEST - REMOVE AFTER BACKEND READY)
    if (selectedGateway === 'stripe' && !resumePayment) {
      console.log('🧪 MOCK: Simulating Stripe Checkout Session');
      
      const mockCheckoutUrl = 'https://checkout.stripe.com/c/pay/cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u';
      
      localStorage.setItem('pendingStripeSession', JSON.stringify({
        session_id: 'cs_test_mock_12345',
        transaction_id: `TXN_MOCK_${Date.now()}`,
        payment_id: 999,
        amount: checkoutData.summary?.total || 189.00
      }));
      
      console.log('✅ Mock URL:', mockCheckoutUrl);
      console.log('🚀 Redirecting to checkout.stripe.com...');
      
      setTimeout(() => {
        window.location.href = mockCheckoutUrl;
      }, 1000);
      
      return;
    }
    
    // ✅ RESUME FLOW: Handle existing pending payment
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
        const clientSecret = paymentData.gateway_response?.client_secret || stripeClientSecret;
        
        if (clientSecret) {
          setStripeClientSecret(clientSecret);
          setOrderDetails({ payment: paymentData, client_secret: clientSecret });
          console.log('✅ Resumed Stripe payment with client_secret');
        }
      }
      
      setIsProcessing(false);
      return;
    }
    
    // ✅ NEW PAYMENT FLOW (Real backend call)
    console.log('✅ Creating new payment for gateway:', selectedGateway);
    
    const itemsPayload = checkoutData.items?.map(item => ({
      webinar_id: item.webinarId || item.id,
      access_type: item.itemType || item.type,
      price: parseFloat(item.price)
    })) || [];

    if (itemsPayload.length === 0) {
      alert('No items selected for checkout');
      setIsProcessing(false);
      return;
    }

    const response = await axiosInstance.post(`/payments/checkout/`, {
      payment_method: selectedGateway,
      currency: 'USD',
      webinars: itemsPayload,
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
      return_url: `${window.location.origin}/checkout/payment-success`,
      cancel_url: `${window.location.origin}/checkout/payment-failed`
    });

    console.log('✅ Backend response received:', response.data.success);

    if (response.data.success) {
      const { payment, gateway_order_id, gateway_config, client_secret } = response.data;

      const orderDetails = {
        payment,
        gateway_order_id,
        gateway_config,
        client_secret
      };
      
      localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
      setOrderDetails(orderDetails);

      if (selectedGateway === 'razorpay') {
        await handleRazorpayPayment({
          gateway_key: gateway_config?.key_id,
          amount: payment.amount,
          currency: payment.currency,
          gateway_order_id: gateway_order_id,
          transaction_id: payment.transaction_id,
          payment_id: payment.id
        });
      } else if (selectedGateway === 'stripe') {
        if (!client_secret) {
          throw new Error('Stripe client_secret not received from server');
        }
        
        console.log('✅ Stripe client_secret received:', client_secret.slice(0, 25) + '...');
        setStripeClientSecret(client_secret);
        console.log('🎯 Stripe initialization triggered');
      }
    }
  } catch (error) {
    console.error('❌ Payment processing error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Payment processing failed.';
    alert(errorMessage);
  } finally {
    setIsProcessing(false);
  }
};


  const handleRazorpayPayment = async (paymentData) => {
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded || !window.Razorpay) {
      alert('Payment gateway is loading. Please try again.');
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
            state: {
              reason: error.response?.data?.error || 'Payment verification failed'
            }
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
      console.error('❌ Razorpay initialization error:', error);
      alert('Failed to open payment gateway.');
      setIsProcessing(false);
    }
  };

  // PayPal handlers
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
    alert('PayPal payment failed. Please try again.');
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
