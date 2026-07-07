import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import GeographicDistribution from './components/GeographicDistribution';
import TopCourses from './components/TopCourses';
import EnrollmentFunnel from './components/EnrollmentFunnel';
import DateRangePicker from './components/DateRangePicker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ExecutiveOverviewDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('current-quarter');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Update last updated time every 30 minutes
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleNavigate = (path) => {
    console.log('Navigating to:', path);
    // Navigation logic would be implemented here
  };

  const handleDateRangeChange = (range, comparison) => {
    setSelectedDateRange(range);
    setComparisonEnabled(comparison);
    // Trigger data refresh based on new date range
    console.log('Date range changed:', range, 'Comparison:', comparison);
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // In real implementation, this would generate and download PDF
      console.log('Executive summary report exported');
    }, 3000);
  };

  const primaryMetrics = [
    {
      title: 'Total Revenue',
      value: '2.1M',
      prefix: '$',
      change: '+18.2%',
      changeType: 'positive',
      icon: 'DollarSign',
      description: 'YTD revenue performance'
    },
    {
      title: 'Active Users',
      value: '35.2K',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      description: 'Monthly active learners'
    },
    {
      title: 'Course Completions',
      value: '8.9K',
      change: '+24.1%',
      changeType: 'positive',
      icon: 'GraduationCap',
      description: 'Completed this quarter'
    },
    {
      title: 'Active Instructors',
      value: '247',
      change: '+8.7%',
      changeType: 'positive',
      icon: 'UserCheck',
      description: 'Teaching this month'
    },
    {
      title: 'Conversion Rate',
      value: '7.2',
      suffix: '%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      description: 'Visitor to enrollment'
    },
    {
      title: 'Customer LTV',
      value: '485',
      prefix: '$',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'Target',
      description: 'Average lifetime value'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={handleSidebarToggle}
        onNavigate={handleNavigate}
        globalControls={false}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        onNavigate={handleNavigate}
        connectionStatus="connected"
      />
      <main className={`
        pt-16 transition-all duration-300 ease-out
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-6">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Executive Overview</h1>
              <p className="text-muted-foreground">
                Strategic insights and high-level KPIs for leadership decision-making
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <DateRangePicker onDateRangeChange={handleDateRangeChange} />
              
              <Button
                variant="outline"
                onClick={handleExportReport}
                loading={isExporting}
                iconName="FileText"
                iconPosition="left"
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Data Freshness Indicator */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Data last updated: {lastUpdated?.toLocaleString()}
              </span>
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            
            {comparisonEnabled && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="GitCompare" size={16} />
                <span>Comparing with previous period</span>
              </div>
            )}
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {primaryMetrics?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                prefix={metric?.prefix}
                suffix={metric?.suffix}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue Chart - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <RevenueChart />
            </div>

            {/* Geographic Distribution - Takes 1 column */}
            <div className="space-y-6">
              <GeographicDistribution />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Top Courses - Takes 1 column */}
            <div>
              <TopCourses />
            </div>

            {/* Enrollment Funnel - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <EnrollmentFunnel />
            </div>
          </div>

          {/* Alert Section */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Anomaly Detected</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Course completion rate dropped by 15% in the last 48 hours. 
                  <button className="text-primary hover:underline ml-1">
                    View details →
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-4">
            <p>© {new Date()?.getFullYear()} Analytics Hub. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExecutiveOverviewDashboard;