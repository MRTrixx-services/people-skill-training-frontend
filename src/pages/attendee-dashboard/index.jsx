import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OverviewCard from './components/OverviewCard';
import WebinarCard from './components/WebinarCard';
import WebinarListItem from './components/WebinarListItem';
import RecordingCard from './components/RecordingCard';
import ResourceCard from './components/ResourceCard';
import EnrollmentHistory from './components/EnrollmentHistory';
import QuickActions from './components/QuickActions';
import ViewToggle from './components/ViewToggle';

const AttendeeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 'att_001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'attendee',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      memberSince: '2024-03-15',
      totalEnrollments: 12,
      completedWebinars: 8,
    };
    setUser(mockUser);

    const mockNotifications = [
      {
        id: 1,
        title: 'Webinar starting soon',
        message: 'Python Fundamentals webinar starts in 30 minutes',
        time: '30 minutes',
        type: 'reminder',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Recording available',
        message: 'Machine Learning Basics recording is now available',
        time: '2 hours ago',
        type: 'recording',
        read: false,
        priority: 'normal'
      },
      {
        id: 3,
        title: 'New free webinar',
        message: 'Introduction to Data Science - Free webinar added',
        time: '1 day ago',
        type: 'webinar',
        read: true,
        priority: 'normal'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Enhanced overview data with all metrics
 // Enhanced overview data with alternative metrics
const overviewData = [
    {
    title: 'Active Enrollments',
    value: '5',
    subtitle: 'Upcoming webinars',
    icon: 'Calendar',
    trend: 'up',
    trendValue: '+2',
    color: 'primary'
  },
  {
    title: 'Completed Sessions',
    value: '8',
    subtitle: 'This month',
    icon: 'CheckCircle',
    trend: 'up',
    trendValue: '+3',
    color: 'success'
  },
  {
    title: 'Missed Sessions',
    value: '2',
    subtitle: 'Pending reviews',
    icon: 'AlertCircle',
    trend: 'down',
    trendValue: '-1',
    color: 'error'
  },
   {
    title: 'Recordings Owned',
    value: '12',
    subtitle: 'Available to watch',
    icon: 'Film',
    trend: 'up',
    trendValue: '+4',
    color: 'primary'
  },  {
    title: 'Total Spent',
    value: '$245',
    subtitle: 'Investment made',
    icon: 'CreditCard',
    trend: 'up',
    trendValue: '+$79',
    color: 'error'
  },
{
    title: 'Engagement Score',
    value: '92%',
    subtitle: 'Participation rate',
    icon: 'Target',
    trend: 'up',
    trendValue: '+5%',
    color: 'success'
  },

];


  // Mock available webinars (free and paid)
  const availableWebinars = [
    {
      id: 'webinar_001',
      title: 'Introduction to Data Science',
      instructor: 'Dr. Sarah Johnson',
      instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      description: 'Learn the fundamentals of data science, including statistics, data analysis, and visualization techniques.',
      date: '2025-09-10T14:00:00Z',
      duration: 60,
      price: 0,
      type: 'free',
      category: 'Data Science',
      level: 'Beginner',
      enrolledCount: 234,
      maxAttendees: 500,
      rating: 4.7,
      tags: ['Free', 'Popular'],
      resources: ['Slides', 'Code Examples', 'Dataset']
    },
    {
      id: 'webinar_002',
      title: 'Advanced Python Programming',
      instructor: 'Prof. Michael Chen',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      description: 'Deep dive into advanced Python concepts including decorators, metaclasses, and performance optimization.',
      date: '2025-09-12T16:30:00Z',
      duration: 120,
      price: 79.99,
      type: 'paid',
      category: 'Programming',
      level: 'Advanced',
      enrolledCount: 89,
      maxAttendees: 100,
      rating: 4.9,
      tags: ['Premium', 'Certificate'],
      resources: ['Video Recording', 'Code Repository', 'Practice Exercises', 'Certificate']
    },
    {
      id: 'webinar_003',
      title: 'Web Development Bootcamp',
      instructor: 'Lisa Rodriguez',
      instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      description: 'Complete guide to modern web development using React, Node.js, and MongoDB.',
      date: '2025-09-15T10:00:00Z',
      duration: 180,
      price: 149.99,
      type: 'paid',
      category: 'Web Development',
      level: 'Intermediate',
      enrolledCount: 156,
      maxAttendees: 200,
      rating: 4.8,
      tags: ['Bootcamp', 'Hands-on', 'Certificate'],
      resources: ['Project Files', 'Video Recording', 'Code Templates', 'Certificate']
    }
  ];

  // Mock enrolled webinars
  const enrolledWebinars = [
    {
      id: 'webinar_enrolled_001',
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      date: '2025-09-08T14:00:00Z',
      duration: 90,
      price: 59.99,
      type: 'paid',
      status: 'upcoming',
      enrollmentDate: '2025-08-25T10:00:00Z',
      zoomLink: 'https://zoom.us/j/123456789',
      canRefund: true,
      refundDeadline: '2025-09-07T14:00:00Z'
    },
    {
      id: 'webinar_enrolled_002',
      title: 'React Hooks Deep Dive',
      instructor: 'Prof. Michael Chen',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      date: '2025-09-05T16:00:00Z',
      duration: 75,
      price: 39.99,
      type: 'paid',
      status: 'missed',
      enrollmentDate: '2025-08-20T15:30:00Z',
      recordingAvailable: true,
      recordingPrice: 19.99
    }
  ];

  // Mock available recordings
  const availableRecordings = [
    {
      id: 'recording_001',
      title: 'JavaScript ES6+ Features',
      instructor: 'Lisa Rodriguez',
      instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      originalDate: '2025-08-22T13:30:00Z',
      duration: 95,
      price: 24.99,
      originalPrice: 49.99,
      category: 'Programming',
      rating: 4.6,
      views: 1240,
      owned: false,
      preview: 'https://example.com/preview/js-es6'
    },
    {
      id: 'recording_002',
      title: 'Data Visualization with Python',
      instructor: 'Dr. Sarah Johnson',
      instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      originalDate: '2025-08-18T10:00:00Z',
      duration: 85,
      price: 0,
      originalPrice: 39.99,
      category: 'Data Science',
      rating: 4.8,
      views: 2156,
      owned: true,
      watchProgress: 65,
      lastWatched: '2025-08-30T20:15:00Z'
    }
  ];

  // Mock public resources
  const publicResources = [
    {
      id: 'resource_001',
      title: 'Python Cheat Sheet',
      description: 'Comprehensive Python syntax and functions reference',
      type: 'pdf',
      size: '2.3 MB',
      instructor: 'Dr. Sarah Johnson',
      downloads: 5420,
      rating: 4.7,
      url: 'https://example.com/resources/python-cheat-sheet.pdf',
      tags: ['Python', 'Reference', 'Beginner']
    },
    {
      id: 'resource_002',
      title: 'Machine Learning Algorithms Guide',
      description: 'Visual guide to popular ML algorithms with examples',
      type: 'pdf',
      size: '5.1 MB',
      instructor: 'Prof. Michael Chen',
      downloads: 3280,
      rating: 4.9,
      url: 'https://example.com/resources/ml-algorithms.pdf',
      tags: ['Machine Learning', 'Algorithms', 'Visual Guide']
    },
    {
      id: 'resource_003',
      title: 'React Components Library',
      description: 'Collection of reusable React components with examples',
      type: 'zip',
      size: '12.7 MB',
      instructor: 'Lisa Rodriguez',
      downloads: 1890,
      rating: 4.5,
      url: 'https://example.com/resources/react-components.zip',
      tags: ['React', 'Components', 'Code']
    }
  ];

  // Mock enrollment history
  const enrollmentHistory = [
    {
      id: 'enrollment_001',
      webinarTitle: 'Introduction to Machine Learning',
      instructor: 'Dr. Sarah Johnson',
      date: '2025-08-15T14:00:00Z',
      price: 79.99,
      status: 'completed',
      attended: true,
      duration: 105,
      rating: 5,
      certificateEarned: true,
      recordingAccess: true
    },
    {
      id: 'enrollment_002',
      webinarTitle: 'Advanced CSS Techniques',
      instructor: 'Lisa Rodriguez',
      date: '2025-08-10T16:00:00Z',
      price: 29.99,
      status: 'completed',
      attended: false,
      duration: 0,
      rating: null,
      certificateEarned: false,
      recordingAccess: true,
      refunded: true,
      refundAmount: 29.99,
      refundDate: '2025-08-11T10:00:00Z'
    }
  ];

  // Event handlers
  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handleEnrollWebinar = (webinar) => {
    if (webinar.price === 0) {
      console.log('Enrolling in free webinar:', webinar.title);
    } else {
      console.log('Redirecting to payment for webinar:', webinar.title);
      navigate('/payment', { state: { webinar } });
    }
  };

  const handleJoinWebinar = (webinar) => {
    console.log('Joining webinar:', webinar.title);
    if (webinar.zoomLink) {
      window.open(webinar.zoomLink, '_blank');
    }
  };

  const handleRequestRefund = (webinar) => {
    console.log('Requesting refund for webinar:', webinar.title);
    navigate('/refund-request', { state: { webinar } });
  };

  const handleBuyRecording = (recording) => {
    console.log('Buying recording:', recording.title);
    navigate('/payment', { state: { recording, type: 'recording' } });
  };

  const handleWatchRecording = (recording) => {
    console.log('Watching recording:', recording.title);
    navigate('/watch-recording', { state: { recording } });
  };

  const handleDownloadResource = (resource) => {
    console.log('Downloading resource:', resource.title);
    window.open(resource.url, '_blank');
  };

  const handleViewWebinarDetails = (webinar) => {
    navigate('/webinar-details', { state: { webinar } });
  };

  const tabs = [
    { id: 'available', label: 'Available Webinars', icon: 'Search' },
    { id: 'enrolled', label: 'My Enrollments', icon: 'BookOpen' },
    { id: 'recordings', label: 'Recordings', icon: 'Play' },
    { id: 'resources', label: 'Resources', icon: 'Download' },
    { id: 'history', label: 'History', icon: 'History' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <BreadcrumbNavigation user={user} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Learning Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Discover webinars, access recordings, and track your learning progress
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/browse-webinars')}
              iconName="Search"
              iconPosition="left"
              iconSize={16}
              className="mt-4 sm:mt-0"
            >
              Browse All Webinars
            </Button>
          </div>
        </div>

        {/* Overview Cards - Enhanced Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {overviewData?.map((card, index) => (
            <OverviewCard
              key={index}
              title={card?.title}
              value={card?.value}
              subtitle={card?.subtitle}
              icon={card?.icon}
              trend={card?.trend}
              trendValue={card?.trendValue}
              color={card?.color}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions 
          navigate={navigate}
          setActiveTab={setActiveTab}
          showQuickActions={showQuickActions}
          setShowQuickActions={setShowQuickActions}
        />

        {/* Tabs Navigation */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-foreground">Available Webinars</h2>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <select className="px-3 py-2 bg-background border border-border rounded-md text-sm">
                    <option value="all">All Categories</option>
                    <option value="programming">Programming</option>
                    <option value="data-science">Data Science</option>
                    <option value="web-development">Web Development</option>
                  </select>
                  <select className="px-3 py-2 bg-background border border-border rounded-md text-sm">
                    <option value="all">All Types</option>
                    <option value="free">Free Only</option>
                    <option value="paid">Paid Only</option>
                  </select>
                  <ViewToggle 
                    onViewChange={setViewMode}
                    currentView={viewMode}
                  />
                </div>
              </div>

              {/* Content based on view mode */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableWebinars?.map((webinar) => (
                    <WebinarCard
                      key={webinar?.id}
                      webinar={webinar}
                      onEnroll={handleEnrollWebinar}
                      onViewDetails={handleViewWebinarDetails}
                      userType="attendee"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {availableWebinars?.map((webinar) => (
                    <WebinarListItem
                      key={webinar?.id}
                      webinar={webinar}
                      onEnroll={handleEnrollWebinar}
                      onViewDetails={handleViewWebinarDetails}
                    />
                  ))}
                </div>
              )}

              {/* View More Button */}
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate('/browse-webinars')}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  View More Webinars
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'enrolled' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">My Enrollments</h2>
              
              {enrolledWebinars?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledWebinars?.map((webinar) => (
                    <div key={webinar?.id} className="bg-card border border-border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={webinar?.instructorAvatar} 
                            alt={webinar?.instructor}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="font-medium text-foreground">{webinar?.title}</h3>
                            <p className="text-sm text-muted-foreground">by {webinar?.instructor}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          webinar?.status === 'upcoming' 
                            ? 'bg-blue-100 text-blue-800' 
                            : webinar?.status === 'missed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {webinar?.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Date & Time:</span>
                          <span className="text-foreground">
                            {new Date(webinar?.date).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="text-foreground">{webinar?.duration} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price Paid:</span>
                          <span className="text-foreground">${webinar?.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-6">
                        {webinar?.status === 'upcoming' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleJoinWebinar(webinar)}
                              iconName="ExternalLink"
                              iconPosition="left"
                              iconSize={14}
                            >
                              Join Webinar
                            </Button>
                            {webinar?.canRefund && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRequestRefund(webinar)}
                                iconName="RefreshCw"
                                iconPosition="left"
                                iconSize={14}
                              >
                                Request Refund
                              </Button>
                            )}
                          </>
                        )}
                        
                        {webinar?.status === 'missed' && webinar?.recordingAvailable && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleBuyRecording({ 
                              ...webinar, 
                              price: webinar?.recordingPrice,
                              title: `${webinar?.title} - Recording`
                            })}
                            iconName="Play"
                            iconPosition="left"
                            iconSize={14}
                          >
                            Buy Recording (${webinar?.recordingPrice})
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No enrollments yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Discover and enroll in webinars to start learning
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setActiveTab('available')}
                    iconName="Search"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Browse Webinars
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recordings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-foreground">Available Recordings</h2>
                <ViewToggle 
                  onViewChange={setViewMode}
                  currentView={viewMode}
                />
              </div>
              
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
                "space-y-4"
              }>
                {availableRecordings?.map((recording) => (
                  <RecordingCard
                    key={recording?.id}
                    recording={recording}
                    onBuy={handleBuyRecording}
                    onWatch={handleWatchRecording}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* View More Button */}
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate('/browse-recordings')}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  View More Recordings
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-foreground">Public Resources</h2>
                <ViewToggle 
                  onViewChange={setViewMode}
                  currentView={viewMode}
                />
              </div>
              
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
                "space-y-4"
              }>
                {publicResources?.map((resource) => (
                  <ResourceCard
                    key={resource?.id}
                    resource={resource}
                    onDownload={handleDownloadResource}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* View More Button */}
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate('/browse-resources')}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  View More Resources
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Enrollment History</h2>
              <EnrollmentHistory history={enrollmentHistory} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;
