import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import axiosInstance from 'config/axiosInstance';

const SchedulingStep = ({ 
  formData, 
  onUpdate, 
  onNext, 
  onPrevious,
  editMode,
  errors = {} 
}) => {
  const [webinarType, setWebinarType] = useState(formData?.webinarType || 'live');
  const [zoomRecordings, setZoomRecordings] = useState([]);
  const [allRecordings, setAllRecordings] = useState([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [recordingError, setRecordingError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExistingRecording, setIsExistingRecording] = useState(false);
  const [shouldFetchRecordings, setShouldFetchRecordings] = useState(false);
  const [originalRecording, setOriginalRecording] = useState(null);

  const webinarTypeOptions = [
    { 
      value: 'live', 
      label: 'Live Webinar', 
      description: 'Real-time session via Zoom (can be recorded)' 
    },
    { 
      value: 'recorded', 
      label: 'Recorded Only', 
      description: 'Pre-recorded Zoom session accessible on-demand' 
    }
  ];

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

  const calculateDurationFromRecording = (recordingDurationMinutes) => {
    if (!recordingDurationMinutes || recordingDurationMinutes <= 0) {
      return null;
    }

    const durationValues = durationOptions
      .filter(opt => opt.value !== 'custom')
      .map(opt => parseInt(opt.value))
      .sort((a, b) => a - b);

    for (let duration of durationValues) {
      if (recordingDurationMinutes <= duration) {
        return duration.toString();
      }
    }

    return 'custom';
  };

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleWebinarTypeChange = (type) => {
    setWebinarType(type);
    handleInputChange('webinarType', type);
    
    if (type === 'recorded') {
      handleInputChange('date', '');
      handleInputChange('time', '');
      handleInputChange('duration', '');
      handleInputChange('customDuration', '');
    } else {
      handleInputChange('zoomUrl', '');
    }
  };

  const getSeasonalTimezoneAbbr = (dateString, timezone) => {
    try {
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      });
      const parts = formatter.formatToParts(date);
      const tzName = parts.find(part => part.type === 'timeZoneName')?.value;
      
      return tzName || (timezone === 'America/New_York' ? 'EST' : 'PST');
    } catch {
      return timezone === 'America/New_York' ? 'EST' : 'PST';
    }
  };

  const convertESTtoPST = (date, time) => {
    if (!date || !time) return null;
    
    try {
      const [hours, minutes] = time.split(':');
      let estHour = parseInt(hours);
      const minute = minutes;
      
      const estAmpm = estHour >= 12 ? 'PM' : 'AM';
      const estHour12 = estHour % 12 || 12;
      const estFormatted = `${estHour12}:${minute} ${estAmpm}`;
      
      let pstHour = estHour - 3;
      let pstDate = date;
      
      if (pstHour < 0) {
        pstHour += 24;
        const dateObj = new Date(date);
        dateObj.setDate(dateObj.getDate() - 1);
        pstDate = dateObj.toISOString().split('T')[0];
      }
      
      const pstAmpm = pstHour >= 12 ? 'PM' : 'AM';
      const pstHour12 = pstHour % 12 || 12;
      const pstFormatted = `${pstHour12}:${minute} ${pstAmpm}`;
      
      const pstAbbr = getSeasonalTimezoneAbbr(date, 'America/Los_Angeles');
      const estAbbr = getSeasonalTimezoneAbbr(date, 'America/New_York');
      
      return {
        pst: `${pstFormatted} ${pstAbbr}`,
        est: `${estFormatted} ${estAbbr}`,
        combined: `${pstFormatted} ${pstAbbr} | ${estFormatted} ${estAbbr}`,
        date: new Date(date).toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    } catch (error) {
      console.error('Error converting time:', error);
      return null;
    }
  };

  const formatDateTime = () => {
    if (!isSchedulingRequired || !formData?.date || !formData?.time) {
      return null;
    }
    return convertESTtoPST(formData.date, formData.time);
  };

  const validateZoomUrl = (url) => {
    if (!url) return false;
    
    try {
      new URL(url);
      
      const zoomPatterns = [
        /^https:\/\/.*\.?zoom\.us\/j\/\d+/,
        /^https:\/\/.*\.?zoom\.us\/w\/\d+/,
        /^https:\/\/.*\.?zoom\.us\/meeting\/\d+/,
        /^https:\/\/.*\.?zoom\.us\/webinar\/register\//,
        /^https:\/\/.*\.?zoom\.us\/s\/\d+/,
        /^https:\/\/.*\.?zoom\.us\/rec\//
      ];
      
      return zoomPatterns.some(pattern => pattern.test(url));
    } catch {
      return false;
    }
  };

  const isSchedulingRequired = webinarType === 'live';
  const isZoomUrlRequired = webinarType === 'recorded';
  
  const isTypeComplete = () => {
    if (webinarType === 'live') {
      return formData?.date && formData?.time && formData?.duration;
    } else if (webinarType === 'recorded') {
      return (
        (selectedRecording && selectedRecording.play_url) ||
        (formData?.zoomUrl && validateZoomUrl(formData.zoomUrl))
      );
    }
    return false;
  };

  const getZoomUrlStatus = () => {
    if (!formData?.zoomUrl) return null;
    return validateZoomUrl(formData.zoomUrl) ? 'valid' : 'invalid';
  };

  const getZoomMeetingInfo = () => {
    if (!formData?.zoomUrl || !validateZoomUrl(formData.zoomUrl)) return null;
    
    try {
      const url = formData.zoomUrl;
      const meetingIdMatch = url.match(/\/j\/(\d+)/);
      const webinarIdMatch = url.match(/\/w\/(\d+)/);
      
      if (meetingIdMatch) {
        return { type: 'Meeting', id: meetingIdMatch[1] };
      } else if (webinarIdMatch) {
        return { type: 'Webinar', id: webinarIdMatch[1] };
      }
      return { type: 'Zoom Session', id: 'Valid' };
    } catch {
      return null;
    }
  };

  // Load existing recording from formData - NO API CALL
  useEffect(() => {
    if (webinarType === 'recorded' && formData?.recordingLinks && formData.recordingLinks.length > 0) {
      const primaryRecording = formData.recordingLinks.find(rec => rec.type === 'primary_recording');
      
      if (primaryRecording && !selectedRecording) {
        console.log('📁 Loading existing recording from formData',primaryRecording);
        const existingRec = {
          play_url: primaryRecording.url,
          topic: primaryRecording.title,
          duration: primaryRecording.duration || formData.duration || 0,
          file_type: primaryRecording.file_type || 'URL',
          recorded_date: primaryRecording.recorded_date || formData.scheduledDate || 'N/A',
          recorded_time:  primaryRecording.recorded_time ||'',
          file_size_mb: primaryRecording.size || 'N/A',
          recording_id: primaryRecording.zoom_meeting_id || null
        };
        setSelectedRecording(existingRec);
        setOriginalRecording(existingRec);
        setIsExistingRecording(true);
        setShouldFetchRecordings(false);

        const suggestedDuration = calculateDurationFromRecording(existingRec.duration);
        if (suggestedDuration ) {
          if (suggestedDuration === 'custom') {
            handleInputChange('duration', 'custom');
            handleInputChange('customDuration', existingRec.duration.toString());
          } else {
            handleInputChange('duration', suggestedDuration);
          }
        }
      }
    } else if (webinarType === 'recorded' && !formData?.recordingLinks) {
      console.log('🆕 No existing recording, will fetch from Zoom');
      setShouldFetchRecordings(true);
    }
  }, [webinarType, formData?.recordingLinks]);

  // Fetch recordings - ONLY when shouldFetchRecordings is true
  useEffect(() => {
    const fetchZoomRecordings = async () => {
      if (webinarType !== 'recorded' || !shouldFetchRecordings) {
        console.log('⏭️ Skipping recording fetch:', { webinarType, shouldFetchRecordings });
        return;
      }

      setIsLoadingRecordings(true);
      setRecordingError(null);
      
      try {
        console.log('📹 Fetching Zoom cloud recordings...');
        
        const webinarTitle = formData?.title || '';
        
        const params = {
          from_date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          page_size: 100,
        };
        
        if (webinarTitle) {
          params.topic = webinarTitle;
          params.min_score = 0;
          console.log(`🔍 Searching with title: "${webinarTitle}"`);
        }
        
        const response = await axiosInstance.get('/integrations/recordings/list/', {
          params
        });

        console.log('✅ Recordings response:', response.data);

        if (response.data?.success && response.data?.recordings) {
          const recordings = response.data.recordings;
          
          setAllRecordings(recordings);
          
          if (webinarTitle && recordings.length > 0) {
            console.log(`🎯 Found ${recordings.length} matching recordings`);
            const topMatches = recordings.slice(0, 15);
            setZoomRecordings(topMatches);
          } else {
            setZoomRecordings(recordings);
          }
          
          if (formData?.selectedRecording) {
            setSelectedRecording(formData.selectedRecording);
          }
        } else {
          setZoomRecordings([]);
          setAllRecordings([]);
        }
        
      } catch (error) {
        console.error('❌ Error fetching recordings:', error);
        setRecordingError(error.response?.data?.error || 'Failed to load recordings');
        setZoomRecordings([]);
        setAllRecordings([]);
      } finally {
        setIsLoadingRecordings(false);
      }
    };

    fetchZoomRecordings();
  }, [webinarType, formData?.title, shouldFetchRecordings]);

  // UPDATED: Pass ALL recording data
  const handleRecordingSelect = (recording) => {
    console.log('📹 Recording selected (FULL DATA):', recording);
    setSelectedRecording(recording);
    setShowManualEntry(false);
    setIsExistingRecording(false);

    // Calculate and set appropriate duration
    const suggestedDuration = calculateDurationFromRecording(recording.duration);
    console.log(`⏱️ Recording duration: ${recording.duration} min → Suggested: ${suggestedDuration}`);

    const updateData = {
      zoomUrl: recording.play_url || recording.share_url,
      zoomRecordingId: recording.recording_id,
      zoomMeetingId: recording.id,
      // PASS COMPLETE RECORDING OBJECT
      selectedRecording: {
        // All original fields from API
        id: recording.id,
        recording_id: recording.recording_id,
        uuid: recording.uuid,
        topic: recording.topic,
        start_time: recording.start_time,
        duration: recording.duration,
        recording_start: recording.recording_start,
        recording_end: recording.recording_end,
        file_type: recording.file_type,
        file_size: recording.file_size,
        file_size_mb: recording.file_size_mb,
        file_extension: recording.file_extension,
        play_url: recording.play_url,
        share_url: recording.share_url,
        download_url: recording.download_url,
        recording_type: recording.recording_type,
        status: recording.status,
        host_email: recording.host_email,
        host_id: recording.host_id,
        recorded_date: recording.recorded_date,
        recorded_time: recording.recorded_time,
        similarity_score: recording.similarity_score,
        match_reasons: recording.match_reasons,
      },
    };

    // Set duration based on calculation
    if (suggestedDuration === 'custom') {
      updateData.duration = 'custom';
      updateData.customDuration = recording.duration.toString();
    } else if (suggestedDuration) {
      updateData.duration = suggestedDuration;
      updateData.customDuration = '';
    } else {
      updateData.duration = recording.duration?.toString() || '';
    }

    console.log('📤 Update payload:', updateData);
    onUpdate(updateData);
  };

  const handleChangeRecording = () => {
   
    setSelectedRecording(null);
    setIsExistingRecording(false);
    setShouldFetchRecordings(true);

      
  };

  // UPDATED: Pass full data when reverting
  const handleUseExistingRecording = () => {
    console.log('↩️ Reverting to original existing recording (FULL DATA)');
    if (originalRecording) {
      setSelectedRecording(originalRecording);
      setIsExistingRecording(true);
      setShouldFetchRecordings(false);

      const suggestedDuration = calculateDurationFromRecording(originalRecording.duration);
      
      const updateData = {
        zoomUrl: originalRecording.play_url || originalRecording.share_url,
        zoomRecordingId: originalRecording.recording_id,
        zoomMeetingId: originalRecording.id,
        // PASS COMPLETE RECORDING OBJECT
        selectedRecording: originalRecording, // This already has all fields
      };

      if (suggestedDuration === 'custom') {
        updateData.duration = 'custom';
        updateData.customDuration = originalRecording.duration.toString();
      } else if (suggestedDuration) {
        updateData.duration = suggestedDuration;
        updateData.customDuration = '';
      } else {
        updateData.duration = originalRecording.duration?.toString() || '';
      }

      console.log('📤 Revert payload:', updateData);
      onUpdate(updateData);
    }
  };

  const handleManualUrlEntry = () => {
    setSelectedRecording(null);
    setShowManualEntry(true);
    setIsExistingRecording(false);
    setShouldFetchRecordings(false);
    onUpdate({
      zoomUrl: '',
      zoomRecordingId: null,
      zoomMeetingId: null,
      selectedRecording: null
    });
  };

  const handleBackToRecordingsList = () => {
    setShowManualEntry(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      const topMatches = allRecordings.slice(0, 15);
      setZoomRecordings(topMatches.length > 0 ? topMatches : allRecordings);
      return;
    }
    
    const filtered = allRecordings.filter(rec => 
      rec.topic.toLowerCase().includes(term.toLowerCase())
    );
    
    setZoomRecordings(filtered);
  };

  const renderRecordingsSection = () => {
    if (webinarType !== 'recorded') return null;

    const hasWebinarTitle = formData?.title && formData.title.length > 0;
    const showingMatches = hasWebinarTitle && allRecordings.length > 0;

    return (
      <div className="space-y-4">
        {/* Selected recording confirmation */}
        {selectedRecording && !showManualEntry && (
          <div className={`border rounded-lg p-4 ${
            isExistingRecording 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start space-x-3">
              <Icon 
                name={isExistingRecording ? "Info" : "CheckCircle"} 
                size={20} 
                className={`mt-0.5 flex-shrink-0 ${
                  isExistingRecording ? 'text-blue-600' : 'text-green-600'
                }`} 
              />
              <div className="flex-1">
                <h4 className={`text-sm font-medium mb-1 ${
                  isExistingRecording ? 'text-blue-800' : 'text-green-800'
                }`}>
                  {isExistingRecording ? '📁 Current Recording' : '✅ Recording Selected'}
                </h4>
                <p className={`text-sm mb-2 ${
                  isExistingRecording ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {isExistingRecording 
                    ? <>This webinar currently uses: <strong>{selectedRecording.topic}</strong></>
                    : <>Your webinar will use: <strong>{selectedRecording.topic}</strong></>
                  }
                </p>
                
                <div className="bg-white/70 rounded-lg p-3">
                  <div className={`text-xs space-y-1.5 ${
                    isExistingRecording ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <Icon name="Video" size={12} className="mt-0.5 flex-shrink-0" />
                      <span className="break-words">
                        <strong>Type:</strong>{selectedRecording.file_type}  Recording  {selectedRecording.recording_type && ( <>({selectedRecording.recording_type})</> )}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Calendar" size={12} className="mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Recorded:</strong> {selectedRecording.recorded_date} {selectedRecording.recorded_time && `at ${selectedRecording.recorded_time}`}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Clock" size={12} className="mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Duration:</strong> {selectedRecording.duration} minutes
                        {(() => {
                          const suggested = calculateDurationFromRecording(selectedRecording.duration);
                          if (suggested && suggested !== 'custom') {
                            const option = durationOptions.find(opt => opt.value === suggested);
                            return <> → Auto-set to <strong>{option?.label}</strong></>;
                          } else if (suggested === 'custom') {
                            return <> → Auto-set to <strong>Custom ({selectedRecording.duration} min)</strong></>;
                          }
                          return null;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="HardDrive" size={12} className="mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Size:</strong> {selectedRecording.file_size_mb} MB
                      </span>
                    </div>
                    {selectedRecording.recording_id && (
                      <div className="flex items-start space-x-2">
                        <Icon name="Hash" size={12} className="mt-0.5 flex-shrink-0" />
                        <span className="break-all font-mono text-[10px]">
                          <strong>Recording ID:</strong> {selectedRecording.recording_id}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start space-x-2">
                      <Icon name="Link" size={12} className="mt-0.5 flex-shrink-0" />
                      <span className="break-all font-mono text-[10px]">
                        <strong>URL:</strong> {selectedRecording.play_url || selectedRecording.share_url}
                      </span>
                       {selectedRecording.play_url && (
                                  <a
                                    href={selectedRecording.play_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                                    title="Preview recording"
                                  >
                                    <Icon name="ExternalLink" size={14} className="text-blue-600" />
                                  </a>
                                )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex gap-2">
                  {isExistingRecording && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleChangeRecording}
                      iconName="RefreshCw"
                      iconPosition="left"
                    >
                      Change Recording
                    </Button>
                  )}
                  {!isExistingRecording && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRecording(null);
                          setIsExistingRecording(false);
                        }}
                        iconName="X"
                        iconPosition="left"
                      >
                        Clear Selection
                      </Button>
                      {originalRecording && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUseExistingRecording}
                          iconName="RotateCcw"
                          iconPosition="left"
                        >
                          Use Existing Recording
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual URL Entry Section */}
        {!selectedRecording && (
          <>
            {(showManualEntry || (zoomRecordings.length === 0 && !isLoadingRecordings && !recordingError)) && (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <Icon name="Link" size={20} className="text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">
                        Manual URL Entry
                      </h4>
                      <p className="text-xs text-gray-600">
                        Enter your Zoom recording URL below
                      </p>
                    </div>
                    {zoomRecordings.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToRecordingsList}
                        iconName="ArrowLeft"
                        iconPosition="left"
                      >
                        Back to List
                      </Button>
                    )}
                  </div>
                </div>

                <Input
                  label="Zoom Recording URL"
                  type="url"
                  placeholder="https://zoom.us/rec/share/... or https://company.zoom.us/j/..."
                  value={formData?.zoomUrl || ''}
                  onChange={(e) => handleInputChange('zoomUrl', e?.target?.value)}
                  error={errors?.zoomUrl}
                  required
                  helpText="Paste your Zoom meeting, webinar, or cloud recording URL"
                />

                {formData?.zoomUrl && (
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    getZoomUrlStatus() === 'valid' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    {getZoomUrlStatus() === 'valid' ? (
                      <>
                        <Icon name="CheckCircle" size={16} className="text-green-600" />
                        <div className="flex-1">
                          <span className="text-sm text-green-700 font-medium">Valid Zoom URL</span>
                          {getZoomMeetingInfo() && (
                            <div className="text-xs text-green-600 mt-1">
                              {getZoomMeetingInfo().type} 
                              {getZoomMeetingInfo().id !== 'Valid' && ` ID: ${getZoomMeetingInfo().id}`}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Icon name="XCircle" size={16} className="text-red-600" />
                        <span className="text-sm text-red-700 font-medium">
                          Invalid Zoom URL - Please check the format
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-medium text-gray-800 mb-3 flex items-center">
                    <Icon name="Info" size={14} className="mr-1" />
                    Supported Zoom URL Types:
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <div>
                        <div className="font-medium">Meeting Join:</div>
                        <div className="text-gray-500 font-mono text-xs">https://zoom.us/j/1234567890</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <div>
                        <div className="font-medium">Webinar Join:</div>
                        <div className="text-gray-500 font-mono text-xs">https://zoom.us/w/1234567890</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <div>
                        <div className="font-medium">Cloud Recording:</div>
                        <div className="text-gray-500 font-mono text-xs">https://zoom.us/rec/share/...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!showManualEntry && !isLoadingRecordings && zoomRecordings.length === 0 && !recordingError && (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualUrlEntry}
                  iconName="Link"
                  iconPosition="left"
                >
                  Enter Recording URL Manually
                </Button>
              </div>
            )}

            {isLoadingRecordings && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin">
                    <Icon name="Loader" size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {hasWebinarTitle 
                        ? `Searching for recordings matching "${formData.title}"...`
                        : 'Loading your Zoom recordings...'
                      }
                    </p>
                    <p className="text-xs text-blue-600">Fetching cloud recordings from the last 90 days</p>
                  </div>
                </div>
              </div>
            )}

            {recordingError && !isLoadingRecordings && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800 mb-1">
                      Failed to Load Recordings
                    </h4>
                    <p className="text-sm text-red-700 mb-3">{recordingError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShouldFetchRecordings(true)}
                      iconName="RefreshCw"
                      iconPosition="left"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showingMatches && !isLoadingRecordings && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Sparkles" size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-purple-800 mb-1">
                      🎯 Smart Match Results
                    </h4>
                    <p className="text-sm text-purple-700 mb-2">
                      Showing recordings that match your webinar title: <strong>"{formData.title}"</strong>
                    </p>
                    <p className="text-xs text-purple-600">
                      Recordings sorted by similarity score. Top {Math.min(zoomRecordings.length, 15)} matches shown.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isLoadingRecordings && allRecordings.length > 0 && !showManualEntry && (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search recordings by name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
                <Icon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
            )}

            {!isLoadingRecordings && !showManualEntry && zoomRecordings.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Video" size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">
                      📹 {showingMatches ? 'Best Matching Recordings' : 'Your Zoom Cloud Recordings'} ({zoomRecordings.length})
                    </h4>
                    <p className="text-sm text-purple-700 mb-3">
                      {showingMatches 
                        ? 'Recordings sorted by similarity to your webinar title'
                        : 'Select a recording to use for this webinar'
                      }
                    </p>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {zoomRecordings.map((recording, index) => {
                        const suggestedDuration = calculateDurationFromRecording(recording.duration);
                        const durationLabel = suggestedDuration === 'custom' 
                          ? `Custom (${recording.duration} min)`
                          : durationOptions.find(opt => opt.value === suggestedDuration)?.label || `${recording.duration} min`;

                        return (
                          <div 
                            key={recording.recording_id || index}
                            className="p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md border-purple-200 bg-white/70 hover:border-purple-400 hover:bg-white"
                            onClick={() => handleRecordingSelect(recording)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Icon 
                                    name="PlayCircle" 
                                    size={16} 
                                    className="text-purple-500" 
                                  />
                                  <span className="text-sm font-medium text-gray-900 truncate">
                                    {recording.topic}
                                  </span>
                                  {recording.similarity_score > 0 && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 ${
                                      recording.similarity_score >= 70 
                                        ? 'bg-green-100 text-green-700' 
                                        : recording.similarity_score >= 50
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {recording.similarity_score}% match
                                    </span>
                                  )}
                                </div>
                                
                                {recording.match_reasons && recording.match_reasons.length > 0 && (
                                  <div className="text-xs text-purple-600 mb-1.5 ml-5">
                                    {recording.match_reasons.join(' • ')}
                                  </div>
                                )}
                                
                                <div className="text-xs text-gray-600 space-y-1.5 ml-5">
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <span className="flex items-center space-x-1">
                                      <Icon name="Calendar" size={12} />
                                      <span>{recording.recorded_date}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <Icon name="Clock" size={12} />
                                      <span>{recording.duration} min → {durationLabel}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <Icon name="File" size={12} />
                                      <span>{recording.file_type}({recording.recording_type})</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <Icon name="HardDrive" size={12} />
                                      <span>{recording.file_size_mb} MB</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                {recording.play_url && (
                                  <a
                                    href={recording.play_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                                    title="Preview recording"
                                  >
                                    <Icon name="ExternalLink" size={14} className="text-blue-600" />
                                  </a>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRecordingSelect(recording);
                                  }}
                                >
                                  Use This
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {allRecordings.length > zoomRecordings.length && !searchTerm && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setZoomRecordings(allRecordings)}
                          iconName="ChevronDown"
                          iconPosition="right"
                        >
                          Show All {allRecordings.length} Recordings
                        </Button>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManualUrlEntry}
                        iconName="Link"
                        iconPosition="left"
                      >
                        Or Enter Recording URL Manually
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isLoadingRecordings && !showManualEntry && zoomRecordings.length === 0 && !recordingError && shouldFetchRecordings && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-amber-800 mb-1">
                      No Cloud Recordings Found
                    </h4>
                    <p className="text-sm text-amber-700 mb-2">
                      We couldn't find any cloud recordings in your Zoom account from the last 90 days.
                    </p>
                    <p className="text-xs text-amber-600 mb-3">
                      Make sure your Zoom meetings are recorded to the cloud.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualUrlEntry}
                      iconName="Link"
                      iconPosition="left"
                    >
                      Enter Recording URL Manually
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };

  return (
    <div className="space-y-6">
      {/* ... Rest of the component remains the same ... */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Webinar Setup
        </h2>
        <p className="text-text-secondary">
          Choose your webinar type and provide the required details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Select
            label="Webinar Type"
            placeholder="Select webinar type"
            options={webinarTypeOptions}
            value={webinarType}
            onChange={handleWebinarTypeChange}
            error={errors?.webinarType}
            required
            helpText="Choose how your Zoom webinar will be delivered"
          />

          {webinarType === 'live' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Zap" size={20} className="text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-1">
                    ⚡ Live Zoom Session
                  </h4>
                  <p className="text-sm text-green-700 mb-2">
                    Real-time Zoom meeting/webinar with your audience. Scheduling is required.
                  </p>
                  <div className="text-xs text-green-600 space-y-1">
                    <div>✓ Real-time interaction via Zoom</div>
                    <div>✓ Chat, Q&A, and polls available</div>
                    <div>✓ Auto-creates Zoom meeting</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {webinarType === 'recorded' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Video" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    📹 Recorded Zoom Session
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Pre-recorded Zoom session accessible anytime. Provide your Zoom recording URL.
                  </p>
                  <div className="text-xs text-blue-600 space-y-1">
                    <div>✓ Available 24/7 after enrollment</div>
                    <div>✓ No timezone conflicts</div>
                    <div>✓ Zoom cloud recording quality</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSchedulingRequired && (
            <>
              <div className="border-t border-border pt-4">
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center">
                  <Icon name="Calendar" size={18} className="mr-2 text-primary" />
                  Live Session Scheduling
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Set your webinar time in EST - PST will be calculated automatically
                </p>
              </div>

              <Input
                label="Date"
                type="date"
                value={formData?.date || ''}
                onChange={(e) => handleInputChange('date', e?.target?.value)}
                error={errors?.date}
                required
                min={new Date()?.toISOString()?.split('T')?.[0]}
              />

              <Input
                label="Start Time (EST)"
                type="time"
                value={formData?.time || ''}
                onChange={(e) => handleInputChange('time', e?.target?.value)}
                error={errors?.time}
                required
                helpText="Enter time in Eastern Standard Time (EST/EDT)"
              />

              <Input
                label="Timezone"
                type="text"
                value="EST (Eastern Standard Time)"
                readOnly
                disabled
                helpText="All webinars are scheduled in EST timezone"
              />

              <Select
                label="Duration"
                placeholder="Select duration"
                options={durationOptions}
                value={formData?.duration || ''}
                onChange={(value) => handleInputChange('duration', value)}
                error={errors?.duration}
                required
              />

              {formData?.duration === 'custom' && (
                <Input
                  label="Custom Duration (minutes)"
                  type="number"
                  placeholder="Enter duration in minutes"
                  value={formData?.customDuration || ''}
                  onChange={(e) => handleInputChange('customDuration', e?.target?.value)}
                  error={errors?.customDuration}
                  min="15"
                  max="480"
                  required
                />
              )}

              {formatDateTime() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                    <Icon name="Clock" size={16} className="mr-2" />
                    Webinar Time Display
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm text-blue-700">
                      <div className="font-medium">{formatDateTime().date}</div>
                      <div className="text-lg font-bold mt-2 text-blue-900 font-mono">
                        {formatDateTime().combined}
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
                      Time entered in EST, displayed in both PST and EST for attendees
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {isZoomUrlRequired && (
            <>
              <div className="border-t border-border pt-4">
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center">
                  <Icon name="Video" size={18} className="mr-2 text-blue-600" />
                  Recorded Zoom Session
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Select from your cloud recordings or provide a Zoom recording URL
                </p>
              </div>

              {renderRecordingsSection()}

              <Select
                label="Duration"
                placeholder="Select duration"
                options={durationOptions}
                value={formData?.duration || ''}
                onChange={(value) => handleInputChange('duration', value)}
                error={errors?.duration}
                required
                helpText={selectedRecording ? `Recording duration: ${selectedRecording.duration} min (Auto-selected)` : undefined}
              />

              {formData?.duration === 'custom' && (
                <Input
                  label="Custom Duration (minutes)"
                  type="number"
                  placeholder="Enter duration in minutes"
                  value={formData?.customDuration || ''}
                  onChange={(e) => handleInputChange('customDuration', e?.target?.value)}
                  error={errors?.customDuration}
                  min="15"
                  max="480"
                  required
                />
              )}
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Icon name="Eye" size={16} color="var(--color-primary)" className="mr-2" />
              Session Overview
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Type:</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {webinarTypeOptions.find(opt => opt.value === webinarType)?.label}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Platform:</span>
                <span className="text-sm font-medium text-blue-600 flex items-center">
                  <Icon name="Video" size={14} className="mr-1" />
                  Zoom
                </span>
              </div>

              {isSchedulingRequired ? (
                formatDateTime() ? (
                  <>
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="text-sm text-text-secondary mb-1">Webinar Date:</div>
                      <div className="text-sm font-medium text-foreground">
                        {formatDateTime().date}
                      </div>
                      <div className="text-sm text-text-secondary mt-2 mb-1">Time Display:</div>
                      <div className="text-base font-bold text-primary font-mono">
                        {formatDateTime().combined}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Duration:</span>
                      <span className="text-sm font-medium text-foreground">
                        {formData?.duration === 'custom' 
                          ? `${formData?.customDuration} minutes` 
                          : durationOptions?.find(d => d?.value === formData?.duration)?.label || 'Not set'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Zoom Meeting:</span>
                      <span className="text-sm font-medium text-green-600">Auto-created</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-text-secondary italic">
                    Complete the scheduling details to see preview
                  </p>
                )
              ) : isZoomUrlRequired ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Availability:</span>
                    <span className="text-sm font-medium text-foreground">On-Demand</span>
                  </div>
                  {formData?.zoomUrl && getZoomMeetingInfo() && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Source:</span>
                      <span className="text-sm font-medium text-foreground">
                        {getZoomUrlStatus() === 'valid' ? '✓ Zoom Recording' : '⚠ Invalid URL'}
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="CheckSquare" size={16} color="var(--color-success)" className="mr-2" />
              Setup Checklist
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={webinarType ? "Check" : "Circle"} 
                  size={14} 
                  className={webinarType ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${webinarType ? 'text-green-600' : 'text-gray-500'}`}>
                  Webinar type selected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={isTypeComplete() ? "Check" : "Circle"} 
                  size={14} 
                  className={isTypeComplete() ? 'text-green-600' : 'text-gray-400'}
                />
                <span className={`text-xs ${isTypeComplete() ? 'text-green-600' : 'text-gray-500'}`}>
                  {isSchedulingRequired ? 'Scheduling completed' : 'Zoom URL provided'}
                </span>
              </div>
            </div>
          </div>
{webinarType === 'recorded' && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
              <Icon name="Clock" size={16} className="mr-2" />
              Duration Auto-Selection
            </h3>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Recording duration is automatically rounded up</li>
              <li>• Example: 56 min → 1 hour (60 min)</li>
              <li>• Example: 65 min → 1.25 hours (75 min)</li>
              <li>• Recordings over 6 hours use custom duration</li>
            </ul>
          </div>)
  }
          
         {webinarType !==  'recorded' && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
  <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
    <Icon name="Clock" size={16} className="mr-2" />
    Time Display Format
  </h3>
  <ul className="text-xs text-amber-700 space-y-1">
    <li>• Enter time in EST (Eastern Standard/Daylight Time)</li>
    <li>• PST is automatically calculated (EST - 3 hours)</li>
    <li>• Display format: <code className="bg-amber-100 px-1 rounded text-amber-900">9:00 AM PST | 12:00 PM EST</code></li>
    <li>• Consistent time display for all attendees</li>
  </ul>
</div>)}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrevious}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          <span className="hidden sm:inline">Back to Basic Info</span>
          <span className="sm:hidden">Back</span>
        </Button>
        
        <Button
          variant="default"
          onClick={handleNext}
          iconName="ArrowRight"
          iconPosition="right"
          disabled={!webinarType || !isTypeComplete()}
        >
          <span className="hidden sm:inline">Continue to Pricing</span>
          <span className="sm:hidden">Continue</span>
        </Button>
      </div>
    </div>
  );
};

export default SchedulingStep;
