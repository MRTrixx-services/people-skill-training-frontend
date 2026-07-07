import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AudioVideoPreview = () => {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState('default');
  const [selectedMicrophone, setSelectedMicrophone] = useState('default');
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef(null);

  const mockCameras = [
    { id: 'default', label: 'Built-in Camera' },
    { id: 'external', label: 'External Webcam' }
  ];

  const mockMicrophones = [
    { id: 'default', label: 'Built-in Microphone' },
    { id: 'headset', label: 'Bluetooth Headset' },
    { id: 'external', label: 'External Microphone' }
  ];

  useEffect(() => {
    // Simulate audio level monitoring
    if (microphoneEnabled) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [microphoneEnabled]);

  const handleCameraToggle = () => {
    setCameraEnabled(!cameraEnabled);
  };

  const handleMicrophoneToggle = () => {
    setMicrophoneEnabled(!microphoneEnabled);
  };

  const handleTestAudio = () => {
    // Simulate audio test
    console.log('Testing audio...');
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-elevation-2 border border-border">
      <h2 className="text-xl font-semibold text-text-primary mb-6">Audio & Video Preview</h2>
      {/* Video Preview */}
      <div className="mb-6">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
          {cameraEnabled ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
              <div className="text-center text-white">
                <Icon name="User" size={48} className="mx-auto mb-2 opacity-80" />
                <p className="text-sm opacity-80">Camera Preview</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center text-gray-400">
                <Icon name="VideoOff" size={48} className="mx-auto mb-2" />
                <p className="text-sm">Camera is off</p>
              </div>
            </div>
          )}
          
          {/* Camera Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <Button
              variant={cameraEnabled ? "default" : "outline"}
              size="sm"
              onClick={handleCameraToggle}
              iconName={cameraEnabled ? "Video" : "VideoOff"}
              iconSize={16}
              className={cameraEnabled ? "bg-white/20 hover:bg-white/30 text-white border-white/30" : "bg-gray-800/80 hover:bg-gray-700/80 text-white border-gray-600"}
            >
              {cameraEnabled ? "On" : "Off"}
            </Button>
            
            <select 
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e?.target?.value)}
              className="bg-gray-800/80 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              {mockCameras?.map(camera => (
                <option key={camera?.id} value={camera?.id}>{camera?.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Audio Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-text-primary">Microphone</h3>
          <Button
            variant={microphoneEnabled ? "default" : "outline"}
            size="sm"
            onClick={handleMicrophoneToggle}
            iconName={microphoneEnabled ? "Mic" : "MicOff"}
            iconSize={16}
          >
            {microphoneEnabled ? "On" : "Off"}
          </Button>
        </div>

        {/* Microphone Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Select Microphone
          </label>
          <select 
            value={selectedMicrophone}
            onChange={(e) => setSelectedMicrophone(e?.target?.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {mockMicrophones?.map(mic => (
              <option key={mic?.id} value={mic?.id}>{mic?.label}</option>
            ))}
          </select>
        </div>

        {/* Audio Level Indicator */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Audio Level</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestAudio}
              iconName="Volume2"
              iconSize={16}
            >
              Test
            </Button>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-100 ${
                audioLevel > 70 ? 'bg-success' : 
                audioLevel > 30 ? 'bg-warning': 'bg-primary'
              }`}
              style={{ width: `${microphoneEnabled ? audioLevel : 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {microphoneEnabled ? 'Speak to test your microphone' : 'Microphone is muted'}
          </p>
        </div>

        {/* Audio Settings */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Settings" size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Audio Settings</span>
          </div>
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-center justify-between">
              <span>Noise Cancellation</span>
              <span className="text-success">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Echo Cancellation</span>
              <span className="text-success">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Gain Control</span>
              <span className="text-success">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioVideoPreview;