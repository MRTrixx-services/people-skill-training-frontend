import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { useAuth } from 'contexts/AuthContext';
import { ToastContext } from 'contexts/ToastContext';
import { useCart } from 'contexts/CartContext';
import WebinarHeader from './components/WebinarHeader';
import WebinarDescription from './components/WebinarDescription';
import SpeakerCard from './components/SpeakerCard';
import axiosInstance from 'config/axiosInstance';

const RecordedWebinarDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { showToast } = useContext(ToastContext);
  
  const { user, isAuthenticated, token } = useAuth();
  const userRole = user?.role || 'attendee';
   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webinar, setWebinar] = useState(null);
  const [accessing, setAccessing] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, items: cartItems } = useCart();

  const [selectedOptions, setSelectedOptions] = useState({
    recordedOne: true,
    recordedGroup: false
  });
  
  const [duplicating, setDuplicating] = useState(false);

  const handleDuplicateWebinar = () => {
    if (!webinar?.rawData) {
      showToast('Cannot duplicate: webinar data not available', 'error');
      return;
    }

    try {
      const basePath = userRole === 'admin' ? '/admin' : '/instructor';
      
      navigate(`${basePath}/create`, {
        state: {
          duplicateFrom: id,
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
          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-cyan-50 hover:to-teal-50 border border-gray-200 hover:border-cyan-300 rounded-lg sm:rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Icon name="ArrowLeft" size={12} className="sm:w-4 sm:h-4" />
          <span className="font-medium">Dashboard</span>
        </Button>

        {(userRole === 'admin' || (userRole === 'instructor' && webinar?.instructor?.id === user?.id)) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`${baseEditPath}edit-webinar/${id}`, {
              state: { fromDetails: true }
            })}
            className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 border-2 border-cyan-200 hover:border-cyan-300 rounded-lg sm:rounded-xl transition-all duration-300 text-cyan-700 hover:text-cyan-800 shadow-sm hover:shadow-md"
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
          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border-2 border-teal-200 hover:border-teal-300 rounded-lg sm:rounded-xl transition-all duration-300 text-teal-700 hover:text-teal-800 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {duplicating ? (
            <>
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
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
              state: { highlightWebinar: id }
            })}
            className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 border-2 border-slate-200 hover:border-slate-300 rounded-lg sm:rounded-xl transition-all duration-300 text-slate-700 hover:text-slate-800 shadow-sm hover:shadow-md"
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
        
        const response = await axiosInstance.get(`/webinars/${id}/`);
        const apiData = response.data;
        
        if (apiData.webinar_type !== 'recorded') {
          showToast('This is not a recorded webinar', 'warning');
          navigate(`/live-webinar/${id}`);
          return;
        }
        
        const transformedData = transformApiData(apiData);
        setWebinar(transformedData);
        
        if (transformedData.hasFullAccess) {
          showToast(`Welcome back! You have access to "${transformedData.title}"`, 'success');
        } else if (isAuthenticated) {
          showToast('Purchase access to watch this recorded webinar', 'info');
        } else {
          showToast('Sign in to check your access status', 'info');
        }
        
      } catch (err) {
        console.error('❌ Error fetching webinar:', err);
        
        if (err.response?.status === 401) {
          setError('Please sign in to access full webinar details');
          showToast('Please sign in for complete access', 'warning');
        } else if (err.response?.status === 404) {
          setError('Recorded webinar not found');
          showToast('Webinar not found', 'error');
        } else if (err.response?.status === 403) {
          setError('Access denied to this webinar');
          showToast('Access denied', 'error');
        } else {
          setError('Failed to load recorded webinar');
          showToast('Failed to load webinar details', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWebinarData();
    }
  }, [id, navigate, showToast, isAuthenticated, token]);

  const durationOptions = [
    { value: '60', label: '1 hour' },
    { value: '75', label: '1.25 hours' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' },
    { value: '240', label: '4 hours' },
    { value: '360', label: '6 hours' },
    { value: 'custom', label: 'Custom duration' }
  ];

  const getDurationLabel = (durationValue, rawMinutes) => {
  if (!durationValue) return '60 Minutes';

  if (durationValue === 'custom') {
    return `${rawMinutes} Minutes`;
  }

  const option = durationOptions.find(
    opt => opt.value === durationValue
  );

  return option ? option.label : `${durationValue} Minutes`;
};

const calculateDurationFromRecording = (recordingDurationMinutes) => {
  if (
    recordingDurationMinutes === null ||
    recordingDurationMinutes === undefined ||
    isNaN(recordingDurationMinutes) ||
    recordingDurationMinutes <= 0
  ) {
    return null;
  }

  const predefinedDurations = durationOptions
    .filter(opt => opt.value !== 'custom')
    .map(opt => parseInt(opt.value, 10))
    .sort((a, b) => a - b);

  // Find the smallest duration that can contain the recording
  for (const duration of predefinedDurations) {
    if (recordingDurationMinutes <= duration) {
      return duration.toString();
    }
  }

  // If recording exceeds all predefined values
  return 'custom';
};

  const transformApiData = (apiData) => {
    const applicablePrices = apiData.applicable_prices || {};
        const rawDurationMinutes =
    apiData.duration ||
    apiData.recording_duration ||
    apiData.duration_minutes ||
    null;

  const calculatedDuration = calculateDurationFromRecording(rawDurationMinutes);
 
    return {
      id: apiData.id,
      webinarId: apiData.webinar_id,
      title: apiData.title,
      status: apiData.status,
      display_status: apiData.display_status,
      webinar_type: apiData.webinar_type,
      webinarType: apiData.webinar_type,
      
      platform_prices: apiData.platform_prices,
      applicable_prices: apiData.applicable_prices,
      current_platform: apiData.current_platform,
      main_price: apiData.main_price,
      is_free: apiData.is_free,
      
      recordedDate: apiData.created_at ? formatDate(apiData.created_at) : 'Recently',
      originalDate: apiData.scheduled_date ? formatDate(apiData.scheduled_date) : 'N/A',
      originalTime: apiData.scheduled_date ? formatTime(apiData.scheduled_date, apiData.timezone) : 'N/A',
      // duration: apiData.duration ? `${apiData.duration} Minutes` : 'Variable Length',
       duration: getDurationLabel(calculatedDuration, rawDurationMinutes),
    durationValue: calculatedDuration,
  rawDurationMinutes,

      description: apiData.description || '',
      overview: apiData.description || 'This recorded webinar provides comprehensive training on the topic.',
      
      instructor: {
        name: apiData.speaker?.full_name,
        avatar: apiData.speaker?.avatar || '/default-avatar.png',
        title: apiData.speaker?.title || 'Expert',
        bio: apiData.speaker?.bio || 'Experienced professional in the field.',
        webinar: apiData.speaker?.total_sessions || 0,
        company: apiData.speaker?.company || null
      },
      
      category: apiData.category?.name || 'Professional Development',
      level: formatSkillLevel(apiData.skill_level),
      bestseller: apiData.enrolled_count > 100,
      
      preview: apiData.cover_image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      videoThumbnail: apiData.cover_image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      
      pricing: {
        recorded: {
          oneParticipant: parseFloat(applicablePrices?.recorded_single || '0'),
          groupAttendees: parseFloat(applicablePrices?.recorded_multi || '0')
        }
      },
      
      zoom_url: apiData.zoom_url || '',
      has_recording: apiData.has_recording,
      recording_links: apiData.recording_links || [],
      enrolled_count: apiData.enrolled_count || 0,
      
      zoom_access: apiData.zoom_access || { can_join: false, message: 'Purchase required' },
      user_enrollment_status: isAuthenticated ? apiData.user_enrollment_status : null,
      can_access_webinar: isAuthenticated ? apiData.can_access_webinar : false,
      has_purchased: isAuthenticated ? apiData.has_purchased : false,
      enrollment_type: isAuthenticated ? apiData.enrollment_type : null,
      access_expires_at: isAuthenticated ? apiData.access_expires_at : null,
      
      hasFullAccess: isAuthenticated && apiData.can_access_webinar && apiData.has_purchased,
      canWatchRecording: isAuthenticated && (apiData.can_access_webinar || apiData.has_recording),
      needsToPurchase: !isAuthenticated || (!apiData.can_access_webinar && !apiData.has_purchased),
      
      isUserAuthenticated: isAuthenticated,
      userCanAccess: isAuthenticated && apiData.can_access_webinar,
      user_context: apiData.user_context || {},
      
      isOwner: apiData.user_context?.is_owner || false,
      isAdmin: apiData.user_context?.is_admin || false,
      enrollmentCount: apiData.user_context?.enrollment_count || 0,
      
      hasRecordingLinks: apiData.recording_links && apiData.recording_links.length > 0,
      primaryRecordingUrl: apiData.recording_links?.[0]?.url || apiData.zoom_url,
      
      isCompleted: apiData.is_completed || false,
      isAvailable: apiData.status === 'available',
      rawData: apiData
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const formatTime = (dateString, timezone) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      return `${timeString} ${timezone ? `(${timezone})` : ''}`;
    } catch (e) {
      return 'N/A';
    }
  };

  const formatSkillLevel = (level) => {
    const levelMap = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate', 
      'advanced': 'Advanced',
      'expert': 'Expert'
    };
    return levelMap[level] || 'All Levels';
  };

  const handleOptionChange = (option) => {
    if (option === 'recordedOne') {
      setSelectedOptions({
        recordedOne: true,
        recordedGroup: false
      });
    } else if (option === 'recordedGroup') {
      setSelectedOptions({
        recordedOne: false,
        recordedGroup: true
      });
    }
  };

  const calculateTotal = () => {
    if (!webinar) return 0;
    if (selectedOptions.recordedOne) return webinar.pricing.recorded.oneParticipant;
    if (selectedOptions.recordedGroup) return webinar.pricing.recorded.groupAttendees;
    return 0;
  };

  const isValidSelection = () => {
    return selectedOptions.recordedOne || selectedOptions.recordedGroup;
  };

  const handleAccessWebinar = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to access this webinar', 'warning');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const isPrivilegedUser = webinar?.isOwner || webinar?.isAdmin;

    if (!webinar?.hasFullAccess && !isPrivilegedUser) {
      showToast('You need to purchase access to this webinar first', 'warning');
      return;
    }

    setAccessing(true);

    try {
      if (webinar.hasRecordingLinks && webinar.recording_links?.[0]?.url) {
        window.open(webinar.recording_links[0].url, '_blank');
        showToast('Opening recorded webinar...', 'success');
      } else if (webinar.zoom_url) {
        window.open(webinar.zoom_url, '_blank');
        showToast('Accessing webinar content...', 'success');
      } else if (webinar.primaryRecordingUrl) {
        window.open(webinar.primaryRecordingUrl, '_blank');
        showToast('Opening webinar...', 'success');
      } else {
        navigate(`/webinar-player/${webinar.webinarId}`, {
          state: { webinar, hasAccess: true }
        });
      }
    } catch (error) {
      console.error('Error accessing webinar:', error);
      showToast('Failed to access webinar. Please try again.', 'error');
    } finally {
      setAccessing(false);
    }
  };

  const handlePurchase = async () => {
    if (!isValidSelection()) {
      showToast('Please select an access option before proceeding', 'warning');
      return;
    }

    if (webinar?.hasFullAccess) {
      showToast('You already have access to this webinar!', 'info');
      return;
    }

    setAddingToCart(true);

    try {
      const selectedOption = selectedOptions.recordedOne ? 'single' : 'group';
      
      const cartItem = {
        cartId: `${webinar.webinarId}_${selectedOption === 'single' ? 'recorded_single' : 'recorded_group'}_${Date.now()}`,
        id: webinar.id,
        webinarId: webinar.webinarId,
        title: webinar.title,
        instructor: webinar.instructor.name,
        image: webinar.videoThumbnail || webinar.preview,
        price: selectedOption === 'single' ? webinar.pricing.recorded.oneParticipant : webinar.pricing.recorded.groupAttendees,
        webinarType: 'recorded',
        accessType: selectedOption === 'single' ? 'Recorded - Single Attendee' : 'Recorded - Multi Attendees',
        description: selectedOption === 'single' ? '6 months access to recorded webinar' : 'Unlimited team access to recorded webinar',
        duration: webinar.duration,
        itemType: selectedOption === 'single' ? 'recorded_single' : 'recorded_group',
        requiresAuth: !isAuthenticated,
        userAuthenticated: isAuthenticated,
        userId: user?.id || null,
        addedAt: new Date().toISOString()
      };
      
      await addToCart(cartItem);
      showToast(`Added to cart: ${webinar.title}`, 'success');
      
      if (!isAuthenticated) {
        setTimeout(() => {
          showToast('Sign in to complete your secure checkout', 'info', 4000);
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      showToast('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const hasItemsInCart = () => {
    const selectedOption = selectedOptions.recordedOne ? 'recorded_single' : 'recorded_group';
    return cartItems.some(cartItem => 
      cartItem.webinarId === webinar?.webinarId && 
      cartItem.itemType === selectedOption
    );
  };

  const handleDirectCheckout = () => {
    if (!isValidSelection()) {
      showToast('Please select an access option before proceeding', 'warning');
      return;
    }

    if (webinar?.hasFullAccess) {
      showToast('You already have access to this webinar!', 'info');
      return;
    }

    const selectedOption = selectedOptions.recordedOne ? 'single' : 'group';
    const total = calculateTotal();
    
    const cartItem = {
      cartId: `${webinar.webinarId}_${selectedOption === 'single' ? 'recorded_single' : 'recorded_group'}_${Date.now()}`,
      id: webinar.id,
      webinarId: webinar.webinarId,
      title: webinar.title,
      instructor: webinar.instructor.name,
      image: webinar.videoThumbnail || webinar.preview,
      price: total,
      webinarType: 'recorded',
      accessType: selectedOption === 'single' ? 'Recorded - Single Attendee' : 'Recorded - Multi Attendees',
      description: selectedOption === 'single' ? '6 months access to recorded webinar' : 'Unlimited team access to recorded webinar',
      duration: webinar.duration,
      itemType: selectedOption === 'single' ? 'recorded_single' : 'recorded_group',
      requiresAuth: !isAuthenticated,
      userAuthenticated: isAuthenticated,
      userId: user?.id || null
    };

    addToCart(cartItem);

    if (!isAuthenticated) {
      const checkoutData = {
        items: [cartItem],
        summary: {
          subtotal: total,
          discount: 0,
          tax: total * 0.08,
          total: total + (total * 0.08),
          itemCount: 1
        },
        returnUrl: '/checkout',
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('pendingCheckout', JSON.stringify(checkoutData));
      sessionStorage.setItem('authReturnUrl', '/checkout');
      sessionStorage.setItem('authAction', 'checkout');
      sessionStorage.setItem('redirectMessage', 'Please sign in to complete your secure checkout');
      
      navigate('/login', { 
        state: { 
          from: location,
          message: 'Please sign in to complete your secure checkout',
          action: 'checkout'
        } 
      });
    } else {
      navigate('/checkout', {
        state: {
          items: [cartItem],
          summary: {
            subtotal: total,
            discount: 0,
            tax: total * 0.08,
            total: total + (total * 0.08),
            itemCount: 1
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-teal-50/50">
        <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-12 max-w-xs sm:max-w-md mx-4"
          >
            <div className="relative mb-6 sm:mb-8">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-cyan-600 border-t-transparent mx-auto"></div>
            </div>
            <motion.h2 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3"
            >
              Loading Recorded Training...
            </motion.h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {isAuthenticated 
                ? 'Preparing your personalized content...' 
                : 'Loading webinar details...'
              }
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !webinar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
        <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xs sm:max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 lg:p-12"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border-4 border-red-200">
              <Icon name="AlertCircle" size={32} className="sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-500" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              {error === 'Recorded webinar not found' ? 'Content Unavailable' : 'Something Went Wrong'}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
              {error || 'We couldn\'t find the recorded webinar you\'re looking for. It may have been moved or is temporarily unavailable.'}
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Button 
                onClick={() => navigate('/recorded-webinars')}
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Icon name="ArrowLeft" size={16} className="sm:w-5 sm:h-5 mr-2" />
                Browse Other Recorded Webinars
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full border-2 border-gray-300 hover:border-cyan-400 text-gray-700 hover:text-cyan-600 font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300"
              >
                <Icon name="RefreshCw" size={16} className="sm:w-5 sm:h-5 mr-2" />
                Try Again
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-teal-50/50">
      <main className="pt-12 sm:pt-14 md:pt-16 lg:pt-20">
        <WebinarHeader webinar={webinar} isAuthenticated={isAuthenticated} userRole={userRole} />
        
        {webinar?.description && (
          <WebinarDescription
            description={webinar.description}
            webinar={webinar}
            pricing={webinar.pricing}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            handleDirectCheckout={handleDirectCheckout}
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

export default RecordedWebinarDetails;
