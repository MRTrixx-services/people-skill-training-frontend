import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SessionLobbyHeader from '../../components/ui/SessionLobbyHeader';
import CountdownTimer from './components/CountdownTimer';
import SystemCheckPanel from './components/SystemCheckPanel';
import AudioVideoPreview from './components/AudioVideoPreview';
import ChatPreview from './components/ChatPreview';
import TechnicalRequirements from './components/TechnicalRequirements';
import JoinWebinarButton from './components/JoinWebinarButton';

const JoinWebinarLobby = () => {
  const [canJoin, setCanJoin] = useState(false);
  const [systemStatus, setSystemStatus] = useState('checking');
  const [isMobileView, setIsMobileView] = useState(false);

  // Mock webinar data
  const webinarData = {
    title: "Advanced React Patterns & Performance Optimization",
    instructor: "Dr. Sarah Johnson",
    duration: "90 minutes",
    startTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    sessionTime: "2:00 PM - 3:30 PM EST"
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleJoinEnabled = (enabled) => {
    setCanJoin(enabled);
  };

  const handleSystemCheckComplete = (status) => {
    setSystemStatus(status);
  };

  const handleJoinWebinar = () => {
    // Simulate joining webinar
    console.log('Joining webinar...');
    // In real implementation, this would redirect to Zoom or open Zoom app
    window.open('https://zoom.us/j/1234567890?pwd=ReactLMS2024', '_blank');
  };

  const handleLeaveSession = () => {
    if (window.confirm('Are you sure you want to leave the webinar lobby?')) {
      window.location.href = '/attendee-recordings-library';
    }
  };

  const handleGetSupport = () => {
    window.open('mailto:support@eduportal.com?subject=Webinar Support Request', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Join Webinar Lobby - {webinarData?.title} | EduPortal</title>
        <meta name="description" content="Join the webinar lobby and prepare for your learning session with system checks and preview features." />
      </Helmet>
      {/* Custom Header for Lobby */}
      <SessionLobbyHeader
        sessionTitle={webinarData?.title}
        sessionTime={webinarData?.sessionTime}
        timeRemaining={Math.max(0, Math.floor((webinarData?.startTime - new Date()) / 1000))}
        onLeaveSession={handleLeaveSession}
        onGetSupport={handleGetSupport}
      />
      {/* Main Content */}
      <main className="pt-16 pb-8 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          {isMobileView ? (
            <div className="space-y-6">
              {/* Countdown Timer */}
              <CountdownTimer
                sessionTitle={webinarData?.title}
                instructor={webinarData?.instructor}
                duration={webinarData?.duration}
                startTime={webinarData?.startTime}
                onJoinEnabled={handleJoinEnabled}
              />

              {/* Join Button */}
              <JoinWebinarButton
                canJoin={canJoin}
                systemStatus={systemStatus}
                onJoinWebinar={handleJoinWebinar}
              />

              {/* System Check */}
              <SystemCheckPanel onSystemCheckComplete={handleSystemCheckComplete} />

              {/* Audio/Video Preview */}
              <AudioVideoPreview />

              {/* Chat Preview */}
              <ChatPreview />

              {/* Technical Requirements */}
              <TechnicalRequirements />
            </div>
          ) : (
            /* Desktop Layout */
            (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Countdown Timer */}
                <CountdownTimer
                  sessionTitle={webinarData?.title}
                  instructor={webinarData?.instructor}
                  duration={webinarData?.duration}
                  startTime={webinarData?.startTime}
                  onJoinEnabled={handleJoinEnabled}
                />

                {/* Audio/Video Preview */}
                <AudioVideoPreview />

                {/* Technical Requirements */}
                <TechnicalRequirements />
              </div>
              {/* Right Column */}
              <div className="space-y-6">
                {/* Join Button */}
                <JoinWebinarButton
                  canJoin={canJoin}
                  systemStatus={systemStatus}
                  onJoinWebinar={handleJoinWebinar}
                />

                {/* System Check */}
                <SystemCheckPanel onSystemCheckComplete={handleSystemCheckComplete} />

                {/* Chat Preview */}
                <ChatPreview />
              </div>
            </div>)
          )}

          {/* Footer Information */}
          <div className="mt-12 text-center">
            <div className="bg-card rounded-xl p-6 shadow-elevation-1 border border-border">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Secure Connection</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>End-to-End Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>GDPR Compliant</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-text-secondary">
                  By joining this webinar, you agree to our{' '}
                  <a href="/terms-conditions" className="text-primary hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
                  For technical support, contact us at{' '}
                  <a href="mailto:support@eduportal.com" className="text-primary hover:underline">
                    support@eduportal.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinWebinarLobby;