import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosInstance';
import AppHeader from '../../components/ui/AppHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const MyEnrollments = () => {
  const navigate = useNavigate();
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
    recordingsOwned: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper functions MUST be defined before fetchEnrollmentsData
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

  const calculateInsightsFromEnrollments = (enrollmentsList) => {
    if (!Array.isArray(enrollmentsList)) {
      setInsights({
        totalEnrollments: 0,
        totalSpent: 0,
        completionRate: 0,
        upcomingCount: 0,
        recordingsOwned: 0
      });
      return;
    }

    const totalEnrollments = enrollmentsList.length;
    const attendedCount = enrollmentsList.filter(e => e.status === 'attended').length;
    const completionRate = totalEnrollments > 0 
      ? Math.round((attendedCount / totalEnrollments) * 100) 
      : 0;

    setInsights({
      totalEnrollments,
      totalSpent: calculateTotalSpent(enrollmentsList),
      completionRate,
      upcomingCount: countByStatus(enrollmentsList, 'enrolled'),
      recordingsOwned: enrollmentsList.filter(e => e.certificate_issued || e.recording_owned).length
    });
  };

  // Fetch enrollments and stats on component mount
  useEffect(() => {
    fetchEnrollmentsData();
  }, []);

  const fetchEnrollmentsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both enrollments and stats in parallel
      const [enrollmentsResponse, statsResponse] = await Promise.all([
        axiosInstance.get('/enrollments/my/'),
        axiosInstance.get('/enrollments/user/stats/').catch(() => ({ data: { success: false } }))
      ]);

      // Process enrollments data
      let enrollmentsData = [];
      if (enrollmentsResponse.data) {
        if (enrollmentsResponse.data.success !== false) {
          enrollmentsData = enrollmentsResponse.data.results || 
                           enrollmentsResponse.data.enrollments || 
                           (Array.isArray(enrollmentsResponse.data) ? enrollmentsResponse.data : []);
        }
      }
      
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);

      // Process stats data
      if (statsResponse.data && statsResponse.data.success && statsResponse.data.stats) {
        const stats = statsResponse.data.stats;
        setInsights({
          totalEnrollments: stats.total_enrollments || 0,
          totalSpent: stats.total_spent || calculateTotalSpent(enrollmentsData),
          completionRate: stats.completion_rate || calculateCompletionRate(stats),
          upcomingCount: stats.upcoming_count || countByStatus(enrollmentsData, 'enrolled'),
          recordingsOwned: stats.certificates_earned || stats.recordings_owned || 0
        });
      } else {
        // Fallback: calculate insights from enrollments data
        calculateInsightsFromEnrollments(enrollmentsData);
      }

    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load enrollments. Please try again.');
      setEnrollments([]);
      // Set default insights on error
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

  // Map API status to frontend status
  const mapStatus = (apiStatus) => {
    const statusMap = {
      'enrolled': 'upcoming',
      'attended': 'completed',
      'missed': 'missed',
      'cancelled': 'missed'
    };
    return statusMap[apiStatus] || apiStatus;
  };

  // Format date from API
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    try {
      const date = new Date(dateTimeStr);
      return date.toISOString().split('T')[0];
    } catch {
      return dateTimeStr;
    }
  };

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return null;
    }
  };

  // Transform API data to match frontend format
  const transformEnrollment = (enrollment) => {
    const webinar = enrollment.webinar || {};
    const speaker = webinar.speaker || {};
    const category = webinar.category || {};
    
    return {
      id: enrollment.id,
      title: webinar.title || 'Untitled Webinar',
      instructor: {
        name: speaker.name || 
              speaker.user?.full_name || 
              (speaker.user?.first_name && speaker.user?.last_name ? 
                speaker.user.first_name + ' ' + speaker.user.last_name : '') || 
              'Unknown Instructor',
        avatar: speaker.profile_image || 
                speaker.profile_picture || 
                speaker.avatar || 
                'https://via.placeholder.com/150'
      },
      thumbnail: webinar.thumbnail || 
                 webinar.image || 
                 webinar.cover_image || 
                 'https://via.placeholder.com/400x225',
      date: formatDateTime(webinar.scheduled_date || webinar.start_datetime || webinar.date),
      time: formatTime(webinar.start_datetime || webinar.scheduled_date) || 
            webinar.start_time || 
            webinar.time || 
            'TBA',
      duration: parseInt(webinar.duration) || parseInt(webinar.duration_minutes) || 60,
      status: mapStatus(enrollment.status),
      enrolledDate: enrollment.enrolled_at || enrollment.created_at,
      price: parseFloat(enrollment.payment_amount) || 
             parseFloat(enrollment.amount_paid) || 
             parseFloat(webinar.price) || 
             0,
      hasRecording: webinar.has_recording || 
                    webinar.recording_available || 
                    webinar.is_recorded || 
                    false,
      category: category.name || webinar.category_name || 'Uncategorized',
      difficulty: webinar.difficulty || webinar.level || 'Intermediate',
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
      attended: enrollment.status === 'attended',
      access_type: enrollment.access_type || 'live',
      webinar_id: webinar.id
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

  // Helper functions for UI
  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200',
      missed: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200'
    };

    const labels = {
      upcoming: 'Upcoming',
      completed: 'Completed',
      missed: 'Missed'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full border shadow-sm whitespace-nowrap ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
      Advanced: 'bg-rose-50 text-rose-700 border-rose-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border whitespace-nowrap ${styles[difficulty] || styles.Intermediate}`}>
        {difficulty}
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
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // UPDATED: Removed Cancel button and Rating functionality
  const getActionButton = (enrollment) => {
    switch (enrollment.status) {
      case 'upcoming':
        return (
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate(`/attendee/join/${enrollment.id}`)}
            iconName="Video"
            iconPosition="left"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Join Webinar</span>
            <span className="sm:hidden">Join</span>
          </Button>
        );
      case 'completed':
        if (enrollment.hasRecording && enrollment.recordingOwned) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/attendee/recordings`)}
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
      case 'missed':
        if (enrollment.hasRecording && !enrollment.recordingOwned) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/attendee/recordings`)}
              iconName="ShoppingCart"
              iconPosition="left"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Purchase</span>
              <span className="sm:hidden">Buy</span>
            </Button>
          );
        }
        return null;
      default:
        return null;
    }
  };

  // UPDATED: Removed Rating card from insights
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
        <div className="text-xl sm:text-2xl font-bold text-rose-700">{insights.recordingsOwned || 0}</div>
        <div className="text-xs text-rose-600">Recordings</div>
      </div>
    </div>
  );

  // Enhanced Responsive View Toggle
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

  // Enhanced Pagination Component
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
        {/* Mobile Pagination */}
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
        
        {/* Desktop Pagination */}
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

  // Table View Component
  const TableView = () => (
    <div className="w-full">
      {/* Mobile Table View */}
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
                onClick={() => navigate(`/webinar-details/${enrollment.webinar_id || enrollment.id}`)}
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
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Date</th>
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
                        {getDifficultyBadge(enrollment.difficulty)}
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
                    {formatDate(enrollment.date)}
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
                      onClick={() => navigate(`/webinar-details/${enrollment.webinar_id || enrollment.id}`)}
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

  // UPDATED: Removed rating display from Card View
  const CardView = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      {currentItems.map((enrollment) => (
        <div key={enrollment.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-20 h-12 sm:w-24 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
              <Image
                src={enrollment.thumbnail}
                alt={enrollment.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                    {enrollment.title}
                  </h3>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm text-gray-600 mb-2 flex-wrap gap-1">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Image
                        src={enrollment.instructor.avatar}
                        alt={enrollment.instructor.name}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                      />
                      <span className="truncate">{enrollment.instructor.name}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-medium text-indigo-600 truncate">{enrollment.category}</span>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex-shrink-0">
                      {getDifficultyBadge(enrollment.difficulty)}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {enrollment.recordingOwned && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Recording Owned" />
                  )}
                  {getStatusBadge(enrollment.status)}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{formatDate(enrollment.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{formatDuration(enrollment.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1 col-span-2 sm:col-span-1">
                    <Icon name="DollarSign" size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="font-semibold">
                      {enrollment.price > 0 ? `$${enrollment.price.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              {enrollment.status === 'completed' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all" 
                         style={{ width: `${enrollment.progress}%` }} />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/webinar-details/${enrollment.webinar_id || enrollment.id}`)}
                  iconName="Eye"
                  iconPosition="left"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm"
                >
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                </Button>
                {getActionButton(enrollment)}
              </div>
            </div>
          </div>
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
                {/* <Icon name="Receipt" size={16} className="sm:hidden" /> */}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/attendee/recordings')}
                iconName="PlayCircle"
                iconPosition="left"
                className="border-purple-200 text-purple-700 hover:bg-purple-700 whitespace-nowrap text-xs sm:text-sm"
              >
                <span>Recordings</span>
                {/* <Icon name="PlayCircle" size={16} className="sm:hidden" /> */}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/attendee/payments')}
                iconName="CreditCard"
                iconPosition="left"
                className="border-green-200 text-green-700 hover:bg-green-700 whitespace-nowrap text-xs sm:text-sm"
              >
                <span>Payments</span>
                {/* <Icon name="CreditCard" size={16} className="sm:hidden" /> */}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/attendee/profile')}
                iconName="User"
                iconPosition="left"
                className="border-gray-200 text-gray-700 hover:bg-gray-700 whitespace-nowrap text-xs sm:text-sm"
              >
                <span>Profile</span>
                {/* <Icon name="User" size={16} className="sm:hidden" /> */}
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

          {/* Tab Navigation */}
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
