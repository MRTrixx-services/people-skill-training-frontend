import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const CheckoutStepThree = () => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 lg:space-y-8"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <Icon name="CheckCircle" size={window.innerWidth < 640 ? 32 : window.innerWidth < 1024 ? 40 : 48} className="text-green-600" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4"
        >
          Payment Successful! 🎉
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-16 sm:w-24"></div>
          <Icon name="Heart" size={16} className="mx-3 text-green-500" />
          <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-16 sm:w-24"></div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-base sm:text-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto"
        >
          Thank you for your purchase! You'll receive a confirmation email shortly with access details to your webinars.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 inline-flex items-center space-x-3 text-green-600"
        >
          <Icon name="Loader2" size={20} className="animate-spin" />
          <span className="font-medium">Redirecting to order confirmation...</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckoutStepThree;
