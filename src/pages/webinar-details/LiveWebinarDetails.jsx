import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { useAuth } from 'contexts/AuthContext';
import { ToastContext } from 'contexts/ToastContext';
import { useCart } from 'contexts/CartContext';
import SpeakerCard from './components/SpeakerCard';
import WebinarHeader from './components/WebinarHeader';
import WebinarDescription from './components/WebinarDescription';
import axiosInstance from 'config/axiosInstance';

const WebinarDetails = () => {
  const navigate = useNavigate();
  const { webinar_id } = useParams();
  const location = useLocation();
  const { showToast } = useContext(ToastContext);
  const { user, isAuthenticated, token } = useAuth();
  const userRole = user?.role || 'attendee';
  const { addToCart, items: cartItems } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    liveOne: true,
    liveGroup: false,
    recordedOne: false,
    recordedGroup: false,
    comboOne: false,
    comboGroup: false
  });
  const [webinar, setWebinar] = useState(null);
  const [duplicating, setDuplicating] = useState(false);

  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/instructor';
      default:
        return '/webinars';
    }
  };

 const transformWebinarData = (webinarData, isAuthenticated = false) => {
  const utcDate = new Date(webinarData.scheduled_date);

  // Convert UTC → IST
  const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

  // Helper to format 12h time
  const format12h = (date) => {
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
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
  const pstDate = istDate; // IST to PST (using IST as base)
  const estDate = new Date(istDate.getTime() + 3 * 60 * 60 * 1000); // PST + 3h

  const pstTime = format12h(pstDate);
  const estTime = format12h(estDate);
  
  const pacificTz = getPacificTimezone(pstDate);
  const easternTz = getEasternTimezone(estDate);
  
  const combinedTime = `${pstTime} ${pacificTz} | ${estTime} ${easternTz}`;
  
  const formattedDate = istDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return {
    webinarId: webinarData.webinar_id,
    id: webinarData.id,
    title: webinarData.title,
    description: webinarData.description,
    date: formattedDate,
    time: combinedTime,
    duration: `${webinarData.duration} minutes`,
    timezone: webinarData.timezone,
    status: webinarData.status || 'scheduled',
    instructor: {
      name: webinarData.speaker?.full_name,
      avatar: webinarData.speaker?.avatar || '/default-avatar.png',
      title: webinarData.speaker?.title || 'Expert',
      bio: webinarData.speaker?.bio || 'Experienced professional in the field.',
      webinar: webinarData.speaker?.total_sessions || 0,
      company: webinarData.speaker?.company || null,
      id: webinarData.speaker?.id
    },
    overview: webinarData.description,
    videoThumbnail: webinarData.cover_image_url || '/default-webinar-thumbnail.jpg',
    preview: webinarData.cover_image_url || '/default-webinar-thumbnail.jpg',
    pricing: {
      live: {
        oneParticipant: parseFloat(webinarData.applicable_prices?.live_single || 0),
        groupAttendees: parseFloat(webinarData.applicable_prices?.live_multi || 0)
      },
      recorded: {
        oneParticipant: parseFloat(webinarData.applicable_prices?.recorded_single || 0),
        groupAttendees: parseFloat(webinarData.applicable_prices?.recorded_multi || 0)
      },
      combo: {
        oneParticipant: {
          price: parseFloat(webinarData.applicable_prices?.combo_single || 0),
          originalPrice: parseFloat(webinarData.applicable_prices?.live_single || 0) +
            parseFloat(webinarData.applicable_prices?.recorded_single || 0)
        },
        groupAttendees: {
          price: parseFloat(webinarData.applicable_prices?.combo_multi || 0),
          originalPrice: parseFloat(webinarData.applicable_prices?.live_multi || 0) +
            parseFloat(webinarData.applicable_prices?.recorded_multi || 0)
        }
      }
    },
    enrollment: {
      enrolled: webinarData.enrolled_count || 0,
      maxAttendees: webinarData.max_attendees,
      hasLimit: webinarData.has_enrollment_limit,
      availableSpots: webinarData.available_spots
    },
    webinarType: webinarData.webinar_type || 'live',
    zoomLink: webinarData.zoom_webinar_link,
    recordingLinks: webinarData.recording_links || [],
    isUpcoming: webinarData.is_upcoming || false,
    isLiveNow: webinarData.is_live_now || false,
    isCompleted: webinarData.is_completed || false,
    hasFullAccess: isAuthenticated && webinarData.can_access_webinar === true,
    canJoinLive: isAuthenticated && (webinarData.can_access_webinar === true || webinarData.zoom_access?.can_join === true),
    needsToEnroll: !isAuthenticated || webinarData.can_access_webinar !== true,
    is_free: webinarData.is_free || false,
    enrolledCount: webinarData.enrolled_count || 0,
    maxAttendees: webinarData.max_attendees,
    hasEnrollmentLimit: webinarData.has_enrollment_limit || false,
    availableSpots: webinarData.available_spots,
    isFull: webinarData.is_full || false,
    zoom_access: {
      can_join: webinarData.zoom_access?.can_join || false,
      can_start: webinarData.zoom_access?.can_start || false,
      join_url: webinarData.zoom_access?.join_url || null,
      start_url: webinarData.zoom_access?.start_url || null,
      message: webinarData.zoom_access?.message || 'Enrollment required'
    },
    user_enrollment_status: webinarData.user_enrollment_status,
    user_context: webinarData.user_context || {},
    isOwner: webinarData.user_context?.is_owner || false,
    isAdmin: webinarData.user_context?.is_admin || false,
    isAvailable: webinarData.status === 'scheduled' || webinarData.status === 'available',
    rawData: webinarData
  };
};
  const handleDuplicateWebinar = () => {
    if (!webinar?.rawData) {
      showToast('Cannot duplicate: webinar data not available', 'error');
      return;
    }

    try {
      const basePath = userRole === 'admin' ? '/admin' : '/instructor';
      
      navigate(`${basePath}/create`, {
        state: {
          duplicateFrom: webinar_id,
          duplicateData: webinar.rawData,
          fromDetails: true
        }
      });
      setDuplicating(true);
      showToast(`Opening duplicate editor for "${webinar.title}"...`, 'info');
    } catch (error) {
      console.error('Error preparing duplicate:', error);
      showToast('Failed to prepare duplicate', 'error');
    }
  };

  const getAdminQuickActions = () => {
    if (userRole !== 'admin' && userRole !== 'instructor') return null;

    const baseEditPath = userRole === 'admin' ? '/admin/' : '/instructor/';
    const dashboardPath = getRedirectPath(userRole);

    return (
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(dashboardPath)}
          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#f5f9ff] to-[#e9eff5] hover:from-[#d9ecff] hover:to-[#f5f9ff] border border-[#d6e6f7] hover:border-[#0078d4] rounded-lg sm:rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Icon name="ArrowLeft" size={12} className="sm:w-4 sm:h-4 text-[#093389]" />
          <span className="font-medium text-[#093389]">Dashboard</span>
        </Button>

        {(userRole === 'admin' || (userRole === 'instructor' && webinar?.instructor?.id === user?.id)) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`${baseEditPath}edit-webinar/${webinar_id}`, {
              state: { fromDetails: true }
            })}
            className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#d9ecff] to-[#f5f9ff] hover:from-[#d9ecff] hover:to-[#e9eff5] border-2 border-[#0078d4] hover:border-[#064ad4] rounded-lg sm:rounded-xl transition-all duration-300 text-[#0078d4] hover:text-[#064ad4] shadow-sm hover:shadow-md"
          >
            <Icon name="Edit" size={12} className="sm:w-4 sm:h-4" />
            <span className="font-medium">Edit</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleDuplicateWebinar}
          disabled={duplicating}
          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#e9eff5] to-[#f5f9ff] hover:from-[#d9ecff] hover:to-[#e9eff5] border-2 border-[#064ad4] hover:border-[#004b8d] rounded-lg sm:rounded-xl transition-all duration-300 text-[#064ad4] hover:text-[#004b8d] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {duplicating ? (
            <>
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-[#064ad4] border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Duplicating...</span>
            </>
          ) : (
            <>
              <Icon name="Copy" size={12} className="sm:w-4 sm:h-4" />
              <span className="font-medium">Duplicate</span>
            </>
          )}
        </Button>

        {userRole === 'admin' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/webinars', {
              state: { highlightWebinar: webinar_id }
            })}
            className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#f5f9ff] to-[#e9eff5] hover:from-[#e9eff5] hover:to-[#f5f9ff] border-2 border-[#093389] hover:border-[#004b8d] rounded-lg sm:rounded-xl transition-all duration-300 text-[#093389] hover:text-[#004b8d] shadow-sm hover:shadow-md"
          >
            <Icon name="Settings" size={12} className="sm:w-4 sm:h-4" />
            <span className="font-medium">Manage</span>
          </Button>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchWebinarData = async () => {
      try {
        setLoading(true);
        setError(null);

        const webinarFromState = location.state?.webinar;
        if (webinarFromState) {
          const transformedWebinar = transformWebinarData(webinarFromState);
          setWebinar(transformedWebinar);
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/webinars/${webinar_id}/`);
        const apiData = response.data;

        if (apiData.webinar_type !== 'live') {
          showToast('This is not a live webinar', 'warning');
          navigate(`/recorded-webinar/${webinar_id}`);
          return;
        }

        const transformedData = transformWebinarData(apiData);
        setWebinar(transformedData);

        if (transformedData.hasFullAccess) {
          showToast(`You're enrolled in "${transformedData.title}"`, 'success');
        } else if (isAuthenticated) {
          showToast('Enroll to join this live webinar', 'info');
        } else {
          showToast('Sign in to check your enrollment status', 'info');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please sign in to access full webinar details');
        } else if (err.response?.status === 404) {
          setError('Live webinar not found');
        } else {
          setError('Failed to load live webinar');
        }
      } finally {
        setLoading(false);
      }
    };

    if (webinar_id) {
      fetchWebinarData();
    } else {
      setError('No webinar ID provided in URL');
      setLoading(false);
    }
  }, [webinar_id, location.state?.webinar, navigate, showToast, isAuthenticated, token]);

  const isValidSelection = () => {
    return Object.values(selectedOptions).some(option => option === true);
  };

  const calculateTotal = () => {
    if (!webinar?.pricing) return 0;

    if (selectedOptions.liveOne) return webinar.pricing.live.oneParticipant;
    if (selectedOptions.liveGroup) return webinar.pricing.live.groupAttendees;
    if (selectedOptions.recordedOne) return webinar.pricing.recorded.oneParticipant;
    if (selectedOptions.recordedGroup) return webinar.pricing.recorded.groupAttendees;
    if (selectedOptions.comboOne) return webinar.pricing.combo.oneParticipant.price;
    if (selectedOptions.comboGroup) return webinar.pricing.combo.groupAttendees.price;
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#d6e6f7] p-12 max-w-md mx-4"
        >
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#0078d4] border-t-transparent mx-auto mb-8" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#093389] to-[#0078d4] bg-clip-text text-transparent mb-3">
            Loading Compliance Training...
          </h2>
          <p className="text-[#555555]">{isAuthenticated ? 'Checking your enrollment...' : 'Loading details...'}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-red-50 to-[#e9eff5]">
        <div className="flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm sm:max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#d6e6f7] p-8 sm:p-12"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border-4 border-red-200">
              <Icon name="AlertCircle" size={40} className="sm:w-12 sm:h-12 text-red-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#093389] mb-3 sm:mb-4">
              {error === 'Webinar not found' ? 'Webinar Not Found' : 'Something Went Wrong'}
            </h2>
            <p className="text-sm sm:text-lg text-[#555555] leading-relaxed mb-6 sm:mb-8">
              {error || "We couldn't find the webinar you're looking for. It may have been moved or is temporarily unavailable."}
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-[#0078d4] to-[#064ad4] hover:from-[#064ad4] hover:to-[#004b8d] text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Icon name="RefreshCw" size={18} className="sm:w-5 sm:h-5 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/webinars/live')}
                className="w-full border-2 border-[#d6e6f7] hover:border-[#0078d4] text-[#093389] hover:text-[#0078d4] font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300"
              >
                <Icon name="ArrowLeft" size={18} className="sm:w-5 sm:h-5 mr-2" />
                Back to Webinars
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-red-50 to-[#e9eff5]">
        <div className="flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm sm:max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#d6e6f7] p-8 sm:p-12"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f5f9ff] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border-4 border-[#d6e6f7]">
              <Icon name="Search" size={40} className="sm:w-12 sm:h-12 text-[#555555]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#093389] mb-3 sm:mb-4">Webinar Not Found</h2>
            <p className="text-sm sm:text-lg text-[#555555] leading-relaxed mb-6 sm:mb-8">
              The webinar you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate('/webinars/live')}
              className="w-full bg-gradient-to-r from-[#0078d4] to-[#064ad4] hover:from-[#064ad4] hover:to-[#004b8d] text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Icon name="ArrowLeft" size={18} className="sm:w-5 sm:h-5 mr-2" />
              Back to Webinars
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-white to-[#e9eff5]">
      <main className="pt-12 sm:pt-14 md:pt-16 lg:pt-20">
        <WebinarHeader webinar={webinar} isAuthenticated={isAuthenticated} userRole={userRole} />

        {webinar?.description && (
          <WebinarDescription
            description={webinar.description}
            webinar={webinar}
            pricing={webinar.pricing}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            cartItems={cartItems}
            navigate={navigate}
            isValidSelection={isValidSelection}
            getAdminQuickActions={getAdminQuickActions}
          />
        )}

        {(webinar?.instructor || true) && <SpeakerCard instructor={webinar?.instructor} />}
      </main>
    </div>
  );
};

export default WebinarDetails;