import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import axios from 'axios';
import axiosInstance, { API_BASE_URL } from 'config/axiosInstance';

const PaymentManagement = () => {
  const navigate = useNavigate();
  
  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('-created_at');
  
  // NEW: Page-by-page caching state
  const [pageCache, setPageCache] = useState({}); // {1: [], 2: [], 3: [], ...}
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState(null); // Track next URL for each page
  
  // Metrics State
  const [paymentOverview, setPaymentOverview] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [refundStats, setRefundStats] = useState(null);
  
  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false); // For individual page loads
  const [error, setError] = useState(null);

  // View State
  const [isMobileView, setIsMobileView] = useState(false);

  /**
   * Check screen size for responsive design
   */
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  /**
   * Get authorization header with bearer token
   */
  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  /**
   * INITIAL LOAD: Preload page 1 + 2 + metrics
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Load page 1, page 2, and metrics on mount
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Initial load: fetching metrics + page 1 + page 2');

      // Parallel load: metrics + page 1
      const [metricsResult, page1Result] = await Promise.all([
        fetchPaymentMetrics(),
        fetchPage(1)
      ]);

      // Load page 2 in background (non-blocking)
      fetchPage(2).catch(err => console.warn('⚠️ Page 2 preload failed:', err));

      console.log('✅ Initial data loaded (page 1 ready, page 2 loading)');
    } catch (err) {
      console.error('❌ Error loading initial data:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to load payment data'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch payment metrics (overview/analytics/refunds)
   */
  const fetchPaymentMetrics = async () => {
    const [
      overviewRes,
      analyticsRes,
      refundStatsRes
    ] = await Promise.all([
      axiosInstance.get(`/payments/admin/overview/`, getAuthHeader()),
      axiosInstance.get(`/payments/admin/analytics/revenue/`, getAuthHeader()),
      axiosInstance.get(`/payments/admin/analytics/refunds/`, getAuthHeader())
    ]);

    if (overviewRes.data) {
      setPaymentOverview({
        today: overviewRes.data.today?.revenue || 0,
        thisWeek: overviewRes.data.this_week?.revenue || 0,
        thisMonth: overviewRes.data.this_month?.revenue || 0,
        total: overviewRes.data.total?.revenue || 0,
        transactionVolume: {
          today: overviewRes.data.today?.transactions || 0,
          thisWeek: overviewRes.data.this_week?.transactions || 0,
          thisMonth: overviewRes.data.this_month?.transactions || 0,
          total: overviewRes.data.total?.transactions || 0
        }
      });
    }

    setRevenueAnalytics(analyticsRes.data || {});
    setRefundStats(refundStatsRes.data || {});
  };

  /**
   * Fetch a specific page with cache check
   * @param {number} pageNum - Page number to fetch (1-indexed)
   */
  const fetchPage = async (pageNum) => {
    // Check cache first
    if (pageCache[pageNum]) {
      console.log(`✅ Page ${pageNum} already loaded, skipping API call`);
      return pageCache[pageNum];
    }

    console.log(`🔄 Fetching page ${pageNum}...`);
    setPageLoading(true);

    try {
      const response = await axiosInstance.get(
        `/payments/admin/payments/?ordering=${sortBy}&page=${pageNum}&page_size=100`,
        getAuthHeader()
      );

      const pageData = response.data.results || [];
      
      // Update cache
      setPageCache(prev => ({
        ...prev,
        [pageNum]: pageData
      }));

      // Update total count and next URL
      setTotalCount(response.data.count || 0);
      setNextPageUrl(response.data.next);

      console.log(`✅ Page ${pageNum} loaded: ${pageData.length} transactions`);
      
      return pageData;
    } catch (err) {
      console.error(`❌ Error fetching page ${pageNum}:`, err);
      throw err;
    } finally {
      setPageLoading(false);
    }
  };

  /**
   * Handle page navigation with on-demand loading
   */
  const handlePageChange = async (newPage) => {
    if (newPage === currentPage) return;
    
    setCurrentPage(newPage);

    // Check if page is already cached
    if (pageCache[newPage]) {
      console.log(`📦 Page ${newPage} loaded from cache (instant)`);
      return;
    }

    // Load page on-demand if not cached
    try {
      await fetchPage(newPage);
    } catch (err) {
      console.error(`Failed to load page ${newPage}`);
    }
  };

  /**
   * Get all cached transactions for client-side filtering
   */
  const allTransactions = useMemo(() => {
    return Object.values(pageCache).flat();
  }, [pageCache]);

  /**
   * Client-side filtering and sorting using useMemo
   */
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.id?.toString().includes(search) ||
        t.user_email?.toLowerCase().includes(search) ||
        t.user_name?.toLowerCase().includes(search) ||
        t.amount?.toString().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Apply payment method filter
    if (paymentMethodFilter) {
      filtered = filtered.filter(t => t.payment_method === paymentMethodFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const field = sortBy.replace('-', '');
      const isDescending = sortBy.startsWith('-');

      let aVal = a[field];
      let bVal = b[field];

      // Handle date sorting
      if (field === 'created_at') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      // Handle numeric sorting
      if (field === 'amount' || field === 'id') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (aVal < bVal) return isDescending ? 1 : -1;
      if (aVal > bVal) return isDescending ? -1 : 1;
      return 0;
    });

    return filtered;
  }, [allTransactions, searchTerm, statusFilter, paymentMethodFilter, sortBy]);

  /**
   * Reset to page 1 when filters change
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentMethodFilter, sortBy]);

  /**
   * Get current page data to display
   */
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  /**
   * Get payment method configuration based on API data
   */
  const getPaymentMethodConfig = (methodId) => {
    const configs = {
      razorpay: {
        name: 'Razorpay',
        icon: 'CreditCard',
        description: 'Accept cards, UPI, wallets & net banking',
        bgColor: 'from-blue-500 to-blue-600',
        fees: '2% + ₹0'
      },
      paypal: {
        name: 'PayPal',
        icon: 'DollarSign',
        description: 'Global payment solution',
        bgColor: 'from-indigo-500 to-indigo-600',
        fees: '2.9% + $0.30'
      },
      stripe: {
        name: 'Stripe',
        icon: 'CreditCard',
        description: 'Advanced payment infrastructure',
        bgColor: 'from-purple-500 to-purple-600',
        fees: '2.9% + $0.30'
      },
      bank_transfer: {
        name: 'Bank Transfer',
        icon: 'Building',
        description: 'Direct bank to bank transfers',
        bgColor: 'from-green-500 to-green-600',
        fees: 'Flat ₹5'
      },
      upi: {
        name: 'UPI',
        icon: 'Smartphone',
        description: 'Instant mobile payments',
        bgColor: 'from-teal-500 to-teal-600',
        fees: '0%'
      }
    };
    return configs[methodId] || {
      name: methodId,
      icon: 'CreditCard',
      description: 'Payment method',
      bgColor: 'from-gray-500 to-gray-600',
      fees: 'Variable'
    };
  };

  /**
   * Get status breakdown for a payment method
   */
  const getMethodStatusBreakdown = (methodId) => {
    if (!filteredTransactions.length) return null;
    
    const methodTransactions = filteredTransactions.filter(
      t => t.payment_method === methodId
    );
    
    const breakdown = {
      completed: methodTransactions.filter(t => t.status === 'completed').length,
      failed: methodTransactions.filter(t => t.status === 'failed').length,
      pending: methodTransactions.filter(t => t.status === 'pending').length,
      refunded: methodTransactions.filter(t => t.status === 'refunded').length
    };
    
    const total = breakdown.completed + breakdown.failed + breakdown.pending + breakdown.refunded;
    const successRate = total > 0 ? ((breakdown.completed / total) * 100).toFixed(1) : 0;
    
    return {
      ...breakdown,
      total,
      successRate: parseFloat(successRate)
    };
  };

  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  // Payment method filter options
  const paymentMethodOptions = [
    { value: '', label: 'All Methods' },
    { value: 'razorpay', label: 'Razorpay' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' }
  ];

  /**
   * Get styled badge for payment status
   */
  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      refunded: 'Refunded'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  /**
   * Get icon for payment method
   */
  const getPaymentMethodIcon = (method) => {
    const config = getPaymentMethodConfig(method);
    return config.icon;
  };

  /**
   * Get display label for payment method
   */
  const getPaymentMethodLabel = (method) => {
    const config = getPaymentMethodConfig(method);
    return config.name;
  };

  /**
   * Format amount as currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  /**
   * Format ISO date string to readable format
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Handle sort column click
   */
  const handleSort = (field) => {
    setSortBy(sortBy === `-${field}` ? field : `-${field}`);
  };

  /**
   * Handle refund button click
   */
  const handleRefund = (transactionId) => {
    navigate(`/admin/refunds/create?payment=${transactionId}`);
  };

  /**
   * Handle view transaction details
   */
  const handleViewTransaction = (transactionId) => {
    navigate(`/admin/payments/${transactionId}`);
  };

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-700 text-sm">{error}</p>
          <Button
            variant="default"
            size="sm"
            onClick={() => loadInitialData()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <BreadcrumbNavigation
            items={[
              { label: 'Admin', path: '/admin' },
              { label: 'Payment Management' }
            ]}
          />
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Payment Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Monitor transactions, process refunds, and manage payouts
              {!loading && allTransactions.length > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  • {allTransactions.length} cached / {totalCount} total transactions
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : paymentOverview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Total Revenue Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon name="DollarSign" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                  Total
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-medium opacity-90">Total Revenue</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{formatCurrency(paymentOverview.total)}</p>
              <p className="text-xs opacity-75 mt-1 sm:mt-2">
                {paymentOverview.transactionVolume.total} transactions
              </p>
            </div>

            {/* This Month Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon name="TrendingUp" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                  Month
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-medium opacity-90">This Month</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{formatCurrency(paymentOverview.thisMonth)}</p>
              <p className="text-xs opacity-75 mt-1 sm:mt-2">
                {paymentOverview.transactionVolume.thisMonth} transactions
              </p>
            </div>

            {/* This Week Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon name="Calendar" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                  Week
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-medium opacity-90">This Week</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{formatCurrency(paymentOverview.thisWeek)}</p>
              <p className="text-xs opacity-75 mt-1 sm:mt-2">
                {paymentOverview.transactionVolume.thisWeek} transactions
              </p>
            </div>

            {/* Today Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon name="Zap" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                  Today
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-medium opacity-90">Today</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{formatCurrency(paymentOverview.today)}</p>
              <p className="text-xs opacity-75 mt-1 sm:mt-2">
                {paymentOverview.transactionVolume.today} transactions
              </p>
            </div>
          </div>
        )}

        {/* Filters & Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="w-full">
              <Input
                icon="Search"
                placeholder="Search by transaction ID, user email, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full"
              />

              <Select
                options={paymentMethodOptions}
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full"
              />

              <div className="hidden lg:block">
                <Select
                  options={[
                    { value: 10, label: '10 per page' },
                    { value: 25, label: '25 per page' },
                    { value: 50, label: '50 per page' },
                    { value: 100, label: '100 per page' }
                  ]}
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full"
                />
              </div>

              <Button
                variant="outline"
                size="md"
                icon="Download"
                onClick={() => console.log('Export')}
                className="w-full"
              >
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export Data</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions Table/Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <span className="text-xs sm:text-sm text-gray-600">
                {filteredTransactions.length} {searchTerm || statusFilter || paymentMethodFilter ? 'filtered' : 'total'}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm sm:text-base text-gray-600 mt-4">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <Icon name="Inbox" className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600 font-medium">No transactions found</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-200">
                {getCurrentPageData().map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Icon name="Hash" className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">#{transaction.id}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatDate(transaction.created_at)}</p>
                        </div>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>

                    <div className="flex items-center gap-3 mb-3 pl-11">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
                        {transaction.user_email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.user_name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {transaction.user_email || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pl-11 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Amount</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">Method</p>
                        <div className="flex items-center gap-2">
                          <Icon 
                            name={getPaymentMethodIcon(transaction.payment_method)} 
                            className="w-4 h-4 text-gray-500" 
                          />
                          <span className="text-sm text-gray-700">
                            {getPaymentMethodLabel(transaction.payment_method)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pl-11">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Eye"
                        onClick={() => handleViewTransaction(transaction.id)}
                        className="flex-1 text-blue-600 hover:bg-blue-50"
                      >
                        View
                      </Button>
                      {transaction.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="RefreshCw"
                          onClick={() => handleRefund(transaction.id)}
                          className="flex-1 text-red-600 hover:bg-red-50"
                        >
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('id')}
                      >
                        <div className="flex items-center gap-2">
                          Transaction ID
                          <Icon name="ArrowUpDown" className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center gap-2">
                          Amount
                          <Icon name="ArrowUpDown" className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center gap-2">
                          Date
                          <Icon name="ArrowUpDown" className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getCurrentPageData().map((transaction) => (
                      <tr 
                        key={transaction.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-50 rounded-lg mr-3">
                              <Icon name="Hash" className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              #{transaction.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                              {transaction.user_email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {transaction.user_name || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {transaction.user_email || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Icon 
                              name={getPaymentMethodIcon(transaction.payment_method)} 
                              className="w-4 h-4 text-gray-500" 
                            />
                            <span className="text-sm text-gray-700">
                              {getPaymentMethodLabel(transaction.payment_method)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {formatDate(transaction.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Eye"
                              onClick={() => handleViewTransaction(transaction.id)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              View
                            </Button>
                            {transaction.status === 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="RefreshCw"
                                onClick={() => handleRefund(transaction.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                Refund
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <span className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                    </span>
                    <div className="lg:hidden w-full sm:w-40">
                      <Select
                        options={[
                          { value: 10, label: '10 per page' },
                          { value: 25, label: '25 per page' },
                          { value: 50, label: '50 per page' }
                        ]}
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      icon="ChevronLeft"
                      disabled={currentPage === 1 || pageLoading}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.ceil(filteredTransactions.length / itemsPerPage) }, (_, i) => i + 1)
                        .filter(page => {
                          const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
                          if (isMobileView) {
                            return page === 1 || 
                                   page === totalPages || 
                                   page === currentPage;
                          }
                          return page === 1 || 
                                 page === totalPages || 
                                 (page >= currentPage - 1 && page <= currentPage + 1);
                        })
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-1 sm:px-2 text-gray-500 text-sm">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              disabled={pageLoading}
                              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-200'
                              } ${pageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))
                      }
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      icon="ChevronRight"
                      disabled={currentPage >= Math.ceil(filteredTransactions.length / itemsPerPage) || pageLoading}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                    </Button>
                  </div>

                  {pageLoading && (
                    <div className="text-xs text-blue-600 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Loading page...
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Payment Methods Section */}
        {!loading && revenueAnalytics?.payment_methods && revenueAnalytics.payment_methods.length > 0 && (
          <div className="my-6 sm:my-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Methods</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Revenue breakdown by payment gateway</p>
              </div>
              <Button
                variant="default"
                size="sm"
                icon="Settings"
                onClick={() => navigate('/admin/payment-settings')}
                className="mt-3 sm:mt-0 w-full sm:w-auto"
              >
                Configure
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {revenueAnalytics.payment_methods.map((method, index) => {
                const config = getPaymentMethodConfig(method.method_id);
                const statusBreakdown = getMethodStatusBreakdown(method.method_id);
                
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg"
                  >
                    {/* Card Header */}
                    <div className={`p-4 sm:p-6 bg-gradient-to-r ${config.bgColor} rounded-t-xl`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Icon name={config.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white">{method.method}</h3>
                            <p className="text-xs text-white/80 mt-1">{config.description}</p>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-white/20 rounded-full">
                          <span className="text-xs font-semibold text-white">{method.percentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-6 space-y-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium">Transactions</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                            {method.transactions?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{method.percentage}% share</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium">Revenue</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                            {formatCurrency(method.amount)}
                          </p>
                          <p className="text-xs text-green-600 mt-1 flex items-center">
                            <Icon name="TrendingUp" className="w-3 h-3 mr-1" />
                            Active
                          </p>
                        </div>
                      </div>

                      {/* Performance Metrics with Real Success Rate */}
                      {statusBreakdown && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Success Rate</span>
                              <span className={`font-semibold ${
                                statusBreakdown.successRate >= 95 ? 'text-green-600' :
                                statusBreakdown.successRate >= 85 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {statusBreakdown.successRate}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  statusBreakdown.successRate >= 95 ? 'bg-green-500' :
                                  statusBreakdown.successRate >= 85 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${statusBreakdown.successRate}%` }}
                              />
                            </div>
                          </div>

                          {/* Status Breakdown */}
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-700 mb-2">Transaction Status</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                                  Completed
                                </span>
                                <span className="font-semibold text-gray-900">{statusBreakdown.completed}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                                  Failed
                                </span>
                                <span className="font-semibold text-gray-900">{statusBreakdown.failed}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
                                  Pending
                                </span>
                                <span className="font-semibold text-gray-900">{statusBreakdown.pending}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>
                                  Refunded
                                </span>
                                <span className="font-semibold text-gray-900">{statusBreakdown.refunded}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Transaction Stats */}
                      <div className="pt-3 border-t border-gray-100 space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Avg Transaction</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(method.transactions > 0 ? method.amount / method.transactions : 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Transaction Fees</span>
                          <span className="font-medium text-gray-900">{config.fees}</span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        icon="BarChart2"
                        onClick={() => navigate(`/admin/payment-methods/${method.method_id}/analytics`)}
                        className="w-full mt-2"
                      >
                        View Analytics
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Secondary Stats Row */}
        {!loading && refundStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Refund Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Refunds</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(refundStats.total_refunded || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {refundStats.refund_count || 0} refund requests
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
                  <Icon name="RefreshCw" className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Success Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {revenueAnalytics?.success_rate || 0}%
                  </p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <Icon name="TrendingUp" className="w-3 h-3 mr-1" />
                    Excellent performance
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                  <Icon name="CheckCircle" className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Average Transaction */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Avg Transaction</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(revenueAnalytics?.average_transaction || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Per transaction</p>
                </div>
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <Icon name="BarChart2" className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
