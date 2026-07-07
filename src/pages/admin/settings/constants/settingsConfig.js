/**
 * Settings configuration constants
 */

export const TABS = [
  { id: 'general', label: 'General', icon: 'Settings' },
  { id: 'email', label: 'Email', icon: 'Mail' },
  { id: 'integrations', label: 'Integrations', icon: 'Zap' },
  { id: 'security', label: 'Security', icon: 'Shield' },
];

export const EMAIL_DELIVERY_METHODS = [
  { value: 'smtp', label: 'Direct SMTP' },
  { value: 'sendgrid_api', label: 'SendGrid API' },
  { value: 'mailgun_api', label: 'Mailgun API' },
  { value: 'brevo_api', label: 'Brevo API' },
  { value: 'aws_ses_api', label: 'AWS SES API' },
  { value: 'resend_api', label: 'Resend API' },
  { value: 'postmark_api', label: 'Postmark API' }
];

export const SMTP_ENCRYPTION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'ssl', label: 'SSL' },
  { value: 'tls', label: 'TLS' }
];

export const FILE_UPLOAD_LIMITS = {
  logo: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
    dimensions: '200x80px',
  },
  favicon: {
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/x-icon', 'image/png'],
    dimensions: '32x32px',
  }
};

export const INITIAL_SETTINGS = {
  general: {
    platform_id: '',
    name: '',
    description: '',
    logo: null,
    logoPreview: '',
    favicon: null,
    faviconPreview: '',
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6',
    accent_color: '#10B981',
    domain: '',
    support_email: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    is_active: true,
    maintenance_mode: false,
    requires_email_verification: true
  },
  email: {
    email_delivery_method: 'smtp',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: '',
  },
  integrations: {
    payment_gateways: [],
    features: {}
  },
  security: {
    allowed_ip_addresses: [],
    analytics: {}
  }
};
