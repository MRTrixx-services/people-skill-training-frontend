import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assignedWebinars, setAssignedWebinars] = useState([]);

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 'speaker_001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@peopleskilltraining.com',
      role: 'speaker',
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      specialization: 'Compliance & Risk Management',
      experience: '8 years',
      rating: 4.8,
      department: 'Regulatory Affairs'
    };
    setUser(mockUser);

    // Mock assigned webinars by admin (removed priority)
    const mockWebinars = [
      {
        id: 'webinar_001',
        title: 'ISO 27001 Implementation Workshop',
        description: 'Comprehensive workshop on implementing ISO 27001 information security management system.',
        date: '2025-09-15T14:00:00Z',
        duration: 120,
        attendees: 45,
        maxAttendees: 100,
        status: 'upcoming',
        category: 'Information Security',
        zoomLink: 'https://zoom.us/j/123456789',
        assignedBy: 'Admin Team',
        materials: ['Presentation slides', 'Compliance checklist', 'Reference guide']
      },
      {
        id: 'webinar_002',
        title: 'GDPR Compliance Masterclass',
        description: 'Advanced session on GDPR requirements, implementation strategies, and audit preparation.',
        date: '2025-09-18T10:00:00Z',
        duration: 90,
        attendees: 67,
        maxAttendees: 80,
        status: 'upcoming',
        category: 'Data Protection',
        zoomLink: 'https://zoom.us/j/987654321',
        assignedBy: 'Admin Team',
        materials: ['GDPR Guidelines', 'Case studies', 'Assessment tools']
      },
      {
        id: 'webinar_003',
        title: 'Risk Management Framework',
        description: 'Deep dive into enterprise risk management frameworks and best practices.',
        date: '2025-09-22T16:30:00Z',
        duration: 105,
        attendees: 32,
        maxAttendees: 60,
        status: 'upcoming',
        category: 'Risk Management',
        zoomLink: 'https://zoom.us/j/456789123',
        assignedBy: 'Admin Team',
        materials: ['Framework templates', 'Risk assessment tools', 'Industry reports']
      },
      {
        id: 'webinar_005',
        title: 'Cybersecurity Best Practices',
        description: 'Essential cybersecurity practices for modern organizations and threat prevention strategies.',
        date: '2025-09-25T11:00:00Z',
        duration: 75,
        attendees: 28,
        maxAttendees: 50,
        status: 'upcoming',
        category: 'Cybersecurity',
        zoomLink: 'https://zoom.us/j/321654987',
        assignedBy: 'Admin Team',
        materials: ['Security protocols', 'Best practices guide', 'Incident response plan']
      },
      {
        id: 'webinar_006',
        title: 'Audit Preparation Workshop',
        description: 'Complete guide to preparing for compliance audits and documentation requirements.',
        date: '2025-09-28T15:00:00Z',
        duration: 95,
        attendees: 41,
        maxAttendees: 75,
        status: 'upcoming',
        category: 'Audit & Compliance',
        zoomLink: 'https://zoom.us/j/654987321',
        assignedBy: 'Admin Team',
        materials: ['Audit checklist', 'Documentation templates', 'Process guidelines']
      },
      {
        id: 'webinar_004',
        title: 'SOX People Skill Training',
        description: 'Sarbanes-Oxley Act compliance requirements and internal controls implementation.',
        date: '2025-09-12T09:00:00Z',
        duration: 60,
        attendees: 89,
        maxAttendees: 120,
        status: 'completed',
        category: 'Financial Compliance',
        zoomLink: 'https://zoom.us/j/789123456',
        assignedBy: 'Admin Team',
        materials: ['SOX requirements', 'Control matrices', 'Testing procedures'],
        feedback: 'Excellent session with great participant engagement'
      }
    ];
    setAssignedWebinars(mockWebinars);
  }, []);

  const handleJoinWebinar = (webinar) => {
    console.log('Joining webinar:', webinar);
    window.open(webinar?.zoomLink, '_blank');
  };

  const handleViewDetails = (webinar) => {
    navigate('/webinar-details', { state: { webinar } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      time: date.toLocaleString('default', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Information Security': 'from-purple-500 to-violet-500',
      'Data Protection': 'from-blue-500 to-cyan-500',
      'Risk Management': 'from-orange-500 to-amber-500',
      'Financial Compliance': 'from-emerald-500 to-teal-500',
      'Regulatory Affairs': 'from-indigo-500 to-purple-500',
      'Cybersecurity': 'from-cyan-500 to-blue-500',
      'Audit & Compliance': 'from-green-500 to-emerald-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  const upcomingWebinars = assignedWebinars.filter(w => w.status === 'upcoming');
  const completedWebinars = assignedWebinars.filter(w => w.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* <BreadcrumbNavigation user={user} /> */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Speaker Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Your assigned webinars and People Skill Training sessions
              </p>
            </div>
            
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 sm:mt-0 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-blue-200"
                />
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.specialization}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Assigned Webinars</p>
                <p className="text-3xl font-bold">{assignedWebinars.length}</p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
              >
                <Icon name="Calendar" size={24} className="text-white" />
              </motion.div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Upcoming Sessions</p>
                <p className="text-3xl font-bold">{upcomingWebinars.length}</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
              >
                <Icon name="Clock" size={24} className="text-white" />
              </motion.div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Completed Sessions</p>
                <p className="text-3xl font-bold">{completedWebinars.length}</p>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
              >
                <Icon name="CheckCircle" size={24} className="text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Webinars - Optimized spacing */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3"
            >
              <Icon name="Calendar" size={16} className="text-white" />
            </motion.div>
            Upcoming Webinars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingWebinars.map((webinar, index) => {
              const dateInfo = formatDate(webinar.date);
              return (
                <motion.div
                  key={webinar.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  {/* Category Header - Reduced height */}
                  <div className={`h-1 bg-gradient-to-r ${getCategoryColor(webinar.category)}`}></div>
                  
                  <div className="p-4">
                    {/* Category Badge and Title - Reduced spacing */}
                    <div className="mb-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(webinar.category)} mb-2`}>
                        <Icon name="Tag" size={10} className="mr-1" />
                        {webinar.category}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 leading-tight">
                        {webinar.title}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {webinar.description}
                      </p>
                    </div>

                    {/* Date and Stats - Compact layout */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-100">
                        <div className="text-lg font-bold text-blue-600">{dateInfo.day}</div>
                        <div className="text-xs text-blue-500 font-medium">{dateInfo.month}</div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center justify-end text-xs text-gray-600">
                          <Icon name="Clock" size={12} className="mr-1 text-blue-500" />
                          <span className="font-medium">{webinar.duration} min</span>
                        </div>
                        <div className="flex items-center justify-end text-xs text-gray-600">
                          <Icon name="Users" size={12} className="mr-1 text-emerald-500" />
                          <span className="font-medium">{webinar.attendees}/{webinar.maxAttendees}</span>
                        </div>
                        <div className="text-xs text-gray-500">{dateInfo.time}</div>
                      </div>
                    </div>

                    {/* Materials - Compact */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Materials Available:</p>
                      <div className="flex flex-wrap gap-1">
                        {webinar.materials.slice(0, 2).map((material, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200 flex items-center">
                            <Icon name="FileText" size={8} className="mr-1" />
                            {material.length > 15 ? material.substring(0, 15) + '...' : material}
                          </span>
                        ))}
                        {webinar.materials.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{webinar.materials.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons - Reduced size */}
                    <div className="flex space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          onClick={() => handleJoinWebinar(webinar)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-medium py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-xs"
                        >
                          <Icon name="Video" size={12} className="mr-1" />
                          Join
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleViewDetails(webinar)}
                          className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-2 px-3 rounded-lg transition-all duration-300"
                        >
                          <Icon name="Info" size={12} />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recently Completed - Compact version */}
        {completedWebinars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3"
              >
                <Icon name="CheckCircle" size={16} className="text-white" />
              </motion.div>
              Recently Completed
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedWebinars.map((webinar, index) => (
                <motion.div
                  key={webinar.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(webinar.category)} mb-2`}>
                    <Icon name="CheckCircle" size={10} className="mr-1" />
                    Completed
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{webinar.title}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{webinar.feedback}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Icon name="Calendar" size={10} className="mr-1" />
                    {formatDate(webinar.date).day} {formatDate(webinar.date).month}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {upcomingWebinars.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ 
                y: [-8, 8, -8],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
            >
              <Icon name="Calendar" size={32} className="text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Webinars</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              You don't have any webinars assigned yet. New sessions will appear here when assigned by the admin team.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
