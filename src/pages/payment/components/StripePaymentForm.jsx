// pages/payment/components/StripePaymentForm.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const StripePaymentForm = ({ 
  stripeClientSecret, 
  checkoutData, 
  isProcessing, 
  setIsProcessing,
  onPaymentSuccess,
  onPaymentError,
  resumePayment 
}) => {
  const handleStripeCheckout = async () => {
    if (isProcessing || !stripeClientSecret) return;
    
    setIsProcessing(true);
    console.log('🚀 Redirecting to checkout.stripe.com...');
    
    // ✅ REDIRECT TO STRIPE HOSTED CHECKOUT
    window.location.href = `https://checkout.stripe.com/pay/${stripeClientSecret}`;
  };

  // Show this BEFORE clicking "Continue to Payment"
  if (!stripeClientSecret) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl border-2 border-yellow-200 text-center shadow-xl"
      >
        <Icon name="ArrowRightCircle" size={56} className="mx-auto mb-6 text-yellow-600" />
        <h3 className="text-2xl font-bold text-yellow-800 mb-4">Ready for Secure Checkout</h3>
        <p className="text-lg text-yellow-700 mb-8">Click "Continue to Payment" to launch Stripe</p>
      </motion.div>
    );
  }

  // Show this AFTER clicking "Continue to Payment" ✅
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 sm:p-10 rounded-3xl border border-indigo-200/50 shadow-2xl backdrop-blur-sm"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.943 0 14.422 0c-4.81 0-8.27 2.605-8.27 6.267 0 2.551 1.56 4.283 4.646 5.42 2.328.9 3.104 1.565 3.104 2.509 0 .871-.719 1.371-1.997 1.371-2.876 0-5.154-1.283-6.561-2.225l-.922 5.494C5.455 19.68 8.253 20 9.671 20c5.055 0 8.467-2.58 8.467-6.339 0-2.834-1.711-4.463-4.162-5.51z"/>
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent mb-4">
          Stripe Secure Checkout
        </h2>
        <p className="text-xl text-gray-600 mb-2">The world's most trusted payment platform</p>
        <div className="text-4xl font-black text-gray-900 mb-2">
          ${checkoutData.summary?.total?.toFixed(2)}
        </div>
        <p className="text-indigo-600 font-bold text-lg">
          {resumePayment ? 'Resume Pending Payment' : 'One-time Purchase'}
        </p>
      </div>

      {/* BIG Pay Button */}
      <Button
        onClick={handleStripeCheckout}
        disabled={isProcessing}
        className="w-full h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white text-2xl font-black rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isProcessing ? (
          <>
            <Icon name="Loader2" size={28} className="animate-spin mr-4" />
            Launching Stripe Checkout...
          </>
        ) : (
          <>
            <Icon name="ArrowRight" size={28} className="mr-4" />
            Continue to Stripe Checkout →
          </>
        )}
      </Button>

      {/* Features */}
      <div className="mt-10 pt-8 border-t border-indigo-200 grid grid-cols-3 gap-6 text-center">
        <div className="space-y-2">
          <Icon name="Shield" size={24} className="mx-auto text-green-500" />
          <p className="text-xs font-semibold text-gray-700">PCI Compliant</p>
        </div>
        <div className="space-y-2">
          <Icon name="Lock" size={24} className="mx-auto text-blue-500" />
          <p className="text-xs font-semibold text-gray-700">256-bit SSL</p>
        </div>
        <div className="space-y-2">
          <Icon name="Zap" size={24} className="mx-auto text-yellow-500" />
          <p className="text-xs font-semibold text-gray-700">Instant Processing</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-indigo-200 text-center text-xs text-gray-500">
        You'll be redirected to <span className="font-semibold text-indigo-600">checkout.stripe.com</span>
      </div>
    </motion.div>
  );
};

export default StripePaymentForm;
