import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const JoinWebinar = () => {
  const navigate = useNavigate();
  const { webinarId } = useParams();
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemCheck, setSystemCheck] = useState({
    audio: null,
    video: null,
    browser: null,
    zoom: null
  });
  const [isJoining, setIsJoining] = useState(false);

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "attendee",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock webinar data
  const webinar = {
    id: webinarId,
    title: "Advanced React Patterns and Performance Optimization",
    instructor: {
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Senior React Developer & Technical Lead"
    },
    scheduledTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    duration: "2 hours",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    zoomMeetingId: "123-456-789",
    passcode: "webinar123"
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate time until webinar starts
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = currentTime.getTime();
      const start = webinar.scheduledTime.getTime();
      const timeDiff = start - now;

      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, canJoin: timeDiff <= 15 * 60 * 1000 }); // Can join 15 minutes before
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, canJoin: true, hasStarted: true });
      }
    };

    calculateTimeLeft();
  }, [currentTime, webinar.scheduledTime]);

  const handleSystemCheck = async (type) => {
    setSystemCheck(prev => ({ ...prev, [type]: 'checking' }));
    
    // Simulate system checks
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo
      setSystemCheck(prev => ({ ...prev, [type]: success ? 'success' : 'failed' }));
    }, 1500);
  };

  const handleJoinWebinar = () => {
    if (!timeLeft?.canJoin) return;
    
    setIsJoining(true);
    
    // Simulate joining process
    setTimeout(() => {
      // In real app, this would redirect to Zoom meeting
      alert(`Joining webinar: ${webinar.title}\nMeeting ID: ${webinar.zoomMeetingId}\nPasscode: ${webinar.passcode}`);
      setIsJoining(false);
    }, 2000);
  };

  const getSystemCheckIcon = (status) => {
    switch (status) {
      case 'checking':
        return { name: 'Loader', className: 'text-primary animate-spin' };
      case 'success':
        return { name: 'CheckCircle', className: 'text-success' };
      case 'failed':
        return { name: 'XCircle', className: 'text-error' };
      default:
        return { name: 'Circle', className: 'text-muted-foreground' };
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const isSystemReady = Object.values(systemCheck).every(status => status === 'success');

  return (
    <div className="min-h-screen bg-background">
  
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Join Webinar</h1>
            <p className="text-text-secondary">Prepare to join your webinar session</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Webinar Info Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={webinar.thumbnail}
                      alt={webinar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground mb-2">{webinar.title}</h2>
                    <div className="flex items-center space-x-3 mb-3">
                      <Image
                        src={webinar.instructor.avatar}
                        alt={webinar.instructor.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-foreground">{webinar.instructor.name}</p>
                        <p className="text-sm text-muted-foreground">{webinar.instructor.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{webinar.scheduledTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{webinar.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Timer" size={14} />
                        <span>{webinar.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Check */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Settings" size={20} className="mr-2" />
                  System Check
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Mic" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Audio Check</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {systemCheck.audio && (
                        <span className="text-xs text-muted-foreground">
                          {systemCheck.audio === 'checking' ? 'Testing...' : systemCheck.audio === 'success' ? 'Working' : 'Failed'}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSystemCheck('audio')}
                        disabled={systemCheck.audio === 'checking'}
                        iconName={getSystemCheckIcon(systemCheck.audio).name}
                        iconClassName={getSystemCheckIcon(systemCheck.audio).className}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Video" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Video Check</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {systemCheck.video && (
                        <span className="text-xs text-muted-foreground">
                          {systemCheck.video === 'checking' ? 'Testing...' : systemCheck.video === 'success' ? 'Working' : 'Failed'}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSystemCheck('video')}
                        disabled={systemCheck.video === 'checking'}
                        iconName={getSystemCheckIcon(systemCheck.video).name}
                        iconClassName={getSystemCheckIcon(systemCheck.video).className}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Globe" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Browser Compatibility</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {systemCheck.browser && (
                        <span className="text-xs text-muted-foreground">
                          {systemCheck.browser === 'checking' ? 'Checking...' : systemCheck.browser === 'success' ? 'Compatible' : 'Issues found'}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSystemCheck('browser')}
                        disabled={systemCheck.browser === 'checking'}
                        iconName={getSystemCheckIcon(systemCheck.browser).name}
                        iconClassName={getSystemCheckIcon(systemCheck.browser).className}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-white">Z</span>
                      </div>
                      <span className="text-sm font-medium">Zoom Requirements</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {systemCheck.zoom && (
                        <span className="text-xs text-muted-foreground">
                          {systemCheck.zoom === 'checking' ? 'Checking...' : systemCheck.zoom === 'success' ? 'Ready' : 'Not installed'}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSystemCheck('zoom')}
                        disabled={systemCheck.zoom === 'checking'}
                        iconName={getSystemCheckIcon(systemCheck.zoom).name}
                        iconClassName={getSystemCheckIcon(systemCheck.zoom).className}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-webinar Instructions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Info" size={20} className="mr-2" />
                  Pre-webinar Instructions
                </h3>
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Ensure you have a stable internet connection</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Test your audio and video before joining</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Close unnecessary applications to improve performance</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Have a pen and paper ready for notes</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Need Help?</strong> Contact our tech support at 
                    <a href="mailto:support@peopleskilltraining.com" className="underline ml-1">support@PeopleSkillTraining.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Countdown Timer */}
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {timeLeft?.hasStarted ? 'Webinar has started!' : 'Starts in:'}
                </h3>
                
                {timeLeft && !timeLeft.hasStarted && (
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{timeLeft.hours.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">Seconds</div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Current Time</p>
                  <p className="text-lg font-medium text-foreground">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>

                <Button
                  variant="default"
                  fullWidth
                  onClick={handleJoinWebinar}
                  disabled={!timeLeft?.canJoin || !isSystemReady || isJoining}
                  loading={isJoining}
                  iconName="Video"
                  iconPosition="left"
                  className="mb-3"
                >
                  {isJoining ? 'Joining...' : !timeLeft?.canJoin ? 'Join Available Soon' : 'Join Webinar'}
                </Button>

                {!timeLeft?.canJoin && (
                  <p className="text-xs text-muted-foreground">
                    You can join 15 minutes before the start time
                  </p>
                )}

                {!isSystemReady && (
                  <p className="text-xs text-warning">
                    Please complete system check before joining
                  </p>
                )}
              </div>

              {/* Meeting Details */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Info" size={20} className="mr-2" />
                  Meeting Details
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meeting ID:</span>
                    <span className="font-mono text-foreground">{webinar.zoomMeetingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passcode:</span>
                    <span className="font-mono text-foreground">{webinar.passcode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
   
    </div>
  );
};

export default JoinWebinar;
