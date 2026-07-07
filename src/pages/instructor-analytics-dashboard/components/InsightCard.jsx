import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightCard = ({ insights, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)]?.map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const mockInsights = insights || [
    {
      id: 1,
      type: 'success',
      title: 'High Engagement Sessions',
      description: 'Your React and JavaScript sessions have 23% higher completion rates than platform average.',
      action: 'Create more programming content',
      icon: 'TrendingUp'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Attendance Drop Pattern',
      description: 'Sessions scheduled after 6 PM show 15% lower attendance rates.',
      action: 'Consider earlier time slots',
      icon: 'Clock'
    },
    {
      id: 3,
      type: 'info',
      title: 'Revenue Opportunity',
      description: 'Premium pricing for advanced topics could increase revenue by 30%.',
      action: 'Review pricing strategy',
      icon: 'DollarSign'
    },
    {
      id: 4,
      type: 'success',
      title: 'Positive Feedback Trend',
      description: 'Your average rating improved by 0.3 points over the last quarter.',
      action: 'Maintain current quality',
      icon: 'Star'
    }
  ];

  const getInsightStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          iconColor: 'text-success',
          titleColor: 'text-success'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          iconColor: 'text-warning',
          titleColor: 'text-warning'
        };
      case 'error':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          iconColor: 'text-error',
          titleColor: 'text-error'
        };
      default:
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          iconColor: 'text-primary',
          titleColor: 'text-primary'
        };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Actionable Insights</h3>
          <p className="text-sm text-text-secondary">AI-powered recommendations for improvement</p>
        </div>
        <Button variant="outline" size="sm" iconName="RefreshCw" iconSize={16}>
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {mockInsights?.map((insight) => {
          const style = getInsightStyle(insight?.type);
          
          return (
            <div
              key={insight?.id}
              className={`p-4 rounded-lg border ${style?.bgColor} ${style?.borderColor} transition-smooth hover:shadow-elevation-1`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-lg ${style?.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={insight?.icon} size={16} className={style?.iconColor} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold ${style?.titleColor} mb-1`}>
                    {insight?.title}
                  </h4>
                  <p className="text-sm text-text-secondary mb-3">
                    {insight?.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${style?.titleColor} hover:${style?.bgColor} text-xs`}
                    >
                      {insight?.action}
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="ThumbsUp" iconSize={14}>
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm" iconName="X" iconSize={14}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Insights updated 2 hours ago
          </div>
          <Button variant="ghost" size="sm" iconName="MessageSquare" iconPosition="left" iconSize={14}>
            Feedback on Insights
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;