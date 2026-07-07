import React, { useState, useEffect } from "react";
import RefundPolicy from "./RefundPolicy";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

function WebinarHeader({ webinar, isAuthenticated, userRole }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-br from-[#093389] via-[#064ad4] to-[#004b8d] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v30h30z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="flex items-center space-x-2 text-sm text-white/80 mb-3 sm:mb-4"></div>
        
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">
          {/* Left Side: Content */}
          <div className="w-full lg:w-[75%] flex">
            <div className="w-full lg:w-[93.33%]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 sm:mb-6"
              >
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-lg">
                    <Icon name="Play" size={12} className="sm:w-3.5 sm:h-3.5 inline mr-1" />
                    RECORDED
                  </span>
                  
                  {webinar?.hasFullAccess ? (
                    <span className="bg-gradient-to-r from-[#064ad4] to-[#004b8d] text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold">
                      <Icon name="CheckCircle" size={12} className="sm:w-3.5 sm:h-3.5 inline mr-1" />
                      OWNED
                    </span>
                  ) : (
                    <span className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-lg ${
                      webinar.status === 'available' 
                        ? 'bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white' 
                        : 'bg-[#555555] text-white'
                    }`}>
                      {webinar.display_status || webinar.status?.toUpperCase()}
                    </span>
                  )}
                 
                  {webinar.bestseller && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-lg">
                      BESTSELLER
                    </span>
                  )}
                  {webinar.is_free && (
                    <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-lg">
                      FREE
                    </span>
                  )}
                  {webinar.hasFullAccess && (
                    <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-lg">
                      <Icon name="CheckCircle" size={12} className="sm:w-3.5 sm:h-3.5 inline mr-1" />
                      ACCESS GRANTED
                    </span>
                  )}
                </div>
                
                <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 leading-tight text-[#f5f9ff]">
                  {webinar.title}
                </h1>
              </motion.div>

              {/* Recording Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border border-[#d9ecff]/30 shadow-xl"
              >
                <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-4 sm:mb-6 text-[#d9ecff] flex items-center">
                  <Icon name="Calendar" size={16} className="mr-2 text-[#d9ecff]" />
                  Recording Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#0078d4]/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#d9ecff]/30">
                      <Icon name="Hash" size={12} className="text-[#d9ecff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#f5f9ff] mb-1">Webinar ID:</div>
                      <div className="text-[#d9ecff] text-xs sm:text-base font-mono break-all">{webinar.webinarId}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#064ad4]/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#d9ecff]/30">
                      <Icon name="Timer" size={12} className="text-[#d9ecff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#f5f9ff] mb-1">Total Duration</div>
                      <div className="text-[#d9ecff] text-xs sm:text-base">
                        {webinar.duration
                          ? `${webinar.duration} of premium content`
                          : 'Variable length premium content'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#004b8d]/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#d9ecff]/30">
                      <Icon name="Video" size={12} className="text-[#d9ecff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#f5f9ff] mb-1">Access Status:</div>
                      <div className="text-[#d9ecff] text-xs sm:text-sm leading-relaxed break-words">
                        {webinar.hasFullAccess ? 'You have full access' : 
                          webinar.canWatchRecording ? 'Limited access available' :
                          'Purchase required for access'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#093389]/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#d9ecff]/30">
                      <Icon name="Download" size={12} className="text-[#d9ecff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#f5f9ff] mb-1">Format:</div>
                      <div className="text-[#d9ecff] text-xs sm:text-sm leading-relaxed break-words">High-quality streaming</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Money-Back Image */}
          <RefundPolicy navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

export default WebinarHeader;