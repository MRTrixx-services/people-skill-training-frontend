import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useAuth, } from '../../../contexts/AuthContext';
import ZoomMeetingReplaceModal from './ZoomMeetingReplaceModal';
import axiosInstance, { API_BASE_URL } from 'config/axiosInstance';

const TechnicalStep = ({ 
  formData, 
  onUpdate, 
  onNext, 
  onPrevious,
  onSaveDraft,
  onPublish,
  errors = {},
  isEditMode = false,
  isPublishing = false,
   speakers = []
}) => {
  const [isTestingZoom, setIsTestingZoom] = useState(false);
  const [zoomTestResult, setZoomTestResult] = useState(null);
  const [zoomConnectionStatus, setZoomConnectionStatus] = useState(null);
  const [isLoadingConnection, setIsLoadingConnection] = useState(true);
 const [existingZoomMeetings, setExistingZoomMeetings] = useState([]);
  const [isLoadingExistingMeetings, setIsLoadingExistingMeetings] = useState(false);
  const [selectedExistingMeeting, setSelectedExistingMeeting] = useState(null);
  const [showExistingMeetings, setShowExistingMeetings] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
const [pendingMeetingChange, setPendingMeetingChange] = useState(null);
const [isProcessingReplace, setIsProcessingReplace] = useState(false);

  // Get webinar type to determine what to show [web:61][web:132]
  const webinarType = formData?.webinarType || 'live';
  const isLiveWebinar = webinarType === 'live';
  const isRecordedWebinar = webinarType === 'recorded';

  // Get auth context data
  const { 
    token,
    user,
    isAuthenticated,
    isLoading: authLoading,
    // getAuthHeaders
  } = useAuth();

   const getSpeakerName = () => {
    if (!formData?.speaker || !speakers?.length) {
      return 'Not set';
    }
    
    const speaker = speakers.find(s => s.id?.toString() === formData.speaker?.toString());
    return speaker ? speaker.full_name || speaker.name || `Speaker ${speaker.id}` : 'Not set';
  };

  // Enhanced token getter
  const getAccessToken = () => {
    if (token) return token;
    return localStorage.getItem('access_token') || 
           localStorage.getItem('authToken') || 
           localStorage.getItem('accessToken');
  };

  // Check if user is authenticated properly
  const isUserAuthenticated = () => {
    return isAuthenticated && !authLoading && getAccessToken();
  };

  // Create secure axios instance
  // const createSecureAxiosInstance = () => {
  //   const instance = axios.create({
  //     baseURL: API_BASE_URL,
  //     timeout: 15000,
  //     headers: {
  //       'Authorization': `Bearer ${getAccessToken()}`,
  //       'Content-Type': 'application/json',
  //       ...getAuthHeaders()
  //     }
  //   });

  //   return instance;
  // };

  // Check Zoom connection status on load - only for live webinars [web:147][web:150]
  useEffect(() => {
    const checkZoomConnectionStatus = async () => {
      if (authLoading) return;

      // Skip Zoom connection check for recorded webinars
      if (isRecordedWebinar) {
        setZoomConnectionStatus({ 
          is_connected: true, 
          message: 'Zoom connection not required for recorded content.'
        });
        setIsLoadingConnection(false);
        return;
      }

      if (!isUserAuthenticated()) {
        setZoomConnectionStatus({ 
          is_connected: false, 
          message: 'Please log in to access Zoom integration.'
        });
        setIsLoadingConnection(false);
        return;
      }

      try {
        // const axiosInstance = createSecureAxiosInstance();
        const response = await axiosInstance.get('/integrations/connection/status/');
        
        console.log('Zoom connection status:', response.data);
        setZoomConnectionStatus(response.data);
        
      } catch (error) {
        console.error('Error checking Zoom connection:', error);
        
        let errorMessage = 'Failed to check connection status';
        
        if (error.response?.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
        } else if (error.response?.status === 403) {
          errorMessage = 'You don\'t have permission to access Zoom integration.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        setZoomConnectionStatus({ 
          is_connected: false, 
          message: errorMessage
        });
      } finally {
        setIsLoadingConnection(false);
      }
    };

    checkZoomConnectionStatus();
  }, [isAuthenticated, token, authLoading, user, webinarType]);
 // FIXED: Search for existing Zoom meetings
useEffect(() => {
  const searchExistingZoomMeetings = async () => {
    // Add console log to debug
    console.log('🔍 Search conditions check:', {
      isLiveWebinar,
      isConnected: zoomConnectionStatus?.is_connected,
      hasdate: !!formData?.date,
      hasTitle: !!formData?.title,
      scheduledDate: formData?.date,
      title: formData?.title
    });

    if (!isLiveWebinar || !zoomConnectionStatus?.is_connected || !formData?.date) {
      console.log('⏭️ Skipping search - conditions not met');
      return;
    }

    setIsLoadingExistingMeetings(true);
    
    try {
      // const axiosInstance = createSecureAxiosInstance();
      
      const params = {
        start_date: formData.date,
        topic: formData.title || '',
        duration: formData.duration || 60,
      };

      console.log('📤 Searching with params:', params);
      
      // const response = await axiosInstance.get('/integrations/meetings/test-list-all/', );
      
  const response = await axiosInstance.get('/integrations/meetings/search/', { params });
      
      console.log('✅ Existing Zoom meetings found:', response.data);
      
      if (response.data?.meetings && response.data.meetings.length > 0) {
        setExistingZoomMeetings(response.data.meetings);
        setShowExistingMeetings(true);
      } else {
        console.log('ℹ️ No matching meetings found');
        setExistingZoomMeetings([]);
        setShowExistingMeetings(false);
      }
      
    } catch (error) {
      console.error('❌ Error searching existing meetings:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      setExistingZoomMeetings([]);
      setShowExistingMeetings(false);
    } finally {
      setIsLoadingExistingMeetings(false);
    }
  };

  if (zoomConnectionStatus?.is_connected && formData?.date) {
    console.log('🚀 Triggering search...');
    searchExistingZoomMeetings();
  }
}, [
  zoomConnectionStatus, 
  isLiveWebinar, 
  formData?.date,  // ✅ ADDED
  formData?.title,           // ✅ ADDED
  formData?.duration         // ✅ ADDED
]);

  const recordingOptions = [
    { value: 'automatic', label: 'Automatic Recording', description: 'Start recording when webinar begins' },
    { value: 'manual', label: 'Manual Recording', description: 'You control when to start/stop recording' },
    { value: 'disabled', label: 'No Recording', description: 'Webinar will not be recorded' }
  ];

  const interactionOptions = [
    { value: 'full', label: 'Full Interaction', description: 'Chat, Q&A, polls, and screen sharing' },
    { value: 'limited', label: 'Limited Interaction', description: 'Chat and Q&A only' },
    { value: 'presentation', label: 'Presentation Mode', description: 'View-only with minimal interaction' }
  ];

  const waitingRoomOptions = [
    { value: 'enabled', label: 'Enable Waiting Room', description: 'Attendees wait for host approval' },
    { value: 'disabled', label: 'Direct Entry', description: 'Attendees join immediately when available' }
  ];

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleExistingMeetingSelect = (meeting) => {
  console.log('🔗 Meeting selected:', meeting);
  console.log('📊 Current state:', {
    isEditMode,
    currentZoomMeetingId: formData?.currentZoomMeetingId,
    selectedMeetingId: meeting.id
  });

  // Check if editing and already has a different meeting
  if (
    isEditMode && 
    formData?.currentZoomMeetingId && 
    String(formData.currentZoomMeetingId) !== String(meeting.id)
  ) {
    console.log('⚠️ Detected meeting change - showing modal');
    console.log('  Current:', formData.currentZoomMeetingId);
    console.log('  New:', meeting.id);
    
    // Set pending meeting change with proper data structure
    setPendingMeetingChange({
      current: {
        id: formData.currentZoomMeetingId,
        meeting_id: formData.currentZoomMeetingId,
        topic: formData.currentZoomMeetingTopic || formData.title,
        start_time: formData.currentZoomMeetingStartTime || formData.scheduledDate,
        join_url: formData.currentZoomMeetingJoinUrl,
        duration: formData.currentZoomMeetingDuration || formData.duration
      },
      new: {
        id: meeting.id,
        meeting_id: meeting.id,
        topic: meeting.topic,
        start_time: meeting.start_time,
        join_url: meeting.join_url,
        duration: meeting.duration,
        timezone: meeting.timezone,
        host_name: meeting.host_name
      }
    });
    
    // Store selected meeting for later use
    setSelectedExistingMeeting(meeting);
    
    // Show modal
    setShowReplaceModal(true);
    
    console.log('✅ Modal should now be visible');
    return;
  }

  // Normal selection (not editing or same meeting)
  console.log('✅ Normal selection - updating form');
  setSelectedExistingMeeting(meeting);
  onUpdate({
    existingZoomMeetingId: meeting.id,
    useExistingMeeting: true,
    zoomMeetingLink: meeting.join_url,
    selectedZoomMeeting: meeting
  });
};

 const handleCreateNewMeeting = () => {
    setSelectedExistingMeeting(null);
    onUpdate({
      existingZoomMeetingId: null,
      useExistingMeeting: false,
      zoomMeetingLink: null,
      zoomMeetingId: null
    });
  };

  const handleZoomTest = async () => {
    if (isRecordedWebinar) {
      setZoomTestResult({
        success: true,
        message: 'Zoom connection test not needed for recorded content.'
      });
      return;
    }

    if (!isUserAuthenticated()) {
      setZoomTestResult({
        success: false,
        message: 'Please log in to test Zoom connection.'
      });
      return;
    }

    setIsTestingZoom(true);
    setZoomTestResult(null);
    
    try {
      // const axiosInstance = createSecureAxiosInstance();
      const response = await axiosInstance.get('/integrations/connection/status/');

      console.log('Zoom test result:', response.data);
      
      if (response.data.is_connected) {
        setZoomTestResult({
          success: true,
          message: `Connection successful! Account: ${response.data.account_id}`,
          data: response.data
        });
        
        setZoomConnectionStatus(response.data);
      } else {
        setZoomTestResult({
          success: false,
          message: 'Zoom is not connected. Please connect your account first.',
          data: response.data
        });
      }
    } catch (error) {
      console.error('Zoom test error:', error);
      
      let errorMessage = 'Connection test failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You don\'t have permission to test Zoom integration.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setZoomTestResult({
        success: false,
        message: errorMessage
      });
    } finally {
      setIsTestingZoom(false);
    }
  };
 
  
  const handlePublish = () => {
  console.log('🚀 Publish clicked');
  console.log('📊 Debug info:');
  console.log('  - isEditMode:', isEditMode);
  console.log('  - currentZoomMeetingId:', formData?.currentZoomMeetingId);
  console.log('  - selectedExistingMeeting:', selectedExistingMeeting);
  console.log('  - selectedExistingMeeting.id:', selectedExistingMeeting?.id);
  console.log('  - hasExistingZoomMeeting:', formData?.hasExistingZoomMeeting);

  // Check if in edit mode with existing meeting and trying to link different one
  if (
    isEditMode && 
    formData?.currentZoomMeetingId && 
    selectedExistingMeeting && 
    String(formData.currentZoomMeetingId) !== String(selectedExistingMeeting.id)
  ) {
    console.log('⚠️ Detected meeting change - showing modal');
    console.log('  - Current:', formData.currentZoomMeetingId);
    console.log('  - New:', selectedExistingMeeting.id);
    
    // Show modal before publishing
    setShowReplaceModal(true);
    return;
  }

  // Normal publish flow
  console.log('✅ No conflict - proceeding with publish');
  if (onPublish) {
    onPublish();
  }
};


// Handle modal confirmation
// const handleConfirmReplace = async (action) => {
//   console.log(`✅ User confirmed: ${action}`);
//   setIsProcessingReplace(true);
  
//   try {
//     // const { createSecureAxiosInstance } = useAuth();
//     const axiosInstance = createSecureAxiosInstance();
    
//     // Call backend to handle replace
//     const response = await axiosInstance.post('/integrations/meetings/replace/', {
//       webinar_id: formData.id || formData.webinarId,
//       action: action, // 'unlink' or 'delete'
//       current_meeting_id: formData.currentZoomMeetingId,
//       new_meeting_id: selectedExistingMeeting.id
//     });
    
//     console.log('✅ Backend replaced meeting successfully:', response.data);
    
//     // Update formData to reflect the change
//     onUpdate({
//       currentZoomMeetingId: selectedExistingMeeting.id,
//       currentZoomMeetingTopic: selectedExistingMeeting.topic,
//       currentZoomMeetingStartTime: selectedExistingMeeting.start_time,
//       currentZoomMeetingJoinUrl: selectedExistingMeeting.join_url,
//       currentZoomMeetingDuration: selectedExistingMeeting.duration,
//       replacedMeeting: true,
//       replaceAction: action
//     });
    
//     // Close modal
//     setShowReplaceModal(false);
//     setIsProcessingReplace(false);
    
//     // Now proceed with publish
//     if (onPublish) {
//       console.log('✅ Calling onPublish after replacement');
//       onPublish();
//     }
    
//   } catch (error) {
//     console.error('❌ Error replacing meeting:', error);
//     setIsProcessingReplace(false);
//     alert('Failed to replace meeting. Please try again.');
//   }
// };
// In TechnicalStep.jsx - Update handleConfirmReplace

const handleConfirmReplace = async (action) => {
  console.log(`✅ User confirmed: ${action}`);
  setIsProcessingReplace(true);
  
  try {
    
    // const axiosInstance = createSecureAxiosInstance();
    
    // Prepare request data
    const requestData = {
      action: action, // 'unlink' or 'delete'
      current_meeting_id: pendingMeetingChange.current.id,
      new_meeting_id: pendingMeetingChange.new.id,
      webinar_id: formData.id // Add webinar ID
    };
    
    console.log('📤 Sending replace request:', requestData);
    
    // Call backend to handle replace
    const response = await axiosInstance.post(
      `/integrations/meetings/replace/`,
      requestData
    );
    
    console.log('✅ Backend response:', response.data);
    
    // Update formData to reflect the change
    onUpdate({
      currentZoomMeetingId: pendingMeetingChange.new.id,
      currentZoomMeetingTopic: pendingMeetingChange.new.topic,
      currentZoomMeetingStartTime: pendingMeetingChange.new.start_time,
      currentZoomMeetingJoinUrl: pendingMeetingChange.new.join_url,
      currentZoomMeetingDuration: pendingMeetingChange.new.duration,
      existingZoomMeetingId: pendingMeetingChange.new.id,
      useExistingMeeting: true,
      zoomMeetingLink: pendingMeetingChange.new.join_url,
      selectedZoomMeeting: pendingMeetingChange.new,
      replacedMeeting: true,
      replaceAction: action
    });
    
    // Close modal
    setShowReplaceModal(false);
    setIsProcessingReplace(false);
    setPendingMeetingChange(null);
    
    // Show success message
    const actionText = action === 'delete' ? 'deleted' : 'unlinked';
    alert(`✅ Old meeting ${actionText} and new meeting linked successfully!`);
    
    console.log('✅ Meeting replacement complete');
    
  } catch (error) {
    console.error('❌ Error replacing meeting:', error);
    setIsProcessingReplace(false);
    
    const errorMsg = error.response?.data?.error || error.message || 'Failed to replace meeting';
    alert(`❌ Error: ${errorMsg}`);
  }
};

// Handle modal cancel
const handleCancelReplace = () => {
  console.log('❌ User cancelled replacement');
  setShowReplaceModal(false);
  setPendingPublish(false);
  setIsProcessingReplace(false);
};
const getCurrentMeetingDetails = () => {
  // Use pendingMeetingChange if available (for modal)
  if (pendingMeetingChange?.current) {
    // console.log('✅ Using pendingMeetingChange.current:', pendingMeetingChange.current);
    return pendingMeetingChange.current;
  }

  // Fallback to formData
  if (!formData?.currentZoomMeetingId) {
    console.warn('⚠️ No current meeting ID found');
    return null;
  }
  
  const currentMeeting = {
    id: formData.currentZoomMeetingId,
    meeting_id: formData.currentZoomMeetingId,
    topic: formData.currentZoomMeetingTopic || formData.title || 'Current Meeting',
    start_time: formData.currentZoomMeetingStartTime || formData.scheduledDate || new Date().toISOString(),
    join_url: formData.currentZoomMeetingJoinUrl || '',
    duration: formData.currentZoomMeetingDuration || formData.duration || 60
  };
  
  console.log('✅ Using formData current meeting:', currentMeeting);
  return currentMeeting;
};
// Get current meeting details for modal
// const getCurrentMeetingDetails = () => {
//   return {
//     id: formData.currentZoomMeetingId,
//     meeting_id: formData.currentZoomMeetingId,
//     topic: formData.currentZoomMeetingTopic || 'Current Meeting',
//     start_time: formData.currentZoomMeetingStartTime || formData.scheduledDate,
//     join_url: formData.currentZoomMeetingJoinUrl,
//     duration: formData.currentZoomMeetingDuration || formData.duration
//   };
// };

  // const handlePublish = () => {
  //   if (onPublish) {
  //     onPublish();
  //   }
  // };

  // Updated form completion check - conditional based on webinar type [web:145]
  const isFormComplete = () => {
    if (isRecordedWebinar) {
      // For recorded webinars, just need basic validation
      return true;
    }
      if (selectedExistingMeeting || formData?.useExistingMeeting) {
      return true;
    }
    // For live webinars, need full Zoom configuration
    return formData?.recordingPreference && 
           formData?.interactionLevel && 
           formData?.waitingRoom;
  };

  // Enhanced connection display info
  const getConnectionDisplayInfo = () => {
    if (isRecordedWebinar) {
      return {
        text: 'Not Required',
        color: 'text-blue-600',
        dotColor: 'bg-blue-500'
      };
    }

    if (authLoading || isLoadingConnection) {
      return {
        text: 'Checking...',
        color: 'text-gray-500',
        dotColor: 'bg-gray-400'
      };
    }

    if (zoomConnectionStatus?.is_connected) {
      return {
        text: 'Connected',
        color: 'text-green-600',
        dotColor: 'bg-green-500'
      };
    }

    return {
      text: 'Not Connected',
      color: 'text-red-600',
      dotColor: 'bg-red-500'
    };
  };

  const connectionInfo = getConnectionDisplayInfo();
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };
 const renderExistingMeetingsSection = () => {
    if (!showExistingMeetings || existingZoomMeetings.length === 0) {
      return null;
    }

    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Calendar" size={20} className="text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-amber-800 mb-2">
              📅 Existing Zoom Meetings Found
            </h4>
            <p className="text-sm text-amber-700 mb-3">
              We found {existingZoomMeetings.length} existing Zoom meeting{existingZoomMeetings.length !== 1 ? 's' : ''} 
              {' '}that match your schedule. You can link to an existing meeting or create a new one.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {existingZoomMeetings.map((meeting, index) => (
                <div 
                  key={meeting.id || index}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedExistingMeeting?.id === meeting.id
                      ? 'border-amber-500 bg-white shadow-md'
                      : 'border-amber-200 bg-white/50 hover:border-amber-400'
                  }`}
                  onClick={() => handleExistingMeetingSelect(meeting)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon 
                          name={meeting.type === 'webinar' ? 'Radio' : 'Video'} 
                          size={14} 
                          className="text-amber-600" 
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {meeting.topic}
                        </span>
                        {selectedExistingMeeting?.id === meeting.id && (
                          <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-medium">
                            Selected
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1 ml-5">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Icon name="Calendar" size={12} />
                            <span>{new Date(meeting.start_time).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="Clock" size={12} />
                            <span>{new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="Timer" size={12} />
                            <span>{meeting.duration} min</span>
                          </span>
                        </div>
                        
                        {meeting.host_name && (
                          <div className="flex items-center space-x-1">
                            <Icon name="User" size={12} />
                            <span>Host: {meeting.host_name}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1 font-mono">
                          <Icon name="Link" size={12} />
                          <span>ID: {meeting.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant={selectedExistingMeeting?.id === meeting.id ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExistingMeetingSelect(meeting);
                      }}
                    >
                      {selectedExistingMeeting?.id === meeting.id ? 'Selected' : 'Use This'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-amber-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateNewMeeting}
                className={selectedExistingMeeting ? '' : 'bg-white border-amber-500'}
              >
                <Icon name="Plus" size={14} className="mr-1" />
                Create New Meeting Instead
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecordedWebinarReview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Final Review & Publish
        </h2>
        <p className="text-text-secondary">
          Review your recorded webinar setup and publish to make it available to your audience.
        </p>
      </div>

      {/* Recorded Webinar Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Play" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              📹 On-Demand Webinar Ready
            </h4>
            <p className="text-sm text-blue-700 mb-2">
              Your recorded content will be accessible 24/7 to enrolled attendees through the provided Zoom URL.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-600">
              <span>✓ No scheduling required</span>
              <span>✓ Always available</span>
              <span>✓ Global accessibility</span>
              <span>✓ Higher completion rates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Content Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="FileText" size={16} className="mr-2 text-purple-600" />
              Content Summary
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium text-gray-900 max-w-xs truncate">{formData?.title || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Content Type:</span>
                <span className="font-medium text-blue-600">Recorded Webinar</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Speaker:</span>
                <div className="text-right max-w-xs">
                  <span className={`font-medium ${formData?.speaker ? 'text-gray-900' : 'text-gray-400'}`}>
                    {getSpeakerName()}
                  </span>
                 
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zoom URL:</span>
                <span className="font-medium text-green-600">
                  {formData?.zoomUrl ? '✓ Provided' : '⚠ Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Access Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="Users" size={16} className="mr-2 text-green-600" />
              Access & Enrollment
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span className="font-medium text-green-600">24/7 On-Demand</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Enrollment Limit:</span>
                <span className="font-medium text-gray-900">
                  {formData?.hasEnrollmentLimit ? `${formData?.maxAttendees || 0} attendees` : 'Unlimited'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Access Method:</span>
                <span className="font-medium text-gray-900">Zoom URL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Setup Checklist */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="CheckCircle" size={16} className="mr-2 text-green-600" />
              Readiness Checklist
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.title ? "Check" : "Circle"} 
                  size={14} 
                  className={formData?.title ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${formData?.title ? 'text-green-600' : 'text-gray-500'}`}>
                  Title and description set
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.zoomUrl ? "Check" : "Circle"} 
                  size={14} 
                  className={formData?.zoomUrl ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${formData?.zoomUrl ? 'text-green-600' : 'text-gray-500'}`}>
                  Zoom recording URL provided
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.speaker ? "Check" : "Circle"} 
                  size={14} 
                  className={formData?.speaker ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${formData?.speaker ? 'text-green-600' : 'text-gray-500'}`}>
                  Speaker assigned
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.whyAttend && formData?.areasCovered?.length > 0 ? "Check" : "Circle"} 
                  size={14} 
                  className={formData?.whyAttend && formData?.areasCovered?.length > 0 ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${formData?.whyAttend && formData?.areasCovered?.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  Content details completed
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name="Check"
                  size={14} 
                  className="text-green-600"
                />
                <span className="text-xs text-green-600">
                  Ready to publish
                </span>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <Icon name="Info" size={16} className="mr-2" />
              What Happens After Publishing?
            </h3>
            
            <div className="text-sm text-blue-700 space-y-2">
              <p className="flex items-start space-x-2">
                <span className="font-medium">1.</span>
                <span>Your webinar will be immediately available for enrollment</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-medium">2.</span>
                <span>Enrolled users will receive access to the Zoom recording</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-medium">3.</span>
                <span>Content is accessible 24/7 from their dashboard</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-medium">4.</span>
                <span>You can track views and engagement metrics</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

   const renderLiveWebinarConfiguration = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Zoom Meeting Configuration
        </h2>
        <p className="text-text-secondary">
          {selectedExistingMeeting || formData?.useExistingMeeting 
            ? 'You\'ve selected an existing Zoom meeting. Review the details below.'
            : 'Configure your Zoom meeting preferences or link to an existing meeting.'}
        </p>
      </div>

      {/* Loading existing meetings indicator */}
      {isLoadingExistingMeetings && zoomConnectionStatus?.is_connected && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={20} className="animate-spin text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Searching for existing meetings...</p>
              <p className="text-xs text-blue-600">Checking your Zoom account for matching meetings</p>
            </div>
          </div>
        </div>
      )}

      {/* Existing meetings section */}
      {renderExistingMeetingsSection()}

      {/* Selected existing meeting summary */}
    {/* UPDATED: Selected existing meeting summary with link */}
{selectedExistingMeeting && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <div className="flex items-start space-x-3">
      <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-medium text-green-800 mb-1">
          ✅ Linked to Existing Meeting
        </h4>
        <p className="text-sm text-green-700 mb-2">
          Your webinar will use the existing Zoom meeting: <strong>{selectedExistingMeeting.topic}</strong>
        </p>
        
        {/* Meeting Details */}
        <div className="bg-white/70 rounded-lg p-3 mb-3">
          <div className="text-xs text-green-600 space-y-1.5">
            <div className="flex items-center space-x-2">
              <Icon name="Hash" size={12} />
              <span>Meeting ID: <span className="font-mono font-medium">{selectedExistingMeeting.id}</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={12} />
              <span>Start Time: {new Date(selectedExistingMeeting.start_time).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={12} />
              <span>Duration: {selectedExistingMeeting.duration} minutes</span>
            </div>
            {selectedExistingMeeting.timezone && (
              <div className="flex items-center space-x-2">
                <Icon name="Globe" size={12} />
                <span>Timezone: {selectedExistingMeeting.timezone}</span>
              </div>
            )}
            {selectedExistingMeeting.host_name && (
              <div className="flex items-center space-x-2">
                <Icon name="User" size={12} />
                <span>Host: {selectedExistingMeeting.host_name}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* View in Zoom Button */}
          {selectedExistingMeeting.join_url && (
            <a
              href={selectedExistingMeeting.join_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
            >
              <Icon name="ExternalLink" size={12} className="mr-1" />
              Open in Zoom
            </a>
          )}
          
          {/* Copy Join URL Button */}
          {selectedExistingMeeting.join_url && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedExistingMeeting.join_url);
                // Optional: Show toast notification
                console.log('✅ Zoom URL copied to clipboard!');
              }}
              className="inline-flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition-colors"
              title="Copy join URL"
            >
              <Icon name="Copy" size={12} className="mr-1" />
              Copy URL
            </button>
          )}
          
          {/* Change Selection Button */}
          <button
            onClick={handleCreateNewMeeting}
            className="inline-flex items-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-md transition-colors"
          >
            <Icon name="RefreshCw" size={12} className="mr-1" />
            Change Meeting
          </button>
        </div>
        
        {/* Meeting URL Display */}
        {selectedExistingMeeting.join_url && (
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-700 font-medium">Join URL:</span>
            </div>
            <div className="mt-1 p-2 bg-white/70 rounded border border-green-200">
              <code className="text-xs text-green-800 break-all font-mono">
                {selectedExistingMeeting.join_url}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      
      {/* Only show configuration if NOT using existing meeting */}
      {!selectedExistingMeeting && !formData?.useExistingMeeting && (
        <>
          {/* Automatic Integration Notice */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Zap" size={20} className="text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-800 mb-1">
                  ⚡ Automatic Meeting Setup
                </h4>
                <p className="text-sm text-green-700 mb-2">
                  Your Zoom meeting will be created automatically with your preferred settings when you publish this webinar.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-green-600">
                  <span>✓ Auto-generates meeting link</span>
                  <span>✓ Applies your preferences</span>
                  <span>✓ Sets up recording</span>
                  <span>✓ Configures attendee settings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Status */}
          {authLoading && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                <Icon name="Loader2" size={16} className="inline mr-1 animate-spin" />
                Loading authentication status...
              </p>
            </div>
          )}

          {!authLoading && !isAuthenticated && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                <Icon name="AlertTriangle" size={16} className="inline mr-1" />
                Please log in to access Zoom integration
              </p>
            </div>
          )}
        </>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Zoom Connection Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="Video" size={16} className="mr-2 text-blue-600" />
              Zoom Account Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Icon name="Video" size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Zoom Account</p>
                    <p className={`text-xs ${connectionInfo.color}`}>
                      {connectionInfo.text}
                    </p>
                    {zoomConnectionStatus?.is_connected && zoomConnectionStatus?.account_id && (
                      <p className="text-xs text-gray-500 font-mono">
                        {zoomConnectionStatus.account_id}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${connectionInfo.dotColor}`}></div>
              </div>

              {/* Connection warnings */}
              {isUserAuthenticated() && zoomConnectionStatus?.message && !zoomConnectionStatus?.is_connected && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <Icon name="AlertTriangle" size={16} className="inline mr-1" />
                    {zoomConnectionStatus.message}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open(`${API_BASE_URL}/integrations/auth/url/`, '_blank')}
                  >
                    Connect Zoom Account
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                onClick={handleZoomTest}
                disabled={!isUserAuthenticated() || authLoading || isLoadingConnection}
                className="w-full"
              >
                {isTestingZoom ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Icon name="TestTube" size={16} className="mr-2" />
                    Test Zoom Connection
                  </>
                )}
              </Button>

              {/* Enhanced test result display */}
              {zoomTestResult && (
                <div className={`p-3 rounded-lg border ${
                  zoomTestResult?.success 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon 
                      name={zoomTestResult?.success ? "CheckCircle" : "XCircle"} 
                      size={16} 
                    />
                    <p className="text-sm font-medium">{zoomTestResult?.message}</p>
                  </div>
                  
                  {/* Show detailed connection info on successful test */}
                  {zoomTestResult?.success && zoomTestResult?.data && (
                    <div className="mt-2 p-2 bg-white/50 rounded text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Account ID:</span>
                        <span className="font-mono">{zoomTestResult.data.account_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Integration:</span>
                        <span>{zoomTestResult.data.integration_type || 'Server-to-Server'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="capitalize font-medium text-green-600">Active</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Meeting Preferences */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="Settings" size={16} className="mr-2 text-purple-600" />
              Meeting Preferences
            </h3>
            
            <div className="space-y-4">
              <Select
                label="Recording Preference"
                placeholder="Select recording option"
                options={recordingOptions}
                value={formData?.recordingPreference || ''}
                onChange={(value) => handleInputChange('recordingPreference', value)}
                error={errors?.recordingPreference}
                required
                disabled={!isUserAuthenticated()}
                helpText="Choose how recordings will be handled for your meeting"
              />

              <Select
                label="Attendee Interaction Level"
                placeholder="Select interaction level"
                options={interactionOptions}
                value={formData?.interactionLevel || ''}
                onChange={(value) => handleInputChange('interactionLevel', value)}
                error={errors?.interactionLevel}
                required
                disabled={!isUserAuthenticated()}
                helpText="Control how attendees can participate in your webinar"
              />

              <Select
                label="Waiting Room"
                placeholder="Select waiting room setting"
                options={waitingRoomOptions}
                value={formData?.waitingRoom || ''}
                onChange={(value) => handleInputChange('waitingRoom', value)}
                error={errors?.waitingRoom}
                required
                disabled={!isUserAuthenticated()}
                helpText="Decide whether attendees wait for host approval"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Additional Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="Sliders" size={16} className="mr-2 text-indigo-600" />
              Additional Settings
            </h3>
            
            <div className="space-y-3">
              <Checkbox
                label="Enable Chat"
                description="Allow attendees to chat during the webinar"
                checked={formData?.enableChat !== false}
                onChange={(e) => handleInputChange('enableChat', e?.target?.checked)}
                disabled={!isUserAuthenticated()}
              />

              <Checkbox
                label="Enable Q&A"
                description="Allow attendees to submit questions"
                checked={formData?.enableQA !== false}
                onChange={(e) => handleInputChange('enableQA', e?.target?.checked)}
                disabled={!isUserAuthenticated()}
              />

              <Checkbox
                label="Enable Polls"
                description="Create interactive polls during the session"
                checked={formData?.enablePolls || false}
                onChange={(e) => handleInputChange('enablePolls', e?.target?.checked)}
                disabled={!isUserAuthenticated()}
              />

              <Checkbox
                label="Allow Screen Sharing"
                description="Permit attendees to share their screens"
                checked={formData?.allowScreenShare || false}
                onChange={(e) => handleInputChange('allowScreenShare', e?.target?.checked)}
                disabled={!isUserAuthenticated()}
              />

              <Checkbox
                label="Mute Attendees on Entry"
                description="Automatically mute attendees when they join"
                checked={formData?.muteOnEntry !== false}
                onChange={(e) => handleInputChange('muteOnEntry', e?.target?.checked)}
                disabled={!isUserAuthenticated()}
              />
            </div>
          </div>

          {/* Setup Checklist for Live */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="CheckCircle" size={16} className="mr-2 text-green-600" />
              Setup Checklist
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={isAuthenticated && !authLoading ? "Check" : "Circle"} 
                  size={14} 
                  className={isAuthenticated && !authLoading ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${isAuthenticated && !authLoading ? 'text-green-600' : 'text-gray-500'}`}>
                  User authenticated {user?.role ? `(${user.role})` : ''}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={zoomConnectionStatus?.is_connected ? "Check" : "Circle"} 
                  size={14} 
                  className={zoomConnectionStatus?.is_connected ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${zoomConnectionStatus?.is_connected ? 'text-green-600' : 'text-gray-500'}`}>
                  Zoom account connected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.recordingPreference ? "Check" : "Circle"} 
                  size={14} 
                  className={formData?.recordingPreference ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${formData?.recordingPreference ? 'text-green-600' : 'text-gray-500'}`}>
                  Recording preference set
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.interactionLevel ? "Check" : "Circle"} 
                  size={14} 
                  className={formData?.interactionLevel ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${formData?.interactionLevel ? 'text-green-600' : 'text-gray-500'}`}>
                  Interaction level configured
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={formData?.waitingRoom ? "Check" : "Circle"} 
                  size={14} 
                  className={formData?.waitingRoom ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${formData?.waitingRoom ? 'text-green-600' : 'text-gray-500'}`}>
                  Waiting room configured
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={isFormComplete() ? "Check" : "Circle"} 
                  size={14} 
                  className={isFormComplete() ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${isFormComplete() ? 'text-green-600' : 'text-gray-500'}`}>
                  Ready for automatic setup
                </span>
              </div>
            </div>
          </div>

          {/* What Happens Next for Live */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <Icon name="Info" size={16} className="mr-2" />
              What Happens Next?
            </h3>
            
            <div className="text-sm text-blue-700 space-y-2">
              <p className="flex items-start space-x-2">
                <span className="font-medium">1.</span>
                <span>When you publish, we'll automatically create your Zoom meeting</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-medium">2.</span>
                <span>Your preferences will be applied to the meeting settings</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-medium">3.</span>
                <span>Meeting links will be generated and stored securely</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-medium">4.</span>
                <span>Attendees will receive the join link after enrollment</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Conditional rendering based on webinar type [web:61][web:132] */}
      {isRecordedWebinar ? renderRecordedWebinarReview() : renderLiveWebinarConfiguration()}
      
      {/* Updated Footer */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
            iconName="ArrowLeft"
          iconPosition="left"
           onClick={handlePrevious}
        >
             <span className="hidden sm:inline">  Back to Pricing</span>
    <span className="sm:hidden">Back</span>
        </Button>
        
          <div className="flex space-x-3">
          <Button
            variant="default"
            onClick={handlePublish}
            disabled={
              isLiveWebinar 
                ? (!isFormComplete() || authLoading || (!zoomConnectionStatus?.is_connected && !selectedExistingMeeting))
                : false
            }
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isPublishing ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                {isEditMode 
                  ? (selectedExistingMeeting ? 'Updating & Linking...' : 'Updating & Syncing...') 
                  : (selectedExistingMeeting ? 'Publishing & Linking...' : 'Publishing & Creating Meeting...')
                }
              </>
            ) : (
              <>
                <Icon name="Rocket" size={16} className="mr-2" />
                {isEditMode 
                  ? 'Update Webinar' 
                  : (selectedExistingMeeting ? 'Publish & Link Meeting' : 'Publish & Create Meeting')
                }
              </>
            )}
          </Button>
        </div>
      </div>
      
     {showReplaceModal && (
  <ZoomMeetingReplaceModal
    isOpen={showReplaceModal}
    onClose={handleCancelReplace}
    currentMeeting={getCurrentMeetingDetails()}
    newMeeting={pendingMeetingChange?.new || selectedExistingMeeting}
    onConfirm={handleConfirmReplace}
    isProcessing={isProcessingReplace}
  />
    )}
    </div>
  );
};

export default TechnicalStep;
