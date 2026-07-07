import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  unit = '', 
  change, 
  changeType = 'neutral', 
  icon, 
  sparklineData = [], 
  status = 'normal',
  onClick = () => {} 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return 'border-error bg-error/5';
      case 'warning': return 'border-warning bg-warning/5';
      case 'success': return 'border-success bg-success/5';
      default: return 'border-border bg-card';
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const renderSparkline = () => {
    if (!sparklineData?.length) return null;
    
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    
    const points = sparklineData?.map((value, index) => {
      const x = (index / (sparklineData?.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    })?.join(' ');

    return (
      <svg width="60" height="20" className="opacity-60">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={getChangeColor()}
        />
      </svg>
    );
  };

  return (
    <div 
      className={`
        p-4 rounded-lg border transition-micro cursor-pointer hover:shadow-elevation-1
        ${getStatusColor()}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        {status !== 'normal' && (
          <div className={`w-2 h-2 rounded-full ${
            status === 'critical' ? 'bg-error animate-pulse' :
            status === 'warning' ? 'bg-warning' : 'bg-success'
          }`} />
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-foreground">
            {typeof value === 'number' ? value?.toLocaleString() : value}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className={`text-xs font-medium ${getChangeColor()}`}>
              {change > 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>
        
        <div className="ml-4">
          {renderSparkline()}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;