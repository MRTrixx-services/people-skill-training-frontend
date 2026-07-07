import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

// Mobile Drawer Overlay Component
const MobileDrawer = ({ isOpen, onClose, children }) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut" 
            }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden shadow-xl"
            style={{ maxWidth: 'calc(100vw - 40px)' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="font-bold text-lg text-gray-900 flex items-center">
                <Icon name="Filter" size={20} className="mr-2 text-purple-600" />
                Filter
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            {/* Drawer Content */}
            <div className="flex flex-col h-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Individual Accordion Item Component
const AccordionItem = ({ title, children, isOpen, onToggle, count = null }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 focus:outline-none transition-colors"
      >
        <div className="flex items-center space-x-2">
          <h4 className="font-bold text-base text-gray-900">{title}</h4>
          {count !== null && count > 0 && (
            <span className="text-xs text-white bg-purple-600 px-2 py-1 rounded-full">
              {count}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon name="ChevronDown" size={16} className="text-gray-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// MOBILE DRAWER Filter Sidebar
const AccordionFilterSidebar = ({
  webinars,
  searchQuery,
  setSearchQuery,
  selectedMonths,
  setSelectedMonths,
  selectedInstructors,
  setSelectedInstructors,
  selectedCategories,
  setSelectedCategories,
  isFiltersOpen,
  setIsFiltersOpen,
  clearFilters,
  hasActiveFilters
}) => {
  // State to manage which accordion sections are open
  const [openSections, setOpenSections] = useState({
    search: true,
    month: false,
    speaker: false,
    category: false
  });

  // Toggle individual accordion sections
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Extract unique filter values
  const months = useMemo(() => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const webinarMonths = [...new Set(webinars.map(w => {
      const date = new Date(w.date);
      return monthNames[date.getMonth()];
    }))];
    return webinarMonths.sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b));
  }, [webinars]);

  const instructors = useMemo(() => 
    [...new Set(webinars.map(w => w.instructor.name))].sort(), [webinars]
  );

  const categories = useMemo(() => 
    [...new Set(webinars.map(w => w.category))].sort(), [webinars]
  );

  // Multi-select handlers
  const handleMonthChange = (month) => {
    setSelectedMonths(prev => 
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const handleInstructorChange = (instructor) => {
    setSelectedInstructors(prev => 
      prev.includes(instructor)
        ? prev.filter(i => i !== instructor)
        : [...prev, instructor]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Calculate filter counts
  const getFilterCount = (filterType, value) => {
    return webinars.filter(w => {
      switch(filterType) {
        case 'category': return w.category === value;
        case 'instructor': return w.instructor.name === value;
        case 'month': return new Date(w.date).toLocaleString('default', { month: 'long' }) === value;
        default: return true;
      }
    }).length;
  };


  return (
    <div className="lg:w-70 flex-shrink-0">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          fullWidth
          onClick={() => setIsFiltersOpen(true)}
          iconName="Filter"
          iconPosition="left"
          className="justify-center border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Filter ({[
            searchQuery, 
            ...selectedMonths, 
            ...selectedInstructors, 
            ...selectedCategories
          ].filter(Boolean).length})
        </Button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)}>
        {/* FIXED: Mobile Filter Content - Directly embedded */}
        <>
        {hasActiveFilters && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={clearFilters}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                Clear All
              </Button>
             
            </div>
          </div> )}
          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Accordion */}
            <AccordionItem
              title="Search"
              isOpen={openSections.search}
              onToggle={() => toggleSection('search')}
            >
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search webinars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon name="X" size={14} />
                  </motion.button>
                )}
              </div>
            </AccordionItem>

            {/* Month Multi-Select Accordion */}
            <AccordionItem
              title="Month"
              isOpen={openSections.month}
              onToggle={() => toggleSection('month')}
              count={selectedMonths.length}
            >
              <div className="space-y-2">
                {months.map((month, index) => (
                  <motion.label 
                    key={month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-colors group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedMonths.includes(month)}
                      onChange={() => handleMonthChange(month)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex-1 group-hover:text-purple-700 transition-colors">
                      {month}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 group-hover:bg-purple-100 px-2 py-1 rounded-full transition-colors">
                      {getFilterCount('month', month)}
                    </span>
                  </motion.label>
                ))}
              </div>
            </AccordionItem>

            {/* Speaker Multi-Select Accordion */}
            <AccordionItem
              title="Speaker"
              isOpen={openSections.speaker}
              onToggle={() => toggleSection('speaker')}
              count={selectedInstructors.length}
            >
              <div className="space-y-2">
                {instructors.map((instructor, index) => (
                  <motion.label 
                    key={instructor}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedInstructors.includes(instructor)}
                      onChange={() => handleInstructorChange(instructor)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex-1 group-hover:text-blue-700 transition-colors">
                      {instructor}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 group-hover:bg-blue-100 px-2 py-1 rounded-full transition-colors">
                      {getFilterCount('instructor', instructor)}
                    </span>
                  </motion.label>
                ))}
              </div>
            </AccordionItem>

            {/* Category Multi-Select Accordion */}
            <AccordionItem
              title="Category"
              isOpen={openSections.category}
              onToggle={() => toggleSection('category')}
              count={selectedCategories.length}
            >
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <motion.label 
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center cursor-pointer hover:bg-green-50 p-3 rounded-lg transition-colors group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex-1 group-hover:text-green-700 transition-colors">
                      {category}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 group-hover:bg-green-100 px-2 py-1 rounded-full transition-colors">
                      {getFilterCount('category', category)}
                    </span>
                  </motion.label>
                ))}
              </div>
            </AccordionItem>
          </div>

          {/* FIXED: Mobile Footer - Always show both buttons */}
          
        </>
      </MobileDrawer>

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block">
        <div
          className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
          style={{
            position: 'sticky',
            top: '20px',
            alignSelf: 'flex-start',
            height: 'fit-content',
            maxHeight: 'calc(100vh - 40px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Desktop Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
            <h3 className="font-bold text-lg text-gray-900 flex items-center">
              <Icon name="Filter" size={20} className="mr-2 text-purple-600" />
              Filter
            </h3>
            {hasActiveFilters && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium underline transition-colors"
              >
                Clear all
              </motion.button>
            )}
          </div>

          {/* Desktop Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Accordion */}
            <AccordionItem
              title="Search"
              isOpen={openSections.search}
              onToggle={() => toggleSection('search')}
            >
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search webinars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon name="X" size={14} />
                  </motion.button>
                )}
              </div>
            </AccordionItem>

            {/* Month Multi-Select Accordion */}
            <AccordionItem
              title="Month"
              isOpen={openSections.month}
              onToggle={() => toggleSection('month')}
              count={selectedMonths.length}
            >
              <div className="space-y-2">
                {months.map((month, index) => (
                  <motion.label 
                    key={month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-colors group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedMonths.includes(month)}
                      onChange={() => handleMonthChange(month)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex-1 group-hover:text-purple-700 transition-colors">
                      {month}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 group-hover:bg-purple-100 px-2 py-1 rounded-full transition-colors">
                      {getFilterCount('month', month)}
                    </span>
                  </motion.label>
                ))}
              </div>
            </AccordionItem>

            {/* Speaker Multi-Select Accordion */}
            <AccordionItem
              title="Speaker"
              isOpen={openSections.speaker}
              onToggle={() => toggleSection('speaker')}
              count={selectedInstructors.length}
            >
              <div className="space-y-2">
                {instructors.map((instructor, index) => (
                  <motion.label 
                    key={instructor}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedInstructors.includes(instructor)}
                      onChange={() => handleInstructorChange(instructor)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex-1 group-hover:text-blue-700 transition-colors">
                      {instructor}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 group-hover:bg-blue-100 px-2 py-1 rounded-full transition-colors">
                      {getFilterCount('instructor', instructor)}
                    </span>
                  </motion.label>
                ))}
              </div>
            </AccordionItem>

            {/* Category Multi-Select Accordion */}
            <AccordionItem
              title="Category"
              isOpen={openSections.category}
              onToggle={() => toggleSection('category')}
              count={selectedCategories.length}
            >
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <motion.label 
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center cursor-pointer hover:bg-green-50 p-3 rounded-lg transition-colors group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex-1 group-hover:text-green-700 transition-colors">
                      {category}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 group-hover:bg-green-100 px-2 py-1 rounded-full transition-colors">
                      {getFilterCount('category', category)}
                    </span>
                  </motion.label>
                ))}
              </div>
            </AccordionItem>
          </div>

          {/* Desktop Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50">
            <div className="flex justify-between text-sm">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenSections({ search: true, month: true, speaker: true, category: true })}
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors flex items-center"
              >
                <Icon name="ChevronDown" size={14} className="mr-1" />
                Expand All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenSections({ search: true, month: false, speaker: false, category: false })}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center"
              >
                <Icon name="ChevronUp" size={14} className="mr-1" />
                Collapse All
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionFilterSidebar;
