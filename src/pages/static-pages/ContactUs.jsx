import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-teal-50/50">
      <main className="pt-16 sm:pt-20">
        {/* Enhanced Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="pt-6 sm:pt-8 md:pt-10 lg:pt-12 relative overflow-hidden"
        >
          {/* Enhanced Background Decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.25, 0.1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-tr from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl"
            />
            
            {/* Enhanced Floating Elements */}
            <motion.div
              animate={{ 
                y: [-20, 20, -20],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 right-4 sm:right-8 md:right-16 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl shadow-xl hidden sm:flex items-center justify-center"
            >
              <Icon name="Mail" size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-500" />
            </motion.div>

            <motion.div
              animate={{ 
                x: [-15, 15, -15],
                y: [-10, 10, -10],
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-1/3 left-4 sm:left-8 md:left-16 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/15 backdrop-blur-lg border border-white/25 rounded-lg shadow-xl hidden sm:flex items-center justify-center"
            >
              <Icon name="MessageCircle" size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-teal-500" />
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-center mb-8 sm:mb-12 md:mb-16"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full mb-4 sm:mb-6 md:mb-8 shadow-lg border border-cyan-200"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mr-2 sm:mr-3"
                >
                  <Icon name="MessageCircle" size={10} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white" />
                </motion.div>
                <span className="text-xs sm:text-sm md:text-sm font-semibold text-cyan-800">Get In Touch</span>
              </motion.div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight px-2">
                Contact{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Us</span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
                  />
                </span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 sm:px-6">
                We'd love to hear from you! Whether you have questions, need support, or want to learn more about our services, our team is here to help. Reach out to us today, and let's start working together to ensure your organization stays compliant and secure.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Contact Content */}
        <section className="pb-8 sm:pb-10 md:pb-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {/* Professional Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                      <Icon name="Phone" size={14} className="sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 text-white" />
                    </div>
                    Get in Touch
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Email */}
                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors duration-200">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Mail" size={16} className="sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Email Us</h3>
                        <a 
                          href="mailto:support@peopleskilltraining.com" 
                          className="text-sm sm:text-base text-cyan-600 hover:text-cyan-700 transition-colors duration-200 font-medium break-all"
                        >
                          support@peopleskilltraining.com
                        </a>
                      </div>
                    </div>
                        {/* <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors duration-200">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Phone" size={16} className="sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Call Us</h3>
                        <a 
                          href="tel:+91-9787546789" 
                          className="text-sm sm:text-base text-cyan-600 hover:text-cyan-700 transition-colors duration-200 font-medium break-all"
                        >
                          +91-9787546789
                        </a>
                      </div>
                    </div> */}

                    {/* Location */}
                    {/* <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-teal-50 rounded-lg">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Icon name="MapPin" size={16} className="sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Our Location</h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                          375 Redondo Ave # 1199<br />
                          Long Beach, CA 90814<br />
                          United States
                         
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Response Time Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl p-4 sm:p-6 text-white"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                      <Icon name="Zap" size={20} className="sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold">Quick Response</h3>
                  </div>
                  <p className="text-sm sm:text-base text-cyan-100 leading-relaxed">
                    We typically respond to all inquiries within 24 hours during business days. 
                    For urgent matters, please email us directly.
                  </p>
                </motion.div>
              </motion.div>

              {/* Professional Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4"
                    >
                      <Icon name="Send" size={16} className="sm:w-5 sm:h-5 text-white" />
                    </motion.div>
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-cyan-300 text-sm sm:text-base"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-cyan-300 text-sm sm:text-base"
                          placeholder="your.email@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-cyan-300 text-sm sm:text-base"
                          placeholder="Your company name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-cyan-300 text-sm sm:text-base"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-cyan-300 text-sm sm:text-base"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="training">Training Programs</option>
                        <option value="consulting">Consulting Services</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="career">Career Opportunities</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none hover:border-cyan-300 text-sm sm:text-base"
                        placeholder="Tell us about your compliance training needs or ask any questions you have..."
                      ></textarea>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Icon name="Send" size={16} className="sm:w-5 sm:h-5 mr-2" />
                        Send Message
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Career Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-2 border-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-white rounded-full"
            />
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-2xl"
              >
                <Icon name="Users" size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 leading-tight px-2"
              >
                Ready To Join with{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    exceptional quality
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
                  />
                </span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-10 md:mb-12 px-4"
              >
                At <span className="text-cyan-400 font-semibold">PeopleSkillTraining</span>, we're always looking for passionate individuals to join our team. If you're eager to make an impact in the world of compliance training, work in a collaborative environment, and grow your career, we'd love to hear from you.
              </motion.p>
            </div>

            {/* Enhanced Benefits Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16"
            >
              {[
                { icon: 'Target', title: 'Make Impact', description: 'Shape the future of compliance training' },
                { icon: 'Users', title: 'Collaborative', description: 'Work with passionate professionals' },
                { icon: 'TrendingUp', title: 'Grow Career', description: 'Unlimited growth opportunities' }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300 group"
                >
                  <motion.div 
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                  >
                    <Icon name={benefit.icon} size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ContactUs;
