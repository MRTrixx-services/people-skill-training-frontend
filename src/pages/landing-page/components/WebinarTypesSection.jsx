import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const WebinarTypesSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.3 }
        }
      }}
      className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Delivering Top-Notch Service for Webinars
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from live interactive sessions or access our comprehensive library of recorded webinars
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Live Webinars */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 }
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative mb-6 md:mb-8 overflow-hidden rounded-xl md:rounded-2xl">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Live Webinar"
                  className="w-full h-40 md:h-48 object-cover"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-3 left-3 md:top-4 md:left-4 bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center space-x-1 md:space-x-2"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                <span>LIVE</span>
              </motion.div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Live Webinars</h3>
            <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              Join our live interactive sessions with real-time Q&A, polls, and networking opportunities. 
              Connect directly with expert instructors and fellow learners.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="default" 
                size="lg" 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base py-3 md:py-4"
              >
                Join Live Session
              </Button>
            </motion.div>
          </motion.div>

          {/* Recorded Webinars */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 }
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative mb-6 md:mb-8 overflow-hidden rounded-xl md:rounded-2xl">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Recorded Webinar"
                  className="w-full h-40 md:h-48 object-cover"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute top-3 left-3 md:top-4 md:left-4 bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold"
              >
                RECORDED
              </motion.div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Recorded Webinars</h3>
            <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              Access our extensive library of recorded webinars anytime, anywhere. 
              Learn at your own pace with downloadable resources and certificates.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="default" 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base py-3 md:py-4"
              >
                Browse Library
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default WebinarTypesSection;
