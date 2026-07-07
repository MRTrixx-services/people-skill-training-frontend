import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'attendee', userName = 'John Doe', userAvatar = null }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const attendeeNavItems = [
    { label: 'Recordings', path: '/attendee-recordings-library', icon: 'Video' },
    { label: 'Join Session', path: '/join-webinar-lobby', icon: 'Users' },
    { label: 'Feedback', path: '/webinar-feedback-form', icon: 'MessageSquare' },
  ];

  const instructorNavItems = [
    { label: 'Create Webinar', path: '/create-edit-webinar', icon: 'Plus' },
    { label: 'Analytics', path: '/instructor-analytics-dashboard', icon: 'BarChart3' },
  ];

  const currentNavItems = userRole === 'instructor' ? instructorNavItems : attendeeNavItems;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false);
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
             <img 
      src="/assets/logo (4).png" 
      alt="Logo" 
      className="h-10 w-auto object-contain"
    />
            {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={20} color="white" />
            </div> */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-text-primary">EduPortal</h1>
              <p className="text-xs text-text-secondary -mt-1">
                {userRole === 'instructor' ? 'Instructor Hub' : 'Learning Center'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items - Desktop */}
        <nav className="hidden md:flex items-center space-x-1">
          {currentNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationsToggle}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
            </Button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-3 animate-fade-in">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-border hover:bg-muted transition-smooth cursor-pointer">
                    <p className="text-sm text-text-primary">New webinar recording available</p>
                    <p className="text-xs text-text-secondary mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-4 border-b border-border hover:bg-muted transition-smooth cursor-pointer">
                    <p className="text-sm text-text-primary">Upcoming session reminder</p>
                    <p className="text-xs text-text-secondary mt-1">1 hour ago</p>
                  </div>
                  <div className="p-4 hover:bg-muted transition-smooth cursor-pointer">
                    <p className="text-sm text-text-primary">Course completion certificate ready</p>
                    <p className="text-xs text-text-secondary mt-1">3 hours ago</p>
                  </div>
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth>
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfileToggle}
              className="flex items-center space-x-2 px-2"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full" />
                ) : (
                  <Icon name="User" size={16} color="white" />
                )}
              </div>
              <span className="hidden lg:block text-sm font-medium text-text-primary">
                {userName}
              </span>
              <Icon name="ChevronDown" size={16} className="text-text-secondary" />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-3 animate-fade-in">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-text-primary">{userName}</p>
                  <p className="text-sm text-text-secondary capitalize">{userRole}</p>
                </div>
                <div className="py-2">
                  <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Icon name="Menu" size={20} />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-surface">
        <nav className="flex overflow-x-auto px-4 py-2 space-x-1">
          {currentNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="whitespace-nowrap text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
            >
              {item?.label}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;