import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosInstance';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
const formatScheduleDateTime = (utcDateString) => {
  if (!utcDateString) return { dateString: 'TBA', timeString: 'TBA', formattedDateTime: null };
  
  try {
    const utcDate = new Date(utcDateString);
    
    // Helper to format 12-hour time
    const format12h = (hours, minutes) => {
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
    
    // IST is UTC+5:30
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
    const istTime = format12h(istDate.getUTCHours(), istDate.getUTCMinutes()) + ' IST';
    
    // PST is UTC-8 (or UTC-7 during PDT - adjust based on your needs)
    const pstDate = new Date(utcDate.getTime() - 8 * 60 * 60 * 1000);
    const pstTime = format12h(pstDate.getUTCHours(), pstDate.getUTCMinutes()) + ' PST';
    
    // EST is UTC-5 (or UTC-4 during EDT - adjust based on your needs)
    const estDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);
    const estTime = format12h(estDate.getUTCHours(), estDate.getUTCMinutes()) + ' EST';
    
    // Format date
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[istDate.getUTCMonth()];
    const day = istDate.getUTCDate();
    const year = istDate.getUTCFullYear();
    
    const dateString = `${month} ${day}, ${year}`;
    const timeString = `${pstTime} | ${estTime}`;
    
    return { 
      dateString, 
      timeString,
      formattedDateTime: `${dateString} at ${istTime}`
    };
  } catch (error) {
    console.error('Error formatting schedule date:', error);
    return { dateString: 'TBA', timeString: 'TBA', formattedDateTime: null };
  }
};

/**
 * Generate SEO-friendly slug from title
 * @param {string} title - Webinar title
 * @returns {string} - URL-safe slug
 */
const generateSlug = (title) => {
  if (!title) return 'untitled';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .trim();
};

/**
 * Generate webinar URL based on access type
 * @param {object} webinar - Webinar object with id, title, access_type, status
 * @returns {string} - Complete URL path
 */
const getWebinarUrl = (webinar) => {
  const slug = generateSlug(webinar.title);
  const webinarId =  webinar.webinar_id;
  
  // Determine if it's live or recorded
  const isRecorded = webinar.access_type === 'recorded' || 
                     webinar.status === 'recorded' ||
                     webinar.is_recorded === true;
  
  if (isRecorded) {
    return `/recorded-webinar/${webinarId}/${slug}`;
  } else {
    return `/live-webinar/${webinarId}/${slug}`;
  }
};
const MyEnrollments = () => {
  const navigate = useNavigate();
  // UPDATED: 'recorded' tab is supported by this state
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('card');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // API data state
  const [enrollments, setEnrollments] = useState([]);
  const [insights, setInsights] = useState({
    totalEnrollments: 0,
    totalSpent: 0,
    completionRate: 0,
    upcomingCount: 0,
    recordingsOwned: 0 // FIX: This will now be correctly updated after fetch
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper functions
  const calculateTotalSpent = (enrollmentsList) => {
    if (!Array.isArray(enrollmentsList)) return 0;
    return enrollmentsList.reduce((sum, e) => sum + (parseFloat(e.payment_amount) || parseFloat(e.amount_paid) || 0), 0);
  };

  const calculateCompletionRate = (stats) => {
    if (!stats || stats.total_enrollments === 0) return 0;
    return Math.round(((stats.attended_webinars || stats.completed_enrollments || 0) / stats.total_enrollments) * 100);
  };

  const countByStatus = (enrollmentsList, status) => {
    if (!Array.isArray(enrollmentsList)) return 0;
    return enrollmentsList.filter(e => e.status === status).length;
  };

  // Map API status to frontend status
  const mapStatus = (apiStatus, accessType) => {
    const statusMap = {
      // If access is recorded, treat it as 'recorded' status regardless of enrollment status
      'enrolled': accessType && accessType.includes('recorded') ? 'recorded' : 'upcoming', 
      'attended': 'completed',
      'missed': 'missed',
      'cancelled': 'missed',
      // 'available' is often used for recorded content status
      'available': accessType && accessType.includes('recorded') ? 'recorded' : 'upcoming',
    };
    return statusMap[apiStatus] || apiStatus;
  };
  
  // Note: calculateInsightsFromEnrollments is removed as its logic is now inline in fetchEnrollmentsData

  // Fetch enrollments and stats on component mount
  useEffect(() => {
    fetchEnrollmentsData();
  }, []);

  const fetchEnrollmentsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [enrollmentsResponse, statsResponse] = await Promise.all([
        axiosInstance.get('/enrollments/my/'),
        // Catch the stats failure silently, but proceed with the main data
        axiosInstance.get('/enrollments/user/stats/').catch(() => ({ data: { success: false } }))
      ]);

      let enrollmentsData = [];
      if (enrollmentsResponse.data) {
        if (enrollmentsResponse.data.success !== false) {
          enrollmentsData = enrollmentsResponse.data.results || 
                           enrollmentsResponse.data.enrollments || 
                           (Array.isArray(enrollmentsResponse.data) ? enrollmentsResponse.data : []);
        }
      }
      
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);

      // ----------------------------------------------------
      // FIX: Always calculate derived insights locally for accuracy
      // ----------------------------------------------------
      const totalSpent = calculateTotalSpent(enrollmentsData);
      
      // Calculate derived insights from the enrollment list using the frontend mapping
      const locallyDerivedInsights = (() => {
          const transformedList = enrollmentsData.map(e => ({
              ...e,
              frontendStatus: mapStatus(e.status, e.access_type)
          }));
  
          const totalEnrollments = transformedList.length;
          const attendedCount = transformedList.filter(e => e.frontendStatus === 'completed').length;
          const upcomingCount = transformedList.filter(e => e.frontendStatus === 'upcoming').length;
          const completionRate = totalEnrollments > 0 
              ? Math.round((attendedCount / totalEnrollments) * 100) 
              : 0;
  
          const recordingsOwned = transformedList.filter(e => 
              e.frontendStatus === 'recorded' || 
              (e.frontendStatus === 'completed' && (e.certificate_issued || e.recording_owned))
          ).length;

          return { totalEnrollments, completionRate, upcomingCount, recordingsOwned };
      })();
      // ----------------------------------------------------
      

      if (statsResponse.data && statsResponse.data.success && statsResponse.data.stats) {
        const stats = statsResponse.data.stats;
        
        // Use backend stats for Total/Completion/Upcoming/Spent if available, 
        // but prioritize the locally derived Recordings count.
        setInsights({
          totalEnrollments: stats.total_enrollments || locallyDerivedInsights.totalEnrollments,
          totalSpent: stats.total_spent || totalSpent,
          completionRate: stats.completion_rate || locallyDerivedInsights.completionRate,
          upcomingCount: stats.upcoming_count || locallyDerivedInsights.upcomingCount,
          
          // CRITICAL FIX: Use the calculated Recordings count
          recordingsOwned: locallyDerivedInsights.recordingsOwned 
        });
      } else {
        // If stats endpoint fails, use entirely locally derived insights
        setInsights({
          totalEnrollments: locallyDerivedInsights.totalEnrollments,
          totalSpent: totalSpent,
          completionRate: locallyDerivedInsights.completionRate,
          upcomingCount: locallyDerivedInsights.upcomingCount,
          recordingsOwned: locallyDerivedInsights.recordingsOwned
        });
      }

    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load enrollments. Please try again.');
      setEnrollments([]);
      setInsights({
        totalEnrollments: 0,
        totalSpent: 0,
        completionRate: 0,
        upcomingCount: 0,
        recordingsOwned: 0
      });
    } finally {
      setLoading(false);
    }
  };


  

  // Transform API data to match frontend format
 const transformEnrollment = (enrollment) => {
    const webinar = enrollment.webinar || {};
    const speaker = webinar.speaker || {};
    const category = webinar.category || {};
    const zoomAccess = webinar.zoom_access || {};
    const apiStatus = enrollment.status;
    const accessType = enrollment.access_type || 'live';
    
    // Extract Zoom URL with priority: join_url > start_url > zoom_url
    const zoomUrl = zoomAccess.join_url || 
                    zoomAccess.start_url || 
                    webinar.zoom_url || 
                    null;
    
    // Use the new formatScheduleDateTime function
    const scheduledDateTime = formatScheduleDateTime(
      webinar.scheduled_date || webinar.start_datetime || webinar.date
    );
    
    return {
      id: enrollment.id,
      title: webinar.title || 'Untitled Webinar',
      instructor: {
        name: speaker.full_name ||
              speaker.name || 
              speaker.user?.full_name || 
              (speaker.user?.first_name && speaker.user?.last_name ? 
                speaker.user.first_name + ' ' + speaker.user.last_name : '') || 
              'Unknown Instructor',
        avatar: speaker.avatar ||
                speaker.profile_image || 
                speaker.profile_picture || 
                'https://via.placeholder.com/150'
      },
      thumbnail: webinar.cover_image ||
                 webinar.cover_image_url ||
                 webinar.thumbnail || 
                 webinar.image || 
                 'https://via.placeholder.com/400x225',
      
      // UPDATED: Use formatted date and time
      date: scheduledDateTime.dateString,
      time: scheduledDateTime.timeString,
      rawDateTime: webinar.scheduled_date || webinar.start_datetime || webinar.date,
      
      duration: parseInt(webinar.duration) || parseInt(webinar.duration_minutes) || 90,
      status: mapStatus(apiStatus, accessType), 
      enrolledDate: enrollment.enrolled_at || enrollment.created_at,
      price: parseFloat(enrollment.payment_amount) || 
             parseFloat(enrollment.amount_paid) || 
             parseFloat(webinar.main_price) ||
             parseFloat(webinar.price) || 
             0,
      hasRecording: webinar.has_recording || 
                    webinar.recording_available || 
                    webinar.is_recorded || 
                    false,
      category: category.name || webinar.category_name || 'Uncategorized',
      difficulty: webinar.skill_level || 
                  webinar.difficulty || 
                  webinar.level || 
                  'intermediate',
      attendees: parseInt(webinar.enrolled_count) || 
                 parseInt(webinar.attendees_count) || 
                 parseInt(webinar.current_enrollments) || 
                 0,
      maxAttendees: parseInt(webinar.max_attendees) || 
                    parseInt(webinar.max_participants) || 
                    parseInt(webinar.capacity) || 
                    100,
      progress: parseFloat(enrollment.completion_percentage) || 0,
      recordingOwned: enrollment.certificate_issued || 
                      enrollment.has_certificate || 
                      enrollment.recording_owned || 
                      false,
      attended: enrollment.status === 'attended' || enrollment.attended_webinar,
      access_type: accessType,
      webinar_id: webinar.webinar_id,
      
      // Zoom access details
      zoomUrl: zoomUrl,
      canJoinZoom: zoomAccess.can_join || false,
      canStartZoom: zoomAccess.can_start || false,
      zoomMessage: zoomAccess.message || ''
    };
  };

  // Transform enrollments for frontend use
  const transformedEnrollments = Array.isArray(enrollments) 
    ? enrollments.map(transformEnrollment) 
    : [];

  // Categories extraction
  const categories = ['all', ...new Set(transformedEnrollments.map(e => e.category))];

  // Tab counts
  const tabs = [
    { id: 'all', label: 'All', count: transformedEnrollments.length },
    { id: 'upcoming', label: 'Upcoming', count: transformedEnrollments.filter(e => e.status === 'upcoming').length },
    { id: 'recorded', label: 'Recorded', count: transformedEnrollments.filter(e => e.status === 'recorded').length },
    { id: 'completed', label: 'Completed', count: transformedEnrollments.filter(e => e.status === 'completed').length },
    { id: 'missed', label: 'Missed', count: transformedEnrollments.filter(e => e.status === 'missed').length }
  ];

  // Enhanced filtering and sorting with pagination
  const filteredEnrollments = transformedEnrollments
    .filter(e => activeTab === 'all' || e.status === activeTab)
    .filter(e => filterCategory === 'all' || e.category === filterCategory)
    .filter(e => 
      searchQuery === '' || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date || 0) - new Date(a.date || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return b.price - a.price;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Pagination logic
  const totalItems = filteredEnrollments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredEnrollments.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterCategory, searchQuery]);

  // Handle joining webinar (used for upcoming live events)
  const handleJoinWebinar = (enrollment) => {
    try {
      const zoomUrl = enrollment.zoomUrl;
      
      if (zoomUrl) {
        console.log('✅ Opening Live Join URL:', zoomUrl);
        window.open(zoomUrl, '_blank');
      } else {
        console.error('❌ No Zoom URL available for live join:', enrollment.id);
        alert('Unable to join webinar. Zoom link not available. Please contact support.');
      }
    } catch (error) {
      console.error('💥 Error joining webinar:', error);
      alert('Failed to join webinar. Please try again or contact support.');
    }
  };
  
  // Handle opening recording (Uses zoomUrl as per request)
  const handleViewRecording = (enrollment) => {
    if (enrollment.zoomUrl) {
      console.log('▶️ Opening Recording URL:', enrollment.zoomUrl);
      window.open(enrollment.zoomUrl, '_blank');
    } else {
      console.error('❌ No Recording URL available for playback:', enrollment.id);
      alert('Unable to view recording. Link not available. Please contact support.');
    }
  };

  // Helper functions for UI
  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200',
      missed: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200',
      recorded: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200'
    };

    const labels = {
      upcoming: 'Upcoming',
      completed: 'Completed',
      missed: 'Missed',
      recorded: 'Recording'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full border shadow-sm whitespace-nowrap ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const normalizedDifficulty = difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1).toLowerCase() || 'Intermediate';
    const styles = {
      Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
      Advanced: 'bg-rose-50 text-rose-700 border-rose-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border whitespace-nowrap ${styles[normalizedDifficulty] || styles.Intermediate}`}>
        {normalizedDifficulty}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  const formatDuration = (minutes) => {
    if (minutes === null || minutes === 0) return 'TBA';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
    const handleViewDetails = (enrollment) => {
    const url = getWebinarUrl({
      title: enrollment.title,
      webinar_id: enrollment.webinar_id,
      access_type: enrollment.access_type,
      status: enrollment.status
    });
    navigate(url);
  };

  // UPDATED: getActionButton logic modified to use handleViewRecording (zoomUrl)
 const getActionButton = (enrollment) => {
    
    // Case 1: Recorded Access
    if (enrollment.status === 'recorded') {
        return (
            <Button
                variant="default"
                size="sm"
                onClick={() => handleViewRecording(enrollment)}
                iconName="Play"
                iconPosition="left"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-xs sm:text-sm"
            >
                <span className="hidden sm:inline">View Recording</span>
                <span className="sm:hidden">Play</span>
            </Button>
        );
    }

    // Case 2: Live Access (upcoming)
    if (enrollment.status === 'upcoming') {
        return (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleJoinWebinar(enrollment)}
            iconName="Video"
            iconPosition="left"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Join Webinar</span>
            <span className="sm:hidden">Join</span>
          </Button>
        );
    }
    
    // Case 3: Live Access (completed)
    if (enrollment.status === 'completed') {
        if (enrollment.hasRecording && enrollment.recordingOwned) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewRecording(enrollment)}
              iconName="Play"
              iconPosition="left"
              className="border-green-200 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">View Recording</span>
              <span className="sm:hidden">Play</span>
            </Button>
          );
        }
        return null; 
    }

    // Case 4: Live Access (missed) - Updated to use handleViewDetails
    if (enrollment.status === 'missed') {
        if (enrollment.hasRecording && !enrollment.recordingOwned) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(enrollment)} // UPDATED
              iconName="ShoppingCart"
              iconPosition="left"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Purchase Recording</span>
              <span className="sm:hidden">Buy</span>
            </Button>
          );
        }
        return null; 
    }

    return null;
  };


  const InsightsCards = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="BookOpen" size={18} className="text-blue-600 sm:w-5 sm:h-5" />
          <span className="text-xs text-blue-600 font-medium hidden sm:block">Total</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-blue-700">{insights.totalEnrollments || 0}</div>
        <div className="text-xs text-blue-600">Enrollments</div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="TrendingUp" size={18} className="text-green-600 sm:w-5 sm:h-5" />
          <span className="text-xs text-green-600 font-medium hidden sm:block">Rate</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-green-700">{insights.completionRate || 0}%</div>
        <div className="text-xs text-green-600">Completion</div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="DollarSign" size={18} className="text-purple-600 sm:w-5 sm:h-5" />
          <span className="text-xs text-purple-600 font-medium hidden sm:block">Spent</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-purple-700">${(insights.totalSpent || 0).toFixed(2)}</div>
        <div className="text-xs text-purple-600">Investment</div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Calendar" size={18} className="text-indigo-600 sm:w-5 sm:h-5" />
          <span className="text-xs text-indigo-600 font-medium hidden sm:block">Upcoming</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-indigo-700">{insights.upcomingCount || 0}</div>
        <div className="text-xs text-indigo-600">Upcoming</div>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="PlayCircle" size={18} className="text-rose-600 sm:w-5 sm:h-5" />
          <span className="text-xs text-rose-600 font-medium hidden sm:block">Owned</span>
        </div>
        {/* FIX: This now uses the correct count */}
        <div className="text-xl sm:text-2xl font-bold text-rose-700">{insights.recordingsOwned || 0}</div> 
        <div className="text-xs text-rose-600">Recordings</div>
      </div>
    </div>
  );

  const ViewToggle = () => (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setViewMode('card')}
        className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          viewMode === 'card'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Icon name="Grid3x3" size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden sm:block">Cards</span>
      </button>
      <button
        onClick={() => setViewMode('table')}
        className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          viewMode === 'table'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Icon name="List" size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden sm:block">Table</span>
      </button>
    </div>
  );

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="bg-white border-t border-gray-200 px-3 py-4 sm:px-6 rounded-b-lg">
        <div className="flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronLeft" size={16} className="mr-1" />
            Previous
          </button>
          
          <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <Icon name="ChevronRight" size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronsLeft" size={16} />
              </button>
              
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>

              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                    currentPage === pageNum
                      ? 'z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
              
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronsRight" size={16} />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const TableView = () => (
    <div className="w-full">
      <div className="block sm:hidden space-y-4">
        {currentItems.map((enrollment) => (
          <div key={enrollment.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={enrollment.thumbnail}
                    alt={enrollment.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                    {enrollment.title}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">{enrollment.instructor.name}</p>
                </div>
              </div>
              {getStatusBadge(enrollment.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} />
                <span>{formatDate(enrollment.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{formatDuration(enrollment.duration)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="DollarSign" size={12} />
                <span>{enrollment.price > 0 ? `$${enrollment.price.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Tag" size={12} />
                <span className="truncate">{enrollment.category}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                         onClick={() => handleViewDetails(enrollment)}
                // onClick={() => navigate(`/webinar-details/${enrollment.webinar_id || enrollment.id}`)}
                iconName="Eye"
                className="text-gray-600 hover:text-gray-900 text-xs"
              >
                Details
              </Button>
              {getActionButton(enrollment)}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm min-w-[900px]">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Webinar</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Instructor</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Date/Time</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Duration</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Status</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Price</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Progress</th>
              <th className="text-right p-4 font-semibold text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((enrollment, index) => (
              <tr 
                key={enrollment.id} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={enrollment.thumbnail}
                        alt={enrollment.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                        {enrollment.title}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 truncate">
                          {enrollment.category}
                        </span>
                        {/* {getDifficultyBadge(enrollment.difficulty)} */}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={enrollment.instructor.avatar}
                      alt={enrollment.instructor.name}
                      className="w-6 h-6 rounded-full flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 truncate">
                      {enrollment.instructor.name}
                    </span>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="text-sm text-gray-700 whitespace-nowrap">
                    {enrollment.status === 'recorded' ? 'On-Demand' : formatDate(enrollment.date)}
                    {enrollment.status !== 'recorded' && enrollment.time && <div className="text-xs text-gray-500">{enrollment.time}</div>}
                  </div>
                </td>
                
                <td className="p-4">
                  <span className="text-sm text-gray-700 whitespace-nowrap">
                    {formatDuration(enrollment.duration)}
                  </span>
                </td>
                
                <td className="p-4">
                  {getStatusBadge(enrollment.status)}
                </td>
                
                <td className="p-4">
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {enrollment.price > 0 ? `$${enrollment.price.toFixed(2)}` : 'Free'}
                  </span>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          enrollment.progress === 100 ? 'bg-green-500' :
                          enrollment.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap min-w-[35px]">
                      {enrollment.progress}%
                    </span>
                  </div>
                </td>
                
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                               onClick={() => handleViewDetails(enrollment)}
                      // onClick={() => navigate(`/webinar-details/${enrollment.webinar_id || enrollment.id}`)}
                      iconName="Eye"
                      className="text-gray-600 hover:text-gray-900 p-2"
                    />
                    {getActionButton(enrollment)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
const CardView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6">
    {currentItems.map((enrollment) => (
      <div 
        key={enrollment.id} 
        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-1"
      >
        {/* Thumbnail Section with Overlay */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={enrollment.thumbnail}
            alt={enrollment.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            {getStatusBadge(enrollment.status)}
          </div>
          
          {/* Recording Owned Indicator - Top Left */}
          {enrollment.recordingOwned && (
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <Icon name="CheckCircle" size={14} />
              <span>Owned</span>
            </div>
          )}
          
          {/* Duration Badge - Bottom Right */}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{formatDuration(enrollment.duration)}</span>
            
          </div>
          
          {/* Play Overlay Icon for Recordings */}
          {(enrollment.status === 'recorded' || (enrollment.status === 'completed' && enrollment.recordingOwned)) && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <Icon name="Play" size={32} className="text-purple-600 ml-1" />
              </div>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-5 sm:p-6">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
            {enrollment.title}
          </h3>
          
          {/* Instructor */}
          <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
            <div className="relative">
              <Image
                src={enrollment.instructor.avatar}
                alt={enrollment.instructor.name}
                className="w-10 h-10 rounded-full ring-2 ring-gray-100"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {enrollment.instructor.name}
              </p>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
            {/* {getDifficultyBadge(enrollment.difficulty)} */}
          </div>
          
          {/* Meta Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {/* Date/Time */}
            <div className="flex items-start space-x-2 bg-blue-50/50 rounded-lg p-3">
              <Icon name="Calendar" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">
                  {enrollment.status === 'recorded' ? 'Available' : 'Scheduled'}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {enrollment.status === 'recorded' ? 'On-Demand' : formatDate(enrollment.date)}
                  {enrollment.status !== 'recorded' && enrollment.time && <div className="text-xs text-gray-500">{enrollment.time}</div>}
               
                </p>
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-start space-x-2 bg-purple-50/50 rounded-lg p-3">
              <Icon name="DollarSign" size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Price Paid</p>
                <p className="text-sm font-bold text-gray-900">
                  {enrollment.price > 0 ? `$${enrollment.price.toFixed(2)}` : 'Free'}
                </p>
              </div>
            </div>
            
            {/* Category */}
            <div className="flex items-start space-x-2 bg-indigo-50/50 rounded-lg p-3">
              <Icon name="Tag" size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Category</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {enrollment.category}
                </p>
              </div>
            </div>
            
            {/* Attendees */}
            <div className="flex items-start space-x-2 bg-green-50/50 rounded-lg p-3">
              <Icon name="Users" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Attendees</p>
                <p className="text-sm font-bold text-gray-900">
                  {enrollment.attendees}/{enrollment.maxAttendees}
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar - Only for completed/recorded */}
          {(enrollment.status === 'completed' || enrollment.status === 'recorded') && enrollment.progress > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span className="font-medium">Progress</span>
                <span className="font-bold text-blue-600">{enrollment.progress}%</span>
              </div>
              <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${enrollment.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails(enrollment)}
              iconName="Eye"
              iconPosition="left"
              className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-300 hover:border-gray-700 text-sm font-semibold"
            >
              View Details
            </Button>
            
            {getActionButton(enrollment) && (
              <div className="flex-1">
                {getActionButton(enrollment)}
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className={`h-1 bg-gradient-to-r ${
          enrollment.status === 'upcoming' ? 'from-blue-400 to-blue-600' :
          enrollment.status === 'completed' ? 'from-green-400 to-green-600' :
          enrollment.status === 'recorded' ? 'from-purple-400 to-purple-600' :
          'from-red-400 to-red-600'
        }`} />
      </div>
    ))}
  </div>
);

  

  const getEmptyStateContent = () => {
    const emptyStates = {
      all: {
        icon: 'BookOpen',
        title: 'No enrollments yet',
        message: 'Start learning by enrolling in webinars that interest you.',
        buttonText: 'Browse Webinars',
        buttonAction: () => navigate('/browse-webinars')
      },
      upcoming: {
        icon: 'Calendar',
        title: 'No upcoming webinars',
        message: 'You don\'t have any upcoming webinars scheduled.',
        buttonText: 'Find Webinars',
        buttonAction: () => navigate('/browse-webinars')
      },
      recorded: {
        icon: 'PlayCircle',
        title: 'No purchased recordings',
        message: 'Recordings you have purchased will appear here. Find more in the Recordings section.',
        buttonText: 'Browse Recordings',
        buttonAction: () => navigate('/browse-webinars?type=recorded')
      },
      completed: {
        icon: 'CheckCircle',
        title: 'No completed webinars',
        message: 'Webinars you\'ve attended will appear here.',
        buttonText: 'Browse Webinars',
        buttonAction: () => navigate('/browse-webinars')
      },
      missed: {
        icon: 'XCircle',
        title: 'No missed webinars',
        message: 'Great! You haven\'t missed any webinars yet.',
        buttonText: 'View Upcoming',
        buttonAction: () => setActiveTab('upcoming')
      }
    };

    const content = emptyStates[activeTab];

    return (
      <div className="text-center py-12 sm:py-16">
        <Icon name={content.icon} size={48} className="mx-auto mb-4 sm:mb-6 text-gray-300 sm:w-16 sm:h-16" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{content.title}</h3>
        <p className="text-gray-600 mb-6 sm:mb-8 max-w-sm mx-auto px-4">{content.message}</p>
        <Button
          variant="default"
          onClick={content.buttonAction}
          iconName="ArrowRight"
          iconPosition="right"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          {content.buttonText}
        </Button>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Icon name="AlertCircle" size={64} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Enrollments</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={fetchEnrollmentsData} 
            variant="default"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/attendee-dashboard' },
    { label: 'My Enrollments', href: null }
  ];

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <BreadcrumbNavigation
          customBreadcrumbs={customBreadcrumbs}
          className="mb-4 sm:mb-6"
        /> */}

        {/* UPDATED: Added Quick Action Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Enrollments
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Manage your enrolled webinars and track your learning journey
              </p>
            </div>
            
            {/* Quick Actions Navigation */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/attendee/orders')}
                iconName="Receipt"
                iconPosition="left"
                className="border-blue-200 text-blue-700 hover:bg-blue-700 whitespace-nowrap text-xs sm:text-sm"
              >
                <span >Orders</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('recorded')} // New Quick Action to view recordings tab
                iconName="PlayCircle"
                iconPosition="left"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 whitespace-nowrap text-xs sm:text-sm"
              >
                <span>Recordings ({tabs.find(t => t.id === 'recorded')?.count || 0})</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Insights Cards */}
        <InsightsCards />

        {/* Filters and Controls */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search webinars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    iconName="Search"
                    className="bg-gray-50 border-gray-200 text-sm"
                  />
                </div>
                
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="price">Sort by Price</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>

              <ViewToggle />
            </div>
          </div>

          {/* Tab Navigation (Now includes 'Recorded') */}
          <div className="px-4 sm:px-6 py-4">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {currentItems.length === 0 ? (
              getEmptyStateContent()
            ) : (
              <>
                {viewMode === 'table' ? <TableView /> : <CardView />}
              </>
            )}
          </div>

          {/* Pagination Controls */}
          <PaginationControls />
        </div>
      </div>
    </div>
  );
};

export default MyEnrollments;