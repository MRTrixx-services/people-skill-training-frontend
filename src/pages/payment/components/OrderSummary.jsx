// pages/payment/components/OrderSummary.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const OrderSummary = ({ 
  checkoutData = { items: [], summary: { subtotal: 0, total: 0 } },
  selectedGateway, 
  availableGateways, 
  getGatewayDisplayInfo,
  resumePayment = false,
  existingTransactionId = null
}) => {
  // ✅ Safety check for checkoutData
  const items = checkoutData?.items || [];
  const subtotal = checkoutData?.summary?.subtotal || 0;
  const total = checkoutData?.summary?.total || 0;

  // ✅ Find selected gateway details
  const selectedGatewayInfo = selectedGateway 
    ? availableGateways?.find(g => g.id === selectedGateway)
    : null;

  return (
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

      {/* ✅ Resume Payment Badge */}
      {resumePayment && existingTransactionId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r-lg"
        >
          <div className="flex items-center">
            <Icon name="Clock" size={16} className="text-yellow-600 mr-2 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-yellow-800">Resuming Payment</p>
              <p className="text-xs text-yellow-700 font-mono mt-0.5 break-all">
                {existingTransactionId}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Order Items */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          // ✅ Empty state
          <div className="text-center py-8">
            <Icon name="ShoppingBag" size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No items in cart</p>
          </div>
        ) : (
          items.map((item, index) => (
            <motion.div 
              key={item.cartId || item.id || item.webinarId || index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 shadow-md">
                <Image
                  src={item.image || '/placeholder-webinar.jpg'}
                  alt={item.title || 'Webinar'}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-tight">
                  {item.title || 'Untitled Webinar'}
                </h4>
                <p className="text-xs text-gray-600 mt-1 flex items-center">
                  <Icon name="Tag" size={10} className="mr-1" />
                  {item.accessType || item.itemType || item.type || 'Standard Access'}
                </p>
              </div>
              <span className="font-bold text-indigo-600 text-sm">
                ${parseFloat(item.price || 0).toFixed(2)}
              </span>
            </motion.div>
          ))
        )}
      </div>

      {/* Price Breakdown */}
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
            ${subtotal.toFixed(2)}
          </span>
        </div>
        
        {/* ✅ Optional: Show discount if exists */}
        {checkoutData?.summary?.discount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="text-sm flex items-center">
              <Icon name="Tag" size={14} className="mr-2" />
              Discount
            </span>
            <span className="font-semibold">
              -${checkoutData.summary.discount.toFixed(2)}
            </span>
          </div>
        )}

        {/* ✅ Optional: Show tax if exists */}
        {checkoutData?.summary?.tax > 0 && (
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-sm flex items-center">
              <Icon name="Receipt" size={14} className="mr-2" />
              Tax
            </span>
            <span className="font-semibold">
              ${checkoutData.summary.tax.toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* ✅ Show item count */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          {items.length} {items.length === 1 ? 'item' : 'items'} • USD
        </div>
      </motion.div>

      {/* ✅ Selected Payment Gateway Display */}
      {selectedGateway && selectedGatewayInfo && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
        >
          <p className="text-xs font-medium text-indigo-700 mb-3 flex items-center">
            <Icon name="CreditCard" size={14} className="mr-2" />
            Selected Payment Method
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* ✅ Gateway Logo */}
              {selectedGatewayInfo.logo_url ? (
                <img 
                  src={selectedGatewayInfo.logo_url}
                  alt={selectedGatewayInfo.name}
                  className="h-10 w-10 rounded-lg object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                // ✅ Fallback SVG icons
                <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                  {selectedGateway === 'stripe' && (
                    <div className="bg-indigo-600 rounded-lg p-2">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.943 0 14.422 0c-4.81 0-8.27 2.605-8.27 6.267 0 2.551 1.56 4.283 4.646 5.42 2.328.9 3.104 1.565 3.104 2.509 0 .871-.719 1.371-1.997 1.371-2.876 0-5.154-1.283-6.561-2.225l-.922 5.494C5.455 19.68 8.253 20 9.671 20c5.055 0 8.467-2.58 8.467-6.339 0-2.834-1.711-4.463-4.162-5.51z" />
                      </svg>
                    </div>
                  )}
                  {selectedGateway === 'razorpay' && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                        <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902z" />
                      </svg>
                    </div>
                  )}
                  {selectedGateway === 'paypal' && (
                    <div className="bg-blue-500 rounded-lg p-2">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {selectedGatewayInfo.name}
                </p>
                {selectedGatewayInfo.test_mode && (
                  <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full mt-1">
                    Test Mode
                  </span>
                )}
              </div>
            </div>
            {/* ✅ Show publishable key status for Stripe */}
            {selectedGateway === 'stripe' && selectedGatewayInfo?.configuration?.publishable_key && (
              <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg">
                <Icon name="CheckCircle" size={12} className="text-green-500" />
                <span className="text-xs text-green-700 font-medium">Ready</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Security Badges */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3 text-center pt-4 border-t border-gray-200/50"
      >
        <div className="flex items-center justify-center text-sm text-gray-500">
          <Icon name="Shield" size={16} className="mr-2 text-green-500" />
          <span className="font-medium">Secure Payment Processing</span>
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={12} />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>Buyer Protected</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 mt-4 opacity-70">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;
