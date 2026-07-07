import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const RecordingPlayerPage = () => {
  const navigate = useNavigate();
  const { recordingId } = useParams();
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [showTranscript, setShowTranscript] = useState(false);

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

  // Mock recording data
  const recordingData = {
    id: recordingId,
    title: "Advanced React Patterns and Performance Optimization",
    description: "Deep dive into advanced React patterns including render props, higher-order components, and performance optimization techniques.",
    instructor: {
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Senior Software Engineer",
      bio: "Expert in React and modern web development with 8+ years of experience",
      email: "michael.chen@email.com"
    },
    recordedDate: "2024-12-15T14:00:00Z",
    duration: 7200, // 2 hours in seconds
    views: 127,
    videoUrl: "/api/recordings/secure-video-stream", // Secure streaming URL
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    topics: [
      "Introduction to Advanced Patterns",
      "Render Props Deep Dive", 
      "Higher-Order Components",
      "Performance Optimization",
      "Real-world Examples",
      "Q&A Session"
    ],
    materials: [
      { name: "React Patterns Slides.pdf", size: "2.4 MB", url: "/materials/slides.pdf" },
      { name: "Code Examples.zip", size: "5.1 MB", url: "/materials/code.zip" },
      { name: "Additional Resources.txt", size: "1.2 KB", url: "/materials/resources.txt" }
    ],
    hasTranscript: true,
    transcript: [
      {
        startTime: 0,
        endTime: 30,
        text: "Welcome everyone to this advanced React patterns webinar. Today we'll be covering some of the most powerful patterns in React development."
      },
      {
        startTime: 30,
        endTime: 90,
        text: "Let's start by understanding what makes a pattern 'advanced' and why these patterns are essential for scalable React applications."
      }
    ]
  };

  // Related recordings
  const relatedRecordings = [
    {
      id: 2,
      title: "JavaScript ES2024 Features",
      instructor: "Emily Rodriguez",
      duration: 5400,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=180&fit=crop",
      views: 89
    },
    {
      id: 3,
      title: "Node.js Performance Tips",
      instructor: "Dr. Michael Chen",
      duration: 6300,
      thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=300&h=180&fit=crop",
      views: 156
    }
  ];

  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualityOptions = ['auto', '1080p', '720p', '480p', '360p'];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const time = pos * duration;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownloadMaterial = (material) => {
    console.log('Downloading:', material.name);
    // In real app, this would trigger secure download
    window.open(material.url, '_blank');
  };

  const jumpToTranscriptTime = (startTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  };

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/attendee-dashboard' },
    { label: 'My Recordings', href: '/my-recordings' },
    { label: recordingData.title, href: null }
  ];

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        user={user}
        notifications={[]}
        onLogout={() => navigate('/login')}
        onNotificationClick={() => {}}
      />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Video Player Section */}
            <div className="lg:col-span-3">
              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden mb-6">
                <div className="relative aspect-video">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    className="w-full h-full"
                    poster={recordingData.thumbnail}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={recordingData.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div 
                        className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePlayPause}
                          iconName={isPlaying ? "Pause" : "Play"}
                          className="text-white hover:bg-white/20"
                        />

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMute}
                            iconName={isMuted ? "VolumeX" : "Volume2"}
                            className="text-white hover:bg-white/20"
                          />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 accent-primary"
                          />
                        </div>

                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Playback Speed */}
                        <div className="relative group">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                          >
                            {playbackSpeed}x
                          </Button>
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                            <div className="bg-black/90 rounded-lg p-2 space-y-1">
                              {playbackSpeeds.map(speed => (
                                <button
                                  key={speed}
                                  onClick={() => handleSpeedChange(speed)}
                                  className={`block w-full text-left px-3 py-1 text-sm rounded transition-colors ${
                                    speed === playbackSpeed 
                                      ? 'bg-primary text-white' 
                                      : 'text-white hover:bg-white/20'
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Quality Settings */}
                        <div className="relative group">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Settings"
                            className="text-white hover:bg-white/20"
                          />
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                            <div className="bg-black/90 rounded-lg p-2 space-y-1">
                              {qualityOptions.map(q => (
                                <button
                                  key={q}
                                  onClick={() => setQuality(q)}
                                  className={`block w-full text-left px-3 py-1 text-sm rounded transition-colors ${
                                    q === quality 
                                      ? 'bg-primary text-white' 
                                      : 'text-white hover:bg-white/20'
                                  }`}
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleFullscreen}
                          iconName={isFullscreen ? "Minimize" : "Maximize"}
                          className="text-white hover:bg-white/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Watermark */}
                  <div className="absolute top-4 right-4 text-white/60 text-xs">
                    Licensed to {user?.name}
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground mb-2">{recordingData.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span>Recorded on {formatDate(recordingData.recordedDate)}</span>
                      <span>•</span>
                      <span>{formatTime(recordingData.duration)} duration</span>
                      <span>•</span>
                      <span>{recordingData.views} views</span>
                    </div>
                    <p className="text-muted-foreground">{recordingData.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      iconName="Share"
                      iconPosition="left"
                    >
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                  <Image
                    src={recordingData.instructor.avatar}
                    alt={recordingData.instructor.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{recordingData.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">{recordingData.instructor.title}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${recordingData.instructor.email}`}
                    iconName="Mail"
                    iconPosition="left"
                  >
                    Contact
                  </Button>
                </div>
              </div>

              {/* Topics Covered */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Topics Covered</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recordingData.topics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transcript */}
              {recordingData.hasTranscript && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Transcript</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTranscript(!showTranscript)}
                      iconName={showTranscript ? "ChevronUp" : "ChevronDown"}
                      iconPosition="right"
                    >
                      {showTranscript ? 'Hide' : 'Show'} Transcript
                    </Button>
                  </div>
                  
                  {showTranscript && (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {recordingData.transcript.map((segment, index) => (
                        <div key={index} className="flex space-x-3">
                          <button
                            onClick={() => jumpToTranscriptTime(segment.startTime)}
                            className="text-xs text-primary hover:underline flex-shrink-0 mt-1"
                          >
                            {formatTime(segment.startTime)}
                          </button>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {segment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Additional Resources */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Download Materials</h3>
                
                <div className="space-y-3">
                  {recordingData.materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon 
                          name={material.name.endsWith('.pdf') ? 'FileText' : 
                               material.name.endsWith('.zip') ? 'Archive' : 'File'} 
                          size={20} 
                          className="text-muted-foreground" 
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {material.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{material.size}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadMaterial(material)}
                        iconName="Download"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Recordings */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Related Recordings</h3>
                
                <div className="space-y-4">
                  {relatedRecordings.map((recording) => (
                    <div 
                      key={recording.id} 
                      className="border border-border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer"
                      onClick={() => navigate(`/recording/${recording.id}`)}
                    >
                      <div className="flex space-x-3">
                        <Image
                          src={recording.thumbnail}
                          alt={recording.title}
                          className="w-16 h-12 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                            {recording.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            {recording.instructor}
                          </p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{formatTime(recording.duration)}</span>
                            <span>{recording.views} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate('/my-recordings')}
                  iconName="Video"
                  iconPosition="left"
                  className="w-full mt-4"
                >
                  View All Recordings
                </Button>
              </div>

              {/* Security Notice */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  <Icon name="Shield" size={20} className="inline mr-2" />
                  Secure Viewing
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center space-x-2">
                    <Icon name="Lock" size={14} />
                    <span>Content is encrypted and secure</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Icon name="Eye" size={14} />
                    <span>Licensed for personal viewing only</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Icon name="Download" size={14} />
                    <span>Download available for offline viewing</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecordingPlayerPage;
