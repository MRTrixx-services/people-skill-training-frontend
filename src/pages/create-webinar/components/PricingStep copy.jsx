import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from 'components/ui/Checkbox';

const PricingStep = ({
  formData,
  onUpdate,
  onNext,
  onPrevious,
  errors = {}
}) => {
  const [hasEarlyBird, setHasEarlyBird] = useState(formData?.hasEarlyBird || false);
  const [hasEnrollmentLimit, setHasEnrollmentLimit] = useState(formData?.hasEnrollmentLimit || false);

  // Get webinar type to determine which pricing sections to show [web:61][web:132]
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Conditional Live Version - Only show for live webinars [web:134] */}
          {isLiveWebinar && (
            <div>
              <label className="font-semibold text-lg mb-2  flex items-center">
                <Icon name="Zap" size={18} className="mr-2 text-green-600" />
                Live Session Pricing
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
            <label className="font-semibold text-lg mb-2  flex items-center">
              <Icon name="Play" size={18} className="mr-2 text-blue-600" />
              {isRecordedWebinar ? 'Content Access Pricing' : 'Recorded Version Pricing'}
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

          {/* Combo Offers - Only show for live webinars [web:61] */}
          {isLiveWebinar && (
            <div>
              <label className="font-semibold text-lg mb-2  flex items-center">
                <Icon name="Package" size={18} className="mr-2 text-purple-600" />
                Combo Offers (Live + Recorded)
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

        <div className="space-y-6">
          {/* Updated Pricing Summary - Conditional based on webinar type [web:142] */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Icon name="DollarSign" size={16} color="var(--color-primary)" className="mr-2" />
              Pricing Summary
            </h3>

            <div className="space-y-3">
              {/* Live pricing - only show for live webinars */}
              {isLiveWebinar && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Live Single Attendee:</span>
                    <span className="text-lg font-semibold text-foreground">${prices.liveSinglePrice || '0.00'}</span>
                  </div>

                  {hasEarlyBird && prices.earlyBirdSinglePrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-accent">Early Bird Single Attendee:</span>
                      <span className="text-lg font-semibold text-accent">${prices.earlyBirdSinglePrice}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Live Multi Attendees:</span>
                    <span className="text-lg font-semibold text-foreground">${prices.liveMultiPrice || '0.00'}</span>
                  </div>

                  {hasEarlyBird && prices.earlyBirdMultiPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-accent">Early Bird Multi Attendees:</span>
                      <span className="text-lg font-semibold text-accent">${prices.earlyBirdMultiPrice}</span>
                    </div>
                  )}
                </>
              )}

              {/* Recorded pricing - always show */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">
                  {isRecordedWebinar ? 'Single Attendee Access:' : 'Recorded Single Attendee:'}
                </span>
                <span className="text-lg font-semibold text-foreground">${prices.recordedSinglePrice || '0.00'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">
                  {isRecordedWebinar ? 'Multi Attendees Access:' : 'Recorded Multi Attendees:'}
                </span>
                <span className="text-lg font-semibold text-foreground">${prices.recordedMultiPrice || '0.00'}</span>
              </div>

              {/* Combo pricing - only show for live webinars */}
              {isLiveWebinar && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Combo Single Attendee:</span>
                    <span className="text-lg font-semibold text-accent">
                      ${prices.comboSinglePrice || '0.00'}
                      {calculatedComboSingleOriginalPrice && +calculatedComboSingleOriginalPrice > 0 && (
                        <del className="ml-2 text-text-secondary">${calculatedComboSingleOriginalPrice}</del>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Combo Multi Attendees:</span>
                    <span className="text-lg font-semibold text-accent">
                      ${prices.comboMultiPrice || '0.00'}
                      {calculatedComboMultiOriginalPrice && +calculatedComboMultiOriginalPrice > 0 && (
                        <del className="ml-2 text-text-secondary">${calculatedComboMultiOriginalPrice}</del>
                      )}
                    </span>
                  </div>
                </>
              )}

              {/* Revenue calculations */}
              {hasEnrollmentLimit && formData?.maxAttendees && (
                <div className="pt-2 border-t border-border space-y-2">
                  {isLiveWebinar && prices.comboSinglePrice ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-secondary">Max Combo Single Revenue:</span>
                        <span className="text-sm font-medium text-foreground">
                          ${(parseFloat(prices.comboSinglePrice || 0) * parseInt(formData?.maxAttendees || 0))?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-secondary">Max Combo Multi Revenue:</span>
                        <span className="text-sm font-medium text-foreground">
                          ${(parseFloat(prices.comboMultiPrice || 0) * parseInt(formData?.maxAttendees || 0))?.toFixed(2)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-secondary">Max Single Revenue:</span>
                        <span className="text-sm font-medium text-foreground">
                          ${(parseFloat(prices.recordedSinglePrice || 0) * parseInt(formData?.maxAttendees || 0))?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-secondary">Max Multi Revenue:</span>
                        <span className="text-sm font-medium text-foreground">
                          ${(parseFloat(prices.recordedMultiPrice || 0) * parseInt(formData?.maxAttendees || 0))?.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Updated Tips - Conditional based on webinar type */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="TrendingUp" size={16} color="var(--color-accent)" className="mr-2" />
              {isRecordedWebinar ? 'Recorded Content Pricing Tips' : 'Pricing Strategy Tips'}
            </h3>
            <ul className="text-xs text-text-secondary space-y-1">
              {isRecordedWebinar ? (
                <>
                  <li>• Price lower than live sessions for accessibility</li>
                  <li>• Consider the content length and value</li>
                  <li>• Multi-attendee pricing encourages team purchases</li>
                  <li>• Content available 24/7 adds convenience value</li>
                  <li>• Research similar recorded content pricing</li>
                </>
              ) : (
                <>
                  <li>• Research competitor pricing in your niche</li>
                  <li>• Consider the value and duration of content</li>
                  <li>• Combo offers can boost average order value</li>
                  <li>• Flexible pricing meets diverse customer needs</li>
                  <li>• Limited seats create urgency</li>
                </>
              )}
            </ul>
          </div>

          {/* Enrollment Settings */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="Users" size={16} color="var(--color-warning)" className="mr-2" />
              Enrollment Settings
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Capacity:</span>
                <span className="text-foreground">
                  {hasEnrollmentLimit ? `${formData?.maxAttendees || 0} attendees` : 'Unlimited'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Content Type:</span>
                <span className="text-foreground capitalize">{isRecordedWebinar ? 'On-Demand' : 'Live + Optional Recording'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Registration:</span>
                <span className="text-foreground">Open</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ArrowLeft"
          iconPosition="left"
        >
             <span className="hidden sm:inline">  Back to {isRecordedWebinar ? 'Content Setup' : 'Scheduling'}</span>
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
