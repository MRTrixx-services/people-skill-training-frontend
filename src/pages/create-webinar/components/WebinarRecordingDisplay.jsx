// WebinarRecordingDisplay.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const WebinarRecordingDisplay = ({ webinar }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Validate Zoom URL
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

  // Get meeting info from URL
  const getZoomMeetingInfo = (url) => {
    if (!url || !validateZoomUrl(url)) return null;
    
    try {
      const meetingIdMatch = url.match(/\/j\/(\d+)/);
      const webinarIdMatch = url.match(/\/w\/(\d+)/);
      const recMatch = url.match(/\/rec\//);
      
      if (recMatch) {
        return { type: 'Cloud Recording', icon: 'Video', color: 'blue' };
      } else if (meetingIdMatch) {
        return { type: 'Meeting', id: meetingIdMatch[1], icon: 'Users', color: 'green' };
      } else if (webinarIdMatch) {
        return { type: 'Webinar', id: webinarIdMatch[1], icon: 'Radio', color: 'purple' };
      }
      return { type: 'Zoom Session', icon: 'Video', color: 'blue' };
    } catch {
      return null;
    }
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  // Copy to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(recordingUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get primary recording or use zoom_url
  const primaryRecording = webinar?.recording_links?.find(
    rec => rec.type === 'primary_recording'
  );
  
  const recordingUrl = primaryRecording?.url || webinar?.zoom_url;
  const isValidUrl = validateZoomUrl(recordingUrl);
  const meetingInfo = getZoomMeetingInfo(recordingUrl);

  // Don't render if no recording URL or not a recorded webinar
  if (!recordingUrl || webinar?.webinar_type !== 'recorded') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="PlayCircle" size={28} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recording Access</h2>
            <p className="text-sm text-gray-600">Watch this session anytime</p>
          </div>
        </div>
        {isValidUrl && (
          <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center">
            <Icon name="CheckCircle" size={16} className="mr-2" />
            Available Now
          </span>
        )}
      </div>

      {/* Main Recording Card */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-300 rounded-2xl overflow-hidden shadow-xl">
        {/* Recording Info Section */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {webinar.title}
            </h3>
            <p className="text-sm text-gray-600">
              {webinar.description ? 
                webinar.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                : 'Access this pre-recorded webinar session anytime'
              }
            </p>
          </div>
          
          {/* Recording Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {webinar.duration && (
              <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-700 mb-1">
                  <Icon name="Clock" size={18} />
                  <span className="text-xs font-medium">Duration</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {formatDuration(webinar.duration)}
                </p>
              </div>
            )}
            
            {meetingInfo && (
              <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2 text-purple-700 mb-1">
                  <Icon name={meetingInfo.icon} size={18} />
                  <span className="text-xs font-medium">Type</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{meetingInfo.type}</p>
              </div>
            )}
            
            {primaryRecording?.file_type && (
              <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2 text-green-700 mb-1">
                  <Icon name="File" size={18} />
                  <span className="text-xs font-medium">Format</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{primaryRecording.file_type}</p>
              </div>
            )}
            
            {primaryRecording?.size && (
              <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2 text-orange-700 mb-1">
                  <Icon name="HardDrive" size={18} />
                  <span className="text-xs font-medium">Size</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {(primaryRecording.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href={recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="md:col-span-2 flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Icon name="Play" size={20} className="mr-3" />
              Watch Recording Now
            </a>
            
            <button
              onClick={handleCopyUrl}
              className="flex items-center justify-center px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-medium border-2 border-gray-300 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Icon name={copySuccess ? "Check" : "Copy"} size={18} className="mr-2" />
              {copySuccess ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Recording URL Display */}
        <div className="bg-white/90 border-t-2 border-blue-200 px-6 py-4">
          <div className="flex items-start space-x-3">
            <Icon name="Link" size={16} className="text-gray-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 mb-1">Recording URL:</p>
              <p className="text-xs font-mono text-gray-600 break-all bg-gray-100 rounded px-2 py-1">
                {recordingUrl}
              </p>
            </div>
            <a
              href={recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <Icon name="ExternalLink" size={16} className="text-blue-600" />
            </a>
          </div>
        </div>
      </div>

      {/* Embedded Player */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700 flex items-center">
            <Icon name="MonitorPlay" size={16} className="mr-2" />
            Video Player
          </p>
        </div>
        <div className="aspect-video relative bg-gray-900">
          <iframe
            src={recordingUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; microphone; camera"
            allowFullScreen
            title={webinar.title}
          />
        </div>
      </div>

      {/* Speaker Info (if available) */}
      {webinar.speaker && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 shadow-md">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Icon name="User" size={16} className="mr-2" />
            Presented by
          </h4>
          <div className="flex items-center space-x-4">
            {webinar.speaker.avatar && (
              <img
                src={webinar.speaker.avatar}
                alt={webinar.speaker.full_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 shadow-md"
              />
            )}
            <div>
              <p className="text-lg font-bold text-gray-900">
                {webinar.speaker.full_name}
              </p>
              <p className="text-sm text-gray-600">
                {webinar.speaker.title}
                {webinar.speaker.company && ` at ${webinar.speaker.company}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Badge */}
      {webinar.category && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: webinar.category.color || '#3B82F6' }}
            >
              <Icon name="Tag" size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-semibold text-gray-900">
                {webinar.category.name}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
            {webinar.skill_level}
          </span>
        </div>
      )}
    </div>
  );
};

export default WebinarRecordingDisplay;
