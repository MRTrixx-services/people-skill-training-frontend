import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const HeroSection = ({ onBrowseWebinars, onBecomeInstructor }) => {
  return (
   <section className="relative bg-gradient-to-br from-[#093389] via-[#064ad4] to-[#004b8d] text-white overflow-hidden min-h-[90vh] flex items-center">
  {/* Animated Background Pattern */}
  <div className="absolute inset-0 opacity-10">
    <motion.div 
      animate={{ 
        backgroundPosition: ['0px 0px', '60px 60px', '0px 0px'],
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: 'linear'
      }}
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
        backgroundSize: '30px 30px'
      }}
    />
  </div>
  
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1, 
          transition: { staggerChildren: 0.2 }
        }
      }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
    >
      {/* Left Content */}
      <div className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-[#0078d4]/20 backdrop-blur-sm rounded-full border border-[#d6e6f7] text-xs sm:text-sm shadow-lg shadow-[#004b8d]/20"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon name="BookOpen" size={16} className="text-[#d9ecff] mr-2 sm:mr-3" />
          </motion.div>
          <span className="font-semibold text-[#f5f9ff]">Your Partner in Regulatory Excellence</span>
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#f5f9ff]"
        >
          Elevate Your Standards with
          <motion.span 
            className="block text-gradient bg-gradient-to-r from-[#d9ecff] via-[#0078d4] to-[#d9ecff] bg-clip-text text-transparent mt-2"
            style={{
              backgroundSize: '200% auto'
            }}
            animate={{ 
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            Expert Compliance Training
          </motion.span>
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          className="text-base sm:text-lg md:text-xl text-[#d9ecff] max-w-2xl leading-relaxed mx-auto lg:mx-0"
        >
          Navigate the complex world of workplace regulations with confidence. Expert-led webinars 
          covering OSHA, HIPAA, ADA, HR compliance, data privacy, and more—designed for busy professionals.
        </motion.p>

        {/* Animated Stats */}
        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 py-4 md:py-6"
        >
          {[
            { number: '1000+', label: 'Training Sessions', icon: 'Briefcase' },
            { number: '75K+', label: 'Certified Professionals', icon: 'Users' },
            { number: '15+', label: 'Years of Excellence', icon: 'CheckCircle' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.6 + index * 0.15,
                type: "spring",
                stiffness: 200 
              }}
              whileHover={{ scale: 1.08, y: -5 }}
              className="text-center bg-[#f5f9ff]/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-[#0078d4]/30 hover:border-[#d6e6f7] transition-all"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-[#0078d4] to-[#064ad4] rounded-full mb-2"
              >
                <Icon name={stat.icon} size={16} className="md:w-5 md:h-5 text-white" />
              </motion.div>
              <motion.div 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#d9ecff] mb-1"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(0, 120, 212, 0.3)',
                    '0 0 20px rgba(0, 120, 212, 0.6)',
                    '0 0 10px rgba(0, 120, 212, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stat.number}
              </motion.div>
              <div className="text-xs sm:text-sm text-[#d6e6f7] font-medium leading-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Button
              variant="default"
              size="lg"
              onClick={onBrowseWebinars}
              className="w-full sm:w-auto bg-gradient-to-r from-[#0078d4] via-[#064ad4] to-[#004b8d] hover:from-[#064ad4] hover:via-[#0078d4] hover:to-[#064ad4] text-white font-bold px-6 md:px-8 py-3 md:py-4 shadow-xl shadow-[#004b8d]/50 hover:shadow-[#0078d4]/50 transform transition-all duration-300 text-sm md:text-base"
              iconName="Calendar"
              iconPosition="left"
            >
              View Training Calendar
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={onBecomeInstructor}
              className="w-full sm:w-auto border-2 border-[#d9ecff] text-[#f5f9ff] hover:bg-[#064ad4]/30 hover:border-[#f5f9ff] backdrop-blur-sm font-bold px-6 md:px-8 py-3 md:py-4 transition-all duration-300 text-sm md:text-base shadow-lg"
              iconName="PlayCircle"
              iconPosition="left"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-6 md:pt-8"
        >
          {[
            { icon: 'Award', label: 'Certified Programs' },
            { icon: 'Clock', label: 'On-Demand Access' },
          ].map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="flex items-center space-x-2 bg-[#f5f9ff]/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#d9ecff]/30"
            >
              <Icon name={badge.icon} size={16} className="text-[#d9ecff]" />
              <span className="text-xs sm:text-sm text-[#f5f9ff] font-medium">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right Content - Image with Animations */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative order-1 lg:order-2"
      >
        <div className="relative z-10">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Professional HR compliance training and regulatory education"
              className="rounded-2xl md:rounded-3xl shadow-2xl shadow-[#093389]/50 w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover border-2 border-[#0078d4]/30"
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#093389]/40 to-transparent rounded-2xl md:rounded-3xl" />
          </motion.div>
          
          {/* Floating Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 md:-top-6 md:-left-6 bg-[#f5f9ff] backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-[#0078d4]/40 shadow-xl"
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <motion.div 
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(0, 120, 212, 0.5)',
                    '0 0 30px rgba(0, 120, 212, 0.8)',
                    '0 0 20px rgba(0, 120, 212, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#0078d4] to-[#064ad4] rounded-xl flex items-center justify-center"
              >
                <Icon name="TrendingUp" size={20} className="md:w-6 md:h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-[#093389] font-bold text-xs md:text-sm">AI Governance</p>
                <p className="text-[#004b8d] text-xs">New Course Added</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 bg-[#f5f9ff] backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-[#004b8d]/40 shadow-xl"
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#064ad4] to-[#0078d4] rounded-xl flex items-center justify-center"
              >
                <Icon name="FileCheck" size={20} className="md:w-6 md:h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-[#093389] font-bold text-xs md:text-sm">OSHA Updates</p>
                <p className="text-[#004b8d] text-xs">2025 Standards</p>
              </div>
            </div>
          </motion.div>

          {/* Additional Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 bg-gradient-to-br from-[#0078d4] to-[#064ad4] rounded-2xl p-3 md:p-4 border-2 border-[#d9ecff] shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                className="text-xs text-[#d9ecff] font-semibold mb-1"
              >
                Next Session
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg md:text-xl font-black text-[#f5f9ff]"
              >
                Today
              </motion.div>
              <div className="flex items-center justify-center text-[#d9ecff] text-xs mt-1">
                <Icon name="Clock" size={12} className="mr-1" />
                <span className="font-semibold">2:00 PM</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Background Effects */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.25, 0.15],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-full h-full bg-gradient-to-r from-[#0078d4]/30 to-[#064ad4]/30 rounded-2xl md:rounded-3xl blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.03, 1],
            opacity: [0.15, 0.2, 0.15],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5 
          }}
          className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 w-full h-full bg-gradient-to-r from-[#004b8d]/30 to-[#0078d4]/30 rounded-2xl md:rounded-3xl blur-3xl"
        />
      </motion.div>
    </motion.div>
  </div>
</section>
  );
};

export default HeroSection;
