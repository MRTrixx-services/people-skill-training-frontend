import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GlobalHealthIndicator = () => {
  const [healthScore, setHealthScore] = useState(87);
  const [environment, setEnvironment] = useState('production');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const healthMetrics = {
    system: { score: 92, status: 'excellent', trend: 'up' },
    performance: { score: 85, status: 'good', trend: 'stable' },
    security: { score: 96, status: 'excellent', trend: 'up' },
    availability: { score: 89, status: 'good', trend: 'down' }
  };

  const environments = [
    { value: 'production', label: 'Production', color: 'text-error' },
    { value: 'staging', label: 'Staging', color: 'text-warning' },
    { value: 'development', label: 'Development', color: 'text-success' }
  ];

  const refreshIntervals = [
    { value: 5, label: '5s' },
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
    { value: 60, label: '1m' }
  ];

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate health score fluctuation
      const newScore = Math.max(75, Math.min(100, healthScore + (Math.random() - 0.5) * 4));
      setHealthScore(Math.round(newScore));
      setLastUpdated(new Date());
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, healthScore]);

  const getHealthColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-warning';
    return 'text-error';
  };

  const getHealthBg = (score) => {
    if (score >= 90) return 'bg-success/10';
    if (score >= 75) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getHealthStatus = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">System Health</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Environment Selector */}
          <select
            value={environment}
            onChange={(e) => setEnvironment(e?.target?.value)}
            className="text-sm border border-border rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {environments?.map((env) => (
              <option key={env.value} value={env.value}>
                {env.label}
              </option>
            ))}
          </select>
          
          {/* Auto Refresh Toggle */}
          <Button
            variant={autoRefresh ? "default" : "ghost"}
            size="icon"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Icon name={autoRefresh ? "Play" : "Pause"} size={16} />
          </Button>
          
          {/* Refresh Interval */}
          {autoRefresh && (
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e?.target?.value))}
              className="text-sm border border-border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {refreshIntervals?.map((interval) => (
                <option key={interval?.value} value={interval?.value}>
                  {interval?.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      {/* Main Health Score */}
      <div className="text-center mb-6">
        <div className={`
          inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-4
          ${getHealthBg(healthScore)} ${getHealthColor(healthScore)}
        `} style={{ borderColor: 'currentColor' }}>
          <span className="text-2xl font-bold">
            {healthScore}
          </span>
        </div>
        
        <div className="space-y-1">
          <h4 className={`text-lg font-semibold ${getHealthColor(healthScore)}`}>
            {getHealthStatus(healthScore)}
          </h4>
          <p className="text-sm text-muted-foreground">
            Overall System Health
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span>Updated {lastUpdated?.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      {/* Health Metrics Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(healthMetrics)?.map(([key, metric]) => (
          <div key={key} className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground capitalize">
                {key}
              </span>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getTrendIcon(metric?.trend)} 
                  size={12} 
                  className={getTrendColor(metric?.trend)}
                />
                <span className={`text-sm font-bold ${getHealthColor(metric?.score)}`}>
                  {metric?.score}
                </span>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  metric?.score >= 90 ? 'bg-success' :
                  metric?.score >= 75 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${metric?.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Environment Status */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            environment === 'production' ? 'bg-error animate-pulse' :
            environment === 'staging' ? 'bg-warning' : 'bg-success'
          }`} />
          <div>
            <span className="text-sm font-medium text-foreground">
              {environments?.find(e => e?.value === environment)?.label}
            </span>
            <p className="text-xs text-muted-foreground">
              Environment Status
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Wifi" size={14} className="text-success" />
          <span className="text-xs text-muted-foreground">Connected</span>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="AlertTriangle" iconPosition="left">
            View Alerts
          </Button>
          <Button variant="ghost" size="sm" iconName="BarChart3" iconPosition="left">
            Detailed Report
          </Button>
        </div>
        
        <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
          Export
        </Button>
      </div>
    </div>
  );
};

export default GlobalHealthIndicator;