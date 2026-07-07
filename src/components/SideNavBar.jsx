"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/SideNav";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../utils/cn";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  IconLogout,
  IconUser,
  IconSettings,
  IconBell,
  IconChevronRight,
  IconHome,
  IconDashboard
} from "@tabler/icons-react";

export function SideNavBar({ links, setOpen, open }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fixed active link detection
  const isActiveLink = (href) => {
    // Exact match for dashboard
    if (href === '/admin' && location.pathname === '/admin') {
      return true;
    }
    // For other routes, check if pathname starts with href (but not for dashboard)
    if (href !== '/admin' && location.pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  return (
    <div className="h-screen relative"> 
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-4 bg-gradient-to-b from-slate-50 to-blue-50 border-r border-gray-200/50">
          {/* Top Section */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Logo Section - Only show when sidebar is open */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6"
                >
                  <EnhancedLogo />
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Profile Section when expanded */}
            <AnimatePresence>
              {open && user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="mb-6 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user?.username || 'Admin User'
                        }
                      </p>
                      <p className="text-xs capitalize text-gray-600 truncate">{user?.role}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Links with hidden scrollbar */}
            <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
              <div className="space-y-1">
                {links.map((link, idx) => (
                  <EnhancedSidebarLink 
                    key={idx} 
                    link={link} 
                    isActive={isActiveLink(link.href)}
                    isOpen={open}
                    onHover={(hovered) => setHoveredLink(hovered ? idx : null)}
                    isHovered={hoveredLink === idx}
                    onClick={() => handleNavigation(link.href)}
                  />
                ))}
              </div>
            </nav>
          </div>

          {/* Bottom Section - User Actions */}
          <div className="space-y-2 border-t border-gray-200/50 pt-4">
            {/* Quick Settings */}
            <EnhancedSidebarLink
              link={{
                label: "Settings",
                href: "/admin/settings",
                icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700" />
              }}
              isActive={isActiveLink("/admin/settings")}
              isOpen={open}
              onClick={() => handleNavigation("/admin/settings")}
            />

            {/* Back to Website */}
            <EnhancedSidebarLink
              link={{
                label: "Back to Website",
                href: "/",
                icon: <IconHome className="h-5 w-5 shrink-0 text-neutral-700" />
              }}
              isActive={false}
              isOpen={open}
              onClick={() => handleNavigation("/")}
            />

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-red-600 hover:bg-red-50 hover:text-red-700",
                "focus:outline-none focus:ring-2 focus:ring-red-500/20",
                !open && "justify-center"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconLogout className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Add CSS for hiding scrollbar */}
      <style jsx>{`
        .no-scrollbar {
          /* Hide scrollbar for Chrome, Safari and Opera */
          -webkit-scrollbar: none;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  );
}

// Enhanced Sidebar Link Component
const EnhancedSidebarLink = ({ 
  link, 
  isActive, 
  isOpen, 
  onHover, 
  isHovered, 
  onClick 
}) => {
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover && onHover(true)}
      onMouseLeave={() => onHover && onHover(false)}
      className={cn(
        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
        isActive 
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg" 
          : "text-gray-700 hover:bg-white/60 hover:shadow-sm hover:text-indigo-600",
        !isOpen && "justify-center"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon with enhanced styling */}
      <div className={cn(
        "flex-shrink-0 transition-colors duration-200",
        isActive ? "text-white" : "text-gray-600 group-hover:text-indigo-600"
      )}>
        {link.icon}
      </div>

      {/* Label with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between flex-1 min-w-0"
          >
            <span className={cn(
              "font-medium text-sm whitespace-nowrap truncate",
              isActive ? "text-white" : "text-gray-700 group-hover:text-indigo-600"
            )}>
              {link.label}
            </span>
            
            {/* Active indicator */}
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-white rounded-full flex-shrink-0 ml-2"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip for collapsed state */}
      {!isOpen && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap"
            >
              {link.label}
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.button>
  );
};

// Enhanced Logo Component - Only for expanded state
export const EnhancedLogo = () => {
  const navigate = useNavigate();
   const { user, logout } = useAuth();
  return (
    <motion.button
      onClick={() => navigate('/admin')}
      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src="/assets/logo (4).png"
        alt="PeopleSkillTraining Logo"
        className="h-8 w-auto shrink-0"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-w-0"
      >
        <div className="font-bold text-gray-900 text-sm truncate">
          PeopleSkillTraining

        </div>
        <div className="text-xs capitalize text-gray-600 truncate">
          {user?.role} Dashboard
        </div>
      </motion.div>
    </motion.button>
  );
};
