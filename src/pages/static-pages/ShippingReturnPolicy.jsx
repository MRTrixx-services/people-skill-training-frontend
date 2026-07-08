import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/ui/PublicHeader';
import Icon from '../../components/AppIcon';

export default function ShippingReturnPolicy() {
  const [activeSection, setActiveSection] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const sections = [
    {
      id: 'overview',
      title: '1. Overview',
      icon: 'FileText',
      content:
        'At PeopleSkillTraining.com, we specialize in delivering online compliance training, certification programs, and consulting services. As our products and services are primarily digital in nature, no physical shipping is required. This Shipping / Delivery Policy explains how and when you can expect to receive access to your purchased courses or services.',
    },
    {
      id: 'digital-delivery',
      title: '2. Digital Course Delivery',
      icon: 'CloudLightning',
      content:
        'All courses, programs, and learning materials are delivered electronically via your registered email address and/or the PeopleSkillTraining.com user dashboard. Once your payment is confirmed, you will receive an email confirmation containing your login credentials or access instructions.',
      items: [
        'Course access is typically granted immediately or within 24 hours of payment confirmation.',
        'Ensure your registered email address is active and monitored to receive access details promptly.',
      ],
    },
    {
      id: 'live-training',
      title: '3. Live Training Sessions / Webinars',
      icon: 'Video',
      content:
        'For live sessions or instructor-led programs, participants will receive joining details and access links (e.g., Zoom, MS Teams, or similar platforms) via email before the scheduled start time.',
      items: [
        'Access details are sent at least 24–48 hours prior to the live session.',
        'If you do not receive joining instructions within this period, please contact support@peopleskilltraining.com for assistance.',
      ],
    },
    {
      id: 'physical-materials',
      title: '4. Physical Materials (if applicable)',
      icon: 'Package',
      content:
        'In rare cases where physical materials (e.g., printed certificates or resources) are offered, delivery timelines and methods will be clearly communicated in advance.',
      items: [
        'Shipping will be done through reliable courier partners.',
        'Delivery time typically ranges between 7–10 business days within India, depending on location.',
        'International deliveries may take 10–15 business days.',
      ],
    },
    {
      id: 'failed-delivery',
      title: '5. Failed Delivery / Access Issues',
      icon: 'AlertCircle',
      content:
        'If you have not received access to your course or session within the stated time, please follow the steps below to resolve it promptly.',
      items: [
        'Check your email spam/junk folder for any missed communication.',
        'Contact us at support@peopleskilltraining.com with your order ID and registered email.',
        'Our team will resolve access issues within 1–2 business days.',
      ],
    },
    {
      id: 'service-availability',
      title: '6. Service Availability',
      icon: 'Clock',
      content:
        'Digital course access is available 24/7 once activated. PeopleSkillTraining.com may temporarily suspend access for maintenance, updates, or technical upgrades, with prior notice where possible.',
    },
    {
      id: 'refund-policy',
      title: '7. Cancellation & Refunds',
      icon: 'RotateCcw',
      content:
        'For cancellations or refund-related details, please refer to our official Refund & Cancellation Policy.',
      additional:
        '👉 Visit our Refund & Cancellation Policy page for complete details.',
    },
    {
      id: 'contact-info',
      title: '8. Contact Us',
      icon: 'Mail',
      content:
        'For any questions regarding digital delivery or shipping, please reach out to us using the contact details below.',
      items: [
        '📧 Email: support@peopleskilltraining.com',
        '🌐 Website: https://www.peopleskilltraining.com',
        // '📍 Address: 375 Redondo Ave #1199, Long Beach, CA 90814, United States',
      ],
    },
  ];

  const lastUpdated = new Date('2025-06-01').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
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
        inline: 'nearest',
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
        <section className="bg-gradient-to-br from-green-900 to-emerald-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-2 bg-green-800/40 rounded-full border border-green-600/30 text-xs md:text-sm mb-6"
              >
                <Icon name="Package" size={14} className="text-green-300" />
                <span className="font-medium">Digital Products & Services</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-3xl md:text-5xl font-bold mb-4"
              >
                Shipping & Return Policy
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-sm md:text-lg text-green-100 max-w-3xl mx-auto leading-relaxed"
              >
                At PeopleSkillTraining, we strive to provide excellent service and
                make your experience as seamless as possible. Please read this
                policy carefully for information regarding our digital products
                and services.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 text-green-200 text-xs md:text-sm mt-4"
              >
                <Icon name="Calendar" size={14} />
                <span>Last updated: {lastUpdated}</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar */}
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Icon name="List" size={16} className="text-green-600" />
                    Contents
                  </h3>
                  <ul className="space-y-2">
                    {sections.map((section) => {
                      const isActive = activeSection === section.id;
                      return (
                        <li key={section.id}>
                          <button
                            onClick={() => scrollToSection(section.id)}
                            className={`flex items-center gap-2 w-full text-left p-2 rounded-md text-sm transition-all ${
                              isActive
                                ? 'bg-green-600 text-white'
                                : 'hover:bg-gray-100 text-gray-700 hover:text-green-600'
                            }`}
                          >
                            <Icon name={section.icon} size={14} />
                            <span>{section.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.nav>

            {/* Content */}
            <div className="lg:col-span-3">
              {sections.map((section, idx) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 ${
                    activeSection === section.id
                      ? 'ring-2 ring-green-500/20 border-green-200'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-green-600 text-white flex-shrink-0">
                      <Icon name={section.icon} size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900">
                        {section.title}
                      </h2>
                      <p className="text-sm md:text-base text-gray-700 mb-3">
                        {section.content}
                      </p>
                      {section.items && (
                        <ul className="list-disc ml-6 space-y-2 text-gray-700 text-sm md:text-base">
                          {section.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {section.additional && (
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600 mt-4">
                          <p className="text-sm md:text-base text-gray-700 font-medium">
                            {section.additional}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
