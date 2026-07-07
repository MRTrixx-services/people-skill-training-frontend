import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import MetricsCard from './components/MetricsCard';
import UserManagementTab from './components/UserManagementTab';
import AnalyticsTab from './components/AnalyticsTab';
import ContentOversightTab from './components/ContentOversightTab';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Mock user data - in real app, this would come from authentication context
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@eduzoom.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    };
    setUser(mockUser);

    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        title: "New Instructor Application",
        message: "Dr. Sarah Johnson has submitted an application for instructor approval",
        time: "5 minutes ago",
        type: "system",
        read: false,
        priority: "high"
      },
      {
        id: 2,
        title: "Payment Gateway Alert",
        message: "Razorpay integration requires attention - 3 failed transactions",
        time: "1 hour ago",
        type: "payment",
        read: false,
        priority: "high"
      },
      {
        id: 3,
        title: "Webinar Approval Needed",
        message: "Advanced React Patterns webinar is pending your review",
        time: "2 hours ago",
        type: "webinar",
        read: true,
        priority: "medium"
      },
      {
        id: 4,
        title: "System Backup Complete",
        message: "Daily database backup completed successfully",
        time: "6 hours ago",
        type: "system",
        read: true,
        priority: "low"
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleLogout = () => {
    console.log("Logging out admin user");
    navigate('/login');
  };

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
    // Mark as read and handle navigation based on notification type
    setNotifications(prev => 
      prev?.map(n => n?.id === notification?.id ? { ...n, read: true } : n)
    );
  };

  // Mock metrics data
  const metricsData = [
    {
      title: "Total Users",
      value: "3,247",
      change: "+12.5%",
      changeType: "positive",
      icon: "Users",
      color: "primary"
    },
    {
      title: "Active Webinars",
      value: "156",
      change: "+8.2%",
      changeType: "positive",
      icon: "Video",
      color: "success"
    },
    {
      title: "Revenue Generated",
      value: "$31,240",
      change: "+15.3%",
      changeType: "positive",
      icon: "DollarSign",
      color: "accent"
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "Excellent",
      changeType: "neutral",
      icon: "Activity",
      color: "success"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'users', label: 'User Management', icon: 'Users' },
    { id: 'analytics', label: 'Platform Analytics', icon: 'BarChart3' },
    { id: 'content', label: 'Content Oversight', icon: 'FileCheck' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagementTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'content':
        return <ContentOversightTab />;
      default:
        return (
          <div className="space-y-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  color={metric?.color}
                />
              ))}
            </div>
            {/* Quick Actions */}
            <QuickActions />
      
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}

   
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Breadcrumb */}
     

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive system oversight and platform management
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => console.log("Export system report")}
                >
                  Export Report
                </Button>
                <Button
                  variant="default"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => console.log("Open system settings")}
                >
                  System Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>
     
    </div>
  );
};

export default AdminDashboard;