import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ServicesSection = () => {
  const services = [
    {
      icon: 'Shield',
      title: 'OSHA Compliance',
      description: 'Comprehensive workplace safety training covering OSHA standards, hazard prevention, and regulatory requirements.'
    },
    {
      icon: 'Users',
      title: 'HR Compliance',
      description: 'Master employment law, workplace policies, discrimination prevention, and HR best practices for legal compliance.'
    },
    {
      icon: 'Lock',
      title: 'Data Privacy & Security',
      description: 'Learn GDPR, CCPA, HIPAA regulations and implement robust data protection strategies for your organization.'
    },
    {
      icon: 'FileCheck',
      title: 'Regulatory Training',
      description: 'Stay current with evolving regulations across industries including finance, healthcare, and government sectors.'
    },
    {
      icon: 'Award',
      title: 'Credit Courses',
      description: 'Earn continuing professional education credits through SHRM and HRCI approved compliance certification programs.'
    },
    {
      icon: 'TrendingUp',
      title: 'Risk Management',
      description: 'Develop effective compliance risk assessment frameworks and mitigation strategies for enterprise resilience.'
    }
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }}
      className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-white via-[#f5f9ff] to-[#e9eff5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] rounded-full border border-[#d6e6f7] text-sm mb-6">
            <Icon name="Briefcase" size={16} className="text-[#004b8d]" />
            <span className="font-semibold text-[#004b8d]">Our Training Solutions</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#0078d4] bg-clip-text text-transparent">
              Comprehensive Compliance Programs
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-[#444444] max-w-3xl mx-auto leading-relaxed">
            Expert-led training solutions to keep your organization compliant, certified, and ahead of regulatory changes
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group bg-white p-6 md:p-8 rounded-2xl border-2 border-[#d6e6f7] hover:border-[#0078d4] hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d9ecff] to-[#f5f9ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10">
                <motion.div 
                  className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#0078d4] via-[#064ad4] to-[#004b8d] rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.6 }
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 120, 212, 0.3)',
                      '0 0 30px rgba(6, 74, 212, 0.5)',
                      '0 0 20px rgba(0, 120, 212, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon name={service.icon} size={window.innerWidth >= 768 ? 28 : 24} className="text-white" />
                </motion.div>
                
                <motion.h3 
                  className="text-xl md:text-2xl font-bold text-[#093389] mb-3 md:mb-4 group-hover:text-[#0078d4] transition-colors duration-300"
                >
                  {service.title}
                </motion.h3>
                
                <p className="text-[#555555] leading-relaxed group-hover:text-[#444444] transition-colors duration-300 text-sm md:text-base">
                  {service.description}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="mt-4 flex items-center text-[#064ad4] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span>Learn More</span>
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </motion.div>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#d9ecff] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-[#555555] mb-6">Need a custom compliance solution?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0078d4] via-[#064ad4] to-[#004b8d] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#0078d4]/30 transition-all duration-300"
          >
            <Icon name="MessageCircle" size={20} />
            <span>Contact Our Experts</span>
            <Icon name="ArrowRight" size={20} />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;