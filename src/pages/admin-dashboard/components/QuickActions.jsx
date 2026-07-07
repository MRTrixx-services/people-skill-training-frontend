import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { motion } from 'framer-motion';
const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: "Schedule Live Webinar",
      description: "Create and schedule a new live session",
      icon: "Radio",
      color: "bg-gradient-to-br from-red-500 to-pink-600",
      action: () => console.log("Schedule webinar")
    },
    {
      id: 2,
      title: "Upload Recording",
      description: "Add a new recorded webinar session",
      icon: "Upload",
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      action: () => console.log("Upload recording")
    },
    {
      id: 3,
      title: "Add Instructor",
      description: "Register a new instructor to the platform",
      icon: "UserPlus",
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      action: () => console.log("Add instructor")
    },
    {
      id: 4,
      title: "Revenue Report",
      description: "Generate financial analytics report",
      icon: "BarChart3",
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      action: () => console.log("Generate report")
    }, {
      id: 5,
      title: "Manage Support Tickets",
      description: "View and respond to user support requests",
      icon: "Headphones",
      color: "bg-gradient-to-br from-orange-500 to-amber-600",
      action: () => console.log("Manage support tickets")
    },
    {
      id: 6,
      title: "Platform Settings",
      description: "Configure system settings and integrations",
      icon: "Settings",
      color: "bg-gradient-to-br from-cyan-500 to-teal-600",
      action: () => console.log("Platform settings")
    }
  ];


  return (
     <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-lg border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Quick Actions */}
      <div className="lg:col-span-2">
       <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <p className="text-gray-600 text-sm">Essential admin functions</p>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg"
        >
          <Icon name="Zap" size={20} className="text-white" />
        </motion.div>
      </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions?.map((action) => (
              <button
                key={action?.id}
                onClick={action?.action}
                className="p-6 text-left bg-gradient-to-br from-blue-50 to-indigo-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group hover:shadow-lg"
              >
                <div className="flex items-start space-x-4">
                 <motion.div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${action?.color} shadow-lg`}
                  whileHover={{ 
                    rotate: action?.icon === 'Settings' ? 180 : 10,
                    scale: 1.1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={action?.icon === 'Settings' ? { rotate: [0, 360] } : {}}
                    transition={action?.icon === 'Settings' ? { 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "linear" 
                    } : {}}
                  >
                    <Icon name={action?.icon} size={24} className="text-white" />
                  </motion.div>
                </motion.div>
                  <div className="flex-1 min-w-0">
                   <motion.h4 
                                       className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2"
                                       whileHover={{ x: 2 }}
                                     >
                                       {action?.title}
                                     </motion.h4>
                                     <motion.p 
                                       className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed"
                                       whileHover={{ x: 2 }}
                                     >
                                       {action?.description}
                                     </motion.p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        
      </div>

   </motion.div>
  );
};

export default QuickActions;
