import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { motion } from 'framer-motion';
import PricingSelection from './PricingSelection';
import { useAuth } from 'contexts/AuthContext';

const WebinarDescription = ({
  description,
  webinar,
  pricing,
  selectedOptions,
  setSelectedOptions,
  handleDirectCheckout,
  cartItems,
  navigate,
  isValidSelection,
  getAdminQuickActions
}) => {
  const { user, isAuthenticated, token } = useAuth();
    
  return (
    <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
      {/* Admin Quick Actions */}
      {getAdminQuickActions() && (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {getAdminQuickActions()}
        </div>
      )}

      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
        {/* Left Side: 65% - Webinar Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-[65%] bg-white backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-10 border border-[#d6e6f7] shadow-xl overflow-hidden"
        >
          <h3 className="text-xl font-bold text-[#093389] mb-6 flex items-center border-b border-[#d6e6f7] pb-3">
            <Icon name="BookOpen" size={20} className="mr-3 text-[#0078d4]" />
            Webinar Details
          </h3>
          
          {/* HTML Content */}
          <div 
            className="webinar-content text-[#444444] leading-relaxed break-words overflow-wrap-anywhere
                       [&>ul]:space-y-3 [&>ul]:my-6 [&>ul]:ml-0 [&>ul]:pl-0
                       [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:list-none
                       [&>ul>li]:text-[#444444] [&>ul>li]:text-sm [&>ul>li]:leading-relaxed [&>ul>li]:break-words
                       
                       [&>h1]:text-[#093389] [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h1]:border-b [&>h1]:border-[#0078d4]/50 [&>h1]:pb-2 [&>h1]:break-words
                       [&>h2]:text-[#093389] [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:break-words
                       [&>h3]:text-[#093389] [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:break-words
                       [&>h4]:text-[#004b8d] [&>h4]:text-base [&>h4]:font-semibold [&>h4]:mt-3 [&>h4]:mb-2 [&>h4]:break-words
                       [&>p]:text-[#444444] [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-sm [&>p]:break-words
                       [&>strong]:text-[#093389] [&>strong]:text-2xl [&>strong]:font-bold [&>strong]:break-words
                       [&>b]:text-[#093389] [&>b]:font-bold [&>b]:break-words
                       [&>em]:text-[#0078d4] [&>em]:italic [&>em]:break-words
                       [&>a]:text-[#0078d4] [&>a]:underline [&>a]:font-medium hover:[&>a]:text-[#064ad4] [&>a]:break-all
                       [&>blockquote]:border-l-4 [&>blockquote]:border-[#0078d4] [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-[#064ad4] [&>blockquote]:bg-[#f5f9ff] [&>blockquote]:break-words
                       [&>code]:bg-[#f5f9ff] [&>code]:text-[#093389] [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-xs [&>code]:border border-[#d6e6f7] [&>code]:break-all
                       [&>pre]:bg-[#f5f9ff] [&>pre]:text-[#093389] [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-4 [&>pre]:border border-[#d6e6f7]
                       [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-6 [&>img]:mx-auto [&>img]:shadow-lg
                       [&>table]:w-full [&>table]:bg-white [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:my-6 [&>table]:border border-[#d6e6f7] [&>table]:table-fixed
                       [&>th]:text-[#093389] [&>th]:font-semibold [&>th]:p-3 [&>th]:text-left [&>th]:bg-[#f5f9ff] [&>th]:border-b border-[#d6e6f7] [&>th]:break-words
                       [&>td]:p-3 [&>td]:text-[#444444] [&>td]:border-b border-[#d6e6f7] [&>td]:break-words
                       [&>hr]:border-0 [&>hr]:h-px [&>hr]:bg-gradient-to-r [&>hr]:from-transparent [&>hr]:via-[#0078d4] [&>hr]:to-transparent [&>hr]:my-6"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          
          <style jsx>{`
            .webinar-content {
              word-wrap: break-word;
              overflow-wrap: break-word;
              word-break: break-word;
              hyphens: auto;
            }
            
            .webinar-content ul {
              margin: 24px 0;
              padding: 0;
              list-style: none;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            
            .webinar-content ul li {
              display: flex;
              align-items: flex-start;
              list-style: none;
              color: #444444;
              font-size: 14px;
              line-height: 1.6;
              font-weight: 500;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            .webinar-content ul li::before {
              content: '✓';
              display: flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              background: linear-gradient(to right, #0078d4, #064ad4);
              border-radius: 50%;
              color: white;
              font-size: 11px;
              font-weight: bold;
              margin-right: 12px;
              margin-top: 2px;
              flex-shrink: 0;
              box-shadow: 0 2px 4px rgba(0, 120, 212, 0.3);
            }
            
            @media (min-width: 640px) {
              .webinar-content ul li::before {
                width: 24px;
                height: 24px;
                margin-right: 16px;
                font-size: 12px;
              }
            }
            
            .webinar-content h1 {
              color: #093389;
              font-size: 1.5rem;
              font-weight: bold;
              margin: 1.5rem 0 1rem 0;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid rgba(0, 120, 212, 0.5);
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            .webinar-content em {
              color: #0078d4;
              font-style: italic;
            }
            
            .webinar-content a {
              color: #0078d4;
              text-decoration: underline;
              font-weight: 500;
              word-break: break-all;
              overflow-wrap: break-word;
            }
            
            .webinar-content a:hover {
              color: #064ad4;
            }
            
            .webinar-content blockquote {
              border-left: 4px solid #0078d4;
              background-color: #f5f9ff;
              padding: 1rem 1.5rem;
              margin: 1.5rem 0;
              font-style: italic;
              color: #064ad4;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
          `}</style>
        </motion.div>

        {/* Right Side: 35% - Pricing Selection */}
        <div className="w-full lg:w-[35%]">
          <div className="lg:top-6">
            <PricingSelection
              webinar={webinar}
              pricing={webinar.pricing}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              handleDirectCheckout={handleDirectCheckout}
              cartItems={cartItems}
              navigate={navigate}
              isValidSelection={isValidSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarDescription;