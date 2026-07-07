import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from 'contexts/CartContext';
import axiosInstance from 'config/axiosInstance';
import Icon from 'components/AppIcon';

const StripeReturnPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Verifying your payment...');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // ✅ PREVENT BACK NAVIGATION TO CHECKOUT
    window.history.replaceState(null, '', window.location.href);
    
    const handlePopState = () => {
      window.history.replaceState(null, '', window.location.href);
    };
    
    window.addEventListener('popstate', handlePopState);

    const verifyStripePayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setStatus('error');
        setMessage('No session ID found. Payment verification failed.');
        setTimeout(() => {
          navigate('/checkout/payment-failed/unknown', { replace: true });
        }, 3000);
        return;
      }

      console.log('✅ Stripe return - Session ID:', sessionId);

      try {
        // ✅ STEP 1: Retrieve Stripe session from backend
        console.log('🔍 Retrieving Stripe session via backend...');
        
        const sessionResponse = await axiosInstance.get(`/payments/stripe/session/${sessionId}/`);
        
        console.log('📦 Session response:', sessionResponse.data);

        if (sessionResponse.data.success && sessionResponse.data.payment_status === 'paid') {
          console.log('✅ Stripe session is paid');
          
          const payment = sessionResponse.data.payment;
          
          setPaymentDetails(payment);
          setStatus('success');
          setMessage('Payment successful! Redirecting to your order details...');
          
          // ✅ Clear cart and localStorage
          clearCart();
          localStorage.removeItem('pendingStripeSession');
          localStorage.removeItem('pendingOrder');
          
          // ✅ Redirect to success page after 2 seconds
          setTimeout(() => {
            const invoiceNumber = payment.invoice_number || `INV-${payment.id}`;
            navigate(`/checkout/payment-success/${invoiceNumber}`, {
              replace: true,
              state: {
                orderId: payment.id,
                transactionId: payment.transaction_id,
                invoiceNumber: invoiceNumber,
                amount: payment.amount,
                currency: payment.currency,
                paymentMethod: 'stripe',
                sessionId: sessionId,
                webinars: payment.payment_webinars || []
              }
            });
          }, 2000);
          
        } else if (sessionResponse.data.payment_status === 'unpaid') {
          // ✅ Payment not completed yet
          throw new Error('Payment not completed. Please try again.');
          
        } else {
          // ✅ Unknown payment status
          throw new Error(sessionResponse.data.error || 'Payment verification failed');
        }

      } catch (error) {
        console.error('❌ Payment verification failed:', error);
        
        setStatus('error');
        
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           error.message || 
                           'Payment verification failed. Please contact support.';
        
        setMessage(errorMessage);
        
        // ✅ Get pending transaction ID for failed page
        let transactionId = 'unknown';
        try {
          const pendingOrder = localStorage.getItem('pendingStripeSession');
          if (pendingOrder) {
            const orderData = JSON.parse(pendingOrder);
            transactionId = orderData.transaction_id || 'unknown';
          }
        } catch (e) {
          console.error('Failed to parse pending order:', e);
        }
        
        // ✅ Redirect to failed page after 3 seconds
        setTimeout(() => {
          navigate(`/checkout/payment-failed/${transactionId}`, {
            replace: true,
            state: {
              reason: errorMessage,
              sessionId: sessionId,
              paymentMethod: 'stripe'
            }
          });
        }, 3000);
      }
    };

    verifyStripePayment();

    // ✅ Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [searchParams, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Processing */}
        {status === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-4">Please do not close this window...</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            
            {paymentDetails && (
              <div className="bg-gray-50 rounded-lg p-4 text-left mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-800 text-xs">{paymentDetails.transaction_id}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Invoice:</span>
                  <span className="font-semibold text-gray-800">{paymentDetails.invoice_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-800">
                    {paymentDetails.currency} ${parseFloat(paymentDetails.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center text-blue-600 mt-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm">Redirecting...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Icon name="XCircle" size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                If you were charged, please contact support with your session ID:
              </p>
              <p className="text-xs font-mono text-red-900 mt-2 break-all">
                {searchParams.get('session_id')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/attendee/orders', { replace: true })}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                My Orders
              </button>
              <button
                onClick={() => navigate('/', { replace: true })}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeReturnPage;
