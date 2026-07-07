import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const SystemAnalytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock admin user
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@peopleskilltraining.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  // Mock analytics data
  const usageMetrics = {
    dailyActiveUsers: 2847,
    monthlyActiveUsers: 15247,
    pageViews: 89453,
    avgSessionDuration: '12m 34s',
    bounceRate: 24.5,
    userGrowth: 12.8,
    sessionGrowth: 8.5,
    trends: {
      dau: [2100, 2200, 2150, 2300, 2400, 2550, 2847],
      mau: [12500, 13200, 13800, 14100, 14600, 15000, 15247],
      pageViews: [78000, 82000, 85000, 87000, 89000, 88500, 89453]
    }
  };

  const featureAdoption = [
    { feature: 'Webinar Creation', adoption: 78.5, users: 1890 },
    { feature: 'Recording Access', adoption: 65.2, users: 1574 },
    { feature: 'Live Chat', adoption: 89.3, users: 2154 },
    { feature: 'Screen Sharing', adoption: 45.7, users: 1102 },
    { feature: 'Q&A Sessions', adoption: 72.1, users: 1740 },
    { feature: 'Polls & Surveys', adoption: 38.9, users: 938 }
  ];

  const performanceMetrics = {
    avgResponseTime: 245,
    errorRate: 0.12,
    uptime: 99.97,
    serverHealth: 'healthy',
    apiCallsPerHour: 12847,
    bandwidthUsage: '847 GB',
    databaseQueries: 45623,
    cacheHitRate: 94.5
  };

  const popularWebinars = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      instructor: 'Dr. Michael Chen',
      views: 1247,
      enrollments: 89,
      rating: 4.8,
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'JavaScript ES2024 Features',
      instructor: 'Emily Rodriguez',
      views: 892,
      enrollments: 67,
      rating: 4.6,
      category: 'Programming'
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      instructor: 'Dr. Sarah Watson',
      views: 756,
      enrollments: 54,
      rating: 4.9,
      category: 'Data Science'
    }
  ];

  const conversionFunnel = [
    { stage: 'Visitors', count: 15247, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Sign-ups', count: 4523, percentage: 29.7, color: 'bg-green-500' },
    { stage: 'Free Webinar Attendees', count: 2156, percentage: 14.1, color: 'bg-yellow-500' },
    { stage: 'Paid Webinar Purchasers', count: 847, percentage: 5.6, color: 'bg-purple-500' },
    { stage: 'Repeat Customers', count: 324, percentage: 2.1, color: 'bg-red-500' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleExportData = () => {
    console.log('Exporting analytics data...');
    // In real app, this would generate and download analytics report
    alert('Analytics report exported successfully!');
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const customBreadcrumbs = [
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'System Analytics', href: null }
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userRole="admin"
        currentPath="/admin/analytics"
      />

      <AppHeader
        user={user}
        notifications={[]}
        onLogout={handleLogout}
        onNotificationClick={() => {}}
      />

      <main className={`transition-all duration-300 ${
        isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } lg:pt-0 pt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">System Analytics</h1>
                <p className="text-text-secondary">Real-time insights into platform performance and user behavior</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select
                  options={timeRangeOptions}
                  value={timeRange}
                  onChange={setTimeRange}
                  className="w-40"
                />
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  loading={refreshing}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Refresh
                </Button>
                <Button
                  variant="default"
                  onClick={handleExportData}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Daily Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(usageMetrics.dailyActiveUsers)}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                <span className="text-success">+{usageMetrics.userGrowth}%</span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(usageMetrics.monthlyActiveUsers)}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={24} className="text-success" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                <span className="text-success">+{usageMetrics.sessionGrowth}%</span>
                <span className="text-muted-foreground ml-1">growth rate</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(usageMetrics.pageViews)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Eye" size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Avg Session: {usageMetrics.avgSessionDuration}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bounce Rate</p>
                  <p className="text-2xl font-bold text-foreground">{usageMetrics.bounceRate}%</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingDown" size={24} className="text-warning" />
                </div>
              </div>
              <div className="mt-4 text-sm text-success">
                -2.3% improvement
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Usage Trends Chart */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Usage Trends</h3>
                <div className="h-80 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Icon name="TrendingUp" size={48} className="text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Multi-line chart showing DAU, MAU, and Page Views over time</p>
                  </div>
                </div>
              </div>

              {/* Performance Monitoring */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Performance Monitoring</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{performanceMetrics.avgResponseTime}ms</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{performanceMetrics.errorRate}%</div>
                    <div className="text-sm text-muted-foreground">Error Rate</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{performanceMetrics.uptime}%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{performanceMetrics.cacheHitRate}%</div>
                    <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                  </div>
                </div>

                {/* Performance Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Response Time</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <Icon name="Activity" size={32} className="text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Error Rate</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <Icon name="AlertTriangle" size={32} className="text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Uptime</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <Icon name="CheckCircle" size={32} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Journey Flow */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Conversion Funnel</h3>
                
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(stage.count)} ({stage.percentage}%)
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`${stage.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                      {index < conversionFunnel.length - 1 && (
                        <div className="flex items-center justify-center mt-2 mb-2">
                          <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {/* Feature Adoption */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Feature Adoption</h3>
                
                <div className="space-y-4">
                  {featureAdoption.map((feature, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{feature.feature}</span>
                        <span className="text-sm text-muted-foreground">{feature.adoption}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${feature.adoption}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatNumber(feature.users)} users
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Webinars */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Most Popular Webinars</h3>
                
                <div className="space-y-4">
                  {popularWebinars.map((webinar, index) => (
                    <div key={webinar.id} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground line-clamp-1">{webinar.title}</h4>
                          <p className="text-xs text-muted-foreground">{webinar.instructor}</p>
                          <p className="text-xs text-muted-foreground">{webinar.category}</p>
                        </div>
                        <span className="text-xs font-medium text-primary">#{index + 1}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium text-foreground">{formatNumber(webinar.views)}</span>
                          <div>Views</div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{webinar.enrollments}</span>
                          <div>Enrolled</div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{webinar.rating}</span>
                          <div>Rating</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => navigate('/admin/webinars')}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  View All Webinars
                </Button>
              </div>

              {/* System Health */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">System Health</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">API Calls/Hour</span>
                    <span className="text-sm font-medium text-foreground">{formatNumber(performanceMetrics.apiCallsPerHour)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Bandwidth Usage</span>
                    <span className="text-sm font-medium text-foreground">{performanceMetrics.bandwidthUsage}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Database Queries</span>
                    <span className="text-sm font-medium text-foreground">{formatNumber(performanceMetrics.databaseQueries)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Server Status</span>
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={14} className="text-success" />
                      <span className="text-sm font-medium text-success">Healthy</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => navigate('/admin/system-logs')}
                  iconName="FileText"
                  iconPosition="left"
                >
                  View System Logs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemAnalytics;
