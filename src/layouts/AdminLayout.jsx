import { SideNavBar } from "components/SideNavBar";
import AppHeader from "components/ui/AppHeader";
import { FloatingNavbar } from "components/ui/FloatingNavbar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconRecordMail,
  IconSettings,
  IconTrendingUp,
  IconUserBolt,
  IconVideo,
  IconUsers,
  IconPlaystationCircle,
  IconCreditCard,
  IconChartLine,
  IconPlugConnected,
  IconFileText,
  IconShield,
  IconBell,
  IconMail,
  IconMenu,
  IconX,
  IconLogout,
  IconHome,
  IconDashboard,IconCreditCardPay
} from "@tabler/icons-react";
import { useAuth } from "contexts/AuthContext";

const AdminLayout = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
    switch (notification.type) {
      case 'instructor':
        navigate('/admin/instructors');
        break;
      case 'payment':
        navigate('/admin/payment-reports');
        break;
      case 'webinar':
        navigate('/admin/webinars');
        break;
      case 'recording':
        navigate('/admin/recordings');
        break;
      case 'analytics':
        navigate('/admin/revenue-analytics');
        break;
      default:
        break;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
  };

  // Enhanced admin navigation links
  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
    {
      label: "Webinar Management",
      href: "/admin/webinars",
      icon: (
        <IconVideo className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
    {
      label: "Instructor Management",
      href: "/admin/instructors",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
    {
     label: "Payments history",
      href: "/admin/payments",
      icon: (
        <IconCreditCardPay className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
  ];

  // Mobile navigation items for admin
  const mobileNavigationItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <IconDashboard size={20} />,
      description: 'Overview and analytics'
    },
    {
      name: 'Webinar Management',
      path: '/admin/webinars',
      icon: <IconVideo size={20} />,
      description: 'Manage all webinars'
    },
    {
      name: 'Instructor Management',
      path: '/admin/instructors',
      icon: <IconUsers size={20} />,
      description: 'Manage instructors'
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <IconSettings size={20} />,
      description: 'System settings'
    },
    {
     name: "Payments",
      path: '/admin/payments',
      icon: <IconCreditCardPay size={20} />,
      description: 'Payments history'
      // href: "/admin/payments",
      // icon: (
      //   <IconCreditCardPay className="h-5 w-5 shrink-0 text-neutral-700" />
      // ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Full-width Header at the top */}
      <div className="sticky top-0 z-50 w-full">
        <AppHeader
          user={user}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          sidebarOpen={open}
          toggleMobileMenu={toggleMobileMenu}
          onToggleSidebar={() => setOpen(!open)}
        />
      </div>

      {/* Main content area with sidebar */}
      <div className="flex min-h-[calc(100vh-4rem)]"> {/* Subtract header height */}
        {/* Enhanced Sidebar - Desktop only */}
        <div className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] z-[1000] shrink-0">
          <SideNavBar links={links} open={open} setOpen={setOpen} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-full">
          {/* Mobile Menu Toggle - Only show on mobile */}
          

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeMobileMenu}
                  className="md:hidden fixed inset-0 bg-black/50 z-40"
                />

                {/* Mobile Menu */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="md:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src="/assets/logo (4).png" 
                            alt="Logo" 
                            className="h-8 w-auto object-contain"
                          />
                          <div className="text-white">
                            <div className="text-lg font-bold">Admin Panel</div>
                            <div className="text-xs text-indigo-200">Management Dashboard</div>
                          </div>
                        </div>
                        <button
                          onClick={closeMobileMenu}
                          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <IconX size={20} />
                        </button>
                      </div>

                      {/* User Info in Mobile */}
                      {user && (
                        <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">
                              {user?.first_name && user?.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : user?.username || 'Admin User'
                              }
                            </div>
                            <div className="text-xs text-indigo-200">Admin</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile Navigation Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      {mobileNavigationItems.map((item, index) => (
                        <motion.button
                          key={item.name}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-colors duration-200 group border border-transparent hover:border-gray-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <div className="text-indigo-600">
                              {item.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Mobile Menu Footer */}
                    <div className="p-4 border-t border-gray-200 space-y-3">
                      <motion.button
                        onClick={() => handleNavigation('/')}
                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <IconHome size={20} className="text-gray-600" />
                        <span className="font-medium text-gray-700">Back to Website</span>
                      </motion.button>

                      <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-xl transition-colors duration-200 text-red-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <IconLogout size={20} />
                        <span className="font-medium">Logout</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Scrollable content with enhanced background */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
