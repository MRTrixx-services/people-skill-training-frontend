import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const MyRecordings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('my-recordings');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('card');
  const [showLimit, setShowLimit] = useState(5);
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);
  
  // ADD MISSING PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "attendee",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Enhanced mock recordings data with more recordings for better demo
  const allRecordings = [
    // My Recordings (Purchased/Free)
    {
      id: 1,
      title: "Advanced React Patterns and Performance Optimization",
      instructor: {
        name: "Dr. Michael Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
      duration: "2h 15m",
      recordedDate: "2024-11-28",
      purchaseDate: "2024-11-30",
      price: 49.99,
      originalPrice: 69.99,
      status: "purchased",
      category: "Web Development",
      views: 3,
      quality: "HD",
      rating: 4.8,
      attendees: 234,
      type: "premium"
    },
    {
      id: 2,
      title: "Introduction to Web Development",
      instructor: {
        name: "John Smith",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
      duration: "1h 30m",
      recordedDate: "2024-11-20",
      price: 0,
      status: "free",
      category: "Web Development",
      views: 5,
      quality: "HD",
      rating: 4.2,
      attendees: 156,
      type: "free"
    },
    // Available for Purchase - Extended list
    {
      id: 3,
      title: "Digital Marketing Strategy for 2025",
      instructor: {
        name: "Michael Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      duration: "1h 45m",
      recordedDate: "2024-11-25",
      price: 39.99,
      originalPrice: 59.99,
      discount: 33,
      status: "available_for_purchase",
      category: "Marketing",
      quality: "HD",
      rating: 4.6,
      attendees: 189,
      type: "premium"
    },
    {
      id: 4,
      title: "Python Data Science Fundamentals",
      instructor: {
        name: "Dr. Emily Watson",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      duration: "2h 30m",
      recordedDate: "2024-11-20",
      price: 59.99,
      originalPrice: 79.99,
      discount: 25,
      status: "available_for_purchase",
      category: "Data Science",
      quality: "HD",
      rating: 4.9,
      attendees: 267,
      type: "premium"
    },
    {
      id: 8,
      title: "Cloud Computing with AWS",
      instructor: {
        name: "Robert Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop",
      duration: "3h 15m",
      recordedDate: "2024-11-22",
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      status: "available_for_purchase",
      category: "Cloud Computing",
      quality: "HD",
      rating: 4.7,
      attendees: 298,
      type: "premium"
    },
    {
      id: 9,
      title: "Machine Learning Essentials",
      instructor: {
        name: "Dr. Sarah Martinez",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
      duration: "2h 45m",
      recordedDate: "2024-11-19",
      price: 69.99,
      originalPrice: 99.99,
      discount: 30,
      status: "available_for_purchase",
      category: "Data Science",
      quality: "HD",
      rating: 4.8,
      attendees: 312,
      type: "premium"
    },
    {
      id: 10,
      title: "Mobile App Development with Flutter",
      instructor: {
        name: "James Wilson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop",
      duration: "2h 20m",
      recordedDate: "2024-11-17",
      price: 49.99,
      originalPrice: 69.99,
      discount: 28,
      status: "available_for_purchase",
      category: "Mobile Development",
      quality: "HD",
      rating: 4.5,
      attendees: 187,
      type: "premium"
    },
    {
      id: 11,
      title: "Cybersecurity Best Practices",
      instructor: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop",
      duration: "1h 55m",
      recordedDate: "2024-11-15",
      price: 44.99,
      originalPrice: 64.99,
      discount: 31,
      status: "available_for_purchase",
      category: "Security",
      quality: "HD",
      rating: 4.6,
      attendees: 245,
      type: "premium"
    },
    // Public Recordings
    {
      id: 5,
      title: "Getting Started with JavaScript",
      instructor: {
        name: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop",
      duration: "1h 15m",
      recordedDate: "2024-12-01",
      price: 0,
      status: "public",
      category: "Programming",
      quality: "HD",
      rating: 4.3,
      attendees: 445,
      type: "public"
    },
    {
      id: 6,
      title: "Career Development in Tech",
      instructor: {
        name: "Sophie Williams",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop",
      duration: "45m",
      recordedDate: "2024-11-15",
      price: 0,
      status: "public",
      category: "Career Development",
      quality: "HD",
      rating: 4.1,
      attendees: 324,
      type: "public"
    },
    {
      id: 7,
      title: "UI/UX Design Principles",
      instructor: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=225&fit=crop",
      duration: "2h 10m",
      recordedDate: "2024-11-18",
      price: 45.99,
      originalPrice: 65.99,
      discount: 30,
      status: "available_for_purchase",
      category: "Design",
      quality: "HD",
      rating: 4.7,
      attendees: 198,
      type: "premium"
    },
    {
      id: 12,
      title: "Introduction to Programming",
      instructor: {
        name: "Lisa Chen",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      thumbnail: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=225&fit=crop",
      duration: "1h 20m",
      recordedDate: "2024-11-12",
      price: 0,
      status: "public",
      category: "Programming",
      quality: "HD",
      rating: 4.0,
      attendees: 567,
      type: "public"
    }
  ];

  // Calculate insights
  const insights = {
    totalPurchased: allRecordings.filter(r => r.status === 'purchased').length,
    totalWatchTime: allRecordings
      .filter(r => r.status === 'purchased' || r.status === 'free')
      .reduce((acc, r) => {
        const [hours, minutes] = r.duration.split('h ');
        const h = parseInt(hours) || 0;
        const m = parseInt(minutes?.replace('m', '')) || 0;
        return acc + (h * 60) + m;
      }, 0),
    totalSpent: allRecordings
      .filter(r => r.status === 'purchased')
      .reduce((acc, r) => acc + r.price, 0),
    averageRating: (
      allRecordings
        .filter(r => r.status === 'purchased' || r.status === 'free')
        .reduce((acc, r) => acc + (r.rating || 0), 0) /
      allRecordings.filter(r => r.status === 'purchased' || r.status === 'free').length
    ).toFixed(1),
    availableDiscount: allRecordings
      .filter(r => r.status === 'available_for_purchase' && r.discount)
      .reduce((acc, r) => acc + (r.originalPrice - r.price), 0),
    publicRecordings: allRecordings.filter(r => r.status === 'public').length
  };

  const categories = ['all', ...new Set(allRecordings.map(r => r.category))];
  const tabs = [
    { id: 'my-recordings', label: 'My Recordings', shortLabel: 'Mine', count: allRecordings.filter(r => r.status === 'purchased' || r.status === 'free').length },
    { id: 'available', label: 'Available to Purchase', shortLabel: 'Available', count: allRecordings.filter(r => r.status === 'available_for_purchase').length },
    { id: 'public', label: 'Public Recordings', shortLabel: 'Public', count: allRecordings.filter(r => r.status === 'public').length }
  ];

  // Filter and sort recordings
  const getFilteredRecordings = () => {
    let filtered = allRecordings;

    switch (activeTab) {
      case 'my-recordings':
        filtered = filtered.filter(r => r.status === 'purchased' || r.status === 'free');
        break;
      case 'available':
        filtered = filtered.filter(r => r.status === 'available_for_purchase');
        break;
      case 'public':
        filtered = filtered.filter(r => r.status === 'public');
        break;
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(r => r.category === filterCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.recordedDate) - new Date(a.recordedDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  };

  const filteredRecordings = getFilteredRecordings();
  
  // FOR CARD VIEW (uses showLimit)
  const displayedRecordings = filteredRecordings.slice(0, showLimit);
  const hasMoreRecordings = filteredRecordings.length > showLimit;

  // FOR TABLE VIEW (uses pagination)
  const totalItems = filteredRecordings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTableItems = filteredRecordings.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setShowLimit(5);
    setCurrentPage(1);
    setIsTabMenuOpen(false);
  }, [activeTab, filterCategory, searchQuery]);

  const handlePlayRecording = (recording) => {
    if (recording.status === 'purchased' || recording.status === 'free' || recording.status === 'public') {
      console.log(`Playing recording: ${recording.title}`);
      navigate(`/watch-recording/${recording.id}`);
    }
  };

  const handlePurchaseRecording = (recording) => {
    console.log(`Purchasing recording: ${recording.title} for $${recording.price}`);
    navigate(`/purchase-recording/${recording.id}`);
  };

  const handleViewMore = () => {
    setShowLimit(prev => prev + 5);
  };

  const handleViewAllInCategory = () => {
    const params = new URLSearchParams({
      tab: activeTab,
      category: filterCategory !== 'all' ? filterCategory : '',
      search: searchQuery
    });
    navigate(`/browse-content?${params.toString()}`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      purchased: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200',
      free: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200',
      available_for_purchase: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200',
      public: 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200'
    };

    const labels = {
      purchased: 'Purchased',
      free: 'Free Access',
      available_for_purchase: 'Available',
      public: 'Public'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full border shadow-sm whitespace-nowrap ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getActionButton = (recording, isTableView = false) => {
    if (recording.status === 'purchased' || recording.status === 'free' || recording.status === 'public') {
      return (
        <Button
          variant="default"
          size={isTableView ? "sm" : "default"}
          onClick={() => handlePlayRecording(recording)}
          iconName="Play"
          iconPosition="left"
          className={`${isTableView ? 'text-xs sm:text-sm' : 'w-full'} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700`}
        >
          <span className="hidden sm:inline">Watch Recording</span>
          <span className="sm:hidden">Watch</span>
        </Button>
      );
    } else {
      return (
        <div className={isTableView ? "flex flex-col space-y-1" : "space-y-2"}>
          <Button
            variant="default"
            size={isTableView ? "sm" : "default"}
            onClick={() => handlePurchaseRecording(recording)}
            iconName="ShoppingCart"
            iconPosition="left"
            className={`${isTableView ? 'text-xs sm:text-sm' : 'w-full'} bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700`}
          >
            <span className="hidden sm:inline">Purchase ${recording.price}</span>
            <span className="sm:hidden">${recording.price}</span>
          </Button>
          {recording.originalPrice && !isTableView && (
            <div className="text-center">
              <span className="text-xs text-gray-500 line-through">${recording.originalPrice}</span>
              <span className="text-xs font-semibold text-green-600 ml-2">
                Save {recording.discount}%
              </span>
            </div>
          )}
        </div>
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Enhanced Pagination Component with mobile responsiveness
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
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronsLeft" size={16} />
              </button>
              
              {/* Previous Page */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>

              {/* Page Numbers */}
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

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
              
              {/* Last Page */}
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

  // Enhanced Insights Cards
  const InsightsCards = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Video" size={18} className="text-blue-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-blue-700">{insights.totalPurchased}</div>
        <div className="text-xs text-blue-600">Owned</div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Clock" size={18} className="text-green-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-green-700">{Math.round(insights.totalWatchTime / 60)}h</div>
        <div className="text-xs text-green-600">Watch Time</div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="DollarSign" size={18} className="text-purple-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-purple-700">${insights.totalSpent.toFixed(0)}</div>
        <div className="text-xs text-purple-600">Invested</div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Star" size={18} className="text-amber-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-amber-700">{insights.averageRating}</div>
        <div className="text-xs text-amber-600">Avg Rating</div>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Tag" size={18} className="text-rose-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-rose-700">${insights.availableDiscount.toFixed(0)}</div>
        <div className="text-xs text-rose-600">Savings</div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Globe" size={18} className="text-indigo-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-indigo-700">{insights.publicRecordings}</div>
        <div className="text-xs text-indigo-600">Public</div>
      </div>
    </div>
  );

  // View Toggle Component
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

  // Enhanced Responsive Tab Navigation
  const ResponsiveTabNavigation = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    
    return (
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        {/* Mobile Tab Selector */}
        <div className="block sm:hidden">
          <div className="relative">
            <button
              onClick={() => setIsTabMenuOpen(!isTabMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{activeTabData?.shortLabel}</span>
                <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700">
                  {activeTabData?.count}
                </span>
              </div>
              <Icon 
                name={isTabMenuOpen ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-gray-500"
              />
            </button>
            
            {/* Mobile Dropdown Menu */}
            {isTabMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsTabMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{tab.shortLabel}</span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden sm:block">
          <nav className="flex space-x-6 md:space-x-8 overflow-x-auto">
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
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
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
      </div>
    );
  };

  // Table View Component (showing paginated results)
  const TableView = () => (
    <div className="w-full">
      {/* Mobile Table View - Stacked Cards */}
      <div className="block sm:hidden space-y-4">
        {currentTableItems.map((recording) => (
          <div key={recording.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={recording.thumbnail}
                    alt={recording.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                    {recording.title}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">{recording.instructor.name}</p>
                </div>
              </div>
              {getStatusBadge(recording.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} />
                <span>{formatDate(recording.recordedDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{recording.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="DollarSign" size={12} />
                <span>{recording.price > 0 ? `$${recording.price}` : 'Free'}</span>
              </div>
              {recording.rating && (
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-yellow-400" />
                  <span>{recording.rating}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              {getActionButton(recording, true)}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View - Horizontal Scroll */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="min-w-[1000px]">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-sm w-1/3 min-w-[300px]">
                    Recording
                  </th>
                  <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-sm min-w-[120px]">
                    Instructor
                  </th>
                  <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-sm min-w-[100px]">
                    Date
                  </th>
                  <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-sm min-w-[80px]">
                    Duration
                  </th>
                  <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-sm min-w-[80px]">
                    Price
                  </th>
                  <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-sm min-w-[100px]">
                    Status
                  </th>
                  <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-sm min-w-[80px]">
                    Rating
                  </th>
                  {activeTab === 'my-recordings' && (
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-sm min-w-[70px]">
                      Views
                    </th>
                  )}
                  <th className="text-right p-3 sm:p-4 font-semibold text-gray-700 text-sm min-w-[140px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTableItems.map((recording, index) => (
                  <tr 
                    key={recording.id} 
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={recording.thumbnail}
                            alt={recording.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                            {recording.title}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {recording.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={recording.instructor.avatar}
                          alt={recording.instructor.name}
                          className="w-6 h-6 rounded-full flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700 truncate">
                          {recording.instructor.name}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-3 sm:p-4">
                      <div className="text-sm text-gray-700 whitespace-nowrap">
                        {formatDate(recording.recordedDate)}
                      </div>
                    </td>
                    
                    <td className="p-3 sm:p-4">
                      <span className="text-sm text-gray-700 whitespace-nowrap">
                        {recording.duration}
                      </span>
                    </td>
                    
                    <td className="p-3 sm:p-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {recording.price > 0 ? `$${recording.price}` : 'Free'}
                        </span>
                        {recording.originalPrice && recording.status === 'available_for_purchase' && (
                          <div className="text-xs text-gray-500">
                            <span className="line-through">${recording.originalPrice}</span>
                            <span className="text-green-600 ml-1 font-semibold">-{recording.discount}%</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-3 sm:p-4">
                      {getStatusBadge(recording.status)}
                    </td>
                    
                    <td className="p-3 sm:p-4">
                      {recording.rating ? (
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={14} className="text-yellow-400" />
                          <span className="text-sm text-gray-700">{recording.rating}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    
                    {activeTab === 'my-recordings' && (
                      <td className="p-3 sm:p-4">
                        <span className="text-sm text-gray-700">
                          {recording.views || 0}
                        </span>
                      </td>
                    )}
                    
                    <td className="p-3 sm:p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/recording-details/${recording.id}`)}
                          iconName="Eye"
                          className="text-gray-600 hover:text-gray-900 p-2"
                        />
                        {getActionButton(recording, true)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Card View Component - 5 per row with View More
  const CardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {displayedRecordings.map((recording) => (
          <div key={recording.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-gray-300">
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden">
                <Image
                  src={recording.thumbnail}
                  alt={recording.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Play Overlay */}
              {(recording.status === 'purchased' || recording.status === 'free' || recording.status === 'public') && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePlayRecording(recording)}
                    iconName="Play"
                    iconSize={20}
                    className="bg-white bg-opacity-20 backdrop-blur-sm border-white text-white hover:bg-opacity-30"
                  />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                {getStatusBadge(recording.status)}
              </div>
              
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                {recording.duration}
              </div>
              
              {/* Price/Discount */}
              {recording.status === 'available_for_purchase' && (
                <div className="absolute top-2 left-2">
                  {recording.originalPrice ? (
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {recording.discount}% OFF
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      ${recording.price}
                    </div>
                  )}
                </div>
              )}
              
              {/* Views for owned recordings */}
              {recording.views && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {recording.views} views
                </div>
              )}
            </div>

            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                {recording.title}
              </h3>
              
              <div className="flex items-center space-x-1 mb-2">
                <Image
                  src={recording.instructor.avatar}
                  alt={recording.instructor.name}
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-xs text-gray-600 truncate">{recording.instructor.name}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="truncate">{formatDate(recording.recordedDate)}</span>
                {recording.rating && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={10} className="text-yellow-400" />
                    <span>{recording.rating}</span>
                  </div>
                )}
              </div>

              {getActionButton(recording)}
            </div>
          </div>
        ))}
      </div>

      {/* View More/View All Controls */}
      {(hasMoreRecordings || filteredRecordings.length > 10) && (
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          {hasMoreRecordings && (
            <Button
              variant="outline"
              onClick={handleViewMore}
              iconName="Plus"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              View More ({filteredRecordings.length - showLimit} remaining)
            </Button>
          )}
          
          <Button
            variant="default"
            onClick={handleViewAllInCategory}
            iconName="ExternalLink"
            iconPosition="right"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            View All Content
          </Button>
        </div>
      )}
    </div>
  );

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/attendee-dashboard' },
    { label: 'My Recordings', href: null }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Click outside handler for mobile menu */}
      {isTabMenuOpen && (
        <div 
          className="fixed inset-0 z-40 sm:hidden" 
          onClick={() => setIsTabMenuOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <BreadcrumbNavigation
          customBreadcrumbs={customBreadcrumbs}
          className="mb-6"
        />

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            My Recordings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Access your purchased recordings, discover new content, and watch public webinars
          </p>
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
                    placeholder="Search recordings..."
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
                  <option value="recent">Most Recent</option>
                  <option value="title">Title A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <ViewToggle />
            </div>
          </div>

          {/* Enhanced Responsive Tab Navigation */}
          <ResponsiveTabNavigation />

          {/* Recordings Content */}
          <div className="p-4 sm:p-6">
            {filteredRecordings.length > 0 ? (
              <>
                {viewMode === 'table' ? <TableView /> : <CardView />}
              </>
            ) : (
              /* Enhanced Empty State */
              <div className="text-center py-12">
                <Icon name="Video" size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'my-recordings' && 'No recordings in your library'}
                  {activeTab === 'available' && 'No recordings available for purchase'}
                  {activeTab === 'public' && 'No public recordings available'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {activeTab === 'my-recordings' && 'Purchase recordings or attend webinars to build your library.'}
                  {activeTab === 'available' && 'Check back later for new recordings to purchase.'}
                  {activeTab === 'public' && 'Check back later for new public recordings.'}
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/my-enrollments')}
                    iconName="Calendar"
                    iconPosition="left"
                    className="w-full sm:w-auto"
                  >
                    My Enrollments
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => navigate('/browse-webinars')}
                    iconName="Search"
                    iconPosition="left"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    Browse Webinars
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination for Table View Only */}
          {viewMode === 'table' && <PaginationControls />}
        </div>
      </div>
    </div>
  );
};

export default MyRecordings;
