import React from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { EMAIL_DELIVERY_METHODS, SMTP_ENCRYPTION_OPTIONS } from '../constants/settingsConfig';

const EmailSettings = ({ settings, onUpdate, onTestConnection, isTesting }) => {
  return (
    <div className="space-y-6">
      {/* Delivery Method */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Email Delivery Method</h3>
        <Select
          label="Delivery Method"
          options={EMAIL_DELIVERY_METHODS}
          value={settings.email_delivery_method}
          onChange={(value) => onUpdate('email', 'email_delivery_method', value)}
          helperText="Choose how emails are sent from this platform"
        />
      </div>

      {/* SMTP Configuration */}
      {settings.email_delivery_method === 'smtp' && (
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">SMTP Configuration</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="SMTP Host"
              value={settings.smtp_host}
              onChange={(e) => onUpdate('email', 'smtp_host', e.target.value)}
              placeholder="smtp.example.com"
              required
            />
            
            <Input
              label="SMTP Port"
              value={settings.smtp_port}
              onChange={(e) => onUpdate('email', 'smtp_port', e.target.value)}
              placeholder="587"
              required
            />
            
            <Input
              label="SMTP Username"
              value={settings.smtp_user}
              onChange={(e) => onUpdate('email', 'smtp_user', e.target.value)}
              placeholder="Username or API key"
              required
            />
            
            <Input
              label="SMTP Password"
              type="password"
              value={settings.smtp_password}
              onChange={(e) => onUpdate('email', 'smtp_password', e.target.value)}
              placeholder="Enter to update password"
              helperText="Leave blank to keep existing password"
            />
            
            <Select
              label="Encryption"
              options={SMTP_ENCRYPTION_OPTIONS}
              value={settings.smtp_encryption}
              onChange={(value) => onUpdate('email', 'smtp_encryption', value)}
              required
            />
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={onTestConnection}
                iconName="Send"
                iconPosition="left"
                className="w-full"
                loading={isTesting}
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* API Configuration for other methods */}
      {['sendgrid_api', 'brevo_api', 'mailgun_api'].includes(settings.email_delivery_method) && (
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {EMAIL_DELIVERY_METHODS.find(m => m.value === settings.email_delivery_method)?.label} Configuration
          </h3>
          <div className="space-y-4">
            <Input
              label="API Key"
              type="password"
              value={settings.smtp_password}
              onChange={(e) => onUpdate('email', 'smtp_password', e.target.value)}
              placeholder="Enter API key"
              required
            />
            
            {settings.email_delivery_method === 'mailgun_api' && (
              <>
                <Input
                  label="Domain"
                  value={settings.mailgun_domain || ''}
                  onChange={(e) => onUpdate('email', 'mailgun_domain', e.target.value)}
                  placeholder="mg.example.com"
                  required
                />
                <Select
                  label="Region"
                  options={[
                    { value: 'us', label: 'US' },
                    { value: 'eu', label: 'EU' }
                  ]}
                  value={settings.mailgun_region || 'us'}
                  onChange={(value) => onUpdate('email', 'mailgun_region', value)}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Sender Information */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sender Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="From Email"
            type="email"
            value={settings.from_email}
            onChange={(e) => onUpdate('email', 'from_email', e.target.value)}
            placeholder="noreply@yoursite.com"
            required
          />
          
          <Input
            label="From Name"
            value={settings.from_name}
            onChange={(e) => onUpdate('email', 'from_name', e.target.value)}
            placeholder="Your Platform Name"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
