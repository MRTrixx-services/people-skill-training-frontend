import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import axiosInstance from 'config/axiosInstance';

const PaymentManagement = () => {
  const navigate = useNavigate();
  
  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('-created_at');
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  
  // New: Grouping and View Mode
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grouped'
  const [expandedWebinars, setExpandedWebinars] = useState(new Set());
  
  // API Data State
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [paymentOverview, setPaymentOverview] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [refundStats, setRefundStats] = useState(null);
  
  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  
  // Pagination Data
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Get authorization header
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
   * Fetch ALL payments progressively
   */
  useEffect(() => {
    loadPaymentData();
  }, []);

  const fetchAllPayments = async () => {
    setAllTransactions([]);
    setTransactions([]);
    setTotalCount(0);
    setLoading(true);

    let nextUrl = `/payments/admin/payments/?ordering=${sortBy}&page_size=50`;
    let totalCountLocal = 0;
    let accumulatedData = [];
    let isFirstPage = true;

    while (nextUrl) {
      try {
        const response = await axiosInstance.get(nextUrl, getAuthHeader());

        if (totalCountLocal === 0) {
          totalCountLocal = response.data.count || 0;
          setTotalCount(totalCountLocal);
        }

        const pageResults = response.data.results || [];
        accumulatedData = [...accumulatedData, ...pageResults];
        
        setAllTransactions(accumulatedData);

        const filtered = applyFilters(accumulatedData, searchTerm, statusFilter, paymentMethodFilter, dateRange);
        const sorted = applySorting(filtered, sortBy);
        setTransactions(sorted);

        if (isFirstPage) {
          setLoading(false);
          isFirstPage = false;
          if (response.data.next) {
            setLoadingMore(true);
          }
        }

        nextUrl = response.data.next;
        if (nextUrl) await new Promise(resolve => setTimeout(resolve, 50));
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load payments');
        setLoading(false);
        setLoadingMore(false);
        break;
      }
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const applyFilters = (data, search, status, method, dateRange) => {
    return data.filter(tx => {
      const matchesSearch = !search ||
        tx.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        tx.user_email?.toLowerCase().includes(search.toLowerCase()) ||
        tx.transaction_id?.includes(search) ||
        tx.invoice_number?.includes(search) ||
        tx.payment_webinars?.some(w => 
          w.webinar_title?.toLowerCase().includes(search.toLowerCase()) ||
          w.webinar_id?.toString().includes(search)
        );

      const matchesStatus = !status || tx.status === status;
      const matchesMethod = !method || tx.payment_method === method;

      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        const txDate = new Date(tx.created_at);
        if (dateRange.start) matchesDate = matchesDate && txDate >= new Date(dateRange.start);
        if (dateRange.end) matchesDate = matchesDate && txDate <= new Date(dateRange.end);
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  };

  const applySorting = (data, field) => {
    const desc = field.startsWith('-');
    const key = desc ? field.slice(1) : field;

    return [...data].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === 'created_at') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (typeof aVal === 'string' && !isNaN(aVal)) aVal = parseFloat(aVal);
      if (typeof bVal === 'string' && !isNaN(bVal)) bVal = parseFloat(bVal);

      if (aVal < bVal) return desc ? 1 : -1;
      if (aVal > bVal) return desc ? -1 : 1;
      return 0;
    });
  };

  const fetchPaymentMetrics = async () => {
    try {
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
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  const loadPaymentData = async () => {
    try {
      setError(null);
      await Promise.all([fetchAllPayments(), fetchPaymentMetrics()]);
    } catch (err) {
      console.error('Error loading payment data:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to load payment data'
      );
    }
  };

  useEffect(() => {
    const filtered = applyFilters(allTransactions, searchTerm, statusFilter, paymentMethodFilter, dateRange);
    const sorted = applySorting(filtered, sortBy);
    setTransactions(sorted);
    setCurrentPage(1);
  }, [allTransactions, searchTerm, statusFilter, paymentMethodFilter, dateRange, sortBy]);

  /**
   * Group transactions by webinar
   */
  const groupedByWebinar = useMemo(() => {
    const groups = {};
    
    transactions.forEach(tx => {
      if (tx.payment_webinars && tx.payment_webinars.length > 0) {
        tx.payment_webinars.forEach(webinar => {
          const key = webinar.webinar_id;
          if (!groups[key]) {
            groups[key] = {
              webinar_id: webinar.webinar_id,
              webinar_title: webinar.webinar_title,
              transactions: [],
              totalRevenue: 0,
              totalTransactions: 0,
              completedCount: 0,
              pendingCount: 0,
              failedCount: 0,
              refundedCount: 0,
              accessTypes: {}
            };
          }
          
          groups[key].transactions.push(tx);
          groups[key].totalTransactions++;
          groups[key].totalRevenue += parseFloat(tx.amount) || 0;
          
          // Count by status
          if (tx.status === 'completed') groups[key].completedCount++;
          else if (tx.status === 'pending') groups[key].pendingCount++;
          else if (tx.status === 'failed') groups[key].failedCount++;
          else if (tx.status === 'refunded') groups[key].refundedCount++;
          
          // Count access types
          const accessType = webinar.access_type || 'unknown';
          groups[key].accessTypes[accessType] = (groups[key].accessTypes[accessType] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by revenue
    return Object.values(groups).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [transactions]);

  // Pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIndex, startIndex + itemsPerPage);
  };

  /**
   * Export to Excel with detailed analytics and colors
   */
  const exportToExcel = async () => {
    setExporting(true);
    try {
      // Create detailed export data
      const exportData = {
        transactions: allTransactions,
        groupedByWebinar: groupedByWebinar,
        overview: paymentOverview,
        dateGenerated: new Date().toISOString()
      };

      // Send to backend to generate Excel with Python openpyxl
      const response = await axiosInstance.post(
        '/payments/admin/export-excel/',
        exportData,
        {
          ...getAuthHeader(),
          responseType: 'blob'
        }
      );

      // Download the file
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `payment_analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data. Falling back to CSV export.');
      exportToCSV();
    } finally {
      setExporting(false);
    }
  };

  /**
   * Fallback CSV export
   */
  const exportToCSV = () => {
    try {
      const headers = [
        'ID', 'Transaction ID', 'User Name', 'User Email', 'Amount', 'Currency',
        'Status', 'Payment Method', 'Invoice Number', 'Created At', 'Completed At',
        'Webinar Titles', 'Platform Name'
      ];
      
      const csvContent = [
        headers.join(','),
        ...allTransactions.map(tx => {
          const webinarTitles = tx.payment_webinars?.map(w => w.webinar_title).join('; ') || '';
          const platformName = tx.platform_info?.name || '';
          
          return [
            `"${tx.id}"`,
            `"${tx.transaction_id}"`,
            `"${tx.user_name || ''}"`,
            `"${tx.user_email || ''}"`,
            `"${tx.amount}"`,
            `"${tx.currency}"`,
            `"${tx.status}"`,
            `"${tx.payment_method}"`,
            `"${tx.invoice_number}"`,
            `"${new Date(tx.created_at).toISOString()}"`,
            `"${tx.completed_at ? new Date(tx.completed_at).toISOString() : ''}"`,
            `"${webinarTitles}"`,
            `"${platformName}"`
          ].join(',');
        })
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('CSV Export error:', err);
      alert('Failed to export data');
    }
  };

  // UI Helpers
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const paymentMethodOptions = [
    { value: '', label: 'All Methods' },
    { value: 'razorpay', label: 'Razorpay' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' }
  ];

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'N/A';
    }
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

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

  const handleSort = (field) => {
    setSortBy(sortBy === `-${field}` ? field : `-${field}`);
    setCurrentPage(1);
  };

  const toggleWebinarExpansion = (webinarId) => {
    const newExpanded = new Set(expandedWebinars);
    if (newExpanded.has(webinarId)) {
      newExpanded.delete(webinarId);
    } else {
      newExpanded.add(webinarId);
    }
    setExpandedWebinars(newExpanded);
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
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Payment Management
            </h1>
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

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Input
                type="date"
                placeholder="Start Date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full"
              />
              <Input
                type="date"
                placeholder="End Date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full"
              />
              
              <Select
                options={[
                  { value: 'list', label: 'List View' },
                  { value: 'grouped', label: 'Group by Webinar' }
                ]}
                value={viewMode}
                onChange={setViewMode}
                className="w-full"
              />
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPaymentMethodFilter('');
                  setDateRange({ start: '', end: '' });
                  setCurrentPage(1);
                }}
                className="flex-1"
              >
                Clear Filters
              </Button>
              
              <Button
                variant="default"
                onClick={exportToExcel}
                disabled={exporting || allTransactions.length === 0}
                className="flex-1"
              >
                {exporting ? 'Exporting...' : 'Export Excel'}
              </Button>
              
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={exporting || allTransactions.length === 0}
                className="flex-1"
              >
                Export CSV
              </Button>
            </div>
          </div>

          {/* Grouped View */}
          {viewMode === 'grouped' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Payments Grouped by Webinar</h3>
                {groupedByWebinar.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No webinar payments found</p>
                ) : (
                  <div className="space-y-3">
                    {groupedByWebinar.map((group) => (
                      <div key={group.webinar_id} className="border border-border rounded-lg overflow-hidden">
                        <div 
                          className="bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleWebinarExpansion(group.webinar_id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <Icon 
                                  name={expandedWebinars.has(group.webinar_id) ? "ChevronDown" : "ChevronRight"} 
                                  size={20} 
                                />
                                <div>
                                  <h4 className="font-semibold text-foreground">{group.webinar_title}</h4>
                                  <p className="text-sm text-muted-foreground">ID: {group.webinar_id}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Revenue</p>
                                <p className="text-lg font-bold text-foreground">{formatCurrency(group.totalRevenue)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Transactions</p>
                                <p className="text-lg font-bold text-foreground">{group.totalTransactions}</p>
                              </div>
                              <div className="flex gap-2">
                                {group.completedCount > 0 && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {group.completedCount} Completed
                                  </span>
                                )}
                                {group.pendingCount > 0 && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    {group.pendingCount} Pending
                                  </span>
                                )}
                                {group.failedCount > 0 && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                    {group.failedCount} Failed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {expandedWebinars.has(group.webinar_id) && (
                          <div className="p-4 bg-white">
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">User</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Amount</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Access Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {group.transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-muted/20">
                                      <td className="px-4 py-3 text-sm">{formatDate(tx.created_at)}</td>
                                      <td className="px-4 py-3 text-sm">{tx.user_name || tx.user_email}</td>
                                      <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(tx.amount)}</td>
                                      <td className="px-4 py-3 text-sm">
                                        {tx.payment_webinars?.find(w => w.webinar_id === group.webinar_id)?.access_type || 'N/A'}
                                      </td>
                                      <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                                      <td className="px-4 py-3">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => navigate(`/admin/payments/${tx.id}`)}
                                          iconName="Eye"
                                        >
                                          View
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">Recent Webinar Payments</h3>
                    {loadingMore && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
                        <span>Loading more...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      type="text"
                      placeholder="Search payments, webinars..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full sm:w-64"
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
                <div className="px-4 sm:px-6 py-8 text-center">
                  <p className="text-muted-foreground">Loading payment data...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="px-4 sm:px-6 py-8 text-center">
                  <p className="text-muted-foreground">No webinar payments found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-muted/70">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left">
                            <button
                              onClick={() => handleSort('created_at')}
                              className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground focus:outline-none"
                            >
                              <span>Date</span>
                              {sortBy.includes('created_at') && (
                                <Icon 
                                  name={sortBy === '-created_at' ? 'ChevronDown' : 'ChevronUp'} 
                                  size={12} 
                                />
                              )}
                            </button>
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Webinar
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left">
                            <button
                              onClick={() => handleSort('amount')}
                              className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground focus:outline-none"
                            >
                              <span>Amount</span>
                              {sortBy.includes('amount') && (
                                <Icon 
                                  name={sortBy === '-amount' ? 'ChevronDown' : 'ChevronUp'} 
                                  size={12} 
                                />
                              )}
                            </button>
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Access Type
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {getCurrentPageData().map((transaction) => (
                          <tr 
                            key={transaction.id} 
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-foreground">
                                {formatDate(transaction.created_at)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatTime(transaction.created_at)}
                              </div>
                            </td>

                            <td className="px-4 sm:px-6 py-4">
                              <div className="text-sm font-medium text-foreground truncate max-w-[180px]" title={transaction.user_name || transaction.user_email}>
                                {transaction.user_name || transaction.user_email}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-[180px]" title={transaction.user_email}>
                                {transaction.user_email}
                              </div>
                            </td>

                            <td className="px-4 sm:px-6 py-4">
                              <div className="space-y-1">
                                {transaction.payment_webinars && transaction.payment_webinars.map((webinar, index) => (
                                  <div key={index} className="border-l-3 border-primary pl-3 py-1 bg-muted/30 rounded-r">
                                    <div className="text-sm font-semibold text-foreground line-clamp-1" title={webinar.webinar_title}>
                                      {webinar.webinar_title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      ID: {webinar.webinar_id}
                                    </div>
                                  </div>
                                ))}
                                {!transaction.payment_webinars?.length && (
                                  <div className="text-sm text-muted-foreground italic">
                                    No webinar details
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-foreground">
                                {formatCurrency(transaction.amount)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {transaction.currency?.toUpperCase()}
                              </div>
                            </td>

                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {transaction.payment_webinars && transaction.payment_webinars.map((webinar, index) => (
                                  <span 
                                    key={index} 
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      webinar.access_type === 'liveOne' 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : webinar.access_type === 'recorded' 
                                        ? 'bg-green-100 text-green-700'
                                        : webinar.access_type === 'lifetime'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {webinar.access_type === 'liveOne' && 'Live Access'}
                                    {webinar.access_type === 'recorded' && 'Recording'}
                                    {webinar.access_type === 'lifetime' && 'Lifetime'}
                                    {webinar.access_type !== 'liveOne' && webinar.access_type !== 'recorded' && webinar.access_type !== 'lifetime' && webinar.access_type}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(transaction.status)}
                            </td>

                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/admin/payments/${transaction.id}`)}
                                iconName="Eye"
                                className="text-primary hover:bg-primary hover:text-white"
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="px-4 sm:px-6 py-4 border-t border-border">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-sm text-muted-foreground">
                          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(currentPage * itemsPerPage, transactions.length)}</span> of{' '}
                          <span className="font-medium">{transactions.length}</span> filtered payments
                          {loadingMore && <span className="ml-2 text-primary">(loading {totalCount} total...)</span>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            iconName="ChevronLeft"
                          />
                          <span className="text-sm font-medium text-foreground min-w-[70px] text-center">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;