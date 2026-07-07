import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const logoInputRef = useRef(null);

  // Settings data
  const [settings, setSettings] = useState({
    general: {
      siteName: 'PeopleSkillTraining',
      siteDescription: 'Professional webinar hosting and learning platform',
      logoUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=80&fit=crop',
      defaultTimezone: 'America/New_York',
      defaultLanguage: 'en',
      allowPublicRegistration: true,
      requireEmailVerification: true,
      maintenanceMode: false
    },
    email: {
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: '587',
      smtpUsername: 'apikey',
      smtpPassword: '',
      smtpEncryption: 'tls',
      fromEmail: 'noreply@peopleskilltraining.com',
      fromName: 'PeopleSkillTraining',
      enableEmailNotifications: true,
      welcomeEmailEnabled: true,
      reminderEmailsEnabled: true
    },
    integrations: {
      zoom: {
        apiKey: '',
        apiSecret: '',
        webhookSecret: '',
        enabled: true
      },
      razorpay: {
        keyId: '',
        keySecret: '',
        webhookSecret: '',
        enabled: true,
        testMode: false
      },
      googleAnalytics: {
        trackingId: '',
        enabled: false
      },
      cloudinary: {
        cloudName: '',
        apiKey: '',
        apiSecret: '',
        enabled: false
      }
    },
    security: {
      passwordMinLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      sessionTimeout: 120,
      twoFactorRequired: false,
      allowedIpRanges: '',
      enableAuditLogs: true
    },
    maintenance: {
      backupFrequency: 'daily',
      retentionDays: 30,
      autoBackup: true,
      maintenanceWindow: '02:00',
      enableSystemAlerts: true,
      alertThreshold: 80,
      debugMode: false
    }
  });

  // Mock admin user
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@peopleskilltraining.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'integrations', label: 'Integrations', icon: 'Zap' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'maintenance', label: 'Maintenance', icon: 'Tool' }
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

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files;
    if (file) {
      // In real app, this would upload to cloud storage
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('general', 'logoUrl', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving settings:', settings);
      setSuccessMessage('Settings saved successfully!');
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  const handleTestConnection = (service) => {
    console.log(`Testing ${service} connection...`);
    // In real app, this would test the service connection
    alert(`${service} connection test would be performed here`);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Site Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={settings.general.siteName}
              onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
              placeholder="Enter site name"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Site Description
              </label>
              <textarea
                value={settings.general.siteDescription}
                onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                placeholder="Enter site description..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <Select
              label="Default Timezone"
              options={timezoneOptions}
              value={settings.general.defaultTimezone}
              onChange={(value) => handleInputChange('general', 'defaultTimezone', value)}
              required
            />

            <Select
              label="Default Language"
              options={languageOptions}
              value={settings.general.defaultLanguage}
              onChange={(value) => handleInputChange('general', 'defaultLanguage', value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Site Logo
            </label>
            <div className="space-y-4">
              <div className="w-48 h-20 border border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {settings.general.logoUrl ? (
                  <Image
                    src={settings.general.logoUrl}
                    alt="Site logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Icon name="Image" size={24} className="text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">No logo uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logoInputRef.current?.click()}
                  iconName="Upload"
                  iconPosition="left"
                >
                  Upload Logo
                </Button>
                {settings.general.logoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('general', 'logoUrl', '')}
                    iconName="X"
                    iconPosition="left"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              <p className="text-xs text-muted-foreground">
                Recommended size: 200x80px. Supported formats: PNG, JPG, SVG
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Registration Settings</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.general.allowPublicRegistration}
              onChange={(e) => handleInputChange('general', 'allowPublicRegistration', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Allow Public Registration</p>
              <p className="text-xs text-muted-foreground">
                Allow users to create accounts without invitation
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.general.requireEmailVerification}
              onChange={(e) => handleInputChange('general', 'requireEmailVerification', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Require Email Verification</p>
              <p className="text-xs text-muted-foreground">
                Users must verify their email address before accessing the platform
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.general.maintenanceMode}
              onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">
                Temporarily disable public access to the platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">SMTP Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="SMTP Host"
            value={settings.email.smtpHost}
            onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
            placeholder="smtp.example.com"
            required
          />
          
          <Input
            label="SMTP Port"
            value={settings.email.smtpPort}
            onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
            placeholder="587"
            required
          />
          
          <Input
            label="SMTP Username"
            value={settings.email.smtpUsername}
            onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
            placeholder="Username or API key"
            required
          />
          
          <Input
            label="SMTP Password"
            type="password"
            value={settings.email.smtpPassword}
            onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
            placeholder="Password or API secret"
            required
          />
          
          <Select
            label="Encryption"
            options={[
              { value: 'none', label: 'None' },
              { value: 'ssl', label: 'SSL' },
              { value: 'tls', label: 'TLS' }
            ]}
            value={settings.email.smtpEncryption}
            onChange={(value) => handleInputChange('email', 'smtpEncryption', value)}
            required
          />
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => handleTestConnection('SMTP')}
              iconName="Send"
              iconPosition="left"
              className="w-full"
            >
              Test Connection
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Email Templates</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="From Email"
            value={settings.email.fromEmail}
            onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
            placeholder="noreply@yoursite.com"
            required
          />
          
          <Input
            label="From Name"
            value={settings.email.fromName}
            onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
            placeholder="Your Site Name"
            required
          />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.email.enableEmailNotifications}
              onChange={(e) => handleInputChange('email', 'enableEmailNotifications', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Enable Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Send automated email notifications to users
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.email.welcomeEmailEnabled}
              onChange={(e) => handleInputChange('email', 'welcomeEmailEnabled', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Welcome Email</p>
              <p className="text-xs text-muted-foreground">
                Send welcome email to new users
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.email.reminderEmailsEnabled}
              onChange={(e) => handleInputChange('email', 'reminderEmailsEnabled', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Webinar Reminders</p>
              <p className="text-xs text-muted-foreground">
                Send reminder emails before webinars start
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-8">
      {/* Zoom Integration */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">Z</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Zoom Integration</h3>
            <p className="text-sm text-muted-foreground">Configure Zoom API for webinar hosting</p>
          </div>
          <div className="ml-auto">
            <Checkbox
              checked={settings.integrations.zoom.enabled}
              onChange={(e) => handleNestedInputChange('integrations', 'zoom', 'enabled', e.target.checked)}
            />
          </div>
        </div>
        
        {settings.integrations.zoom.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                label="API Key"
                value={settings.integrations.zoom.apiKey}
                onChange={(e) => handleNestedInputChange('integrations', 'zoom', 'apiKey', e.target.value)}
                placeholder="Enter Zoom API Key"
              />
              
              <Input
                label="API Secret"
                type="password"
                value={settings.integrations.zoom.apiSecret}
                onChange={(e) => handleNestedInputChange('integrations', 'zoom', 'apiSecret', e.target.value)}
                placeholder="Enter Zoom API Secret"
              />
              
              <Input
                label="Webhook Secret"
                type="password"
                value={settings.integrations.zoom.webhookSecret}
                onChange={(e) => handleNestedInputChange('integrations', 'zoom', 'webhookSecret', e.target.value)}
                placeholder="Enter Webhook Secret"
              />
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection('Zoom')}
                  iconName="TestTube"
                  iconPosition="left"
                  className="w-full"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Integration */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icon name="CreditCard" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Razorpay Integration</h3>
            <p className="text-sm text-muted-foreground">Configure payment processing</p>
          </div>
          <div className="ml-auto">
            <Checkbox
              checked={settings.integrations.razorpay.enabled}
              onChange={(e) => handleNestedInputChange('integrations', 'razorpay', 'enabled', e.target.checked)}
            />
          </div>
        </div>
        
        {settings.integrations.razorpay.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                label="Key ID"
                value={settings.integrations.razorpay.keyId}
                onChange={(e) => handleNestedInputChange('integrations', 'razorpay', 'keyId', e.target.value)}
                placeholder="rzp_test_..."
              />
              
              <Input
                label="Key Secret"
                type="password"
                value={settings.integrations.razorpay.keySecret}
                onChange={(e) => handleNestedInputChange('integrations', 'razorpay', 'keySecret', e.target.value)}
                placeholder="Enter Key Secret"
              />
              
              <Input
                label="Webhook Secret"
                type="password"
                value={settings.integrations.razorpay.webhookSecret}
                onChange={(e) => handleNestedInputChange('integrations', 'razorpay', 'webhookSecret', e.target.value)}
                placeholder="Enter Webhook Secret"
              />
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={settings.integrations.razorpay.testMode}
                  onChange={(e) => handleNestedInputChange('integrations', 'razorpay', 'testMode', e.target.checked)}
                />
                <span className="text-sm text-foreground">Test Mode</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => handleTestConnection('Razorpay')}
              iconName="TestTube"
              iconPosition="left"
            >
              Test Payment Integration
            </Button>
          </div>
        )}
      </div>

      {/* Google Analytics */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Google Analytics</h3>
            <p className="text-sm text-muted-foreground">Track website analytics</p>
          </div>
          <div className="ml-auto">
            <Checkbox
              checked={settings.integrations.googleAnalytics.enabled}
              onChange={(e) => handleNestedInputChange('integrations', 'googleAnalytics', 'enabled', e.target.checked)}
            />
          </div>
        </div>
        
        {settings.integrations.googleAnalytics.enabled && (
          <Input
            label="Tracking ID"
            value={settings.integrations.googleAnalytics.trackingId}
            onChange={(e) => handleNestedInputChange('integrations', 'googleAnalytics', 'trackingId', e.target.value)}
            placeholder="GA-XXXXXXXXX-X"
          />
        )}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Password Policy</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Minimum Password Length"
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
            min="6"
            max="32"
          />
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={settings.security.requireUppercase}
                onChange={(e) => handleInputChange('security', 'requireUppercase', e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Require Uppercase Letters</p>
                <p className="text-xs text-muted-foreground">Password must contain uppercase letters</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                checked={settings.security.requireNumbers}
                onChange={(e) => handleInputChange('security', 'requireNumbers', e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Require Numbers</p>
                <p className="text-xs text-muted-foreground">Password must contain numbers</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                checked={settings.security.requireSpecialChars}
                onChange={(e) => handleInputChange('security', 'requireSpecialChars', e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Require Special Characters</p>
                <p className="text-xs text-muted-foreground">Password must contain special characters</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Login Security</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Input
            label="Max Login Attempts"
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            min="3"
            max="10"
          />
          
          <Input
            label="Lockout Duration (minutes)"
            type="number"
            value={settings.security.lockoutDuration}
            onChange={(e) => handleInputChange('security', 'lockoutDuration', parseInt(e.target.value))}
            min="5"
            max="1440"
          />
          
          <Input
            label="Session Timeout (minutes)"
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
            min="30"
            max="720"
          />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Advanced Security</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.security.twoFactorRequired}
              onChange={(e) => handleInputChange('security', 'twoFactorRequired', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Require Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">
                Force all users to enable 2FA for enhanced security
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.security.enableAuditLogs}
              onChange={(e) => handleInputChange('security', 'enableAuditLogs', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Enable Audit Logs</p>
              <p className="text-xs text-muted-foreground">
                Log all administrative actions for security monitoring
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Allowed IP Ranges (Optional)
            </label>
            <textarea
              value={settings.security.allowedIpRanges}
              onChange={(e) => handleInputChange('security', 'allowedIpRanges', e.target.value)}
              placeholder="Enter IP ranges (one per line)&#10;192.168.1.0/24&#10;10.0.0.0/8"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to allow all IPs. Enter CIDR notation for IP ranges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Backup Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Select
            label="Backup Frequency"
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' }
            ]}
            value={settings.maintenance.backupFrequency}
            onChange={(value) => handleInputChange('maintenance', 'backupFrequency', value)}
          />
          
          <Input
            label="Retention Days"
            type="number"
            value={settings.maintenance.retentionDays}
            onChange={(e) => handleInputChange('maintenance', 'retentionDays', parseInt(e.target.value))}
            min="7"
            max="365"
          />
          
          <Input
            label="Maintenance Window"
            type="time"
            value={settings.maintenance.maintenanceWindow}
            onChange={(e) => handleInputChange('maintenance', 'maintenanceWindow', e.target.value)}
          />
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={settings.maintenance.autoBackup}
              onChange={(e) => handleInputChange('maintenance', 'autoBackup', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Enable Automatic Backups</p>
              <p className="text-xs text-muted-foreground">
                Automatically backup database and files based on schedule
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Monitoring</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Alert Threshold (%)"
            type="number"
            value={settings.maintenance.alertThreshold}
            onChange={(e) => handleInputChange('maintenance', 'alertThreshold', parseInt(e.target.value))}
            min="50"
            max="95"
          />
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={settings.maintenance.enableSystemAlerts}
                onChange={(e) => handleInputChange('maintenance', 'enableSystemAlerts', e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Enable System Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Send alerts when system resources exceed threshold
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                checked={settings.maintenance.debugMode}
                onChange={(e) => handleInputChange('maintenance', 'debugMode', e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">Debug Mode</p>
                <p className="text-xs text-muted-foreground">
                  Enable detailed logging for troubleshooting (affects performance)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Manual Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => console.log('Creating backup...')}
            iconName="Database"
            iconPosition="left"
            className="w-full"
          >
            Create Backup Now
          </Button>
          
          <Button
            variant="outline"
            onClick={() => console.log('Clearing cache...')}
            iconName="RefreshCw"
            iconPosition="left"
            className="w-full"
          >
            Clear System Cache
          </Button>
          
          <Button
            variant="outline"
            onClick={() => console.log('Running diagnostics...')}
            iconName="Activity"
            iconPosition="left"
            className="w-full"
          >
            Run Diagnostics
          </Button>
          
          <Button
            variant="outline"
            onClick={() => console.log('Optimizing database...')}
            iconName="Zap"
            iconPosition="left"
            className="w-full"
          >
            Optimize Database
          </Button>
          
          <Button
            variant="outline"
            onClick={() => console.log('Viewing logs...')}
            iconName="FileText"
            iconPosition="left"
            className="w-full"
          >
            View System Logs
          </Button>
          
          <Button
            variant="outline"
            onClick={() => console.log('Checking updates...')}
            iconName="Download"
            iconPosition="left"
            className="w-full"
          >
            Check for Updates
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'security':
        return renderSecuritySettings();
      case 'maintenance':
        return renderMaintenanceSettings();
      default:
        return null;
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
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'Settings', href: null }
  ];

  return (
    <div className="min-h-screen bg-background">
    
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Admin Settings</h1>
                <p className="text-text-secondary">Configure system settings and integrations</p>
              </div>
              <Button
                variant="default"
                onClick={handleSaveSettings}
                loading={isSaving}
                iconName="Save"
                iconPosition="left"
              >
                Save All Settings
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success font-medium">{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab.icon} size={18} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>

    </div>
  );
};

export default AdminSettings;
