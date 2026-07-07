import React from 'react';
import Icon from '../AppIcon';

const AttendeeBottomNav = ({ currentPath = '/' }) => {
  const navItems = [
    {
      label: 'Recordings',
      path: '/attendee-recordings-library',
      icon: 'Video',
      badge: null
    },
    {
      label: 'Join Session',
      path: '/join-webinar-lobby',
      icon: 'Users',
      badge: null
    },
    {
      label: 'Feedback',
      path: '/webinar-feedback-form',
      icon: 'MessageSquare',
      badge: 2
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: 'User',
      badge: null
    }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const isActive = (path) => {
    return currentPath === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border shadow-elevation-2 md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems?.map((item) => {
            const active = isActive(item?.path);
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`relative flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-lg transition-smooth ${
                  active
                    ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
                style={{ minHeight: '44px' }}
              >
                <div className="relative">
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={active ? 'text-primary' : 'text-current'} 
                  />
                  {item?.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                      {item?.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium mt-1 truncate w-full text-center">
                  {item?.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-surface border-r border-border shadow-elevation-1 z-40">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Learning Center</h2>
            <p className="text-sm text-text-secondary">Access your courses and sessions</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems?.map((item) => {
              const active = isActive(item?.path);
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`relative w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-smooth text-left ${
                    active
                      ? 'text-primary bg-primary/10 border border-primary/20' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <div className="relative">
                    <Icon 
                      name={item?.icon} 
                      size={20} 
                      className={active ? 'text-primary' : 'text-current'} 
                    />
                    {item?.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                        {item?.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{item?.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-smooth">
                <Icon name="Calendar" size={16} />
                <span>My Schedule</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-smooth">
                <Icon name="BookOpen" size={16} />
                <span>Course Library</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-smooth">
                <Icon name="Award" size={16} />
                <span>Certificates</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AttendeeBottomNav;