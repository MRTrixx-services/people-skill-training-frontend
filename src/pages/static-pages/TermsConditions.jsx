import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/ui/PublicHeader';
import Icon from '../../components/AppIcon';

export default function TermsConditions() {
  const [activeSection, setActiveSection] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const sections = [
  {
    id: 'introduction',
    icon: 'FileText',
    title: 'Introduction',
    content: `Welcome to PeopleSkillTraining.com (“we,” “us,” or “our”). By accessing or using this website and its services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these Terms, you must not use this website.`,
  },
  {
    id: 'use-of-website',
    icon: 'Globe',
    title: 'Use of the Website',
    items: [
      'You must be at least 18 years old or have the consent of a legal guardian to use this website.',
      'You agree to use the site only for lawful purposes and in accordance with these Terms.',
      'You are responsible for maintaining the confidentiality of your account information and password.',
    ],
  },
  {
    id: 'services-offered',
    icon: 'Briefcase',
    title: 'Services Offered',
    content: `PeopleSkillTraining.com provides compliance-related training programs, courses, educational resources, and consulting services.`,
    items: [
      'We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.',
    ],
  },
  {
    id: 'account-registration',
    icon: 'User',
    title: 'Account Registration',
    items: [
      'To access certain features, you may be required to create an account.',
      'You agree to provide accurate, current, and complete information during registration.',
      'We may suspend or terminate accounts that contain false or misleading information.',
    ],
  },
  {
    id: 'fees-payments',
    icon: 'CreditCard',
    title: 'Fees and Payments',
    items: [
      'All course fees, subscriptions, or other charges are displayed on our website.',
      'Payments must be made in full before access is granted to any paid content.',
      'All prices are subject to change without notice.',
      'Refunds are provided only as per our Refund Policy.',
    ],
  },
  {
    id: 'intellectual-property',
    icon: 'BookOpen',
    title: 'Intellectual Property',
    items: [
      'All website content, including text, graphics, logos, videos, and course materials, is the property of PeopleSkillTraining.com or its licensors.',
      'You may not copy, reproduce, distribute, or modify any content without our prior written consent.',
    ],
  },
  {
    id: 'user-conduct',
    icon: 'ShieldAlert',
    title: 'User Conduct',
    items: [
      'Do not use the website for unlawful, fraudulent, or harmful purposes.',
      'Do not upload or transmit viruses, malware, or harmful code.',
      'Do not share course materials publicly or with unauthorized third parties.',
    ],
  },
  {
    id: 'third-party-links',
    icon: 'Link',
    title: 'Third-Party Links',
    content: `Our website may include links to external websites. We do not endorse or take responsibility for the content, privacy practices, or policies of third-party sites.`,
  },
  {
    id: 'disclaimer',
    icon: 'AlertTriangle',
    title: 'Disclaimer of Warranties',
    content: `The website and its services are provided on an “as is” and “as available” basis. We make no warranties, express or implied, about the accuracy, completeness, or reliability of the content or services.`,
  },
  {
    id: 'limitation-liability',
    icon: 'Slash',
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by law, PeopleSkillTraining.com and its affiliates shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of your use of the website or services.`,
  },
  {
    id: 'indemnification',
    icon: 'Gavel',
    title: 'Indemnification',
    content: `You agree to indemnify and hold harmless PeopleSkillTraining.com, its officers, employees, and affiliates from any claims, losses, damages, or expenses resulting from your use of the website or violation of these Terms.`,
  },
  {
    id: 'privacy',
    icon: 'Lock',
    title: 'Privacy',
    content: `Your use of the website is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal data.`,
  },
  {
    id: 'termination',
    icon: 'XCircle',
    title: 'Termination',
    content: `We may suspend or terminate your access to the website at any time, without notice, for any violation of these Terms.`,
  },
  {
    id: 'governing-law',
    icon: 'Scale',
    title: 'Governing Law and Jurisdiction',
    content: `These Terms are governed by and construed in accordance with the laws of the USA. Any disputes shall be subject to the exclusive jurisdiction of the courts in CA, USA.`,
  },
  {
    id: 'changes-to-terms',
    icon: 'RefreshCw',
    title: 'Changes to Terms',
    content: `We may update these Terms from time to time. Any changes will be posted on this page with the updated effective date. Your continued use of the website constitutes acceptance of the revised Terms.`,
  },
];

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Scroll spy functionality with proper offset for center positioning
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + (window.innerHeight / 2);

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 text-gray-900"
    >
    
      <main className="pt-14 md:pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 to-gray-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ 
                hidden: { opacity: 0 }, 
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
              }}
              className="text-center"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/40 rounded-full border border-slate-600/30 text-xs md:text-sm mb-4 sm:mb-6"
              >
                <Icon name="FileText" size={14} className="text-slate-300" />
                <span className="font-medium">Legal Guidelines</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp} 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4"
              >
                Terms & Conditions
              </motion.h1>

              <motion.p 
                variants={fadeInUp} 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-100 max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed"
              >
                Welcome to PeopleSkillTraining. By accessing or using our website, services, and products, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
              </motion.p>

              <motion.div 
                variants={fadeInUp} 
                className="inline-flex items-center gap-2 text-slate-200 text-xs md:text-sm"
              >
                <Icon name="Calendar" size={14} />
                <span>Last updated: {lastUpdated}</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar Navigation */}
            <motion.nav 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 flex items-center gap-2">
                    <Icon name="List" size={16} className="text-slate-600" />
                    Contents
                  </h3>
                  <ul className="space-y-1 sm:space-y-2">
                    {sections.map((section) => {
                      const isActive = activeSection === section.id;
                      return (
                        <li key={section.id}>
                          <button
                            onClick={() => scrollToSection(section.id)}
                            className={`flex items-center gap-2 sm:gap-3 w-full text-left p-2 rounded-md transition-all text-xs md:text-sm ${
                              isActive 
                                ? 'bg-slate-600 text-white' 
                                : 'hover:bg-gray-100 text-gray-700 hover:text-slate-600'
                            }`}
                          >
                            <Icon name={section.icon} size={14} />
                            <span className="font-medium">{section.title}</span>
                          </button>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        onClick={() => scrollToSection('contact')}
                        className={`flex items-center gap-2 sm:gap-3 w-full text-left p-2 rounded-md transition-all text-xs md:text-sm ${
                          activeSection === 'contact' 
                            ? 'bg-slate-600 text-white' 
                            : 'hover:bg-gray-100 text-gray-700 hover:text-slate-600'
                        }`}
                      >
                        <Icon name="Mail" size={14} />
                        <span className="font-medium">Contact Information</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.nav>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 sm:space-y-8"
              >
                {sections.map((section, idx) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <div className={`bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 ${
                      activeSection === section.id ? 'ring-2 ring-slate-500/20 border-slate-200' : ''
                    }`}>
                      {/* Mobile-first layout: Icon on top, content below */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                        {/* Icon - Top on mobile, left on desktop */}
                        <div className="p-2 sm:p-3 rounded-lg bg-slate-600 text-white flex-shrink-0 self-center sm:self-start">
                          <Icon name={section.icon} size={20} className="sm:w-6 sm:h-6" />
                        </div>

                        {/* Content - Below icon on mobile, right on desktop */}
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <h2 className="text-md md:text-xl font-bold mb-3 sm:mb-4 text-gray-900">
                            {section.title}
                          </h2>
                          
                          <p className="text-sm md:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                            {section.content}
                          </p>

                          {section.items && section.items.length > 0 && (
                            <ul className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 text-left">
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-2 sm:gap-3 text-sm md:text-base text-gray-700">
                                  <div className="w-2 h-2 rounded-full bg-slate-600 mt-1.5 sm:mt-2 flex-shrink-0" />
                                  <span className="leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                ))}

                {/* Contact Section */}
                <motion.section
                  id="contact"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 ${
                    activeSection === 'contact' ? 'ring-2 ring-slate-500/20 border-slate-200' : ''
                  }`}>
                    {/* Mobile-first layout for contact section */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      {/* Icon - Top on mobile, left on desktop */}
                      <div className="p-2 sm:p-3 rounded-lg bg-blue-600 text-white flex-shrink-0 self-center sm:self-start">
                        <Icon name="Mail" size={20} className="sm:w-6 sm:h-6" />
                      </div>

                      {/* Content - Below icon on mobile, right on desktop */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                          Contact Information
                        </h2>
                        <p className="text-sm md:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                          If you have any questions or concerns about these Terms & Conditions, please contact us at:
                        </p>

                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Mail" size={16} className="text-blue-600" />
                            <span className="font-semibold text-gray-900 text-sm md:text-base">Email:</span>
                          </div>
                          <a 
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors break-all"
                            href="mailto:support@peopleskilltraining.com"
                          >
                            support@peopleskilltraining.com
                          </a>

                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-xs md:text-sm text-gray-600">
                            <p className="font-medium text-gray-800 mb-1">PeopleSkillTraining</p>
                            <p>This Terms & Conditions document provides the necessary guidelines for users accessing your services, ensuring both legal protection and clarity. Be sure to adapt these terms to meet the specific needs of your business and consult a legal professional if necessary.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Policy Update Notice */}
                <motion.div 
                  className="text-center py-4 sm:py-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="inline-flex items-center gap-2 bg-slate-50 px-3 sm:px-4 py-2 rounded-full border border-slate-200">
                    <Icon name="RefreshCw" size={12} className="text-slate-600" />
                    <span className="text-xs md:text-sm text-gray-700">
                      Terms last updated: <span className="text-slate-600 font-semibold">{lastUpdated}</span>
                    </span>
                  </div>
                </motion.div>
              </motion.article>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
