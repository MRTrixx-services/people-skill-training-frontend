import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StatsSection = () => {
  const stats = [
    {
      number: '1000+',
      label: 'Compliance Webinars',
      icon: 'Video',
      color: 'from-[#0078d4] to-[#064ad4]'
    },
    {
      number: '75K+',
      label: 'Certified',
      icon: 'Users',
      color: 'from-[#064ad4] to-[#004b8d]'
    },
    {
      number: '95%',
      label: 'Completion Rate',
      icon: 'TrendingUp',
      color: 'from-[#004b8d] to-[#093389]'
    },
    {
      number: '24/7',
      label: 'On-Demand Access',
      icon: 'Clock',
      color: 'from-[#0078d4] to-[#004b8d]'
    }
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.2 }
        }
      }}
      className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] rounded-full mb-4 border border-[#d6e6f7]"
          >
            <Icon name="BarChart" size={16} className="text-[#004b8d] mr-2" />
            <span className="text-sm font-semibold text-[#004b8d]">Our Impact in Numbers</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#0078d4] bg-clip-text text-transparent mb-4">
            Leading the Compliance Training Industry
          </h2>
          <p className="text-base sm:text-md md:text-lg text-[#444444] max-w-3xl mx-auto">
            Delivering expert-led compliance training that keeps organizations ahead of regulatory requirements. 
            Join thousands of professionals who trust PeopleSkillTraining for their compliance needs.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ 
                scale: 1.05,
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="relative text-center group"
            >
              {/* Card Background */}
              <div className="relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#d6e6f7] overflow-hidden">
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, rgba(0, 120, 212, 0.05) 0%, rgba(6, 74, 212, 0.05) 100%)`
                  }}
                />
                
                {/* Icon Container */}
                <motion.div 
                  className={`relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-r ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                  animate={{ 
                    boxShadow: [
                      '0 10px 25px rgba(0, 120, 212, 0.2)',
                      '0 15px 35px rgba(6, 74, 212, 0.4)',
                      '0 10px 25px rgba(0, 120, 212, 0.2)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <Icon 
                    name={stat.icon} 
                    size={window.innerWidth >= 768 ? 32 : 24} 
                    className="text-white relative z-10" 
                  />
                  
                  {/* Icon Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl md:rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(0, 120, 212, 0.5)',
                        '0 0 40px rgba(6, 74, 212, 0.8)',
                        '0 0 20px rgba(0, 120, 212, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                {/* Number */}
                <motion.div 
                  className="relative text-3xl sm:text-4xl md:text-5xl font-black mb-2 md:mb-3"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: index * 0.1 
                  }}
                >
                  <span className="bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#0078d4] bg-clip-text text-transparent">
                    {stat.number}
                  </span>
                </motion.div>
                
                {/* Label */}
                <div className="relative text-xs md:text-sm uppercase tracking-wider text-[#555555] font-bold px-2 leading-tight">
                  {stat.label}
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#d9ecff] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#f5f9ff] to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Floating Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 0.5 }}
                className="mt-3 flex items-center justify-center text-xs text-[#0078d4] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="TrendingUp" size={12} className="mr-1" />
                <span>Industry Leading</span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-8 px-6 py-4 bg-white rounded-2xl shadow-md border border-[#d6e6f7]">
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={20} className="text-[#064ad4]" />
              <span className="text-sm md:text-base font-semibold text-[#004b8d]">SHRM Certified</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-[#d6e6f7]" />
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={20} className="text-[#0078d4]" />
              <span className="text-sm md:text-base font-semibold text-[#004b8d]">HRCI Approved</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-[#d6e6f7]" />
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={20} className="text-[#064ad4]" />
              <span className="text-sm md:text-base font-semibold text-[#004b8d]">ISO 9001 Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatsSection;