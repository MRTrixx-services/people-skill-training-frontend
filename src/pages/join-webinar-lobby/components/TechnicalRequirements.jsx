import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TechnicalRequirements = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const requirements = [
    {
      id: 'browser',
      title: 'Browser Compatibility',
      status: 'good',
      items: [
        { name: 'Chrome 90+', status: 'good', current: 'Chrome 119' },
        { name: 'Firefox 88+', status: 'good', current: 'Not detected' },
        { name: 'Safari 14+', status: 'good', current: 'Not detected' },
        { name: 'Edge 90+', status: 'good', current: 'Not detected' }
      ]
    },
    {
      id: 'connection',
      title: 'Internet Connection',
      status: 'good',
      items: [
        { name: 'Download Speed', status: 'good', current: '45.2 Mbps', required: '5 Mbps min' },
        { name: 'Upload Speed', status: 'good', current: '12.8 Mbps', required: '1 Mbps min' },
        { name: 'Latency', status: 'good', current: '23ms', required: '<100ms' },
        { name: 'Packet Loss', status: 'good', current: '0%', required: '<1%' }
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware Requirements',
      status: 'warning',
      items: [
        { name: 'RAM Available', status: 'good', current: '8.2 GB', required: '4 GB min' },
        { name: 'CPU Usage', status: 'warning', current: '78%', required: '<80%' },
        { name: 'Storage Space', status: 'good', current: '125 GB', required: '1 GB min' },
        { name: 'Display Resolution', status: 'good', current: '1920x1080', required: '1024x768 min' }
      ]
    },
    {
      id: 'plugins',
      title: 'Required Plugins',
      status: 'error',
      items: [
        { name: 'Zoom Plugin', status: 'error', current: 'Not installed', required: 'Required' },
        { name: 'WebRTC Support', status: 'good', current: 'Enabled', required: 'Required' },
        { name: 'Media Permissions', status: 'good', current: 'Granted', required: 'Required' },
        { name: 'Pop-up Blocker', status: 'good', current: 'Disabled', required: 'Must be disabled' }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return { icon: 'CheckCircle', color: 'text-success' };
      case 'warning': return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'error': return { icon: 'XCircle', color: 'text-error' };
      default: return { icon: 'HelpCircle', color: 'text-text-secondary' };
    }
  };

  const getOverallStatus = () => {
    const hasError = requirements?.some(req => req?.status === 'error');
    const hasWarning = requirements?.some(req => req?.status === 'warning');
    
    if (hasError) return 'error';
    if (hasWarning) return 'warning';
    return 'good';
  };

  const handleSectionToggle = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleDownloadZoom = () => {
    window.open('https://zoom.us/download', '_blank');
  };

  const handleRefreshCheck = () => {
    window.location?.reload();
  };

  const overallStatus = getOverallStatus();
  const overallStatusInfo = getStatusIcon(overallStatus);

  return (
    <div className="bg-card rounded-xl p-6 shadow-elevation-2 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon 
            name={overallStatusInfo?.icon} 
            size={24} 
            className={overallStatusInfo?.color} 
          />
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Technical Requirements</h2>
            <p className={`text-sm ${overallStatusInfo?.color}`}>
              {overallStatus === 'good' && 'All systems ready'}
              {overallStatus === 'warning' && 'Minor issues detected'}
              {overallStatus === 'error' && 'Action required'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshCheck}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
        >
          Refresh
        </Button>
      </div>
      {/* Requirements List */}
      <div className="space-y-3">
        {requirements?.map((requirement) => {
          const statusInfo = getStatusIcon(requirement?.status);
          const isExpanded = expandedSection === requirement?.id;
          
          return (
            <div key={requirement?.id} className="border border-border rounded-lg">
              <button
                onClick={() => handleSectionToggle(requirement?.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-smooth rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={statusInfo?.icon} 
                    size={20} 
                    className={statusInfo?.color} 
                  />
                  <span className="font-medium text-text-primary">
                    {requirement?.title}
                  </span>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`text-text-secondary transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="space-y-2">
                    {requirement?.items?.map((item, index) => {
                      const itemStatusInfo = getStatusIcon(item?.status);
                      return (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded">
                          <div className="flex items-center space-x-2">
                            <Icon 
                              name={itemStatusInfo?.icon} 
                              size={16} 
                              className={itemStatusInfo?.color} 
                            />
                            <span className="text-sm text-text-primary">
                              {item?.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-text-primary">
                              {item?.current}
                            </div>
                            {item?.required && (
                              <div className="text-xs text-text-secondary">
                                {item?.required}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Action Buttons */}
      {overallStatus === 'error' && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-error mb-2">Action Required</h3>
              <p className="text-sm text-text-secondary mb-4">
                Zoom plugin is required to join the webinar. Please download and install it before the session starts.
              </p>
              <Button
                variant="default"
                onClick={handleDownloadZoom}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
                className="bg-error hover:bg-error/90"
              >
                Download Zoom App
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Help Section */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="HelpCircle" size={20} className="text-text-secondary mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-text-primary mb-2">Need Help?</h3>
            <p className="text-sm text-text-secondary mb-3">
              If you're experiencing technical issues, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="MessageCircle"
                iconPosition="left"
                iconSize={16}
              >
                Live Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Phone"
                iconPosition="left"
                iconSize={16}
              >
                Call Support
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Book"
                iconPosition="left"
                iconSize={16}
              >
                Help Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalRequirements;