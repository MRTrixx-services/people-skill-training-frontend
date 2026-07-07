import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import InstructorSidebar from '../../components/ui/InstructorSidebar';
import MetricCard from './components/MetricCard';
import DateRangePicker from './components/DateRangePicker';
import RegistrationChart from './components/RegistrationChart';
import AttendanceBreakdown from './components/AttendanceBreakdown';
import RevenueChart from './components/RevenueChart';
import WebinarPerformanceTable from './components/WebinarPerformanceTable';
import FilterPanel from './components/FilterPanel';
import InsightCard from './components/InsightCard';
import Button from '../../components/ui/Button';


const InstructorAnalyticsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [realTimeData, setRealTimeData] = useState({
    liveViewers: 0,
    activeRegistrations: 0
  });

  // Mock user data
  const instructorData = {
    name: "Dr. Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    totalWebinars: 24,
    totalStudents: 1247
  };

  // Mock metrics data
  const metricsData = [
    {
      title: "Total Registrations",
      value: "1,247",
      change: 12.5,
      changeType: "positive",
      icon: "Users",
      period: "vs last month"
    },
    {
      title: "Average Attendance Rate",
      value: "84.2%",
      change: 5.3,
      changeType: "positive",
      icon: "UserCheck",
      period: "vs last month"
    },
    {
      title: "Average Rating",
      value: "4.6",
      change: 0.2,
      changeType: "positive",
      icon: "Star",
      period: "vs last month"
    },
    {
      title: "Total Revenue",
      value: "$12,450",
      change: 18.7,
      changeType: "positive",
      icon: "DollarSign",
      period: "vs last month"
    }
  ];

  // Add mock data for charts and components
  const mockChartData = {
    registrations: [
      { date: '2024-01-01', registrations: 45 },
      { date: '2024-01-02', registrations: 52 },
      { date: '2024-01-03', registrations: 38 }
    ],
    attendance: {
      attended: 85,
      missed: 15
    },
    revenue: [
      { month: 'Jan', revenue: 2400 },
      { month: 'Feb', revenue: 2800 },
      { month: 'Mar', revenue: 3200 }
    ],
    webinars: [
      {
        id: 1,
        title: 'Introduction to Data Science',
        registrations: 156,
        attendance: 85,
        rating: 4.5,
        revenue: 2340
      }
    ]
  };

  const mockInsights = [
    {
      type: 'success',
      title: 'High Attendance Rate',
      description: 'Your webinars have 15% higher attendance than average'
    },
    {
      type: 'warning',
      title: 'Revenue Opportunity',
      description: 'Consider premium pricing for advanced topics'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        liveViewers: Math.floor(Math.random() * 50) + 10,
        activeRegistrations: prev?.activeRegistrations + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange?.preset);
    // Here you would typically fetch new data based on the date range
    console.log('Date range changed:', newRange);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Here you would typically apply filters to the data
    console.log('Filters changed:', newFilters);
  };

  const handleExportReport = () => {
    // Simulate report generation
    console.log('Generating comprehensive report...');
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="instructor" 
        userName={instructorData?.name}
        userAvatar={instructorData?.avatar}
      />
      <InstructorSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      } pt-16`}>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
                Analytics Dashboard
              </h1>
              <p className="text-text-secondary mt-1">
                Comprehensive insights into your webinar performance and student engagement
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <DateRangePicker 
                onDateRangeChange={handleDateRangeChange}
                selectedRange={dateRange}
              />
              
              <Button
                variant="outline"
                onClick={() => setFiltersOpen(!filtersOpen)}
                iconName="Filter"
                iconPosition="left"
                iconSize={16}
                className={filtersOpen ? 'bg-primary/10 text-primary' : ''}
              >
                Filters
              </Button>
              
              <Button
                variant="default"
                onClick={handleExportReport}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Real-time Status Bar */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-elevation-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-text-secondary">Live Status</span>
                </div>
                <div className="text-sm text-text-primary">
                  <span className="font-medium">{realTimeData?.liveViewers}</span> viewers online
                </div>
                <div className="text-sm text-text-primary">
                  <span className="font-medium">{realTimeData?.activeRegistrations}</span> new registrations today
                </div>
              </div>
              <div className="text-xs text-text-secondary">
                Last updated: {new Date()?.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            onFiltersChange={handleFiltersChange}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {metricsData?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                period={metric?.period}
                loading={loading}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <RegistrationChart loading={loading} data={mockChartData.registrations} />
            </div>
            
            <AttendanceBreakdown loading={loading} data={mockChartData.attendance} />
            <RevenueChart loading={loading} data={mockChartData.revenue} />
          </div>

          {/* Insights and Performance */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <WebinarPerformanceTable loading={loading} data={mockChartData.webinars} />
            </div>
            
            <div>
              <InsightCard loading={loading} insights={mockInsights} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                fullWidth
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                onClick={() => window.location.href = '/create-edit-webinar'}
              >
                Create Webinar
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="Video"
                iconPosition="left"
                iconSize={16}
              >
                Start Live Session
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="Upload"
                iconPosition="left"
                iconSize={16}
              >
                Upload Resources
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="MessageSquare"
                iconPosition="left"
                iconSize={16}
              >
                View Feedback
              </Button>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Platform Comparison</h3>
                <p className="text-sm text-text-secondary">How you compare to other instructors</p>
              </div>
              <Button variant="ghost" size="sm" iconName="Info" iconSize={16}>
                Learn More
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">Top 15%</div>
                <div className="text-sm text-text-secondary">Attendance Rate</div>
                <div className="text-xs text-text-secondary mt-1">Above platform average</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">Top 25%</div>
                <div className="text-sm text-text-secondary">Student Satisfaction</div>
                <div className="text-xs text-text-secondary mt-1">4.6/5.0 average rating</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-2">Top 40%</div>
                <div className="text-sm text-text-secondary">Revenue per Session</div>
                <div className="text-xs text-text-secondary mt-1">Room for improvement</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorAnalyticsDashboard;