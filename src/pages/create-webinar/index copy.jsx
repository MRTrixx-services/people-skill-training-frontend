import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import BasicInfoStep from './components/BasicInfoStep';
import SchedulingStep from './components/SchedulingStep';
import PricingStep from './components/PricingStep';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { ToastContext } from 'contexts/ToastContext';
// import { API_BASE_URL } from 'contexts/AuthContext';
import TechnicalStep from './components/TechnicalStep';
import axiosInstance from 'config/axiosInstance';

const CreateWebinar = () => {
  const navigate = useNavigate();
  const { webinar_id: webinarId } = useParams();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
  // Basic defaults
  webinarType: 'live',
  skillLevel: 'intermediate',
  timezone: 'America/New_York',
  duration: '60',
  
  // Pricing defaults  
  hasEarlyBird: false,
  hasEnrollmentLimit: false,
     liveSinglePrice:  147,
  liveMultiPrice:  390,
  recordedSinglePrice:  189,
  recordedMultiPrice: 350,
  comboSinglePrice:  310,
  comboMultiPrice: 590,
 
  // Technical defaults for live webinars
  recordingPreference: 'automatic',
  interactionLevel: 'full',
  waitingRoom: 'enabled',
  enableChat: true,
  enableQA: true,
  enablePolls: true,
  allowScreenShare: true,
  muteOnEntry: true,

  useExistingMeeting: false,
  existingZoomMeetingId: null,
  zoomMeetingLink: null,
  selectedZoomMeeting: null,
  
  currentZoomMeetingId: null,
  currentZoomMeetingTopic: null,
  currentZoomMeetingStartTime: null,
  currentZoomMeetingJoinUrl: null,
  currentZoomMeetingStartUrl: null,
  currentZoomMeetingDuration: null,
  hasExistingZoomMeeting: false,
  // Arrays
  
})
 useEffect(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, [currentStep]);

  const [errors, setErrors] = useState({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingWebinar, setIsLoadingWebinar] = useState(false);

  const [webinarPk, setWebinarPk] = useState(null);

  // Ref for step content container to help with scrolling
  const stepContentRef = useRef(null);

  const stateWebinar = location.state?.webinar;
  const duplicateData = location.state?.duplicateData;
const isDuplicate = location.state?.duplicateFrom && duplicateData; 
  const fromManagement = location.state?.fromManagement;

  const isEditMode = Boolean(webinarId);
  const pageTitle = isEditMode ? 'Edit Webinar' : 'Create New Webinar';

  const { showToast } = useContext(ToastContext);

  // Function to scroll to first error field
  const scrollToFirstError = (errorKeys = null) => {
    const errorsToCheck = errorKeys || Object.keys(errors);
    
    if (errorsToCheck.length === 0) return;

    // Wait for DOM to update
    setTimeout(() => {
      // Try to find the first error field by common selectors
      const errorSelectors = [
        `[name="${errorsToCheck[0]}"]`,
        `input[name="${errorsToCheck[0]}"]`,
        `select[name="${errorsToCheck[0]}"]`,
        `textarea[name="${errorsToCheck[0]}"]`,
        `.error-field[data-field="${errorsToCheck[0]}"]`,
        `.field-${errorsToCheck[0]}`,
        `#${errorsToCheck[0]}`,
        '.error-border',
        '.border-red-500',
        '.border-destructive'
      ];

      let errorElement = null;

      // Try to find the error element using various selectors
      for (const selector of errorSelectors) {
        errorElement = document.querySelector(selector);
        if (errorElement) break;
      }

      // If we found an error element, scroll to it
      if (errorElement) {
        // Check if element is in a scrollable container or if we need to scroll the page
        const rect = errorElement.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;

        if (!isVisible) {
          // Scroll element into view with some offset for better UX
          const yOffset = -100; // Offset from top
          const yPosition = errorElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: yPosition,
            behavior: 'smooth'
          });
        }

        // Also focus the element if it's focusable
        if (errorElement.focus && typeof errorElement.focus === 'function') {
          setTimeout(() => {
            errorElement.focus();
          }, 300); // Small delay to ensure smooth scroll completes
        }
      } else {
        // Fallback: scroll to step content if no specific field found
        if (stepContentRef.current) {
          stepContentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }, 100);
  };

  // Updated steps with conditional descriptions
  const getStepDescription = () => {
    const webinarType = formData?.webinarType;
    
    return [
      {
        id: 'basic-info',
        title: 'Basic Info',
        description: 'Title, description, and category'
      },
      {
        id: 'scheduling',
        title: webinarType === 'recorded' ? 'Content Setup' : 'Scheduling',
        description: webinarType === 'recorded' 
          ? 'Zoom recording URL and setup' 
          : 'Date, time, and duration'
      },
      {
        id: 'pricing',
        title: 'Pricing',
        description: 'Pricing and enrollment settings'
      },
    
      {
        id: 'technical',
        title: 'Technical',
        description: webinarType === 'recorded' 
          ? 'Final review and publish'
          : 'Zoom integration and settings'
      }
    ];
  };

  const steps = getStepDescription();

  useEffect(() => {
    loadInitialData();
    
    if (isEditMode && stateWebinar) {
      const transformedData = transformApiDataToForm(stateWebinar);
      setFormData(transformedData);
      setWebinarPk(stateWebinar.id || stateWebinar.pk);
      setIsLoadingWebinar(false);
    } else if (isDuplicate && duplicateData) {
      const transformedData = transformApiDataToForm(duplicateData);
      setFormData(transformedData);
      showToast('Webinar duplicated! Please review and update the details.', 'info');
    } else if (isEditMode) {
      loadWebinarData();
    } else {
      loadDraftFromStorage();
    }
  }, [isEditMode, webinarId, stateWebinar, duplicateData, isDuplicate]);

  // Scroll to errors when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      scrollToFirstError();
    }
  }, [errors]);

  const loadInitialData = async () => {
    setIsLoadingData(true);
    try {
      const [categoriesRes, speakersRes] = await Promise.all([
        axiosInstance.get(`/webinars/categories/`).catch(() => ({ data: { results: [] } })),
        axiosInstance.get(`/speakers/`).catch(() => ({ data: { results: [] } }))
      ]);

      const categoriesData = categoriesRes.data?.results || categoriesRes.data || [];
      const speakersData = speakersRes.data?.results || speakersRes.data || [];

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setSpeakers(Array.isArray(speakersData) ? speakersData : []);

    } catch (error) {
      console.error('Error loading initial data:', error);
      setCategories([]);
      setSpeakers([]);
      showToast('Failed to load categories and speakers from server.', 'warning');
    } finally {
      setIsLoadingData(false);
    }
  };

  
const extractZoomMeetingId = (webinarData) => {
  let meetingId = null;

  console.log('🔍 Extracting Zoom meeting ID from:', webinarData);

  // Try 1: Direct meeting_id field
  // if (webinarData.zoom_meeting_id) {
  //   meetingId = webinarData.zoom_meeting_id;
  //   console.log('✅ Found meeting ID from zoom_meeting_id:', meetingId);
  //   return meetingId;
  // }

  // Try 2: From zoom_meeting_rel
  // if (webinarData.zoom_meeting_rel?.zoom_meeting_id) {
  //   meetingId = webinarData.zoom_meeting_rel.zoom_meeting_id;
  //   console.log('✅ Found meeting ID from zoom_meeting_rel:', meetingId);
  //   return meetingId;
  // }

  // Try 3: Extract from join_url in zoom_access
  if (webinarData.zoom_access?.join_url) {
    const joinUrl = webinarData.zoom_access.join_url;
    // Format: https://us06web.zoom.us/j/85422206931?pwd=...
    const match = joinUrl.match(/\/j\/(\d+)/);
    if (match) {
      meetingId = match[1];
      console.log('✅ Extracted meeting ID from join_url:', meetingId);
      return meetingId;
    }
  }

  // Try 4: Extract from start_url
  if (webinarData.zoom_access?.start_url) {
    const startUrl = webinarData.zoom_access.start_url;
    // Format: https://us06web.zoom.us/s/85422206931?zak=...
    const match = startUrl.match(/\/s\/(\d+)/);
    if (match) {
      meetingId = match[1];
      console.log('✅ Extracted meeting ID from start_url:', meetingId);
      return meetingId;
    }
  }

  console.log('⚠️ No meeting ID found in any field');
  return null;
};


  const loadWebinarData = async () => {
    if (!webinarId) return;
    
    setIsLoadingWebinar(true);
    try {
      const response = await axiosInstance.get(`/webinars/${webinarId}/`);
      const webinarData = response.data;
          console.log('📥 Loaded webinar data:', webinarData);
    
    // Extract Zoom meeting ID if exists
    const zoomMeetingId = extractZoomMeetingId(webinarData);
    const hasZoomMeeting = !!zoomMeetingId;
      const transformedData = transformApiDataToForm(webinarData);
     
    const finalFormData = {
      ...transformedData,
      // Add Zoom meeting fields
      currentZoomMeetingId: zoomMeetingId,
      currentZoomMeetingTopic: webinarData.title,
      currentZoomMeetingStartTime: webinarData.scheduled_date,
      currentZoomMeetingJoinUrl: webinarData.zoom_access?.join_url,
      currentZoomMeetingStartUrl: webinarData.zoom_access?.start_url,
      currentZoomMeetingDuration: webinarData.duration,
      hasExistingZoomMeeting: hasZoomMeeting,
    }; 
     console.log('  - currentZoomMeetingId:', finalFormData?.currentZoomMeetingId);
 
      setFormData(finalFormData);
      setWebinarPk(webinarData.id || webinarData.pk);
      
      showToast('Webinar data loaded successfully', 'success');
      
    } catch (error) {
      console.error('Error loading webinar:', error);
      showToast('Failed to load webinar data', 'error');
      
      if (error.response?.status === 404) {
        navigate('/admin/create');
      }
    } finally {
      setIsLoadingWebinar(false);
    }
  };

  const transformApiDataToForm = (apiData) => {
    console.log('Transforming API data:', apiData);

    const parseDate = (dateValue, fallbackDate = null) => {
      if (!dateValue) return fallbackDate;
      
      try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date value:', dateValue);
          return fallbackDate;
        }
        return date;
      } catch (error) {
        console.warn('Error parsing date:', dateValue, error);
        return fallbackDate;
      }
    };

    const formatDateForInput = (date) => {
      if (!date) return '';
      try {
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.warn('Error formatting date:', date, error);
        return '';
      }
    };

    const formatTimeForInput = (date) => {
      if (!date) return '';
      try {
        return date.toTimeString().slice(0, 5);
      } catch (error) {
        console.warn('Error formatting time:', date, error);
        return '';
      }
    };

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    
    const scheduledDate = parseDate(apiData.scheduled_date, defaultDate);
    const applicablePrices = apiData.applicable_prices || {};
  const pricingData = apiData.pricing_data || {};
   const zoomPrefs = apiData.zoom_preferences || {};
 // NEW: Extract Zoom meeting info
  const zoomMeetingId = extractZoomMeetingId(apiData);
  const hasZoomMeeting = !!zoomMeetingId;

    return {
      // Basic Info
      title: apiData.title || '',
      description: apiData.description || '',
      category: apiData.category?.id?.toString() || '',
      skillLevel: apiData.skill_level || '',
      speaker: apiData.speaker?.id?.toString() || '',
      
      // NEW: Webinar Type and Zoom URL
      webinarType: apiData.webinar_type || 'live',
      zoomUrl: apiData.zoom_url || '',
      
      // Scheduling (conditional)
      date: apiData.webinar_type === 'live' ? formatDateForInput(scheduledDate) : '',
      time: apiData.webinar_type === 'live' ? formatTimeForInput(scheduledDate) : '',
      timezone: apiData.timezone || 'UTC',
      duration: apiData.duration?.toString() || '60',
      customDuration: (apiData.duration && apiData.duration > 300) ? apiData.duration.toString() : '',
      
      // Pricing
     liveSinglePrice: applicablePrices.live_single || pricingData.live_single_price || 147,
    liveMultiPrice: applicablePrices.live_multi || pricingData.live_multi_price || 297,
    recordedSinglePrice: applicablePrices.recorded_single || pricingData.recorded_single_price || 197,
    recordedMultiPrice: applicablePrices.recorded_multi || pricingData.recorded_multi_price || 357,
    comboSinglePrice: applicablePrices.combo_single || pricingData.combo_single_price || 287,
    comboMultiPrice: applicablePrices.combo_multi || pricingData.combo_multi_price || 557,
    
      // Early Bird
      hasEarlyBird: Boolean(apiData.has_early_bird_pricing || pricingData.has_early_bird),
    earlyBirdSinglePrice: pricingData.early_bird_single_price || '',
    earlyBirdMultiPrice: pricingData.early_bird_multi_price || '',
    earlyBirdEndDate: formatDateForInput(parseDate(pricingData.early_bird_end_date)),
    
      // Enrollment
      hasEnrollmentLimit: Boolean(apiData.has_enrollment_limit),
      maxAttendees: apiData.max_attendees?.toString() || '',
  // Technical/Zoom Preferences (only for live webinars)
      recordingPreference: zoomPrefs.recordingPreference || 'automatic',
      interactionLevel: zoomPrefs.interactionLevel || 'full',
      waitingRoom: zoomPrefs.waitingRoom || 'enabled',
      enableChat: zoomPrefs.enableChat !== false,
      enableQA: zoomPrefs.enableQA !== false,
      enablePolls: zoomPrefs.enablePolls || false,
      allowScreenShare: zoomPrefs.allowScreenShare || false,
      muteOnEntry: zoomPrefs.muteOnEntry !== false,
      
      // Cover Image
      coverImage: apiData.cover_image ? {
        preview: apiData.cover_image_url || apiData.cover_image,
        file: null
      } : null,

       currentZoomMeetingId: zoomMeetingId,
    currentZoomMeetingTopic: apiData.title,
    currentZoomMeetingStartTime: apiData.scheduled_date,
    currentZoomMeetingJoinUrl: apiData.zoom_access?.join_url || null,
    currentZoomMeetingStartUrl: apiData.zoom_access?.start_url || null,
    currentZoomMeetingDuration: apiData.duration,
    hasExistingZoomMeeting: hasZoomMeeting,

    // NEW: Zoom Meeting Linking Fields (for modal)
    useExistingMeeting: false,
    existingZoomMeetingId: null,
    zoomMeetingLink: null,
    selectedZoomMeeting: null,
       recordingLinks: apiData.recording_links || [],
    
    // NEW: For recorded webinars, use the recording's metadata
    duration: apiData.webinar_type === 'recorded' && apiData.recording_links?.[0]?.duration
      ? apiData.recording_links[0].duration.toString()
      : apiData.duration?.toString() || '60',
    
    // NEW: scheduled_date becomes "recorded_date" for recorded webinars
    scheduledDate: apiData.webinar_type === 'recorded' 
      ? apiData.recording_links?.[0]?.recorded_date || apiData.created_at
      : apiData.scheduled_date,
    
    recorded_date: apiData.webinar_type === 'recorded'
      ? formatDateForInput(parseDate(apiData.recording_links?.[0]?.recorded_date || apiData.created_at))
      : null,
    };
  };

  const loadDraftFromStorage = () => {
    if (isEditMode) return;
    
    const savedDraft = localStorage.getItem('webinar-draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData?.formData || {});
        setCurrentStep(draftData?.currentStep || 0);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    // Clear errors when switching steps
    setErrors({});
  };

  const handleFormUpdate = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    const updatedErrors = { ...errors };
    Object.keys(updates)?.forEach(key => {
      delete updatedErrors?.[key];
    });
    setErrors(updatedErrors);
  };

  // Updated validation with conditional logic - ENHANCED for TechnicalStep
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Basic Info
        if (!formData?.title?.trim()) {
          newErrors.title = 'Title is required';
        } else if (formData.title.length > 400) {
          newErrors.title = 'Title cannot exceed 400 characters';
        }

        if (!formData?.description?.trim()) {
          newErrors.description = 'Description is required';
        } else if (formData.description.length < 100) {
          newErrors.description = 'Description should minimum 100 characters';
        }

        if (!formData?.category) newErrors.category = 'Category is required';
        if (!formData?.skillLevel) newErrors.skillLevel = 'Skill level is required';
        if (!formData?.speaker) newErrors.speaker = 'Speaker is required';
        break;

      case 1: // Scheduling/Content Setup - UPDATED with conditional validation
        if (!formData?.webinarType) {
          newErrors.webinarType = 'Webinar type is required';
        }

        if (formData?.webinarType === 'live') {
          // Live webinar validation
          if (!formData?.date) newErrors.date = 'Date is required for live sessions';
          if (!formData?.time) newErrors.time = 'Time is required for live sessions';
          if (!formData?.timezone) newErrors.timezone = 'Timezone is required for live sessions';
          if (!formData?.duration) newErrors.duration = 'Duration is required for live sessions';
          
          if (formData?.duration === 'custom' && !formData?.customDuration) {
            newErrors.customDuration = 'Custom duration is required';
          }
        } else if (formData?.webinarType === 'recorded') {
          // Recorded webinar validation - Zoom URL required
          if (!formData?.zoomUrl) {
            newErrors.zoomUrl = 'Zoom URL is required for recorded webinars';
          } else {
            const validateZoomUrl = (url) => {
              try {
                const zoomPatterns = [
                  /^https:\/\/.*\.?zoom\.us\/j\/\d+/,              // Meeting join links
                  /^https:\/\/.*\.?zoom\.us\/w\/\d+/,              // Webinar join links  
                  /^https:\/\/.*\.?zoom\.us\/meeting\/\d+/,        // Meeting links
                  /^https:\/\/.*\.?zoom\.us\/webinar\/register\//,  // Webinar registration
                  /^https:\/\/.*\.?zoom\.us\/s\/\d+/,              // Personal meeting room
                  /^https:\/\/.*\.?zoom\.us\/rec\//                // Cloud recordings
                ];
                return zoomPatterns.some(pattern => pattern.test(url));
              } catch {
                return false;
              }
            };

            if (!validateZoomUrl(formData.zoomUrl)) {
              newErrors.zoomUrl = 'Please enter a valid Zoom meeting, webinar, or recording URL';
            }
          }
        }
        break;

      case 2: // Pricing - UPDATED with conditional validation based on webinar type
        if (formData?.webinarType === 'live') {
          // For live webinars, validate all pricing options
          const pricesSingle = [
            formData?.liveSinglePrice,
            formData?.recordedSinglePrice,
            formData?.comboSinglePrice
          ];
          const hasSinglePrice = pricesSingle.some(p => p && parseFloat(p) > 0);

          const pricesMulti = [
            formData?.liveMultiPrice,
            formData?.recordedMultiPrice,
            formData?.comboMultiPrice
          ];
          const hasMultiPrice = pricesMulti.some(p => p && parseFloat(p) > 0);

          const pricesAll = [...pricesSingle, ...pricesMulti];
          const hasAnyPrice = pricesAll.some(p => p && parseFloat(p) > 0);
          
          if (!hasAnyPrice) {
            Object.assign(newErrors, {
              liveSinglePrice: 'At least one pricing option is required',
              liveMultiPrice: 'At least one pricing option is required',
              recordedSinglePrice: 'At least one pricing option is required',
              recordedMultiPrice: 'At least one pricing option is required',
              comboSinglePrice: 'At least one pricing option is required',
              comboMultiPrice: 'At least one pricing option is required'
            });
          }

          if (formData?.hasEarlyBird) {
            if (hasSinglePrice && (!formData?.earlyBirdSinglePrice || parseFloat(formData.earlyBirdSinglePrice) <= 0)) {
              newErrors.earlyBirdSinglePrice = 'Early bird single attendee price is required';
            }
            if (hasMultiPrice && (!formData?.earlyBirdMultiPrice || parseFloat(formData.earlyBirdMultiPrice) <= 0)) {
              newErrors.earlyBirdMultiPrice = 'Early bird multi attendees price is required';
            }
            if (!formData?.earlyBirdEndDate) {
              newErrors.earlyBirdEndDate = 'Early bird end date is required';
            }
          }
        } else if (formData?.webinarType === 'recorded') {
          // For recorded webinars, only validate recorded pricing
          const hasRecordedSingle = formData?.recordedSinglePrice && parseFloat(formData.recordedSinglePrice) > 0;
          const hasRecordedMulti = formData?.recordedMultiPrice && parseFloat(formData.recordedMultiPrice) > 0;
          
          if (!hasRecordedSingle && !hasRecordedMulti) {
            newErrors.recordedSinglePrice = 'At least one recorded content pricing option is required';
            newErrors.recordedMultiPrice = 'At least one recorded content pricing option is required';
          }
        }

        if (formData?.hasEnrollmentLimit && (!formData?.maxAttendees || parseInt(formData.maxAttendees) <= 0)) {
          newErrors.maxAttendees = 'Maximum attendees must be a positive number';
        }
        break;

   

      case 3: // Technical Step Validation - ENHANCED with better validation logic
        if (formData?.webinarType === 'live') {
          // Live webinar technical requirements
          if (!formData?.recordingPreference) {
            newErrors.recordingPreference = 'Recording preference is required for live webinars';
          }
          if (!formData?.interactionLevel) {
            newErrors.interactionLevel = 'Interaction level is required for live webinars';
          }
          if (!formData?.waitingRoom) {
            newErrors.waitingRoom = 'Waiting room setting is required for live webinars';
          }
        } else if (formData?.webinarType === 'recorded') {
          // Recorded webinar final validation - ensure all critical data is present
          if (!formData?.title?.trim()) {
            newErrors.title = 'Title is required before publishing';
          }
          if (!formData?.speaker) {
            newErrors.speaker = 'Speaker must be assigned before publishing';
          }
          if (!formData?.zoomUrl?.trim()) {
            newErrors.zoomUrl = 'Zoom URL is required for recorded webinars';
          }
          if (!formData?.recordedSinglePrice && !formData?.recordedMultiPrice) {
            newErrors.recordedSinglePrice = 'At least one pricing option is required';
            newErrors.recordedMultiPrice = 'At least one pricing option is required';
          }
          
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length - 1));
    } else {
      // Scroll to first error when validation fails
      setTimeout(() => scrollToFirstError(), 100);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    // Clear errors when going back
    setErrors({});
  };

  const handleSaveDraft = () => {
    if (isEditMode) {
      showToast('Changes are automatically saved when you update the webinar.', 'info');
      return;
    }

    const draftData = {
      formData,
      currentStep,
      savedAt: new Date()?.toISOString()
    };
    
    localStorage.setItem('webinar-draft', JSON.stringify(draftData));
    setIsDraftSaved(true);
    
    setTimeout(() => {
      setIsDraftSaved(false);
    }, 3000);
  };

  const transformFormDataForAPI = () => {
  const baseData = {
    title: formData.title,
    description: formData.description,
    category: parseInt(formData.category),
    skill_level: formData.skillLevel,
    speaker: parseInt(formData.speaker),
    webinar_type: formData.webinarType,
    
    // Pricing data
    pricing_data: {
      live_single_price: formData.liveSinglePrice ? parseFloat(formData.liveSinglePrice).toFixed(2) : null,
      live_multi_price: formData.liveMultiPrice ? parseFloat(formData.liveMultiPrice).toFixed(2) : null,
      recorded_single_price: formData.recordedSinglePrice ? parseFloat(formData.recordedSinglePrice).toFixed(2) : null,
      recorded_multi_price: formData.recordedMultiPrice ? parseFloat(formData.recordedMultiPrice).toFixed(2) : null,
      combo_single_price: formData.comboSinglePrice ? parseFloat(formData.comboSinglePrice).toFixed(2) : null,
      combo_multi_price: formData.comboMultiPrice ? parseFloat(formData.comboMultiPrice).toFixed(2) : null,
      
      has_early_bird: formData.hasEarlyBird || false,
      early_bird_single_price: formData.earlyBirdSinglePrice ? parseFloat(formData.earlyBirdSinglePrice).toFixed(2) : null,
      early_bird_multi_price: formData.earlyBirdMultiPrice ? parseFloat(formData.earlyBirdMultiPrice).toFixed(2) : null,
      early_bird_end_date: formData.earlyBirdEndDate || null,
    },
       // ✅ NEW: Platform-specific pricing
    platform_pricing: formData.enablePlatformPricing && formData.platformPricing 
      ? Object.entries(formData.platformPricing)
          .filter(([_, prices]) => {
            return Object.values(prices).some(val => val && val !== '');
          })
          .map(([platformId, prices]) => ({
            platform_id: platformId,
            pricing_data: {
              live_single_price: prices.liveSinglePrice ? parseFloat(prices.liveSinglePrice).toFixed(2) : null,
              live_multi_price: prices.liveMultiPrice ? parseFloat(prices.liveMultiPrice).toFixed(2) : null,
              recorded_single_price: prices.recordedSinglePrice ? parseFloat(prices.recordedSinglePrice).toFixed(2) : null,
              recorded_multi_price: prices.recordedMultiPrice ? parseFloat(prices.recordedMultiPrice).toFixed(2) : null,
              combo_single_price: prices.comboSinglePrice ? parseFloat(prices.comboSinglePrice).toFixed(2) : null,
              combo_multi_price: prices.comboMultiPrice ? parseFloat(prices.comboMultiPrice).toFixed(2) : null,
            },
            discount_percentage: prices.discountPercentage ? parseFloat(prices.discountPercentage) : 0,
            is_active: true
          }))
      : [],
    // Enrollment
    max_attendees: formData.hasEnrollmentLimit ? parseInt(formData.maxAttendees) : null,
    has_enrollment_limit: Boolean(formData.hasEnrollmentLimit),
   
    // Cover image
    cover_image: formData.coverImage?.file || null,
    
    // NEW: Zoom meeting linking fields (preserve them!)
    use_existing_meeting: formData.useExistingMeeting || false,
    existing_zoom_meeting_id: formData.existingZoomMeetingId || null,
    zoom_meeting_link: formData.zoomMeetingLink || null,
    
  };

  // Conditional data based on webinar type
  if (formData.webinarType === 'live') {
    if (!formData.date || !formData.time) {
      throw new Error('Date and time are required for live webinars');
    }

    let scheduledDateTime;
    // try {
    //   scheduledDateTime = new Date(`${formData.date}T${formData.time}`);
    //   if (isNaN(scheduledDateTime.getTime())) {
    //     throw new Error('Invalid date/time combination');
    //   }
    // } catch (error) {
    //   console.error('Error creating scheduled date:', error);
    //   throw new Error('Invalid date or time format');
    // }
    try {
      // User enters time in EST (e.g., "2025-11-15" and "12:00")
      const dateTimeString = `${formData.date}T${formData.time}:00`;
      
      // Create Date object (browser's local time)
      const localDate = new Date(dateTimeString);
      
      if (isNaN(localDate.getTime())) {
        throw new Error('Invalid date/time combination');
      }
      
      // Convert to ISO string (UTC) - backend will handle timezone conversion
      scheduledDateTime = localDate;
      
      console.log('📅 Scheduled DateTime:', {
        input: dateTimeString,
        localDate: localDate.toString(),
        iso: localDate.toISOString(),
        timezone: formData.timezone
      });
      
    } catch (error) {
      console.error('Error creating scheduled date:', error);
      throw new Error('Invalid date or time format');
    }
    
    let durationMinutes = 60;
    if (formData.duration === 'custom') {
      durationMinutes = parseInt(formData.customDuration) || 60;
    } else {
      durationMinutes = parseInt(formData.duration) || 60;
    }

    // Live webinar specific fields
    // baseData.scheduled_date = scheduledDateTime.toISOString();
    // baseData.duration = durationMinutes;
    // baseData.timezone = formData.timezone;

    baseData.scheduled_date = scheduledDateTime.toISOString();
    baseData.duration = durationMinutes;
    baseData.timezone = formData.timezone || 'America/New_York'; // Default to EST
    
    
    // Zoom preferences for live webinars
    baseData.zoom_preferences = {
      recordingPreference: formData.recordingPreference || 'automatic',
      interactionLevel: formData.interactionLevel || 'full',
      waitingRoom: formData.waitingRoom || 'enabled',
      enableChat: formData.enableChat !== false,
      enableQA: formData.enableQA !== false,
      enablePolls: formData.enablePolls || false,
      allowScreenShare: formData.allowScreenShare || false,
      muteOnEntry: formData.muteOnEntry !== false
    };
    
    // Debug log for live webinars
    // console.log('🔍 Transformed live webinar data includes linking:', {
    //   use_existing_meeting: baseData.use_existing_meeting,
    //   existing_zoom_meeting_id: baseData.existing_zoom_meeting_id,
    //   zoom_meeting_link: baseData.zoom_meeting_link
    // });
    
  } else if (formData.webinarType === 'recorded') {
    if (!formData.zoomUrl) {
      throw new Error('Zoom URL is required for recorded webinars');
    }
    
    // Recorded webinar specific fields
    baseData.zoom_url = formData.zoomUrl;
    let durationMinutes = 60;
    if (formData.duration === 'custom') {
      durationMinutes = parseInt(formData.customDuration) || 60;
    } else {
      durationMinutes = parseInt(formData.duration) || 60;
    }
    
    baseData.scheduled_date = null;
    baseData.duration = durationMinutes;
    baseData.timezone = null;
    baseData.zoom_preferences = null;
    
    // Recorded webinars don't need linking fields
    baseData.use_existing_meeting = false;
    baseData.existing_zoom_meeting_id = null;
    baseData.zoom_meeting_link = null;
  }

  console.log('✅ Final transformed data:', baseData);
  return baseData;
};

  const handleBackNavigation = () => {
    const returnPath = location.state?.returnPath;
    
    if (fromManagement || returnPath) {
      navigate(returnPath || '/admin/webinars');
    } else {
      navigate(isEditMode ? '/admin/webinars' : '/');
    }
  };
const handlePublish = async () => {
  // Validate all steps
  let allValid = true;
  let firstErrorStep = -1;
  const allErrors = {};

  for (let i = 0; i < steps.length; i++) {
    const currentErrors = { ...errors };
    
    if (!validateStep(i)) {
      allValid = false;
      if (firstErrorStep === -1) {
        firstErrorStep = i;
      }
      Object.assign(allErrors, errors);
    }
    
    setErrors(currentErrors);
  }

  if (!allValid) {
    setErrors(allErrors);
    setCurrentStep(firstErrorStep);
    showToast('Please complete all required fields before publishing.', 'error');
    setTimeout(() => scrollToFirstError(Object.keys(allErrors)), 200);
    return;
  }

  setIsPublishing(true);
  
  try {
    const apiData = transformFormDataForAPI();
    const formDataToSend = new FormData();
    
    // Add all regular fields
    Object.keys(apiData).forEach(key => {
      if (key === 'cover_image' && apiData[key]) {
        formDataToSend.append('cover_image', apiData[key]);
      } else if (key === 'pricing_data' || key === 'zoom_preferences') {
        formDataToSend.append(key, JSON.stringify(apiData[key]));
      } else if (key === 'platform_pricing') {
        if (apiData[key] && apiData[key].length > 0) {
          formDataToSend.append(key, JSON.stringify(apiData[key]));
        }
      } else if (key === 'use_existing_meeting') {
        // Convert boolean to string for FormData
        formDataToSend.append(key, apiData[key] ? 'true' : 'false');
      } else if (key === 'existing_zoom_meeting_id' || key === 'zoom_meeting_link') {
        // Only append if not null
        if (apiData[key]) {
          formDataToSend.append(key, apiData[key]);
        }
      } else if (apiData[key] !== null && apiData[key] !== undefined) {
        formDataToSend.append(key, apiData[key]);
      }
    });

    // Debug: Log all FormData entries
    console.log('🔍 DEBUG - Final FormData entries:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`  ${key}:`, value);
    }

    let response;
    
    if (isEditMode) {
      // EDIT MODE: Update existing webinar
      if (!webinarPk) {
        throw new Error('Webinar ID not found for update. Please reload the page.');
      }
      
      console.log(`📝 Updating webinar with PK: ${webinarPk}`);
      response = await axiosInstance.put(
        `/webinars/${webinarPk}/update/`, 
        formDataToSend, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        }
      );
      
      // Success message for edit
      let successMessage = 'Webinar updated successfully!';
      if (formData.webinarType === 'live') {
        const hasZoomMeeting = response.data?.data?.zoom_meeting_rel || response.data?.zoom_meeting_rel;
        const isLinkedExisting = response.data?.data?.zoom_meeting_rel?.is_linked_existing || 
                                response.data?.zoom_meeting_rel?.is_linked_existing;
        
        if (isLinkedExisting) {
          successMessage = 'Live webinar updated! Linked Zoom meeting unchanged.';
        } else if (hasZoomMeeting) {
          successMessage = 'Live webinar updated! Zoom meeting synced automatically.';
        } else {
          successMessage = 'Live webinar updated successfully!';
        }
      } else if (formData.webinarType === 'recorded') {
        successMessage = 'Recorded webinar updated successfully!';
      }
      showToast(successMessage, 'success');
      
    } else {
      // CREATE MODE: Create new webinar
      console.log(`🆕 Creating new webinar`);
      response = await axiosInstance.post(
        `/webinars/create/`, 
        formDataToSend, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      
      // Success message for create
      let successMessage = 'Webinar published successfully!';
      if (formData.webinarType === 'live') {
        if (formData.useExistingMeeting) {
          successMessage = '🎉 Live webinar published and linked to existing Zoom meeting!';
        } else {
          successMessage = '🎉 Live webinar published! Zoom meeting created automatically.';
        }
      } else if (formData.webinarType === 'recorded') {
        successMessage = '🎉 Recorded webinar published successfully!';
      }
      showToast(successMessage, 'success');
      
      localStorage.removeItem('webinar-draft');
    }
    
    // Show Zoom integration status (only for live webinars in create mode)
    if (!isEditMode && formData.webinarType === 'live') {
      if (formData.useExistingMeeting) {
        showToast('🔗 Linked to existing Zoom meeting successfully!', 'success');
      } else if (response.data?.zoom_integrated) {
        showToast('🎯 Zoom integration completed successfully!', 'success');
      } else if (response.data?.data?.zoom_webinar_link || response.data?.data?.zoom_meeting_rel) {
        showToast('🔗 Zoom meeting created and configured automatically!', 'success');
      }
    }

    // Extract webinar ID for navigation
    let extractedWebinarId = null;
    
    if (response.data?.webinar_id) {
      extractedWebinarId = response.data.webinar_id;
    } else if (response.data?.data?.webinar_id) {
      extractedWebinarId = response.data.data.webinar_id;
    } else if (response.data?.id) {
      extractedWebinarId = response.data.id;
    } else if (response.data?.data?.id) {
      extractedWebinarId = response.data.data.id;
    }
    
    if (!extractedWebinarId && isEditMode) {
      extractedWebinarId = webinarId;
    }
    
    // Navigation
    if (extractedWebinarId) {
      const webinarType = formData.webinarType;
      const baseState = {
        message: isEditMode 
          ? `${webinarType.charAt(0).toUpperCase() + webinarType.slice(1)} webinar updated successfully!` 
          : `${webinarType.charAt(0).toUpperCase() + webinarType.slice(1)} webinar published successfully!`,
        fromCreate: !isEditMode,
        fromEdit: isEditMode,
        webinar: response.data.data || response.data,
        webinarType,
        timestamp: new Date().toISOString(),
        // Only include linking info for create mode
        linkedToExisting: !isEditMode && (formData.useExistingMeeting || false),
        existingMeetingId: !isEditMode && formData.existingZoomMeetingId || null
      };

      if (webinarType === 'recorded') {
        navigate(`/recorded-webinar/${extractedWebinarId}`, {
          state: {
            ...baseState,
            recordingUrl: formData.zoomUrl,
            recordingDuration: formData.duration,
            recordingLinks: formData.recordingLinks || [],
            immediatelyAvailable: true
          }
        });
      } else if (webinarType === 'live') {
        const zoomMeeting = response.data?.data?.zoom_meeting_rel || response.data?.zoom_meeting_rel;
        
        navigate(`/live-webinar/${extractedWebinarId}`, {
          state: {
            ...baseState,
            zoomIntegrated: !!zoomMeeting || formData.useExistingMeeting || false,
            zoomMeetingId: zoomMeeting?.zoom_meeting_id || formData.existingZoomMeetingId,
            zoomMeetingUrl: zoomMeeting?.join_url || formData.zoomMeetingLink,
            isLinkedExisting: zoomMeeting?.is_linked_existing || false,
            scheduledDate: formData.scheduledDate,
            duration: formData.duration
          }
        });
      } else {
        navigate(`/admin/webinars`, { 
          state: {
            ...baseState,
            message: `Webinar ${isEditMode ? 'updated' : 'created'} successfully!`
          }
        });
      }
    } else {
      console.warn('Could not extract webinar ID from response', response.data);
      navigate('/admin/webinars', {
        state: {
          message: `${formData.webinarType.charAt(0).toUpperCase() + formData.webinarType.slice(1)} webinar ${isEditMode ? 'updated' : 'created'} successfully!`,
          success: true,
          webinarType: formData.webinarType
        }
      });
    }
      
  } catch (error) {
    console.error('Error saving webinar:', error);
    
    let errorMessage = `Failed to ${isEditMode ? 'update' : 'publish'} ${formData.webinarType} webinar. Please try again.`;
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.details && typeof errorData.details === 'object') {
        const firstField = Object.keys(errorData.details)[0];
        const firstError = errorData.details[firstField];
        errorMessage = `${firstField}: ${Array.isArray(firstError) ? firstError[0] : firstError}`;
      } else if (errorData.error && typeof errorData.error === 'object') {
        const firstError = Object.values(errorData.error)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.detail || errorData.details) {
        errorMessage = errorData.detail || errorData.details;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.title) {
        errorMessage = Array.isArray(errorData.title) ? errorData.title[0] : errorData.title;
      }
    }
    
    showToast(errorMessage, 'error');
  } finally {
    setIsPublishing(false);
  }
};


  const renderCurrentStep = () => {
    if (isLoadingData || isLoadingWebinar) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">
              {isLoadingWebinar ? 'Loading webinar data...' : 'Loading form data...'}
            </p>
          </div>
        </div>
      );
    }

    const commonProps = {
      formData,
      onUpdate: handleFormUpdate,
      errors,
      categories,
      speakers,
      isEditMode
    };

    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            {...commonProps}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <SchedulingStep
            {...commonProps}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <PricingStep
            {...commonProps}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      
      case 3:
        return (
          <TechnicalStep
            {...commonProps}
            onPrevious={handlePrevious}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            isPublishing={isPublishing}
            isEditMode={isEditMode}
            speakers={speakers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isDuplicate ? 'Duplicate Webinar' : pageTitle}
              </h1>
              <p className="text-text-secondary mt-1">
                {isDuplicate 
                  ? 'Review and update the duplicated webinar details.'
                  : isEditMode 
                    ? 'Update your webinar details. Live webinars sync with Zoom automatically!' 
                    : 'Set up your webinar with our step-by-step guide. Choose between live sessions or recorded content!'
                }
              </p>
              
              {isEditMode && webinarPk && process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-gray-500 mt-1">
                  PK: {webinarPk} | Webinar ID: {webinarId} | Type: {formData?.webinarType}
                </p>
              )}
            </div>
            
            {isDuplicate && location.state?.originalWebinar && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <span className="text-sm text-blue-700 font-medium">
                  Duplicating: {location.state.originalWebinar.title}
                </span>
              </div>
            )}
              
            {isDraftSaved && !isEditMode && (
              <div className="flex items-center space-x-2 bg-success/10 border border-success/20 rounded-lg px-3 py-2">
                <Icon name="Check" size={16} color="var(--color-success)" />
                <span className="text-sm text-success font-medium">Draft saved</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="bg-card border border-border rounded-lg p-6">
            <ProgressIndicator
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              variant="horizontal"
            />
          </div>
          
          {/* Updated Integration Notice - Conditional based on webinar type */}
          {formData?.webinarType === 'live' ? (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Video" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    🚀 Automatic Zoom Integration
                  </h4>
                  <p className="text-sm text-blue-700">
                    Your Zoom meeting will be created automatically when you publish the webinar. 
                    Configure your preferences in the Technical step, and we'll handle the rest!
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-blue-600">
                    <span>✓ Auto-creates meeting/webinar</span>
                    <span>✓ Applies your settings</span>
                    <span>✓ Syncs updates automatically</span>
                  </div>
                </div>
              </div>
            </div>
          ) : formData?.webinarType === 'recorded' ? (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Play" size={20} className="text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-1">
                    📹 On-Demand Content Setup
                  </h4>
                  <p className="text-sm text-green-700">
                    Perfect for recorded webinars! Just provide your Zoom recording URL and we'll make it available to enrolled users 24/7.
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-green-600">
                    <span>✓ Always available</span>
                    <span>✓ No timezone issues</span>
                    <span>✓ Higher completion rates</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Step Content */}
        <div 
          ref={stepContentRef} 
          className="bg-card border border-border rounded-lg p-6 lg:p-8"
        >
          {renderCurrentStep()}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={handleBackNavigation}
            iconName="ArrowLeft"
            iconPosition="left"
            className="sm:w-auto"
          >
            {fromManagement ? 'Back to Management' : 'Back to Home'}
          </Button>
          
          {!isEditMode && (
            <Button
              variant="ghost"
              onClick={handleSaveDraft}
              iconName="Save"
              iconPosition="left"
              className="sm:w-auto"
            >
              Save Draft
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateWebinar;
