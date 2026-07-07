import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useCart } from 'contexts/CartContext';

const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Get authentication state and user info
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, setCartOpen } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    handleNavigation('/');
  };

  const handleDropdownEnter = (dropdownName) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Role-based dashboard navigation
  const getDashboardPath = () => {
    if (!user?.role) return '/attendee/orders';

    switch (user.role.toLowerCase()) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/attendee/orders';
      case 'attendee':
      default:
        return '/attendee/orders';
    }
  };

  const getDashboardLabel = () => {
    if (!user?.role) return 'My Orders';

    switch (user.role.toLowerCase()) {
      case 'admin':
        return 'Admin Dashboard';
      case 'instructor':
        return 'My Orders';
      case 'attendee':
      default:
        return 'My Orders';
    }
  };

  const handleDashboardClick = () => {
    const dashboardPath = getDashboardPath();
    handleNavigation(dashboardPath);
  };

  // Helper functions to determine button visibility
  const shouldShowLoginButton = () => {
    return !isAuthenticated && location.pathname !== '/login';
  };

  const shouldShowRegisterButton = () => {
    return !isAuthenticated && location.pathname !== '/register';
  };

  const webinarMenuItems = [
    {
      type: 'live',
      title: 'Live Webinars',
      description: 'Real-time compliance training',
      icon: 'Video',
      path: '/webinars/live',
      badge: 'LIVE',
      badgeColor: 'bg-[#0078d4]'
    },
    {
      type: 'recorded',
      title: 'Recorded Webinars',
      description: 'On-demand learning library',
      icon: 'Play',
      path: '/webinars/recorded',
      badge: 'ON-DEMAND',
      badgeColor: 'bg-[#064ad4]'
    }
  ];

  // Desktop navigation items
  const desktopNavigationItems = [
    { name: 'About Us', path: '/about' },
    { name: 'Live Webinars', path: '/webinars/live' },
    { name: 'Recorded Webinars', path: '/webinars/recorded' },
    { name: 'Contact', path: '/contact' }
  ];

  // Mobile navigation items
  const mobileNavigationItems = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-[#d6e6f7] shadow-lg shadow-[#004b8d]/10' 
          : 'bg-white/90 backdrop-blur-sm border-b border-[#e9eff5]'
      }`}
    >
      {/* Full-width container */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
            
            {/* Left Section - Logo */}
            <div className="flex items-center min-w-0 flex-shrink-0">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <button
                  onClick={() => handleNavigation('/')}
                  className="flex items-center space-x-2 sm:space-x-3 hover-lift focus-ring rounded-xl p-1 sm:p-2 -m-1 sm:-m-2"
                >
                  <motion.div 
                    className="flex items-center space-x-2 sm:space-x-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="/assets/logo (4).png" 
                      alt="PeopleSkillTraining Logo" 
                      className="h-8 sm:h-9 lg:h-10 w-auto object-contain flex-shrink-0"
                    />
                    <div className="hidden sm:block">
                      <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#0078d4] bg-clip-text text-transparent whitespace-nowrap leading-tight">
                        PeopleSkillTraining
                      </div>
                      <div className="text-xs text-[#555555] -mt-0.5 whitespace-nowrap">Learn • Grow • Succeed</div>
                    </div>
                  </motion.div>
                </button>
              </motion.div>
            </div>

            {/* Center Section - Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 xl:mx-8">
              <div className="flex items-center space-x-1 xl:space-x-2">
                {desktopNavigationItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`text-[#093389] hover:text-[#0078d4] transition-colors duration-200 font-medium focus-ring rounded-lg px-2 xl:px-3 py-2 whitespace-nowrap text-sm xl:text-base ${
                      location.pathname === item.path ? 'text-[#0078d4] bg-[#f5f9ff]' : ''
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* Right Section */}
            <div className="flex items-center justify-end space-x-1 sm:space-x-2">
              
              {/* Cart Button */}
              <motion.button
                onClick={() => handleNavigation('/cart')}
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl hover:bg-[#f5f9ff] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0078d4]/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon name="ShoppingCart" size={16} className="text-[#093389] sm:w-[18px] sm:h-[18px]" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold border-2 border-white"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Desktop Auth Section */}
              <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                {isAuthenticated ? (
                  <>
                    <motion.button
                      onClick={handleDashboardClick}
                      className="flex items-center space-x-2 text-[#093389] hover:text-[#0078d4] font-medium focus-ring rounded-lg px-2 xl:px-3 py-2 whitespace-nowrap text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-7 h-7 xl:w-8 xl:h-8 bg-gradient-to-r from-[#0078d4] to-[#064ad4] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs xl:text-sm font-semibold">
                          {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="hidden xl:inline-block text-sm">{getDashboardLabel()}</span>
                    </motion.button>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="font-medium text-[#093389] hover:text-[#0078d4] px-2 xl:px-3 py-2 text-sm"
                        iconName="LogOut"
                        iconPosition="left"
                      >
                        <span className="hidden xl:inline">Logout</span>
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {shouldShowLoginButton() && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="ghost"
                          onClick={() => handleNavigation('/login')}
                          className="font-medium text-[#093389] hover:text-[#0078d4] px-2 xl:px-3 py-2 text-sm"
                        >
                          Login
                        </Button>
                      </motion.div>
                    )}
                    
                    {shouldShowRegisterButton() && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="default"
                          onClick={() => handleNavigation('/register')}
                          className="font-medium bg-gradient-to-r from-[#0078d4] via-[#064ad4] to-[#004b8d] hover:from-[#064ad4] hover:via-[#0078d4] hover:to-[#064ad4] shadow-lg hover:shadow-xl hover:shadow-[#0078d4]/30 transition-all duration-200 px-3 xl:px-4 py-2 text-sm"
                          iconName="ArrowRight"
                          iconPosition="right"
                        >
                          Signup
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl hover:bg-[#f5f9ff] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0078d4]/20"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle mobile menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon 
                    name={isMobileMenuOpen ? "X" : "Menu"} 
                    size={20} 
                    className="text-[#093389] sm:w-6 sm:h-6"
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-[#d6e6f7]"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Cart Summary in Mobile Menu */}
              {itemCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-[#f5f9ff] to-[#e9eff5] rounded-xl border border-[#d6e6f7]"
                >
                  <button
                    onClick={() => {
                      handleNavigation('/cart');
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#0078d4] to-[#064ad4] rounded-full flex items-center justify-center">
                        <Icon name="ShoppingCart" size={18} className="text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-[#093389]">Your Cart</div>
                        <div className="text-sm text-[#555555]">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-[#555555]" />
                  </button>
                </motion.div>
              )}
              
              {/* User Info when authenticated */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#f5f9ff] to-[#e9eff5] rounded-xl border border-[#d6e6f7]"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0078d4] to-[#064ad4] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#093389]">
                      {user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user?.username || 'User'
                      }
                    </div>
                    <div className="text-sm text-[#555555]">
                      {user?.email || 'Authenticated User'}
                    </div>
                    <div className="text-xs text-[#0078d4] font-medium capitalize">
                      {user?.role || 'User'} • {getDashboardLabel()}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Webinar Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#093389] uppercase tracking-wider">
                  Training Programs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {webinarMenuItems.map((item, index) => (
                    <motion.button
                      key={item.type}
                      onClick={() => handleNavigation(item.path)}
                      className="flex items-center space-x-3 p-4 bg-[#f5f9ff] hover:bg-gradient-to-r hover:from-[#d9ecff] hover:to-[#f5f9ff] rounded-xl transition-colors duration-200 text-left w-full group border border-[#d6e6f7] hover:border-[#0078d4]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 ${item.type === 'live' ? 'bg-gradient-to-br from-[#d9ecff] to-[#f5f9ff]' : 'bg-gradient-to-br from-[#e9eff5] to-[#f5f9ff]'} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 border border-[#d6e6f7]`}>
                        <Icon 
                          name={item.icon} 
                          size={18} 
                          color={item.type === 'live' ? '#0078d4' : '#064ad4'} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-[#093389] group-hover:text-[#0078d4] transition-colors text-sm">
                            {item.title}
                          </span>
                          <span className={`${item.badgeColor} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#555555]">
                          {item.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              {mobileNavigationItems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#093389] uppercase tracking-wider">
                    Navigation
                  </h3>
                  {mobileNavigationItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className="block w-full text-left text-[#093389] hover:text-[#0078d4] hover:bg-[#f5f9ff] transition-colors duration-200 font-medium py-3 px-4 rounded-xl focus-ring"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Auth Buttons / User Actions */}
              <div className="pt-4 border-t border-[#d6e6f7] space-y-3">
                {isAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        variant="default"
                        fullWidth
                        onClick={handleDashboardClick}
                        className="font-medium justify-center bg-gradient-to-r from-[#0078d4] via-[#064ad4] to-[#004b8d] hover:from-[#064ad4] hover:via-[#0078d4] hover:to-[#064ad4] shadow-lg"
                        iconName="ShoppingBag"
                        iconPosition="left"
                      >
                        Go to {getDashboardLabel()}
                      </Button>
                    </motion.div>
                    
                    {user?.role === 'attendee' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleNavigation('/attendee/enrollments')}
                            className="text-xs font-medium justify-center text-[#0078d4] hover:bg-[#f5f9ff] border-[#d6e6f7]"
                            iconName="BookOpen"
                            iconPosition="left"
                          >
                            Enrollments
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleNavigation('/attendee/profile')}
                            className="text-xs font-medium justify-center text-[#0078d4] hover:bg-[#f5f9ff] border-[#d6e6f7]"
                            iconName="User"
                            iconPosition="left"
                          >
                            Profile
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        variant="ghost"
                        fullWidth
                        onClick={handleLogout}
                        className="font-medium justify-center text-[#0078d4] hover:text-[#064ad4] hover:bg-[#f5f9ff]"
                        iconName="LogOut"
                        iconPosition="left"
                      >
                        Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {shouldShowLoginButton() && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button
                          variant="ghost"
                          fullWidth
                          onClick={() => handleNavigation('/login')}
                          className="font-medium justify-center text-[#093389] hover:text-[#0078d4]"
                        >
                          Login
                        </Button>
                      </motion.div>
                    )}
                    
                    {shouldShowRegisterButton() && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button
                          variant="default"
                          fullWidth
                          onClick={() => handleNavigation('/register')}
                          className="font-medium bg-gradient-to-r from-[#0078d4] via-[#064ad4] to-[#004b8d] hover:from-[#064ad4] hover:via-[#0078d4] hover:to-[#064ad4] shadow-lg"
                          iconName="ArrowRight"
                          iconPosition="right"
                        >
                          Signup
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Browse All Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4 border-t border-[#d6e6f7]"
              >
                <button
                  onClick={() => handleNavigation('/webinars/live')}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#f5f9ff] to-[#e9eff5] text-[#004b8d] py-4 px-4 rounded-xl hover:from-[#d9ecff] hover:to-[#f5f9ff] transition-all duration-200 font-medium group border border-[#d6e6f7]"
                >
                  <Icon name="Search" size={16} />
                  <span>Browse All Training</span>
                  <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default PublicHeader;