import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { Link } from 'react-router-dom';

const formatPrice = (price) => price > 0 ? `$${price.toFixed(2)}` : 'Free';

// Grid View Card Component
const WebinarCardGrid = ({ webinar, onEnroll,  index,webinarUrl }) => {
  const webinarDate = new Date(webinar.date);
  const date = webinarDate.getDate();
  const month = webinarDate.toLocaleString('default', { month: 'short' });

  const isRecorded = webinar.webinarType === 'recorded' || webinar.type === 'recorded';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl w-auto shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      
        {/* Image with Date Badge */}
        <div className="relative">
          <img 
            className="w-full h-52 object-fill" 
            src={webinar.image} 
            alt={webinar.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80';
            }}
          />
          {!isRecorded && (
            <div className="absolute left-3 -bottom-11">
              <div className="rounded-full shadow-xl bg-blue-100 border-4 border-white w-24 h-24 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-blue-700">{date}</span>
                <span className="font-medium text-blue-700">{month}</span>
              </div>
            </div>
          )}
          {isRecorded && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                📹 ON-DEMAND
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`${isRecorded ? 'pt-6' : 'pt-14'} pb-6 px-6`}>
          <Link to={webinarUrl} className="block">
          <h3 className="font-bold text-base text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2 min-h-[3rem]">
            {webinar.title}
          </h3>
</Link>
          {/* Instructor with Avatar */}
          <div className="mb-3">
            <div className="flex flex-row items-center justify-between gap-3 mb-2">
              <div className="space-y-3 items-center gap-3">
                <div className="flex justify-between items-center gap-3">
                  <span className="font-medium text-gray-700 text-md flex items-center gap-1">
                    <Icon name="User" className="inline w-4 h-4 mr-1 text-gray-500" />
                    {webinar.instructor.name}
                  </span>
                  <div className="flex-shrink-0"></div>
                </div>
                
                <div className="flex items-center gap-2 font-medium text-gray-700 mb-3">
                  <Icon name="Hourglass" className="inline w-4 h-4 text-purple-600" />
                  <span>{webinar.duration}</span>
                </div>

                {/* {!isRecorded && webinar.time && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Icon name="Clock" className="inline w-4 h-4 mt-0.5 text-blue-800 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-tight break-words">
                        {webinar.time}
                      </div>
                    </div>
                  </div>
                )} */}
              </div>

              <div className="flex-shrink-0">
                <img
                  src={webinar.instructor.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'}
                  alt={webinar.instructor.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm mb-2 justify-center">
            {isRecorded && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-green-600">🎥</span>
                <span className="text-sm font-medium text-green-700">Available 24/7</span>
              </div>
            )}
          </div>

          {/* Price and Button */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-2xl font-extrabold text-blue-700">
              {formatPrice(webinar.price)}
            </span>
            <div>
              
            </div>
                  <Link to={webinarUrl} className="block">
    
              <button
//               onClick={onEnroll}
              className="ml-auto py-2 px-6 rounded-lg font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors duration-200"
            >
              Details
            </button>
            </Link>
          </div>
        </div>
   
    </motion.div>
  );
};

// List View Card Component
const WebinarCardList = ({ webinar,onEnroll, index ,webinarUrl}) => {
  const webinarDate = new Date(webinar.date);
  const date = webinarDate.getDate();
  const month = webinarDate.toLocaleString('default', { month: 'short' });

  const isRecorded = webinar.webinar_type === 'recorded' || webinar.type === 'recorded';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="flex w-full rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
        {/* Image Section with Date Badge */}
        <div className="relative w-96 min-h-[160px] flex-shrink-0">
          <img 
            className="object-fill w-full h-full" 
            src={webinar.image} 
            alt={webinar.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80';
            }}
          />
          {!isRecorded && (
            <div className="absolute left-3 top-3">
              <div className="rounded-full shadow-xl bg-blue-100 border-4 border-white w-20 h-20 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-700">{date}</span>
                <span className="font-medium text-blue-700 text-sm">{month}</span>
              </div>
            </div>
          )}
          {isRecorded && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                📹 ON-DEMAND
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between p-6">
          <div>
            <Link to={webinarUrl} className="flex w-full">
      
            <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 cursor-pointer hover:text-blue-600">
              {webinar.title}
            </h3>
  </Link>
            {/* Instructor with Avatar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className='flex-1 min-w-0 space-y-3'>
                <div className="font-medium flex items-center text-gray-700">
                  <Icon name="User" className="inline w-4 h-4 mr-1 text-gray-500" />
                  {webinar.instructor.name}
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Icon name="Hourglass" className="inline w-4 h-4 text-purple-600" />
                  <span className="text-sm">{webinar.duration}</span>
                </div>

                {!isRecorded && webinar.time && (
                  <div className="flex items-start gap-2 text-gray-600 text-sm">
                    <Icon name="Clock" className="inline w-4 h-4 mt-0.5 text-blue-800 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm leading-tight break-words block">
                        {webinar.time}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-blue-700">
                    {formatPrice(webinar.price)}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 flex flex-col items-center space-y-4">
                <img
                  src={webinar.instructor.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'}
                  alt={webinar.instructor.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80';
                  }}
                />
                <div className="flex items-start gap-4 mb-4 flex-wrap">
                  <Link to={webinarUrl} className="block">
    
              <button
//               onClick={onEnroll}
              className="ml-auto py-2 px-6 rounded-lg font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors duration-200"
            >
              Details
            </button>
            </Link>
                </div>
              </div>
            </div>

            {/* Time Info */}
            <div className="space-y-2">
              {isRecorded && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">🎥</span>
                  <span className="font-medium text-green-700">Watch Anytime - Available 24/7</span>
                </div>
              )}
            </div>
          </div>
        </div>
    
    </motion.div>
  );
};

// Main Webinar Card Component
const UdemyWebinarCard = ({ webinar, viewMode, index, isMobile, onEnroll }) => {
  const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};
const slug = generateSlug(webinar.title);
const webinarUrl = `/recorded-webinar/${webinar.webinarId}/${slug}`;
  if (isMobile) {
    return <WebinarCardGrid webinar={webinar} onEnroll={onEnroll} index={index} webinarUrl={webinarUrl} />;
  }


  if (viewMode === 'list') {
    return <WebinarCardList webinar={webinar} onEnroll={onEnroll} index={index}  webinarUrl={webinarUrl} />;
  }


  return <WebinarCardGrid webinar={webinar} onEnroll={onEnroll} index={index}  webinarUrl={webinarUrl}/>;
};

export default UdemyWebinarCard;
