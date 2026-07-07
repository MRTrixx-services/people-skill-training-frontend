import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Select from 'components/ui/Select';
import axios from 'axios';
import axiosInstance from 'config/axiosInstance';
// import { API_BASE_URL } from 'contexts/AuthContext';

// Animation variants
const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 }
  }),
  hover: { scale: 1.1, rotate: 5 }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05 }
  }),
  hover: {
    scale: 1.01,
    backgroundColor: "rgb(253 247 255)",
    transition: { duration: 0.2 }
  }
};

const SpeakerManagement = () => {
  const navigate = useNavigate();
  
  // State management
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_speakers: 0,
    verified_speakers: 0,
    available_speakers: 0,
    average_rating: 0,
    total_sessions: 0,
    top_specializations: []
  });
  
  // View and filter state
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseLevelFilter, setExpertiseLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Dropdown states
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState(false);
  const [showVerificationDropdown, setShowVerificationDropdown] = useState(false);

  // Fetch speakers from API
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [speakersResponse, statsResponse] = await Promise.all([
          axiosInstance.get(`/speakers/`),
          axiosInstance.get(`/speakers/admin/stats/`).catch(() => ({ data: {} })) // Handle stats error gracefully
        ]);
        
        const speakersData = speakersResponse.data.results || speakersResponse.data;
        const transformedSpeakers = speakersData.map(transformSpeakerData);
        
        setSpeakers(transformedSpeakers);
        setStats(prevStats => ({ ...prevStats, ...statsResponse.data }));
        
      } catch (err) {
        console.error('Error fetching speakers:', err);
        setError('Failed to load speakers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  // Transform API speaker data to component format
  const transformSpeakerData = (apiSpeaker) => {
    return {
      id: apiSpeaker.id,
      name: apiSpeaker.full_name || 'Unknown Speaker',
      email: apiSpeaker.email,
      avatar: apiSpeaker.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      title: apiSpeaker.title || 'Speaker',
      bio: apiSpeaker.bio || '',
      expertiseLevel: apiSpeaker.expertise_level,
      expertise: apiSpeaker.expertise || [],
      availabilityStatus: apiSpeaker.availability_status,
      totalSessions: apiSpeaker.total_sessions,
      totalAttendees: apiSpeaker.total_attendees,
      averageRating: parseFloat(apiSpeaker.average_rating) || 0,
      isVerified: apiSpeaker.is_verified,
      location: apiSpeaker.location || 'Not specified',
      createdAt: apiSpeaker.created_at,
      verificationStatus: apiSpeaker.is_verified ? 'verified' : 'pending'
    };
  };

  // Filter options
  const itemsPerPageOptions = [
    { value: 8, label: '8 per page' },
    { value: 12, label: '12 per page' },
    { value: 16, label: '16 per page' },
    { value: 24, label: '24 per page' }
  ];

  const expertiseLevelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'Busy' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  const verificationOptions = [
    { value: '', label: 'All Verification' },
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending' },
    { value: 'unverified', label: 'Unverified' }
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const styles = {
      available: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm",
      busy: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 shadow-sm",
      unavailable: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300 shadow-sm"
    };

    const labels = {
      available: "Available",
      busy: "Busy",
      unavailable: "Unavailable"
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]} transition-all duration-200 hover:scale-105`}>
        {labels[status]}
      </span>
    );
  };

  // Verification badge component
  const getVerificationBadge = (isVerified) => {
    return isVerified ? (
      <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm">
        ✓ Verified
      </span>
    ) : (
      <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 shadow-sm">
        ⏳ Pending
      </span>
    );
  };

  // Rating stars component
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} name="StarHalf" size={14} className="text-yellow-400 fill-current" />);
      } else {
        stars.push(<Icon key={i} name="Star" size={14} className="text-gray-300" />);
      }
    }
    
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter and sort speakers
  const filteredSpeakers = speakers.filter(speaker => {
    const matchesSearch = speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = !expertiseLevelFilter || speaker.expertiseLevel === expertiseLevelFilter;
    const matchesStatus = !statusFilter || speaker.availabilityStatus === statusFilter;
    const matchesVerification = !verificationFilter || 
                              (verificationFilter === 'verified' && speaker.isVerified) ||
                              (verificationFilter === 'pending' && !speaker.isVerified) ||
                              (verificationFilter === 'unverified' && !speaker.isVerified);

    return matchesSearch && matchesExpertise && matchesStatus && matchesVerification;
  });

  const sortedSpeakers = filteredSpeakers.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'created_at':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'total_sessions':
        aValue = a.totalSessions;
        bValue = b.totalSessions;
        break;
      case 'average_rating':
        aValue = a.averageRating;
        bValue = b.averageRating;
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

  // Pagination
  const totalPages = Math.ceil(sortedSpeakers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSpeakers = sortedSpeakers.slice(startIndex, startIndex + itemsPerPage);

  // Handler functions
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectSpeaker = (speakerId) => {
    setSelectedSpeakers(prev =>
      prev.includes(speakerId)
        ? prev.filter(id => id !== speakerId)
        : [...prev, speakerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSpeakers.length === paginatedSpeakers.length) {
      setSelectedSpeakers([]);
    } else {
      setSelectedSpeakers(paginatedSpeakers.map(s => s.id));
    }
  };

const handleSpeakerAction = (action, speakerId) => {
  console.log(`${action} speaker:`, speakerId);
  
  switch (action) {
    case 'create':
      navigate('/admin/instructors/create');
      break;
    case 'edit':
      navigate(`/admin/instructor-profile/${speakerId}`);
      break;
    case 'view':
      navigate(`/admin/instructor-profile/${speakerId}`);
      break;
    case 'verify':
      // Handle verification
      break;
    case 'delete':
      const confirmed = window.confirm('Are you sure you want to delete this speaker?');
      if (confirmed) {
        console.log('Deleting speaker:', speakerId);
      }
      break;
    default:
      console.warn('Unknown action:', action);
  }
};

  const handleBulkVerify = () => {
    console.log('Bulk verify speakers:', selectedSpeakers);
    // Implement bulk verification
  };

  const handleBulkDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedSpeakers.length} speaker(s)?`);
    if (confirmed) {
      console.log('Bulk delete speakers:', selectedSpeakers);
      // Implement bulk deletion
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-gray-400" />;
    }
    return <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} className="text-purple-600" />;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setShowStatusDropdown(false);
        setShowExpertiseDropdown(false);
        setShowVerificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Speakers...</h2>
            <p className="text-gray-600">Please wait while we fetch speaker data.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Speakers</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Speaker Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage and oversee all platform speakers</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
       {/* Stats Cards */}
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
  initial="hidden"
  animate="visible"
  variants={fadeVariants}
>
  {[
    {
      title: "Total Speakers",
      value: stats.total_speakers || speakers.length,
      icon: "Users",
      color: "from-blue-400 to-purple-600",
      sub: `Active: ${speakers.filter(s => s.availabilityStatus === 'available').length}`
    },
    {
      title: "Verified",
      value: stats.verified_speakers || speakers.filter(s => s.isVerified).length,
      icon: "CheckCircle",
      color: "from-green-400 to-emerald-600",
      sub: "Verified speakers"
    },
    {
      title: "Available",
      value: stats.available_speakers || speakers.filter(s => s.availabilityStatus === 'available').length,
      icon: "Clock",
      color: "from-cyan-400 to-blue-500",
      sub: "Ready for sessions"
    },
    {
      title: "Avg Rating",
      value: stats.average_rating ? `${stats.average_rating}/5` : "N/A",
      icon: "Star",
      color: "from-yellow-400 to-orange-500",
      sub: "Platform average"
    }
  ].map((data, idx) => (
    <motion.div
      key={data.title}
      variants={fadeVariants}
      whileHover={{ y: -8, scale: 1.05 }}
      className={`bg-gradient-to-r ${data.color} rounded-3xl p-6 shadow-2xl text-white cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold">{data.title}</span>
        <Icon name={data.icon} size={36} />
      </div>
      <div className="text-3xl font-extrabold">{data.value}</div>
      <div className="text-sm mt-2 opacity-70">{data.sub}</div>
    </motion.div>
  ))}
</motion.div>

        {/* View Toggle and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-6 mb-6 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: (i = 1) => ({
                  opacity: 1,
                  x: 0,
                  transition: { delay: i * 0.1 }
                })
              }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="default"
                  onClick={() => navigate('/admin/instructors/create')}
                  icon="UserPlus"
                  iconPosition="left"
                  className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg border-0 font-semibold"
                >
                  Add Speaker
                </Button>
              </motion.div>

              {selectedSpeakers.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkVerify}
                      icon="CheckCircle"
                      iconPosition="left"
                      className="border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold"
                    >
                      Verify ({selectedSpeakers.length})
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDelete}
                      icon="Trash"
                      iconColor="text-red-600"
                      iconPosition="left"
                      className="border-2 border-red-300 hover:bg-red-50 text-red-700 font-semibold"
                    >
                      Delete ({selectedSpeakers.length})
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* Search and View Toggle */}
            <div className="flex flex-row items-center justify-end gap-4 w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search speakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-70 bg-white/70 border-2 border-purple-200 focus:border-purple-400 rounded-xl pl-4 pr-10 font-medium"
              />
              
              <motion.div
                className="flex border-2 border-purple-300 rounded-xl overflow-hidden shadow-md bg-white"
                whileHover={{ scale: 1.05 }}
                role="group"
              >
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-3 flex items-center justify-center transition-all duration-300 ${
                    viewMode === 'table'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <Icon name="List" size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 flex items-center justify-center transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <Icon name="Grid3X3" size={18} />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Table Header */}
              <div className="px-6 py-5 border-b-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-bold text-purple-800">
                    {filteredSpeakers.length} speakers found
                  </h3>
                  <Select
                    options={itemsPerPageOptions}
                    value={itemsPerPage}
                    onChange={setItemsPerPage}
                    className="w-full sm:w-auto border-2 border-purple-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Desktop Table */}
              <div className="overflow-x-auto">
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedSpeakers.length === paginatedSpeakers.length && paginatedSpeakers.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                          />
                        </th>
                        <th className="px-6 py-4 text-left">
                          <button
                            onClick={() => handleSort('name')}
                            className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider hover:text-purple-900 transition-colors duration-200"
                          >
                            <span>Speaker</span>
                            {renderSortIcon('name')}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-purple-800 uppercase tracking-wider">Level</span>
                            {/* Expertise Level Filter */}
                            <div className="relative filter-dropdown">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowExpertiseDropdown(!showExpertiseDropdown)}
                                className={`p-1 rounded-full transition-colors duration-200 ${
                                  expertiseLevelFilter
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                                title="Filter by expertise level"
                              >
                                <Icon name="Filter" size={14} />
                              </motion.button>
                              
                              {showExpertiseDropdown && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute top-8 left-0 z-50 bg-white border-2 border-purple-200 rounded-xl shadow-xl min-w-[180px]"
                                >
                                  <div className="py-2">
                                    {expertiseLevelOptions.map(option => (
                                      <button
                                        key={option.value}
                                        onClick={() => {
                                          setExpertiseLevelFilter(option.value);
                                          setShowExpertiseDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                                          expertiseLevelFilter === option.value
                                            ? 'bg-purple-100 text-purple-800 font-semibold'
                                            : 'text-gray-700'
                                        }`}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-purple-800 uppercase tracking-wider">Status</span>
                            {/* Status Filter */}
                            <div className="relative filter-dropdown">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className={`p-1 rounded-full transition-colors duration-200 ${
                                  statusFilter
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                                title="Filter by status"
                              >
                                <Icon name="Filter" size={14} />
                              </motion.button>
                              
                              {showStatusDropdown && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute top-8 left-0 z-50 bg-white border-2 border-purple-200 rounded-xl shadow-xl min-w-[150px]"
                                >
                                  <div className="py-2">
                                    {statusOptions.map(option => (
                                      <button
                                        key={option.value}
                                        onClick={() => {
                                          setStatusFilter(option.value);
                                          setShowStatusDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                                          statusFilter === option.value
                                            ? 'bg-purple-100 text-purple-800 font-semibold'
                                            : 'text-gray-700'
                                        }`}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <button
                            onClick={() => handleSort('total_sessions')}
                            className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider hover:text-purple-900 transition-colors duration-200"
                          >
                            <span>Sessions</span>
                            {renderSortIcon('total_sessions')}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <button
                            onClick={() => handleSort('average_rating')}
                            className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider hover:text-purple-900 transition-colors duration-200"
                          >
                            <span>Rating</span>
                            {renderSortIcon('average_rating')}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                          Verification
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-purple-100">
                      <AnimatePresence>
                        {paginatedSpeakers.map((speaker, index) => (
                          <motion.tr
                            key={speaker.id}
                            variants={rowVariants}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            className="transition-all duration-200 hover:shadow-lg"
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedSpeakers.includes(speaker.id)}
                                onChange={() => handleSelectSpeaker(speaker.id)}
                                className="rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md border-2 border-purple-200">
                                  <Image
                                    src={speaker.avatar}
                                    alt={speaker.name}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-bold text-gray-900 truncate hover:text-purple-700 transition-colors duration-200">
                                    {speaker.name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {speaker.email}
                                  </div>
                                  <div className="text-xs text-purple-600 font-semibold bg-purple-100 px-2 py-1 rounded-full mt-1 inline-block">
                                    {speaker.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-300 capitalize">
                                {speaker.expertiseLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(speaker.availabilityStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900">
                                {speaker.totalSessions}
                              </div>
                              <div className="text-xs text-gray-500">
                                {speaker.totalAttendees} attendees
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {renderStars(speaker.averageRating)}
                                <span className="text-sm font-semibold text-gray-900">
                                  ({speaker.averageRating.toFixed(1)})
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getVerificationBadge(speaker.isVerified)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                              
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSpeakerAction('view', speaker.id)}
                                    iconName="Eye"
                                    title="View Profile"
                                    className="text-green-600 hover:bg-green-100 border border-green-200 hover:border-green-300"
                                  />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSpeakerAction('delete', speaker.id)}
                                    iconName="Trash2"
                                    title="Delete Speaker"
                                    className="text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300"
                                  />
                                </motion.div>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="block lg:hidden">
                  {/* Mobile Filters */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
                    <div className="flex flex-wrap gap-3">
                      {/* Status Filter */}
                      <div className="relative filter-dropdown">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                            statusFilter
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50'
                          }`}
                        >
                          <Icon name="Filter" size={16} />
                          <span>Status</span>
                          {statusFilter && (
                            <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs">
                              {statusOptions.find(s => s.value === statusFilter)?.label}
                            </span>
                          )}
                        </motion.button>
                        
                        {showStatusDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-12 left-0 z-50 bg-white border-2 border-purple-200 rounded-xl shadow-xl min-w-[150px]"
                          >
                            <div className="py-2">
                              {statusOptions.map(option => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setStatusFilter(option.value);
                                    setShowStatusDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                                    statusFilter === option.value
                                      ? 'bg-purple-100 text-purple-800 font-semibold'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Expertise Level Filter */}
                      <div className="relative filter-dropdown">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowExpertiseDropdown(!showExpertiseDropdown)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                            expertiseLevelFilter
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50'
                          }`}
                        >
                          <Icon name="Filter" size={16} />
                          <span>Level</span>
                          {expertiseLevelFilter && (
                            <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs max-w-20 truncate">
                              {expertiseLevelFilter}
                            </span>
                          )}
                        </motion.button>
                        
                        {showExpertiseDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-12 left-0 z-50 bg-white border-2 border-purple-200 rounded-xl shadow-xl min-w-[180px]"
                          >
                            <div className="py-2">
                              {expertiseLevelOptions.map(option => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setExpertiseLevelFilter(option.value);
                                    setShowExpertiseDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                                    expertiseLevelFilter === option.value
                                      ? 'bg-purple-100 text-purple-800 font-semibold'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Sort Options */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (sortBy === 'created_at') {
                            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                          } else {
                            setSortBy('created_at');
                            setSortOrder('desc');
                          }
                        }}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors duration-200"
                      >
                        <Icon name="Calendar" size={16} />
                        <span>Sort by Date</span>
                        {sortBy === 'created_at' && (
                          <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} />
                        )}
                      </motion.button>

                      {/* Clear Filters */}
                      {(statusFilter || expertiseLevelFilter) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setStatusFilter('');
                            setExpertiseLevelFilter('');
                          }}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold bg-red-100 border-2 border-red-200 text-red-700 hover:bg-red-200 transition-colors duration-200"
                        >
                          <Icon name="X" size={16} />
                          <span>Clear</span>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <AnimatePresence>
                      {paginatedSpeakers.map((speaker, index) => (
                        <motion.div
                          key={speaker.id}
                          variants={rowVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          className="border-2 border-purple-200 rounded-2xl p-5 space-y-4 bg-gradient-to-br from-white to-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start space-x-4">
                            <input
                              type="checkbox"
                              checked={selectedSpeakers.includes(speaker.id)}
                              onChange={() => handleSelectSpeaker(speaker.id)}
                              className="mt-1 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                            />
                            <div className="w-20 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md border-2 border-purple-200">
                              <Image
                                src={speaker.avatar}
                                alt={speaker.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">
                                {speaker.name}
                              </h4>
                              <p className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full mt-2 inline-block">
                                {speaker.title}
                              </p>
                            </div>
                            {getVerificationBadge(speaker.isVerified)}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                              <span className="text-blue-700 font-semibold block">Level</span>
                              <div className="font-bold text-blue-900 capitalize">{speaker.expertiseLevel}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                              <span className="text-green-700 font-semibold block">Sessions</span>
                              <div className="font-bold text-green-900">{speaker.totalSessions}</div>
                            </div>
                          </div>

                          <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-purple-700 font-semibold">Rating</span>
                              <div className="flex items-center space-x-2">
                                {renderStars(speaker.averageRating)}
                                <span className="font-bold text-purple-900">({speaker.averageRating.toFixed(1)})</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-700 font-semibold">Status</span>
                              {getStatusBadge(speaker.availabilityStatus)}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-3 border-t border-purple-200">
                            
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSpeakerAction('view', speaker.id)}
                                className="border-green-300 text-green-700 hover:bg-green-50 font-semibold"
                              >
                                View
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSpeakerAction('delete', speaker.id)}
                                className="border-red-300 text-red-700 hover:bg-red-50 font-semibold"
                              >
                                Delete
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-6 py-5 border-t-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-purple-700 text-center sm:text-left font-semibold">
                      Showing <span className="font-bold text-purple-900">{startIndex + 1}</span> to{' '}
                      <span className="font-bold text-purple-900">
                        {Math.min(startIndex + parseInt(itemsPerPage), sortedSpeakers.length)}
                      </span>{' '}
                      of <span className="font-bold text-purple-900">{sortedSpeakers.length}</span> results
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          icon="ChevronLeft"
                          className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </motion.div>
                      <span className="text-sm text-purple-900 px-4 py-2 bg-white rounded-lg border-2 border-purple-200 font-bold shadow-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          icon="ChevronRight"
                          className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Empty State */}
        {filteredSpeakers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ duration: 0.3 }}>
              <Icon name="Users" size={64} className="mx-auto mb-6 text-purple-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-purple-900 mb-3">No speakers found</h3>
            <p className="text-purple-600 mb-8 max-w-md mx-auto font-medium">
              {searchTerm || statusFilter || expertiseLevelFilter || verificationFilter
                ? "Try adjusting your search and filters to find what you're looking for."
                : "Start building your speaker network by adding your first speaker!"}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="default"
                onClick={() => navigate('/admin/instructors/create')}
                icon="UserPlus"
                iconPosition="left"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl border-0 font-bold text-lg px-8 py-3"
              >
                Add Your First Speaker
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpeakerManagement;
