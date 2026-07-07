// components/FeaturesShowcase.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturesShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const features = [
    {
      id: 0,
      title: "Live Expert-Led Training",
      description: "Interactive compliance webinars with real-time Q&A, case studies, and regulatory updates",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      benefits: ["Real-time interaction", "Expert guidance"]
    },
    {
      id: 1,
      title: "On-Demand Learning Library",
      description: "Access 500+ recorded compliance courses covering OSHA, HR, HIPAA, and industry regulations",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      benefits: ["24/7 access", "Self-paced learning", "Certificate downloads"]
    },
    {
      id: 2,
      title: "Certification & Credits",
      description: "Earn SHRM, and HRCI with comprehensive compliance certification programs",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
      benefits: ["Industry recognized", "Career advancement", "Compliance proof"]
    }
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveFeature((prevFeature) => (prevFeature + 1) % features.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [features.length, isPaused]);

  // Pause auto-rotation on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Manual feature selection
  const handleFeatureClick = (index) => {
    setActiveFeature(index);
    setIsPaused(true);
    
    // Resume auto-rotation after 3 seconds
    setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-[#f5f9ff] via-[#e9eff5] to-[#f5f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] rounded-full border border-[#d6e6f7] text-sm mb-6">
            <span className="w-2 h-2 bg-[#004b8d] rounded-full animate-pulse"></span>
            <span className="font-semibold text-[#004b8d]">Platform Features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#0078d4] bg-clip-text text-transparent">
              Your Complete Compliance Solution
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#444444] max-w-2xl mx-auto">
            Everything you need to stay compliant, certified, and ahead of regulatory changes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Feature Tabs */}
          <div 
            className="space-y-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-white shadow-xl border-2 border-[#0078d4]' 
                    : 'bg-white/70 hover:bg-white hover:shadow-lg border-2 border-transparent'
                }`}
                onClick={() => handleFeatureClick(index)}
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeFeature === index
                        ? 'bg-gradient-to-br from-[#0078d4] to-[#064ad4] shadow-lg'
                        : 'bg-[#f5f9ff]'
                    }`}>
                      <span className={`text-lg font-bold ${
                        activeFeature === index ? 'text-white' : 'text-[#555555]'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${
                      activeFeature === index ? 'text-[#004b8d]' : 'text-[#093389]'
                    }`}>
                      {feature.title}
                    </h3>
                  </div>
                  
                  {/* Progress indicator for active feature */}
                  {activeFeature === index && !isPaused && (
                    <div className="w-12 h-1 bg-[#d6e6f7] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#0078d4] to-[#064ad4] rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        key={`progress-${activeFeature}`}
                      />
                    </div>
                  )}
                </div>
                
                <p className={`mb-4 transition-colors duration-300 ${
                  activeFeature === index ? 'text-[#444444]' : 'text-[#555555]'
                }`}>
                  {feature.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit, i) => (
                    <motion.span 
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                        activeFeature === index
                          ? 'bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] text-[#004b8d] border border-[#d6e6f7]'
                          : 'bg-[#f5f9ff] text-[#555555] border border-[#d6e6f7]'
                      }`}
                    >
                      {benefit}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
            
            {/* Navigation dots */}
            <div className="flex justify-center space-x-3 pt-6">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleFeatureClick(index)}
                  className={`rounded-full transition-all duration-300 ${
                    activeFeature === index
                      ? 'w-8 h-3 bg-gradient-to-r from-[#0078d4] to-[#064ad4]'
                      : 'w-3 h-3 bg-[#d6e6f7] hover:bg-[#0078d4]'
                  }`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Feature Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFeature}
                  src={features[activeFeature].image}
                  alt={features[activeFeature].title}
                  className="w-full h-96 lg:h-[500px] object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  loading="lazy"
                />
              </AnimatePresence>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#093389]/40 to-transparent pointer-events-none" />
              
              {/* Feature title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#093389]/80 to-transparent">
                <motion.h4
                  key={`title-${activeFeature}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-2xl font-bold mb-2"
                >
                  {features[activeFeature].title}
                </motion.h4>
                <motion.p
                  key={`desc-${activeFeature}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#d9ecff] text-sm"
                >
                  {features[activeFeature].description}
                </motion.p>
              </div>
            </div>
            
            {/* Play/Pause indicator */}
            <motion.div 
              className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-[#d6e6f7]"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isPaused ? 'bg-[#064ad4]' : 'bg-[#0078d4] animate-pulse'
                }`} />
                <span className="text-xs font-semibold text-[#093389]">
                  {isPaused ? 'Paused' : 'Auto'}
                </span>
              </div>
            </motion.div>

            {/* Feature counter badge */}
            <motion.div 
              className="absolute top-4 left-4 bg-gradient-to-r from-[#0078d4] to-[#064ad4] rounded-full px-4 py-2 shadow-lg"
              key={activeFeature}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <span className="text-white font-bold text-sm">
                {activeFeature + 1} / {features.length}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;