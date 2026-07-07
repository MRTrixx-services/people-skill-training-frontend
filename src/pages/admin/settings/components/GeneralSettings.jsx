import React, { useRef } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { Checkbox } from 'components/ui/Checkbox';
import { useFileUpload } from '../hooks/useFileUpload';

const GeneralSettings = ({ settings, onUpdate }) => {
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  
  const { processFile: processLogo, errorMessage: logoError } = useFileUpload('logo');
  const { processFile: processFavicon, errorMessage: faviconError } = useFileUpload('favicon');

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processLogo(file, ({ file: logoFile, preview }) => {
        onUpdate('general', 'logoPreview', preview);
        onUpdate('general', 'logo', logoFile);
      });
    }
  };

  const handleFaviconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFavicon(file, ({ file: faviconFile, preview }) => {
        onUpdate('general', 'faviconPreview', preview);
        onUpdate('general', 'favicon', faviconFile);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Platform Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6">Platform Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Core Fields */}
          <div className="space-y-4">
            <Input
              label="Platform ID"
              value={settings.platform_id || ''}
              disabled
              helperText="Unique identifier (read-only)"
            />
            
            <Input
              label="Platform Name"
              value={settings.name || ''}
              disabled
              onChange={(e) => onUpdate('general', 'name', e.target.value)}
              placeholder="Enter platform name"
              required
            />

            <Input
              label="Description"
              value={settings.description || ''}
              disabled
              onChange={(e) => onUpdate('general', 'description', e.target.value)}
              placeholder="Enter platform description..."
              rows={3}
              helperText="Brief description shown on platform"
            />

            <Input
              label="Domain"
              value={settings.domain || ''}
              disabled
              onChange={(e) => onUpdate('general', 'domain', e.target.value)}
              placeholder="app.example.com"
              helperText="Primary domain (no http/https)"
            />
          </div>

          {/* Right Column - Branding */}
          <div className="space-y-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Platform Logo
              </label>
              <div className="space-y-3">
                <div className="w-48 h-20 border-2 border-dashed border-border rounded-xl overflow-hidden bg-muted/50 flex items-center justify-center p-4 hover:border-primary hover:bg-muted transition-all">
                  {settings.logoPreview || settings.logo_url ? (
                    <Image
                      src={settings.logoPreview || settings.logo_url}
                      alt="Platform logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Icon name="Image" size={24} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No logo uploaded</p>
                    </div>
                  )}
                </div>
                
                {logoError && <p className="text-xs text-destructive">{logoError}</p>}
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    iconName="Upload"
                  >
                    Upload Logo
                  </Button>
                  {(settings.logoPreview || settings.logo_url) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onUpdate('general', 'logoPreview', '');
                        onUpdate('general', 'logo', null);
                      }}
                      iconName="Trash2"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 200×80px • Max 2MB • PNG/JPG/SVG
                </p>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Favicon
              </label>
              <div className="space-y-2">
                <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg bg-muted/50 flex items-center justify-center p-2 hover:border-primary hover:bg-muted transition-all">
                  {settings.faviconPreview || settings.favicon_url ? (
                    <Image
                      src={settings.faviconPreview || settings.favicon_url}
                      alt="Favicon"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Icon name="Image" size={20} className="text-muted-foreground" />
                  )}
                </div>
                
                {faviconError && <p className="text-xs text-destructive">{faviconError}</p>}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => faviconInputRef.current?.click()}
                  iconName="Upload"
                  className="w-full justify-start"
                >
                  Upload Favicon
                </Button>
                
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/x-icon,image/png"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">32×32px • Max 1MB • ICO/PNG</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6">Contact Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Support Email"
              type="email"
              disabled
              value={settings.support_email || ''}
              onChange={(e) => onUpdate('general', 'support_email', e.target.value)}
              placeholder="support@example.com"
              required
              helperText="Public-facing customer support email"
            />
            
            <Input
              label="Contact Phone"
              value={settings.contact_phone || ''}
              onChange={(e) => onUpdate('general', 'contact_phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              helperText="Displayed on invoices & support pages"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Business Address
            </label>
            <textarea
              value={settings.address || ''}
              onChange={(e) => onUpdate('general', 'address', e.target.value)}
              placeholder="123 Business St, City, State 12345"
              rows={4}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none hover:border-cyan-300 text-sm sm:text-base"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Full business address for invoices & legal notices
            </p>
          </div>
        </div>
      </div>

      {/* 3. Brand Colors */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6">Brand Colors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl">
          <div className="space-y-2 text-center">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Primary
            </label>
            <input
              type="color"
              value={settings.primary_color || '#DC2626'}
              onChange={(e) => onUpdate('general', 'primary_color', e.target.value)}
              className="w-full h-16 rounded-lg border-2 border-border shadow-lg hover:shadow-xl transition-all cursor-pointer block mx-auto"
              title="Primary Color"
            />
            <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground block mx-auto">
              {settings.primary_color || '#DC2626'}
            </code>
          </div>
          
          <div className="space-y-2 text-center">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Secondary
            </label>
            <input
              type="color"
              value={settings.secondary_color || '#F59E0B'}
              onChange={(e) => onUpdate('general', 'secondary_color', e.target.value)}
              className="w-full h-16 rounded-lg border-2 border-border shadow-lg hover:shadow-xl transition-all cursor-pointer block mx-auto"
              title="Secondary Color"
            />
            <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground block mx-auto">
              {settings.secondary_color || '#F59E0B'}
            </code>
          </div>
          
          <div className="space-y-2 text-center">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Accent
            </label>
            <input
              type="color"
              value={settings.accent_color || '#059669'}
              onChange={(e) => onUpdate('general', 'accent_color', e.target.value)}
              className="w-full h-16 rounded-lg border-2 border-border shadow-lg hover:shadow-xl transition-all cursor-pointer block mx-auto"
              title="Accent Color"
            />
            <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground block mx-auto">
              {settings.accent_color || '#059669'}
            </code>
          </div>
        </div>
      </div>

      {/* ✅ 4. Email Verification Workflow - NEW SECTION */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Icon name="Mail" size={20} className="text-primary" />
          Email Verification Workflow
        </h3>
        
        {/* Current Status Badge */}
        <div className="mb-6 p-4 bg-gradient-to-r rounded-xl border-2 border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Current Workflow:
              </p>
              <p className={`text-lg font-bold px-3 py-1 rounded-full text-sm inline-flex items-center gap-2 ${
                settings.requires_email_verification 
                  ? 'bg-warning/10 text-warning border border-warning/30' 
                  : 'bg-success/10 text-success border border-success/30'
              }`}>
                {settings.requires_email_verification ? (
                  <>
                    <Icon name="Shield" size={16} />
                    ✉️ Email Verification REQUIRED
                  </>
                ) : (
                  <>
                    <Icon name="Zap" size={16} />
                    ⚡ Auto-Verification ENABLED
                  </>
                )}
              </p>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              <p>{settings.user_count || 0} total users</p>
            </div>
          </div>
        </div>

        {/* Toggle with Workflow Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Toggle Control */}
          <div className="p-6 border border-border rounded-xl hover:shadow-md transition-all bg-card">
            <div className="flex items-start space-x-4">
              <Checkbox
                checked={settings.requires_email_verification || false}
                onChange={(e) => onUpdate('general', 'requires_email_verification', e.target.checked)}
                className="mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Require Email Verification
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Controls new user registration workflow
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Details */}
          <div className="space-y-4">
            {settings.requires_email_verification ? (
              <>
                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Icon name="ShieldCheck" size={16} className="text-warning" />
                    ✅ ENABLED - Secure Registration Flow
                  </h5>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p><strong>Registration Flow:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>User submits registration form</li>
                      <li>Account created with <code>is_verified=False</code></li>
                      <li><strong>✉️ Verification email sent</strong> with unique token</li>
                      <li>User clicks verification link</li>
                      <li>Account activated (<code>is_verified=True</code>)</li>
                      <li><strong>📧 Welcome email sent</strong></li>
                      <li>User can now login</li>
                    </ol>
                    <p className="mt-2 font-medium text-warning text-xs">
                      <strong>Emails Sent:</strong> Verification Email → Welcome Email
                    </p>
                    <p className="text-xs mt-1">
                      <em>Best for: Public platforms, customer-facing apps</em>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Icon name="Zap" size={16} className="text-success" />
                    ⚡ DISABLED - Instant Access Flow
                  </h5>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p><strong>Registration Flow:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>User submits registration form</li>
                      <li>Account created with <code>is_verified=True</code></li>
                      <li><strong>📧 Welcome email sent immediately</strong></li>
                      <li>User can login <strong>instantly</strong></li>
                    </ol>
                    <p className="mt-2 font-medium text-success text-xs">
                      <strong>Emails Sent:</strong> Welcome Email Only
                    </p>
                    <p className="text-xs mt-1">
                      <em>Best for: Internal platforms, B2B, trusted environments</em>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Use Case Recommendations */}
        <div className="mt-8 p-6 bg-gradient-to-r from-muted/20 to-muted/10 border border-border/50 rounded-2xl">
          <h5 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
            <Icon name="Lightbulb" size={18} className="text-accent" />
            💡 Platform Recommendations
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-warning/5 border border-warning/10 rounded-lg">
              <div className="font-semibold text-warning mb-1">PeopleSkillTraining</div>
              <div className="text-muted-foreground">🔒 Internal → <strong>Disable</strong></div>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
              <div className="font-semibold text-primary mb-1">PeopleSkillTraining</div>
              <div className="text-muted-foreground">🌐 Public → <strong>Enable</strong></div>
            </div>
         
          </div>
        </div>
      </div>

      {/* 5. Maintenance Mode */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">Platform Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div className="flex items-start space-x-4 p-6 border border-border rounded-xl hover:border-destructive hover:shadow-md transition-all bg-card">
            <Checkbox
              checked={settings.maintenance_mode || false}
              onChange={(e) => onUpdate('general', 'maintenance_mode', e.target.checked)}
            />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">
                Temporarily disable public access (admin access remains)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-border">
        <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
          <div className="text-3xl font-bold text-primary mb-1">
            {settings.user_count?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Total Users
          </div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-xl">
          <div className="text-3xl font-bold text-secondary mb-1">
            {settings.active_user_count?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Active Users
          </div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-xl">
          <div className="text-3xl font-bold text-accent mb-1">
            ${parseFloat(settings.stats?.total_revenue || 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Total Revenue
          </div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-muted/20 to-muted/10 border border-muted rounded-xl">
          <div className="text-3xl font-bold text-foreground mb-1">
            {settings.payment_gateways?.length || 0}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Payment Gateways
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={faviconInputRef} type="file" accept="image/x-icon,image/png" className="hidden" />
    </div>
  );
};

export default GeneralSettings;
