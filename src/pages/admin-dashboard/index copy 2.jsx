import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import MetricsCard from './components/MetricsCard';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Select from 'components/ui/Select';
import QuickActions from './components/QuickActions';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@eduzoom.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      department: "Platform Administration",
      lastLogin: "2 hours ago"
    };
    setUser(mockUser);
  }, []);

  // Enhanced metrics data with attractive colors (no red)
  const metricsData = [
    {
      title: "Live Webinars",
      value: "24",
      change: "+3 this week",
      changeType: "positive",
      icon: "Radio",
      color: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
      textColor: "text-white",
      iconBg: "bg-white/20",
      shadowColor: "shadow-blue-500/30"
    },
    {
      title: "Recorded Sessions",
      value: "132",
      change: "+8 this month",
      changeType: "positive",
      icon: "PlayCircle",
      color: "bg-gradient-to-br from-violet-500 via-purple-600 to-purple-700",
      textColor: "text-white",
      iconBg: "bg-white/20",
      shadowColor: "shadow-purple-500/30"
    },
    {
      title: "Active Instructors",
      value: "47",
      change: "+5 new",
      changeType: "positive",
      icon: "GraduationCap",
      color: "bg-gradient-to-br from-emerald-500 via-green-600 to-green-700",
      textColor: "text-white",
      iconBg: "bg-white/20",
      shadowColor: "shadow-green-500/30"
    },
    {
      title: "Total Revenue",
      value: "$28,450",
      change: "+15.3%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "bg-gradient-to-br from-cyan-500 via-teal-600 to-teal-700",
      textColor: "text-white",
      iconBg: "bg-white/20",
      shadowColor: "shadow-teal-500/30"
    },
    {
      title: "Enrolled Students",
      value: "1,247",
      change: "+89 today",
      changeType: "positive",
      icon: "Users",
      color: "bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600",
      textColor: "text-white",
      iconBg: "bg-white/20",
      shadowColor: "shadow-amber-500/30"
    },
    {
      title: "Support Tickets",
      value: "12",
      change: "3 pending",
      changeType: "neutral",
      icon: "MessageSquare",
      color: "bg-gradient-to-br from-indigo-500 via-blue-600 to-blue-700",
      textColor: "text-white",
      iconBg: "bg-white/20",
      shadowColor: "shadow-indigo-500/30"
    }
  ];

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
    { name: 'Technology', value: 35, color: '#3B82F6' },
    { name: 'Business', value: 25, color: '#10B981' },
    { name: 'Design', value: 20, color: '#8B5CF6' },
    { name: 'Marketing', value: 12, color: '#F59E0B' },
    { name: 'Others', value: 8, color: '#06B6D4' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage webinars, instructors, and platform operations
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <span>All services operational</span>
              </div>
            </div>
            
            {/* Compact User Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-10 h-10 rounded-lg object-cover border-2 border-blue-200"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.department}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Compact Metrics Cards with Animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {metricsData?.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className={`${metric?.color} ${metric?.shadowColor} shadow-xl rounded-2xl p-6 transform transition-all duration-300 hover:shadow-2xl border border-white/20 backdrop-blur-sm relative overflow-hidden group`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                
                {/* Compact Card Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                      className={`${metric?.iconBg} p-3 rounded-xl backdrop-blur-sm`}
                    >
                      <Icon 
                        name={metric?.icon} 
                        size={20} 
                        className="text-white drop-shadow-sm" 
                      />
                    </motion.div>
                    <div className="text-right">
                      <div className="text-xs text-white/80 uppercase tracking-wider font-semibold">
                        {metric?.title}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <motion.h3
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`text-3xl font-black ${metric?.textColor} tracking-tight`}
                    >
                      {metric?.value}
                    </motion.h3>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        metric?.changeType === 'positive' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/10 text-white/80'
                      } backdrop-blur-sm border border-white/20`}
                    >
                      {metric?.changeType === 'positive' && (
                        <Icon name="TrendingUp" size={12} className="mr-1" />
                      )}
                      {metric?.change}
                    </motion.div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Compact Time Range Filter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg"
              >
                <Icon name="BarChart3" size={16} className="text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Platform Analytics</h3>
                <p className="text-gray-600 text-sm">Comprehensive platform insights</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
              <Select
                value={timeRange}
                onChange={setTimeRange}
                options={timeRangeOptions}
                className="border-0 focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </motion.div>

          {/* Compact Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends Card */}
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
                  <BarChart data={revenueData}>
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

            {/* User Growth Card */}
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
                  <LineChart data={userGrowthData}>
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

          {/* Compact Category Distribution and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -2 }}
              className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Webinar Categories</h4>
                  <p className="text-gray-600 text-sm">Content distribution</p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl shadow-lg"
                >
                  <Icon name="PieChart" size={20} className="text-white" />
                </motion.div>
              </div>
              <div className="h-64 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3">
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
                        backgroundColor: 'white', 
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData?.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/30 hover:bg-white/80 transition-all duration-300"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className="w-3 h-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: category?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-800 truncate">{category?.name}</span>
                      <span className="text-sm font-bold text-gray-600 ml-1">{category?.value}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Compact Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <QuickActions />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
