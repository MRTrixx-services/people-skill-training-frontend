import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

const PreWebinarLobby = () => {
  const navigate = useNavigate();
  const { webinarId } = useParams();
  const [user, setUser] = useState(null);
  const [timeUntilStart, setTimeUntilStart] = useState(null);
  const [canJoin, setCanJoin] = useState(false);
  const [systemCheck, setSystemCheck] = useState({
    audio: null,
    video: null,
    connection: null,
    browser: null
  });
  const [userPreferences, setUserPreferences] = useState({
    displayName: '',
    audioEnabled: false,
    videoEnabled: false
  });

  // Mock webinar data
  const webinar = {
    id: webinarId,
    title: "Advanced React Patterns and Performance Optimization",
    instructor: {
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Senior Software Engineer",
      bio: "Expert in React and modern web development with 8+ years of experience"
    },
    startTime: "2024-12-15T14:00:00Z",
    duration: 120,
    description: "Deep dive into advanced React patterns including render props, higher-order components, and performance optimization techniques.",
    agenda: [
      "Introduction to Advanced React Patterns",
      "Render Props Pattern Deep Dive",
      "Higher-Order Components (HOCs)",
      "Performance Optimization Techniques",
      "Real-world Examples and Use Cases",
      "Q&A Session"
    ],
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    attendeeCount: 47,
    maxCapacity: 50
  };

  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "attendee",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
    setUserPreferences(prev => ({ ...prev, displayName: mockUser.name }));

    // Calculate time until start
    const updateCountdown = () => {
      const now = new Date();
      const startTime = new Date(webinar.startTime);
      const diff = startTime - now;

      if (diff > 0) {
        setTimeUntilStart(diff);
        // Allow joining 15 minutes before start time
        setCanJoin(diff <= 15 * 60 * 1000);
      } else {
        setTimeUntilStart(0);
        setCanJoin(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Run system checks
    runSystemChecks();

    return () => clearInterval(interval);
  }, [webinar.startTime]);

  const runSystemChecks = async () => {
    // Simulate system checks
    const checks = [
      { type: 'browser', delay: 500 },
      { type: 'connection', delay: 1000 },
      { type: 'audio', delay: 1500 },
      { type: 'video', delay: 2000 }
    ];

    for (const check of checks) {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        setSystemCheck(prev => ({
          ...prev,
          [check.type]: success
        }));
      }, check.delay);
    }
  };

  const testAudioVideo = async (type) => {
    setSystemCheck(prev => ({ ...prev, [type]: 'testing' }));
    
    // Simulate test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setSystemCheck(prev => ({ ...prev, [type]: success }));
    }, 2000);
  };

  const formatCountdown = (milliseconds) => {
    if (!milliseconds) return "00:00:00";
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getSystemCheckIcon = (status) => {
    switch (status) {
      case true:
        return { icon: 'CheckCircle', color: 'text-success' };
      case false:
        return { icon: 'XCircle', color: 'text-error' };
      case 'testing':
        return { icon: 'RefreshCw', color: 'text-warning animate-spin' };
      default:
        return { icon: 'Clock', color: 'text-muted-foreground' };
    }
  };

  const handleJoinWebinar = () => {
    if (!canJoin) {
      alert('The webinar has not started yet. Please wait until the scheduled time.');
      return;
    }

    // Navigate to Zoom redirect page
    navigate(`/webinar-join/${webinarId}`, {
      state: {
        displayName: userPreferences.displayName,
        audioEnabled: userPreferences.audioEnabled,
        videoEnabled: userPreferences.videoEnabled
      }
    });
  };

  const allSystemsGood = Object.values(systemCheck).every(status => status === true);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        user={user}
        notifications={[]}
        onLogout={() => navigate('/login')}
        onNotificationClick={() => {}}
      />

      <main className="pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Countdown Timer */}
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Webinar Lobby</h1>
                
                {timeUntilStart > 0 ? (
                  <div>
                    <div className="text-6xl font-mono font-bold text-primary mb-4">
                      {formatCountdown(timeUntilStart)}
                    </div>
                    <p className="text-xl text-muted-foreground mb-2">Until webinar starts</p>
                    <p className="text-sm text-muted-foreground">
                      Current time: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl font-bold text-success mb-4">
                      <Icon name="Play" size={48} className="mx-auto mb-2" />
                      Ready to Join!
                    </div>
                    <p className="text-xl text-muted-foreground">The webinar is now available</p>
                  </div>
                )}
              </div>

              {/* Webinar Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex space-x-4 mb-6">
                  <Image
                    src={webinar.thumbnail}
                    alt={webinar.title}
                    className="w-32 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground mb-2">{webinar.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={webinar.instructor.avatar}
                          alt={webinar.instructor.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{webinar.instructor.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{webinar.duration} minutes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={14} />
                        <span>{webinar.attendeeCount}/{webinar.maxCapacity}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scheduled for: {formatTime(webinar.startTime)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">About this webinar</h3>
                  <p className="text-muted-foreground">{webinar.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Agenda</h3>
                  <ul className="space-y-2">
                    {webinar.agenda.map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* System Check */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">System Check</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { key: 'browser', label: 'Browser Compatibility', testable: false },
                    { key: 'connection', label: 'Internet Connection', testable: false },
                    { key: 'audio', label: 'Audio Device', testable: true },
                    { key: 'video', label: 'Video Camera', testable: true }
                  ].map(({ key, label, testable }) => {
                    const status = systemCheck[key];
                    const statusConfig = getSystemCheckIcon(status);
                    
                    return (
                      <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon name={statusConfig.icon} size={20} className={statusConfig.color} />
                          <span className="text-sm font-medium text-foreground">{label}</span>
                        </div>
                        {testable && status !== 'testing' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testAudioVideo(key)}
                            iconName="TestTube"
                            iconPosition="left"
                          >
                            Test
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!allSystemsGood && (
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning" />
                      <span className="text-sm font-medium text-warning">System Check Issues</span>
                    </div>
                    <p className="text-sm text-warning/80 mt-1">
                      Some system checks failed. You may experience issues during the webinar.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Join Controls */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Join Settings</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={userPreferences.displayName}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={userPreferences.audioEnabled}
                        onChange={(e) => setUserPreferences(prev => ({ ...prev, audioEnabled: e.target.checked }))}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">Join with audio enabled</p>
                        <p className="text-xs text-muted-foreground">
                          You can unmute yourself during the webinar
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={userPreferences.videoEnabled}
                        onChange={(e) => setUserPreferences(prev => ({ ...prev, videoEnabled: e.target.checked }))}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">Join with video enabled</p>
                        <p className="text-xs text-muted-foreground">
                          Turn on your camera when joining
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="default"
                  onClick={handleJoinWebinar}
                  disabled={!canJoin || !userPreferences.displayName.trim()}
                  iconName={canJoin ? "Video" : "Clock"}
                  iconPosition="left"
                  className="w-full"
                >
                  {canJoin ? 'Join Webinar' : `Join in ${formatCountdown(timeUntilStart)}`}
                </Button>

                {!canJoin && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    You can join 15 minutes before the scheduled start time
                  </p>
                )}
              </div>

              {/* Instructor Info */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Meet Your Instructor</h3>
                
                <div className="flex items-start space-x-4">
                  <Image
                    src={webinar.instructor.avatar}
                    alt={webinar.instructor.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{webinar.instructor.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{webinar.instructor.title}</p>
                    <p className="text-sm text-muted-foreground">{webinar.instructor.bio}</p>
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="HelpCircle" size={16} className="text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/help/webinar-requirements')}
                      className="p-0 h-auto font-normal text-left"
                    >
                      System Requirements
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="MessageSquare" size={16} className="text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/support')}
                      className="p-0 h-auto font-normal text-left"
                    >
                      Contact Support
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/help/webinar-guide')}
                      className="p-0 h-auto font-normal text-left"
                    >
                      Attendee Guide
                    </Button>
                  </div>
                </div>
              </div>

              {/* Connection Info */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Connection Status</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Internet Speed:</span>
                    <span className="text-foreground font-medium">
                      {systemCheck.connection === true ? 'Good' : 
                       systemCheck.connection === false ? 'Poor' : 'Testing...'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Browser:</span>
                    <span className="text-foreground font-medium">
                      {systemCheck.browser === true ? 'Compatible' : 
                       systemCheck.browser === false ? 'Issues' : 'Checking...'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Webinar ID:</span>
                    <span className="text-foreground font-medium font-mono">***-***-789</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreWebinarLobby;
