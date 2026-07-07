import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OverviewCard from './components/OverviewCard';
import SessionCard from './components/SessionCard';
import RevenueChart from './components/RevenueChart';
import AttendanceReport from './components/AttendanceReport';
import FeedbackSummary from './components/FeedbackSummary';
// import CreateSessionModal from './components/CreateSessionModal';
// import ResourceUploadModal from './components/ResourceUploadModal';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // const [selectedSession, setSelectedSession] = useState(null);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 'inst_001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@eduzoom.com',
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      specialization: 'Data Science & Machine Learning',
      experience: '8 years',
      rating: 4.8,
      totalStudents: 2847
    };
    setUser(mockUser);

    const mockNotifications = [
      {
        id: 1,
        title: 'New student enrolled',
        message: 'John Smith enrolled in your Python Fundamentals webinar',
        time: '5 minutes ago',
        type: 'webinar',
        read: false,
        priority: 'normal'
      },
      {
        id: 2,
        title: 'Payment received',
        message: 'You received $89 for Machine Learning Basics session',
        time: '1 hour ago',
        type: 'payment',
        read: false,
        priority: 'normal'
      },
      {
        id: 3,
        title: 'Session reminder',
        message: 'Your Advanced Python webinar starts in 2 hours',
        time: '2 hours ago',
        type: 'reminder',
        read: true,
        priority: 'high'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Mock overview data
  const overviewData = [
    {
      title: 'Total Sessions',
      value: '47',
      subtitle: 'This month',
      icon: 'Video',
      trend: 'up',
      trendValue: '+12%',
      color: 'primary'
    },
    {
      title: 'Enrolled Students',
      value: '1,234',
      subtitle: 'Active learners',
      icon: 'Users',
      trend: 'up',
      trendValue: '+8%',
      color: 'success'
    },
    // {
    //   title: 'Revenue Earned',
    //   value: '$12,450',
    //   subtitle: 'This month',
    //   icon: 'DollarSign',
    //   trend: 'up',
    //   trendValue: '+15%',
    //   color: 'warning'
    // },
    // {
    //   title: 'Average Rating',
    //   value: '4.8',
    //   subtitle: 'Out of 5.0',
    //   icon: 'Star',
    //   trend: 'up',
    //   trendValue: '+0.2',
    //   color: 'error'
    // }
  ];

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: 'session_001',
      title: 'Python Fundamentals for Beginners',
      description: 'Learn the basics of Python programming including variables, functions, and control structures. Perfect for complete beginners.',
      date: '2025-09-02T14:00:00Z',
      duration: 90,
      price: 49.99,
      enrolledCount: 45,
      maxAttendees: 100,
      status: 'scheduled',
      category: 'Programming',
      zoomLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 'session_002',
      title: 'Advanced Machine Learning Techniques',
      description: 'Deep dive into advanced ML algorithms, neural networks, and practical implementation strategies.',
      date: '2025-09-05T16:30:00Z',
      duration: 120,
      price: 89.99,
      enrolledCount: 32,
      maxAttendees: 50,
      status: 'scheduled',
      category: 'Data Science',
      zoomLink: 'https://zoom.us/j/987654321'
    },
    {
      id: 'session_003',
      title: 'Data Visualization with Python',
      description: 'Master data visualization using matplotlib, seaborn, and plotly to create compelling charts and graphs.',
      date: '2025-09-08T10:00:00Z',
      duration: 75,
      price: 39.99,
      enrolledCount: 67,
      maxAttendees: 80,
      status: 'scheduled',
      category: 'Data Science',
      zoomLink: 'https://zoom.us/j/456789123'
    }
  ];

  // Mock session history
  const sessionHistory = [
    {
      id: 'session_h001',
      title: 'Introduction to React Hooks',
      date: '2025-08-25T15:00:00Z',
      enrolledCount: 58,
      attendedCount: 52,
      avgDuration: 85,
      revenue: 1740,
      status: 'completed',
      participants: [
        { name: 'Alice Johnson', email: 'alice@example.com', duration: 90, attended: true },
        { name: 'Bob Smith', email: 'bob@example.com', duration: 85, attended: true },
        { name: 'Carol Davis', email: 'carol@example.com', duration: 0, attended: false }
      ]
    },
    {
      id: 'session_h002',
      title: 'JavaScript ES6+ Features',
      date: '2025-08-22T13:30:00Z',
      enrolledCount: 42,
      attendedCount: 38,
      avgDuration: 78,
      revenue: 1260,
      status: 'completed',
      participants: [
        { name: 'David Wilson', email: 'david@example.com', duration: 80, attended: true },
        { name: 'Emma Brown', email: 'emma@example.com', duration: 75, attended: true }
      ]
    }
  ];

  // Mock revenue data
  const revenueData = [
    { name: 'Jan', revenue: 8500 },
    { name: 'Feb', revenue: 9200 },
    { name: 'Mar', revenue: 7800 },
    { name: 'Apr', revenue: 10500 },
    { name: 'May', revenue: 11200 },
    { name: 'Jun', revenue: 9800 },
    { name: 'Jul', revenue: 12450 }
  ];

  // Mock feedback data
  const feedbackData = {
    ratings: [
      { value: 5, sessionId: 'session_h001' },
      { value: 4, sessionId: 'session_h001' },
      { value: 5, sessionId: 'session_h001' },
      { value: 4, sessionId: 'session_h002' },
      { value: 5, sessionId: 'session_h002' }
    ],
    comments: [
      {
        rating: 5,
        text: 'Excellent explanation of React Hooks! Very clear and practical examples.',
        author: 'Alice Johnson',
        date: '2025-08-25T16:30:00Z'
      },
      {
        rating: 4,
        text: 'Good content, would love more hands-on exercises.',
        author: 'Bob Smith',
        date: '2025-08-25T16:45:00Z'
      },
      {
        rating: 5,
        text: 'Perfect pace and great interaction with students.',
        author: 'Carol Davis',
        date: '2025-08-22T15:00:00Z'
      }
    ]
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Handle notification click logic
  };
 const handleCreateSession = () => {
    navigate('/instructor/create');
  };

  const handleEditSession = (session) => {
    console.log('Editing session:', session);
    // Navigate to edit session page
    navigate(`/instructor/create?edit=${session.id}`);
  };


  const handleUploadResource = (session) => {
    setSelectedSession(session);
    setIsUploadModalOpen(true);
  };

  const handleViewZoom = (session) => {
    console.log('Opening Zoom link for session:', session);
    window.open(session?.zoomLink, '_blank');
  };

  const handleViewDetails = (session) => {
    navigate('/webinar-details', { state: { session } });
  };

  // const handleResourceUpload = async (sessionId, files) => {
  //   console.log('Uploading resources for session:', sessionId, files);
  //   // Simulate API call
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   alert('Resources uploaded successfully!');
  // };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Sessions', icon: 'Calendar' },
    { id: 'history', label: 'Session History', icon: 'History' },
    // { id: 'analytics', label: 'Revenue Analytics', icon: 'TrendingUp' }
  ];

  return (
    <div className="min-h-screen bg-background">

   
        <div className=" mx-auto px-4 sm:px-6 lg:px-8  py-8">
          {/* Header Section */}
          <div className="mb-8">
            <BreadcrumbNavigation user={user} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Instructor Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your webinars, track performance
                </p>
              </div>
             
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Tabs Navigation */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
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
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                {upcomingSessions?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {upcomingSessions?.map((session) => (
                      <SessionCard
                        key={session?.id}
                        session={session}
                        onEdit={handleEditSession}
                        onUploadResource={handleUploadResource}
                        onViewZoom={handleViewZoom}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No upcoming sessions</h3>
                    <p className="text-muted-foreground mb-4">
                      Schedule your first webinar to start teaching
                    </p>
                    {/* <Button
                      variant="default"
                      onClick={() => setIsCreateModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Schedule New Webinar
                    </Button> */}
                  </div>
                )}
              </div>
            )}

            {/* {activeTab === 'history' && (
              <div className="space-y-6">
                {sessionHistory?.map((session) => (
                  <div key={session?.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AttendanceReport session={session} />
                    <FeedbackSummary feedback={feedbackData} />
                  </div>
                ))}
              </div>
            )} */}

            {/* {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart
                  data={revenueData}
                  type="bar"
                  title="Monthly Revenue"
                  height={300}
                />
                <RevenueChart
                  data={revenueData}
                  type="line"
                  title="Revenue Trend"
                  height={300}
                />
                
                <div className="lg:col-span-2">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mx-auto mb-2">
                          <Icon name="TrendingUp" size={20} className="text-success" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">$12,450</p>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg mx-auto mb-2">
                          <Icon name="Clock" size={20} className="text-warning" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">$8,200</p>
                        <p className="text-sm text-muted-foreground">Pending Payout</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                          <Icon name="CheckCircle" size={20} className="text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">$4,250</p>
                        <p className="text-sm text-muted-foreground">Paid Out</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
     
    </div>
  );
};

export default InstructorDashboard;