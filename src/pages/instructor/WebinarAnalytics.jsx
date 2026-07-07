import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const WebinarAnalytics = () => {
  const navigate = useNavigate();
  const { webinarId } = useParams();
  const [user, setUser] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Dr. Michael Chen",
      email: "michael.chen@email.com",
      role: "instructor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Enhanced mock data with charts
  useEffect(() => {
    const mockData = {
      webinar: {
        id: webinarId,
        title: "Advanced React Patterns and Performance Optimization",
        date: "November 28, 2024",
        time: "2:00 PM EST",
        duration: "2 hours",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
        instructor: "Dr. Michael Chen",
        status: "completed"
      },
      analytics: {
        registrationRate: 85.2,
        attendanceRate: 74.1,
        completionRate: 89.3,
        satisfactionScore: 4.7,
        totalRegistrations: 58,
        totalAttendees: 43,
        totalRevenue: 3886.50,
        avgViewTime: 105
      },
      registrationTimeline: [
        { date: '2024-11-01', registrations: 4, cumulative: 4 },
        { date: '2024-11-05', registrations: 5, cumulative: 15 },
        { date: '2024-11-10', registrations: 8, cumulative: 28 },
        { date: '2024-11-15', registrations: 12, cumulative: 40 },
        { date: '2024-11-20', registrations: 9, cumulative: 49 },
        { date: '2024-11-25', registrations: 6, cumulative: 55 },
        { date: '2024-11-28', registrations: 3, cumulative: 58 }
      ],
      attendanceBreakdown: [
        { category: 'Attended', value: 43, percentage: 74.1 },
        { category: 'No Show', value: 15, percentage: 25.9 }
      ],
      engagementMetrics: [
        { week: 'Week 1', chatMessages: 39, qaParticipation: 29, pollResponses: 64 },
        { week: 'Week 2', chatMessages: 33, qaParticipation: 19, pollResponses: 67 },
        { week: 'Week 3', chatMessages: 28, qaParticipation: 30, pollResponses: 43 },
        { week: 'Week 4', chatMessages: 33, qaParticipation: 23, pollResponses: 57 }
      ],
      timeBasedMetrics: [
        { timeSlot: '2:00-2:15', attendees: 43, engagementScore: 8.5 },
        { timeSlot: '2:15-2:30', attendees: 41, engagementScore: 9.2 },
        { timeSlot: '2:30-2:45', attendees: 40, engagementScore: 8.8 },
        { timeSlot: '2:45-3:00', attendees: 38, engagementScore: 7.9 },
        { timeSlot: '3:00-3:15', attendees: 36, engagementScore: 8.1 },
        { timeSlot: '3:15-3:30', attendees: 35, engagementScore: 7.6 },
        { timeSlot: '3:30-3:45', attendees: 33, engagementScore: 8.3 },
        { timeSlot: '3:45-4:00', attendees: 31, engagementScore: 9.1 }
      ],
      geographicData: [
        { country: 'United States', attendees: 25, percentage: 58.1 },
        { country: 'Canada', attendees: 8, percentage: 18.6 },
        { country: 'United Kingdom', attendees: 5, percentage: 11.6 },
        { country: 'Australia', attendees: 3, percentage: 7.0 },
        { country: 'Germany', attendees: 2, percentage: 4.7 }
      ],
      deviceBreakdown: [
        { device: 'Desktop', count: 28, percentage: 65.1 },
        { device: 'Mobile', count: 10, percentage: 23.3 },
        { device: 'Tablet', count: 5, percentage: 11.6 }
      ]
    };
    setAnalyticsData(mockData);
  }, [webinarId]);

  // Enhanced attendees data
  const attendees = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      attendance: "attended",
      joinTime: "2:05 PM",
      leaveTime: "3:58 PM",
      duration: 113,
      feedback: 5,
      recordingAccess: true,
      country: "United States",
      device: "Desktop",
      engagement: 8.7,
      chatMessages: 12,
      qAParticipation: 3,
      pollResponses: 5
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      email: "m.rodriguez@email.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      attendance: "attended",
      joinTime: "1:58 PM",
      leaveTime: "4:02 PM",
      duration: 124,
      feedback: 4,
      recordingAccess: true,
      country: "Canada",
      device: "Mobile",
      engagement: 7.9,
      chatMessages: 8,
      qAParticipation: 2,
      pollResponses: 4
    },
    {
      id: 3,
      name: "Emily Chen",
      email: "emily.chen@email.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      attendance: "no-show",
      joinTime: null,
      leaveTime: null,
      duration: 0,
      feedback: null,
      recordingAccess: true,
      country: "United States",
      device: null,
      engagement: 0,
      chatMessages: 0,
      qAParticipation: 0,
      pollResponses: 0
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      attendance: "attended",
      joinTime: "2:12 PM",
      leaveTime: "3:45 PM",
      duration: 93,
      feedback: 5,
      recordingAccess: false,
      country: "United Kingdom",
      device: "Tablet",
      engagement: 9.2,
      chatMessages: 15,
      qAParticipation: 4,
      pollResponses: 3
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face",
      attendance: "left-early",
      joinTime: "2:03 PM",
      leaveTime: "3:15 PM",
      duration: 72,
      feedback: 3,
      recordingAccess: true,
      country: "Australia",
      device: "Desktop",
      engagement: 6.8,
      chatMessages: 5,
      qAParticipation: 1,
      pollResponses: 2
    }
  ];

  const feedback = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      date: "November 28, 2024",
      comment: "Excellent webinar! The advanced patterns were explained clearly with great examples. Really appreciated the live coding session.",
      verified: true,
      category: "Content Quality"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 4,
      date: "November 28, 2024",
      comment: "Very informative session. Would have liked more time for Q&A. The performance optimization tips were gold!",
      verified: true,
      category: "Session Structure"
    },
    {
      id: 3,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      date: "November 28, 2024",
      comment: "Outstanding content and presentation. Will definitely attend more sessions. The real-world examples were perfect.",
      verified: true,
      category: "Overall Experience"
    },
    {
      id: 4,
      name: "Lisa Wang",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face",
      rating: 3,
      date: "November 28, 2024",
      comment: "Good content but the pace was a bit fast for beginners. Maybe consider different skill levels next time.",
      verified: true,
      category: "Difficulty Level"
    }
  ];

  const getAttendanceBadge = (attendance) => {
    const styles = {
      attended: 'bg-green-100 text-green-800 border-green-200',
      'no-show': 'bg-red-100 text-red-800 border-red-200',
      'left-early': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const labels = {
      attended: 'Attended',
      'no-show': 'No Show',
      'left-early': 'Left Early'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[attendance]}`}>
        {labels[attendance]}
      </span>
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handleExportData = () => {
    console.log('Exporting analytics data...');
    alert('Analytics data exported successfully!');
  };

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/instructor' },
    { label: 'My Webinars', href: '/instructor/my-webinars' },
    { label: 'Analytics', href: null }
  ];

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { webinar, analytics } = analyticsData;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation
          user={user}
          customBreadcrumbs={customBreadcrumbs}
          className="mb-6"
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={webinar.thumbnail}
                alt={webinar.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{webinar.title}</h1>
              <p className="text-text-secondary">{webinar.date} • {webinar.time} • {webinar.duration}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {webinar.status.charAt(0).toUpperCase() + webinar.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleExportData}
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
              <Button
                variant="default"
                onClick={() => navigate(`/instructor/recording-access/${webinar.id}`)}
                iconName="Settings"
                iconPosition="left"
              >
                Manage Access
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Registration Rate</p>
                <p className="text-2xl font-bold text-foreground">{analytics.registrationRate}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="UserPlus" size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.totalRegistrations} registered
            </p>
            <div className="mt-2 flex items-center text-xs">
              <Icon name="TrendingUp" size={12} className="text-green-600 mr-1" />
              <span className="text-green-600">+12% vs last webinar</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-foreground">{analytics.attendanceRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.totalAttendees} attended
            </p>
            <div className="mt-2 flex items-center text-xs">
              <Icon name="TrendingDown" size={12} className="text-red-600 mr-1" />
              <span className="text-red-600">-3% vs last webinar</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-foreground">{analytics.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Avg {analytics.avgViewTime} min watched
            </p>
            <div className="mt-2 flex items-center text-xs">
              <Icon name="TrendingUp" size={12} className="text-green-600 mr-1" />
              <span className="text-green-600">+8% vs last webinar</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction Score</p>
                <p className="text-2xl font-bold text-foreground">{analytics.satisfactionScore}/5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="Star" size={24} className="text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {renderStars(Math.round(analytics.satisfactionScore))}
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Icon name="TrendingUp" size={12} className="text-green-600 mr-1" />
              <span className="text-green-600">+0.2 vs last webinar</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Charts Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Performance Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Registration Timeline Chart */}
                <div className="border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Registration Timeline</h3>
                 <ResponsiveContainer width="100%" height={180}>
  <LineChart data={analyticsData.registrationTimeline}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="cumulative" stroke="#2563eb" strokeWidth={2} dot={false} />
    <Line type="monotone" dataKey="registrations" stroke="#10b981" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>

                  <p className="text-xs text-muted-foreground mt-2">Daily registrations from Nov 1-28, 2024</p>
                </div>
                
                {/* Attendance Breakdown */}
                <div className="border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Attendance Breakdown</h3>
                  <ResponsiveContainer width="100%" height={180}>
  <PieChart>
    <Pie
      data={analyticsData.attendanceBreakdown}
      dataKey="value"
      nameKey="category"
      outerRadius={70}
      innerRadius={40}
      label
    >
      {analyticsData.attendanceBreakdown.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={entry.category === 'Attended' ? '#22c55e' : '#ef4444'}
        />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>

                  <p className="text-xs text-muted-foreground mt-2">Total attendee distribution</p>
                </div>
              </div>

              {/* Engagement Metrics Chart */}
              <div className="mt-6 border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Engagement Metrics Over Time</h3>
                <ResponsiveContainer width="100%" height={200}>
  <BarChart data={analyticsData.engagementMetrics}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="week" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="chatMessages" fill="#3b82f6" />
    <Bar dataKey="qaParticipation" fill="#10b981" />
    <Bar dataKey="pollResponses" fill="#f59e0b" />
  </BarChart>
</ResponsiveContainer>

                <p className="text-xs text-muted-foreground mt-2">Chat messages, Q&A participation, and poll responses by week</p>
              </div>

              {/* Webinar Timeline Performance */}
              <div className="mt-6 border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Session Performance Timeline</h3>
                <ResponsiveContainer width="100%" height={200}>
  <LineChart data={analyticsData.timeBasedMetrics}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="timeSlot" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="attendees" stroke="#6366f1" strokeWidth={2} />
    <Line type="monotone" dataKey="engagementScore" stroke="#f97316" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

                <p className="text-xs text-muted-foreground mt-2">Attendee count and engagement throughout the session</p>
              </div>
            </div>

            {/* Enhanced Attendees Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Detailed Attendee Analytics</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportData()}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export List
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Attendee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Attendance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Engagement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Feedback
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {attendees.map((attendee) => (
                      <tr key={attendee.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={attendee.avatar}
                              alt={attendee.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="text-sm font-medium text-foreground">{attendee.name}</div>
                              <div className="text-xs text-muted-foreground">{attendee.email}</div>
                              <div className="text-xs text-muted-foreground">{attendee.device}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getAttendanceBadge(attendee.attendance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            {attendee.duration > 0 ? `${attendee.duration} min` : '-'}
                          </div>
                          {attendee.joinTime && (
                            <div className="text-xs text-muted-foreground">
                              {attendee.joinTime} - {attendee.leaveTime}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendee.engagement > 0 ? (
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {attendee.engagement}/10
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {attendee.chatMessages} msgs • {attendee.qAParticipation} Q&A
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No data</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendee.feedback ? (
                            <div className="flex items-center space-x-1">
                              {renderStars(attendee.feedback)}
                              <span className="text-xs text-muted-foreground ml-1">
                                {attendee.feedback}/5
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No feedback</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">{attendee.country}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Icon
                              name={attendee.recordingAccess ? "Check" : "X"}
                              size={12}
                              className={attendee.recordingAccess ? "text-success mr-1" : "text-error mr-1"}
                            />
                            Recording Access
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Revenue Summary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="DollarSign" size={20} className="mr-2" />
                Revenue Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Revenue:</span>
                  <span className="text-lg font-semibold text-foreground">
                    ${analytics.totalRevenue.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Registrations:</span>
                  <span className="text-sm text-foreground">{analytics.totalRegistrations}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg per registration:</span>
                  <span className="text-sm text-foreground">
                    ${(analytics.totalRevenue / analytics.totalRegistrations).toFixed(2)}
                  </span>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Instructor Earnings (80%):</span>
                    <span className="text-sm font-semibold text-foreground">
                      ${(analytics.totalRevenue * 0.8).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Globe" size={20} className="mr-2" />
                Geographic Distribution
              </h3>
              
              <div className="space-y-3">
                {analyticsData.geographicData.map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{country.country}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{country.attendees}</span>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Feedback Summary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="MessageSquare" size={20} className="mr-2" />
                Recent Feedback
              </h3>
              
              <div className="space-y-4">
                {feedback.slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium text-foreground">{review.name}</span>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-1">
                      {review.comment}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {review.category}
                      </span>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/instructor/webinar-feedback/${webinar.id}`)}
                className="w-full mt-4"
              >
                View All Feedback ({feedback.length})
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/instructor/edit-webinar/${webinar.id}`)}
                  iconName="Edit"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Edit Webinar
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate(`/webinar-details/${webinar.id}`)}
                  iconName="Eye"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  View Public Page
                </Button>
                <Button
      variant="outline"
      onClick={() => navigate(`/instructor/upload-resources/${webinar.id}`)}
      iconName="Upload"
      iconPosition="left"
      className="w-full justify-start"
    >
      Upload Resources
    </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/instructor/recording-management`)}
                  iconName="Video"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Manage Recordings
                </Button>

                <Button
                  variant="default"
                  onClick={() => navigate(`/instructor/recording-management/${webinarId}`)}
                  iconName="Users"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Recording Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarAnalytics;
