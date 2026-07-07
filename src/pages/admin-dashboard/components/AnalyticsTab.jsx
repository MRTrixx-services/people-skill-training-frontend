import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const timeRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12500, webinars: 45 },
    { month: 'Feb', revenue: 18200, webinars: 52 },
    { month: 'Mar', revenue: 15800, webinars: 48 },
    { month: 'Apr', revenue: 22100, webinars: 61 },
    { month: 'May', revenue: 19500, webinars: 55 },
    { month: 'Jun', revenue: 25300, webinars: 68 },
    { month: 'Jul', revenue: 28900, webinars: 72 },
    { month: 'Aug', revenue: 31200, webinars: 78 }
  ];

  const userGrowthData = [
    { month: 'Jan', attendees: 1200, instructors: 45 },
    { month: 'Feb', attendees: 1450, instructors: 52 },
    { month: 'Mar', attendees: 1680, instructors: 58 },
    { month: 'Apr', attendees: 1920, instructors: 65 },
    { month: 'May', attendees: 2150, instructors: 71 },
    { month: 'Jun', attendees: 2380, instructors: 78 },
    { month: 'Jul', attendees: 2620, instructors: 84 },
    { month: 'Aug', attendees: 2890, instructors: 91 }
  ];

  const categoryData = [
    { name: 'Technology', value: 35, color: '#2563EB' },
    { name: 'Business', value: 25, color: '#059669' },
    { name: 'Design', value: 20, color: '#F59E0B' },
    { name: 'Marketing', value: 12, color: '#DC2626' },
    { name: 'Others', value: 8, color: '#64748B' }
  ];

  const topInstructors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      revenue: 15420,
      webinars: 24,
      rating: 4.9,
      students: 1250
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      revenue: 12800,
      webinars: 18,
      rating: 4.8,
      students: 980
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      revenue: 11200,
      webinars: 16,
      rating: 4.7,
      students: 850
    }
  ];

  const systemMetrics = [
    { label: "Server Uptime", value: "99.9%", status: "excellent" },
    { label: "Zoom Integration", value: "Active", status: "good" },
    { label: "Payment Gateway", value: "Active", status: "good" },
    { label: "Email Service", value: "Active", status: "good" },
    { label: "Database Performance", value: "Optimal", status: "excellent" },
    { label: "CDN Status", value: "Active", status: "good" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-success bg-success/10';
      case 'good':
        return 'text-primary bg-primary/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Platform Analytics</h3>
        <div className="flex items-center space-x-4">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-40"
          />
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export Report
          </Button>
        </div>
      </div>
      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-foreground">Revenue Trends</h4>
            <Icon name="TrendingUp" size={20} className="text-success" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-foreground">User Growth</h4>
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendees" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="instructors" 
                  stroke="var(--color-success)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Category Distribution and Top Instructors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-base font-semibold text-foreground mb-4">Webinar Categories</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData?.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category?.color }}
                />
                <span className="text-sm text-muted-foreground">{category?.name}</span>
                <span className="text-sm font-medium text-foreground">{category?.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-base font-semibold text-foreground mb-4">Top Performing Instructors</h4>
          <div className="space-y-4">
            {topInstructors?.map((instructor, index) => (
              <div key={instructor?.id} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  #{index + 1}
                </div>
                <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
                  <img 
                    src={instructor?.avatar} 
                    alt={instructor?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{instructor?.name}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>${instructor?.revenue?.toLocaleString()}</span>
                    <span>{instructor?.webinars} webinars</span>
                    <span>{instructor?.students} students</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="text-sm font-medium text-foreground">{instructor?.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* System Health */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-base font-semibold text-foreground mb-4">System Health & Integrations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemMetrics?.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">{metric?.label}</p>
                <p className="text-xs text-muted-foreground mt-1">Status</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(metric?.status)}`}>
                {metric?.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;