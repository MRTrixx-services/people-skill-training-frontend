import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './ui/Button';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Training",
      links: [
        { label: "Live Webinars", path: "/webinars/live", icon: "Video" },
        { label: 'On-Demand Courses', path: '/webinars/recorded', icon: "Play" },
        // { label: "Enterprise Solutions", path: "/webinars/live", icon: "Award" },
        { label: "Get Started", path: "/register", icon: "UserPlus" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about", icon: "Info" },
        { label: "Contact", path: "/contact", icon: "MessageCircle" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & Conditions", path: "/terms-conditions" },
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Refund Policy", path: "/refund-cancellation-policy" },
        { label: "Shipping Policy", path: "/shipping-return-policy" }
      ]
    }
  ];

  const handleLinkClick = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-gradient-to-br from-[#093389] via-[#064ad4] to-[#004b8d] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 120, 212, 0.4) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/assets/logo (4).png" 
                  alt="PeopleSkillTraining Logo" 
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] bg-clip-text text-transparent">
                  PeopleSkillTraining

                </span>
              </div>
              <p className="text-sm sm:text-base text-[#d9ecff] mb-6 leading-relaxed">
                Your trusted partner for expert compliance training solutions. Stay ahead of regulatory requirements with our comprehensive webinars and certification programs.
              </p>
            </div>

            {/* Footer Links */}
            {footerSections?.map((section) => (
              <div key={section?.title}>
                <h4 className="text-base sm:text-lg font-bold mb-4 text-[#d9ecff]">{section?.title}</h4>
                <ul className="space-y-3">
                  {section?.links?.map((link) => (
                    <li key={link?.label}>
                      <button
                        onClick={() => handleLinkClick(link?.path)}
                        className="text-sm text-[#f5f9ff] hover:text-white transition-colors duration-200 focus-ring rounded px-1 py-1 text-left flex items-center gap-2 group w-full"
                      >
                        {link.icon && (
                          <Icon name={link.icon} size={14} className="text-[#d9ecff] group-hover:text-white transition-colors" />
                        )}
                        <span>{link?.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-[#d9ecff]/20 py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#064ad4]/30 backdrop-blur-sm border border-[#d9ecff]/20 hover:border-[#d9ecff]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0078d4] to-[#064ad4] flex items-center justify-center flex-shrink-0">
                <Icon name="Mail" size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#f5f9ff] mb-1">Email Support</div>
                <a href="mailto:support@peopleskilltrain.com" className="text-sm text-[#d9ecff] hover:text-white transition-colors break-all">
                  support@peopleskilltraining.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#064ad4]/30 backdrop-blur-sm border border-[#d9ecff]/20 hover:border-[#d9ecff]/50 transition-all duration-300">
              {/* <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#004b8d] to-[#0078d4] flex items-center justify-center flex-shrink-0">
                <Icon name="MapPin" size={20} className="text-white" />
              </div> */}
              <div>
                {/* <div className="text-sm font-semibold text-[#f5f9ff] mb-1">Our Location</div> */}
                {/* <div className="text-sm text-[#d9ecff] leading-relaxed">
                  375 Redondo Ave # 1199<br />
                  Long Beach, CA 90814<br />
                  United States
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Certifications/Trust Badges */}
        <div className="border-t border-[#d9ecff]/20 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2 text-[#f5f9ff]">
              <Icon name="Shield" size={20} className="text-[#d9ecff]" />
              <span className="text-sm font-medium">SHRM Approved</span>
            </div>
            <div className="flex items-center gap-2 text-[#f5f9ff]">
              <Icon name="Award" size={20} className="text-[#d9ecff]" />
              <span className="text-sm font-medium">HRCI Certified</span>
            </div>
            <div className="flex items-center gap-2 text-[#f5f9ff]">
              <Icon name="CheckCircle" size={20} className="text-[#d9ecff]" />
              <span className="text-sm font-medium">ISO 9001 Compliant</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#d9ecff]/20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="text-sm text-[#f5f9ff] text-center md:text-left">
              © {currentYear} PeopleSkillTraining. All rights reserved. | Empowering businesses through expert compliance training.
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#0078d4]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#004b8d]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
};

export default Footer;