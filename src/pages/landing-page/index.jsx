import React from 'react';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/ui/PublicHeader';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import ServicesSection from './components/ServicesSection';
import WebinarTypesSection from './components/WebinarTypesSection';
import FeaturedWebinars from './components/FeaturedWebinars';
import LiveWebinars from './components/LiveWebinars'; // Add this import
import FeaturesShowcase from './components/FeaturesShowcase';
import LiveStatsSection from './components/LiveStatsSection';
import { useNavigate } from 'react-router-dom';
import ServicesOffering from './components/ServicesOffering';
import TestimonialsSection from './components/TestimonialsSection';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
   navigate(`${path}`);
  };

  const handleBrowseWebinars = () => {
    handleNavigation('/webinars/live');
  };

  const handleBecomeInstructor = () => {
    handleNavigation('/register');
  };

  const handleEnrollClick = (webinar) => {
    if (webinar) {
      console.log(`Enrolling in webinar: ${webinar?.title}`);
      handleNavigation(`/live-webinar/${webinar?.webinarId}`);
    } else {
      handleNavigation('/webinars/live');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background overflow-hidden"
    >
      <main className="pt-14 md:pt-16 lg:pt-20">
        <HeroSection 
          onBrowseWebinars={handleBrowseWebinars}
          onBecomeInstructor={handleBecomeInstructor}
        />
        
        <StatsSection />
          <LiveWebinars onEnrollClick={handleEnrollClick} />
      
        <ServicesSection />
            <LiveStatsSection />
         <FeaturesShowcase/>
         <ServicesOffering/>
           <TestimonialsSection/>
        {/* Add the LiveWebinars component */}
      </main>
    </motion.div>
  );
};

export default LandingPage;
