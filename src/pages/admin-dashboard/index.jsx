import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import MetricsCard from './components/MetricsCard';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Select from 'components/ui/Select';
import { motion } from 'framer-motion';
import { useAuth } from 'contexts/AuthContext';
import axiosInstance from 'config/axiosInstance';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [dashboardData, setDashboardData] = useState({
    metrics: [],
    revenueData: [],
    userGrowthData: [],
    categoryData: [],
    topInstructors: [],
    recentActivities: []
  });

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const dashboardResponse = await axiosInstance.get(`/admin/dashboard/?time_range=${timeRange}`);
        const data = dashboardResponse.data;
        
        console.log('📊 Dashboard API Response:', data);

        // Transform API data to component format
        const transformedData = transformDashboardData(data);
        setDashboardData(transformedData);

      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        
        if (err.response?.status === 403) {
          setError('Access denied. Admin permissions required.');
        } else if (err.response?.status === 401) {
          setError('Authentication required. Please sign in.');
        } else if (err.response?.status === 404) {
          setError('Dashboard endpoint not found. Please check backend configuration.');
        } else {
          setError('Failed to load dashboard data. Please try again.');
        }
        
        // Fallback to mock data for development
        setDashboardData(getMockDashboardData());
        
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user, token, timeRange]);

  // Transform API data to dashboard format
  const transformDashboardData = (apiData) => {
    console.log('🔄 Transforming dashboard data:', apiData);

    const metrics = apiData.metrics || {};
    
    return {
      metrics: [
        {
          title: "Live Webinars",
          value: metrics.live_webinars?.value?.toString() || metrics.live_webinars?.toString() || "0",
          change: metrics.live_webinars?.change || "+0 this week",
          changeType: "positive",
          icon: "Radio",
          color: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
          textColor: "text-white"
        },
        {
          title: "Recorded Sessions",
          value: metrics.recorded_webinars?.value?.toString() || metrics.recorded_webinars?.toString() || "0",
          change: metrics.recorded_webinars?.change || "+0 this month",
          changeType: "positive",
          icon: "PlayCircle",
          color: "bg-gradient-to-br from-violet-500 via-purple-600 to-purple-700",
          textColor: "text-white"
        },
        // {
        //   title: "Active Instructors",
        //   value: metrics.active_instructors?.value?.toString() || metrics.active_instructors?.toString() || "0",
        //   change: metrics.active_instructors?.change || "+0 new",
        //   changeType: "positive",
        //   icon: "GraduationCap",
        //   color: "bg-gradient-to-br from-green-500 to-emerald-600",
        //   textColor: "text-white"
        // },
        {
          title: "Total Revenue",
          value: `$${metrics.total_revenue?.value?.toLocaleString() || metrics.total_revenue?.toLocaleString() || '0'}`,
          change: metrics.total_revenue?.change || "+0%",
          changeType: "positive",
          icon: "TrendingUp",
          color: "bg-gradient-to-br from-cyan-500 via-teal-600 to-teal-700",
          textColor: "text-white"
        },
        {
          title: "Enrolled Students",
          value: metrics.total_enrollments?.value?.toLocaleString() || metrics.total_enrollments?.toLocaleString() || "0",
          change: metrics.total_enrollments?.change || "+0 today",
          changeType: "positive",
          icon: "Users",
          color: "bg-gradient-to-br from-orange-500 to-amber-600",
          textColor: "text-white"
        }
        // ❌ REMOVED: Support Tickets
      ],
      
      revenueData: apiData.revenue_trends?.map(item => ({
        month: formatMonth(item.month),
        revenue: item.revenue || 0,
        webinars: item.transactions || 0
      })) || [],
      
      userGrowthData: apiData.user_growth?.map(item => ({
        month: formatMonth(item.month),
        attendees: item.attendees || 0,
        instructors: item.instructors || 0
      })) || [],
      
      categoryData: apiData.category_distribution?.map(item => ({
        name: item.name,
        value: item.percentage,
        color: getCategoryColor(item.name)
      })) || [],
      
      topInstructors: apiData.top_instructors?.map(instructor => ({
        id: instructor.id,
        name: instructor.full_name || instructor.name,
        avatar: instructor.profile_picture || instructor.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        revenue: instructor.total_revenue || 0,
        webinars: instructor.webinar_count || 0,
        students: instructor.student_count || 0,
        rating: instructor.average_rating || 0
      })) || [],
      
      recentActivities: apiData.recent_activities || []
    };
  };

  // Helper functions
  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    if (monthStr.includes('-')) {
      const date = new Date(monthStr + '-01');
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
    if (monthStr.includes(' ')) {
      const monthName = monthStr.split(' ')[0];
      return monthName.substring(0, 3);
    }
    return monthStr;
  };

  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'Technology': '#2563EB',
      'Business': '#059669',
      'Design': '#F59E0B',
      'Marketing': '#DC2626',
      'Finance': '#7C3AED',
      'Health': '#10B981',
      'Education': '#F97316',
      'Banking & Insurance': '#2563EB',
      'Others': '#64748B'
    };
    return colorMap[categoryName] || '#64748B';
  };

  // Mock data fallback for development/testing
  const getMockDashboardData = () => {
    return {
      metrics: [
        {
          title: "Live Webinars",
          value: "24",
          change: "+3 this week",
          changeType: "positive",
          icon: "Radio",
          color: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
          textColor: "text-white"
        },
        {
          title: "Recorded Sessions",
          value: "132",
          change: "+8 this month",
          changeType: "positive",
          icon: "PlayCircle",
          color: "bg-gradient-to-br from-violet-500 via-purple-600 to-purple-700",
          textColor: "text-white"
        },
        // {
        //   title: "Active Instructors",
        //   value: "47",
        //   change: "+5 new",
        //   changeType: "positive",
        //   icon: "GraduationCap",
        //   color: "bg-gradient-to-br from-green-500 to-emerald-600",
        //   textColor: "text-white"
        // },
        {
          title: "Total Revenue",
          value: "$28,450",
          change: "+15.3%",
          changeType: "positive",
          icon: "TrendingUp",
          color: "bg-gradient-to-br from-cyan-500 via-teal-600 to-teal-700",
          textColor: "text-white"
        },
        {
          title: "Enrolled Students",
          value: "1,247",
          change: "+89 today",
          changeType: "positive",
          icon: "Users",
          color: "bg-gradient-to-br from-orange-500 to-amber-600",
          textColor: "text-white"
        }
        // ❌ REMOVED: Support Tickets
      ],
      revenueData: [
        { month: 'Jan', revenue: 12500, webinars: 45 },
        { month: 'Feb', revenue: 18200, webinars: 52 },
        { month: 'Mar', revenue: 15800, webinars: 48 },
        { month: 'Apr', revenue: 22100, webinars: 61 },
        { month: 'May', revenue: 19500, webinars: 55 },
        { month: 'Jun', revenue: 25300, webinars: 68 },
        { month: 'Jul', revenue: 28900, webinars: 72 },
        { month: 'Aug', revenue: 31200, webinars: 78 }
      ],
      userGrowthData: [
        { month: 'Jan', attendees: 1200, instructors: 45 },
        { month: 'Feb', attendees: 1450, instructors: 52 },
        { month: 'Mar', attendees: 1680, instructors: 58 },
        { month: 'Apr', attendees: 1920, instructors: 65 },
        { month: 'May', attendees: 2150, instructors: 71 },
        { month: 'Jun', attendees: 2380, instructors: 78 },
        { month: 'Jul', attendees: 2620, instructors: 84 },
        { month: 'Aug', attendees: 2890, instructors: 91 }
      ],
      categoryData: [
        { name: 'Technology', value: 35, color: '#2563EB' },
        { name: 'Business', value: 25, color: '#059669' },
        { name: 'Design', value: 20, color: '#F59E0B' },
        { name: 'Marketing', value: 12, color: '#DC2626' },
        { name: 'Others', value: 8, color: '#64748B' }
      ],
      topInstructors: [
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
          revenue: 15420,
          webinars: 24,
          students: 1250,
          rating: 4.8
        },
        {
          id: 2,
          name: "Prof. Michael Chen",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          revenue: 12800,
          webinars: 18,
          students: 980,
          rating: 4.7
        },
        {
          id: 3,
          name: "Dr. Emily Rodriguez",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
          revenue: 11200,
          webinars: 16,
          students: 850,
          rating: 4.9
        }
      ]
    };
  };

  // Time range options
  const timeRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" }
  ];

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  // Refresh dashboard data
  const refreshData = async () => {
    setLoading(true);
    
    try {
      const response = await axiosInstance.get(`/admin/dashboard/?time_range=${timeRange}`);
      const transformedData = transformDashboardData(response.data);
      setDashboardData(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to instructor details
  const handleInstructorClick = (instructorId) => {
    navigate(`/admin/instructors/${instructorId}`);
  };

  // Check authentication and permissions
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4"
        >
          <Icon name="Lock" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in with admin credentials to access the dashboard.</p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  if (user?.role !== 'admin' && user?.role !== 'instructor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4"
        >
          <Icon name="ShieldAlert" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Admin permissions required to view this dashboard.</p>
          <Button onClick={() => navigate('/')} className="w-full">
            Return Home
          </Button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading && !dashboardData.metrics.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching latest analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">
                Manage webinars, instructors, and platform operations
              </p>
              {user && (
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back, {user.name || user.full_name || user.email}
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-3">
              <Select
                options={timeRangeOptions}
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="min-w-[150px]"
              />
              <Button
                onClick={refreshData}
                disabled={loading}
                variant="outline"
                className="flex items-center justify-center"
              >
                <Icon name={loading ? "Loader2" : "RefreshCw"} size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
            >
              <Icon name="AlertCircle" size={20} className="text-red-500" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error Loading Dashboard</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button 
                onClick={refreshData} 
                size="sm" 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="space-y-8">
          {/* Metrics Overview + Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {/* Standard Metrics (5 cards) */}
            {dashboardData.metrics.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                color={metric.color}
                textColor={metric.textColor}
              />
            ))}

            {/* Quick Action: Create Webinar */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 rounded-2xl p-6 shadow-lg cursor-pointer"
              onClick={() => navigate('/admin/create')}
            >
              <div className="flex flex-col items-center text-center h-full justify-center">
                <div className="bg-white/20 p-3 rounded-xl mb-3 backdrop-blur-sm">
                  <Icon name="Plus" size={24} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Create Webinar</h3>
                <p className="text-purple-100 text-sm">Launch a new live or recorded session</p>
              </div>
            </motion.div>

            {/* Quick Action: View Webinars */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-2xl p-6 shadow-lg cursor-pointer"
              onClick={() => navigate('/admin/webinars')}
            >
              <div className="flex flex-col items-center text-center h-full justify-center">
                <div className="bg-white/20 p-3 rounded-xl mb-3 backdrop-blur-sm">
                  <Icon name="Video" size={24} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">View Webinars</h3>
                <p className="text-emerald-100 text-sm">Manage all your webinar sessions</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Analytics Section Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Platform Analytics</h3>
            <span className="text-sm text-gray-500">
              Showing data for {timeRangeOptions.find(opt => opt.value === timeRange)?.label?.toLowerCase()}
            </span>
          </div>

          {/* Revenue Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends Chart */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -2 }}
              className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Revenue Trends</h4>
                  <p className="text-gray-600 text-sm">Monthly performance</p>
                </div>
                <motion.div
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg"
                >
                  <Icon name="TrendingUp" size={20} className="text-white" />
                </motion.div>
              </div>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
                        fontSize: '12px'
                      }}
                      formatter={(value, name) => [
                        name === 'revenue' ? `$${value.toLocaleString()}` : value,
                        name === 'revenue' ? 'Revenue' : 'Webinars'
                      ]}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="#10B981" 
                      radius={[6, 6, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* User Growth Chart */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -2 }}
              className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">User Growth</h4>
                  <p className="text-gray-600 text-sm">Platform expansion</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg"
                >
                  <Icon name="Users" size={20} className="text-white" />
                </motion.div>
              </div>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
                        fontSize: '12px'
                      }}
                      formatter={(value, name) => [
                        value.toLocaleString(),
                        name === 'attendees' ? 'Attendees' : 'Instructors'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="attendees" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#EBF8FF' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="instructors" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#ECFDF5' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;