import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from 'components/ui/Checkbox';
import axiosInstance from 'config/axiosInstance';

const PricingStep = ({
  formData,
  onUpdate,
  onNext,
  onPrevious,
  errors = {}
}) => {
  const [hasEarlyBird, setHasEarlyBird] = useState(formData?.hasEarlyBird || false);
  const [hasEnrollmentLimit, setHasEnrollmentLimit] = useState(formData?.hasEnrollmentLimit || false);
  
  // ✅ Platform pricing state
  const [platforms, setPlatforms] = useState([]);
  const [platformPricing, setPlatformPricing] = useState(formData?.platformPricing || {});
  const [enablePlatformPricing, setEnablePlatformPricing] = useState(
    formData?.enablePlatformPricing || false
  );

  // ✅ Fetch available platforms on mount
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await axiosInstance.get('/platforms/');
        if (response.data.success) {
          setPlatforms(response.data.platforms || []);
        }
      } catch (error) {
        console.error('Error fetching platforms:', error);
      }
    };
    fetchPlatforms();
  }, []);

  // Get webinar type to determine which pricing sections to show
  const webinarType = formData?.webinarType || 'live';
  const isLiveWebinar = webinarType === 'live';
  const isRecordedWebinar = webinarType === 'recorded';

  // Multiple price fields to enter separately by admin
  const prices = {
    liveSinglePrice: formData?.liveSinglePrice || '',
    liveMultiPrice: formData?.liveMultiPrice || '',
    recordedSinglePrice: formData?.recordedSinglePrice || '',
    recordedMultiPrice: formData?.recordedMultiPrice || '',
    comboSinglePrice: formData?.comboSinglePrice || '',
    comboSingleOriginalPrice: formData?.comboSingleOriginalPrice || '',
    comboMultiPrice: formData?.comboMultiPrice || '',
    comboMultiOriginalPrice: formData?.comboMultiOriginalPrice || '',
    earlyBirdSinglePrice: formData?.earlyBirdSinglePrice || '',
    earlyBirdMultiPrice: formData?.earlyBirdMultiPrice || '',
    earlyBirdEndDate: formData?.earlyBirdEndDate || ''
  };

  // Calculate original combo prices automatically if not provided (only for live webinars)
  const calculatedComboSingleOriginalPrice = isLiveWebinar
    ? prices.comboSingleOriginalPrice ||
      (
        (parseFloat(prices.liveSinglePrice) || 0) +
        (parseFloat(prices.recordedSinglePrice) || 0)
      ).toFixed(2)
    : '0.00';

  const calculatedComboMultiOriginalPrice = isLiveWebinar
    ? prices.comboMultiOriginalPrice ||
      (
        (parseFloat(prices.liveMultiPrice) || 0) +
        (parseFloat(prices.recordedMultiPrice) || 0)
      ).toFixed(2)
    : '0.00';

  // Handle input updates for all price fields
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  // ✅ Handle platform pricing changes
  const handlePlatformPricingChange = (platformId, field, value) => {
    const updatedPlatformPricing = {
      ...platformPricing,
      [platformId]: {
        ...platformPricing[platformId],
        [field]: value
      }
    };
    
    setPlatformPricing(updatedPlatformPricing);
    onUpdate({ platformPricing: updatedPlatformPricing });
  };

  // ✅ Handle enable platform pricing toggle
  const handleEnablePlatformPricing = (checked) => {
    setEnablePlatformPricing(checked);
    onUpdate({ enablePlatformPricing: checked });
    if (!checked) {
      setPlatformPricing({});
      onUpdate({ platformPricing: {} });
    }
  };

  // Handle enrollment limit toggle and reset maxAttendees if disabled
  const handleEnrollmentLimitToggle = (checked) => {
    setHasEnrollmentLimit(checked);
    handleInputChange('hasEnrollmentLimit', checked);
    if (!checked) {
      handleInputChange('maxAttendees', '');
    }
  };

  // Handle early bird toggle and reset early bird related fields if disabled
  const handleEarlyBirdToggle = (checked) => {
    setHasEarlyBird(checked);
    handleInputChange('hasEarlyBird', checked);
    if (!checked) {
      handleInputChange('earlyBirdSinglePrice', '');
      handleInputChange('earlyBirdMultiPrice', '');
      handleInputChange('earlyBirdEndDate', '');
    }
  };

  // Calculate savings percentage & amount for early bird pricing (only for live webinars)
  const earlyBirdSavingsSingle = isLiveWebinar && hasEarlyBird && prices.liveSinglePrice && prices.earlyBirdSinglePrice
    ? {
        amount: (parseFloat(prices.liveSinglePrice) - parseFloat(prices.earlyBirdSinglePrice)),
        percentage: (((parseFloat(prices.liveSinglePrice) - parseFloat(prices.earlyBirdSinglePrice)) / parseFloat(prices.liveSinglePrice)) * 100).toFixed(1)
      }
    : null;

  const earlyBirdSavingsMulti = isLiveWebinar && hasEarlyBird && prices.liveMultiPrice && prices.earlyBirdMultiPrice
    ? {
        amount: (parseFloat(prices.liveMultiPrice) - parseFloat(prices.earlyBirdMultiPrice)),
        percentage: (((parseFloat(prices.liveMultiPrice) - parseFloat(prices.earlyBirdMultiPrice)) / parseFloat(prices.liveMultiPrice)) * 100).toFixed(1)
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Pricing & Enrollment</h2>
        <p className="text-text-secondary">
          {isRecordedWebinar 
            ? 'Set pricing for your recorded webinar content'
            : 'Enter all pricing options for your webinar packages'
          }
        </p>
        
        {/* Webinar Type Indicator */}
        <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
          <Icon name={isRecordedWebinar ? "Play" : "Zap"} size={14} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {isRecordedWebinar ? 'Recorded Content' : 'Live Session'} Pricing
          </span>
        </div>
      </div>

      {/* ✅ Platform-Specific Pricing Section */}
      {platforms.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-indigo-900 flex items-center">
                <Icon name="Globe" size={20} className="mr-2 text-indigo-600" />
                Platform-Specific Pricing
              </h3>
              <p className="text-xs sm:text-sm text-indigo-700 mt-1">
                Set different prices for different platforms (optional)
              </p>
            </div>
            <Checkbox
              checked={enablePlatformPricing}
              onChange={(e) => handleEnablePlatformPricing(e.target.checked)}
              label=""
              className="mt-1"
            />
          </div>

          {enablePlatformPricing && (
            <div className="space-y-4 mt-4">
              {platforms.map((platform) => (
                <div 
                  key={platform.platform_id} 
                  className="bg-white border border-indigo-200 rounded-lg p-3 sm:p-4 shadow-sm"
                >
                  <div className="flex items-center mb-3 pb-2 border-b border-indigo-100">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                      style={{ backgroundColor: platform.primary_color || '#6366f1' }}
                    />
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900">{platform.name}</h4>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {platform.platform_id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {/* Live pricing for this platform */}
                    {isLiveWebinar && (
                      <>
                        <Input
                          label="Live Single"
                          type="number"
                          placeholder={prices.liveSinglePrice || "0.00"}
                          value={platformPricing[platform.platform_id]?.liveSinglePrice || ''}
                          onChange={(e) => handlePlatformPricingChange(
                            platform.platform_id, 
                            'liveSinglePrice', 
                            e.target.value
                          )}
                          min="0"
                          step="0.01"
                          className="text-xs sm:text-sm"
                        />
                        <Input
                          label="Live Multi"
                          type="number"
                          placeholder={prices.liveMultiPrice || "0.00"}
                          value={platformPricing[platform.platform_id]?.liveMultiPrice || ''}
                          onChange={(e) => handlePlatformPricingChange(
                            platform.platform_id, 
                            'liveMultiPrice', 
                            e.target.value
                          )}
                          min="0"
                          step="0.01"
                          className="text-xs sm:text-sm"
                        />
                      </>
                    )}

                    {/* Recorded pricing */}
                    <Input
                      label="Recorded Single"
                      type="number"
                      placeholder={prices.recordedSinglePrice || "0.00"}
                      value={platformPricing[platform.platform_id]?.recordedSinglePrice || ''}
                      onChange={(e) => handlePlatformPricingChange(
                        platform.platform_id, 
                        'recordedSinglePrice', 
                        e.target.value
                      )}
                      min="0"
                      step="0.01"
                      className="text-xs sm:text-sm"
                    />
                    <Input
                      label="Recorded Multi"
                      type="number"
                      placeholder={prices.recordedMultiPrice || "0.00"}
                      value={platformPricing[platform.platform_id]?.recordedMultiPrice || ''}
                      onChange={(e) => handlePlatformPricingChange(
                        platform.platform_id, 
                        'recordedMultiPrice', 
                        e.target.value
                      )}
                      min="0"
                      step="0.01"
                      className="text-xs sm:text-sm"
                    />

                    {/* Combo pricing for live webinars */}
                    {isLiveWebinar && (
                      <>
                        <Input
                          label="Combo Single"
                          type="number"
                          placeholder={prices.comboSinglePrice || "0.00"}
                          value={platformPricing[platform.platform_id]?.comboSinglePrice || ''}
                          onChange={(e) => handlePlatformPricingChange(
                            platform.platform_id, 
                            'comboSinglePrice', 
                            e.target.value
                          )}
                          min="0"
                          step="0.01"
                          className="text-xs sm:text-sm"
                        />
                        <Input
                          label="Combo Multi"
                          type="number"
                          placeholder={prices.comboMultiPrice || "0.00"}
                          value={platformPricing[platform.platform_id]?.comboMultiPrice || ''}
                          onChange={(e) => handlePlatformPricingChange(
                            platform.platform_id, 
                            'comboMultiPrice', 
                            e.target.value
                          )}
                          min="0"
                          step="0.01"
                          className="text-xs sm:text-sm"
                        />
                      </>
                    )}

                    {/* Discount percentage */}
                    <Input
                      label="Discount %"
                      type="number"
                      placeholder="0"
                      value={platformPricing[platform.platform_id]?.discountPercentage || ''}
                      onChange={(e) => handlePlatformPricingChange(
                        platform.platform_id, 
                        'discountPercentage', 
                        e.target.value
                      )}
                      min="0"
                      max="100"
                      step="1"
                      className="text-xs sm:text-sm"
                    />
                  </div>

                  {/* Show calculated discount */}
                  {platformPricing[platform.platform_id]?.discountPercentage > 0 && (
                    <div className="mt-3 flex items-center text-xs text-green-700 bg-green-50 px-2 sm:px-3 py-2 rounded-lg">
                      <Icon name="TrendingDown" size={14} className="mr-1 flex-shrink-0" />
                      <span className="font-medium">
                        {platformPricing[platform.platform_id]?.discountPercentage}% discount applied
                      </span>
                    </div>
                  )}
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start">
                <Icon name="Info" size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  <strong>Tip:</strong> Leave empty to use default pricing. Discount % applies on top of custom prices.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Conditional Live Version - Only show for live webinars */}
          {isLiveWebinar && (
            <div>
              <label className="font-semibold text-lg mb-2 flex items-center">
                <Icon name="Zap" size={18} className="mr-2 text-green-600" />
                Default Live Session Pricing
              </label>
              <Input
                label="Single Attendee Price"
                type="number"
                placeholder="149.00"
                value={prices.liveSinglePrice}
                onChange={(e) => handleInputChange('liveSinglePrice', e.target.value)}
                error={errors?.liveSinglePrice}
                min="0"
                step="0.01"
                className="w-full mb-4"
              />
              <Input
                label="Multi Attendees Price"
                type="number"
                placeholder="299.00"
                value={prices.liveMultiPrice}
                onChange={(e) => handleInputChange('liveMultiPrice', e.target.value)}
                error={errors?.liveMultiPrice}
                min="0"
                step="0.01"
                className="w-full mb-4"
              />

              {/* Early Bird Pricing - Only for live webinars */}
              <Checkbox
                label="Enable Early Bird Pricing"
                description="Offer discounted pricing for early registrations"
                checked={hasEarlyBird}
                onChange={(e) => handleEarlyBirdToggle(e.target.checked)}
                className="mb-4"
              />

              {hasEarlyBird && (
                <div className="pl-6 border-l-2 border-accent space-y-4">
                  <Input
                    label="Early Bird Single Attendee Price"
                    type="number"
                    placeholder="0.00"
                    value={prices.earlyBirdSinglePrice}
                    onChange={(e) => handleInputChange('earlyBirdSinglePrice', e.target.value)}
                    error={errors?.earlyBirdSinglePrice}
                    min="0"
                    step="0.01"
                    max={prices.liveSinglePrice || undefined}
                    className="w-full"
                  />
                  {earlyBirdSavingsSingle && earlyBirdSavingsSingle.amount > 0 && (
                    <p className="text-sm text-success font-medium">
                      Savings: ${earlyBirdSavingsSingle.amount.toFixed(2)} ({earlyBirdSavingsSingle.percentage}% off)
                    </p>
                  )}

                  <Input
                    label="Early Bird Multi Attendees Price"
                    type="number"
                    placeholder="0.00"
                    value={prices.earlyBirdMultiPrice}
                    onChange={(e) => handleInputChange('earlyBirdMultiPrice', e.target.value)}
                    error={errors?.earlyBirdMultiPrice}
                    min="0"
                    step="0.01"
                    max={prices.liveMultiPrice || undefined}
                    className="w-full"
                  />
                  {earlyBirdSavingsMulti && earlyBirdSavingsMulti.amount > 0 && (
                    <p className="text-sm text-success font-medium">
                      Savings: ${earlyBirdSavingsMulti.amount.toFixed(2)} ({earlyBirdSavingsMulti.percentage}% off)
                    </p>
                  )}

                  <Input
                    label="Early Bird End Date"
                    type="date"
                    value={prices.earlyBirdEndDate}
                    onChange={(e) => handleInputChange('earlyBirdEndDate', e.target.value)}
                    error={errors?.earlyBirdEndDate}
                    min={new Date().toISOString().split('T')[0]}
                    max={formData?.date || undefined}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Recorded Version - Always show, but with different styling based on webinar type */}
          <div>
            <label className="font-semibold text-lg mb-2 flex items-center">
              <Icon name="Play" size={18} className="mr-2 text-blue-600" />
              {isRecordedWebinar ? 'Default Content Access Pricing' : 'Default Recorded Version Pricing'}
            </label>
            <Input
              label="Single Attendee Price"
              type="number"
              placeholder={isRecordedWebinar ? "99.00" : "199.00"}
              value={prices.recordedSinglePrice}
              onChange={(e) => handleInputChange('recordedSinglePrice', e.target.value)}
              error={errors?.recordedSinglePrice}
              min="0"
              step="0.01"
              className="w-full mb-4"
            />
            <Input
              label="Multi Attendees Price"
              type="number"
              placeholder={isRecordedWebinar ? "199.00" : "399.00"}
              value={prices.recordedMultiPrice}
              onChange={(e) => handleInputChange('recordedMultiPrice', e.target.value)}
              error={errors?.recordedMultiPrice}
              min="0"
              step="0.01"
              className="w-full"
            />
          </div>

          {/* Combo Offers - Only show for live webinars */}
          {isLiveWebinar && (
            <div>
              <label className="font-semibold text-lg mb-2 flex items-center">
                <Icon name="Package" size={18} className="mr-2 text-purple-600" />
                Default Combo Offers (Live + Recorded)
              </label>
              <Input
                label="Single Attendee Discounted Price"
                type="number"
                placeholder="299.00"
                value={prices.comboSinglePrice}
                onChange={(e) => handleInputChange('comboSinglePrice', e.target.value)}
                error={errors?.comboSinglePrice}
                min="0"
                step="0.01"
                className="w-full mb-2"
              />
              <Input
                label="Multi Attendees Discounted Price"
                type="number"
                placeholder="599.00"
                value={prices.comboMultiPrice}
                onChange={(e) => handleInputChange('comboMultiPrice', e.target.value)}
                error={errors?.comboMultiPrice}
                min="0"
                step="0.01"
                className="w-full mb-2"
              />
            </div>
          )}

          {/* Enrollment Limits */}
          <div className="space-y-4">
            <Checkbox
              label="Limit Enrollment"
              description="Set a maximum number of attendees"
              checked={hasEnrollmentLimit}
              onChange={(e) => handleEnrollmentLimitToggle(e.target.checked)}
            />

            {hasEnrollmentLimit && (
              <div className="pl-6 border-l-2 border-warning">
                <Input
                  label="Maximum Attendees"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData?.maxAttendees || ''}
                  onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                  error={errors?.maxAttendees}
                  required
                  min="1"
                  max="10000"
                />
                <p className="text-xs text-text-secondary mt-1">
                  {isRecordedWebinar 
                    ? 'Limit the number of users who can purchase access'
                    : 'Consider your platform\'s capacity and engagement goals'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

       {/* Enhanced Pricing Summary - Conditional based on webinar type */}
<div className="bg-card border border-border rounded-lg p-4 shadow-sm">
  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
    <Icon name="DollarSign" size={16} color="var(--color-primary)" className="mr-2" />
    Pricing Summary
  </h3>

  {/* Default Pricing Section */}
  <div className="space-y-3">
    <div className="flex items-center justify-between pb-2 border-b border-border">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Default Pricing</span>
      <Icon name="Tag" size={14} className="text-gray-400" />
    </div>

    {/* Live pricing - only show for live webinars */}
    {isLiveWebinar && (
      <>
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Live Single:</span>
          <span className="text-base font-semibold text-foreground">${prices.liveSinglePrice || '0.00'}</span>
        </div>

        {hasEarlyBird && prices.earlyBirdSinglePrice && (
          <div className="flex justify-between items-center bg-green-50 px-2 py-1 rounded">
            <span className="text-xs text-green-700 flex items-center">
              <Icon name="Zap" size={12} className="mr-1" />
              Early Bird Single:
            </span>
            <span className="text-sm font-semibold text-green-700">${prices.earlyBirdSinglePrice}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Live Multi:</span>
          <span className="text-base font-semibold text-foreground">${prices.liveMultiPrice || '0.00'}</span>
        </div>

        {hasEarlyBird && prices.earlyBirdMultiPrice && (
          <div className="flex justify-between items-center bg-green-50 px-2 py-1 rounded">
            <span className="text-xs text-green-700 flex items-center">
              <Icon name="Zap" size={12} className="mr-1" />
              Early Bird Multi:
            </span>
            <span className="text-sm font-semibold text-green-700">${prices.earlyBirdMultiPrice}</span>
          </div>
        )}
      </>
    )}

    {/* Recorded pricing - always show */}
    <div className="flex justify-between items-center">
      <span className="text-sm text-text-secondary">
        {isRecordedWebinar ? 'Single Access:' : 'Recorded Single:'}
      </span>
      <span className="text-base font-semibold text-foreground">${prices.recordedSinglePrice || '0.00'}</span>
    </div>

    <div className="flex justify-between items-center">
      <span className="text-sm text-text-secondary">
        {isRecordedWebinar ? 'Multi Access:' : 'Recorded Multi:'}
      </span>
      <span className="text-base font-semibold text-foreground">${prices.recordedMultiPrice || '0.00'}</span>
    </div>

    {/* Combo pricing - only show for live webinars */}
    {isLiveWebinar && (
      <>
        <div className="flex justify-between items-center bg-purple-50 px-2 py-1 rounded">
          <span className="text-sm text-purple-700 flex items-center">
            <Icon name="Package" size={14} className="mr-1" />
            Combo Single:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-purple-700">${prices.comboSinglePrice || '0.00'}</span>
            {calculatedComboSingleOriginalPrice && +calculatedComboSingleOriginalPrice > 0 && (
              <del className="text-xs text-gray-400">${calculatedComboSingleOriginalPrice}</del>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center bg-purple-50 px-2 py-1 rounded">
          <span className="text-sm text-purple-700 flex items-center">
            <Icon name="Package" size={14} className="mr-1" />
            Combo Multi:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-purple-700">${prices.comboMultiPrice || '0.00'}</span>
            {calculatedComboMultiOriginalPrice && +calculatedComboMultiOriginalPrice > 0 && (
              <del className="text-xs text-gray-400">${calculatedComboMultiOriginalPrice}</del>
            )}
          </div>
        </div>
      </>
    )}
  </div>

  {/* Platform-Specific Pricing Preview */}
  {enablePlatformPricing && Object.keys(platformPricing).length > 0 && (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
          <Icon name="Globe" size={14} className="mr-1" />
          Platform Pricing
        </span>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
          {Object.keys(platformPricing).length} platform{Object.keys(platformPricing).length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {platforms
          .filter(platform => platformPricing[platform.platform_id] && 
            Object.values(platformPricing[platform.platform_id]).some(val => val && val !== ''))
          .map((platform) => {
            const platformPrice = platformPricing[platform.platform_id];
            const hasDiscount = platformPrice?.discountPercentage > 0;
            
            return (
              <div 
                key={platform.platform_id}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: platform.primary_color || '#6366f1' }}
                    />
                    <span className="text-xs font-semibold text-gray-700">{platform.name}</span>
                  </div>
                  {hasDiscount && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      -{platformPrice.discountPercentage}%
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Live pricing */}
                  {isLiveWebinar && platformPrice?.liveSinglePrice && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Live Single:</span>
                        <span className="font-semibold text-gray-900">
                          ${hasDiscount 
                            ? (platformPrice.liveSinglePrice * (1 - platformPrice.discountPercentage / 100)).toFixed(2)
                            : parseFloat(platformPrice.liveSinglePrice).toFixed(2)
                          }
                        </span>
                      </div>
                      {platformPrice?.liveMultiPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Live Multi:</span>
                          <span className="font-semibold text-gray-900">
                            ${hasDiscount 
                              ? (platformPrice.liveMultiPrice * (1 - platformPrice.discountPercentage / 100)).toFixed(2)
                              : parseFloat(platformPrice.liveMultiPrice).toFixed(2)
                            }
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Recorded pricing */}
                  {platformPrice?.recordedSinglePrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rec Single:</span>
                      <span className="font-semibold text-gray-900">
                        ${hasDiscount 
                          ? (platformPrice.recordedSinglePrice * (1 - platformPrice.discountPercentage / 100)).toFixed(2)
                          : parseFloat(platformPrice.recordedSinglePrice).toFixed(2)
                        }
                      </span>
                    </div>
                  )}
                  {platformPrice?.recordedMultiPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rec Multi:</span>
                      <span className="font-semibold text-gray-900">
                        ${hasDiscount 
                          ? (platformPrice.recordedMultiPrice * (1 - platformPrice.discountPercentage / 100)).toFixed(2)
                          : parseFloat(platformPrice.recordedMultiPrice).toFixed(2)
                        }
                      </span>
                    </div>
                  )}

                  {/* Combo pricing */}
                  {isLiveWebinar && platformPrice?.comboSinglePrice && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Combo Single:</span>
                        <span className="font-semibold text-purple-700">
                          ${hasDiscount 
                            ? (platformPrice.comboSinglePrice * (1 - platformPrice.discountPercentage / 100)).toFixed(2)
                            : parseFloat(platformPrice.comboSinglePrice).toFixed(2)
                          }
                        </span>
                      </div>
                      {platformPrice?.comboMultiPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Combo Multi:</span>
                          <span className="font-semibold text-purple-700">
                            ${hasDiscount 
                              ? (platformPrice.comboMultiPrice * (1 - platformPrice.discountPercentage / 100)).toFixed(2)
                              : parseFloat(platformPrice.comboMultiPrice).toFixed(2)
                            }
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Show comparison with default */}
                {platformPrice?.liveSinglePrice && prices.liveSinglePrice && (
                  <div className="mt-2 pt-2 border-t border-indigo-200 flex items-center justify-between text-xs">
                    <span className="text-gray-600">vs Default:</span>
                    <span className={`font-medium ${
                      parseFloat(platformPrice.liveSinglePrice) < parseFloat(prices.liveSinglePrice)
                        ? 'text-green-600'
                        : parseFloat(platformPrice.liveSinglePrice) > parseFloat(prices.liveSinglePrice)
                        ? 'text-orange-600'
                        : 'text-gray-600'
                    }`}>
                      {parseFloat(platformPrice.liveSinglePrice) < parseFloat(prices.liveSinglePrice) && '-'}
                      {parseFloat(platformPrice.liveSinglePrice) > parseFloat(prices.liveSinglePrice) && '+'}
                      ${Math.abs(parseFloat(platformPrice.liveSinglePrice) - parseFloat(prices.liveSinglePrice)).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  )}

  {/* Revenue calculations */}
  {hasEnrollmentLimit && formData?.maxAttendees && (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Revenue Potential
        </span>
        <Icon name="TrendingUp" size={14} className="text-gray-400" />
      </div>
      
      <div className="space-y-2">
        {isLiveWebinar && prices.comboSinglePrice ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-secondary">Max Combo Single:</span>
              <span className="text-sm font-bold text-green-600">
                ${(parseFloat(prices.comboSinglePrice || 0) * parseInt(formData?.maxAttendees || 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-secondary">Max Combo Multi:</span>
              <span className="text-sm font-bold text-green-600">
                ${(parseFloat(prices.comboMultiPrice || 0) * parseInt(formData?.maxAttendees || 0)).toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-secondary">Max Single Revenue:</span>
              <span className="text-sm font-bold text-green-600">
                ${(parseFloat(prices.recordedSinglePrice || 0) * parseInt(formData?.maxAttendees || 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-secondary">Max Multi Revenue:</span>
              <span className="text-sm font-bold text-green-600">
                ${(parseFloat(prices.recordedMultiPrice || 0) * parseInt(formData?.maxAttendees || 0)).toFixed(2)}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-300">
          <span className="text-xs font-medium text-gray-700">Attendees:</span>
          <span className="text-sm font-bold text-gray-900">{formData?.maxAttendees || 0}</span>
        </div>
      </div>
    </div>
  )}
</div>

      </div>

      <div className="flex justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          <span className="hidden sm:inline">Back to {isRecordedWebinar ? 'Content Setup' : 'Scheduling'}</span>
          <span className="sm:hidden">Back</span>
        </Button>

        <Button
          variant="default"
          onClick={onNext}
          iconName="ArrowRight"
          iconPosition="right"
        >
          <span className="hidden sm:inline">Continue to Technical</span>
          <span className="sm:hidden">Continue</span>
        </Button>
      </div>
    </div>
  );
};

export default PricingStep;
