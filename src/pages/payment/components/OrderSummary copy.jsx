import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const OrderSummary = ({ 
  checkoutData, 
  selectedGateway, 
  availableGateways, 
  getGatewayDisplayInfo,
  resumePayment, // ✅ NEW PROP
  existingTransactionId // ✅ NEW PROP
}) => {
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
              <p className="text-xs text-yellow-700 font-mono mt-0.5">
                {existingTransactionId}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Order Items */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-64 overflow-y-auto">
        {checkoutData.items?.map((item, index) => (
          <motion.div 
            key={item.cartId || item.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 shadow-md">
              <Image
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-tight">{item.title}</h4>
              <p className="text-xs text-gray-600 mt-1 flex items-center">
                <Icon name="Tag" size={10} className="mr-1" />
                {item.accessType || item.type}
              </p>
            </div>
            <span className="font-bold text-indigo-600 text-sm">${parseFloat(item.price).toFixed(2)}</span>
          </motion.div>
        ))}
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
            ${checkoutData.summary?.subtotal?.toFixed(2)}
          </span>
        </div>
        
        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ${checkoutData.summary?.total?.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Security Badges */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3 text-center"
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
