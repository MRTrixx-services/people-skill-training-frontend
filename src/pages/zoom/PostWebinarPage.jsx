import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const PostWebinarPage = () => {
  const navigate = useNavigate();
  const { webinarId } = useParams();
  const [user, setUser] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

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
  const webinarData = {
    id: webinarId,
    title: "Advanced React Patterns and Performance Optimization",
    instructor: {
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      email: "michael.chen@email.com",
      linkedin: "https://linkedin.com/in/michaelchen"
    },
    startTime: "2024-12-15T14:00:00Z",
    endTime: "2024-12-15T16:00:00Z",
    duration: 120,
    actualDuration: 118,
    attendeeCount: 47,
    maxCapacity: 50,
    recording: {
      available: false,
      availableFrom: "2024-12-15T18:00:00Z", // 2 hours after end
      processingTime: "2-4 hours"
    },
    materials: [
      { name: "React Patterns Slides.pdf", size: "2.4 MB", type: "pdf" },
      { name: "Code Examples.zip", size: "5.1 MB", type: "archive" },
      { name: "Resource Links.txt", size: "1.2 KB", type: "text" }
    ],
    certificate: {
      eligible: true,
      reason: "Attended 95% of the webinar"
    }
  };

  // Related webinars data
  const relatedWebinars = [
    {
      id: 2,
      title: "JavaScript ES2024 New Features",
      instructor: "Emily Rodriguez",
      date: "2024-12-22T14:00:00Z",
      price: 79.99,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=180&fit=crop"
    },
    {
      id: 3,
      title: "Node.js Performance Optimization",
      instructor: "Dr. Michael Chen",
      date: "2024-12-28T15:00:00Z",
      price: 69.99,
      thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=300&h=180&fit=crop"
    },
    {
      id: 4,
      title: "Modern CSS Grid and Flexbox",
      instructor: "Lisa Park",
      date: "2025-01-05T13:00:00Z",
      price: 59.99,
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=180&fit=crop"
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatFileSize = (size) => {
    return size;
  };

  const getTimeUntilRecording = () => {
    const now = new Date();
    const availableTime = new Date(webinarData.recording.availableFrom);
    const diff = availableTime - now;
    
    if (diff <= 0) return "Available now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `Available in ${hours}h ${minutes}m`;
  };

  const handleDownloadMaterial = (material) => {
    console.log('Downloading:', material.name);
    // In real app, this would trigger file download
    alert(`Downloading ${material.name}...`);
  };

  const handleDownloadCertificate = () => {
    console.log('Downloading certificate');
    // In real app, this would generate and download certificate
    alert('Certificate download functionality would be implemented here');
  };

  const handleContactInstructor = () => {
    window.location.href = `mailto:${webinarData.instructor.email}?subject=Question about ${webinarData.title}`;
  };

  const handleFeedbackForm = () => {
    navigate(`/webinar-feedback/${webinarId}`);
  };

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
          {/* Session Complete */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={24} className="text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Thank You for Attending!
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              We hope you found the webinar valuable and informative
            </p>
            
            {/* Session Summary */}
            <div className="bg-card border border-border rounded-xl p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-foreground mb-4">Session Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Webinar:</span>
                  <span className="text-foreground font-medium">{webinarData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="text-foreground font-medium">{webinarData.instructor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground font-medium">{formatDate(webinarData.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-foreground font-medium">{webinarData.actualDuration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendees:</span>
                  <span className="text-foreground font-medium">{webinarData.attendeeCount} participants</span>
                </div>
              </div>
              
              {/* Attendance Confirmation */}
              <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-success font-medium">Attendance Confirmed</span>
                </div>
                <p className="text-success/80 text-sm mt-1">
                  Your attendance has been recorded for this webinar
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Next Steps */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">What's Next?</h2>
                
                <div className="space-y-6">
                  {/* Recording Availability */}
                  <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Video" size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">Recording Access</h3>
                      {webinarData.recording.available ? (
                        <div>
                          <p className="text-sm text-muted-foreground mb-3">
                            The webinar recording is now available to watch
                          </p>
                          <Button
                            variant="default"
                            onClick={() => navigate(`/recording/${webinarId}`)}
                            iconName="Play"
                            iconPosition="left"
                          >
                            Watch Recording
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {getTimeUntilRecording()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Processing typically takes {webinarData.recording.processingTime}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="MessageSquare" size={24} className="text-warning" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">Share Your Feedback</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Help us improve by sharing your thoughts about this webinar
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleFeedbackForm}
                        iconName="Star"
                        iconPosition="left"
                      >
                        Leave Feedback
                      </Button>
                    </div>
                  </div>

                  {/* Certificate */}
                  {webinarData.certificate.eligible && (
                    <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Award" size={24} className="text-success" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">Certificate of Attendance</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {webinarData.certificate.reason}
                        </p>
                        <Button
                          variant="outline"
                          onClick={handleDownloadCertificate}
                          iconName="Download"
                          iconPosition="left"
                        >
                          Download Certificate
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Session Resources</h2>
                
                <div className="space-y-6">
                  {/* Downloadable Materials */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Download Materials</h3>
                    <div className="space-y-3">
                      {webinarData.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon 
                              name={material.type === 'pdf' ? 'FileText' : 
                                   material.type === 'archive' ? 'Archive' : 'File'} 
                              size={20} 
                              className="text-muted-foreground" 
                            />
                            <div>
                              <p className="text-sm font-medium text-foreground">{material.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(material.size)}</p>
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

                  {/* Instructor Contact */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Connect with Instructor</h3>
                    <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                      <Image
                        src={webinarData.instructor.avatar}
                        alt={webinarData.instructor.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{webinarData.instructor.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Have questions? Reach out to the instructor directly
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleContactInstructor}
                            iconName="Mail"
                            iconPosition="left"
                          >
                            Send Email
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(webinarData.instructor.linkedin, '_blank')}
                            iconName="Linkedin"
                            iconPosition="left"
                          >
                            LinkedIn
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Webinars */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Continue Learning</h3>
                
                <div className="space-y-4">
                  {relatedWebinars.map((webinar) => (
                    <div key={webinar.id} className="border border-border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer"
                         onClick={() => navigate(`/webinar-details/${webinar.id}`)}>
                      <div className="flex space-x-3">
                        <Image
                          src={webinar.thumbnail}
                          alt={webinar.title}
                          className="w-16 h-12 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                            {webinar.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            {webinar.instructor}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(webinar.date).split(' at ')}
                            </span>
                            <span className="text-sm font-medium text-primary">
                              ₹{webinar.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate('/browse-webinars')}
                  iconName="Search"
                  iconPosition="left"
                  className="w-full mt-4"
                >
                  Browse All Webinars
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/my-enrollments')}
                    iconName="BookOpen"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    My Enrollments
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/my-recordings')}
                    iconName="Video"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    My Recordings
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/my-certificates')}
                    iconName="Award"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    My Certificates
                  </Button>
                </div>
              </div>

              {/* Support */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} className="text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/help')}
                      className="p-0 h-auto font-normal text-left"
                    >
                      Help Center
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
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
                </div>
              </div>
            </div>
          </div>

          {/* Thank You CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary to-blue-700 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Thank You for Learning with Us!</h2>
              <p className="text-blue-100 mb-6">
                We're excited to be part of your learning journey. Keep exploring and growing!
              </p>
              <Button
                variant="secondary"
                onClick={() => navigate('/browse-webinars')}
                iconName="ArrowRight"
                iconPosition="right"
                className="bg-white text-primary hover:bg-blue-50"
              >
                Discover More Webinars
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostWebinarPage;
