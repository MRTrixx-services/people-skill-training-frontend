import { useState, useEffect, useCallback } from 'react';
import { INITIAL_SETTINGS } from '../constants/settingsConfig';
import { platformService } from 'services/platformApi';

export const usePlatformSettings = () => {
  const [platform, setPlatform] = useState(null);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
    // state
const [isDirty, setIsDirty] = useState(false);
const [initialSettings, setInitialSettings] = useState(null);

  const loadPlatformConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // ✅ FIXED: Use correct endpoint
      const response = await platformService.getCurrentSettings();
      const config = response.platform; // ✅ Extract platform from response
      
      // Map backend data to frontend state ✅ MATCHES YOUR API RESPONSE
      const mappedSettings = {
        general: {
          platform_id: config.platform_id || '',
          name: config.name || '',
          description: config.description || '',
          logo_url: config.logo_url || null,      // ✅ From API
          favicon_url: config.favicon_url || null, // ✅ From API
          logoPreview: '', // Local preview
          faviconPreview: '', // Local preview
          primary_color: config.primary_color || '#3B82F6',
          secondary_color: config.secondary_color || '#8B5CF6',
          accent_color: config.accent_color || '#10B981',
          domain: config.domain || '',
          support_email: config.support_email || '',
          contact_email: config.contact_email || '',
          contact_phone: config.contact_phone || '',
          address: config.address || '',
          is_active: config.is_active ?? true,
          maintenance_mode: config.maintenance_mode ?? false,
          requires_email_verification: config.requires_email_verification ?? true,
          user_count: config.user_count || 0,
          active_user_count: config.active_user_count || 0,
          stats: config.stats || {},
          payment_gateways: config.payment_gateways || [],
          has_email_config: config.has_email_config || false,
          email_config_summary: config.email_config_summary || {}
        },
        email: {
          has_email_config: config.has_email_config || false,
          email_config_summary: config.email_config_summary || {},
          email_delivery_method: config.email_delivery_method || 'smtp',
          smtp_host: config.email_settings?.smtp_host || '',
          smtp_port: config.email_settings?.smtp_port || '587',
          smtp_user: config.email_settings?.smtp_user || '',
          smtp_password: '', // Never send password back
          smtp_encryption: config.email_settings?.use_tls ? 'tls' : 
                          config.email_settings?.use_ssl ? 'ssl' : 'none',
          from_email: config.email_settings?.from_email || config.support_email || '',
          from_name: config.email_settings?.from_name || config.name || '',
        },
        integrations: {
          payment_gateways: config.payment_gateways || [],
          features: config.features || {}
        },
        security: {
          allowed_ip_addresses: config.allowed_ip_addresses || [],
          analytics: config.analytics || {}
        }
      };

       setSettings(mappedSettings);
    setInitialSettings(mappedSettings);   // 👈 snapshot
    setPlatform(config);
    setIsDirty(false);                    // clean on load
    setIsLoading(false);
    } catch (error) {
      console.error('Failed to load platform config:', error);
      setErrorMessage('Failed to load platform configuration');
      setIsLoading(false);
    }
  }, []);

 const updateSettingsField = useCallback((section, field, value) => {
  setSettings(prev => {
    const next = {
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    };

    if (initialSettings) {
      const current = JSON.stringify(next);
      const initial = JSON.stringify(initialSettings);
      setIsDirty(current !== initial);   // 👈 dirty if different
    } else {
      setIsDirty(true);
    }

    return next;
  });
}, [initialSettings]);

  const saveSettings = useCallback(async (activeTab) => {
    try {
    if (!isDirty) return true;  
      setIsSaving(true);
      setErrorMessage('');
      
      // ✅ FIXED: Use correct endpoints that match your Django views
      const platformId = platform?.id;
      
      // 1. Upload logo if changed
      if (settings.general.logo instanceof File) {
        await platformService.uploadLogo(settings.general.logo); // ✅ No platformId needed
      }

      // 2. Upload favicon if changed  
      if (settings.general.favicon instanceof File) {
        await platformService.uploadFavicon(settings.general.favicon); // ✅ No platformId needed
      }

      // 3. Update general platform settings ✅ MATCHES YOUR API
      await platformService.updateSettings({
        name: settings.general.name,
        description: settings.general.description,
        domain: settings.general.domain,
        support_email: settings.general.support_email,
        contact_email: settings.general.contact_email,
        contact_phone: settings.general.contact_phone,
        address: settings.general.address || '',
        primary_color: settings.general.primary_color,
        secondary_color: settings.general.secondary_color,
        accent_color: settings.general.accent_color,
        maintenance_mode: settings.general.maintenance_mode,
        requires_email_verification: settings.general.requires_email_verification,
        is_active: settings.general.is_active
      });

      // 4. Test email if on email tab
      if (activeTab === 'email') {
        await platformService.testEmailConnection();
      }

      setSuccessMessage('Settings saved successfully!');
      setIsSaving(false);
      
      // Reload configuration
      await loadPlatformConfig();
      
      setTimeout(() => setSuccessMessage(''), 3000);
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      setErrorMessage(error.response?.data?.error || error.message || 'Failed to save settings');
      setIsSaving(false);
      return false;
    }
  },  [isDirty,platform, settings, loadPlatformConfig]);

  const testEmailConnection = useCallback(async () => {
    try {
      setIsSaving(true);
      // ✅ FIXED: Use correct endpoint (no platformId needed)
      const result = await platformService.testEmailConnection();
      
      if (result.success) {
        setSuccessMessage('✅ Email connection test successful!');
      } else {
        setErrorMessage(`❌ Email test failed: ${result.message}`);
      }
      
      setIsSaving(false);
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      
      return result.success;
    } catch (error) {
      setErrorMessage(`Connection test failed: ${error.response?.data?.message || error.message}`);
      setIsSaving(false);
      return false;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setSuccessMessage('');
    setErrorMessage('');
  }, []);

  useEffect(() => {
    loadPlatformConfig();
  }, [loadPlatformConfig]);

  return {
    platform,
    settings,
    isLoading,
    isSaving,
      isDirty,  
    successMessage,
    errorMessage,
    updateSettingsField,
    saveSettings,
    testEmailConnection,
    clearMessages,
    reloadConfig: loadPlatformConfig
  };
};
