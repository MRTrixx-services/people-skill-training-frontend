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
                <div className="flex flex-wrap gap-3 mb-1">
                  {webinar.isLiveNow ? (
                    <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-3 py-2 rounded-full text-xs font-bold animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full inline-block mr-2 animate-ping"></div>
                      LIVE NOW
                    </span>
                  ) : webinar.isUpcoming ? (
                    <span className="bg-gradient-to-r from-[#064ad4] to-[#004b8d] text-white px-3 py-2 rounded-full text-xs font-bold">
                      <Icon name="Calendar" size={12} className="inline mr-1" />
                      UPCOMING
                    </span>
                  ) : webinar.isCompleted ? (
                    <span className="bg-gradient-to-r from-[#555555] to-[#444444] text-white px-3 py-2 rounded-full text-xs font-bold">
                      <Icon name="Clock" size={12} className="inline mr-1" />
                      COMPLETED
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-3 py-2 rounded-full text-xs font-bold">
                      <Icon name="Video" size={12} className="inline mr-1" />
                      LIVE WEBINAR
                    </span>
                  )}
                  
                  {webinar.hasFullAccess && (
                    <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-3 py-2 rounded-full text-xs font-bold">
                      <Icon name="CheckCircle" size={12} className="inline mr-1" />
                      ENROLLED
                    </span>
                  )}
                </div>
                
                <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 leading-tight text-[#f5f9ff]">
                  {webinar.title}
                </h1>
              </motion.div>

              {/* Schedule Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border border-[#d9ecff]/30 shadow-xl"
              >
                <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-4 sm:mb-6 text-[#d9ecff] flex items-center">
                  <Icon name="Calendar" size={16} className="mr-2 text-[#d9ecff]" />
                  Webinar Schedule
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#0078d4]/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#d9ecff]/30">
                      <Icon name="Calendar" size={12} className="text-[#d9ecff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#f5f9ff] mb-1">Date:</div>
                      <div className="text-[#d9ecff] text-xs sm:text-base">{webinar.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#064ad4]/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#d9ecff]/30">
                      <Icon name="Clock" size={12} className="text-[#d9ecff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#f5f9ff] mb-1">Time:</div>
                      <div className="text-[#d9ecff] text-xs sm:text-base">{webinar.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#004b8d]/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#d9ecff]/30">
                      <Icon name="Timer" size={12} className="text-[#d9ecff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#f5f9ff] mb-1">Duration:</div>
                      <div className="text-[#d9ecff] text-xs sm:text-base">{webinar.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#093389]/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#d9ecff]/30">
                      <Icon name="Hash" size={12} className="text-[#d9ecff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#f5f9ff] mb-1">Webinar ID:</div>
                      <div className="text-[#d9ecff] text-xs sm:text-base font-mono break-all">{webinar.webinarId}</div>
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