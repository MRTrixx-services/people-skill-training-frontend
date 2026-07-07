import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const MyWebinars = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const itemsPerPageOptions = [
    { value: '8', label: '8 per page' },
    { value: '12', label: '12 per page' },
    { value: '16', label: '16 per page' },
    { value: '24', label: '24 per page' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateFilterOptions = [
    { value: '', label: 'All Dates' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'past', label: 'Past' }
  ];

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 'speaker_001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@peopleskilltraining.com',
      role: 'speaker',
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      specialization: 'Compliance & Risk Management'
    };
    setUser(mockUser);
  }, []);

  // Extended mock webinars for better pagination demo
  const webinars = [
    {
      id: 1,
      title: "ISO 27001 Implementation Workshop",
      date: "2025-09-15T14:00:00Z",
      status: "upcoming",
      enrolled: 47,
      maxCapacity: 100,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
      category: "Information Security",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/123456789",
      description: "Comprehensive workshop on implementing ISO 27001 information security management system.",
      duration: 120
    },
    {
      id: 2,
      title: "GDPR Compliance Masterclass",
      date: "2025-09-18T10:00:00Z",
      status: "upcoming",
      enrolled: 67,
      maxCapacity: 80,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
      category: "Data Protection",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/987654321",
      description: "Advanced session on GDPR requirements and implementation strategies.",
      duration: 90
    },
    {
      id: 3,
      title: "Risk Management Framework",
      date: "2025-09-22T16:30:00Z",
      status: "upcoming",
      enrolled: 32,
      maxCapacity: 60,
      thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=300&h=200&fit=crop",
      category: "Risk Management",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/456789123",
      description: "Deep dive into enterprise risk management frameworks and best practices.",
      duration: 105
    },
    {
      id: 4,
      title: "SOX People Skill Training",
      date: "2025-09-12T09:00:00Z",
      status: "completed",
      enrolled: 89,
      maxCapacity: 120,
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
      category: "Financial Compliance",
      assignedBy: "Admin Team",
      description: "Sarbanes-Oxley Act compliance requirements and internal controls.",
      duration: 60
    },
    {
      id: 5,
      title: "Cybersecurity Best Practices",
      date: "2025-09-25T11:00:00Z",
      status: "upcoming",
      enrolled: 28,
      maxCapacity: 50,
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      category: "Cybersecurity",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/321654987",
      description: "Essential cybersecurity practices for modern organizations.",
      duration: 75
    },
    // Additional webinars for pagination
    {
      id: 6,
      title: "PCI DSS Compliance Framework",
      date: "2025-09-30T13:00:00Z",
      status: "upcoming",
      enrolled: 34,
      maxCapacity: 70,
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      category: "Financial Compliance",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/111222333",
      description: "Payment Card Industry Data Security Standard implementation.",
      duration: 95
    },
    {
      id: 7,
      title: "HIPAA Privacy and Security",
      date: "2025-10-05T15:30:00Z",
      status: "upcoming",
      enrolled: 52,
      maxCapacity: 90,
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
      category: "Healthcare Compliance",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/444555666",
      description: "Healthcare Information Portability and Accountability Act compliance.",
      duration: 85
    },
    {
      id: 8,
      title: "Cloud Security Governance",
      date: "2025-10-10T14:00:00Z",
      status: "upcoming",
      enrolled: 41,
      maxCapacity: 65,
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
      category: "Cybersecurity",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/777888999",
      description: "Cloud security governance and compliance best practices.",
      duration: 110
    },
    {
      id: 9,
      title: "Data Privacy Impact Assessment",
      date: "2025-10-15T11:00:00Z",
      status: "upcoming",
      enrolled: 38,
      maxCapacity: 55,
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
      category: "Data Protection",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/123123123",
      description: "Conducting effective data privacy impact assessments.",
      duration: 80
    },
    {
      id: 10,
      title: "Business Continuity Planning",
      date: "2025-10-20T16:00:00Z",
      status: "upcoming",
      enrolled: 29,
      maxCapacity: 45,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      category: "Risk Management",
      assignedBy: "Admin Team",
      zoomLink: "https://zoom.us/j/456456456",
      description: "Developing robust business continuity and disaster recovery plans.",
      duration: 100
    },
    // Add more completed webinars
    {
      id: 11,
      title: "Anti-Money Laundering Training",
      date: "2025-08-15T10:00:00Z",
      status: "completed",
      enrolled: 73,
      maxCapacity: 85,
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
      category: "Financial Compliance",
      assignedBy: "Admin Team",
      description: "AML regulations and compliance procedures.",
      duration: 70
    },
    {
      id: 12,
      title: "Environmental Compliance Standards",
      date: "2025-08-20T14:30:00Z",
      status: "completed",
      enrolled: 45,
      maxCapacity: 60,
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
      category: "Environmental Compliance",
      assignedBy: "Admin Team",
      description: "Environmental regulations and sustainability compliance.",
      duration: 90
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
      live: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-orange-100 text-orange-800 border-orange-200'
    };

    const labels = {
      upcoming: 'Upcoming',
      live: 'Live',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Information Security': 'from-purple-500 to-violet-500',
      'Data Protection': 'from-blue-500 to-cyan-500',
      'Risk Management': 'from-orange-500 to-amber-500',
      'Financial Compliance': 'from-emerald-500 to-teal-500',
      'Cybersecurity': 'from-cyan-500 to-blue-500',
      'Healthcare Compliance': 'from-pink-500 to-rose-500',
      'Environmental Compliance': 'from-green-500 to-emerald-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      full: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };
  };

  const handleJoinWebinar = (webinar) => {
    if (webinar.zoomLink) {
      window.open(webinar.zoomLink, '_blank');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort webinars
  const filteredWebinars = webinars.filter(webinar => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webinar.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || webinar.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter) {
      const webinarDate = new Date(webinar.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'upcoming':
          matchesDate = webinarDate > now;
          break;
        case 'this-week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = webinarDate >= weekStart && webinarDate <= weekEnd;
          break;
        case 'this-month':
          matchesDate = webinarDate.getMonth() === now.getMonth() && 
                       webinarDate.getFullYear() === now.getFullYear();
          break;
        case 'past':
          matchesDate = webinarDate < now;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort webinars
  const sortedWebinars = filteredWebinars.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'enrolled':
        aValue = a.enrolled;
        bValue = b.enrolled;
        break;
      case 'duration':
        aValue = a.duration;
        bValue = b.duration;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, itemsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedWebinars.length / parseInt(itemsPerPage));
  const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
  const paginatedWebinars = sortedWebinars.slice(startIndex, startIndex + parseInt(itemsPerPage));

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                My Assigned Webinars
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                View and join your assigned People Skill Training sessions
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

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                type="text"
                placeholder="Search webinars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 max-w-md"
                iconName="Search"
              />
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full sm:w-40"
              />
              <Select
                options={dateFilterOptions}
                value={dateFilter}
                onChange={setDateFilter}
                className="w-full sm:w-40"
              />
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3 py-2"
                >
                  <Icon name="Grid3x3" size={16} />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="px-3 py-2"
                >
                  <Icon name="List" size={16} />
                </Button>
              </div>
              
              <Select
                options={itemsPerPageOptions}
                value={itemsPerPage}
                onChange={setItemsPerPage}
                className="w-40"
              />
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {sortedWebinars.length} webinar{sortedWebinars.length !== 1 ? 's' : ''} found
            </h2>
            {totalPages > 0 && (
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          {paginatedWebinars.length > 0 ? (
            viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedWebinars.map((webinar, index) => {
                  const dateInfo = formatDate(webinar.date);
                  return (
                    <motion.div
                      key={webinar.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden group hover:shadow-xl transition-all duration-300"
                    >
                      {/* Category Header */}
                      <div className={`h-2 bg-gradient-to-r ${getCategoryColor(webinar.category)}`}></div>
                      
                      {/* Image */}
                      <div className="relative">
                        <Image
                          src={webinar.thumbnail}
                          alt={webinar.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(webinar.status)}
                        </div>
                        <div className="absolute top-3 left-3">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(webinar.category)}`}>
                            <Icon name="Tag" size={10} className="mr-1" />
                            {webinar.category}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        {/* Title and Description */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                          {webinar.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {webinar.description}
                        </p>

                        {/* Date and Time */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                            <div className="text-xl font-bold text-blue-600">{dateInfo.day}</div>
                            <div className="text-xs text-blue-500 font-medium">{dateInfo.month}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{dateInfo.time}</div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Icon name="Users" size={14} className="mr-1 text-emerald-500" />
                              {webinar.enrolled}/{webinar.maxCapacity}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Enrollment</span>
                            <span>{Math.round((webinar.enrolled / webinar.maxCapacity) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(webinar.enrolled / webinar.maxCapacity) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Assigned By */}
                        <div className="mb-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <Icon name="User" size={12} className="mr-1" />
                            Assigned by {webinar.assignedBy}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          {webinar.status === 'upcoming' && webinar.zoomLink && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1"
                            >
                              <Button
                                onClick={() => handleJoinWebinar(webinar)}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-medium py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                              >
                                <Icon name="Video" size={14} className="mr-1" />
                                Join Session
                              </Button>
                            </motion.div>
                          )}
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={() => navigate(`/webinar-details/${webinar.id}`)}
                              className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-2 px-3 rounded-lg transition-all duration-300"
                            >
                              <Icon name="Eye" size={14} />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Responsive Table View */
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <tr>
                          <th className="px-6 py-4 text-left whitespace-nowrap">
                            <button
                              onClick={() => handleSort('title')}
                              className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors duration-200"
                            >
                              <span>Title</span>
                              {sortBy === 'title' && (
                                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-blue-600" />
                              )}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left whitespace-nowrap">
                            <button
                              onClick={() => handleSort('date')}
                              className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors duration-200"
                            >
                              <span>Date & Time</span>
                              {sortBy === 'date' && (
                                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-blue-600" />
                              )}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left whitespace-nowrap">
                            <button
                              onClick={() => handleSort('enrolled')}
                              className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors duration-200"
                            >
                              <span>Enrolled</span>
                              {sortBy === 'enrolled' && (
                                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-blue-600" />
                              )}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left whitespace-nowrap">
                            <button
                              onClick={() => handleSort('duration')}
                              className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors duration-200"
                            >
                              <span>Duration</span>
                              {sortBy === 'duration' && (
                                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-blue-600" />
                              )}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedWebinars.map((webinar, index) => {
                          const dateInfo = formatDate(webinar.date);
                          return (
                            <motion.tr
                              key={webinar.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * index }}
                              className="hover:bg-blue-50/50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={webinar.thumbnail}
                                      alt={webinar.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                      {webinar.title}
                                    </div>
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(webinar.category)} mt-1`}>
                                      <Icon name="Tag" size={8} className="mr-1" />
                                      {webinar.category}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">{dateInfo.full}</div>
                                <div className="text-xs text-gray-500">{dateInfo.time}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(webinar.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">
                                  {webinar.enrolled}/{webinar.maxCapacity}
                                </div>
                                <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(webinar.enrolled / webinar.maxCapacity) * 100}%` }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {webinar.duration} min
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  {webinar.status === 'upcoming' && webinar.zoomLink && (
                                    <Button
                                      onClick={() => handleJoinWebinar(webinar)}
                                      size="sm"
                                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                                    >
                                      <Icon name="Video" size={14} className="mr-1" />
                                      Join
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() => navigate(`/webinar-details/${webinar.id}`)}
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Icon name="Eye" size={14} />
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  <div className="p-4 space-y-4">
                    {paginatedWebinars.map((webinar, index) => {
                      const dateInfo = formatDate(webinar.date);
                      return (
                        <motion.div
                          key={webinar.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={webinar.thumbnail}
                                alt={webinar.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                                  {webinar.title}
                                </h3>
                                {getStatusBadge(webinar.status)}
                              </div>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(webinar.category)}`}>
                                <Icon name="Tag" size={8} className="mr-1" />
                                {webinar.category}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-gray-500 text-xs">Date:</span>
                              <div className="font-medium text-gray-900">{dateInfo.full}</div>
                              <div className="text-xs text-gray-500">{dateInfo.time}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Duration:</span>
                              <div className="font-medium text-gray-900">{webinar.duration} min</div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Enrolled:</span>
                              <span className="font-medium text-gray-900">
                                {webinar.enrolled}/{webinar.maxCapacity}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(webinar.enrolled / webinar.maxCapacity) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            {webinar.status === 'upcoming' && webinar.zoomLink && (
                              <Button
                                onClick={() => handleJoinWebinar(webinar)}
                                size="sm"
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                              >
                                <Icon name="Video" size={14} className="mr-1" />
                                Join
                              </Button>
                            )}
                            <Button
                              onClick={() => navigate(`/webinar-details/${webinar.id}`)}
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Icon name="Eye" size={14} />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <Icon name="Video" size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Webinars Found</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {searchTerm || statusFilter || dateFilter
                  ? 'Try adjusting your search and filters to find webinars.'
                  : 'You don\'t have any assigned webinars yet. New sessions will appear here when assigned by the admin team.'}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Results Info */}
              <div className="text-sm text-gray-700 text-center lg:text-left">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(startIndex + parseInt(itemsPerPage), sortedWebinars.length)}</span> of{' '}
                <span className="font-semibold">{sortedWebinars.length}</span> results
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center space-x-1">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <Icon name="ChevronsLeft" size={16} />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Icon name="ChevronLeft" size={16} />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-2 py-1 text-gray-400">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[40px] ${
                            currentPage === page 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                              : 'hover:bg-blue-50'
                          }`}
                        >
                          {page}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <Icon name="ChevronRight" size={16} />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex"
                >
                  <Icon name="ChevronsRight" size={16} />
                </Button>
              </div>

              {/* Page Jump */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Go to:</span>
                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyWebinars;
