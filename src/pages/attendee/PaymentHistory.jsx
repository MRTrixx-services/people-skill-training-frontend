import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // Add view mode state
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    transactionType: '',
    status: ''
  });

  const itemsPerPage = viewMode === 'card' ? 9 : 10; // Different items per page for card vs table

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

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN-2024-001',
      date: '2024-12-01T10:30:00Z',
      description: 'Advanced React Patterns Webinar',
      type: 'webinar_enrollment',
      amount: 89.99,
      status: 'completed',
      paymentMethod: 'Credit Card ****1234',
      receiptUrl: '/receipts/txn-001.pdf'
    },
    {
      id: 'TXN-2024-002',
      date: '2024-11-28T14:15:00Z',
      description: 'Digital Marketing Strategy Recording',
      type: 'recording_purchase',
      amount: 39.99,
      status: 'completed',
      paymentMethod: 'PayPal',
      receiptUrl: '/receipts/txn-002.pdf'
    },
    {
      id: 'TXN-2024-003',
      date: '2024-11-25T09:45:00Z',
      description: 'Leadership in Remote Teams Webinar',
      type: 'webinar_enrollment',
      amount: 45.00,
      status: 'refunded',
      paymentMethod: 'Credit Card ****1234',
      receiptUrl: '/receipts/txn-003.pdf',
      refundReason: 'Cancelled by instructor'
    },
    {
      id: 'TXN-2024-004',
      date: '2024-11-20T16:20:00Z',
      description: 'Data Science Fundamentals Recording',
      type: 'recording_purchase',
      amount: 49.99,
      status: 'pending',
      paymentMethod: 'Credit Card ****5678',
      receiptUrl: null
    },
    {
      id: 'TXN-2024-005',
      date: '2024-11-15T11:10:00Z',
      description: 'JavaScript Fundamentals Webinar',
      type: 'webinar_enrollment',
      amount: 29.99,
      status: 'completed',
      paymentMethod: 'Credit Card ****1234',
      receiptUrl: '/receipts/txn-005.pdf'
    },
    {
      id: 'TXN-2024-006',
      date: '2024-11-10T13:25:00Z',
      description: 'Python for Beginners Recording',
      type: 'recording_purchase',
      amount: 24.99,
      status: 'completed',
      paymentMethod: 'PayPal',
      receiptUrl: '/receipts/txn-006.pdf'
    },
    {
      id: 'TXN-2024-007',
      date: '2024-11-05T08:45:00Z',
      description: 'UI/UX Design Masterclass',
      type: 'webinar_enrollment',
      amount: 79.99,
      status: 'completed',
      paymentMethod: 'Credit Card ****9999',
      receiptUrl: '/receipts/txn-007.pdf'
    },
    {
      id: 'TXN-2024-008',
      date: '2024-10-30T15:30:00Z',
      description: 'Cloud Architecture Webinar',
      type: 'webinar_enrollment',
      amount: 65.00,
      status: 'pending',
      paymentMethod: 'Credit Card ****1234',
      receiptUrl: null
    },
    {
      id: 'TXN-2024-009',
      date: '2024-10-25T12:15:00Z',
      description: 'Machine Learning Basics Recording',
      type: 'recording_purchase',
      amount: 34.99,
      status: 'completed',
      paymentMethod: 'PayPal',
      receiptUrl: '/receipts/txn-009.pdf'
    }
  ];

  // Calculate summary stats
  const summaryStats = {
    totalSpent: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    transactionCount: transactions.length,
    refundCount: transactions.filter(t => t.status === 'refunded').length,
    monthOverMonth: 15.2 // Mock percentage
  };

  const transactionTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'webinar_enrollment', label: 'Webinar Enrollment' },
    { value: 'recording_purchase', label: 'Recording Purchase' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200',
      pending: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200',
      refunded: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200'
    };

    const labels = {
      completed: 'Completed',
      pending: 'Pending',
      refunded: 'Refunded'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full border shadow-sm ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTransactionTypeIcon = (type) => {
    return type === 'webinar_enrollment' ? 'Video' : 'Play';
  };

  const getTransactionTypeColor = (type) => {
    return type === 'webinar_enrollment' 
      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600' 
      : 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDateRangeChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      transactionType: '',
      status: ''
    });
    setCurrentPage(1);
  };

  // Filter and sort transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = !filters.transactionType || transaction.type === filters.transactionType;
    const matchesStatus = !filters.status || transaction.status === filters.status;
    
    let matchesDateRange = true;
    if (filters.dateRange.start || filters.dateRange.end) {
      const transactionDate = new Date(transaction.date);
      const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
      
      if (startDate && transactionDate < startDate) matchesDateRange = false;
      if (endDate && transactionDate > endDate) matchesDateRange = false;
    }

    return matchesType && matchesStatus && matchesDateRange;
  });

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'description':
        aValue = a.description.toLowerCase();
        bValue = b.description.toLowerCase();
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
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleViewReceipt = (transaction) => {
    if (transaction.receiptUrl) {
      // In real app, this would download or open the receipt
      alert(`Opening receipt for ${transaction.description}`);
    }
  };

  // View Toggle Component
  const ViewToggle = () => (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
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
    </div>
  );

  // Card View Component
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedTransactions.map((transaction) => (
        <div key={transaction.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTransactionTypeColor(transaction.type)}`}>
              <Icon name={getTransactionTypeIcon(transaction.type)} size={20} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${transaction.amount.toFixed(2)}</div>
              <div className="text-xs text-gray-500">{transaction.id}</div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {transaction.description}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {transaction.type === 'webinar_enrollment' ? 'Webinar Enrollment' : 'Recording Purchase'}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-1 mb-1">
                  <Icon name="Calendar" size={14} />
                  <span>{formatDate(transaction.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{formatTime(transaction.date)}</span>
                </div>
              </div>
              {getStatusBadge(transaction.status)}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Icon name="CreditCard" size={14} />
                <span>{transaction.paymentMethod}</span>
              </div>
            </div>

            {transaction.refundReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-red-700">
                  <span className="font-medium">Refund Reason:</span> {transaction.refundReason}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewReceipt(transaction)}
              disabled={!transaction.receiptUrl}
              iconName="Download"
              iconPosition="left"
              className="flex-1"
            >
              Receipt
            </Button>
            {transaction.status === 'completed' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log('View details:', transaction.id)}
                iconName="Eye"
                iconPosition="left"
                className="flex-1"
              >
                Details
              </Button>
            )}
          </div>
        </div>
      ))}
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
      <div className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6 rounded-b-lg">
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
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, sortedTransactions.length)}</span> of{' '}
              <span className="font-medium">{sortedTransactions.length}</span> results
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

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/attendee-dashboard' },
    { label: 'Payment History', href: null }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <BreadcrumbNavigation
          user={user}
          customBreadcrumbs={customBreadcrumbs}
          className="mb-6"
        />

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Payment History
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">View and manage your transaction history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Spent</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">${summaryStats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <Icon name="DollarSign" size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Icon name="TrendingUp" size={14} className="text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{summaryStats.monthOverMonth}%</span>
              <span className="text-blue-600 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Transactions</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700">{summaryStats.transactionCount}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Refunds</p>
                <p className="text-xl sm:text-2xl font-bold text-red-700">{summaryStats.refundCount}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-200 rounded-lg flex items-center justify-center">
                <Icon name="RefreshCw" size={20} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Avg. Transaction</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">
                  ${(summaryStats.totalSpent / Math.max(summaryStats.transactionCount - summaryStats.refundCount, 1)).toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <ViewToggle />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="bg-gray-50 border-gray-200"
            />
            
            <Input
              label="End Date"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="bg-gray-50 border-gray-200"
            />
            
            <Select
              label="Transaction Type"
              options={transactionTypeOptions}
              value={filters.transactionType}
              onChange={(value) => handleFilterChange('transactionType', value)}
              className="bg-gray-50 border-gray-200"
            />
            
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              className="bg-gray-50 border-gray-200"
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
              size="sm"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                <p className="text-sm text-gray-600">
                  Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {filteredTransactions.length > 0 ? (
              <>
                {viewMode === 'table' ? (
                  /* Table View */
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left">
                            <button
                              onClick={() => handleSort('date')}
                              className="flex items-center space-x-1 text-xs font-medium text-gray-600 uppercase tracking-wider hover:text-gray-900"
                            >
                              <span>Date</span>
                              {sortBy === 'date' && (
                                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                              )}
                            </button>
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left">
                            <button
                              onClick={() => handleSort('description')}
                              className="flex items-center space-x-1 text-xs font-medium text-gray-600 uppercase tracking-wider hover:text-gray-900"
                            >
                              <span>Description</span>
                              {sortBy === 'description' && (
                                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                              )}
                            </button>
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left">
                            <button
                              onClick={() => handleSort('amount')}
                              className="flex items-center space-x-1 text-xs font-medium text-gray-600 uppercase tracking-wider hover:text-gray-900"
                            >
                              <span>Amount</span>
                              {sortBy === 'amount' && (
                                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                              )}
                            </button>
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Payment Method
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatDate(transaction.date)}</div>
                              <div className="text-xs text-gray-500">{transaction.id}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTransactionTypeColor(transaction.type)}`}>
                                  <Icon name={getTransactionTypeIcon(transaction.type)} size={16} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{transaction.description}</div>
                                  <div className="text-xs text-gray-500">
                                    {transaction.type === 'webinar_enrollment' ? 'Webinar Enrollment' : 'Recording Purchase'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">${transaction.amount.toFixed(2)}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(transaction.status)}
                              {transaction.refundReason && (
                                <div className="text-xs text-gray-500 mt-1">{transaction.refundReason}</div>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{transaction.paymentMethod}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewReceipt(transaction)}
                                disabled={!transaction.receiptUrl}
                                iconName="Download"
                                iconPosition="left"
                              >
                                Receipt
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Card View */
                  <CardView />
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <Icon name="CreditCard" size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-600 mb-6">
                  {Object.values(filters).some(f => f !== '' && (typeof f !== 'object' || Object.values(f).some(v => v !== '')))
                    ? 'Try adjusting your filters to see more transactions.'
                    : 'Your transaction history will appear here once you make your first purchase.'}
                </p>
                {Object.values(filters).some(f => f !== '' && (typeof f !== 'object' || Object.values(f).some(v => v !== ''))) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    iconName="X"
                    iconPosition="left"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && <PaginationControls />}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
