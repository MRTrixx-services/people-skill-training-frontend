import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

import GeneralSettings from './settings/components/GeneralSettings';
import EmailSettings from './settings/components/EmailSettings';
import { usePlatformSettings } from './settings/hooks/usePlatformSettings';
import SettingsTabs from './settings/components/SettingsTabs';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const {
    settings,
    isLoading,
    isSaving,
     isDirty,
    successMessage,
    errorMessage,
    updateSettingsField,
    saveSettings,
    testEmailConnection,
  } = usePlatformSettings();

  const handleSave = async () => {
    await saveSettings(activeTab);
  };

  const handleTestEmail = async () => {
    await testEmailConnection();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading platform configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Platform Settings
              </h1>
              <p className="text-text-secondary">
                Configure {settings.general.name || 'platform'} settings
              </p>
            </div>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
               disabled={!isDirty || isSaving}
              iconName="Save"
              iconPosition="left"
            >
              Save All Settings
            </Button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success font-medium">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <span className="text-sm text-destructive font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SettingsTabs
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                {activeTab === 'general' && (
                  <GeneralSettings 
                    settings={settings.general}
                    onUpdate={updateSettingsField}
                  />
                )}
                
                {activeTab === 'email' && (
                  <EmailSettings 
                    settings={settings.email}
                    onUpdate={updateSettingsField}
                    onTestConnection={handleTestEmail}
                    isTesting={isSaving}
                  />
                )}
                
                {/* Add IntegrationSettings and SecuritySettings components */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
