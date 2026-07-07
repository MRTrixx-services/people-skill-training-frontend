import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ navigate, setActiveTab, showQuickActions, setShowQuickActions }) => {
  const quickActions = [
    {
      name: 'Browse Webinars',
      icon: 'Search',
      description: 'Discover new learning opportunities',
      action: () => navigate('/browse-webinars'),
      color: 'primary'
    },
    {
      name: 'My Enrollments',
      icon: 'BookOpen',
      description: 'View your upcoming sessions',
      action: () => setActiveTab('enrolled'),
      color: 'success'
    },
    {
      name: 'Watch Recordings',
      icon: 'Play',
      description: 'Access your video library',
      action: () => setActiveTab('recordings'),
      color: 'warning'
    },
    {
      name: 'Download Resources',
      icon: 'Download',
      description: 'Get learning materials',
      action: () => setActiveTab('resources'),
      color: 'error'
    },
    {
    name: 'Account Settings',
    icon: 'Settings',
    description: 'Manage your profile',
    action: () => navigate('/settings'),
    color: 'gray'
  },
    {
    name: 'Payment History',
    icon: 'CreditCard',
    description: 'View transactions',
    action: () => navigate('/payments'),
    color: 'purple'
  }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      success: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      warning: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
      error: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
      gray: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowQuickActions(!showQuickActions)}
          iconName={showQuickActions ? 'ChevronUp' : 'ChevronDown'}
        >
          {showQuickActions ? 'Hide' : 'Show'}
        </Button>
      </div>
      
      {showQuickActions && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-lg border transition-all duration-200 text-center ${getColorClasses(action.color)}`}
            >
              <Icon name={action.icon} size={24} className="mx-auto mb-2" />
              <p className="text-sm font-medium mb-1">{action.name}</p>
              <p className="text-xs opacity-75">{action.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickActions;
