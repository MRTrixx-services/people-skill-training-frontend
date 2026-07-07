import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricCard from './components/MetricCard';
import SystemHealthChart from './components/SystemHealthChart';
import LiveActivityFeed from './components/LiveActivityFeed';
import ServiceStatusGrid from './components/ServiceStatusGrid';
import GlobalHealthIndicator from './components/GlobalHealthIndicator';

import Button from '../../components/ui/Button';

const RealTimeOperationsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time metrics mock data
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    concurrentUsers: { value: 1247, change: 8.2, sparkline: [1180, 1195, 1210, 1225, 1240, 1247] },
    systemLoad: { value: 67, change: -2.1, sparkline: [72, 70, 68, 69, 67, 67] },
    errorRate: { value: 0.03, change: -15.2, sparkline: [0.05, 0.04, 0.04, 0.03, 0.03, 0.03] },
    paymentProcessing: { value: 156, change: 12.5, sparkline: [140, 145, 148, 152, 154, 156] },
    zoomHealth: { value: 98.7, change: 0.8, sparkline: [98.2, 98.4, 98.5, 98.6, 98.7, 98.7] },
    supportTickets: { value: 23, change: -18.3, sparkline: [28, 26, 25, 24, 23, 23] },
    responseTime: { value: 142, change: -8.7, sparkline: [165, 158, 152, 148, 145, 142] },
    serverUptime: { value: 99.98, change: 0.02, sparkline: [99.96, 99.97, 99.97, 99.98, 99.98, 99.98] }
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        concurrentUsers: {
          ...prev?.concurrentUsers,
          value: prev?.concurrentUsers?.value + Math.floor(Math.random() * 20 - 10),
          sparkline: [...prev?.concurrentUsers?.sparkline?.slice(1), prev?.concurrentUsers?.value + Math.floor(Math.random() * 20 - 10)]
        }
      }));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (path) => {
    // Handle navigation logic here
    console.log('Navigating to:', path);
  };

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const metricCards = [
    {
      title: 'Concurrent Users',
      value: realTimeMetrics?.concurrentUsers?.value,
      change: realTimeMetrics?.concurrentUsers?.change,
      changeType: realTimeMetrics?.concurrentUsers?.change > 0 ? 'positive' : 'negative',
      icon: 'Users',
      sparklineData: realTimeMetrics?.concurrentUsers?.sparkline,
      status: realTimeMetrics?.concurrentUsers?.value > 1200 ? 'warning' : 'normal'
    },
    {
      title: 'System Load',
      value: realTimeMetrics?.systemLoad?.value,
      unit: '%',
      change: realTimeMetrics?.systemLoad?.change,
      changeType: realTimeMetrics?.systemLoad?.change < 0 ? 'positive' : 'negative',
      icon: 'Cpu',
      sparklineData: realTimeMetrics?.systemLoad?.sparkline,
      status: realTimeMetrics?.systemLoad?.value > 80 ? 'critical' : realTimeMetrics?.systemLoad?.value > 70 ? 'warning' : 'normal'
    },
    {
      title: 'Error Rate',
      value: realTimeMetrics?.errorRate?.value,
      unit: '%',
      change: realTimeMetrics?.errorRate?.change,
      changeType: realTimeMetrics?.errorRate?.change < 0 ? 'positive' : 'negative',
      icon: 'AlertTriangle',
      sparklineData: realTimeMetrics?.errorRate?.sparkline,
      status: realTimeMetrics?.errorRate?.value > 0.05 ? 'critical' : realTimeMetrics?.errorRate?.value > 0.02 ? 'warning' : 'success'
    },
    {
      title: 'Payment Processing',
      value: realTimeMetrics?.paymentProcessing?.value,
      unit: '/hr',
      change: realTimeMetrics?.paymentProcessing?.change,
      changeType: realTimeMetrics?.paymentProcessing?.change > 0 ? 'positive' : 'negative',
      icon: 'CreditCard',
      sparklineData: realTimeMetrics?.paymentProcessing?.sparkline,
      status: 'success'
    },
    {
      title: 'Zoom Integration',
      value: realTimeMetrics?.zoomHealth?.value,
      unit: '%',
      change: realTimeMetrics?.zoomHealth?.change,
      changeType: realTimeMetrics?.zoomHealth?.change > 0 ? 'positive' : 'negative',
      icon: 'Video',
      sparklineData: realTimeMetrics?.zoomHealth?.sparkline,
      status: realTimeMetrics?.zoomHealth?.value > 95 ? 'success' : 'warning'
    },
    {
      title: 'Support Tickets',
      value: realTimeMetrics?.supportTickets?.value,
      change: realTimeMetrics?.supportTickets?.change,
      changeType: realTimeMetrics?.supportTickets?.change < 0 ? 'positive' : 'negative',
      icon: 'MessageCircle',
      sparklineData: realTimeMetrics?.supportTickets?.sparkline,
      status: realTimeMetrics?.supportTickets?.value > 30 ? 'warning' : 'normal'
    },
    {
      title: 'Response Time',
      value: realTimeMetrics?.responseTime?.value,
      unit: 'ms',
      change: realTimeMetrics?.responseTime?.change,
      changeType: realTimeMetrics?.responseTime?.change < 0 ? 'positive' : 'negative',
      icon: 'Zap',
      sparklineData: realTimeMetrics?.responseTime?.sparkline,
      status: realTimeMetrics?.responseTime?.value > 200 ? 'warning' : 'success'
    },
    {
      title: 'Server Uptime',
      value: realTimeMetrics?.serverUptime?.value,
      unit: '%',
      change: realTimeMetrics?.serverUptime?.change,
      changeType: realTimeMetrics?.serverUptime?.change > 0 ? 'positive' : 'negative',
      icon: 'Server',
      sparklineData: realTimeMetrics?.serverUptime?.sparkline,
      status: realTimeMetrics?.serverUptime?.value > 99.9 ? 'success' : 'warning'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onNavigate={handleNavigate}
        globalControls={true}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onNavigate={handleNavigate}
        connectionStatus={connectionStatus}
      />
      <main className={`
        pt-16 transition-all duration-300 ease-out min-h-screen
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Real-Time Operations Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor system health, user activity, and critical platform metrics with live data updates
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-error'
                }`} />
                <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
              
              <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
                Refresh All
              </Button>
            </div>
          </div>

          {/* Top Row - Global Health & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <GlobalHealthIndicator />
            </div>
            
            <div className="lg:col-span-3">
              {/* Real-time Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricCards?.map((metric, index) => (
                  <MetricCard
                    key={index}
                    title={metric?.title}
                    value={metric?.value}
                    unit={metric?.unit}
                    change={metric?.change}
                    changeType={metric?.changeType}
                    icon={metric?.icon}
                    sparklineData={metric?.sparklineData}
                    status={metric?.status}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Performance Chart */}
            <div className="lg:col-span-2">
              <SystemHealthChart />
            </div>
            
            {/* Live Activity Feed */}
            <div className="lg:col-span-1">
              <LiveActivityFeed />
            </div>
          </div>

          {/* Service Status Grid */}
          <div>
            <ServiceStatusGrid />
          </div>

          {/* Quick Actions Footer */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Common administrative tasks and emergency procedures
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" iconName="AlertTriangle" iconPosition="left">
                  Create Alert
                </Button>
                <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
                  System Config
                </Button>
                <Button variant="outline" size="sm" iconName="Database" iconPosition="left">
                  Backup Now
                </Button>
                <Button variant="outline" size="sm" iconName="Users" iconPosition="left">
                  User Management
                </Button>
                <Button variant="outline" size="sm" iconName="FileText" iconPosition="left">
                  Generate Report
                </Button>
                <Button variant="destructive" size="sm" iconName="Power" iconPosition="left">
                  Emergency Stop
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RealTimeOperationsDashboard;