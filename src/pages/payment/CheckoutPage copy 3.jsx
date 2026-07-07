// pages/CheckoutPage.jsx
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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, total, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  // ✅ Check if resuming pending payment
  const resumePayment = location.state?.resumePayment;
  const existingPaymentId = location.state?.existingPaymentId;
  const existingTransactionId = location.state?.existingTransactionId;
  const orderDetails = location.state?.orderDetails;
  
  // ✅ Use order details if resuming, otherwise use cart items
  const items = resumePayment ? orderDetails?.items : cartItems;
  const checkoutTotal = resumePayment ? orderDetails?.amount : total;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [existingPayment, setExistingPayment] = useState(null);
  const [loadingExistingPayment, setLoadingExistingPayment] = useState(false);
  const [storedOrderDetails, setOrderDetails] = useState(null);
  
  
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
      itemCount: items?.length || 0
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

  // ✅ NEW: Fetch existing payment if resuming
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
        console.log('✅ Loaded existing payment:', response.data.transaction_id);
      } else {
        console.warn('⚠️ Payment is no longer pending:', response.data.status);
        // Redirect to orders page if payment is not pending
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
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, [currentStep]);

  // Fetch available payment gateways
  useEffect(() => {
    const fetchPaymentGateways = async () => {
      if (!isAuthenticated) {
        navigate('/login', {
          state: { from: location.pathname }
        });
        return;
      }

      try {
        setGatewaysLoading(true);
        
        const gatewaysResponse = await axiosInstance.get(`/payments/gateways/`);
        
        if (gatewaysResponse.data.success) {
          setAvailableGateways(gatewaysResponse.data.gateways);
          
          // ✅ Only set default gateway if not resuming payment
          if (!resumePayment) {
            setSelectedGateway(gatewaysResponse.data.default_gateway);
          }
        }
      } catch (error) {
        console.error('Error fetching payment gateways:', error);
        
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

  // ✅ Updated: Don't redirect if resuming payment
  useEffect(() => {
    if (!resumePayment && (!items || items.length === 0)) {
      navigate('/cart');
    }
  }, [items, navigate, resumePayment]);

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

  // ✅ UPDATED: Process payment with resume payment support
  const processPayment = async () => {
  if (!selectedGateway) {
    alert('Please select a payment method');
    return;
  }

  setIsProcessing(true);

  try {
    // ✅ If resuming payment, use existing payment data
    // Check for EITHER existingPayment state OR resumePayment flag with existingPaymentId
    if (resumePayment && (existingPayment || existingPaymentId)) {
      console.log('♻️ Resuming pending payment...');
      
      // ✅ If existingPayment is not loaded yet, fetch it now
      let paymentData = existingPayment;
      
      if (!paymentData && existingPaymentId) {
        console.log('📥 Fetching existing payment:', existingPaymentId);
        try {
          const response = await axiosInstance.get(`/payments/${existingPaymentId}/`);
          paymentData = response.data;
          console.log('✅ Loaded existing payment:', paymentData.transaction_id);
        } catch (error) {
          console.error('❌ Failed to load existing payment:', error);
          throw new Error('Failed to load payment details');
        }
      }
      
      if (!paymentData) {
        throw new Error('No payment data available');
      }
      
      console.log('♻️ Continuing with existing payment:', paymentData.transaction_id);
      console.log('📦 Payment details:', {
        transaction_id: paymentData.transaction_id,
        gateway_order_id: paymentData.gateway_order_id,
        amount: paymentData.amount,
        status: paymentData.status
      });
      
      // ✅ Proceed directly to payment gateway with existing payment
      if (selectedGateway === 'razorpay') {
        await handleRazorpayPayment({
          gateway_key: paymentData.gateway_config?.key_id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          gateway_order_id: paymentData.gateway_order_id,
          transaction_id: paymentData.transaction_id,
          payment_id: paymentData.id
        });
      } else if (selectedGateway === 'paypal') {
        // Handle PayPal for existing payment
        console.log('PayPal payment resumption not yet implemented');
        return paymentData;
      }
      
      return; // ✅ CRITICAL: Exit here - don't call checkout API
    }
    
    // ✅ Normal checkout flow for new purchases
    console.log('✅ Creating new payment...');
    
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

    console.log('📤 Checkout payload:', {
      payment_method: selectedGateway,
      currency: 'USD',
      webinars: itemsPayload
    });

    const response = await axiosInstance.post(`/payments/checkout/`, {
      payment_method: selectedGateway,
      currency: 'USD',
      webinars: itemsPayload,
      billing_info: formData,
      return_url: `${window.location.origin}/checkout/payment-success`,
      cancel_url: `${window.location.origin}/checkout/payment-failed`
    });

    if (response.data.success) {
      const { message, payment, gateway_order_id, gateway_config } = response.data;
      
      // ✅ Log if backend reused existing payment
      if (message === 'Resuming existing payment') {
        console.log('♻️ Backend reused existing payment:', payment.transaction_id);
      } else {
        console.log('✅ Created new payment:', payment.transaction_id);
      }

      if (selectedGateway === 'razorpay') {
        await handleRazorpayPayment({
          gateway_key: gateway_config?.key_id,
          amount: payment.amount,
          currency: payment.currency,
          gateway_order_id: gateway_order_id,
          transaction_id: payment.transaction_id,
          payment_id: payment.id
        });
      } else if (selectedGateway === 'paypal') {
        return response.data;
      }
    }
  } catch (error) {
    console.error('❌ Payment processing error:', error);
    
    // Better error message
    const errorMessage = error.response?.data?.error 
      || error.message 
      || 'Payment processing failed. Please try again.';
    
    alert(errorMessage);
  } finally {
    setIsProcessing(false);
  }
};


  // ✅ Handle Razorpay with loading check
  const handleRazorpayPayment = async (paymentData) => {
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded || !window.Razorpay) {
      alert('Payment gateway is loading. Please try again in a moment.');
      console.error('Razorpay SDK not loaded');
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
          console.log('✅ Razorpay payment successful, verifying...');
          
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
          console.log('✅ Payment verified successfully');
          
          // Clear cart only for new purchases (not when resuming)
          if (!resumePayment) {
            clearCart();
          }
          
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
        } else {
          // Payment verification failed
          const invoiceNumber = verifyResponse.data.payment?.invoice_number || `PENDING-${paymentData.payment_id}`;
          
          navigate(`/checkout/payment-failed/${invoiceNumber}`, {
            state: {
              orderId: paymentData.payment_id,
              transactionId: paymentData.transaction_id,
              invoiceNumber: invoiceNumber,
              amount: paymentData.amount,
              currency: paymentData.currency,
              items: checkoutData.items,
              reason: verifyResponse.data.error || 'Payment verification failed'
            }
          });
        }
      } catch (error) {
        console.error('❌ Payment verification failed:', error);
        
        const invoiceNumber = `PENDING-${paymentData.payment_id}`;
        
        navigate(`/checkout/payment-failed/${invoiceNumber}`, {
          state: {
            orderId: paymentData.payment_id,
            transactionId: paymentData.transaction_id,
            invoiceNumber: invoiceNumber,
            amount: paymentData.amount,
            currency: paymentData.currency,
            items: checkoutData.items,
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
      theme: {
        color: '#6366f1'
      },
      modal: {
        ondismiss: function() {
          console.log('⚠️ Razorpay modal closed by user');
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('❌ Razorpay initialization error:', error);
      alert('Failed to open payment gateway. Please try again.');
      setIsProcessing(false);
    }
  };

// const createPayPalOrder = async (data, actions) => {
//   try {
//     console.log('📦 Creating PayPal order...');
//     console.log('💰 Checkout data:', checkoutData);
    
//     const itemsPayload = checkoutData.items?.map(item => ({
//       webinar_id: item.webinarId || item.id,
//       access_type: item.itemType || item.type,
//       price: parseFloat(item.price)
//     })) || [];

//     if (itemsPayload.length === 0) {
//       console.error('❌ No items in checkout');
//       throw new Error('No items selected for checkout');
//     }

//     console.log('📤 Calling checkout API for PayPal...');
    
//     const response = await axiosInstance.post(`/payments/checkout/`, {
//       payment_method: 'paypal',
//       currency: checkoutData.summary?.currency || 'USD',
//       webinars: itemsPayload,
//       billing_info: formData,
//       return_url: `${window.location.origin}/checkout/payment-success`,
//       cancel_url: `${window.location.origin}/checkout/payment-failed`
//     });

//     if (!response.data.success) {
//       console.error('❌ Checkout API failed:', response.data);
//       throw new Error(response.data.error || 'Failed to create payment');
//     }

//     const { payment, gateway_order_id } = response.data;
    
//     console.log('✅ Payment created:', payment.transaction_id);
    
//     // ✅ Store payment data for later use
//     setOrderDetails(response.data);
    
//     // ✅ FIXED: Removed invoice_id to prevent DUPLICATE_INVOICE_ID error
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: {
//             currency_code: payment.currency || 'USD',
//             value: parseFloat(payment.amount).toFixed(2),
//           },
//           description: `Webinar Purchase - Order #${payment.transaction_id}`,
//           custom_id: payment.transaction_id,  // ✅ Use custom_id for tracking
//           // ❌ REMOVED: invoice_id: gateway_order_id,  // This was causing the error
//         },
//       ],
//       application_context: {
//         brand_name: 'PeopleSkillTraining',
//         shipping_preference: 'NO_SHIPPING',
//       },
//     });
    
//   } catch (error) {
//     console.error('❌ PayPal order creation error:', error);
//     alert(error.response?.data?.error || error.message || 'Failed to create PayPal order');
//     throw error;
//   }
// };

const createPayPalOrder = async (data, actions) => {
  try {
    console.log('📦 Creating PayPal order...');
    
    // ✅ If resuming payment, use existing payment data
    if (resumePayment && existingPayment) {
      console.log('♻️ Resuming PayPal payment:', existingPayment.transaction_id);
      
      // Store existing payment data
      setOrderDetails({ payment: existingPayment });
      
      // Return existing PayPal order ID
      return existingPayment.gateway_order_id;
    }
    
    console.log('💰 Checkout data:', checkoutData);
    
    const itemsPayload = checkoutData.items?.map(item => ({
      webinar_id: item.webinarId || item.id,
      access_type: item.itemType || item.type,
      price: parseFloat(item.price)
    })) || [];

    if (itemsPayload.length === 0) {
      console.error('❌ No items in checkout');
      throw new Error('No items selected for checkout');
    }

    console.log('📤 Calling checkout API for PayPal...');
    
    const response = await axiosInstance.post(`/payments/checkout/`, {
      payment_method: 'paypal',
      currency: checkoutData.summary?.currency || 'USD',
      webinars: itemsPayload,
      billing_info: formData,
      return_url: `${window.location.origin}/checkout/payment-success`,
      cancel_url: `${window.location.origin}/checkout/payment-failed`
    });

    if (!response.data.success) {
      console.error('❌ Checkout API failed:', response.data);
      throw new Error(response.data.error || 'Failed to create payment');
    }

    const { payment, gateway_order_id } = response.data;
    
    console.log('✅ Payment created:', payment.transaction_id);
    
    // Store payment data for later use
    setOrderDetails(response.data);
    
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: payment.currency || 'USD',
            value: parseFloat(payment.amount).toFixed(2),
          },
          description: `Webinar Purchase - Order #${payment.transaction_id}`,
          custom_id: payment.transaction_id,
        },
      ],
      application_context: {
        brand_name: 'PeopleSkillTraining',
        shipping_preference: 'NO_SHIPPING',
      },
    });
    
  } catch (error) {
    console.error('❌ PayPal order creation error:', error);
    alert(error.response?.data?.error || error.message || 'Failed to create PayPal order');
    throw error;
  }
};

useEffect(() => {
  // ✅ Update checkout data when items change
  if (items && items.length > 0) {
    setCheckoutData({
      items: items,
      summary: {
        subtotal: checkoutTotal,
        total: checkoutTotal,
        itemCount: items.length,
        currency: 'USD'  // ✅ Add currency here
      }
    });
  }
}, [items, checkoutTotal]);


// ✅ Update onPayPalApprove with better error handling
// const onPayPalApprove = async (data, actions) => {
//   try {
//     const details = await actions.order.capture();
    
//     console.log('✅ PayPal payment captured:', details);
//     console.log('📦 Stored order details:', storedOrderDetails);

//     // ✅ Get transaction ID with fallback
//     let transactionId = storedOrderDetails?.payment?.transaction_id;
    
//     // ✅ If no stored details, try to get from existing payment
//     if (!transactionId && existingPayment) {
//       transactionId = existingPayment.transaction_id;
//       console.log('📥 Using existing payment transaction ID:', transactionId);
//     }
    
//     // ✅ Last resort: use PayPal order ID
//     if (!transactionId) {
//       console.warn('⚠️ No transaction ID found, using PayPal order ID');
//       transactionId = details.id;
//     }
    
//     console.log('🔍 Verifying payment with transaction ID:', transactionId);

//     const verifyResponse = await axiosInstance.post(`/payments/verify/`, {
//       payment_method: 'paypal',
//       transaction_id: transactionId,
//       payment_data: {
//         payment_id: details.id,
//         order_id: details.id,
//         paypal_order_id: details.id,
//         payer_id: data.payerID,
//         capture_details: details,
//       }
//     });

//     if (verifyResponse.data.success) {
//       console.log('✅ Payment verified successfully');
      
//       // Clear cart only for new purchases
//       if (!resumePayment) {
//         clearCart();
//       }
      
//       setCurrentStep(3);
      
//       setTimeout(() => {
//         navigate(`/checkout/payment-success`, {
//           state: {
//             orderId: verifyResponse.data.payment.id,
//             transactionId: verifyResponse.data.payment.transaction_id,
//             amount: verifyResponse.data.payment.amount,
//             currency: verifyResponse.data.payment.currency,
//             items: checkoutData.items,
//             paymentMethod: 'paypal'
//           }
//         });
//       }, 1500);
//     }
//   } catch (error) {
//     console.error('❌ PayPal payment approval error:', error);
    
//     // ✅ Better error handling
//     const errorMessage = error.response?.data?.error 
//       || error.response?.data?.message 
//       || error.message 
//       || 'Payment verification failed';
    
//     alert(`Payment verification failed: ${errorMessage}`);
    
//     // Don't navigate to failed page immediately - let user retry
//     setIsProcessing(false);
//   }
// };

const onPayPalApprove = async (data, actions) => {
  try {
    const details = await actions.order.capture();
    
    console.log('✅ PayPal payment captured:', details);
    console.log('📦 Stored order details:', storedOrderDetails);

    // Get transaction ID with fallback
    let transactionId = storedOrderDetails?.payment?.transaction_id;
    
    if (!transactionId && existingPayment) {
      transactionId = existingPayment.transaction_id;
      console.log('📥 Using existing payment transaction ID:', transactionId);
    }
    
    if (!transactionId) {
      console.warn('⚠️ No transaction ID found, using PayPal order ID');
      transactionId = details.id;
    }
    
    console.log('🔍 Verifying payment with transaction ID:', transactionId);

    const verifyResponse = await axiosInstance.post(`/payments/verify/`, {
      payment_method: 'paypal',
      transaction_id: transactionId,
      payment_data: {
        payment_id: details.id,
        order_id: details.id,
        paypal_order_id: details.id,
        payer_id: data.payerID,
        capture_details: details,
      }
    });

    if (verifyResponse.data.success) {
      console.log('✅ Payment verified successfully');
      
      // Clear cart only for new purchases
      if (!resumePayment) {
        clearCart();
      }
      
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
    } else {
      // Payment verification failed
      const invoiceNumber = verifyResponse.data.payment?.invoice_number || `PENDING-${transactionId}`;
      
      navigate(`/checkout/payment-failed/${invoiceNumber}`, {
        state: {
          orderId: transactionId,
          transactionId: transactionId,
          invoiceNumber: invoiceNumber,
          amount: checkoutData.summary?.total,
          currency: checkoutData.summary?.currency || 'USD',
          items: checkoutData.items,
          reason: verifyResponse.data.error || 'Payment verification failed'
        }
      });
    }
  } catch (error) {
    console.error('❌ PayPal payment approval error:', error);
    
    const errorMessage = error.response?.data?.error 
      || error.response?.data?.message 
      || error.message 
      || 'Payment verification failed';
    
    const invoiceNumber = storedOrderDetails?.payment?.invoice_number || `PENDING-${storedOrderDetails?.payment?.id}`;
    
    navigate(`/checkout/payment-failed/${invoiceNumber}`, {
      state: {
        orderId: storedOrderDetails?.payment?.id,
        transactionId: storedOrderDetails?.payment?.transaction_id,
        invoiceNumber: invoiceNumber,
        amount: checkoutData.summary?.total,
        currency: checkoutData.summary?.currency || 'USD',
        items: checkoutData.items,
        reason: errorMessage
      }
    });
  }
};

// ✅ Add PayPal error handler
const onPayPalError = (error) => {
  console.error('❌ PayPal error:', error);
  alert('PayPal payment failed. Please try again or use another payment method.');
  setIsProcessing(false);
};


// ✅ Add PayPal cancel handler
const onPayPalCancel = () => {
  console.log('⚠️ PayPal payment cancelled by user');
  setIsProcessing(false);
};

  const isFormComplete = () => {
    return formData?.firstName && 
           formData?.lastName && 
           formData?.email && 
           formData?.agreeTerms;
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

  // ✅ Show loading if fetching existing payment
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

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-14 sm:pt-16 md:pt-18 lg:pt-20">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-4 sm:py-6 lg:py-8">
        <CheckoutHeader />
        
        {/* ✅ Show notification if resuming payment */}
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
                  processPayment={processPayment}
                  createPayPalOrder={createPayPalOrder}
                  onPayPalApprove={onPayPalApprove}
                  onPayPalError={onPayPalError}      // ✅ Add this
                  onPayPalCancel={onPayPalCancel}   
                  checkoutData={checkoutData}
                  handleBack={handleBack}
                  getGatewayDisplayInfo={getGatewayDisplayInfo}
                  gatewaysLoading={gatewaysLoading}
                  resumePayment={resumePayment} // ✅ Pass flag
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
              resumePayment={resumePayment} // ✅ Pass flag
              existingTransactionId={existingTransactionId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
