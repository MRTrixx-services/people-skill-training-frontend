// src/pages/admin/Webinars/CreateWebinar/components/ZoomMeetingReplaceModal.jsx

import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const ZoomMeetingReplaceModal = ({ 
  isOpen, 
  onClose, 
  currentMeeting, 
  newMeeting, 
  onConfirm,
  isProcessing = false
}) => {
  const [selectedAction, setSelectedAction] = useState('unlink');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedAction);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200); // Wait for animation
  };

  return (
    <>
      {/* Backdrop with animation */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1010] transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal with animation */}
      <div className="fixed inset-0 z-[1011] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`bg-white rounded-xl shadow-2xl max-w-3xl w-full pointer-events-auto transform transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Icon name="AlertTriangle" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  Replace Existing Zoom Meeting?
                </h3>
                <p className="text-sm text-amber-100">
                  This webinar already has a linked Zoom meeting
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors hover:rotate-90 transform duration-200"
              disabled={isProcessing}
            >
              <Icon name="X" size={22} />
            </button>
          </div>

          {/* Scrollable Content with Custom Scrollbar */}
          <div 
            className="overflow-y-auto p-6 space-y-5" 
            style={{ 
              maxHeight: 'calc(90vh - 180px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E0 transparent'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 10px;
              }
              div::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #CBD5E0 0%, #94A3B8 100%);
                border-radius: 10px;
                transition: background 0.3s ease;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #94A3B8 0%, #64748B 100%);
              }
            `}</style>

            {/* Current Meeting */}
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 transform transition-all hover:scale-[1.01] hover:shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Link" size={18} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-red-900 mb-2 flex items-center">
                    <Icon name="AlertCircle" size={14} className="mr-1" />
                    Currently Linked Meeting
                  </h4>
                  <div className="bg-white/70 rounded-lg p-3 space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <Icon name="FileText" size={13} className="text-red-600" />
                      <span className="font-semibold text-red-900">{currentMeeting?.topic}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-red-700">
                      <div className="flex items-center space-x-1.5">
                        <Icon name="Hash" size={12} />
                        <span className="font-mono">{currentMeeting?.meeting_id || currentMeeting?.id}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Icon name="Calendar" size={12} />
                        <span>{new Date(currentMeeting?.start_time).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Icon name="Clock" size={12} />
                        <span>{new Date(currentMeeting?.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Icon name="Timer" size={12} />
                        <span>{currentMeeting?.duration} min</span>
                      </div>
                    </div>
                  </div>
                  {currentMeeting?.join_url && (
                    <a
                      href={currentMeeting.join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      <Icon name="ExternalLink" size={12} className="mr-1" />
                      Open in Zoom
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow Down with Animation */}
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center animate-bounce">
                <Icon name="ArrowDown" size={16} className="text-gray-600" />
              </div>
            </div>

            {/* New Meeting */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 transform transition-all hover:scale-[1.01] hover:shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Plus" size={18} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-green-900 mb-2 flex items-center">
                    <Icon name="Check" size={14} className="mr-1" />
                    New Meeting to Link
                  </h4>
                  <div className="bg-white/70 rounded-lg p-3 space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <Icon name="FileText" size={13} className="text-green-600" />
                      <span className="font-semibold text-green-900">{newMeeting?.topic}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                      <div className="flex items-center space-x-1.5">
                        <Icon name="Hash" size={12} />
                        <span className="font-mono">{newMeeting?.id}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Icon name="Calendar" size={12} />
                        <span>{new Date(newMeeting?.start_time).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Icon name="Clock" size={12} />
                        <span>{new Date(newMeeting?.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Icon name="Timer" size={12} />
                        <span>{newMeeting?.duration} min</span>
                      </div>
                    </div>
                  </div>
                  {newMeeting?.join_url && (
                    <a
                      href={newMeeting.join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-xs text-green-600 hover:text-green-800 font-medium transition-colors"
                    >
                      <Icon name="ExternalLink" size={12} className="mr-1" />
                      Open in Zoom
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Action Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <Icon name="Settings" size={14} className="mr-2" />
                Choose Action for Current Meeting
              </h4>
              
              <div className="space-y-3">
                {/* Unlink Option */}
                <label
                  className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAction === 'unlink'
                      ? 'border-blue-500 bg-blue-100 shadow-md scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="action"
                    value="unlink"
                    checked={selectedAction === 'unlink'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="mt-1 mr-3"
                    disabled={isProcessing}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">
                        Unlink Only (Recommended)
                      </span>
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium">
                        Safe
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Remove the link from this webinar but keep the meeting in Zoom. 
                      The meeting will still exist and can be used elsewhere.
                    </p>
                    <div className="mt-2 flex items-start space-x-1.5 text-xs text-green-700">
                      <Icon name="Check" size={12} className="mt-0.5" />
                      <span>Meeting remains in your Zoom account</span>
                    </div>
                  </div>
                </label>

                {/* Delete Option */}
                <label
                  className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAction === 'delete'
                      ? 'border-red-500 bg-red-100 shadow-md scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="action"
                    value="delete"
                    checked={selectedAction === 'delete'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="mt-1 mr-3"
                    disabled={isProcessing}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">
                        Delete from Zoom
                      </span>
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                        Permanent
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Permanently delete the meeting from Zoom and unlink it from this webinar. 
                      This action cannot be undone.
                    </p>
                    <div className="mt-2 flex items-start space-x-1.5 text-xs text-red-700">
                      <Icon name="AlertTriangle" size={12} className="mt-0.5" />
                      <span>Meeting will be completely removed from Zoom</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Warning Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">What happens next:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>The selected action will be performed on the current meeting</li>
                    <li>The new meeting will be linked to this webinar</li>
                    <li>Attendees will need to use the new meeting link</li>
                    <li>You should notify registered attendees about the change</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3 rounded-b-xl">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="hover:scale-105 transition-transform"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`hover:scale-105 transition-all ${
                selectedAction === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Icon name={selectedAction === 'delete' ? 'Trash2' : 'Link'} size={16} className="mr-2" />
                  {selectedAction === 'delete' ? 'Delete & Link New' : 'Unlink & Link New'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZoomMeetingReplaceModal;
