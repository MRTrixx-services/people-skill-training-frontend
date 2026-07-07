import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const [hoveredService, setHoveredService] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const services = [
    {
      title: 'Workplace Safety',
      description: 'Comprehensive safety training programs',
      icon: 'Shield',
      color: 'cyan',
      gradient: 'from-cyan-400 to-cyan-600',
      stats: '500+ Programs',
      features: ['OSHA Compliance', 'Emergency Response', 'Safety Protocols']
    },
    {
      title: 'Harassment Prevention',
      description: 'Creating respectful work environments',
      icon: 'Users',
      color: 'teal',
      gradient: 'from-teal-400 to-teal-600',
      stats: '100K+ Trained',
      features: ['Prevention Training', 'Policy Development', 'Investigation Support']
    },
    {
      title: 'Regulatory Compliance',
      description: 'Industry-specific compliance solutions',
      icon: 'FileText',
      color: 'emerald',
      gradient: 'from-emerald-400 to-emerald-600',
      stats: '25+ Industries',
      features: ['Industry Standards', 'Audit Support', 'Documentation']
    },
    {
      title: 'Risk Management',
      description: 'Identify and mitigate organizational risks',
      icon: 'AlertTriangle',
      color: 'orange',
      gradient: 'from-orange-400 to-orange-600',
      stats: '1000+ Audits',
      features: ['Risk Assessment', 'Mitigation Plans', 'Monitoring']
    }
  ];

  const features = [
    {
      icon: 'Zap',
      title: 'Fast Implementation',
      description: 'Get started in days, not months',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: 'Shield',
      title: '100% Secure',
      description: 'Enterprise-grade security standards',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: 'Heart',
      title: 'Expert Support',
      description: '24/7 dedicated customer success team',
      color: 'from-pink-400 to-rose-500'
    },
    {
      icon: 'TrendingUp',
      title: 'Proven Results',
      description: 'Track record of compliance success',
      color: 'from-blue-400 to-indigo-500'
    }
  ];

  const stats = [
    { number: '99%', label: 'Client Satisfaction', icon: 'Star', color: 'from-yellow-400 to-orange-500' },
    { number: '24/7', label: 'Support Available', icon: 'Clock', color: 'from-blue-400 to-cyan-500' },
    { number: '50+', label: 'Expert Trainers', icon: 'Users', color: 'from-purple-400 to-pink-500' },
    { number: '15+', label: 'Countries Served', icon: 'Globe', color: 'from-green-400 to-emerald-500' }
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-12 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative  min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 ">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Office background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/85 to-gray-900/90"></div>
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                  opacity: 0
                }}
                animate={{
                  y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-6 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-semibold mb-8"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="inline-block mr-2"
              >
                ✨
              </motion.span>
              About PeopleSkillTraining
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            >
              Building a{' '}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400">
                Compliant Future
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              We're PeopleSkillTraining - your trusted partner in navigating the complex world of regulatory compliance with confidence and clarity.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-4 rounded-full shadow-2xl text-base font-semibold"
                  onClick={() => navigate('/webinars/live')}
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Explore Training
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-base font-semibold"
                  onClick={() => navigate('/contact')}
                >
                  Get in Touch
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              {[
                { number: '25+', label: 'Years Experience' },
                { number: '1000+', label: 'Companies' },
                { number: '100K+', label: 'Trained' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2"
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(34, 211, 238, 0.5)',
                        '0 0 40px rgba(34, 211, 238, 0.8)',
                        '0 0 20px rgba(34, 211, 238, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <Icon name="ChevronDown" size={32} className="text-cyan-400" />
        </motion.div>
      </section>

      {/* Features Section - Colorful Cards */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-50/50 via-purple-50/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-700 to-purple-700 text-transparent bg-clip-text rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Success
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to achieve and maintain compliance excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <motion.div
                  animate={{
                    opacity: hoveredFeature === index ? 1 : 0
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 rounded-2xl sm:rounded-3xl`}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg mx-auto`}
                    animate={{
                      rotate: hoveredFeature === index ? 360 : 0,
                      scale: hoveredFeature === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon name={feature.icon} size={24} className="text-white" />
                  </motion.div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Colored Card Style */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-cyan-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Expertise
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive compliance solutions across multiple domains
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredService(index)}
                onHoverEnd={() => setHoveredService(null)}
                className={`relative bg-gradient-to-br from-${service.color}-50 to-${service.color}-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 overflow-hidden group cursor-pointer`}
              >
                <motion.div
                  animate={{
                    scale: hoveredService === index ? 2 : 1,
                    opacity: hoveredService === index ? 0.3 : 0.2
                  }}
                  transition={{ duration: 0.5 }}
                  className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${service.gradient} rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16`}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${service.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}
                    animate={{
                      rotate: hoveredService === index ? 360 : 0
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon name={service.icon} size={24} className="text-white" />
                  </motion.div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{service.description}</p>
                  
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: hoveredService === index ? 'auto' : 0,
                      opacity: hoveredService === index ? 1 : 0
                    }}
                    className="overflow-hidden mb-3 sm:mb-4"
                  >
                    <ul className="space-y-1 sm:space-y-2">
                      {service.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{
                            x: hoveredService === index ? 0 : -20,
                            opacity: hoveredService === index ? 1 : 0
                          }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center text-xs text-gray-700"
                        >
                          <Icon name="Check" size={12} className="mr-2 text-green-600" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-${service.color}-200 rounded-full text-${service.color}-800 text-xs font-semibold`}>
                    {service.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Colorful Cards */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-64 h-64 rounded-full blur-3xl ${
                i % 3 === 0 ? 'bg-cyan-500/10' :
                i % 3 === 1 ? 'bg-purple-500/10' :
                'bg-pink-500/10'
              }`}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              By the Numbers
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Our commitment to excellence in every metric
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 text-center group"
              >
                <motion.div 
                  className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon name={stat.icon} size={24} className="text-white" />
                </motion.div>
                <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="relative h-48 sm:h-56 lg:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/50 to-transparent"></div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="relative h-48 sm:h-56 lg:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl mt-4 sm:mt-8"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team meeting"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/50 to-transparent"></div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-100 z-10"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center"
                  >
                    <Icon name="Award" size={24} className="text-white" />
                  </motion.div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">Best Team 2025</div>
                    <div className="text-xs sm:text-sm text-gray-600">Industry Recognition</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                Our Team
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Built by Experts, Driven by Passion
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Our team consists of industry veterans, certified trainers, and compliance specialists dedicated to your success.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {[
                  { icon: 'Users', title: 'Expert Team', description: '50+ certified compliance professionals', color: 'from-cyan-500 to-teal-500' },
                  { icon: 'Award', title: 'Industry Recognition', description: 'Multiple awards and certifications', color: 'from-purple-500 to-pink-500' },
                  { icon: 'Globe', title: 'Global Reach', description: 'Operating in 15+ countries worldwide', color: 'from-orange-500 to-red-500' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 transition-all duration-300 group"
                  >
                    <motion.div 
                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon name={item.icon} size={20} className="text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-cyan-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Compliance?
            </h2>
            <p className="text-lg sm:text-xl text-cyan-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join 1000+ organizations that trust PeopleSkillTraining for their regulatory success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-cyan-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-2xl text-sm sm:text-base"
                  onClick={() => navigate('/webinars/live')}
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Start Learning Today
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base"
                  onClick={() => navigate('/contact')}
                >
                  <Icon name="Phone" size={20} className="mr-2" />
                  Schedule Consultation
                </Button>
              </motion.div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-white">
              {[
                { icon: 'Shield', text: '99% Success Rate' },
                { icon: 'Clock', text: '24/7 Support' },
                { icon: 'Award', text: '100% Guaranteed' }
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <Icon name={badge.icon} size={18} className="text-cyan-200" />
                  <span className="text-xs sm:text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
