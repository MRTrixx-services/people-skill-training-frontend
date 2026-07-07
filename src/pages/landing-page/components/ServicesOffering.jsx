import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const ServicesOffering = ({ }) => {
  const [activeService, setActiveService] = useState('live');
  const navigate = useNavigate();

  const services = [
    {
      id: 'live',
      icon: 'Video',
      title: 'Live Webinars',
      subtitle: 'Real-Time Compliance Training',
      description: 'Interactive live sessions with compliance experts. Ask questions, and participate in discussions.',
      features: [
        'Real-time Q&A with experts',
        'SHRM/HRCI credits',
        'Interactive case studies',
        'Certificate of attendance',
        'Session recordings included'
      ],
      pricing: {
        from: '$139',
        popular: true
      },
      gradient: 'from-[#0078d4] to-[#064ad4]',
      iconBg: 'bg-[#d9ecff]',
      iconColor: 'text-[#0078d4]',
      badge: 'Most Popular',
      route: '/webinars/live'
    },
    {
      id: 'recorded',
      icon: 'Play',
      title: 'On-Demand Library',
      subtitle: 'Learn at Your Pace',
      description: 'Access 500+ recorded compliance courses covering OSHA, HIPAA, HR regulations, and industry standards.',
      features: [
        'Unlimited 24/7 access',
        'Download certificates',
        'Searchable content library',
        'Mobile & desktop friendly',
        'Regular content updates'
      ],
      pricing: {
        from: '$189',
        popular: false
      },
      gradient: 'from-[#064ad4] to-[#004b8d]',
      iconBg: 'bg-[#e9eff5]',
      iconColor: 'text-[#064ad4]',
      badge: 'Best Value',
      route: '/webinars/recorded'
    },
    {
      id: 'package',
      icon: 'Award',
      title: 'Enterprise Solutions',
      subtitle: 'Custom Training Programs',
      description: 'Tailored compliance training packages for teams with dedicated support, custom content, and reporting.',
      features: [
        'Custom training paths',
        'Team management dashboard',
        'Compliance tracking & reporting',
        'Dedicated account manager',
        'Volume discounts available'
      ],
      pricing: {
        from: '$699',
        popular: false
      },
      gradient: 'from-[#004b8d] to-[#093389]',
      iconBg: 'bg-[#f5f9ff]',
      iconColor: 'text-[#004b8d]',
      badge: 'For Teams',
      route: '/webinars/live'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleServiceNavigation = (service) => {
    navigate(service.route);
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] rounded-full border border-[#d6e6f7] text-sm mb-6">
            <Icon name="Briefcase" size={16} className="text-[#004b8d]" />
            <span className="font-semibold text-[#004b8d]">Flexible Training Options</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#0078d4] bg-clip-text text-transparent">
              Choose Your Compliance Path
            </span>
          </h2>
          
          <p className="text-sm sm:text-base lg:text-lg text-[#444444] max-w-3xl mx-auto leading-relaxed">
            PeopleSkillTraining offers flexible learning formats to meet your regulatory training needs. 
            From live expert sessions to on-demand courses and enterprise solutions.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 ${
                service.pricing.popular ? 'border-[#0078d4]' : 'border-transparent hover:border-[#d6e6f7]'
              }`}
              onClick={() => {
                setActiveService(service.id);
                handleServiceNavigation(service);
              }}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`bg-gradient-to-r ${service.gradient} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                  {service.badge}
                </span>
              </div>

              {/* Header with Gradient */}
              <div className={`bg-gradient-to-br ${service.gradient} p-6 sm:p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 ${service.iconBg} rounded-xl mb-4 shadow-lg`}
                  >
                    <Icon name={service.icon} size={24} className={service.iconColor} />
                  </motion.div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{service.title}</h3>
                  <p className="text-sm text-[#d9ecff] mb-3">{service.subtitle}</p>
                  
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-[#d9ecff]">Starting from</span>
                    <span className="text-2xl font-black text-white">{service.pricing.from}</span>
                    <span className="text-xs text-[#d9ecff]">/session</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <p className="text-[#555555] mb-6 leading-relaxed text-sm sm:text-base">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-5 h-5 bg-gradient-to-br from-[#d9ecff] to-[#f5f9ff] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#d6e6f7]">
                        <Icon name="Check" size={12} className="text-[#004b8d]" />
                      </div>
                      <span className="text-sm text-[#444444] leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-4 bg-gradient-to-r ${service.gradient} text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#0078d4]/30 group/btn`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceNavigation(service);
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Explore Now
                    <Icon 
                      name="ArrowRight" 
                      size={16} 
                      className="group-hover/btn:translate-x-1 transition-transform duration-300" 
                    />
                  </span>
                </motion.button>
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0078d4] via-[#064ad4] to-[#0078d4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 lg:mt-16"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-[#d6e6f7]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-left flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d9ecff] to-[#f5f9ff] rounded-xl flex items-center justify-center border border-[#d6e6f7]">
                    <Icon name="HelpCircle" size={24} className="text-[#004b8d]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#093389]">
                    Need Expert Guidance?
                  </h3>
                </div>
                <p className="text-sm text-[#555555] ml-15">
                  Our compliance specialists can help you choose the right training solution for your organization's needs.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-[#0078d4] via-[#064ad4] to-[#004b8d] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#0078d4]/30 transition-all duration-300 whitespace-nowrap"
                onClick={handleContactUs}
              >
                <Icon name="MessageCircle" size={20} />
                Schedule Consultation
                <Icon name="ArrowRight" size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOffering;