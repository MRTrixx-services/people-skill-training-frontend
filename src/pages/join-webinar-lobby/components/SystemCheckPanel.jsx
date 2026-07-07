import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemCheckPanel = ({ onSystemCheckComplete }) => {
  const [systemChecks, setSystemChecks] = useState({
    camera: { status: 'checking', message: 'Testing camera access...' },
    microphone: { status: 'checking', message: 'Testing microphone access...' },
    internet: { status: 'checking', message: 'Testing internet connection...' },
    browser: { status: 'checking', message: 'Checking browser compatibility...' },
    zoom: { status: 'checking', message: 'Checking Zoom plugin...' }
  });

  const [overallStatus, setOverallStatus] = useState('checking');

  useEffect(() => {
    // Simulate system checks with realistic delays
    const runSystemChecks = async () => {
      const checks = [
        { key: 'internet', delay: 1000, result: 'good' },
        { key: 'browser', delay: 1500, result: 'good' },
        { key: 'camera', delay: 2000, result: 'good' },
        { key: 'microphone', delay: 2500, result: 'warning' },
        { key: 'zoom', delay: 3000, result: 'error' }
      ];

      for (const check of checks) {
        setTimeout(() => {
          setSystemChecks(prev => ({
            ...prev,
            [check?.key]: {
              status: check?.result,
              message: getStatusMessage(check?.key, check?.result)
            }
          }));
        }, check?.delay);
      }

      // Set overall status after all checks
      setTimeout(() => {
        setOverallStatus('warning');
        if (onSystemCheckComplete) {
          onSystemCheckComplete('warning');
        }
      }, 3500);
    };

    runSystemChecks();
  }, [onSystemCheckComplete]);

  const getStatusMessage = (system, status) => {
    const messages = {
      camera: {
        good: 'Camera is working properly',
        warning: 'Camera access limited',
        error: 'Camera not detected',
        checking: 'Testing camera access...'
      },
      microphone: {
        good: 'Microphone is working properly',
        warning: 'Microphone needs adjustment',
        error: 'Microphone not detected',
        checking: 'Testing microphone access...'
      },
      internet: {
        good: 'Internet connection is stable',
        warning: 'Internet connection is slow',
        error: 'Internet connection issues',
        checking: 'Testing internet connection...'
      },
      browser: {
        good: 'Browser is compatible',
        warning: 'Browser partially supported',
        error: 'Browser not supported',
        checking: 'Checking browser compatibility...'
      },
      zoom: {
        good: 'Zoom plugin is ready',
        warning: 'Zoom plugin needs update',
        error: 'Zoom plugin not installed',
        checking: 'Checking Zoom plugin...'
      }
    };

    return messages?.[system]?.[status] || 'Unknown status';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return { icon: 'CheckCircle', color: 'text-success' };
      case 'warning': return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'error': return { icon: 'XCircle', color: 'text-error' };
      default: return { icon: 'Loader', color: 'text-text-secondary animate-spin' };
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'good': return 'border-success bg-success/5';
      case 'warning': return 'border-warning bg-warning/5';
      case 'error': return 'border-error bg-error/5';
      default: return 'border-border bg-muted';
    }
  };

  const handleRetryCheck = () => {
    setSystemChecks({
      camera: { status: 'checking', message: 'Testing camera access...' },
      microphone: { status: 'checking', message: 'Testing microphone access...' },
      internet: { status: 'checking', message: 'Testing internet connection...' },
      browser: { status: 'checking', message: 'Checking browser compatibility...' },
      zoom: { status: 'checking', message: 'Checking Zoom plugin...' }
    });
    setOverallStatus('checking');
    
    // Re-run checks
    window.location?.reload();
  };

  const handleDownloadZoom = () => {
    window.open('https://zoom.us/download', '_blank');
  };

  return (
    <div className={`bg-card rounded-xl p-6 shadow-elevation-2 border-2 ${getOverallStatusColor()}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">System Check</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetryCheck}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
          disabled={overallStatus === 'checking'}
        >
          Retry
        </Button>
      </div>
      <div className="space-y-4">
        {Object.entries(systemChecks)?.map(([system, check]) => {
          const statusInfo = getStatusIcon(check?.status);
          return (
            <div key={system} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Icon 
                name={statusInfo?.icon} 
                size={20} 
                className={statusInfo?.color} 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary capitalize">
                    {system === 'zoom' ? 'Zoom Plugin' : system}
                  </span>
                  <span className={`text-sm font-medium ${statusInfo?.color}`}>
                    {check?.status === 'checking' ? 'Testing...' : check?.status?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {check?.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {systemChecks?.zoom?.status === 'error' && (
          <Button
            variant="outline"
            fullWidth
            onClick={handleDownloadZoom}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            className="text-primary border-primary hover:bg-primary/10"
          >
            Download Zoom App
          </Button>
        )}
        
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="Shield" size={16} />
          <span>Your privacy is protected. We only access your camera and microphone during the session.</span>
        </div>
      </div>
    </div>
  );
};

export default SystemCheckPanel;