// components/LiveStatsSection.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
const LiveStatsSection = () => {
  const [counts, setCounts] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    companies: 0
  });

  const finalCounts = {
    students: 15847,
    courses: 450,
    instructors: 125,
    companies: 850
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        students: Math.floor(finalCounts.students * progress),
        courses: Math.floor(finalCounts.courses * progress),
        instructors: Math.floor(finalCounts.instructors * progress),
        companies: Math.floor(finalCounts.companies * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(finalCounts);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: "Active Students",
      value: counts.students.toLocaleString(),
      icon: "Users",
      color: "text-blue-600"
    },
    {
      label: "Expert Courses",
      value: counts.courses.toLocaleString(),
      icon: "BookOpen",
      color: "text-green-600"
    },
    {
      label: "Industry Experts",
      value: counts.instructors.toLocaleString(),
      icon: "Award",
      color: "text-purple-600"
    },
    {
      label: "Partner Companies",
      value: counts.companies.toLocaleString(),
      icon: "Building",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4 ${stat.color}`}>
                <Icon name={stat.icon} size={24} />
              </div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStatsSection;
