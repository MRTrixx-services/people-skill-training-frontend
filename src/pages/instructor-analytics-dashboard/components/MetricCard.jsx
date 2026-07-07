import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  period = 'vs last month',
  loading = false 
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-text-secondary';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
          </div>
          <div className="h-8 bg-muted rounded w-20 mb-2"></div>
          <div className="h-3 bg-muted rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={16} className="text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={getChangeIcon()} 
              size={14} 
              className={getChangeColor()} 
            />
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-text-secondary">{period}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;