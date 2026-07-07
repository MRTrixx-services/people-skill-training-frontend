import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import axiosInstance from 'config/axiosInstance';

// Simple toast fallback
const showToast = (message, type = 'info') => {
  alert(`${type.toUpperCase()}: ${message}`);
};

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
    transition: { delay: i * 0.1, type: 'spring', stiffness: 120 }
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
    backgroundColor: 'rgb(253 247 255)',
    transition: { duration: 0.2 }
  }
};

const WebinarManagement = () => {
  const navigate = useNavigate();
  const [allWebinars, setAllWebinars] = useState([]); // ✅ Transformed full dataset
  const [rawWebinarData, setRawWebinarData] = useState(new Map()); // ✅ Raw API data for edit
  const [webinars, setWebinars] = useState([]);       // ✅ Filtered view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_webinars: 0,
    live_webinars: 0,
    recorded_webinars: 0,
    upcoming_webinars: 0,
    currently_live: 0,
    completed_webinars: 0,
    available_webinars: 0,
    with_recordings: 0,
    total_enrollments: 0,
    total_revenue: 0,
    average_rating: 0,
    zoom_integrated_webinars: 0,
    auto_converted_webinars: 0,
    popular_categories: []
  });

  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [selectedWebinars, setSelectedWebinars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // ✅ PROGRESSIVE LOADING — show data as soon as first page arrives
  useEffect(() => {
    const fetchAllWebinars = async () => {
      try {
        setLoading(true);
        setError(null);
        setAllWebinars([]);
        setWebinars([]);
        setRawWebinarData(new Map());

        let nextUrl = '/webinars/';
        let totalCountLocal = 0;

        while (nextUrl) {
          const response = await axiosInstance.get(nextUrl, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
          });

          if (totalCountLocal === 0) {
            totalCountLocal = response.data.count || 0;
            // Fetch stats in parallel
            axiosInstance.get('/webinars/stats/', {
              headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
            }).then(statsRes => setStats(statsRes.data)).catch(console.error);
          }

          const batch = response.data.results || [];
          
          // ✅ Store RAW data (for edit/view)
          setRawWebinarData(prev => {
            const newMap = new Map(prev);
            batch.forEach(item => {
              newMap.set(item.id, item);
              newMap.set(item.webinar_id, item);
            });
            return newMap;
          });

          // ✅ Transform and append
          const transformedBatch = batch.map(transformWebinarData);
          setAllWebinars(prev => [...prev, ...transformedBatch]);

          // ✅ Update filtered view immediately
          const updatedAll = [...allWebinars, ...transformedBatch];
          const filtered = applyFilters(updatedAll, searchTerm, statusFilter, typeFilter, instructorFilter);
          const sorted = applySorting(filtered, sortBy, sortOrder);
          setWebinars(sorted);

          nextUrl = response.data.next;

          // Optional: small delay for smoother UX (remove in prod if desired)
          if (nextUrl) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      } catch (err) {
        console.error('Error fetching webinars:', err);
        setError('Failed to load webinars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllWebinars();
  }, []);

  // ✅ Transform API data
  const transformWebinarData = (apiWebinar) => ({
    id: apiWebinar.id,
    webinarId: apiWebinar.webinar_id,
    title: apiWebinar.title,
    instructor: {
      name: apiWebinar.speaker?.full_name || 'TBA',
      id: apiWebinar.speaker?.id || 0,
      avatar: apiWebinar.speaker?.profile_picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    date: apiWebinar.webinar_type === 'live' ? apiWebinar.scheduled_date : null,
    status: apiWebinar.status,
    display_status: apiWebinar.display_status,
    webinar_type: apiWebinar.webinar_type,
    attendees: apiWebinar.enrolled_count || 0,
    maxCapacity: apiWebinar.max_attendees || 100,
    revenue: (apiWebinar.enrolled_count || 0) * (apiWebinar.main_price || 0),
    category: apiWebinar.category?.name || 'General',
    thumbnail: apiWebinar.cover_image_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop',
    description: apiWebinar.description,
    duration: apiWebinar.duration,
    timezone: apiWebinar.timezone,
    pricing_data: apiWebinar.applicable_prices,
    zoom_url: apiWebinar.zoom_url,
    has_recording: apiWebinar.has_recording,
    created_at: apiWebinar.created_at,
    updated_at: apiWebinar.updated_at,
    is_available_now: apiWebinar.webinar_type === 'recorded' || apiWebinar.status === 'available'
  });

  // ✅ Helper: Apply filters
  const applyFilters = (data, search, status, type, instructor) => {
    return data.filter(webinar => {
      const matchesSearch = !search ||
        webinar.title.toLowerCase().includes(search.toLowerCase()) ||
        webinar.instructor.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || webinar.status === status;
      const matchesType = !type || webinar.webinar_type === type;
      const matchesInstructor = !instructor || webinar.instructor.name === instructor;
      return matchesSearch && matchesStatus && matchesType && matchesInstructor;
    });
  };

  // ✅ Helper: Apply sorting
  const applySorting = (data, field, order) => {
    return [...data].sort((a, b) => {
      let aValue, bValue;
      switch (field) {
        case 'date':
          aValue = new Date(a.date || a.created_at);
          bValue = new Date(b.date || b.created_at);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'attendees':
          aValue = a.attendees;
          bValue = b.attendees;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'instructor':
          aValue = a.instructor.name.toLowerCase();
          bValue = b.instructor.name.toLowerCase();
          break;
        default:
          aValue = a[field];
          bValue = b[field];
      }
      return order === 'asc' ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
    });
  };

  // ✅ Recompute filtered/sorted list ONLY from local data
  useEffect(() => {
    const filtered = applyFilters(allWebinars, searchTerm, statusFilter, typeFilter, instructorFilter);
    const sorted = applySorting(filtered, sortBy, sortOrder);
    setWebinars(sorted);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [allWebinars, searchTerm, statusFilter, typeFilter, instructorFilter, sortBy, sortOrder]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setShowStatusDropdown(false);
        setShowInstructorDropdown(false);
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Options
  const itemsPerPageOptions = [
    { value: '8', label: '8 per page' },
    { value: '12', label: '12 per page' },
    { value: '16', label: '16 per page' },
    { value: '24', label: '24 per page' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
    { value: 'available', label: 'Available' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'live', label: 'Live Webinars' },
    { value: 'recorded', label: 'Recorded Webinars' }
  ];

  const instructors = [...new Set(allWebinars.map(w => w.instructor.name))].map(name => ({
    value: name,
    label: name
  }));
  const instructorOptions = [{ value: '', label: 'All Instructors' }, ...instructors];

  // UI Helpers
  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300',
      live: 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-300 animate-pulse ring-2 ring-red-200',
      completed: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300',
      available: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-300',
      cancelled: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300'
    };
    const labels = {
      scheduled: 'Scheduled',
      live: 'Live Now',
      completed: 'Completed',
      available: 'Available Now',
      cancelled: 'Cancelled'
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]} transition-all duration-200 hover:scale-105`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (webinarType) => {
    const styles = {
      live: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300',
      recorded: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-300'
    };
    const labels = { live: 'Live', recorded: 'Recorded' };
    const icons = { live: 'Radio', recorded: 'Video' };
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full border ${styles[webinarType]}`}>
        <Icon name={icons[webinarType]} size={12} />
        <span>{labels[webinarType]}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Pagination
  const totalPages = Math.ceil(webinars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWebinars = webinars.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectWebinar = (webinarId) => {
    setSelectedWebinars(prev =>
      prev.includes(webinarId) ? prev.filter(id => id !== webinarId) : [...prev, webinarId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWebinars.length === paginatedWebinars.length) {
      setSelectedWebinars([]);
    } else {
      setSelectedWebinars(paginatedWebinars.map(w => w.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedWebinars.length > 0) {
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedWebinars.length} webinar(s)?`);
      if (confirmed) {
        selectedWebinars.forEach(id => handleDeleteWebinar(id));
        setSelectedWebinars([]);
      }
    }
  };

  const handleWebinarAction = (action, webinarId) => {
    // ✅ Get RAW data for edit
    let originalWebinar = rawWebinarData.get(webinarId);
    
    // Fallback: if passed transformed ID, find via allWebinars
    if (!originalWebinar) {
      const found = allWebinars.find(w => w.id === webinarId || w.webinarId === webinarId);
      if (found) {
        originalWebinar = rawWebinarData.get(found.id);
      }
    }

    if (!originalWebinar) {
      showToast('Webinar data not available', 'error');
      return;
    }

    const baseState = {
      webinar: originalWebinar,
      fromManagement: true,
      returnPath: '/admin/webinars'
    };

    switch (action) {
      case 'edit':
        navigate(`/admin/edit-webinar/${originalWebinar.webinar_id}`, {
          state: { ...baseState, action: 'edit' }
        });
        break;
      case 'view':
        if (originalWebinar.webinar_type === 'recorded') {
          navigate(`/recorded-webinar/${originalWebinar.webinar_id}`, {
            state: { ...baseState, fromAdmin: true }
          });
        } else {
          navigate(`/live-webinar/${originalWebinar.webinar_id}`, {
            state: { ...baseState, fromAdmin: true }
          });
        }
        break;
      case 'delete':
        handleDeleteWebinar(webinarId);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const handleDeleteWebinar = async (webinarId) => {
    const webinar = allWebinars.find(w => w.id === webinarId || w.webinarId === webinarId);
    if (!webinar) {
      showToast('Webinar not found', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${webinar.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      // ✅ FIXED: Correct axios delete call
      await axiosInstance.delete(`/webinars/${webinar.id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
      });

      setAllWebinars(prev => prev.filter(w => w.id !== webinarId));
      setSelectedWebinars(prev => prev.filter(id => id !== webinarId));
      
      setStats(prev => ({
        ...prev,
        total_webinars: prev.total_webinars - 1,
        live_webinars: webinar.webinar_type === 'live' ? prev.live_webinars - 1 : prev.live_webinars,
        recorded_webinars: webinar.webinar_type === 'recorded' ? prev.recorded_webinars - 1 : prev.recorded_webinars
      }));

      showToast(`"${webinar.title}" deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting webinar:', error);
      const msg = error.response?.data?.detail || 'Failed to delete webinar';
      showToast(msg, 'error');
    }
  };

  // Stats Cards
  const statsCards = [
    {
      title: 'Total Webinars',
      value: stats.total_webinars,
      icon: 'Video',
      color: 'from-blue-500 to-cyan-600',
      sub: `${stats.live_webinars} live • ${stats.recorded_webinars} recorded`,
      bgPattern: 'bg-blue-400/10'
    },
    {
      title: 'Live Webinars',
      value: stats.live_webinars,
      icon: 'Radio',
      color: 'from-red-500 to-orange-600',
      sub: `${stats.upcoming_webinars} upcoming • ${stats.currently_live} live now`,
      bgPattern: 'bg-red-400/10',
      pulse: stats.currently_live > 0
    },
    {
      title: 'Recorded Content',
      value: stats.recorded_webinars,
      icon: 'PlayCircle',
      color: 'from-purple-500 to-indigo-600',
      sub: `${stats.available_webinars} available now`,
      bgPattern: 'bg-purple-400/10'
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats.total_revenue).replace(/\.00$/, ''),
      icon: 'DollarSign',
      color: 'from-emerald-500 to-teal-600',
      sub: `${stats.total_enrollments} total enrollments`,
      bgPattern: 'bg-emerald-400/10'
    }
  ];

  const secondaryStatsCards = [
    {
      title: 'Completed Sessions',
      value: stats.completed_webinars,
      icon: 'CheckCircle',
      color: 'from-green-400 to-emerald-500',
      sub: `${stats.with_recordings} with recordings`,
      bgPattern: 'bg-green-400/10'
    },
    {
      title: 'Average Rating',
      value: stats.average_rating ? `${Number(stats.average_rating).toFixed(1)}★` : 'No ratings',
      icon: 'Star',
      color: 'from-yellow-400 to-amber-500',
      sub: 'User satisfaction score',
      bgPattern: 'bg-yellow-400/10'
    },
    {
      title: 'Zoom Integration',
      value: stats.zoom_integrated_webinars,
      icon: 'Video',
      color: 'from-blue-400 to-indigo-500',
      sub: `${stats.auto_converted_webinars} auto-converted`,
      bgPattern: 'bg-blue-400/10'
    },
    {
      title: 'Currently Live',
      value: stats.currently_live,
      icon: 'Zap',
      color: 'from-red-400 to-pink-500',
      sub: 'Active sessions right now',
      bgPattern: 'bg-red-400/10',
      pulse: stats.currently_live > 0
    }
  ];

  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-gray-400" />;
    }
    return (
      <Icon
        name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
        size={14}
        className="text-purple-600"
      />
    );
  };

  // Loading State
  if (loading && allWebinars.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Webinars...</h2>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Webinars</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeVariants} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Webinar Management
              </h1>
              <p className="text-gray-600 mt-2">Oversee all webinars across the platform ✨</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="default"
                onClick={() => navigate("/admin/create")}
                iconName="Plus"
                iconPosition="left"
                className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg border-0 font-semibold"
              >
                Create Webinar
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((card, idx) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -8, scale: 1.05 }}
              className={`rounded-3xl p-6 shadow-2xl border-0 bg-gradient-to-br ${card.color} relative overflow-hidden ${
                card.pulse ? 'animate-pulse ring-4 ring-red-300/50' : ''
              }`}
            >
              <div className={`absolute inset-0 ${card.bgPattern} opacity-50`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-white/90 font-semibold">{card.title}</p>
                    <div className="text-3xl font-black text-white drop-shadow-lg">{card.value}</div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <Icon name={card.icon} size={32} className="text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="text-sm text-white/90 font-medium">{card.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary Stats */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {secondaryStatsCards.map((stat, idx) => (
            <motion.div
              key={stat.title}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`rounded-2xl p-4 shadow-lg border bg-gradient-to-br ${stat.color} relative overflow-hidden ${
                stat.pulse ? 'animate-pulse ring-2 ring-red-300/50' : ''
              }`}
            >
              <div className={`absolute inset-0 ${stat.bgPattern} opacity-50`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-white/90 font-semibold uppercase tracking-wider">{stat.title}</p>
                  <Icon name={stat.icon} size={20} className="text-white/80" />
                </div>
                <div className="text-xl font-bold text-white drop-shadow">{stat.value}</div>
                <div className="text-xs text-white/80">{stat.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters & Controls */}
        <motion.div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              {selectedWebinars.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  iconName="Trash"
                  iconColor="text-red-600"
                  iconPosition="left"
                  className="border-2 border-red-300 hover:bg-red-50 text-red-700 font-semibold"
                >
                  Delete ({selectedWebinars.length})
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Input
                type="text"
                placeholder="🔍 Search webinars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-72 bg-white/70 border-2 border-purple-200 focus:border-purple-400 rounded-xl pl-4 pr-10 font-medium"
              />
             
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        {viewMode === 'calendar' ? (
          <div className="text-center py-12">
            <Icon name="Calendar" size={48} className="mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Calendar view coming soon</h3>
            <p className="text-gray-600 mt-2">Switch to Table view for full functionality</p>
          </div>
        ) : (
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-2xl shadow-2xl overflow-hidden"
                    >     <div className="px-6 py-5 border-b-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-bold text-purple-800">
                  📊 {webinars.length} webinar(s) found
                </h3>
                <Select
                  options={itemsPerPageOptions}
                  value={itemsPerPage}
                  onChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-auto border-2 border-purple-200 rounded-lg"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedWebinars.length === paginatedWebinars.length && paginatedWebinars.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button onClick={() => handleSort('title')} className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider">
                        <span>📚 Title</span>
                        {renderSortIcon('title')}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button onClick={() => handleSort('instructor')} className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider">
                        <span>👨‍🏫 Instructor</span>
                        {renderSortIcon('instructor')}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button onClick={() => handleSort('date')} className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider">
                        <span>📅 Date & Time</span>
                        {renderSortIcon('date')}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left">
                      <button onClick={() => handleSort('attendees')} className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider">
                        <span>👥 Enrolled</span>
                        {renderSortIcon('attendees')}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button onClick={() => handleSort('revenue')} className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider">
                        <span>💰 Revenue</span>
                        {renderSortIcon('revenue')}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-purple-100">
                  {paginatedWebinars.map((webinar, index) => (
                    <motion.tr
                      key={webinar.id}
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
                          checked={selectedWebinars.includes(webinar.id)}
                          onChange={() => handleSelectWebinar(webinar.id)}
                          className="rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-md border-2 border-purple-200">
                            <Image src={webinar.thumbnail} alt={webinar.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-gray-900 truncate">{webinar.title}</div>
                            <div className="text-xs text-purple-600 font-semibold bg-purple-100 px-2 py-1 rounded-full mt-1 inline-block">
                              {webinar.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-300 shadow-sm">
                            <Image src={webinar.instructor.avatar} alt={webinar.instructor.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-sm font-bold text-gray-900">{webinar.instructor.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{formatDate(webinar.date)}</div>
                        <div className="text-xs text-purple-600 font-semibold">{formatTime(webinar.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(webinar.webinar_type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(webinar.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{webinar.attendees}/{webinar.maxCapacity}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(webinar.attendees / webinar.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-700">{formatCurrency(webinar.revenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWebinarAction('edit', webinar.webinarId)}
                            iconName="Edit"
                            className="text-blue-600 hover:bg-blue-100 border border-blue-200"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWebinarAction('view', webinar.webinarId)}
                            iconName="Eye"
                            className="text-cyan-600 hover:bg-cyan-100 border border-cyan-200"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWebinarAction('delete', webinar.webinarId)}
                            iconName="Trash2"
                            className="text-red-600 hover:bg-red-100 border border-red-200"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-5 border-t-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-purple-700">
                    Showing <span className="font-bold">{startIndex + 1}</span> to{' '}
                    <span className="font-bold">{Math.min(startIndex + parseInt(itemsPerPage), webinars.length)}</span> of{' '}
                    <span className="font-bold">{webinars.length}</span> results
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      iconName="ChevronLeft"
                      className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                    />
                    <span className="text-sm text-purple-900 px-4 py-2 bg-white rounded-lg border-2 border-purple-200 font-bold">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      iconName="ChevronRight"
                      className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {webinars.length === 0 && (
              <div className="text-center py-16 px-6">
                <Icon name="Video" size={64} className="mx-auto mb-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-purple-900 mb-3">No webinars found</h3>
                <p className="text-purple-600 mb-8 max-w-md mx-auto">
                  {searchTerm || statusFilter || instructorFilter
                    ? 'Try adjusting your search and filters.'
                    : 'Create your first webinar to get started!'}
                </p>
                <Button
                  onClick={() => navigate('/admin/create')}
                  iconName="Plus"
                  iconPosition="left"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl border-0 font-bold px-6 py-3"
                >
                  Create Webinar
                </Button>
              </div>
            )}  </motion.div>
                        </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarManagement;