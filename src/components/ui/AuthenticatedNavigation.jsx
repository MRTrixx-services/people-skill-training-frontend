import React, { useState } from 'react';
import Icon from '../AppIcon';


const AuthenticatedNavigation = ({ 
  isCollapsed = false, 
  onToggleCollapse,
  userRole = 'instructor',
  currentPath = '/dashboard'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    setIsMobileMenuOpen(false);
  };

  const getNavigationItems = () => {
    const baseItems = [
      { 
        label: 'Dashboard', 
        path: '/dashboard', 
        icon: 'LayoutDashboard',
        roles: ['instructor', 'attendee', 'admin']
      },
      { 
        label: 'My Webinars', 
        path: '/my-webinars', 
        icon: 'Video',
        roles: ['instructor', 'attendee']
      },
      { 
        label: 'Create Webinar', 
        path: '/create-webinar', 
        icon: 'Plus',
        roles: ['instructor']
      },
      { 
        label: 'Browse', 
        path: '/browse', 
        icon: 'Search',
        roles: ['instructor', 'attendee', 'admin']
      },
      { 
        label: 'Analytics', 
        path: '/analytics', 
        icon: 'BarChart3',
        roles: ['instructor', 'admin']
      },
      { 
        label: 'Users', 
        path: '/users', 
        icon: 'Users',
        roles: ['admin']
      },
      { 
        label: 'Settings', 
        path: '/settings', 
        icon: 'Settings',
        roles: ['instructor', 'attendee', 'admin']
      }
    ];

    return baseItems?.filter(item => item?.roles?.includes(userRole));
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-1000 lg:flex-col bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="flex items-center space-x-2 hover-lift focus-ring rounded-lg p-1"
            >
               <img 
      src="/assets/logo (4).png" 
      alt="Logo" 
      className="h-10 w-auto object-contain"
    />
              {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="GraduationCap" size={20} color="white" />
              </div> */}
              {!isCollapsed && (
                <span className="text-lg font-semibold text-foreground">
                  WebinarHub
                </span>
              )}
            </button>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className={`ml-auto p-1 rounded hover:bg-muted focus-ring ${isCollapsed ? 'mx-auto' : ''}`}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Icon 
                  name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                  size={16} 
                  color="currentColor" 
                />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus-ring ${
                  currentPath === item?.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-foreground hover:bg-muted'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                title={isCollapsed ? item?.label : undefined}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  color="currentColor"
                  className="flex-shrink-0"
                />
                {!isCollapsed && (
                  <span className="ml-3">{item?.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => handleNavigation('/profile')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors duration-200 focus-ring ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
              title={isCollapsed ? 'Profile' : undefined}
            >
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} color="white" />
              </div>
              {!isCollapsed && (
                <div className="ml-3 text-left">
                  <div className="text-foreground font-medium">John Doe</div>
                  <div className="text-text-secondary text-xs capitalize">{userRole}</div>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="flex items-center space-x-2 hover-lift focus-ring rounded-lg p-1"
          >
             <img 
      src="/assets/logo (4).png" 
      alt="Logo" 
      className="h-10 w-auto object-contain"
    />
            {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={20} color="white" />
            </div> */}
            <span className="text-lg font-semibold text-foreground">
              WebinarHub
            </span>
          </button>

          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-muted focus-ring"
            aria-label="Toggle mobile menu"
          >
            <Icon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              size={24} 
              color="currentColor" 
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-card border-t border-border">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus-ring ${
                    currentPath === item?.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    color="currentColor"
                    className="mr-3"
                  />
                  {item?.label}
                </button>
              ))}
            </nav>
            
            <div className="px-4 py-4 border-t border-border">
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors duration-200 focus-ring"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-3">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="text-left">
                  <div className="text-foreground font-medium">John Doe</div>
                  <div className="text-text-secondary text-xs capitalize">{userRole}</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default AuthenticatedNavigation;