import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import axios from 'axios';
import axiosInstance from 'config/axiosInstance';
// import { API_BASE_URL } from 'contexts/AuthContext';

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

    const [webinars, setWebinars] = useState([]);
     const [webinarDataMap, setWebinarDataMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    // Basic counts
    total_webinars: 0,
    live_webinars: 0,
    recorded_webinars: 0,
    
    // Live webinar statuses
    upcoming_webinars: 0,
    currently_live: 0,
    completed_webinars: 0,
    
    // Content availability
    available_webinars: 0,
    with_recordings: 0,
    
    // Business metrics
    total_enrollments: 0,
    total_revenue: 0,
    average_rating: 0,
    
    // Advanced features
    zoom_integrated_webinars: 0,
    auto_converted_webinars: 0,
    
    // Category data
    popular_categories: []
  });

 const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState(''); // ADDED: Webinar type filter
  const [instructorFilter, setInstructorFilter] = useState('');
  const [selectedWebinars, setSelectedWebinars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false); // ADDED
 
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
   // Fetch webinars from API
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let allWebinars = [];
      let pageNumber = 1;
      let hasNextPage = true;
      const dataMap = new Map();

      // Loop through all pages using page numbers
      while (hasNextPage) {
        const response = await axiosInstance.get('/webinars/', {
          params: { page: pageNumber },
          headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
        });

        const pageWebinars = response.data.results;
        
        if (pageWebinars.length === 0) {
          hasNextPage = false;
          break;
        }

        allWebinars.push(...pageWebinars);

        // Update data map
        pageWebinars.forEach((webinar) => {
          dataMap.set(webinar.id, webinar);
          dataMap.set(webinar.webinar_id, webinar);
        });

        // Update UI immediately with current page
        const transformedWebinars = allWebinars.map(transformWebinarData);
        setWebinars([...transformedWebinars]);
        setWebinarDataMap(new Map(dataMap));

        console.log(`✅ Page ${pageNumber} loaded: ${allWebinars.length} total items`);
        
        // Check if there's a next page
        hasNextPage = response.data.next !== null;
        pageNumber++;
      }

      // Fetch stats
      const statsResponse = await axiosInstance.get('/webinars/stats/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
      });
      setStats(statsResponse.data);

      console.log(`✅ All ${pageNumber - 1} pages loaded successfully! Total: ${allWebinars.length} webinars`);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load webinars. Please try again later.');
      setLoading(false);
    }
  };

  fetchData();
}, []);

  // Transform API webinar data to component format
  const transformWebinarData = (apiWebinar) => {
    return {
      id: apiWebinar.id,
      webinarId: apiWebinar.webinar_id,
      title: apiWebinar.title,
      instructor: {
        name: apiWebinar.speaker?.full_name || 'TBA',
        id: apiWebinar.speaker?.id || 0,
        avatar: apiWebinar.speaker?.profile_picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      // ENHANCED: Conditional date/time based on webinar type
      date: apiWebinar.webinar_type === 'live' ? apiWebinar.scheduled_date : null,
      status: apiWebinar.status,
      display_status: apiWebinar.display_status,
      webinar_type: apiWebinar.webinar_type, // ADDED
      attendees: apiWebinar.enrolled_count || 0,
      maxCapacity: apiWebinar.max_attendees || 0,
      revenue: calculateRevenue(apiWebinar),
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
      // ADDED: Conditional availability
      is_available_now: apiWebinar.webinar_type === 'recorded' || apiWebinar.status === 'available'
    };
  };

    const calculateRevenue = (webinar) => {
    const enrolled = webinar.enrolled_count || 0;
    const mainPrice = webinar.main_price || 0;
    return enrolled * mainPrice;
  };

// Helper function to safely format percentage
const formatPercentageChange = (current, previous) => {
  if (!current && !previous) return 'No data';
  if (!previous || previous === 0) {
    return current > 0 ? 'New revenue!' : 'No revenue yet';
  }
  
  const percentage = ((current - previous) / previous) * 100;
  if (isNaN(percentage)) return 'No change';
  
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${Math.round(percentage)}% vs last month`;
};



  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setShowStatusDropdown(false);
        setShowInstructorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  
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
    { value: 'available', label: 'Available' }, // For recorded webinars
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'live', label: 'Live Webinars' },
    { value: 'recorded', label: 'Recorded Webinars' }
  ];
  const instructors = [...new Set(webinars.map(w => w.instructor.name))].map(name => ({
    value: name,
    label: name
  }));
  const instructorOptions = [{ value: '', label: 'All Instructors' }, ...instructors];

    const getStatusBadge = (status, webinarType) => {
    const styles = {
      scheduled: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300',
      live: 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-300 animate-pulse ring-2 ring-red-200',
      completed: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300',
      available: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-300', // For recorded
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

    const labels = {
      live: 'Live',
      recorded: 'Recorded'
    };

    const icons = {
      live: 'Radio',
      recorded: 'Video'
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full border ${styles[webinarType]}`}>
        <Icon name={icons[webinarType]} size={12} />
        <span>{labels[webinarType]}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort webinars
 const filteredWebinars = webinars.filter(webinar => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webinar.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || webinar.status === statusFilter;
    const matchesType = !typeFilter || webinar.webinar_type === typeFilter; // ADDED
    const matchesInstructor = !instructorFilter || webinar.instructor.name === instructorFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesInstructor;
  });
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
  const totalPages = Math.ceil(sortedWebinars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWebinars = sortedWebinars.slice(startIndex, startIndex + itemsPerPage);

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
      prev.includes(webinarId) 
        ? prev.filter(id => id !== webinarId)
        : [...prev, webinarId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWebinars.length === paginatedWebinars.length) {
      setSelectedWebinars([]);
    } else {
      setSelectedWebinars(paginatedWebinars.map(w => w.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for webinars:`, selectedWebinars);
    setSelectedWebinars([]);
  };

  // const handleWebinarAction = (action, webinarId) => {
  //   console.log(`${action} webinar:`, webinarId);
  //   if (action === 'edit') {
  //     navigate(`/admin/edit-webinar/${webinarId}`);
  //   }
  // };
// const handleWebinarAction = (action, webinarId) => {
//   console.log(`${action} webinar:`, webinarId);
  
//   if (action === 'edit') {
//     // Find the webinar data from the current webinars list
//     const webinarToEdit = webinars.find(w => w.id === webinarId || w.webinarId === webinarId);
    
//     navigate(`/admin/edit-webinar/${webinarId}`, {
//       state: {
//         webinar: webinarToEdit,
//         fromManagement: true,
//         returnPath: '/admin/webinars'
//       }
//     });
//   } else if (action === 'view') {
//     const webinarToView = webinars.find(w => w.id === webinarId || w.webinarId === webinarId);
    
//     navigate(`/webinar/${webinarId}`, {
//       state: {
//         webinar: webinarToView,
//         fromAdmin: true,
//         returnPath: '/admin/webinars'
//       }
//     });
//   } else if (action === 'delete') {
//     handleDeleteWebinar(webinarId);
//   } else if (action === 'duplicate') {
//     handleDuplicateWebinar(webinarId);
//   }
// };
const statsCards = [
  {
    title: 'Total Webinars',
    value: stats.total_webinars,
    icon: 'Video',
    color: 'from-blue-500 to-cyan-600',
    text: 'text-white',
    sub: `${stats.live_webinars} live • ${stats.recorded_webinars} recorded`,
    bgPattern: 'bg-blue-400/10',
    trend: '+12%'
  },
  {
    title: 'Live Webinars',
    value: stats.live_webinars,
    icon: 'Radio',
    color: 'from-red-500 to-orange-600',
    text: 'text-white',
    sub: `${stats.upcoming_webinars} upcoming • ${stats.currently_live} live now`,
    bgPattern: 'bg-red-400/10',
    pulse: stats.currently_live > 0
  },
  {
    title: 'Recorded Content',
    value: stats.recorded_webinars,
    icon: 'PlayCircle',
    color: 'from-purple-500 to-indigo-600',
    text: 'text-white',
    sub: `${stats.available_webinars} available now`,
    bgPattern: 'bg-purple-400/10'
  },
  {
    title: 'Revenue',
    value: new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(stats.total_revenue),
    icon: 'DollarSign',
    color: 'from-emerald-500 to-teal-600',
    text: 'text-white',
    sub: `${stats.total_enrollments} total enrollments`,
    bgPattern: 'bg-emerald-400/10'
  }
];

  // ENHANCED: Secondary stats cards for advanced metrics
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
 const handleWebinarAction = (action, webinarId) => {
    const webinar = webinars.find(w => w.id === webinarId || w.webinarId === webinarId);
    const originalWebinar = webinarDataMap.get(webinarId);
    
    if (!originalWebinar) {
      showToast('Webinar not found', 'error');
      return;
    }

    const baseState = {
      webinar: originalWebinar,
      fromManagement: true,
      returnPath: '/admin/webinars',
      timestamp: Date.now()
    };

    switch (action) {
      case 'edit':
        navigate(`/admin/edit-webinar/${originalWebinar.webinar_id}`, {
          state: { ...baseState, action: 'edit' }
        });
        break;
        
      case 'view':
        // ENHANCED: Conditional navigation based on webinar type
        if (originalWebinar.webinar_type === 'recorded') {
          navigate(`/recorded-webinar/${originalWebinar.webinar_id}`, {
            state: { ...baseState, fromAdmin: true, action: 'view' }
          });
        } else {
          navigate(`/live-webinar/${originalWebinar.webinar_id}`, {
            state: { ...baseState, fromAdmin: true, action: 'view' }
          });
        }
        break;
        
      case 'duplicate':
        const duplicatedWebinar = {
          ...originalWebinar,
          title: `${originalWebinar.title} (Copy)`,
          id: undefined,
          webinar_id: undefined,
          scheduled_date: originalWebinar.webinar_type === 'live' ? 
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
          status: originalWebinar.webinar_type === 'live' ? 'scheduled' : 'available'
        };
        
        navigate('/admin/create', {
          state: {
            duplicateData: duplicatedWebinar,
            isDuplicate: true,
            originalWebinar: webinar,
            fromManagement: true,
            returnPath: '/admin/webinars'
          }
        });
        break;
        
      case 'delete':
        handleDeleteWebinar(webinarId);
        break;
        
      case 'analytics':
        navigate(`/admin/webinar-analytics/${webinarId}`, { state: baseState });
        break;
        
      case 'resources':
        navigate(`/admin/webinar-resources/${webinarId}`, { state: baseState });
        break;
        
      default:
        console.warn('Unknown action:', action);
    }
  };
 const handleDeleteWebinar = async (webinarId) => {
    const webinar = webinars.find(w => w.id === webinarId || w.webinarId === webinarId);
    if (!webinar) {
      showToast('Webinar not found', 'error');
      return;
    }

    const confirmMessage = `Are you sure you want to delete "${webinar.title}"?\n\nType: ${webinar.webinar_type.toUpperCase()}\nThis action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Use the correct API endpoint - delete by PK (id)
      await axiaxiosInstancelete(`/webinars/${webinar.id}/delete/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      // Remove from local state
      setWebinars(prev => prev.filter(w => w.id !== webinarId && w.webinarId !== webinarId));
      setSelectedWebinars(prev => prev.filter(id => id !== webinarId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total_webinars: prev.total_webinars - 1,
        live_webinars: webinar.webinar_type === 'live' ? prev.live_webinars - 1 : prev.live_webinars,
        recorded_webinars: webinar.webinar_type === 'recorded' ? prev.recorded_webinars - 1 : prev.recorded_webinars
      }));

      showToast(`${webinar.webinar_type.charAt(0).toUpperCase() + webinar.webinar_type.slice(1)} webinar "${webinar.title}" deleted successfully`, 'success');
      
    } catch (error) {
      console.error('Error deleting webinar:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to delete webinar';
      showToast(errorMessage, 'error');
    }
  };


// const handleDuplicateWebinar = (webinarId) => {
//   const webinarToDuplicate = webinars.find(w => w.id === webinarId || w.webinarId === webinarId);
  
//   if (webinarToDuplicate) {
//     // Create a copy of the webinar data for duplication
//     const duplicatedWebinar = {
//       ...webinarToDuplicate,
//       title: `${webinarToDuplicate.title} (Copy)`,
//       // Remove unique identifiers
//       id: undefined,
//       webinarId: undefined,
//       // Reset dates to future
//       date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
//     };
    
//     navigate('/admin/create', {
//       state: {
//         duplicateData: duplicatedWebinar,
//         isDuplicate: true,
//         originalWebinar: webinarToDuplicate
//       }
//     });
//   }
// };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Webinars...</h2>
            <p className="text-gray-600">Please wait while we fetch your webinars data.</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Webinars</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
const renderCalendarView = () => {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // ENHANCED: Group webinars by date with type filtering
  const webinarsByDate = {};
  filteredWebinars.forEach(webinar => {
    // For live webinars, use scheduled_date
    // For recorded webinars, use created_at date as they're always available
    let webinarDate;
    
    if (webinar.webinar_type === 'live' && webinar.date) {
      webinarDate = new Date(webinar.date);
    } else if (webinar.webinar_type === 'recorded') {
      // For recorded webinars, show on creation date or use today if always available
      webinarDate = webinar.created_at ? new Date(webinar.created_at) : new Date();
    }
    
    if (webinarDate && webinarDate.getFullYear() === year && webinarDate.getMonth() === month) {
      const dayKey = webinarDate.getDate();
      if (!webinarsByDate[dayKey]) {
        webinarsByDate[dayKey] = [];
      }
      webinarsByDate[dayKey].push(webinar);
    }
  });
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentCalendarDate);
    newDate.setMonth(currentCalendarDate.getMonth() + direction);
    setCurrentCalendarDate(newDate);
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // ADDED: Get webinar display info with type-specific styling
  const getWebinarDisplayStyle = (webinar) => {
    if (webinar.webinar_type === 'recorded') {
      return {
        bgColor: 'bg-gradient-to-r from-purple-100 to-indigo-100',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800',
        statusIcon: '📹'
      };
    }
    
    // Live webinar status-based styling
    switch (webinar.status) {
      case 'scheduled':
        return {
          bgColor: 'bg-gradient-to-r from-blue-100 to-cyan-100',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          statusIcon: '📅'
        };
      case 'live':
        return {
          bgColor: 'bg-gradient-to-r from-red-100 to-orange-100',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          statusIcon: '🔴',
          animate: 'animate-pulse'
        };
      case 'completed':
        return {
          bgColor: 'bg-gradient-to-r from-green-100 to-emerald-100',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          statusIcon: '✅'
        };
      case 'available':
        return {
          bgColor: 'bg-gradient-to-r from-emerald-100 to-teal-100',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-800',
          statusIcon: '✅'
        };
      default:
        return {
          bgColor: 'bg-gradient-to-r from-red-100 to-pink-100',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          statusIcon: '❌'
        };
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 rounded-2xl p-8 shadow-xl"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {monthNames[month]} {year}
        </h3>
        <div className="flex space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              iconName="ChevronLeft" 
              className="border-purple-300 hover:bg-purple-50"
              onClick={() => navigateMonth(-1)}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              iconName="ChevronRight" 
              className="border-purple-300 hover:bg-purple-50"
              onClick={() => navigateMonth(1)}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Calendar Grid - Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-2">
          {/* Calendar headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const dayWebinars = day ? webinarsByDate[day] || [] : [];
            const hasWebinars = dayWebinars.length > 0;
            
            return (
              <motion.div
                key={index}
                whileHover={day ? { scale: 1.02 } : {}}
                className={`p-2 min-h-[120px] rounded-xl border-2 transition-all duration-200 ${
                  day ? 
                  'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-purple-300 hover:shadow-md' : 
                  'bg-gray-100 border-gray-200'
                } ${hasWebinars ? 'border-purple-400 shadow-lg' : ''}`}
              >
                {day && (
                  <>
                    <div className="text-sm font-bold text-gray-800 mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayWebinars.slice(0, 2).map((webinar, webinarIndex) => {
                        const style = getWebinarDisplayStyle(webinar);
                        return (
                          <motion.div
                            key={webinar.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-1.5 rounded-md text-xs cursor-pointer transition-all duration-200 truncate ${style.bgColor} ${style.textColor} border ${style.borderColor} ${style.animate || ''}`}
                            onClick={() => handleWebinarAction('view', webinar.webinarId)}
                            title={`${webinar.title} - ${webinar.instructor.name} (${webinar.webinar_type.toUpperCase()})`}
                          >
                            <div className="flex items-center space-x-1">
                              <span>{style.statusIcon}</span>
                              <div className="font-semibold truncate flex-1">
                                {webinar.title.substring(0, 10)}...
                              </div>
                              <span className="text-xs font-bold">
                                {webinar.webinar_type === 'live' ? 'L' : 'R'}
                              </span>
                            </div>
                            <div className="text-xs opacity-75">
                              {webinar.webinar_type === 'live' && webinar.date ? 
                                new Date(webinar.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
                                'On-Demand'
                              }
                            </div>
                          </motion.div>
                        );
                      })}
                      {dayWebinars.length > 2 && (
                        <div className="text-xs text-purple-600 font-semibold bg-purple-100 rounded-md p-1 text-center">
                          +{dayWebinars.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Calendar List View - Mobile & Tablet */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => {
            const weekStart = weekIndex * 7;
            const weekDays = calendarDays.slice(weekStart, weekStart + 7);
            const hasAnyWebinars = weekDays.some(day => day && webinarsByDate[day]?.length > 0);
            
            if (!hasAnyWebinars && weekDays.every(day => !day)) return null;
            
            return (
              <div key={weekIndex} className="bg-white rounded-xl border-2 border-purple-200 p-4 shadow-md">
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center text-xs font-bold text-purple-700 p-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {weekDays.map((day, dayIndex) => {
                    const dayWebinars = day ? webinarsByDate[day] || [] : [];
                    const hasWebinars = dayWebinars.length > 0;
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`aspect-square flex items-center justify-center text-sm font-semibold rounded-lg border ${
                          day ? 
                          `${hasWebinars ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-gray-50 border-gray-200 text-gray-700'}` :
                          'border-transparent'
                        }`}
                      >
                        {day || ''}
                      </div>
                    );
                  })}
                </div>
                
                {/* List webinars for this week */}
                <div className="space-y-2">
                  {weekDays
                    .filter(day => day && webinarsByDate[day]?.length > 0)
                    .map(day => {
                      const dayWebinars = webinarsByDate[day];
                      return dayWebinars.map(webinar => {
                        const style = getWebinarDisplayStyle(webinar);
                        return (
                          <motion.div
                            key={webinar.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${style.bgColor} ${style.borderColor} ${style.animate || ''}`}
                            onClick={() => handleWebinarAction('view', webinar.webinarId)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span>{style.statusIcon}</span>
                                  <div className="font-semibold text-sm text-gray-900">{webinar.title}</div>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                    webinar.webinar_type === 'live' ? 'bg-green-200 text-green-800' : 'bg-purple-200 text-purple-800'
                                  }`}>
                                    {webinar.webinar_type === 'live' ? 'LIVE' : 'RECORDED'}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mb-1">by {webinar.instructor.name}</div>
                                <div className="flex items-center space-x-3 text-xs">
                                  <span className="font-semibold text-purple-700">Day {day}</span>
                                  <span className="text-gray-600">
                                    {webinar.webinar_type === 'live' && webinar.date ? 
                                      new Date(webinar.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
                                      'Available Now'
                                    }
                                  </span>
                                </div>
                              </div>
                              <div className="ml-2">
                                {getStatusBadge(webinar.status, webinar.webinar_type)}
                              </div>
                            </div>
                          </motion.div>
                        );
                      });
                    })
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* ENHANCED: Calendar Legend with webinar types */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
        {[
          { color: 'from-blue-100 to-cyan-100', border: 'border-blue-200', label: 'Live - Scheduled', icon: '📅' },
          { color: 'from-red-100 to-orange-100', border: 'border-red-200', label: 'Live - Live Now', icon: '🔴' },
          { color: 'from-green-100 to-emerald-100', border: 'border-green-200', label: 'Live - Completed', icon: '✅' },
          { color: 'from-purple-100 to-indigo-100', border: 'border-purple-200', label: 'Recorded Content', icon: '📹' }
        ].map(item => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className={`w-4 h-4 bg-gradient-to-r ${item.color} border ${item.border} rounded-full flex items-center justify-center`}>
              <span className="text-xs">{item.icon}</span>
            </div>
            <span className="text-gray-700 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      
      {/* ENHANCED: Month Summary with webinar types */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
        <h4 className="font-bold text-purple-800 mb-2">This Month Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-700">
              {filteredWebinars.filter(w => {
                const d = w.date ? new Date(w.date) : (w.created_at ? new Date(w.created_at) : null);
                return d && d.getFullYear() === year && d.getMonth() === month && 
                       w.webinar_type === 'live' && w.status === 'scheduled';
              }).length}
            </div>
            <div className="text-blue-600">Live Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-700">
              {filteredWebinars.filter(w => {
                return w.webinar_type === 'live' && w.status === 'live';
              }).length}
            </div>
            <div className="text-red-600">Live Now</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-700">
              {filteredWebinars.filter(w => {
                const d = w.date ? new Date(w.date) : (w.created_at ? new Date(w.created_at) : null);
                return d && d.getFullYear() === year && d.getMonth() === month && 
                       w.webinar_type === 'live' && w.status === 'completed';
              }).length}
            </div>
            <div className="text-green-600">Live Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-700">
              {filteredWebinars.filter(w => {
                const d = w.created_at ? new Date(w.created_at) : null;
                return d && d.getFullYear() === year && d.getMonth() === month && 
                       w.webinar_type === 'recorded';
              }).length}
            </div>
            <div className="text-purple-600">Recorded</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-700">
              {filteredWebinars.filter(w => {
                const d = w.date ? new Date(w.date) : (w.created_at ? new Date(w.created_at) : null);
                return d && d.getFullYear() === year && d.getMonth() === month;
              }).length}
            </div>
            <div className="text-indigo-600">Total</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

  const handleBulkDelete = () => {
    if (selectedWebinars.length > 0) {
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedWebinars.length} webinar(s)?`);
      if (confirmed) {
        console.log('Deleting webinars:', selectedWebinars);
        setSelectedWebinars([]);
      }
    }
  };

  const handleBulkDuplicate = () => {
    if (selectedWebinars.length > 0) {
      console.log('Duplicating webinars:', selectedWebinars);
      setSelectedWebinars([]);
    }
  };

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

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                 Webinar Management
              </h1>
           <p className="text-gray-600 mt-2 text-lg">
                   Oversee all webinars across the platform ✨
                 </p>
                {stats.currently_live > 0 && (
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full border border-red-300"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{stats.currently_live} Live Now</span>
                  </motion.div>
                )}
            </div>
          </div>
        </motion.div>
     <motion.div 
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" 
  initial="hidden" 
  animate="visible" 
  variants={fadeVariants}
>
  {statsCards.map((data, idx) => (
    <motion.div
      key={data.title}
      whileHover={{ y: -8, scale: 1.05, rotateY: 5 }}
      variants={fadeVariants}
      custom={idx}
      className={`rounded-3xl cursor-pointer p-6 shadow-2xl border-0 bg-gradient-to-br ${data.color} transition-all duration-300 relative overflow-hidden ${
        data.pulse ? 'animate-pulse ring-4 ring-red-300/50' : ''
      }`}
    >
      <div className={`absolute inset-0 ${data.bgPattern} opacity-50`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-white/90 font-semibold">{data.title}</p>
            <div className={`text-3xl font-black ${data.text} drop-shadow-lg`}>
              {data.value}
            </div>
          </div>
          <motion.div
            variants={iconVariants}
            custom={idx}
            whileHover="hover"
            className="cursor-pointer bg-white/20 p-3 rounded-2xl backdrop-blur-sm"
          >
            <Icon name={data.icon} size={32} className="text-white drop-shadow-md" />
          </motion.div>
        </div>
        <div className="text-sm text-white/90 font-medium">{data.sub}</div>
        {data.trend && (
          <div className="mt-2">
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
              {data.trend}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  ))}
</motion.div>
        {/* Secondary Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" 
          initial="hidden" 
          animate="visible" 
          variants={fadeVariants}
        >
          {secondaryStatsCards.map((stat, idx) => (
            <motion.div
              key={stat.title}
              whileHover={{ y: -4, scale: 1.02 }}
              variants={fadeVariants}
              custom={idx + 4}
              className={`rounded-2xl cursor-pointer p-4 shadow-lg border bg-gradient-to-br ${stat.color} transition-all duration-300 relative overflow-hidden ${
                stat.pulse ? 'animate-pulse ring-2 ring-red-300/50' : ''
              }`}
            >
              <div className={`absolute inset-0 ${stat.bgPattern} opacity-50`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-white/90 font-semibold uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <Icon name={stat.icon} size={20} className="text-white/80" />
                </div>
                <div className="text-xl font-bold text-white drop-shadow mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/80">{stat.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
         {/* {stats.popular_categories && stats.popular_categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-2xl shadow-xl p-6 mb-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="TrendingUp" size={20} className="mr-2 text-purple-600" />
              Popular Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.popular_categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="text-lg font-bold text-purple-800">{category.webinar_count}</div>
                  <div className="text-sm text-gray-700 font-medium">{category.name}</div>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(category.webinar_count / stats.total_webinars) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((category.webinar_count / stats.total_webinars) * 100).toFixed(1)}% of total
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )} */}
                {/* Zoom Integration Status Section */}
        {/* {stats.zoom_integrated_webinars > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-xl p-6 mb-6"
          >
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
              <Icon name="Video" size={20} className="mr-2 text-blue-600" />
              Zoom Integration Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/50 rounded-xl p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">
                  {stats.zoom_integrated_webinars}
                </div>
                <div className="text-sm text-blue-700 font-medium">Zoom Integrated</div>
                <div className="text-xs text-blue-600 mt-1">
                  {((stats.zoom_integrated_webinars / stats.live_webinars) * 100).toFixed(1)}% of live webinars
                </div>
              </div>
              
              <div className="bg-white/50 rounded-xl p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {stats.auto_converted_webinars}
                </div>
                <div className="text-sm text-green-700 font-medium">Auto-Converted</div>
                <div className="text-xs text-green-600 mt-1">
                  Live → Recorded conversion
                </div>
              </div>
              
              <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-800">
                  {stats.with_recordings}
                </div>
                <div className="text-sm text-purple-700 font-medium">With Recordings</div>
                <div className="text-xs text-purple-600 mt-1">
                  Available for replay
                </div>
              </div>
            </div>
          </motion.div>
        )} */}

        {/* Live Status Banner */}
        {stats.currently_live > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl shadow-2xl p-6 mb-6 border-4 border-red-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <Icon name="Radio" size={24} className="text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">Live Sessions Active</h3>
                  <p className="text-red-100">
                    {stats.currently_live} webinar{stats.currently_live !== 1 ? 's' : ''} broadcasting live right now
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600"
                onClick={() => setStatusFilter('live')}
              >
                View Live Sessions
              </Button>
            </div>
          </motion.div>
        )}



        {/* View Toggle and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-6 mb-6 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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
                  onClick={() => navigate("/admin/create")}
                  iconName="Plus"
                  iconPosition="left"
                  className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg border-0 font-semibold"
                >
                  Create Webinar
                </Button>
              </motion.div>

              {selectedWebinars.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-3" 
                  initial="hidden" 
                  animate="visible" 
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}
                >
                  {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDuplicate}
                      iconName="Copy"
                      iconPosition="left"
                      className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold"
                    >
                      Duplicate ({selectedWebinars.length})
                    </Button>
                  </motion.div> */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="flex flex-row items-center justify-end gap-4 w-full sm:w-auto"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="🔍 Search webinars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-70 bg-white/70 border-2 border-purple-200 focus:border-purple-400 rounded-xl pl-4 pr-10 font-medium"
                />
              </div>
           
              <motion.div
                className="flex border-2 border-purple-300 rounded-xl overflow-hidden shadow-md bg-white"
                whileHover={{ scale: 1.05 }}
                role="group"
              >
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-3 flex items-center justify-center transition-all duration-300 ${
                    viewMode === "table"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                  }`}
                >
                  <Icon name="List" size={18} />
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`p-3 flex items-center justify-center transition-all duration-300 ${
                    viewMode === "calendar"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                  }`}
                >
                  <Icon name="Calendar" size={18} />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        {viewMode === 'calendar' ? renderCalendarView() : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="px-6 py-5 border-b-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-xl font-bold text-purple-800">
                      📊 {filteredWebinars.length} webinar(s) found
                    </h3>
                    <Select
                      options={itemsPerPageOptions}
                      value={itemsPerPage}
                      onChange={setItemsPerPage}
                      className="w-full sm:w-auto border-2 border-purple-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="hidden lg:block">
                    <table className="w-full">
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
                            <button
                              onClick={() => handleSort('title')}
                              className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider hover:text-purple-900 transition-colors duration-200"
                            >
                              <span>📚 Title</span>
                              {renderSortIcon('title')}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleSort('instructor')}
                                className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider hover:text-purple-900 transition-colors duration-200"
                              >
                                <span>👨‍🏫 Instructor</span>
                                {renderSortIcon('instructor')}
                              </button>

                              <div className="relative filter-dropdown">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowInstructorDropdown(!showInstructorDropdown)}
                                  className={`p-1 rounded-full transition-colors duration-200 ${
                                    instructorFilter ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                  }`}
                                  title="Filter by instructor"
                                >
                                  <Icon name="Filter" size={14} />
                                </motion.button>
                                {showInstructorDropdown && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-8 left-0 z-50 bg-white border-2 border-purple-200 rounded-xl shadow-xl min-w-[180px]"
                                  >
                                    <div className="py-2">
                                      {instructorOptions.map((option) => (
                                        <button
                                          key={option.value}
                                          onClick={() => {
                                            setInstructorFilter(option.value);
                                            setShowInstructorDropdown(false);
                                          }}
                                          className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                                            instructorFilter === option.value ? 'bg-purple-100 text-purple-800 font-semibold' : 'text-gray-700'
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
                              onClick={() => handleSort('date')}
                              className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider hover:text-purple-900 transition-colors duration-200"
                            >
                              <span>📅 Date & Time</span>
                              {renderSortIcon('date')}
                            </button>
                          </th>
                             <th className="px-6 py-4 text-left">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-purple-800 uppercase tracking-wider">
                               Webinar Type
                              </span>
                            <div className="relative filter-dropdown">
                  <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                  className={`p-1 rounded-full transition-colors duration-200 ${
                                    typeFilter ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                  }`}
                                  title="Filter by status"
                                >
                                  <Icon name="Filter" size={14} />
                                </motion.button>
                {showTypeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-12 left-0 z-50 bg-white border-2 border-purple-200 rounded-xl shadow-xl min-w-150px"
                  >
                    <div className="py-2">
                      {typeOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setTypeFilter(option.value);
                            setShowTypeDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                            typeFilter === option.value 
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
                              <span className="text-sm font-bold text-purple-800 uppercase tracking-wider">
                                🏷️ Status
                              </span>
                              <div className="relative filter-dropdown">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                  className={`p-1 rounded-full transition-colors duration-200 ${
                                    statusFilter ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
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
                                      {statusOptions.map((option) => (
                                        <button
                                          key={option.value}
                                          onClick={() => {
                                            setStatusFilter(option.value);
                                            setShowStatusDropdown(false);
                                          }}
                                          className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                                            statusFilter === option.value ? 'bg-purple-100 text-purple-800 font-semibold' : 'text-gray-700'
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
                              onClick={() => handleSort('attendees')}
                              className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider hover:text-purple-900 transition-colors duration-200"
                            >
                              <span>👥 Enrolled</span>
                              {renderSortIcon('attendees')}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left">
                            <button
                              onClick={() => handleSort('revenue')}
                              className="flex items-center space-x-2 text-sm font-bold text-purple-800 uppercase tracking-wider hover:text-purple-900 transition-colors duration-200"
                            >
                              <span>💰 Revenue</span>
                              {renderSortIcon('revenue')}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                            ⚡ Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-purple-100">
                        <AnimatePresence>
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
                                    <Image
                                      src={webinar.thumbnail}
                                      alt={webinar.title}
                                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm font-bold text-gray-900 truncate hover:text-purple-700 transition-colors duration-200">
                                      {webinar.title}
                                    </div>
                                    <div className="text-xs text-purple-600 font-semibold bg-purple-100 px-2 py-1 rounded-full mt-1 inline-block">
                                      {webinar.category}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-300 shadow-sm">
                                    <Image
                                      src={webinar.instructor.avatar}
                                      alt={webinar.instructor.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="text-sm font-bold text-gray-900 hover:text-purple-700 transition-colors duration-200">
                                    {webinar.instructor.name}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">
                                  {formatDate(webinar.date)}
                                </div>
                                <div className="text-xs text-purple-600 font-semibold">
                                  {formatTime(webinar.date)}
                                </div>
                              </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                          {getTypeBadge(webinar.webinar_type)}
                        </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(webinar.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">
                                  {webinar.attendees}/{webinar.maxCapacity}
                                </div>
                                <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-2 mt-2 shadow-inner">
                                  <motion.div
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full shadow-sm"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(webinar.attendees / webinar.maxCapacity) * 100}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full border border-green-300">
                                  {formatCurrency(webinar.revenue)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-1">
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                       onClick={() => handleWebinarAction('edit', webinar.webinarId)}
                                
                                      iconName="Edit"
                                      title="Edit Webinar"
                                      className="text-blue-600 hover:bg-blue-100 border border-blue-200 hover:border-blue-300"
                                    />
                                  </motion.div>
                                  {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                            onClick={() => handleWebinarAction('resources', webinar.webinarId)}
                                
                                      iconName="Upload"
                                      title="Upload Resources"
                                      className="text-purple-600 hover:bg-purple-100 border border-purple-200 hover:border-purple-300"
                                    />
                                  </motion.div> */}
                                  {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                        onClick={() => handleWebinarAction('analytics', webinar.webinarId)}
                                
                                      iconName="BarChart3"
                                      title="View Analytics"
                                      className="text-green-600 hover:bg-green-100 border border-green-200 hover:border-green-300"
                                    />
                                  </motion.div> */}
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                         onClick={() => handleWebinarAction('view', webinar.webinarId)}
                                
                                      iconName="Eye"
                                      title="View Public Page"
                                      className="text-cyan-600 hover:bg-cyan-100 border border-cyan-200 hover:border-cyan-300"
                                    />
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                       onClick={() => handleWebinarAction('delete', webinar.webinarId)}
                                
                                      iconName="Trash2"
                                      title="Delete Webinar"
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
                              statusFilter ? 'bg-purple-600 text-white shadow-md' : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50'
                            }`}
                          >
                            <Icon name="Filter" size={16} />
                            <span>Status</span>
                            {statusFilter && <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs">{statusOptions.find(s => s.value === statusFilter)?.label}</span>}
                          </motion.button>
                          {showStatusDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-12 left-0 z-50 bg-white border-2 border-purple-200 rounded-xl shadow-xl min-w-[150px]"
                            >
                              <div className="py-2">
                                {statusOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      setStatusFilter(option.value);
                                      setShowStatusDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                                      statusFilter === option.value ? 'bg-purple-100 text-purple-800 font-semibold' : 'text-gray-700'
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Instructor Filter */}
                        <div className="relative filter-dropdown">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowInstructorDropdown(!showInstructorDropdown)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                              instructorFilter ? 'bg-purple-600 text-white shadow-md' : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50'
                            }`}
                          >
                            <Icon name="Filter" size={16} />
                            <span>Instructor</span>
                            {instructorFilter && <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs max-w-20 truncate">{instructorFilter}</span>}
                          </motion.button>
                          {showInstructorDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-12 left-0 z-50 bg-white border-2 border-purple-200 rounded-xl shadow-xl min-w-[180px]"
                            >
                              <div className="py-2">
                                {instructorOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      setInstructorFilter(option.value);
                                      setShowInstructorDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors duration-200 ${
                                      instructorFilter === option.value ? 'bg-purple-100 text-purple-800 font-semibold' : 'text-gray-700'
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
                            if (sortBy === 'date') {
                              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                            } else {
                              setSortBy('date');
                              setSortOrder('desc');
                            }
                          }}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <Icon name="Calendar" size={16} />
                          <span>Sort by Date</span>
                          {sortBy === 'date' && <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} />}
                        </motion.button>

                        {/* Clear Filters */}
                        {(statusFilter || instructorFilter) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setStatusFilter('');
                              setInstructorFilter('');
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
                        {paginatedWebinars.map((webinar, index) => (
                          <motion.div 
                            key={webinar.id} 
                            variants={rowVariants}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            className="border-2 border-purple-200 rounded-2xl p-5 space-y-4 bg-gradient-to-br from-white to-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex items-start space-x-4">
                              <input
                                type="checkbox"
                                checked={selectedWebinars.includes(webinar.id)}
                                onChange={() => handleSelectWebinar(webinar.id)}
                                className="mt-1 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                              />
                              <div className="w-20 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md border-2 border-purple-200">
                                <Image
                                  src={webinar.thumbnail}
                                  alt={webinar.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">
                                  {webinar.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full overflow-hidden border border-purple-300">
                                    <Image
                                      src={webinar.instructor.avatar}
                                      alt={webinar.instructor.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-xs text-purple-700 font-semibold">
                                    {webinar.instructor.name}
                                  </p>
                                </div>
                                <p className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full mt-2 inline-block">
                                  {webinar.category}
                                </p>
                              </div>
                              {getStatusBadge(webinar.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                                <span className="text-blue-700 font-semibold block">📅 Date:</span>
                                <div className="font-bold text-blue-900">{formatDate(webinar.date)}</div>
                                <div className="text-xs text-blue-600">{formatTime(webinar.date)}</div>
                              </div>
                              <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                                <span className="text-green-700 font-semibold block">💰 Revenue:</span>
                                <div className="font-bold text-green-900">{formatCurrency(webinar.revenue)}</div>
                              </div>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-purple-700 font-semibold">👥 Enrolled:</span>
                                <span className="font-bold text-purple-900">
                                  {webinar.attendees}/{webinar.maxCapacity}
                                </span>
                              </div>
                              <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
                                <motion.div
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full shadow-sm"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(webinar.attendees / webinar.maxCapacity) * 100}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-3 border-t border-purple-200">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                    onClick={() => handleWebinarAction('edit', webinar.webinarId)}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold"
                                >
                                  Edit
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleWebinarAction('analytics', webinar.webinarId)}
                                  className="border-green-300 text-green-700 hover:bg-green-50 font-semibold"
                                >
                                  Analytics
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                    onClick={() => handleWebinarAction('view', webinar.webinarId)}
                                  className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 font-semibold"
                                >
                                  View
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                   onClick={() => handleWebinarAction('delete', webinar.webinarId)}
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
                        Showing <span className="font-bold text-purple-900">{startIndex + 1}</span> to <span className="font-bold text-purple-900">{Math.min(startIndex + parseInt(itemsPerPage), sortedWebinars.length)}</span> of <span className="font-bold text-purple-900">{sortedWebinars.length}</span> results
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            iconName="ChevronLeft"
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
                            iconName="ChevronRight"
                            className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Empty State */}
                {filteredWebinars.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 px-6 bg-gradient-to-br from-purple-50 to-pink-50"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon name="Video" size={64} className="mx-auto mb-6 text-purple-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-purple-900 mb-3">No webinars found 🔍</h3>
                    <p className="text-purple-600 mb-8 max-w-md mx-auto font-medium">
                      {searchTerm || statusFilter || instructorFilter
                        ? 'Try adjusting your search and filters to find what you\'re looking for.'
                        : 'Start your journey by creating your first amazing webinar!'}
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="default"
                        onClick={() => navigate('/admin/create')}
                        iconName="Plus"
                        iconPosition="left"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl border-0 font-bold text-lg px-8 py-3"
                      >
                        🚀 Create Your First Webinar
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarManagement;