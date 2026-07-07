import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const PaymentManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

 
  // Mock transactions data
  const transactions = [
    {
      id: 'TXN-2024-001',
      date: '2024-12-01T10:30:00Z',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        id: 1
      },
      amount: 89.99,
      status: 'completed',
      paymentMethod: 'credit_card',
      webinar: 'Advanced React Patterns',
      transactionFee: 2.70,
      netAmount: 87.29,
      refundable: true,
      instructor: 'Dr. Michael Chen'
    },
    {
      id: 'TXN-2024-002',
      date: '2024-12-01T14:15:00Z',
      user: {
        name: 'David Kim',
        email: 'david.k@email.com',
        id: 2
      },
      amount: 49.99,
      status: 'pending',
      paymentMethod: 'paypal',
      webinar: 'JavaScript ES2024 Features',
      transactionFee: 1.50,
      netAmount: 48.49,
      refundable: false,
      instructor: 'Emily Rodriguez'
    },
    {
      id: 'TXN-2024-003',
      date: '2024-11-30T16:45:00Z',
      user: {
        name: 'Michael Chen',
        email: 'michael.c@email.com',
        id: 3
      },
      amount: 79.99,
      status: 'refunded',
      paymentMethod: 'credit_card',
      webinar: 'Node.js Performance',
      transactionFee: 2.40,
      netAmount: 77.59,
      refundAmount: 79.99,
      refundDate: '2024-12-01T09:00:00Z',
      refundable: false,
      instructor: 'Dr. Michael Chen'
    }
  ];

  // Mock payment overview data
  const paymentOverview = {
    today: 1240.50,
    thisWeek: 8450.75,
    thisMonth: 32150.25,
    total: 245780.90,
    transactionVolume: {
      today: 15,
      thisWeek: 89,
      thisMonth: 324,
      total: 2847
    }
  };

  // Mock revenue analytics data
  const revenueAnalytics = {
    paymentMethods: [
      { method: 'Credit Card', percentage: 65, amount: 20900.16, transactions: 210 },
      { method: 'PayPal', percentage: 25, amount: 8037.56, transactions: 89 },
      { method: 'Bank Transfer', percentage: 10, amount: 3212.53, transactions: 25 }
    ],
    refundRate: 2.8,
    averageTransactionValue: 89.45,
    platformCommission: 15, // 15%
    instructorPayout: 85 // 85%
  };

  // Mock instructor payouts queue
  const instructorPayouts = [
    {
      id: 1,
      instructor: 'Dr. Michael Chen',
      amount: 2450.75,
      webinarsCount: 3,
      payoutDate: '2024-12-15',
      status: 'pending'
    },
    {
      id: 2,
      instructor: 'Emily Rodriguez',
      amount: 1890.50,
      webinarsCount: 2,
      payoutDate: '2024-12-15',
      status: 'pending'
    }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const paymentMethodOptions = [
    { value: '', label: 'All Methods' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
  ];

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
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return 'CreditCard';
      case 'paypal':
        return 'DollarSign';
      case 'bank_transfer':
        return 'Building';
      default:
        return 'CreditCard';
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'paypal':
        return 'PayPal';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  // Filter and sort transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.webinar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    const matchesPaymentMethod = !paymentMethodFilter || transaction.paymentMethod === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
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
      case 'user':
        aValue = a.user.name.toLowerCase();
        bValue = b.user.name.toLowerCase();
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleRefund = (transactionId) => {
    console.log('Processing refund for transaction:', transactionId);
    // In real app, this would process the refund
  };

  const handleProcessPayout = (payoutId) => {
    console.log('Processing payout:', payoutId);
    // In real app, this would process the instructor payout
  };



  const customBreadcrumbs = [
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'Payment Management', href: null }
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Management</h1>
            <p className="text-text-secondary">Monitor transactions, process refunds, and manage payouts</p>
          </div>

          {/* Payment Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(paymentOverview.today)}</p>
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
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(paymentOverview.thisWeek)}</p>
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
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(paymentOverview.thisMonth)}</p>
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
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(paymentOverview.total)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={24} className="text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {paymentOverview.transactionVolume.total} transactions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Transactions Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-48"
                      />
                      <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        className="w-full sm:w-32"
                      />
                      <Select
                        options={paymentMethodOptions}
                        value={paymentMethodFilter}
                        onChange={setPaymentMethodFilter}
                        className="w-full sm:w-36"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <button
                            onClick={() => handleSort('date')}
                            className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                          >
                            <span>Date</span>
                            {sortBy === 'date' && (
                              <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left">
                          <button
                            onClick={() => handleSort('user')}
                            className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                          >
                            <span>User</span>
                            {sortBy === 'user' && (
                              <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left">
                          <button
                            onClick={() => handleSort('amount')}
                            className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                          >
                            <span>Amount</span>
                            {sortBy === 'amount' && (
                              <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
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
                          Webinar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">{formatDate(transaction.date)}</div>
                            <div className="text-xs text-muted-foreground">{transaction.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-foreground">{transaction.user.name}</div>
                              <div className="text-xs text-muted-foreground">{transaction.user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">{formatCurrency(transaction.amount)}</div>
                            <div className="text-xs text-muted-foreground">
                              Net: {formatCurrency(transaction.netAmount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(transaction.status)}
                            {transaction.status === 'refunded' && transaction.refundDate && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Refunded: {formatDate(transaction.refundDate)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Icon name={getPaymentMethodIcon(transaction.paymentMethod)} size={14} className="text-muted-foreground" />
                              <span className="text-sm text-foreground">{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-foreground line-clamp-1">{transaction.webinar}</div>
                            <div className="text-xs text-muted-foreground">{transaction.instructor}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/admin/transactions/${transaction.id}`)}
                                iconName="Eye"
                              />
                              {transaction.refundable && transaction.status === 'completed' && (
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length} results
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
              </div>

              {/* Revenue Analytics */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Analytics</h3>
                
                {/* Mock charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Daily Revenue</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <Icon name="TrendingUp" size={32} className="text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Payment Methods</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <Icon name="PieChart" size={32} className="text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Refund Rates</h4>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <Icon name="BarChart3" size={32} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Payment Methods Breakdown */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h3>
                
                <div className="space-y-4">
                  {revenueAnalytics.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon name={getPaymentMethodIcon(method.method.toLowerCase().replace(' ', '_'))} size={16} className="text-muted-foreground" />
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

              {/* Key Metrics */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Refund Rate</span>
                    <span className="text-sm font-medium text-foreground">{revenueAnalytics.refundRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Transaction</span>
                    <span className="text-sm font-medium text-foreground">{formatCurrency(revenueAnalytics.averageTransactionValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Platform Commission</span>
                    <span className="text-sm font-medium text-foreground">{revenueAnalytics.platformCommission}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Instructor Share</span>
                    <span className="text-sm font-medium text-foreground">{revenueAnalytics.instructorPayout}%</span>
                  </div>
                </div>
              </div>

              {/* Instructor Payout Queue */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Payout Queue</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/payouts')}
                    iconName="ExternalLink"
                    iconPosition="right"
                  >
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {instructorPayouts.map((payout) => (
                    <div key={payout.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{payout.instructor}</span>
                        <span className="text-sm font-semibold text-foreground">{formatCurrency(payout.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{payout.webinarsCount} webinars</span>
                        <span>Due: {payout.payoutDate}</span>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleProcessPayout(payout.id)}
                        iconName="Send"
                        iconPosition="left"
                        className="w-full"
                      >
                        Process Payout
                      </Button>
                    </div>
                  ))}
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
