import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const UserMenu = ({ 
  user = { 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'instructor',
    avatar: null 
  },
  onProfileClick,
  onSettingsClick,
  onLogout,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef?.current && 
        !menuRef?.current?.contains(event?.target) &&
        buttonRef?.current &&
        !buttonRef?.current?.contains(event?.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action) => {
    setIsOpen(false);
    if (action) action();
  };

  const menuItems = [
    {
      label: 'Profile',
      icon: 'User',
      onClick: onProfileClick,
      description: 'View and edit profile'
    },
    {
      label: 'Settings',
      icon: 'Settings',
      onClick: onSettingsClick,
      description: 'Account preferences'
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      onClick: () => console.log('Help clicked'),
      description: 'Get help and support'
    },
    {
      type: 'divider'
    },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      onClick: onLogout,
      description: 'Sign out of your account',
      variant: 'destructive'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* User Menu Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors duration-200 focus-ring"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
          {user?.avatar ? (
            <img 
              src={user?.avatar} 
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Icon name="User" size={16} color="white" />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
          <div className="text-xs text-text-secondary capitalize">{user?.role}</div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          color="currentColor"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg modal-shadow z-1010"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                {user?.avatar ? (
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={20} color="white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-popover-foreground truncate">
                  {user?.name}
                </div>
                <div className="text-xs text-text-secondary truncate">
                  {user?.email}
                </div>
                <div className="text-xs text-accent capitalize font-medium">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item, index) => {
              if (item?.type === 'divider') {
                return (
                  <div key={index} className="my-1 border-t border-border" />
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item?.onClick)}
                  className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 focus-ring ${
                    item?.variant === 'destructive' ?'text-destructive hover:bg-destructive hover:text-destructive-foreground' :'text-popover-foreground hover:bg-muted'
                  }`}
                  role="menuitem"
                >
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                    color="currentColor"
                    className="mr-3 flex-shrink-0"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item?.label}</div>
                    {item?.description && (
                      <div className="text-xs text-text-secondary">
                        {item?.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;