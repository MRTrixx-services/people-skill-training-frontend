import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const RevenueReports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState('this-month');

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Dr. Michael Chen",
      email: "michael.chen@email.com",
      role: "instructor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock revenue data
  const revenueOverview = {
    totalEarnings: 18450.50,
    thisMonth: 3250.75,
    lastMonth: 2890.25,
    growth: 12.5,
    totalWebinars: 24,
    totalStudents: 1247,
    avgRevenuePerWebinar: 768.77
  };

  const webinarRevenue = [
    {
      id: 1,
      title: "Advanced React Patterns",
      date: "2024-11-28",
      enrollments: 47,
      price: 89.99,
      revenue: 4229.53,
      refunds: 2,
      netRevenue: 4049.55
    },
    {
      id: 2,
      title: "JavaScript ES2024 Features",
      date: "2024-11-25",
      enrollments: 32,
      price: 79.99,
      revenue: 2559.68,
      refunds: 1,
      netRevenue: 2479.69
    },
    {
      id: 3,
      title: "Node.js Performance",
      date: "2024-11-22",
      enrollments: 35,
      price: 69.99,
      revenue: 2449.65,
      refunds: 0,
      netRevenue: 2449.65
    },
    {
      id: 4,
      title: "Modern CSS Techniques",
      date: "2024-11-18",
      enrollments: 28,
      price: 59.99,
      revenue: 1679.72,
      refunds: 1,
      netRevenue: 1619.73
    }
  ];

  const monthlyRevenue = [
    { month: "Jan 2024", revenue: 1250.00, webinars: 2 },
    { month: "Feb 2024", revenue: 2150.50, webinars: 3 },
    { month: "Mar 2024", revenue: 1890.25, webinars: 2 },
    { month: "Apr 2024", revenue: 3200.75, webinars: 4 },
    { month: "May 2024", revenue: 2750.00, webinars: 3 },
    { month: "Jun 2024", revenue: 3450.25, webinars: 4 },
    { month: "Jul 2024", revenue: 2950.75, webinars: 3 },
    { month: "Aug 2024", revenue: 3850.50, webinars: 5 },
    { month: "Sep 2024", revenue: 2650.00, webinars: 3 },
    { month: "Oct 2024", revenue: 4200.25, webinars: 5 },
    { month: "Nov 2024", revenue: 3250.75, webinars: 4 }
  ];

  const paymentMethods = [
    { method: "Credit Card", percentage: 65, amount: 11992.82 },
    { method: "PayPal", percentage: 25, amount: 4612.62 },
    { method: "Bank Transfer", percentage: 10, amount: 1845.06 }
  ];

  const payoutInfo = {
    nextPayoutDate: "2024-12-15",
    nextPayoutAmount: 2890.45,
    lastPayoutDate: "2024-11-15",
    lastPayoutAmount: 2650.30,
    totalPending: 3250.75,
    accountDetails: {
      bankName: "Chase Bank",
      accountNumber: "****1234",
      routingNumber: "****5678"
    }
  };

  const paymentHistory = [
    {
      id: 1,
      date: "2024-11-15",
      amount: 2650.30,
      status: "completed",
      reference: "PAY_001234"
    },
    {
      id: 2,
      date: "2024-10-15", 
      amount: 3120.75,
      status: "completed",
      reference: "PAY_001233"
    },
    {
      id: 3,
      date: "2024-09-15",
      amount: 2890.50,
      status: "completed", 
      reference: "PAY_001232"
    },
    {
      id: 4,
      date: "2024-08-15",
      amount: 3450.25,
      status: "completed",
      reference: "PAY_001231"
    }
  ];

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
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleExportData = () => {
    console.log('Exporting revenue data...');
    alert('Revenue report exported successfully!');
  };

  const handleUpdateBankDetails = () => {
    console.log('Opening bank details form...');
    alert('Bank details update form would open here');
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/instructor-dashboard' },
    { label: 'Revenue Reports', href: null }
  ];

  return (
    <div className="min-h-screen bg-background">
    

   
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Revenue Reports</h1>
                <p className="text-text-secondary">Track your earnings and financial performance</p>
              </div>
              <Button
                variant="outline"
                onClick={handleExportData}
                iconName="Download"
                iconPosition="left"
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(revenueOverview.totalEarnings)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                <span className="text-success">All time</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(revenueOverview.thisMonth)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={24} className="text-success" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                <span className="text-success">+{revenueOverview.growth}%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(revenueOverview.lastMonth)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg per Webinar</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(revenueOverview.avgRevenuePerWebinar)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="Video" size={24} className="text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                From {revenueOverview.totalWebinars} webinars
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Earnings Timeline */}
              <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Earnings Over Time</h2>
       
                 <div className="mt-6 border border-border rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={250}>
  <LineChart data={monthlyRevenue}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
    <Line type="monotone" dataKey="webinars" stroke="#10b981" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

           <p className="text-xs text-muted-foreground mt-2">Line chart showing earnings over time</p>
                 </div>
              </div>

              {/* Revenue by Webinar */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">Revenue by Webinar</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Webinar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Enrollments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Gross Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Net Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {webinarRevenue.map((webinar) => (
                        <tr key={webinar.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">{webinar.title}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatDate(webinar.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {webinar.enrollments}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {formatCurrency(webinar.price)}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {formatCurrency(webinar.revenue)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-foreground">
                              {formatCurrency(webinar.netRevenue)}
                            </div>
                            {webinar.refunds > 0 && (
                              <div className="text-xs text-error">
                                {webinar.refunds} refund(s)
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Revenue Chart */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Monthly Revenue</h2>
                
                {/* Mock bar chart */}
                  <div className="mt-6 border border-border rounded-lg p-4">
              <ResponsiveContainer width="100%" height={250}>
  <BarChart data={monthlyRevenue}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="revenue" fill="#3b82f6" />
    <Bar dataKey="webinars" fill="#10b981" />
  </BarChart>
</ResponsiveContainer>
      <p className="text-xs text-muted-foreground mt-2">Bar chart showing monthly revenue</p>
            
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Payment Methods */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h3>
                
                <div className="space-y-4 mb-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{method.method}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(method.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {method.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mock pie chart */}
                <ResponsiveContainer width="100%" height={200}>
  <PieChart>
    <Pie
      data={paymentMethods}
      dataKey="amount"
      nameKey="method"
      cx="50%"
      cy="50%"
      outerRadius={70}
      label
    >
      {paymentMethods.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={
            entry.method === "Credit Card" ? "#3b82f6" :
            entry.method === "PayPal" ? "#10b981" :
            "#f59e0b"
          }
        />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>

              </div>

              {/* Payout Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payout Information</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-primary font-medium">Next Payout</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(payoutInfo.nextPayoutAmount)}
                      </span>
                    </div>
                    <div className="text-xs text-primary/80">
                      {formatDate(payoutInfo.nextPayoutDate)}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(payoutInfo.totalPending)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Payout:</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(payoutInfo.lastPayoutAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Bank Account</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleUpdateBankDetails}
                        iconName="Edit"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{payoutInfo.accountDetails.bankName}</div>
                      <div>Account: {payoutInfo.accountDetails.accountNumber}</div>
                      <div>Routing: {payoutInfo.accountDetails.routingNumber}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment History</h3>
                
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(payment.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payment.status)}
                        <div className="text-xs text-muted-foreground mt-1">
                          {payment.reference}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  iconName="ExternalLink"
                  iconPosition="right"
                >
                  View All Payments
                </Button>
              </div>
            </div>
          </div>
        </div>
   
    </div>
  );
};

export default RevenueReports;
