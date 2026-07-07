import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const activityTypes = {
    user: { icon: 'User', color: 'text-blue-600', bg: 'bg-blue-50' },
    system: { icon: 'Server', color: 'text-green-600', bg: 'bg-green-50' },
    error: { icon: 'AlertCircle', color: 'text-red-600', bg: 'bg-red-50' },
    payment: { icon: 'CreditCard', color: 'text-purple-600', bg: 'bg-purple-50' },
    zoom: { icon: 'Video', color: 'text-orange-600', bg: 'bg-orange-50' },
    support: { icon: 'MessageCircle', color: 'text-indigo-600', bg: 'bg-indigo-50' }
  };

  const mockActivities = [
    {
      id: 1,
      type: 'user',
      title: 'New User Registration',
      description: 'Sarah Johnson registered for Advanced React Course',
      timestamp: new Date(Date.now() - 30000),
      severity: 'info',
      metadata: { userId: 'USR_001', courseId: 'CRS_REACT_ADV' }
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Processed',
      description: '$299.00 payment successful for Premium Plan',
      timestamp: new Date(Date.now() - 120000),
      severity: 'success',
      metadata: { amount: 299.00, transactionId: 'TXN_789456' }
    },
    {
      id: 3,
      type: 'error',
      title: 'API Rate Limit Exceeded',
      description: 'Zoom API rate limit reached - 429 responses detected',
      timestamp: new Date(Date.now() - 180000),
      severity: 'error',
      metadata: { endpoint: '/api/zoom/meetings', count: 1250 }
    },
    {
      id: 4,
      type: 'zoom',
      title: 'Webinar Started',
      description: 'JavaScript Fundamentals webinar went live with 45 attendees',
      timestamp: new Date(Date.now() - 240000),
      severity: 'info',
      metadata: { meetingId: 'MTG_JS_001', attendees: 45 }
    },
    {
      id: 5,
      type: 'system',
      title: 'Database Backup Completed',
      description: 'Scheduled backup completed successfully - 2.3GB archived',
      timestamp: new Date(Date.now() - 300000),
      severity: 'success',
      metadata: { size: '2.3GB', duration: '4m 32s' }
    },
    {
      id: 6,
      type: 'support',
      title: 'High Priority Ticket',
      description: 'Payment issue reported by premium user - requires immediate attention',
      timestamp: new Date(Date.now() - 360000),
      severity: 'warning',
      metadata: { ticketId: 'TKT_001234', priority: 'high' }
    },
    {
      id: 7,
      type: 'user',
      title: 'Course Completion',
      description: 'Michael Chen completed Python for Beginners course',
      timestamp: new Date(Date.now() - 420000),
      severity: 'success',
      metadata: { userId: 'USR_002', courseId: 'CRS_PY_BEG', score: 92 }
    },
    {
      id: 8,
      type: 'error',
      title: 'Email Service Timeout',
      description: 'SMTP timeout detected - 15 emails failed to send',
      timestamp: new Date(Date.now() - 480000),
      severity: 'error',
      metadata: { service: 'email', failedCount: 15 }
    }
  ];

  useEffect(() => {
    setActivities(mockActivities);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['user', 'system', 'payment', 'zoom']?.[Math.floor(Math.random() * 4)],
        title: 'Live Update',
        description: `Real-time activity at ${new Date()?.toLocaleTimeString()}`,
        timestamp: new Date(),
        severity: ['info', 'success', 'warning']?.[Math.floor(Math.random() * 3)]
      };
      
      setActivities(prev => [newActivity, ...prev?.slice(0, 49)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activities?.filter(activity => 
    filter === 'all' || activity?.type === filter
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'border-l-error';
      case 'warning': return 'border-l-warning';
      case 'success': return 'border-l-success';
      default: return 'border-l-primary';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Activity" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Live Activity</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className={isAutoScroll ? 'text-primary' : 'text-muted-foreground'}
            >
              <Icon name={isAutoScroll ? 'Play' : 'Pause'} size={16} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={16} />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1">
          {[
            { key: 'all', label: 'All', count: activities?.length },
            { key: 'error', label: 'Errors', count: activities?.filter(a => a?.severity === 'error')?.length },
            { key: 'user', label: 'Users', count: activities?.filter(a => a?.type === 'user')?.length },
            { key: 'system', label: 'System', count: activities?.filter(a => a?.type === 'system')?.length }
          ]?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setFilter(tab?.key)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md transition-micro
                ${filter === tab?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tab?.label} ({tab?.count})
            </button>
          ))}
        </div>
      </div>
      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredActivities?.map((activity) => {
            const typeConfig = activityTypes?.[activity?.type];
            
            return (
              <div
                key={activity?.id}
                className={`
                  p-3 border-l-4 bg-muted/30 rounded-r-lg transition-micro hover:bg-muted/50
                  ${getSeverityColor(activity?.severity)}
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${typeConfig?.bg}
                  `}>
                    <Icon 
                      name={typeConfig?.icon} 
                      size={14} 
                      className={typeConfig?.color}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {activity?.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatTimeAgo(activity?.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {activity?.description}
                    </p>
                    
                    {activity?.metadata && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(activity?.metadata)?.slice(0, 2)?.map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-background text-muted-foreground"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filteredActivities?.length} activities</span>
          <div className="flex items-center space-x-2">
            <Icon name="Wifi" size={12} className="text-success" />
            <span>Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityFeed;