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
    console.log(`Navigating to: ${path}`);
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

  // Role-based dashboard navigation - UPDATED for attendees
  const getDashboardPath = () => {
    if (!user?.role) return '/attendee/orders';

    switch (user.role.toLowerCase()) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/attendee/orders'; // Temporarily redirect instructors to orders page
      case 'attendee':
      default:
        return '/attendee/orders'; // Redirect attendees to My Orders page
    }
  };

  const getDashboardLabel = () => {
    if (!user?.role) return 'My Orders';

    switch (user.role.toLowerCase()) {
      case 'admin':
        return 'Admin Dashboard';
      case 'instructor':
        return 'My Orders'; // Temporarily show orders for instructors
      case 'attendee':
      default:
        return 'My Orders'; // Show My Orders for attendees
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
      description: 'Interactive real-time sessions',
      icon: 'Radio',
      path: '/webinars/live',
      badge: 'LIVE',
      badgeColor: 'bg-red-500'
    },
    {
      type: 'recorded',
      title: 'Recorded Webinars',
      description: 'Access anytime, anywhere',
      icon: 'Play',
      path: '/webinars/recorded',
      badge: 'ON-DEMAND',
      badgeColor: 'bg-blue-500'
    }
  ];

  // Desktop navigation items (includes webinars)
  const desktopNavigationItems = [
    { name: 'About Us', path: '/about' },
    { name: 'Live Webinars', path: '/webinars/live' },
    { name: 'Recorded Webinars', path: '/webinars/recorded' },
    { name: 'Contact', path: '/contact' }
  ];

  // Mobile navigation items (excludes webinars since they're shown separately)
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
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100/50'
      }`}
    >
      {/* Full-width container with proper max-width */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 w-full">
            {/* Left Section - Logo (Fixed Width) */}
            <div className="flex items-center min-w-0 flex-shrink-0 w-48 sm:w-64 lg:w-80">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <button
                  onClick={() => handleNavigation('/')}
                  className="flex items-center space-x-3 hover-lift focus-ring rounded-xl p-2 -m-2"
                >
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="/assets/logo(4).png" 
                      alt="Logo" 
                      className="h-10 w-auto object-contain flex-shrink-0"
                    />
                    <div className="hidden sm:block">
                      <div className="text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                        PeopleSkillTraining
                      </div>
                      <div className="text-xs text-gray-500 -mt-1 whitespace-nowrap">Learn • Grow • Succeed</div>
                    </div>
                  </motion.div>
                </button>
              </motion.div>
            </div>

            {/* Center Section - Desktop Navigation (Flexible) */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <div className="flex items-center space-x-6 xl:space-x-8">
                {desktopNavigationItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium focus-ring rounded-lg px-4 py-2 whitespace-nowrap"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* Right Section - COMPLETELY RESTRUCTURED FOR MOBILE VISIBILITY */}
            <div className="flex items-center justify-end space-x-3">
              {/* Cart Button - Always Visible (Both Mobile & Desktop) */}
              <motion.button
                onClick={() => handleNavigation('/cart')}
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

              {/* Desktop Auth Section - Only Show on Large Screens */}
              <div className="hidden lg:flex items-center space-x-3">
                {isAuthenticated ? (
                  <>
                    <motion.button
                      onClick={handleDashboardClick}
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium focus-ring rounded-lg px-3 py-2 whitespace-nowrap"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                          {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="hidden xl:inline-block">{getDashboardLabel()}</span>
                    </motion.button>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="font-medium text-gray-700 hover:text-red-600"
                        iconName="LogOut"
                        iconPosition="left"
                      >
                        <span className="hidden xl:inline">Logout</span>
                        <span className="xl:hidden">
                          <Icon name="LogOut" size={16} />
                        </span>
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
                          className="font-medium text-gray-700 hover:text-indigo-600 px-4 py-2"
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
                          className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2"
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

              {/* Mobile Menu Button - Always Show on Mobile */}
              <motion.button
                onClick={toggleMobileMenu}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle mobile menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon 
                    name={isMobileMenuOpen ? "X" : "Menu"} 
                    size={24} 
                    className="text-gray-700"
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
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Cart Summary in Mobile Menu */}
              {itemCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
                >
                  <button
                    onClick={() => {
                      handleNavigation('/cart');
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Icon name="ShoppingCart" size={18} className="text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Your Cart</div>
                        <div className="text-sm text-gray-600">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-gray-400" />
                  </button>
                </motion.div>
              )}
              
              {/* User Info when authenticated */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user?.username || 'User'
                      }
                    </div>
                    <div className="text-sm text-gray-600">
                      {user?.email || 'Authenticated User'}
                    </div>
                    <div className="text-xs text-indigo-600 font-medium capitalize">
                      {user?.role || 'User'} • {getDashboardLabel()}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Webinar Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Webinars
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {webinarMenuItems.map((item, index) => (
                    <motion.button
                      key={item.type}
                      onClick={() => handleNavigation(item.path)}
                      className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 text-left w-full group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 ${item.type === 'live' ? 'bg-red-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon 
                          name={item.icon} 
                          size={18} 
                          color={item.type === 'live' ? '#ef4444' : '#3b82f6'} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors text-sm">
                            {item.title}
                          </span>
                          <span className={`${item.badgeColor} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
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
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Navigation
                  </h3>
                  {mobileNavigationItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className="block w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200 font-medium py-3 px-4 rounded-xl focus-ring"
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
              <div className="pt-4 border-t border-gray-200 space-y-3">
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
                        className="font-medium justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        iconName="ShoppingBag"
                        iconPosition="left"
                      >
                        Go to {getDashboardLabel()}
                      </Button>
                    </motion.div>
                    
                    {/* Additional quick access for attendees */}
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
                            className="text-xs font-medium justify-center text-indigo-600 hover:bg-indigo-50"
                            iconName="BookOpen"
                            iconPosition="left"
                          >
                            Enrollments
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleNavigation('/attendee/profile')}
                            className="text-xs font-medium justify-center text-indigo-600 hover:bg-indigo-50"
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
                        className="font-medium justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
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
                          className="font-medium justify-center text-gray-700 hover:text-indigo-600"
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
                          className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
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
                className="pt-4 border-t border-gray-200"
              >
                <button
                  onClick={() => handleNavigation('/webinars/live')}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-4 px-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium group"
                >
                  <Icon name="Search" size={16} />
                  <span>Browse All Webinars</span>
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
