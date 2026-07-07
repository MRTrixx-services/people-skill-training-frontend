import { SideNavBar } from "components/SideNavBar";
import AppHeader from "components/ui/AppHeader";
import { FloatingNavbar } from "components/ui/FloatingNavbar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconRecordMail,
  IconSettings,
  IconTrendingUp,
  IconUserBolt,
} from "@tabler/icons-react";
const InstructorLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mockUser = {
      id: "inst_001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@eduzoom.com",
      role: "instructor",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      specialization: "Data Science & Machine Learning",
      experience: "8 years",
      rating: 4.8,
      totalStudents: 2847,
    };
    setUser(mockUser);

    setNotifications([
      {
        id: 1,
        title: "New student enrolled",
        message: "John Smith enrolled in your Python Fundamentals webinar",
        time: "5 minutes ago",
        type: "webinar",
        read: false,
        priority: "normal",
      },
      {
        id: 2,
        title: "Payment received",
        message: "You received $89 for Machine Learning Basics session",
        time: "1 hour ago",
        type: "payment",
        read: false,
        priority: "normal",
      },
      {
        id: 3,
        title: "Session reminder",
        message: "Your Advanced Python webinar starts in 2 hours",
        time: "2 hours ago",
        type: "reminder",
        read: true,
        priority: "high",
      },
    ]);
  }, []);

  // const handleLogout = () => {
  //   setUser(null);
  //   navigate("/login");
  // };

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
  };
 
  
  const links = [
    {
      label: "Dashboard",
      href: "/instructor",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
    {
      label: "My Webinars",
      href: "/instructor/my-webinars",
      icon: (
        <IconTrendingUp className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
   
    {
      label: "Profile",
      href: "/instructor/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
    
  ];
 
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - fixed full height */}
      <div className="hidden md:block sticky top-0 h-screen z-[1000]  shrink-0">
        <SideNavBar links={links} open={open} setOpen={setOpen} />
      </div>

      {/* Right section */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Header - fixed at top */}
        <div className="sticky top-0 z-50 bg-background">
          <AppHeader
  user={user}
  notifications={notifications}
  // onLogout={handleLogout}
  onNotificationClick={handleNotificationClick}
  sidebarOpen={open}
  onToggleSidebar={() => setOpen(!open)}
/>

        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {children}
        </div>
    <div className="md:hidden">
          <FloatingNavbar />
        </div>
      </div>
    </div>
  );
};

export default InstructorLayout;
