import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/ui/PublicHeader';
import Icon from '../../components/AppIcon';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: 'BookOpen',
      content: `Welcome to PeopleSkillTraining.com (“we,” “us,” or “our”). We value your privacy and are committed to protecting your personal information.`,
      items: [
        'This Privacy Policy explains how we collect, use, store, and safeguard your data when you visit our website or register for our services.',
        'By using this website, you agree to the collection and use of information in accordance with this policy.'
      ]
    },
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      icon: 'Database',
      content: 'We collect the following types of information to provide and improve our services:',
      items: [
        'Personal Information (e.g., full name, email, phone number, billing details, company name).',
        'Non-Personal Information (e.g., browser type, device, IP address, location, usage data).'
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: 'Activity',
      content: 'We use your data to:',
      items: [
        'Register and manage your account.',
        'Provide access to purchased courses or services.',
        'Process payments and issue invoices.',
        'Send course updates, learning materials, and support communication.',
        'Improve our website and comply with legal obligations.'
      ],
      additional: 'We do not sell, rent, or trade your personal information to any third parties.'
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking Technologies',
      icon: 'Cookie',
      content: 'Our website uses cookies and similar tracking tools to enhance user experience and collect analytics.',
      additional: 'You can disable cookies in your browser settings, but some parts of the site may not function properly without them.'
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing and Disclosure',
      icon: 'Share2',
      content: 'We may share information only in the following situations:',
      items: [
        'With Service Providers: For payment, hosting, or analytics (bound by confidentiality agreements).',
        'Legal Requirements: When required by law or regulatory authorities.',
        'Business Transfers: In mergers or acquisitions, data may be transferred under protection.'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: 'Shield',
      content: 'We use appropriate security measures (including SSL encryption) to safeguard your data.',
      additional: 'While we strive for full protection, no online transmission or storage method is 100% secure.'
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: 'Clock',
      content: 'We retain your data only as long as necessary to:',
      items: [
        'Provide services and maintain your account.',
        'Comply with legal, tax, or regulatory requirements.',
        'Resolve disputes and enforce agreements.'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: 'UserCheck',
      content: 'Depending on your jurisdiction, you may have the right to:',
      items: [
        'Access, update, or delete your personal data.',
        'Withdraw consent for marketing or processing.',
        'Request details about how your data is used.'
      ],
      additional: 'You can exercise these rights by contacting us at support@peopleskilltraining.com.'
    },
    {
      id: 'email-marketing',
      title: 'Email Communication & Marketing',
      icon: 'Mail',
      content: 'By signing up, you consent to receive course-related and promotional emails.',
      additional: 'You can unsubscribe anytime using the link in our emails or by contacting us directly.'
    },
    {
      id: 'third-party',
      title: 'Third-Party Links',
      icon: 'ExternalLink',
      content: 'Our website may contain links to third-party platforms or payment processors.',
      additional: 'We are not responsible for the content or practices of those external websites.'
    },
    {
      id: 'children-privacy',
      title: 'Children’s Privacy',
      icon: 'Users',
      content: 'Our website and services are intended for individuals 18 years and older.',
      additional: 'We do not knowingly collect data from minors. If we discover such data, we delete it promptly.'
    },
    {
      id: 'international-users',
      title: 'International Users',
      icon: 'Globe',
      content: 'If you are accessing this website from outside India, your data may be processed in India where our servers are located.'
    },
    {
      id: 'policy-changes',
      title: 'Changes to This Privacy Policy',
      icon: 'RefreshCcw',
      content: 'We may update this Privacy Policy periodically. Updates will be reflected with a new Effective Date.',
      additional: 'Your continued use of the site after updates constitutes acceptance of the revised policy.'
    }
  ];

  const lastUpdated = new Date('2025-06-01').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen bg-gray-50 text-gray-900">
      <main className="pt-14 md:pt-16 lg:pt-20">
        {/* Header */}
        <section className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</motion.h1>
              <motion.p variants={fadeInUp} className="text-blue-100 max-w-3xl mx-auto mb-6">
                At PeopleSkillTraining, your privacy is our top priority. This policy explains how we handle your personal information securely and transparently.
              </motion.p>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-blue-200">
                <Icon name="Calendar" size={14} />
                <span>Effective Date: {lastUpdated}</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <nav className="lg:col-span-1 sticky top-24 self-start">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="List" size={16} className="text-blue-600" /> Contents
              </h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center gap-2 w-full text-left p-2 rounded-md text-sm ${
                        activeSection === section.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
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
                    className={`flex items-center gap-2 w-full text-left p-2 rounded-md text-sm ${
                      activeSection === 'contact' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon name="Mail" size={14} /> Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main Policy Sections */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section, idx) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`bg-white p-6 rounded-lg shadow-sm border ${
                  activeSection === section.id ? 'ring-2 ring-blue-500/20 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-600 text-white flex-shrink-0">
                    <Icon name={section.icon} size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                    <p className="text-gray-700 mb-4">{section.content}</p>
                    {section.items && (
                      <ul className="space-y-2 list-disc list-inside text-gray-700">
                        {section.items.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    )}
                    {section.additional && (
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mt-3 rounded">
                        <p className="text-sm text-gray-700">{section.additional}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            ))}

            {/* Contact Section */}
            <motion.section
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`bg-white p-6 rounded-lg shadow-sm border ${
                activeSection === 'contact' ? 'ring-2 ring-blue-500/20 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-600 text-white rounded-lg flex-shrink-0">
                  <Icon name="Mail" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Contact Information</h2>
                  <p className="text-gray-700 mb-3">
                    For questions, concerns, or requests regarding this Privacy Policy, please contact:
                  </p>
                  <p className="text-sm font-semibold text-green-700">📧 support@peopleskilltraining.com</p>
                  <p className="text-sm text-gray-600">🌐 https://www.peopleskilltraining.com</p>
                  {/* <p className="text-sm text-gray-600">📍 375 Redondo Ave #1199, Long Beach, CA 90814, United States</p> */}
                </div>
              </div>
            </motion.section>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
