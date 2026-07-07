import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const InstructorSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    analytics: false,
    management: false
  });

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const navigationSections = [
    {
      id: 'content',
      label: 'Content Creation',
      icon: 'PlusCircle',
      items: [
        { label: 'Create Webinar', path: '/create-edit-webinar', icon: 'Plus', badge: null },
        { label: 'Edit Sessions', path: '/edit-sessions', icon: 'Edit', badge: null },
        { label: 'Content Library', path: '/content-library', icon: 'FolderOpen', badge: null }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: 'BarChart3',
      items: [
        { label: 'Dashboard', path: '/instructor-analytics-dashboard', icon: 'BarChart3', badge: null },
        { label: 'Attendance Reports', path: '/attendance-reports', icon: 'Users', badge: null },
        { label: 'Performance Metrics', path: '/performance-metrics', icon: 'TrendingUp', badge: null }
      ]
    },
    {
      id: 'management',
      label: 'Session Management',
      icon: 'Settings',
      items: [
        { label: 'Live Sessions', path: '/live-sessions', icon: 'Video', badge: 3 },
        { label: 'Scheduled Sessions', path: '/scheduled-sessions', icon: 'Calendar', badge: null },
        { label: 'Session History', path: '/session-history', icon: 'Clock', badge: null }
      ]
    }
  ];

  const quickActions = [
    { label: 'Start Live Session', icon: 'Play', action: 'start-session', variant: 'default' },
    { label: 'Upload Content', icon: 'Upload', action: 'upload', variant: 'outline' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed left-0 top-16 bottom-0 bg-surface border-r border-border shadow-elevation-1 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Instructor Hub</h2>
                <p className="text-sm text-text-secondary">Manage your content and sessions</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="ml-auto"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
            </Button>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {navigationSections?.map((section) => (
              <div key={section?.id} className="space-y-2">
                <button
                  onClick={() => !isCollapsed && handleSectionToggle(section?.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left font-medium text-text-primary hover:bg-muted rounded-lg transition-smooth ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? section?.label : ''}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={section?.icon} size={20} />
                    {!isCollapsed && <span>{section?.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <Icon 
                      name="ChevronDown" 
                      size={16} 
                      className={`transition-transform ${
                        expandedSections?.[section?.id] ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </button>

                {(!isCollapsed && expandedSections?.[section?.id]) && (
                  <div className="ml-4 space-y-1">
                    {section?.items?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className="relative w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-smooth"
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                        {item?.badge && (
                          <span className="ml-auto w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                            {item?.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {isCollapsed && (
                  <div className="space-y-1">
                    {section?.items?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className="relative w-full flex items-center justify-center px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-smooth"
                        title={item?.label}
                      >
                        <Icon name={item?.icon} size={16} />
                        {item?.badge && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                            {item?.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border space-y-2">
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h3>
            )}
            {quickActions?.map((action) => (
              <Button
                key={action?.action}
                variant={action?.variant}
                size={isCollapsed ? "icon" : "sm"}
                fullWidth={!isCollapsed}
                iconName={action?.icon}
                iconPosition={isCollapsed ? undefined : "left"}
                iconSize={16}
                className="justify-start"
                title={isCollapsed ? action?.label : ''}
              >
                {!isCollapsed && action?.label}
              </Button>
            ))}
          </div>
        </div>
      </aside>
      {/* Mobile Overlay Sidebar */}
      <div className="lg:hidden">
        <aside className="fixed left-0 top-16 bottom-0 w-80 bg-surface border-r border-border shadow-elevation-3 z-40 transform -translate-x-full transition-transform duration-300">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">Instructor Hub</h2>
              <p className="text-sm text-text-secondary">Manage your content and sessions</p>
            </div>

            <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
              {navigationSections?.map((section) => (
                <div key={section?.id} className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2 font-medium text-text-primary">
                    <Icon name={section?.icon} size={20} />
                    <span>{section?.label}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {section?.items?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className="relative w-full flex items-center space-x-3 px-3 py-3 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-smooth"
                        style={{ minHeight: '44px' }}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                        {item?.badge && (
                          <span className="ml-auto w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                            {item?.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-border space-y-2">
              <h3 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h3>
              {quickActions?.map((action) => (
                <Button
                  key={action?.action}
                  variant={action?.variant}
                  size="sm"
                  fullWidth
                  iconName={action?.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="justify-start"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default InstructorSidebar;