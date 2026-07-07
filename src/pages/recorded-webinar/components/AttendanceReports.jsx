import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from 'components/ui/AppHeader';
import AuthenticatedNavigation from 'components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Select from 'components/ui/Select';

const AttendanceReports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedWebinar, setSelectedWebinar] = useState('');

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

  // Mock attendance data based on research insights
  const attendanceStats = {
    overallRate: 78.5,
    noShowRate: 15.2,
    lateJoinersRate: 23.8,
    averageDuration: 42.5, // minutes
    totalRegistrations: 2847,
    totalAttendees: 2234,
    repeatAttendees: 67.3 // percentage
  };

  const webinarOptions = [
    { value: '', label: 'All Webinars' },
    { value: '1', label: 'Advanced React Patterns' },
    { value: '2', label: 'JavaScript ES2024 Features' },
    { value: '3', label: 'Node.js Performance' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  // Mock attendance patterns data
  const attendancePatterns = {
    byDayOfWeek: [
      { day: 'Monday', rate: 82.3, webinars: 45 },
      { day: 'Tuesday', rate: 79.1, webinars: 52 },
      { day: 'Wednesday', rate: 76.8, webinars: 48 },
      { day: 'Thursday', rate: 80.4, webinars: 43 },
      { day: 'Friday', rate: 74.2, webinars: 38 },
      { day: 'Saturday', rate: 71.5, webinars: 25 },
      { day: 'Sunday', rate: 69.8, webinars: 22 }
    ],
    byTimeOfDay: [
      { time: '9:00 AM', rate: 85.2 },
      { time: '11:00 AM', rate: 82.7 },
      { time: '1:00 PM', rate: 79.3 },
      { time: '3:00 PM', rate: 76.8 },
      { time: '5:00 PM', rate: 73.4 },
      { time: '7:00 PM', rate: 70.1 }
    ]
  };

  // Mock individual webinar reports
  const webinarReports = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      date: '2024-12-15T14:00:00Z',
      instructor: 'Dr. Michael Chen',
      registered: 125,
      attended: 98,
      attendanceRate: 78.4,
      noShows: 27,
      lateJoiners: 23,
      avgDuration: 45.2,
      satisfaction: 4.6
    },
    {
      id: 2,
      title: 'JavaScript ES2024 Features',
      date: '2024-12-10T13:00:00Z',
      instructor: 'Emily Rodriguez',
      registered: 89,
      attended: 72,
      attendanceRate: 80.9,
      noShows: 17,
      lateJoiners: 18,
      avgDuration: 38.7,
      satisfaction: 4.4
    },
    {
      id: 3,
      title: 'Node.js Performance',
      date: '2024-12-08T15:00:00Z',
      instructor: 'Dr. Michael Chen',
      registered: 95,
      attended: 74,
      attendanceRate: 77.9,
      noShows: 21,
      lateJoiners: 19,
      avgDuration: 41.3,
      satisfaction: 4.7
    }
  ];

  // Mock instructor performance data
  const instructorPerformance = [
    {
      name: 'Dr. Michael Chen',
      webinarsCount: 12,
      avgAttendanceRate: 79.2,
      avgSatisfaction: 4.6,
      totalAttendees: 847,
      repeatRate: 72.5
    },
    {
      name: 'Emily Rodriguez',
      webinarsCount: 8,
      avgAttendanceRate: 81.4,
      avgSatisfaction: 4.5,
      totalAttendees: 623,
      repeatRate: 68.3
    },
    {
      name: 'Sarah Johnson',
      webinarsCount: 6,
      avgAttendanceRate: 75.8,
      avgSatisfaction: 4.3,
      totalAttendees: 456,
      repeatRate: 64.2
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleExportReport = () => {
    console.log('Exporting attendance report...');
    alert('Attendance report exported successfully!');
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
    { label: 'Reports', href: '/admin/reports' },
    { label: 'Attendance Reports', href: null }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userRole="admin"
        currentPath="/admin/attendance-reports"
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Reports</h1>
                <p className="text-text-secondary">Detailed participation analytics and patterns</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select
                  options={timeRangeOptions}
                  value={timeRange}
                  onChange={setTimeRange}
                  className="w-40"
                />
                <Select
                  options={webinarOptions}
                  value={selectedWebinar}
                  onChange={setSelectedWebinar}
                  className="w-48"
                />
                <Button
                  variant="default"
                  onClick={handleExportReport}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Attendance Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Attendance Rate</p>
                  <p className="text-3xl font-bold text-foreground">{attendanceStats.overallRate}%</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-success" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                <span className="text-success">+2.3%</span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">No-Show Rate</p>
                  <p className="text-3xl font-bold text-foreground">{attendanceStats.noShowRate}%</p>
                </div>
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="UserX" size={24} className="text-error" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Icon name="TrendingDown" size={14} className="text-success mr-1" />
                <span className="text-success">-1.5%</span>
                <span className="text-muted-foreground ml-1">improvement</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Late Joiners</p>
                  <p className="text-3xl font-bold text-foreground">{attendanceStats.lateJoinersRate}%</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={24} className="text-warning" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Joined after start time
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                  <p className="text-3xl font-bold text-foreground">{attendanceStats.averageDuration}m</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Timer" size={24} className="text-primary" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Time spent per session
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Attendance Patterns */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Attendance Patterns</h2>
                
                {/* Day of Week Analysis */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-foreground mb-4">By Day of Week</h3>
                  <div className="space-y-3">
                    {attendancePatterns.byDayOfWeek.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="w-20 text-sm font-medium text-foreground">{day.day}</span>
                          <div className="flex-1 bg-muted rounded-full h-2 w-32">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${day.rate}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">{day.rate}%</div>
                          <div className="text-xs text-muted-foreground">{day.webinars} webinars</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time-based Heatmap */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">By Time of Day</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {attendancePatterns.byTimeOfDay.map((slot, index) => (
                      <div key={index} className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">{slot.time}</div>
                        <div className="text-lg font-bold text-foreground">{slot.rate}%</div>
                        <div className={`h-1 rounded-full mt-2 ${
                          slot.rate >= 80 ? 'bg-success' : 
                          slot.rate >= 70 ? 'bg-warning' : 'bg-error'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Webinar Reports */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">Individual Webinar Reports</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Webinar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Attended
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          No Shows
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Late Joiners
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Satisfaction
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {webinarReports.map((webinar) => (
                        <tr key={webinar.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-foreground">{webinar.title}</div>
                              <div className="text-sm text-muted-foreground">{webinar.instructor}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatDate(webinar.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {webinar.registered}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {webinar.attended}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              webinar.attendanceRate >= 80 
                                ? 'bg-success/10 text-success' 
                                : webinar.attendanceRate >= 70 
                                ? 'bg-warning/10 text-warning' 
                                : 'bg-error/10 text-error'
                            }`}>
                              {webinar.attendanceRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {webinar.noShows}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {webinar.lateJoiners}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <Icon name="Star" size={14} className="text-warning fill-current" />
                              <span className="text-sm font-medium text-foreground">{webinar.satisfaction}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Insights */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="TrendingUp" size={16} className="text-success" />
                      <span className="text-sm font-medium text-success">High Attendance</span>
                    </div>
                    <p className="text-xs text-success/80 mt-1">
                      Tuesday shows highest attendance rates (79.1%)
                    </p>
                  </div>

                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-warning" />
                      <span className="text-sm font-medium text-warning">Peak Time</span>
                    </div>
                    <p className="text-xs text-warning/80 mt-1">
                      Morning slots (9-11 AM) have best attendance
                    </p>
                  </div>

                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="Users" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-primary">Retention</span>
                    </div>
                    <p className="text-xs text-primary/80 mt-1">
                      67% of attendees join multiple webinars
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructor Performance */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Instructor Performance</h3>
                
                <div className="space-y-4">
                  {instructorPerformance.map((instructor, index) => (
                    <div key={index} className="border border-border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">{instructor.name}</h4>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {instructor.avgAttendanceRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">attendance</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Webinars:</span>
                          <span className="ml-1 font-medium text-foreground">{instructor.webinarsCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="ml-1 font-medium text-foreground">{instructor.avgSatisfaction}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Attendees:</span>
                          <span className="ml-1 font-medium text-foreground">{instructor.totalAttendees}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Repeat:</span>
                          <span className="ml-1 font-medium text-foreground">{instructor.repeatRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration vs Attendance */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Duration Impact</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">60 min sessions</span>
                    <span className="text-sm font-medium text-foreground">82.4% attendance</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">90 min sessions</span>
                    <span className="text-sm font-medium text-foreground">78.1% attendance</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">120 min sessions</span>
                    <span className="text-sm font-medium text-foreground">74.6% attendance</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <Icon name="Info" size={12} className="inline mr-1" />
                    Shorter sessions show higher attendance rates
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

export default AttendanceReports;
