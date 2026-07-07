import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceStatusGrid = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 'web-app',
      name: 'Web Application',
      status: 'operational',
      uptime: 99.98,
      responseTime: 145,
      lastIncident: '2 days ago',
      description: 'Main LMS platform serving user interfaces',
      endpoints: [
        { name: 'Dashboard API', status: 'operational', latency: 120 },
        { name: 'User Auth', status: 'operational', latency: 89 },
        { name: 'Course Content', status: 'operational', latency: 156 }
      ]
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      status: 'operational',
      uptime: 99.95,
      responseTime: 89,
      lastIncident: '5 days ago',
      description: 'Central API routing and authentication service',
      endpoints: [
        { name: 'Authentication', status: 'operational', latency: 67 },
        { name: 'Rate Limiting', status: 'operational', latency: 45 },
        { name: 'Load Balancer', status: 'operational', latency: 23 }
      ]
    },
    {
      id: 'database',
      name: 'Database Cluster',
      status: 'degraded',
      uptime: 99.87,
      responseTime: 234,
      lastIncident: '2 hours ago',
      description: 'Primary PostgreSQL cluster with read replicas',
      endpoints: [
        { name: 'Primary DB', status: 'operational', latency: 189 },
        { name: 'Read Replica 1', status: 'degraded', latency: 345 },
        { name: 'Read Replica 2', status: 'operational', latency: 167 }
      ]
    },
    {
      id: 'zoom-integration',
      name: 'Zoom Integration',
      status: 'operational',
      uptime: 99.92,
      responseTime: 312,
      lastIncident: '1 week ago',
      description: 'Zoom API integration for webinars and meetings',
      endpoints: [
        { name: 'Meeting API', status: 'operational', latency: 289 },
        { name: 'Webhook Handler', status: 'operational', latency: 156 },
        { name: 'Recording Service', status: 'operational', latency: 234 }
      ]
    },
    {
      id: 'payment-gateway',
      name: 'Payment Gateway',
      status: 'operational',
      uptime: 99.99,
      responseTime: 178,
      lastIncident: '3 weeks ago',
      description: 'Razorpay integration for payment processing',
      endpoints: [
        { name: 'Payment API', status: 'operational', latency: 145 },
        { name: 'Webhook Handler', status: 'operational', latency: 123 },
        { name: 'Refund Service', status: 'operational', latency: 189 }
      ]
    },
    {
      id: 'email-service',
      name: 'Email Service',
      status: 'maintenance',
      uptime: 99.85,
      responseTime: 456,
      lastIncident: '30 minutes ago',
      description: 'SMTP service for transactional emails',
      endpoints: [
        { name: 'SMTP Server', status: 'maintenance', latency: 567 },
        { name: 'Template Engine', status: 'operational', latency: 234 },
        { name: 'Queue Manager', status: 'operational', latency: 178 }
      ]
    },
    {
      id: 'cdn',
      name: 'Content Delivery',
      status: 'operational',
      uptime: 99.97,
      responseTime: 67,
      lastIncident: '1 month ago',
      description: 'CDN for static assets and media files',
      endpoints: [
        { name: 'Static Assets', status: 'operational', latency: 45 },
        { name: 'Video Content', status: 'operational', latency: 89 },
        { name: 'Image Optimization', status: 'operational', latency: 67 }
      ]
    },
    {
      id: 'monitoring',
      name: 'Monitoring Stack',
      status: 'operational',
      uptime: 99.94,
      responseTime: 123,
      lastIncident: '2 weeks ago',
      description: 'Application monitoring and alerting system',
      endpoints: [
        { name: 'Metrics Collection', status: 'operational', latency: 89 },
        { name: 'Log Aggregation', status: 'operational', latency: 134 },
        { name: 'Alert Manager', status: 'operational', latency: 156 }
      ]
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'operational':
        return {
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success/20',
          icon: 'CheckCircle',
          label: 'Operational'
        };
      case 'degraded':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          icon: 'AlertTriangle',
          label: 'Degraded'
        };
      case 'maintenance':
        return {
          color: 'text-primary',
          bg: 'bg-primary/10',
          border: 'border-primary/20',
          icon: 'Settings',
          label: 'Maintenance'
        };
      case 'outage':
        return {
          color: 'text-error',
          bg: 'bg-error/10',
          border: 'border-error/20',
          icon: 'XCircle',
          label: 'Outage'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          border: 'border-border',
          icon: 'HelpCircle',
          label: 'Unknown'
        };
    }
  };

  const getUptimeColor = (uptime) => {
    if (uptime >= 99.9) return 'text-success';
    if (uptime >= 99.5) return 'text-warning';
    return 'text-error';
  };

  const getResponseTimeColor = (responseTime) => {
    if (responseTime <= 200) return 'text-success';
    if (responseTime <= 500) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Server" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Service Status</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {services?.map((service) => {
          const statusConfig = getStatusConfig(service?.status);
          
          return (
            <div
              key={service?.id}
              onClick={() => setSelectedService(service)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-micro hover:shadow-elevation-1
                ${statusConfig?.bg} ${statusConfig?.border}
                ${selectedService?.id === service?.id ? 'ring-2 ring-primary' : ''}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={statusConfig?.icon} 
                    size={16} 
                    className={statusConfig?.color}
                  />
                  <span className={`text-xs font-medium ${statusConfig?.color}`}>
                    {statusConfig?.label}
                  </span>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  service?.status === 'operational' ? 'bg-success animate-pulse' :
                  service?.status === 'degraded' ? 'bg-warning' :
                  service?.status === 'maintenance' ? 'bg-primary' : 'bg-error'
                }`} />
              </div>
              <h4 className="font-medium text-foreground mb-2 text-sm">
                {service?.name}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Uptime</span>
                  <span className={`text-xs font-medium ${getUptimeColor(service?.uptime)}`}>
                    {service?.uptime}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Response</span>
                  <span className={`text-xs font-medium ${getResponseTimeColor(service?.responseTime)}`}>
                    {service?.responseTime}ms
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Last Issue</span>
                  <span className="text-xs text-muted-foreground">
                    {service?.lastIncident}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Service Details */}
      {selectedService && (
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">
              {selectedService?.name} Details
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedService(null)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {selectedService?.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedService?.endpoints?.map((endpoint, index) => {
              const endpointStatus = getStatusConfig(endpoint?.status);
              
              return (
                <div
                  key={index}
                  className="p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {endpoint?.name}
                    </span>
                    <Icon 
                      name={endpointStatus?.icon} 
                      size={14} 
                      className={endpointStatus?.color}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Latency</span>
                    <span className={`text-xs font-medium ${getResponseTimeColor(endpoint?.latency)}`}>
                      {endpoint?.latency}ms
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="left">
              View Logs
            </Button>
            <Button variant="outline" size="sm" iconName="BarChart3" iconPosition="left">
              View Metrics
            </Button>
            <Button variant="outline" size="sm" iconName="AlertTriangle" iconPosition="left">
              Create Alert
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceStatusGrid;