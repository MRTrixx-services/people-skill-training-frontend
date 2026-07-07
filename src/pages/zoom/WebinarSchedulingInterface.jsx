import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const WebinarSchedulingInterface = () => {
  const navigate = useNavigate();
  const { webinarId } = useParams(); // If editing existing webinar
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [zoomConnectionStatus, setZoomConnectionStatus] = useState('connected');

  // Form state
  const [webinarForm, setWebinarForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    date: '',
    time: '',
    duration: 60,
    timezone: 'America/New_York',
    isRecurring: false,
    recurrencePattern: 'weekly',
    recurrenceEnd: '',
    registrationRequired: true,
    maxAttendees: 100,
    price: 0,
    // Zoom specific settings
    zoomSettings: {
      waitingRoomEnabled: true,
      recordingEnabled: true,
      recordingType: 'cloud',
      attendeeVideoEnabled: false,
      attendeeAudioEnabled: false,
      chatEnabled: true,
      qaEnabled: true,
      pollsEnabled: true,
      breakoutRoomsEnabled: false,
      passwordProtected: true,
      password: '',
      joinBeforeHost: false,
      muteParticipantsOnEntry: true,
      approveOrDenyEntry: true,
      registrationApproval: 'automatic'
    }
  });

  const [zoomAccount, setZoomAccount] = useState(null);

  // Mock user and zoom account data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Dr. Michael Chen",
      email: "michael.chen@email.com",
      role: "instructor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);

    const mockZoomAccount = {
      email: "michael.chen@zoom.com",
      accountId: "abc123def456",
      plan: "Pro",
      features: {
        webinarsEnabled: true,
        maxAttendees: 500,
        cloudRecording: true,
        customBranding: true
      }
    };
    setZoomAccount(mockZoomAccount);

    // If editing, populate form with existing data
    if (webinarId) {
      // Mock existing webinar data
      setWebinarForm(prev => ({
        ...prev,
        title: "Advanced React Patterns and Performance Optimization",
        description: "Deep dive into advanced React patterns including render props, higher-order components, and performance optimization techniques.",
        category: "web-development",
        date: "2024-12-15",
        time: "14:00",
        duration: 120
      }));
    }
  }, [webinarId]);

  const categoryOptions = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'cloud-computing', label: 'Cloud Computing' }
  ];

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/New_York', label: 'Pacific Time (PT)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' }
  ];

  const recurrenceOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Every 2 weeks' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleInputChange = (field, value) => {
    if (field.startsWith('zoomSettings.')) {
      const settingField = field.split('.')[16];
      setWebinarForm(prev => ({
        ...prev,
        zoomSettings: {
          ...prev.zoomSettings,
          [settingField]: value
        }
      }));
    } else {
      setWebinarForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleReconnectZoom = async () => {
    setIsConnecting(true);
    setZoomConnectionStatus('connecting');
    
    // Simulate reconnection process
    setTimeout(() => {
      setZoomConnectionStatus('connected');
      setIsConnecting(false);
    }, 2000);
  };

  const testZoomConnection = async () => {
    setIsConnecting(true);
    
    // Simulate connection test
    setTimeout(() => {
      setIsConnecting(false);
      alert('Zoom connection test successful!');
    }, 1500);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleInputChange('zoomSettings.password', password);
  };

  const handleSaveWebinar = async () => {
    // Basic validation
    if (!webinarForm.title.trim() || !webinarForm.date || !webinarForm.time) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call to create/update webinar and schedule on Zoom
      setTimeout(() => {
        console.log('Webinar scheduled:', webinarForm);
        
        const webinarData = {
          id: webinarId || Math.random().toString(36).substr(2, 9),
          ...webinarForm,
          zoomMeetingId: '123-456-789',
          zoomJoinUrl: 'https://zoom.us/j/123456789',
          status: 'scheduled'
        };

        setIsSaving(false);
        navigate('/my-webinars', {
          state: { successMessage: `Webinar "${webinarForm.title}" scheduled successfully!` }
        });
      }, 2000);

    } catch (error) {
      console.error('Failed to schedule webinar:', error);
      setIsSaving(false);
      alert('Failed to schedule webinar. Please try again.');
    }
  };

  const getConnectionStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'connecting':
        return { icon: 'RefreshCw', color: 'text-warning animate-spin' };
      case 'disconnected':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/instructor-dashboard' },
    { label: 'My Webinars', href: '/my-webinars' },
    { label: webinarId ? 'Edit Webinar' : 'Create Webinar', href: null }
  ];

  const connectionStatus = getConnectionStatusIcon(zoomConnectionStatus);

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userRole="instructor"
        currentPath="/create-webinar"
      />

      <AppHeader
        user={user}
        notifications={[]}
        onLogout={handleLogout}
        onNotificationClick={() => {}}
      />

      <main className={`transition-all duration-300 ${
        isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } lg:pt-0 pt-16`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {webinarId ? 'Edit Webinar' : 'Create New Webinar'}
            </h1>
            <p className="text-text-secondary">Schedule and configure your Zoom webinar</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Zoom Connection Status */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Zoom Integration</h2>
                  <div className="flex items-center space-x-2">
                    <Icon name={connectionStatus.icon} size={16} className={connectionStatus.color} />
                    <span className={`text-sm font-medium ${
                      zoomConnectionStatus === 'connected' ? 'text-success' :
                      zoomConnectionStatus === 'connecting' ? 'text-warning' : 'text-error'
                    }`}>
                      {zoomConnectionStatus === 'connected' ? 'Connected' :
                       zoomConnectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                    </span>
                  </div>
                </div>

                {zoomAccount && zoomConnectionStatus === 'connected' ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Z</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-success">Connected to Zoom</p>
                        <p className="text-sm text-muted-foreground">{zoomAccount.email}</p>
                        <p className="text-sm text-muted-foreground">Plan: {zoomAccount.plan}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testZoomConnection}
                        loading={isConnecting}
                        iconName="TestTube"
                        iconPosition="left"
                      >
                        Test Connection
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">
                          {zoomAccount.features.maxAttendees}
                        </div>
                        <div className="text-sm text-muted-foreground">Max Attendees</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">
                          {zoomAccount.features.cloudRecording ? 'Yes' : 'No'}
                        </div>
                        <div className="text-sm text-muted-foreground">Cloud Recording</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">
                          {zoomAccount.features.customBranding ? 'Yes' : 'No'}
                        </div>
                        <div className="text-sm text-muted-foreground">Custom Branding</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <Icon name="AlertTriangle" size={48} className="mx-auto mb-4 text-warning" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Zoom Connection Required</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your Zoom account to schedule webinars
                    </p>
                    <Button
                      variant="default"
                      onClick={handleReconnectZoom}
                      loading={isConnecting}
                      iconName="Zap"
                      iconPosition="left"
                    >
                      {isConnecting ? 'Connecting...' : 'Connect to Zoom'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Basic Information</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Webinar Title"
                    value={webinarForm.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter webinar title"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={webinarForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe what attendees will learn..."
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Category"
                      options={categoryOptions}
                      value={webinarForm.category}
                      onChange={(value) => handleInputChange('category', value)}
                      required
                    />

                    <Input
                      label="Price (₹)"
                      type="number"
                      value={webinarForm.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Settings */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Schedule Settings</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Date"
                      type="date"
                      value={webinarForm.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />

                    <Input
                      label="Time"
                      type="time"
                      value={webinarForm.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Duration"
                      options={durationOptions}
                      value={webinarForm.duration}
                      onChange={(value) => handleInputChange('duration', parseInt(value))}
                      required
                    />

                    <Select
                      label="Timezone"
                      options={timezoneOptions}
                      value={webinarForm.timezone}
                      onChange={(value) => handleInputChange('timezone', value)}
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={webinarForm.isRecurring}
                      onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">Recurring Webinar</p>
                      <p className="text-xs text-muted-foreground">
                        Create a series of webinars with the same settings
                      </p>
                    </div>
                  </div>

                  {webinarForm.isRecurring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                      <Select
                        label="Repeat"
                        options={recurrenceOptions}
                        value={webinarForm.recurrencePattern}
                        onChange={(value) => handleInputChange('recurrencePattern', value)}
                      />

                      <Input
                        label="End Date"
                        type="date"
                        value={webinarForm.recurrenceEnd}
                        onChange={(e) => handleInputChange('recurrenceEnd', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Settings */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Registration Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={webinarForm.registrationRequired}
                      onChange={(e) => handleInputChange('registrationRequired', e.target.checked)}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">Require Registration</p>
                      <p className="text-xs text-muted-foreground">
                        Attendees must register before joining the webinar
                      </p>
                    </div>
                  </div>

                  <Input
                    label="Maximum Attendees"
                    type="number"
                    value={webinarForm.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value))}
                    min="1"
                    max={zoomAccount?.features.maxAttendees || 100}
                  />
                </div>
              </div>

              {/* Zoom Advanced Settings */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Zoom Settings</h2>
                
                <div className="space-y-6">
                  {/* Security Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={webinarForm.zoomSettings.waitingRoomEnabled}
                          onChange={(e) => handleInputChange('zoomSettings.waitingRoomEnabled', e.target.checked)}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Enable Waiting Room</p>
                          <p className="text-xs text-muted-foreground">
                            Screen attendees before they join the webinar
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={webinarForm.zoomSettings.passwordProtected}
                          onChange={(e) => handleInputChange('zoomSettings.passwordProtected', e.target.checked)}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Password Protection</p>
                          <p className="text-xs text-muted-foreground">
                            Require a password to join the webinar
                          </p>
                        </div>
                      </div>

                      {webinarForm.zoomSettings.passwordProtected && (
                        <div className="flex space-x-2 pl-8">
                          <Input
                            label="Password"
                            value={webinarForm.zoomSettings.password}
                            onChange={(e) => handleInputChange('zoomSettings.password', e.target.value)}
                            placeholder="Enter password"
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            onClick={generateRandomPassword}
                            className="mt-6"
                            iconName="RefreshCw"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recording Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Recording</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={webinarForm.zoomSettings.recordingEnabled}
                          onChange={(e) => handleInputChange('zoomSettings.recordingEnabled', e.target.checked)}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Auto Recording</p>
                          <p className="text-xs text-muted-foreground">
                            Automatically record the webinar
                          </p>
                        </div>
                      </div>

                      {webinarForm.zoomSettings.recordingEnabled && (
                        <div className="pl-8">
                          <Select
                            label="Recording Type"
                            options={[
                              { value: 'cloud', label: 'Cloud Recording' },
                              { value: 'local', label: 'Local Recording' }
                            ]}
                            value={webinarForm.zoomSettings.recordingType}
                            onChange={(value) => handleInputChange('zoomSettings.recordingType', value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendee Controls */}
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Attendee Controls</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={webinarForm.zoomSettings.chatEnabled}
                          onChange={(e) => handleInputChange('zoomSettings.chatEnabled', e.target.checked)}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Enable Chat</p>
                          <p className="text-xs text-muted-foreground">Allow attendees to chat</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={webinarForm.zoomSettings.qaEnabled}
                          onChange={(e) => handleInputChange('zoomSettings.qaEnabled', e.target.checked)}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Enable Q&A</p>
                          <p className="text-xs text-muted-foreground">Allow questions from attendees</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={webinarForm.zoomSettings.pollsEnabled}
                          onChange={(e) => handleInputChange('zoomSettings.pollsEnabled', e.target.checked)}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Enable Polls</p>
                          <p className="text-xs text-muted-foreground">Create interactive polls</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={webinarForm.zoomSettings.muteParticipantsOnEntry}
                          onChange={(e) => handleInputChange('zoomSettings.muteParticipantsOnEntry', e.target.checked)}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Mute on Entry</p>
                          <p className="text-xs text-muted-foreground">Mute attendees when they join</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
                
                {webinarForm.title ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground line-clamp-2">
                        {webinarForm.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">By {user?.name}</p>
                    </div>
                    
                    {webinarForm.date && webinarForm.time && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Calendar" size={14} />
                        <span>
                          {new Date(`${webinarForm.date}T${webinarForm.time}`).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    
                    {webinarForm.time && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Clock" size={14} />
                        <span>
                          {new Date(`2024-01-01T${webinarForm.time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })} ({webinarForm.duration} min)
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Users" size={14} />
                      <span>Max {webinarForm.maxAttendees} attendees</span>
                    </div>
                    
                    {webinarForm.price > 0 && (
                      <div className="flex items-center space-x-2 text-sm font-medium text-primary">
                        <Icon name="DollarSign" size={14} />
                        <span>₹{webinarForm.price}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Icon name="Eye" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Fill in the details to see preview</p>
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Tips</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={14} className="text-primary mt-0.5" />
                    <span className="text-muted-foreground">
                      Enable waiting room for better control over attendees
                    </span>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={14} className="text-primary mt-0.5" />
                    <span className="text-muted-foreground">
                      Cloud recording allows attendees to access the session later
                    </span>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={14} className="text-primary mt-0.5" />
                    <span className="text-muted-foreground">
                      Q&A and polls increase attendee engagement
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Actions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="space-y-3">
                  <Button
                    variant="default"
                    onClick={handleSaveWebinar}
                    disabled={!webinarForm.title || !webinarForm.date || zoomConnectionStatus !== 'connected'}
                    loading={isSaving}
                    iconName="Save"
                    iconPosition="left"
                    className="w-full"
                  >
                    {isSaving ? 'Scheduling...' : (webinarId ? 'Update Webinar' : 'Schedule Webinar')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/my-webinars')}
                    iconName="ArrowLeft"
                    iconPosition="left"
                    className="w-full"
                  >
                    Back to My Webinars
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebinarSchedulingInterface;
