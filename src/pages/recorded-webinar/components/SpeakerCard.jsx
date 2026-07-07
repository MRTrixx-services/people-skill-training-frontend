import React from "react";
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

function SpeakerCard({ instructor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-8xl bg-white my-6 mx-auto px-8 sm:px-10 md:px-12 backdrop-blur-sm rounded-xl p-6 border border-[#d6e6f7] shadow-xl"
    >
      <h3 className="text-xl font-bold text-[#093389] mb-6 flex items-center border-b border-[#d6e6f7] pb-3">
        <Icon name="User" size={20} className="mr-3 text-[#0078d4]" />
        Meet Your Speaker
      </h3>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Speaker Image */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="relative">
            <img
              src={instructor?.avatar || "/assets/images/instructor-placeholder.jpg"}
              alt={instructor?.name || "Dr. Sarah Johnson"}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-[#d9ecff] shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-[#0078d4] to-[#064ad4] rounded-full flex items-center justify-center border-3 border-white shadow-lg">
              <Icon name="CheckCircle" size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Speaker Info */}
        <div className="flex-1 text-center md:text-left">
          {/* Name and Title */}
          <div className="mb-4">
            <h4 className="text-2xl sm:text-3xl font-bold text-[#093389] mb-2">
              {instructor?.name || "Dr. Sarah Johnson"}
            </h4>
            
            {/* Title and Company in same row using flexbox */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="text-lg text-[#0078d4] font-semibold">
                {instructor?.title || "Senior Tax Consultant & CPA"}
              </p>
              <span className="text-[#d6e6f7]">•</span>
              <p className="text-sm text-[#555555] font-medium">
                {instructor?.company || "Tax Solutions Inc."}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <div 
              className="webinar-content text-[#444444] leading-relaxed
                   /* Clean list styling with black text - Responsive */
                   [&>ul]:space-y-2 sm:[&>ul]:space-y-3 [&>ul]:my-4 sm:[&>ul]:my-6 [&>ul]:ml-0 [&>ul]:pl-0
                   [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:list-none
                   [&>ul>li]:text-[#444444] [&>ul>li]:text-sm sm:[&>ul>li]:text-base [&>ul>li]:leading-relaxed
                   
                   /* Content styling with black text - Responsive */
                   [&>h1]:text-[#093389] [&>h1]:text-xl sm:[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-4 sm:[&>h1]:mt-6 [&>h1]:mb-3 sm:[&>h1]:mb-4 [&>h1]:border-b [&>h1]:border-[#0078d4]/50 [&>h1]:pb-2
                   [&>h2]:text-[#093389] [&>h2]:text-lg sm:[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-4 sm:[&>h2]:mt-5 [&>h2]:mb-2 sm:[&>h2]:mb-3
                   [&>h3]:text-[#093389] [&>h3]:text-base sm:[&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-3 sm:[&>h3]:mt-4 [&>h3]:mb-2
                   [&>h4]:text-[#004b8d] [&>h4]:text-sm sm:[&>h4]:text-base [&>h4]:font-semibold [&>h4]:mt-2 sm:[&>h4]:mt-3 [&>h4]:mb-2
                   [&>p]:text-[#444444] [&>p]:mb-3 sm:[&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-sm sm:[&>p]:text-base
                   [&>strong]:text-[#093389] [&>strong]:text-lg sm:[&>strong]:text-xl [&>strong]:font-bold
                   [&>b]:text-[#093389] [&>b]:font-bold
                   [&>em]:text-[#0078d4] [&>em]:italic
                   [&>a]:text-[#0078d4] [&>a]:underline [&>a]:font-medium hover:[&>a]:text-[#064ad4]
                   [&>blockquote]:border-l-4 [&>blockquote]:border-[#0078d4] [&>blockquote]:pl-4 sm:[&>blockquote]:pl-6 [&>blockquote]:py-3 sm:[&>blockquote]:py-4 [&>blockquote]:my-4 sm:[&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-[#064ad4] [&>blockquote]:bg-[#f5f9ff]
                   [&>code]:bg-[#f5f9ff] [&>code]:text-[#093389] [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-xs [&>code]:border border-[#d6e6f7]
                   [&>pre]:bg-[#f5f9ff] [&>pre]:text-[#093389] [&>pre]:p-3 sm:[&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-3 sm:[&>pre]:my-4 [&>pre]:border border-[#d6e6f7]
                   [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-4 sm:[&>img]:my-6 [&>img]:mx-auto [&>img]:shadow-lg
                   [&>table]:w-full [&>table]:bg-white [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:my-4 sm:[&>table]:my-6 [&>table]:border border-[#d6e6f7]
                   [&>th]:text-[#093389] [&>th]:font-semibold [&>th]:p-2 sm:[&>th]:p-3 [&>th]:text-left [&>th]:bg-[#f5f9ff] [&>th]:border-b border-[#d6e6f7] [&>th]:text-xs sm:[&>th]:text-sm
                   [&>td]:p-2 sm:[&>td]:p-3 [&>td]:text-[#444444] [&>td]:border-b border-[#d6e6f7] [&>td]:text-xs sm:[&>td]:text-sm
                   [&>hr]:border-0 [&>hr]:h-px [&>hr]:bg-gradient-to-r [&>hr]:from-transparent [&>hr]:via-[#0078d4] [&>hr]:to-transparent [&>hr]:my-4 sm:[&>hr]:my-6"
              dangerouslySetInnerHTML={{ __html: instructor?.bio }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SpeakerCard;