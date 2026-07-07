import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const SystemLogs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logLevel, setLogLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedRows, setExpandedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock admin user
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@peopleskilltraining.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock log data
  const logs = [
    {
      id: 1,
      timestamp: '2024-12-01T14:30:25.123Z',
      level: 'error',
      message: 'Payment processing failed for user 1247',
      user: 'system',
      ip: '192.168.1.100',
      service: 'payment-service',
      details: {
        error: 'Gateway timeout',
        userId: 1247,
        transactionId: 'TXN-2024-001',
        stack: 'PaymentError: Gateway timeout at processPayment (/app/payment.js:45:12)',
        context: { amount: 89.99, paymentMethod: 'credit_card' }
      }
    },
    {
      id: 2,
      timestamp: '2024-12-01T14:28:15.456Z',
      level: 'warning',
      message: 'High CPU usage detected on webinar server',
      user: 'system',
      ip: '10.0.0.15',
      service: 'monitoring-service',
      details: {
        cpuUsage: '89%',
        threshold: '80%',
        duration: '5 minutes',
        server: 'webinar-01',
        affectedServices: ['zoom-integration', 'video-streaming']
      }
    },
    {
      id: 3,
      timestamp: '2024-12-01T14:25:10.789Z',
      level: 'info',
      message: 'User login successful',
      user: 'sarah.johnson@email.com',
      ip: '203.45.67.89',
      service: 'auth-service',
      details: {
        userId: 1247,
        loginMethod: 'email_password',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_abc123',
        location: 'New York, US'
      }
    },
    {
      id: 4,
      timestamp: '2024-12-01T14:20:05.321Z',
      level: 'debug',
      message: 'Database query execution completed',
      user: 'system',
      ip: '127.0.0.1',
      service: 'database-service',
      details: {
        query: 'SELECT * FROM webinars WHERE status = $1',
        params: ['scheduled'],
        executionTime: '12ms',
        rowsAffected: 45,
        connection: 'pool-connection-3'
      }
    },
    {
      id: 5,
      timestamp: '2024-12-01T14:15:55.654Z',
      level: 'error',
      message: 'Failed to send notification email',
      user: 'system',
      ip: '192.168.1.100',
      service: 'email-service',
      details: {
        recipient: 'user@example.com',
        template: 'webinar-reminder',
        provider: 'sendgrid',
        error: 'SMTP authentication failed',
        retryCount: 3
      }
    }
  ];

  const logLevelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'debug', label: 'Debug' }
  ];

  const errorDashboard = {
    errorFrequency: {
      last24h: 23,
      last7d: 156,
      last30d: 542
    },
    topErrors: [
      { error: 'Payment Gateway Timeout', count: 45, trend: '+12%' },
      { error: 'Zoom API Rate Limit', count: 23, trend: '-8%' },
      { error: 'Database Connection Failed', count: 18, trend: '+25%' },
      { error: 'Email Delivery Failed', count: 12, trend: '-15%' }
    ],
    systemHealth: {
      overall: 94.5,
      api: 96.2,
      database: 98.1,
      email: 89.7,
      zoom: 92.3
    }
  };

  const getLogLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return { icon: 'XCircle', color: 'text-error' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'info':
        return { icon: 'Info', color: 'text-primary' };
      case 'debug':
        return { icon: 'Code', color: 'text-muted-foreground' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getLogLevelBadge = (level) => {
    const styles = {
      error: 'bg-red-100 text-red-800 border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      debug: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${styles[level]}`}>
        {level.toUpperCase()}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleRowExpansion = (logId) => {
    setExpandedRows(prev =>
      prev.includes(logId)
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesLevel = !logLevel || log.level === logLevel;
    const matchesSearch = !searchTerm || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = !userFilter || log.user.toLowerCase().includes(userFilter.toLowerCase());
    
    let matchesDateRange = true;
    if (dateRange.start || dateRange.end) {
      const logDate = new Date(log.timestamp);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      
      if (startDate && logDate < startDate) matchesDateRange = false;
      if (endDate && logDate > endDate) matchesDateRange = false;
    }

    return matchesLevel && matchesSearch && matchesUser && matchesDateRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handleExportLogs = () => {
    console.log('Exporting logs...');
    // In real app, this would export filtered logs
    alert('Logs exported successfully!');
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const customBreadcrumbs = [
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'System Logs', href: null }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userRole="admin"
        currentPath="/admin/system-logs"
      />

      <AppHeader
        user={user}
        notifications={[]}
        onLogout={handleLogout}
        onNotificationClick={() => {}}
      />

      <main className={`transition-all duration-300 ${
        isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } lg:pt-0 pt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">System Logs</h1>
            <p className="text-text-secondary">Monitor system activity and troubleshoot issues</p>
          </div>

          {/* Error Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Errors (24h)</p>
                  <p className="text-2xl font-bold text-foreground">{errorDashboard.errorFrequency.last24h}</p>
                </div>
                <Icon name="XCircle" size={24} className="text-error" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Health</p>
                  <p className="text-2xl font-bold text-foreground">{errorDashboard.systemHealth.api}%</p>
                </div>
                <Icon name="Activity" size={24} className="text-success" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Database</p>
                  <p className="text-2xl font-bold text-foreground">{errorDashboard.systemHealth.database}%</p>
                </div>
                <Icon name="Database" size={24} className="text-success" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Email Service</p>
                  <p className="text-2xl font-bold text-foreground">{errorDashboard.systemHealth.email}%</p>
                </div>
                <Icon name="Mail" size={24} className="text-warning" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Zoom Integration</p>
                  <p className="text-2xl font-bold text-foreground">{errorDashboard.systemHealth.zoom}%</p>
                </div>
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">Z</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Log Filters */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select
                    label="Log Level"
                    options={logLevelOptions}
                    value={logLevel}
                    onChange={setLogLevel}
                  />
                  
                  <Input
                    label="Search Message"
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <Input
                    label="User/IP Filter"
                    type="text"
                    placeholder="Filter by user/IP..."
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  />
                  
                  <Input
                    label="Start Date"
                    type="datetime-local"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                  
                  <Input
                    label="End Date"
                    type="datetime-local"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">Auto Refresh</span>
                    </label>
                    {autoRefresh && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span>Live</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLogLevel('');
                        setSearchTerm('');
                        setUserFilter('');
                        setDateRange({ start: '', end: '' });
                      }}
                      iconName="X"
                      iconPosition="left"
                    >
                      Clear Filters
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleExportLogs}
                      iconName="Download"
                      iconPosition="left"
                    >
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      System Logs ({filteredLogs.length})
                    </h3>
                    <Select
                      options={[
                        { value: '25', label: '25 per page' },
                        { value: '50', label: '50 per page' },
                        { value: '100', label: '100 per page' }
                      ]}
                      value={itemsPerPage.toString()}
                      onChange={(value) => setItemsPerPage(parseInt(value))}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">
                          
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Service
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedLogs.map((log) => (
                        <React.Fragment key={log.id}>
                          <tr 
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => toggleRowExpansion(log.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Icon 
                                name={expandedRows.includes(log.id) ? 'ChevronDown' : 'ChevronRight'} 
                                size={14} 
                                className="text-muted-foreground" 
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-mono text-foreground">
                                {formatTimestamp(log.timestamp)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {(() => {
                                  const levelConfig = getLogLevelIcon(log.level);
                                  return <Icon name={levelConfig.icon} size={14} className={levelConfig.color} />;
                                })()}
                                {getLogLevelBadge(log.level)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-foreground line-clamp-2">
                                {log.message}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-muted-foreground font-mono">
                                {log.user}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-muted-foreground font-mono">
                                {log.ip}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-muted-foreground">
                                {log.service}
                              </div>
                            </td>
                          </tr>
                          
                          {expandedRows.includes(log.id) && (
                            <tr>
                              <td colSpan="7" className="px-6 py-4 bg-muted/30">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-foreground">Details</h4>
                                  <pre className="text-xs text-muted-foreground bg-background rounded p-3 overflow-x-auto">
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
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
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Error Frequency Chart */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Error Frequency</h3>
                <div className="h-48 bg-muted rounded flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="BarChart3" size={32} className="text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Error frequency chart over time</p>
                  </div>
                </div>
              </div>

              {/* Common Errors */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Top Error Patterns</h3>
                
                <div className="space-y-3">
                  {errorDashboard.topErrors.map((error, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground line-clamp-1">
                          {error.error}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {error.count} occurrences
                        </div>
                      </div>
                      <div className={`text-xs font-medium ${
                        error.trend.startsWith('+') ? 'text-error' : 'text-success'
                      }`}>
                        {error.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin/analytics')}
                    iconName="BarChart3"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    View Analytics
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin/settings')}
                    iconName="Settings"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    System Settings
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open('/api/logs/download', '_blank')}
                    iconName="Download"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Download All Logs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemLogs;
