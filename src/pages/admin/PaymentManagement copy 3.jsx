import React, { useState, useEffect } from 'react';
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
  
  // API Data State
  const [transactions, setTransactions] = useState([]);
  const [paymentOverview, setPaymentOverview] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [refundStats, setRefundStats] = useState(null);
  
  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination Data
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
   * Load all payment data from Django backend
   */
  useEffect(() => {
  loadPaymentData();
}, []);
useEffect(() => {
  fetchAllPayments();
}, []);
const fetchAllPayments = async () => {
  setTransactions([]);
  setTotalCount(0);

  let nextUrl = `/payments/admin/payments/?ordering=${sortBy}&page_size=20`;
  let totalCountLocal = 0;

  if (searchTerm) nextUrl += `&search=${encodeURIComponent(searchTerm)}`;
  if (statusFilter) nextUrl += `&status=${statusFilter}`;
  if (paymentMethodFilter) nextUrl += `&payment_method=${paymentMethodFilter}`;

  while (nextUrl) {
    console.log(`🔄 Fetching payments: ${nextUrl}`);

    const response = await axiosInstance.get(
      nextUrl,
      getAuthHeader()
    );

    // First page → capture total count
    if (totalCountLocal === 0) {
      totalCountLocal = response.data.count || 0;
      setTotalCount(totalCountLocal);
      console.log(`📊 Total payments: ${totalCountLocal}`);
    }

    const pageResults = response.data.results || [];

    setTransactions(prev => {
      const merged = [...prev, ...pageResults];

      merged.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      return merged;
    });

    nextUrl = response.data.next;

    if (nextUrl) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  console.log('✅ All payments fetched');
};
const fetchPaymentMetrics = async () => {
  const [
    overviewRes,
    analyticsRes,
    refundStatsRes
  ] = await Promise.all([
    axiosInstance.get(
      `/payments/admin/overview/`,
      getAuthHeader()
    ),
    axiosInstance.get(
      `/payments/admin/analytics/revenue/`,
      getAuthHeader()
    ),
    axiosInstance.get(
      `/payments/admin/analytics/refunds/`,
      getAuthHeader()
    )
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
   * Fetch payment data from Django API - CORRECTED ENDPOINTS
   */
const loadPaymentData = async () => {
  try {
    setLoading(true);
    setError(null);


    // Metrics can be parallel
    await fetchPaymentMetrics();

    console.log('🎉 Payments + Metrics fully loaded');

  } catch (err) {
    console.error('❌ Error loading payment data:', err);
    setError(
      err.response?.data?.error ||
      err.message ||
      'Failed to load payment data'
    );
  } finally {
    setLoading(false);
  }
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
    switch (method) {
      case 'razorpay':
        return 'CreditCard';
      case 'paypal':
        return 'DollarSign';
      case 'stripe':
        return 'CreditCard';
      default:
        return 'CreditCard';
    }
  };

  /**
   * Get display label for payment method
   */
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'razorpay':
        return 'Razorpay';
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
      default:
        return method;
    }
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
    setCurrentPage(1);
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
    navigate(`/admin/transactions/${transactionId}`);
  };

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-700 text-sm">{error}</p>
          <Button
            variant="default"
            size="sm"
            onClick={() => loadPaymentData()}
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
         <div className="mb-6 sm:mb-8">
          <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Payment Management</h1>
            <p className="text-text-secondary">Monitor transactions, process refunds, and manage payouts</p>
          </div>

          {/* Payment Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              <div className="col-span-4 text-center py-8">
                <p className="text-muted-foreground">Loading payment data...</p>
              </div>
            ) : paymentOverview ? (
              <>
                {/* Today's Revenue Card */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Revenue</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(paymentOverview.today)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="DollarSign" size={24} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {paymentOverview.transactionVolume.today} transactions
                  </p>
                </div>

                {/* This Week Revenue Card */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(paymentOverview.thisWeek)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} className="text-success" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {paymentOverview.transactionVolume.thisWeek} transactions
                  </p>
                </div>

                {/* This Month Revenue Card */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(paymentOverview.thisMonth)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="Calendar" size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {paymentOverview.transactionVolume.thisMonth} transactions
                  </p>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(paymentOverview.total)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon name="BarChart3" size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {paymentOverview.transactionVolume.total} transactions
                  </p>
                </div>
              </>
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Transactions Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full sm:w-48"
                      />
                      <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(val) => {
                          setStatusFilter(val);
                          setCurrentPage(1);
                        }}
                        className="w-full sm:w-32"
                      />
                      <Select
                        options={paymentMethodOptions}
                        value={paymentMethodFilter}
                        onChange={(val) => {
                          setPaymentMethodFilter(val);
                          setCurrentPage(1);
                        }}
                        className="w-full sm:w-36"
                      />
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="px-6 py-8 text-center">
                    <p className="text-muted-foreground">Loading transactions...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-6 py-3 text-left">
                              <button
                                onClick={() => handleSort('created_at')}
                                className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                              >
                                <span>Date</span>
                                {sortBy.includes('created_at') && (
                                  <Icon name={sortBy === '-created_at' ? 'ChevronDown' : 'ChevronUp'} size={12} />
                                )}
                              </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left">
                              <button
                                onClick={() => handleSort('amount')}
                                className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                              >
                                <span>Amount</span>
                                {sortBy.includes('amount') && (
                                  <Icon name={sortBy === '-amount' ? 'ChevronDown' : 'ChevronUp'} size={12} />
                                )}
                              </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Method
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-muted/50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-foreground">{formatDate(transaction.created_at)}</div>
                                <div className="text-xs text-muted-foreground">{transaction.transaction_id}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-foreground">
                                    {transaction.user_name || transaction.user_email}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{transaction.user_email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-foreground">
                                  {formatCurrency(transaction.amount)}
                                </div>
                                <div className="text-xs text-muted-foreground">{transaction.currency}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(transaction.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <Icon name={getPaymentMethodIcon(transaction.payment_method)} size={14} className="text-muted-foreground" />
                                  <span className="text-sm text-foreground">
                                    {getPaymentMethodLabel(transaction.payment_method)}
                                  </span>
                                </div>
                              </td>
                            
<td className="px-6 py-4 whitespace-nowrap">
  <div className="flex items-center space-x-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(`/admin/payments/${transaction.id}`)}
      iconName="Eye"
    />
    {transaction.status === 'completed' && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleRefund(transaction.id)}
        iconName="RotateCcw"
        className="text-warning hover:bg-warning hover:text-white"
      />
    )}
  </div>
</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              iconName="ChevronLeft"
                            />
                            <span className="text-sm text-foreground">
                              Page {currentPage} of {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              iconName="ChevronRight"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Revenue Analytics Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Total Revenue</h4>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(revenueAnalytics?.total_revenue || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {revenueAnalytics?.total_completed_transactions || 0} completed payments
                    </p>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Average Transaction</h4>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(revenueAnalytics?.average_transaction_value || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Refund Rate</h4>
                    <p className="text-2xl font-bold text-warning">
                      {revenueAnalytics?.refund_rate || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {revenueAnalytics?.total_refunded_transactions || 0} refunded
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-8">
              {/* Payment Methods Breakdown */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h3>
                
                <div className="space-y-4">
                  {revenueAnalytics?.payment_methods && revenueAnalytics.payment_methods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon name={getPaymentMethodIcon(method.method_id)} size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{method.method}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(method.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {method.percentage}% • {method.transactions} txns
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Statistics */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Refund Statistics</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Refund Rate</span>
                    <span className="text-sm font-medium text-foreground">
                      {refundStats?.refund_rate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Refunded</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(refundStats?.total_refunded_amount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending Requests</span>
                    <span className="text-sm font-medium text-foreground">
                      {refundStats?.pending_refund_requests || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Processed Refunds</span>
                    <span className="text-sm font-medium text-foreground">
                      {refundStats?.processed_refund_requests || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/refunds')}
                    iconName="RotateCcw"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Manage Refunds
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/payouts')}
                    iconName="Users"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Instructor Payouts
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/reports')}
                    iconName="FileText"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Generate Reports
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;