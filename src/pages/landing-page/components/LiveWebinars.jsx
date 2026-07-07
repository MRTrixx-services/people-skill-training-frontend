import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import axiosInstance from 'config/axiosInstance';

const LiveWebinars = ({ onEnrollClick }) => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const webinarsResponse = await axiosInstance.get('/webinars/upcoming/');
      const webinarsData = webinarsResponse.data.results || webinarsResponse.data;
      const transformedWebinars = Array.isArray(webinarsData)
        ? webinarsData.map(transformWebinarData).slice(0, 6)
        : [];
      setWebinars(transformedWebinars);
      setError(null);
    } catch (err) {
      console.error('Error fetching webinars:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load webinars');
      setWebinars([]);
    } finally {
      setLoading(false);
    }
  };

  const transformWebinarData = (apiWebinar) => {
    const utcDate = new Date(apiWebinar.scheduled_date);

    // Convert UTC to IST
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const month = months[istDate.getUTCMonth()];
    const day = istDate.getUTCDate();
    const year = istDate.getUTCFullYear();

    // Helper to format hours/minutes into 12h format
    const format12h = (date) => {
      let hours = date.getUTCHours();
      const minutes = date.getUTCMinutes().toString().padStart(2,'0');
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    };

    const pstTime = format12h(istDate) + ' PST';
    const estTime = format12h(new Date(istDate.getTime() + 3*60*60*1000)) + ' EST';
    const timeString = `${pstTime} | ${estTime}`;

    return {
      id: apiWebinar.id,
      webinarId: apiWebinar.webinar_id,
      title: apiWebinar.title,
      date: day.toString(),
      month: month.toUpperCase(),
      instructor: {
        name: apiWebinar.speaker?.user?.full_name || apiWebinar.speaker?.name || 'Instructor',
        avatar: apiWebinar.speaker?.user?.avatar || apiWebinar.speaker?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format&q=60'
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
      level: apiWebinar.level || 'All Levels',
      students: apiWebinar.total_students
        ? `${(apiWebinar.total_students / 1000).toFixed(1)}k`
        : '0',
      bestseller: apiWebinar.is_bestseller || false,
      category: apiWebinar.category?.name || 'General',
      tags: apiWebinar.tags || ['Live Session'],
      fullDate: `${month} ${day}, ${year}`,
      timeRange: timeString
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleViewAllCourses = () => {
    onEnrollClick && onEnrollClick(null);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={12}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-[#d6e6f7]'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#0078d4]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 font-semibold">Unable to load webinars</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchWebinars}
              className="mt-4 px-4 py-2 bg-[#0078d4] text-white rounded-lg hover:bg-[#064ad4] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] rounded-full border border-[#d6e6f7] text-sm mb-6">
            <Icon name="Video" size={16} className="text-[#004b8d]" />
            <span className="font-semibold text-[#004b8d]">Live Compliance Training</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-[#093389] via-[#064ad4] to-[#0078d4] bg-clip-text text-transparent">
              Upcoming Live Webinars
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#444444] max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Join interactive compliance training sessions with industry experts. Get certified, 
            and stay compliant while mastering regulatory requirements.
          </p>

          <motion.button
            onClick={handleViewAllCourses}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0078d4] via-[#064ad4] to-[#004b8d] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#0078d4]/30"
          >
            View All Training Sessions
            <Icon name="ArrowRight" size={18} />
          </motion.button>
        </motion.div>

        {/* Webinars Grid - 3 Columns, Max 6 Items */}
        {webinars.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {webinars.map((webinar) => (
              <motion.div
                key={webinar.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                onHoverStart={() => setHoveredCard(webinar.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group border-2 border-transparent hover:border-[#d6e6f7]"
                onClick={() => onEnrollClick && onEnrollClick(webinar)}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-44">
                  <img
                    src={webinar.image}
                    alt={webinar.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#093389]/50 to-transparent" />

                  {/* Compact Badge Layout */}
                  <div className="absolute top-3 left-3 flex gap-2">
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

                  {/* Compact Date Badge */}
                  <div className="absolute top-3 right-3 bg-white rounded-lg p-2 shadow-lg border border-[#d6e6f7]">
                    <div className="text-xl font-black text-transparent bg-gradient-to-br from-[#0078d4] to-[#064ad4] bg-clip-text leading-none">{webinar.date}</div>
                    <div className="text-xs font-bold text-[#004b8d]">{webinar.month}</div>
                  </div>
                </div>

                {/* Compact Content Section */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-bold text-[#093389] mb-2 line-clamp-2 text-sm leading-tight group-hover:text-[#0078d4] transition-colors h-10">
                    {webinar.title}
                  </h3>

                  {/* Inline Instructor & Rating */}
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

                  {/* Compact Meta Info */}
                  <div className="flex items-center justify-between text-xs text-[#555555] mb-3 bg-[#f5f9ff] rounded-lg p-2 border border-[#d6e6f7]">
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={12} className="text-[#0078d4]" />
                      <span className="font-medium">{webinar.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={12} className="text-[#064ad4]" />
                      <span className="font-medium">{webinar.students}</span>
                    </div>
                  </div>

                  {/* Compact Session Info */}
                  <div className="bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] rounded-lg p-2.5 mb-3 border border-[#d6e6f7]">
                    <div className="text-xs text-[#004b8d] font-semibold mb-1">{webinar.fullDate}</div>
                    <div className="text-xs text-[#0078d4] flex items-center gap-1">
                      <Icon name="Clock" size={10} />
                      {webinar.timeRange}
                    </div>
                  </div>

                  {/* Compact Pricing & CTA */}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnrollClick && onEnrollClick(webinar);
                      }}
                      className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white font-bold py-2 px-4 rounded-lg text-xs hover:shadow-lg hover:shadow-[#0078d4]/50 transition-all flex items-center gap-1"
                    >
                      Join Now
                      <Icon name="ArrowRight" size={12} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#d9ecff] to-[#f5f9ff] rounded-full mb-4 border border-[#d6e6f7]">
              <Icon name="Calendar" size={32} className="text-[#004b8d]" />
            </div>
            <p className="text-[#444444] text-lg font-medium">No upcoming webinars available</p>
            <p className="text-[#555555] text-sm mt-2">Check back soon for new training sessions</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveWebinars;