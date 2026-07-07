import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color, textColor, index = 0 }) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.div 
      className={`${color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1, // Stagger animation based on card index
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.p 
            className={`text-sm font-medium mb-2 ${textColor} opacity-90`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: (index * 0.1) + 0.2, duration: 0.3 }}
          >
            {title}
          </motion.p>
          
          <motion.p 
            className={`text-3xl font-bold ${textColor} mb-3`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: (index * 0.1) + 0.3, 
              duration: 0.4,
              type: "spring",
              stiffness: 150
            }}
          >
            {value}
          </motion.p>
          
          {change && (
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: (index * 0.1) + 0.4, 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <Icon 
                  name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                  size={16} 
                  className={`mr-2 ${textColor} opacity-80`}
                />
              </motion.div>
              <span className={`text-sm font-medium ${textColor} opacity-80`}>
                {change}
              </span>
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${textColor} opacity-90 bg-white bg-opacity-20`}
          initial={{ opacity: 0, rotate: -180, scale: 0 }}
          animate={{ opacity: 0.9, rotate: 0, scale: 1 }}
          whileHover={{ 
            rotate: 10, 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
          transition={{ 
            delay: (index * 0.1) + 0.1, 
            duration: 0.6,
            type: "spring",
            stiffness: 120
          }}
        >
          <Icon name={icon} size={28} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MetricsCard;
