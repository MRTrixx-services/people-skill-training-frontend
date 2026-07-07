import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/ui/PublicHeader';
import Icon from '../../components/AppIcon';

export default function RefundCancellationPolicy() {
  const [activeSection, setActiveSection] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // ✅ Policy Sections
  const sections = [
    {
      id: 'overview',
      title: '1. Overview',
      icon: 'FileText',
      content:
        'At PeopleSkillTraining.com, we aim to deliver high-quality compliance training, live sessions, and learning programs. This Refund & Cancellation Policy explains the terms under which refunds or cancellations may be granted for our online courses, webinars, and consulting services. By enrolling in or purchasing any course on our website, you agree to the terms stated in this policy.'
    },
    {
      id: 'course-enrollment',
      title: '2. Course Enrollment & Access',
      icon: 'BookOpen',
      items: [
        'Once payment is completed and course access is granted, the fees are generally non-refundable, except under the conditions listed below.',
        'Digital course materials and credentials are considered delivered once they are shared electronically via email or user dashboard.'
      ]
    },
    {
      id: 'refund-eligibility',
      title: '3. Refund Eligibility',
      icon: 'CheckCircle',
      content: 'Refunds may be approved only under the following circumstances:',
      items: [
        'Duplicate Payment: If you are charged twice for the same course or service, the duplicate transaction will be refunded after verification.',
        'Technical Issues: If you are unable to access the course or live session due to a verified technical issue on our platform (not due to user error, poor internet, or device incompatibility).',
        'Event or Session Cancelled by Organizer: If a scheduled live event, webinar, or session is cancelled by PeopleSkillTraining.com, participants will be eligible for a full refund or credit transfer to another program.',
        'Participant Cancellation with Prior Notice: If a participant cannot attend a live session and provides at least 48 hours’ prior notice before the scheduled start time, a refund or credit transfer may be approved.'
      ]
    },
    {
      id: 'non-refundable',
      title: '4. Non-Refundable Situations',
      icon: 'XCircle',
      content: 'Refunds will not be issued in the following cases:',
      items: [
        'Change of mind after purchase.',
        'Missed live sessions or events without prior 48-hour notice.',
        'Failure to complete an online course within the access period.',
        'Non-participation after registration.',
        'Ineligibility for certification due to non-compliance with course requirements.',
        'Attendance of a session — no refunds will be granted once a participant has attended.',
        'Purchases made under special offers, discounts, or promotions.'
      ]
    },
    {
      id: 'subscriptions',
      title: '5. Subscription or Membership Plans',
      icon: 'Repeat',
      items: [
        'Subscriptions can be canceled before the next billing cycle to avoid renewal charges.',
        'Payments already made for the current cycle are non-refundable.'
      ]
    },
    {
      id: 'process',
      title: '6. Refund & Cancellation Process',
      icon: 'ClipboardList',
      items: [
        'Send an email to support@peopleskilltraining.com with your order ID, registered email address, and reason for the request.',
        'Each request will be reviewed in accordance with this policy.',
        'All approved refunds will be processed within 5 working days from the date of approval.',
        'Refunds will be issued only to the original payment method used at the time of purchase.'
      ]
    },
    {
      id: 'please-note',
      title: '7. Please Note',
      icon: 'AlertTriangle',
      items: [
        'No refunds will be issued for missed sessions or events without prior notice.',
        'No refunds will be granted after attending a session or accessing paid course content.'
      ]
    },
    {
      id: 'policy-updates',
      title: '8. Policy Updates',
      icon: 'RefreshCcw',
      items: [
        'PeopleSkillTraining.com reserves the right to revise or update this Refund & Cancellation Policy at any time without prior notice.',
        'Any changes will be posted on this page with the updated effective date.'
      ]
    }
  ];

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // ✅ Scroll spy setup
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

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
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        {/* Header */}
        <section className="bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
              <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-3">
                Refund & Cancellation Policy
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-purple-100 max-w-3xl mx-auto mb-4">
                Effective Date: 06/01/2025
              </motion.p>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-purple-200 text-xs md:text-sm">
                <Icon name="Calendar" size={14} />
                <span>Last updated: {lastUpdated}</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar */}
            <motion.nav initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <Icon name="List" size={16} className="text-purple-600" /> Contents
                  </h3>
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={`flex items-center gap-2 w-full text-left p-2 rounded-md text-sm transition-all ${
                            activeSection === section.id ? 'bg-purple-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon name={section.icon} size={14} />
                          {section.title}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => scrollToSection('contact')}
                        className={`flex items-center gap-2 w-full text-left p-2 rounded-md text-sm transition-all ${
                          activeSection === 'contact' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon name="Mail" size={14} /> Contact Us
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.nav>

            {/* Content */}
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              {sections.map((section, idx) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`bg-white p-6 rounded-lg shadow-sm border ${
                    activeSection === section.id ? 'ring-2 ring-purple-500/20 border-purple-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-lg">
                      <Icon name={section.icon} size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold mb-3">{section.title}</h2>
                      {section.content && <p className="text-gray-700 mb-3">{section.content}</p>}
                      {section.items && (
                        <ul className="space-y-2 text-gray-700">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.section>
              ))}

              {/* Contact */}
              <motion.section
                id="contact"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-lg">
                    <Icon name="Mail" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold mb-3">9. Contact Us</h2>
                    <p className="text-gray-700 mb-3">
                      For any questions or concerns regarding this policy, please contact:
                    </p>
                    <ul className="space-y-1 text-gray-700">
                      <li>
                        📧 <strong>Email:</strong>{' '}
                        <a href="mailto:support@peopleskilltraining.com" className="text-blue-600 hover:underline">
                          support@peopleskilltraining.com
                        </a>
                      </li>
                      <li>🌐 <strong>Website:</strong> https://www.peopleskilltraining.com</li>
                      <li>📍 <strong>Address:</strong> 375 Redondo Ave #1199, Long Beach, CA 90814, United States</li>
                    </ul>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
