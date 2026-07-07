import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { API_BASE_URL } from 'config/axiosInstance';
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal 
} from 'lucide-react';
const LiveWebinarsPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const itemsPerPage = 12;
  const [totalCount, setTotalCount] = useState(0);
  
  // Data states
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (showMobileDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileDrawer]);

  // Fetch webinars with progressive loading
  const fetchWebinars = async () => {
    try {
      setLoading(true);
      setError(null);
      setWebinars([]);
      setProgress(0);
      setTotalCount(0);

      let nextUrl = `webinars/?webinar_type=live&status=scheduled&page_size=50`;
      let totalCountLocal = 0;

      while (nextUrl) {
        console.log(`🔄 Fetching: ${nextUrl}`);
        
        const response = await axiosInstance.get(nextUrl);
        
        if (totalCountLocal === 0) {
          totalCountLocal = response.data.count || response.data.results?.length || 117;
          setTotalCount(totalCountLocal);
          console.log(`📊 TOTAL webinars available: ${totalCountLocal}`);
        }
        
        const webinarsPage = response.data.results 
          ? response.data.results.map(transformWebinarData)
          : response.data.map(transformWebinarData);
        
        setWebinars(prevWebinars => {
          const updatedWebinars = [...prevWebinars, ...webinarsPage];
          const sortedWebinars = updatedWebinars.sort((a, b) => 
            new Date(a.scheduled_date || a.date) - new Date(b.scheduled_date || b.date)
          );
          
          const newProgress = totalCountLocal > 0 
            ? Math.min(100, (sortedWebinars.length / totalCountLocal) * 100)
            : Math.min(100, (sortedWebinars.length / 117) * 100);
          
          setProgress(newProgress);
          
          console.log(`✅ Added ${webinarsPage.length} | Total: ${sortedWebinars.length}/${totalCountLocal} (${Math.round(newProgress)}%)`);
          return sortedWebinars;
        });
        
        nextUrl = response.data.next;
        
        if (nextUrl) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
    } catch (err) {
      console.error('❌ Error fetching webinars:', err);
      setError('Failed to load webinars. Please try again later.');
    } finally {
      setLoading(false);
      console.log(`🎉 Loading complete! Total webinars: ${webinars.length}`);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, [API_BASE_URL]);

const transformWebinarData = (apiWebinar) => {
  const utcDate = new Date(apiWebinar.scheduled_date);
  const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[istDate.getUTCMonth()];
  const day = istDate.getUTCDate();
  const year = istDate.getUTCFullYear();

  const format12h = (date) => {
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2,'0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  };

  // Function to determine if a date is in daylight saving time for US timezones
  const isDaylightSavingTime = (date) => {
    const year = date.getUTCFullYear();
    // DST in US starts on second Sunday in March (2 AM) and ends on first Sunday in November (2 AM)
    const dstStart = new Date(Date.UTC(year, 2, 1));
    const dstEnd = new Date(Date.UTC(year, 10, 1));
    
    // Find second Sunday in March
    dstStart.setUTCDate(1);
    while (dstStart.getUTCDay() !== 0) { // 0 = Sunday
      dstStart.setUTCDate(dstStart.getUTCDate() + 1);
    }
    dstStart.setUTCDate(dstStart.getUTCDate() + 7); // Second Sunday
    
    // Find first Sunday in November
    dstEnd.setUTCDate(1);
    while (dstEnd.getUTCDay() !== 0) {
      dstEnd.setUTCDate(dstEnd.getUTCDate() + 1);
    }
    
    return date >= dstStart && date < dstEnd;
  };

  // Get appropriate timezone abbreviations
  const getPacificTimezone = (date) => {
    return isDaylightSavingTime(date) ? 'PDT' : 'PST';
  };

  const getEasternTimezone = (date) => {
    return isDaylightSavingTime(date) ? 'EDT' : 'EST';
  };

  // Calculate times
  const pstDate = istDate;
  const estDate = new Date(istDate.getTime() + 3 * 60 * 60 * 1000);

  const pstTime = format12h(pstDate);
  const estTime = format12h(estDate);
  
  const pacificTz = getPacificTimezone(pstDate);
  const easternTz = getEasternTimezone(estDate);
  
  const timeString = `${pstTime} ${pacificTz} | ${estTime} ${easternTz}`;

  return {
    id: apiWebinar.id,
    webinarId: apiWebinar.webinar_id,
    title: apiWebinar.title,
    date: day.toString(),
    month: month.toUpperCase(),
    instructor: {
      name: apiWebinar.speaker?.full_name || apiWebinar.speaker?.name || 'Instructor',
      avatar: apiWebinar.speaker?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format&q=60'
    },
    image: apiWebinar.cover_image_url || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop&auto=format&q=80',
    rating: apiWebinar.analytics?.average_rating || 4.8,
    reviewCount: apiWebinar.analytics?.total_reviews
      ? `${(apiWebinar.analytics.total_reviews / 1000).toFixed(1)}k`
      : '0',
    price: `$${parseFloat(apiWebinar.main_price).toFixed(2)}`,
    originalPrice: apiWebinar.original_price
      ? `$${parseFloat(apiWebinar.original_price).toFixed(2)}`
      : null,
    duration: apiWebinar.duration || 'N/A',
    level: apiWebinar.skill_level || 'All Levels',
    students: apiWebinar.total_students
      ? `${(apiWebinar.total_students / 1000).toFixed(1)}k`
      : '0',
    category: apiWebinar.category?.name || 'General',
    fullDate: `${month} ${day}, ${year}`,
    timeRange: timeString,
    scheduled_date: apiWebinar.scheduled_date
  };
};
  const filterOptions = useMemo(() => {
    const months = [...new Set(webinars.map(w => new Date(w.scheduled_date).toLocaleString('default', { month: 'long' })))];
    const instructors = [...new Set(webinars.map(w => w.instructor.name))];
    const categories = [...new Set(webinars.map(w => w.category))];
    return { months, instructors, categories };
  }, [webinars]);

  const handleMonthToggle = (month) => {
    setSelectedMonths(prev => 
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  const handleInstructorToggle = (instructor) => {
    setSelectedInstructors(prev => 
      prev.includes(instructor) ? prev.filter(i => i !== instructor) : [...prev, instructor]
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredWebinars = useMemo(() => {
    let filtered = webinars.filter(webinar => {
      const matchesSearch = searchQuery === '' || 
        webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webinar.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());

      const webinarMonth = new Date(webinar.scheduled_date).toLocaleString('default', { month: 'long' });
      const matchesMonth = selectedMonths.length === 0 || selectedMonths.includes(webinarMonth);
      
      const matchesInstructor = selectedInstructors.length === 0 || selectedInstructors.includes(webinar.instructor.name);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(webinar.category);

      return matchesSearch && matchesMonth && matchesInstructor && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.scheduled_date) - new Date(b.scheduled_date);
        case 'price-low':
          return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1));
        case 'price-high':
          return parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1));
        default:
          return 0;
      }
    });

    return filtered;
  }, [webinars, searchQuery, selectedMonths, selectedInstructors, selectedCategories, sortBy]);

  const totalPages = Math.ceil(filteredWebinars.length / itemsPerPage);
  const paginatedWebinars = filteredWebinars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMonths, selectedInstructors, selectedCategories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMonths([]);
    setSelectedInstructors([]);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedMonths.length > 0 || selectedInstructors.length > 0 || selectedCategories.length > 0;
  const activeFilterCount = [searchQuery, ...selectedMonths, ...selectedInstructors, ...selectedCategories].filter(Boolean).length;

  const handleApplyFilters = () => {
    setShowMobileDrawer(false);
  };

  // Filter Section Component
  const FilterSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Month Filter */}
      <div>
        <h4 className="font-bold text-[#093389] mb-3 flex items-center">
          <Icon name="Calendar" size={16} className="mr-2 text-[#0078d4]" />
          Month ({selectedMonths.length})
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {filterOptions.months.map((month) => (
            <label
              key={month}
              className="flex items-center p-2 rounded-lg hover:bg-[#f5f9ff] cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedMonths.includes(month)}
                onChange={() => handleMonthToggle(month)}
                className="w-4 h-4 text-[#0078d4] border-[#d6e6f7] rounded focus:ring-[#0078d4]"
              />
              <span className="ml-3 text-sm text-[#444444]">{month}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Instructor Filter */}
      <div>
        <h4 className="font-bold text-[#093389] mb-3 flex items-center">
          <Icon name="Users" size={16} className="mr-2 text-[#064ad4]" />
          Instructor ({selectedInstructors.length})
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {filterOptions.instructors.map((instructor) => (
            <label
              key={instructor}
              className="flex items-center p-2 rounded-lg hover:bg-[#f5f9ff] cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedInstructors.includes(instructor)}
                onChange={() => handleInstructorToggle(instructor)}
                className="w-4 h-4 text-[#064ad4] border-[#d6e6f7] rounded focus:ring-[#064ad4]"
              />
              <span className="ml-3 text-sm text-[#444444]">{instructor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-bold text-[#093389] mb-3 flex items-center">
          <Icon name="Folder" size={16} className="mr-2 text-[#004b8d]" />
          Category ({selectedCategories.length})
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {filterOptions.categories.map((category) => (
            <label
              key={category}
              className="flex items-center p-2 rounded-lg hover:bg-[#f5f9ff] cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-[#004b8d] border-[#d6e6f7] rounded focus:ring-[#004b8d]"
              />
              <span className="ml-3 text-sm text-[#444444]">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading && webinars.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]">
        <main className="pt-14 md:pt-16 lg:pt-20">
          <div className="bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#004b8d] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h1 className="text-4xl font-bold text-[#f5f9ff]">Live Compliance Training</h1>
              <p className="text-xl text-[#d9ecff] mt-2">Loading webinars...</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#0078d4]"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]">
        <main className="pt-14 md:pt-16 lg:pt-20">
          <div className="bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#004b8d] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h1 className="text-4xl font-bold text-[#f5f9ff]">Live Compliance Training</h1>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-[#093389] mb-2">Error Loading Webinars</h3>
              <p className="text-[#555555] mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]">
      <main className="pt-14 md:pt-16 lg:pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#004b8d] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] bg-clip-text text-transparent">
                Live Compliance Training
              </h1>
              <p className="text-xl text-[#d9ecff]">
                {filteredWebinars.length} upcoming webinars available
              </p>
            </motion.div>
          </div>
        </div>

        {/* PROGRESS BAR - Shows real-time loading */}
        {loading && webinars.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-[#d6e6f7] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-[#555555] mt-1">
              {Math.round(progress)}% loaded ({webinars.length}/{totalCount} webinars)
            </p>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Advanced Top Filters */}
          <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden border border-[#d6e6f7]">
            {/* Search and Filter Toggle */}
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999999]" />
                    <input
                      type="text"
                      placeholder="Search webinars by title or instructor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#d6e6f7] rounded-lg focus:ring-2 focus:ring-[#0078d4] focus:border-transparent text-[#093389] placeholder-[#999999]"
                    />
                  </div>
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => isMobile ? setShowMobileDrawer(true) : setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white rounded-lg hover:from-[#064ad4] hover:to-[#004b8d] transition-all duration-300 font-medium"
                >
                  <Icon name="Filter" size={18} />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-[#0078d4] px-2 py-0.5 rounded-full text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                  <Icon name={showFilters ? "ChevronUp" : "ChevronDown"} size={16} className="hidden md:block" />
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-[#d6e6f7] rounded-lg focus:ring-2 focus:ring-[#0078d4] focus:border-transparent text-[#093389]"
                >
                  <option value="date">Sort by Date</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Desktop Expandable Filter Section */}
            <AnimatePresence>
              {showFilters && !isMobile && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-[#d6e6f7] overflow-hidden"
                >
                  <div className="p-4 md:p-6 bg-gradient-to-r from-[#f5f9ff] to-[#e9eff5]">
                    <FilterSection />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="px-4 md:px-6 py-4 bg-[#f5f9ff] border-t border-[#d6e6f7]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-[#093389]">Active Filters:</span>
                  
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-[#d9ecff] text-[#004b8d] px-3 py-1 rounded-full text-xs font-medium">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-[#0078d4]">
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  )}
                  
                  {selectedMonths.map(month => (
                    <span key={month} className="inline-flex items-center gap-1 bg-[#e9eff5] text-[#004b8d] px-3 py-1 rounded-full text-xs font-medium">
                      📅 {month}
                      <button onClick={() => handleMonthToggle(month)} className="hover:text-[#0078d4]">
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                  
                  {selectedInstructors.map(instructor => (
                    <span key={instructor} className="inline-flex items-center gap-1 bg-[#d9ecff] text-[#004b8d] px-3 py-1 rounded-full text-xs font-medium">
                      👤 {instructor}
                      <button onClick={() => handleInstructorToggle(instructor)} className="hover:text-[#0078d4]">
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                  
                  {selectedCategories.map(category => (
                    <span key={category} className="inline-flex items-center gap-1 bg-[#e9eff5] text-[#004b8d] px-3 py-1 rounded-full text-xs font-medium">
                      📂 {category}
                      <button onClick={() => handleCategoryToggle(category)} className="hover:text-[#0078d4]">
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                  
                  <button
                    onClick={clearFilters}
                    className="ml-auto text-sm text-[#0078d4] hover:text-[#064ad4] font-medium underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showMobileDrawer && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                  onClick={() => setShowMobileDrawer(false)}
                />
                
                {/* Drawer */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 md:hidden shadow-xl flex flex-col"
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#d6e6f7] bg-gradient-to-r from-[#f5f9ff] to-[#e9eff5]">
                    <h3 className="font-bold text-lg text-[#093389] flex items-center">
                      <Icon name="Filter" size={20} className="mr-2 text-[#0078d4]" />
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowMobileDrawer(false)}
                      className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                      <Icon name="X" size={20} className="text-[#555555]" />
                    </button>
                  </div>
                  
                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <FilterSection />
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-4 border-t border-[#d6e6f7] bg-white space-y-2">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full py-3 px-4 bg-[#f5f9ff] text-[#093389] font-semibold rounded-lg hover:bg-[#e9eff5] transition-colors border border-[#d6e6f7]"
                      >
                        Clear All Filters
                      </button>
                    )}
                    <button
                      onClick={handleApplyFilters}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white font-bold rounded-lg hover:from-[#064ad4] hover:to-[#004b8d] transition-all shadow-lg"
                    >
                      Apply Filters ({activeFilterCount})
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#093389]">
              {filteredWebinars.length} Result{filteredWebinars.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {/* Webinars Grid */}
          {paginatedWebinars.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#d6e6f7]">
              <Icon name="Search" size={48} className="mx-auto text-[#999999] mb-4" />
              <h3 className="text-lg font-medium text-[#093389] mb-2">No webinars found</h3>
              <p className="text-[#555555] mb-4">Try adjusting your filters</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {paginatedWebinars.map((webinar, index) => {
                  const slug = generateSlug(webinar.title);
                  const webinarUrl = `/live-webinar/${webinar.webinarId}/${slug}`;
                  return (
                    <motion.div
                      key={webinar.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#0078d4]"
                    > 
                      <Link to={webinarUrl} className="block cursor-pointer">
                        {/* Image */}
                        <div className="relative overflow-hidden h-44">
                          <img
                            src={webinar.image}
                            alt={webinar.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#093389]/50 to-transparent" />
                          
                          {/* LIVE Badge */}
                          <div className="absolute top-3 left-3">
                            <motion.span
                              animate={{ 
                                boxShadow: ['0 0 10px rgba(0, 120, 212, 0.3)', '0 0 20px rgba(0, 120, 212, 0.6)', '0 0 10px rgba(0, 120, 212, 0.3)']
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="bg-[#0078d4] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                              LIVE
                            </motion.span>
                          </div>

                          {/* Date Badge */}
                          <div className="absolute top-3 right-3 bg-white rounded-lg p-2 shadow-lg border border-[#d6e6f7]">
                            <div className="text-xl font-black text-transparent bg-gradient-to-br from-[#0078d4] to-[#064ad4] bg-clip-text leading-none">{webinar.date}</div>
                            <div className="text-xs font-bold text-[#004b8d]">{webinar.month}</div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-[#093389] mb-2 line-clamp-2 text-sm leading-tight hover:text-[#0078d4] transition-colors h-10">
                            {webinar.title}
                          </h3>

                          {/* Instructor & Rating */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <img
                                src={webinar.instructor.avatar}
                                alt={webinar.instructor.name}
                                className="w-6 h-6 rounded-full object-cover border border-[#d6e6f7]"
                                loading="lazy"
                              />
                              <span className="text-xs text-[#555555] truncate">{webinar.instructor.name}</span>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Icon name="Star" size={12} className="text-yellow-400 fill-current" />
                              <span className="text-xs font-bold text-[#004b8d]">{webinar.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-[#555555] mb-3 bg-[#f5f9ff] rounded-lg p-2 border border-[#d6e6f7]">
                            <div className="flex items-center gap-1">
                              <Icon name="Clock" size={12} className="text-[#0078d4]" />
                              <span className="font-medium">{webinar.duration} min</span>
                            </div>
                          </div>

                          {/* Session Info */}
                          <div className="bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] rounded-lg p-2.5 mb-3 border border-[#d6e6f7]">
                            <div className="text-xs text-[#004b8d] font-semibold mb-1">{webinar.fullDate}</div>
                            <div className="text-xs text-[#0078d4] flex items-center gap-1">
                              <Icon name="Clock" size={10} />
                              {webinar.timeRange}
                            </div>
                          </div>

                          {/* Pricing & CTA */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-transparent bg-gradient-to-r from-[#0078d4] to-[#064ad4] bg-clip-text">
                                {webinar.price}
                              </span>
                              {webinar.originalPrice && (
                                <span className="text-xs text-[#999999] line-through">{webinar.originalPrice}</span>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Link
                                to={webinarUrl}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white font-bold py-2 px-4 rounded-lg text-xs hover:shadow-lg hover:shadow-[#0078d4]/50 transition-all flex items-center gap-1"
                              >
                                Join Now
                                <Icon name="ArrowRight" size={12} />
                              </Link>
                            </motion.button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Pagination */}
          {/* Option 3: Dropdown Selector with Progress */}
{totalPages > 1 && (
  <div className="flex flex-col items-center space-y-4 mt-12 pt-8">
    {/* Progress bar */}
    <div className="w-64 h-1 bg-[#d6e6f7] rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-[#0078d4] to-[#064ad4] rounded-full transition-all duration-300"
        style={{ width: `${(currentPage / totalPages) * 100}%` }}
      />
    </div>
    
    <div className="flex items-center justify-between w-full max-w-md">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="text-[#093389] border-[#d6e6f7] hover:bg-[#f5f9ff]"
      >
        <Icon name="ChevronLeft" size={16} className="mr-1" />
        
      </Button>
      
     <div className="flex items-center space-x-2">
  <span className="text-sm text-[#555555]">Page</span>
  <div className="relative">
    <select
      value={currentPage}
      onChange={(e) => setCurrentPage(parseInt(e.target.value))}
      className="px-3 py-2 border border-[#d6e6f7] rounded-lg text-[#093389] font-medium focus:ring-2 focus:ring-[#0078d4] focus:border-transparent bg-white appearance-none pr-8"
      style={{
        WebkitAppearance: 'none',
        MozAppearance: 'none'
      }}
    >
      {Array.from({ length: totalPages }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
    
  </div>
  <span className="text-sm text-[#555555]">of {totalPages}</span>
</div>
      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="text-[#093389] border-[#d6e6f7] hover:bg-[#f5f9ff]"
      >
        
        <Icon name="ChevronRight" size={16} className="ml-1" />
      </Button>
    </div>
    
    {/* Quick page indicators */}
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((num) => {
        const pageNum = Math.min(
          Math.max(1, currentPage - 2 + num),
          totalPages
        );
        
        if (num === 1 && pageNum > 1) {
          return (
            <button
              key="first"
              onClick={() => setCurrentPage(1)}
              className="w-8 h-8 rounded-lg text-xs font-medium bg-white border border-[#d6e6f7] text-[#093389] hover:bg-[#f5f9ff]"
            >
              1
            </button>
          );
        }
        
        if (num === 5 && pageNum < totalPages) {
          return (
            <button
              key="last"
              onClick={() => setCurrentPage(totalPages)}
              className="w-8 h-8 rounded-lg text-xs font-medium bg-white border border-[#d6e6f7] text-[#093389] hover:bg-[#f5f9ff]"
            >
              {totalPages}
            </button>
          );
        }
        
        if (pageNum > 1 && pageNum < totalPages) {
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                currentPage === pageNum
                  ? 'bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white shadow-md'
                  : 'bg-white border border-[#d6e6f7] text-[#093389] hover:bg-[#f5f9ff]'
              }`}
            >
              {pageNum}
            </button>
          );
        }
        
        return null;
      })}
    </div>
  </div>
)}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default LiveWebinarsPage;