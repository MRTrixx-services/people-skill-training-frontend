import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const CheckoutProgressSteps = ({ currentStep, steps }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 sm:mb-10 lg:mb-12"
    >
      <div className="flex items-center justify-center px-4 sm:px-0">
        <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 md:space-x-8 lg:space-x-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center transition-all duration-500 ${
                currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'
              }`}>
                <motion.div 
                  className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${
                    currentStep >= step.id 
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 text-white transform scale-105' 
                      : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
                  }`}
                  whileHover={{ scale: currentStep >= step.id ? 1.05 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep > step.id ? (
                    <Icon name="Check" size={window.innerWidth < 640 ? 14 : window.innerWidth < 768 ? 16 : 20} />
                  ) : (
                    <Icon name={step.icon} size={window.innerWidth < 640 ? 14 : window.innerWidth < 768 ? 16 : 20} />
                  )}
                </motion.div>
                <div className="mt-2 sm:mt-3 text-center">
                  <span className="hidden xs:block font-medium text-xs sm:text-sm md:text-base">{step.name}</span>
                  <span className="hidden sm:block text-xs md:text-sm opacity-75 text-text-secondary mt-1">{step.description}</span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <motion.div 
                  className={`w-4 xs:w-6 sm:w-8 md:w-12 lg:w-16 h-0.5 mx-1 xs:mx-2 sm:mx-4 transition-all duration-500 ${
                    currentStep > step.id 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                      : 'bg-gray-300'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentStep > step.id ? 1 : 0.3 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutProgressSteps;
