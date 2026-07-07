// pages/payment/PaymentFailedPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import { useAuth } from 'contexts/AuthContext';
import axiosInstance from 'config/axiosInstance';

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  // ✅ Get transaction ID from multiple sources
  const getTransactionId = () => {
    // Priority 1: Path parameter
    if (params.transactionId && params.transactionId !== 'unknown') {
      return params.transactionId;
    }
    
    // Priority 2: Query parameter
    const queryTransactionId = searchParams.get('transaction_id');
    if (queryTransactionId) {
      return queryTransactionId;
    }
    
    // Priority 3: Location state
    return location.state?.transactionId || null;
  };

  const transactionId = getTransactionId();

  // Get error details from navigation state OR query params
  const failureData = location.state || {};
  const {
    error = searchParams.get('error'),
    errorCode = searchParams.get('error_code'),
    errorMessage = searchParams.get('error_message'),
    paymentId = searchParams.get('payment_id'),
    items,
    amount,
    currency,
    paymentMethod = searchParams.get('payment_method') || 'stripe'
  } = failureData;

  useEffect(() => {
    console.log('🔍 PaymentFailedPage - Transaction ID:', transactionId);
    console.log('🔍 PaymentFailedPage - Error:', error);
    console.log('🔍 PaymentFailedPage - State:', failureData);

    // If items were passed, use them directly
    if (items && items.length > 0) {
      setOrderDetails({
        items: items,
        amount: amount || items.reduce((sum, item) => sum + parseFloat(item.price), 0),
        currency: currency || 'USD',
        paymentMethod: paymentMethod || 'razorpay',
        transactionId: transactionId
      });
      setLoading(false);
    } else if (transactionId || paymentId) {
      // Try to fetch payment details from backend
      fetchFailedPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [items, paymentId, transactionId]);

  const fetchFailedPaymentDetails = async () => {
    try {
      // ✅ Try fetching by transaction_id first
      if (transactionId) {
        console.log('📡 Fetching payment by transaction_id:', transactionId);
        
        const response = await axiosInstance.get(`/payments/`, {
          params: { transaction_id: transactionId }
        });
        
        if (response.data.results && response.data.results.length > 0) {
          const payment = response.data.results[0];
          
          setOrderDetails({
            items: payment.payment_webinars || [],
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.payment_method,
            transactionId: payment.transaction_id,
            status: payment.status
          });
          
          setLoading(false);
          return;
        }
      }

      // ✅ Fallback: Try fetching by payment ID
      if (paymentId) {
        console.log('📡 Fetching payment by ID:', paymentId);
        
        const response = await axiosInstance.get(`/payments/${paymentId}/`);
        
        setOrderDetails({
          items: response.data.payment_webinars || [],
          amount: response.data.amount,
          currency: response.data.currency,
          paymentMethod: response.data.payment_method,
          transactionId: response.data.transaction_id,
          status: response.data.status
        });
      }
    } catch (error) {
      console.error('❌ Error fetching payment details:', error);
      
      // ✅ Set default empty state if fetch fails
      setOrderDetails({
        items: [],
        amount: 0,
        currency: 'USD',
        paymentMethod: paymentMethod || 'stripe',
        transactionId: transactionId
      });
    } finally {
      setLoading(false);
    }
  };

  // Error messages based on error type
  const getErrorInfo = (errorType) => {
    const errors = {
      'payment_gateway_error': {
        title: 'Payment Gateway Error',
        message: 'We encountered a technical issue while processing your payment. This sometimes happens due to temporary connectivity issues.',
        code: 'PG_001',
        suggestions: [
          'Wait a few minutes and try again',
          'Check your internet connection',
          'Try a different payment method'
        ]
      },
      'insufficient_funds': {
        title: 'Insufficient Funds',
        message: 'Your payment could not be completed due to insufficient funds in your account.',
        code: 'PF_002',
        suggestions: [
          'Check your account balance',
          'Try a different card or payment method',
          'Contact your bank for assistance'
        ]
      },
      'card_declined': {
        title: 'Card Declined',
        message: 'Your card was declined by the bank. This could be due to various security measures or card limits.',
        code: 'CD_003',
        suggestions: [
          'Verify your card details are correct',
          'Contact your bank to authorize the transaction',
          'Try a different card'
        ]
      },
      'expired_card': {
        title: 'Expired Card',
        message: 'The card you\'re trying to use has expired. Please update your payment method and try again.',
        code: 'EC_004',
        suggestions: [
          'Use a card with a valid expiry date',
          'Update your payment information',
          'Try a different payment method'
        ]
      },
      'network_error': {
        title: 'Network Connection Error',
        message: 'We lost connection during the payment process. Your payment was not charged.',
        code: 'NE_005',
        suggestions: [
          'Check your internet connection',
          'Refresh the page and try again',
          'Try from a different device or browser'
        ]
      },
      'payment_cancelled': {
        title: 'Payment Cancelled',
        message: 'You cancelled the payment process. No charges have been made.',
        code: 'PC_006',
        suggestions: [
          'Return to checkout to try again',
          'Choose a different payment method',
          'Contact support if you need help'
        ]
      },
      'verification_failed': {
        title: 'Payment Verification Failed',
        message: 'We couldn\'t verify your payment. Your payment record has been saved and you can retry completing it.',
        code: 'VF_007',
        suggestions: [
          'Retry the payment to complete it',
          'Use the same or different payment method',
          'Contact support if issue persists'
        ]
      }
    };

    return errors[errorType || error] || {
      title: 'Payment Failed',
      message: errorMessage || 'We were unable to process your payment at this time. Please try again or contact support if the issue persists.',
      code: errorCode || 'GF_000',
      suggestions: [
        'Check your payment details',
        'Try a different payment method',
        'Contact support if the issue persists'
      ]
    };
  };

  const errorInfo = getErrorInfo(error);

  // ✅ IMPROVED: Retry with resumePayment flag
  const handleRetryPayment = async () => {
    setRetrying(true);
    
    try {
      // ✅ If we have orderDetails with items, navigate to checkout
      if (orderDetails?.items && orderDetails.items.length > 0) {
        console.log('♻️ Retrying payment with existing items');
        
        navigate('/checkout', {
          state: {
            items: orderDetails.items,
            retryPayment: true,
            originalTransactionId: transactionId
          }
        });
        return;
      }

      // ✅ If we have transaction_id, try to fetch and resume
      if (transactionId) {
        console.log('♻️ Attempting to resume payment:', transactionId);
        
        const response = await axiosInstance.get(`/payments/`, {
          params: { transaction_id: transactionId }
        });
        
        if (response.data.results && response.data.results.length > 0) {
          const payment = response.data.results[0];
          
          // Check if payment is still pending
          if (payment.status === 'pending') {
            console.log('✅ Payment is pending, resuming...');
            
            navigate('/checkout', {
              state: {
                resumePayment: true,
                existingPaymentId: payment.id,
                existingTransactionId: payment.transaction_id,
                orderDetails: {
                  items: payment.payment_webinars || [],
                  amount: payment.amount,
                  currency: payment.currency
                }
              }
            });
            return;
          }
        }
      }
      
      // ✅ Fallback: Go to cart or home
      console.log('⚠️ No items found, redirecting to cart');
      navigate('/cart');
      
    } catch (error) {
      console.error('❌ Error retrying payment:', error);
      navigate('/cart');
    } finally {
      setRetrying(false);
    }
  };

  const handleContactSupport = () => {
    navigate('/contact', {
      state: {
        issue: 'payment_failed',
        errorCode: errorInfo.code,
        transactionId: transactionId,
        paymentId: paymentId,
        items: orderDetails?.items || []
      }
    });
  };

  const formatPrice = (amount, curr = 'USD') => {
    const symbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'CAD': 'C$',
      'AUD': 'A$'
    };
    return `${symbols[curr] || '$'}${parseFloat(amount).toFixed(2)}`;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      'razorpay': 'Razorpay',
      'paypal': 'PayPal',
      'stripe': 'Stripe',
      'cashfree': 'Cashfree',
      'payu': 'PayU'
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4 animate-pulse">
            <Icon name="Clock" size={32} className="text-destructive" />
          </div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <main className="pt-14 md:pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-full mb-6">
            <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center">
              <Icon name="X" size={24} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Payment Failed</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Don't worry - this happens sometimes
          </p>
          {transactionId && transactionId !== 'unknown' && (
            <p className="text-sm text-muted-foreground">
              Transaction ID: <span className="font-mono font-medium">{transactionId}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Error Code: <span className="font-mono font-medium">{errorInfo.code}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Error Details & Retry Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Error Explanation */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">{errorInfo.title}</h2>
              <p className="text-muted-foreground mb-6">{errorInfo.message}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Good news!</h3>
                    <p className="text-sm text-blue-800">
                      {transactionId && transactionId !== 'unknown'
                        ? "Your payment record has been saved. Click 'Retry Now' to complete your purchase."
                        : "No charges have been made to your account. You can safely try again."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Retry Options */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Try Again</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                  <Icon name="RefreshCw" size={24} className="text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-2">
                    {transactionId && transactionId !== 'unknown' ? 'Complete Payment' : 'Retry Payment'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {transactionId && transactionId !== 'unknown'
                      ? 'Resume your pending payment and complete the checkout process.'
                      : 'Return to checkout and try again with the same or different payment method.'
                    }
                  </p>
                  <Button
                    variant="default"
                    onClick={handleRetryPayment}
                    iconName={retrying ? "Loader" : "ArrowRight"}
                    iconPosition="right"
                    className="w-full"
                    disabled={retrying}
                  >
                    {retrying ? 'Loading...' : 'Retry Now'}
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                  <Icon name="HelpCircle" size={24} className="text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-2">Get Help</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is ready to help you complete your purchase.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleContactSupport}
                    iconName="MessageCircle"
                    iconPosition="right"
                    className="w-full"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">What You Can Do</h2>
              
              <div className="space-y-4">
                {errorInfo.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Support */}
          <div className="space-y-6">
            {/* What You Were Purchasing */}
            {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Order</h3>
                
                <div className="space-y-4 mb-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex space-x-3">
                      <Image
                        src={item.thumbnail || item.image || item.webinar?.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=180&fit=crop"}
                        alt={item.title || item.webinar?.title}
                        className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm line-clamp-2">
                          {item.title || item.webinar?.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.price || item.amount, orderDetails.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-lg font-semibold text-foreground">
                    {formatPrice(orderDetails.amount, orderDetails.currency)}
                  </span>
                </div>

                {orderDetails.paymentMethod && (
                  <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                    Attempted via: {getPaymentMethodLabel(orderDetails.paymentMethod)}
                  </div>
                )}
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Need Immediate Help?</h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is available 24/7 to assist you.
              </p>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">support@peopleskilltraining.com</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">+1 (555) 123-4567</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Available 24/7</span>
                </div>
              </div>

              <Button
                variant="default"
                onClick={handleContactSupport}
                iconName="MessageCircle"
                iconPosition="left"
                className="w-full"
              >
                Chat with Support
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/cart')}
                  iconName="ShoppingCart"
                  iconPosition="left"
                  className="w-full"
                >
                  View Cart
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/webinars/live')}
                  iconName="Search"
                  iconPosition="left"
                  className="w-full"
                >
                  Browse Webinars
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/attendee/enrollments')}
                  iconName="BookOpen"
                  iconPosition="left"
                  className="w-full"
                >
                  My Enrollments
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div></main>
    </div>
  );
};

export default PaymentFailedPage;
