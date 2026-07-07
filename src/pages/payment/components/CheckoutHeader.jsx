import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const CheckoutHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8 lg:mb-10 text-center"
    >
      <div className="relative">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          Secure Checkout
        </h1>
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
  );
};

export default CheckoutHeader;
