import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from 'contexts/AuthContext';
import { useCart } from 'contexts/CartContext'; // Add this import
import {
  IconArrowLeft,
  IconMenu,
  IconX,
  IconLogout,
  IconHome,
  IconDashboard
} from "@tabler/icons-react";

const AppHeader = ({
  user,
  notifications = [],
  onLogout,
  onNotificationClick,
  sidebarOpen = false, 
  toggleMobileMenu,
  onToggleSidebar
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggingOut } = useAuth();
  const { itemCount, setCartOpen } = useCart(); // Add cart context
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const isAuthenticated = !!user;
  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  // Handle window resize for proper logo display
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    switch (user?.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'instructor':
        navigate('/instructor/dashboard');
        break;
      case 'attendee':
      default:
        navigate('/attendee/dashboard');
        break;
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsNotificationOpen(false);
  };

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setIsNotificationOpen(false);
  };

  const handleAdvancedLogout = async () => {
    setIsUserMenuOpen(false);
    const result = await logout({
      showLoading: true,
      apiLogout: true,
      onSuccess: () => {
        console.log('Logout successful!');
        navigate('/login', { replace: true });
      },
      onError: (error) => {
        console.error('Logout failed:', error);
        navigate('/login', { replace: true });
      }
    });
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin': return '/admin';
      case 'instructor': return '/instructor/dashboard';
      case 'attendee':
      default: return '/attendee/dashboard';
    }
  };

  const getDashboardLabel = () => {
    switch (user?.role) {
      case 'admin': return 'Admin Dashboard';
      case 'instructor': return 'Instructor Dashboard';
      case 'attendee':
      default: return 'My Dashboard';
    }
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name.includes(' ')) {
      const parts = name.split(' ');
      return `${parts[0]?.charAt(0)}${parts[1]?.charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full bg-white/95 backdrop-blur-lg border-b border-gray-200/70 shadow-sm"
    >
      <div className="w-full flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Sidebar Toggle + Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <motion.button
            onClick={toggleMobileMenu}
            className="sm:hidden rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <IconX size={20} className="text-gray-700" />
              ) : (
                <IconMenu size={20} className="text-gray-700" />
              )}
            </motion.div>
          </motion.button>

          {/* Desktop Sidebar Toggle */}
          {isAuthenticated && onToggleSidebar && (
            <motion.button
              onClick={onToggleSidebar}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle sidebar"
            >
              <Icon name="Menu" size={20} className="text-gray-600" />
            </motion.button>
          )}

          {/* Logo */}
          <motion.button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg p-2 -m-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src="/assets/logo (4).png"
              alt="PeopleSkillTraining Logo"
              className="h-8 w-auto object-contain"
            />
            <div className='hidden sm:block' >
              <AnimatePresence>
                {(!sidebarOpen || windowWidth < 768) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden sm:block"
                  >
                    <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                      PeopleSkillTraining
                    </div>
                    <div className="text-xs text-gray-500 -mt-1">Learn • Grow • Succeed</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {/* Cart Button */}
              <motion.button
  onClick={() => handleNavigation('/cart')} // Navigate to cart page
  className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Icon name="ShoppingCart" size={18} className="text-gray-600" />
  {itemCount > 0 && (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white"
    >
      {itemCount > 9 ? '9+' : itemCount}
    </motion.span>
  )}
</motion.button>


              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <motion.button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon name="Bell" size={18} className="text-gray-600" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Enhanced Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-60 sm:w-80 max-w-[calc(100vw-24px)] bg-white border border-gray-200 rounded-2xl shadow-2xl z-[1010] overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications?.length > 0 ? (
                          notifications?.slice(0, 5)?.map((notification) => (
                            <motion.button
                              key={notification?.id}
                              onClick={() => handleNotificationClick(notification)}
                              className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                              whileHover={{ backgroundColor: '#f9fafb' }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification?.read ? 'bg-gray-300' : 'bg-indigo-500'}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification?.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {notification?.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notification?.time}
                                  </p>
                                </div>
                              </div>
                            </motion.button>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <Icon name="Bell" size={32} className="mx-auto mb-3 opacity-50" />
                            <p className="text-sm font-medium">No notifications</p>
                            <p className="text-xs mt-1">You're all caught up!</p>
                          </div>
                        )}
                      </div>
                      {notifications?.length > 5 && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <button
                            onClick={() => handleNavigation('/notifications')}
                            className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            View all notifications
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 ring-2 ring-white shadow-sm">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={getUserDisplayName()}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-white">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  {/* Show name only on large screens */}
                  <span className="hidden lg:inline-block text-sm font-medium text-gray-700 max-w-32 truncate">
                    {getUserDisplayName()}
                  </span>
                  <Icon name="ChevronDown" size={14} className="text-gray-500 hidden lg:block" />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-64 max-w-[calc(100vw-24px)] bg-white border border-gray-200 rounded-2xl shadow-2xl z-[1010] overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
                            {user?.avatar ? (
                              <img
                                src={user.avatar}
                                alt={getUserDisplayName()}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-semibold text-white">
                                {getUserInitials()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {user?.email}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium capitalize">
                              {user?.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <motion.button
                          onClick={() => handleNavigation(getDashboardPath())}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-150"
                          whileHover={{ backgroundColor: '#f9fafb' }}
                        >
                          <Icon name="LayoutDashboard" size={16} />
                          <span>{getDashboardLabel()}</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleNavigation('/admin/profile')}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-150"
                          whileHover={{ backgroundColor: '#f9fafb' }}
                        >
                          <Icon name="User" size={16} />
                          <span>Profile Settings</span>
                        </motion.button>
                      <motion.button
  onClick={() => handleNavigation('/cart')}
  className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-150"
  whileHover={{ backgroundColor: '#f9fafb' }}
>
  <Icon name="ShoppingCart" size={16} />
  <span>My Cart {itemCount > 0 && `(${itemCount})`}</span>
</motion.button>
                        <motion.button
                          onClick={() => handleNavigation('/settings')}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-150"
                          whileHover={{ backgroundColor: '#f9fafb' }}
                        >
                          <Icon name="Settings" size={16} />
                          <span>Settings</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleNavigation('/contact')}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-150"
                          whileHover={{ backgroundColor: '#f9fafb' }}
                        >
                          <Icon name="HelpCircle" size={16} />
                          <span>Help & Support</span>
                        </motion.button>
                        <div className="border-t border-gray-100 my-2" />
                        <motion.button
                          onClick={handleAdvancedLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ backgroundColor: '#fef2f2' }}
                        >
                          <Icon name="LogOut" size={16} />
                          <span>
                            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Unauthenticated State */
            <div className="flex items-center space-x-3">
              {/* Cart Button for non-authenticated users too */}
            <motion.button
  onClick={() => handleNavigation('/cart')} // Navigate to cart page
  className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Icon name="ShoppingCart" size={18} className="text-gray-600" />
  {itemCount > 0 && (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white"
    >
      {itemCount > 9 ? '9+' : itemCount}
    </motion.span>
  )}
</motion.button>


              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Sign In
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="default"
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                >
                  Sign Up
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default AppHeader;
