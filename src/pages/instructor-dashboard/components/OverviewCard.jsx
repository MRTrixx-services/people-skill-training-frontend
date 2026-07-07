import React from 'react';
import Icon from '../../../components/AppIcon';

const OverviewCard = ({ title, value, subtitle, icon, trend, trendValue, color = "primary" }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10',
          icon: 'text-success',
          trend: 'text-success'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          icon: 'text-warning',
          trend: 'text-warning'
        };
      case 'error':
        return {
          bg: 'bg-error/10',
          icon: 'text-error',
          trend: 'text-error'
        };
      default:
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          trend: 'text-primary'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses?.bg} flex items-center justify-center`}>
          <Icon name={icon} size={24} className={colorClasses?.icon} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center mt-4 pt-4 border-t border-border">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={16} 
            className={trend === 'up' ? 'text-success' : 'text-error'} 
          />
          <span className={`text-sm font-medium ml-1 ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            {trendValue}
          </span>
          <span className="text-sm text-muted-foreground ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default OverviewCard;