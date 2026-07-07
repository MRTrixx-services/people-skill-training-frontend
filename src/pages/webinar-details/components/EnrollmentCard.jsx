import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EnrollmentCard = ({ webinar, user, onEnroll, onJoinLive, onPurchaseRecording }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showZoomLink, setShowZoomLink] = useState(false);

  // Mock discount codes
  const validDiscounts = {
    'EARLY20': { percentage: 20, description: '20% Early Bird Discount' },
    'STUDENT15': { percentage: 15, description: '15% Student Discount' },
    'FIRST10': { percentage: 10, description: '10% First Time Discount' }
  };

  // Calculate time until webinar starts
  useEffect(() => {
    if (webinar?.status === 'upcoming') {
      const webinarDate = new Date(webinar.dateTime);
      const now = new Date();
      const timeDiff = webinarDate?.getTime() - now?.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({ days, hours, minutes });
        
        // Show Zoom link 15 minutes before start
        if (timeDiff <= 15 * 60 * 1000 && webinar?.isEnrolled) {
          setShowZoomLink(true);
        }
      }
    }
  }, [webinar?.status, webinar?.dateTime, webinar?.isEnrolled]);

  const applyDiscount = () => {
    const discount = validDiscounts?.[discountCode?.toUpperCase()];
    if (discount) {
      setAppliedDiscount(discount);
    } else {
      alert('Invalid discount code');
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
  };

  const calculatePrice = () => {
    let price = webinar?.price;
    if (appliedDiscount) {
      price = price - (price * appliedDiscount?.percentage / 100);
    }
    return price;
  };

  const getActionButton = () => {
    if (!user) {
      return (
        <Button
          variant="default"
          fullWidth
          onClick={() => window.location.href = '/login'}
          iconName="LogIn"
          iconPosition="left"
        >
          Sign In to Enroll
        </Button>
      );
    }

    if (webinar?.isEnrolled) {
      if (webinar?.status === 'live') {
        return (
          <Button
            variant="default"
            fullWidth
            onClick={onJoinLive}
            iconName="Video"
            iconPosition="left"
            className="bg-error hover:bg-error/90"
          >
            Join Live Session
          </Button>
        );
      } else if (webinar?.status === 'upcoming') {
        if (showZoomLink) {
          return (
            <Button
              variant="default"
              fullWidth
              onClick={onJoinLive}
              iconName="Video"
              iconPosition="left"
            >
              Join Webinar
            </Button>
          );
        } else {
          return (
            <Button
              variant="outline"
              fullWidth
              disabled
              iconName="CheckCircle"
              iconPosition="left"
            >
              Enrolled
            </Button>
          );
        }
      } else if (webinar?.status === 'completed') {
        return (
          <Button
            variant="default"
            fullWidth
            onClick={onPurchaseRecording}
            iconName="Play"
            iconPosition="left"
          >Purchase Recording - ${webinar?.recordingPrice}
          </Button>
        );
      }
    }

    if (webinar?.status === 'completed') {
      return (
        <Button
          variant="default"
          fullWidth
          onClick={onPurchaseRecording}
          iconName="Play"
          iconPosition="left"
        >Purchase Recording - ${webinar?.recordingPrice}
        </Button>
      );
    }

    return (
      <Button
        variant="default"
        fullWidth
        onClick={() => onEnroll(calculatePrice(), appliedDiscount)}
        iconName="CreditCard"
        iconPosition="left"
      >Enroll Now - ${calculatePrice()?.toFixed(2)}
      </Button>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-foreground">
            ${calculatePrice()?.toFixed(2)}
          </span>
          {appliedDiscount && (
            <span className="text-sm line-through text-muted-foreground">
              ${webinar?.price?.toFixed(2)}
            </span>
          )}
        </div>
        {appliedDiscount && (
          <div className="flex items-center justify-between bg-success/10 border border-success/20 rounded-lg p-2">
            <span className="text-sm text-success">
              {appliedDiscount?.description}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeDiscount}
              iconName="X"
              iconSize={14}
            />
          </div>
        )}
      </div>
      {/* Countdown Timer */}
      {timeLeft && webinar?.status === 'upcoming' && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-primary font-medium mb-2">Starts in:</div>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{timeLeft?.days}</div>
                <div className="text-xs text-primary/80">Days</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{timeLeft?.hours}</div>
                <div className="text-xs text-primary/80">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{timeLeft?.minutes}</div>
                <div className="text-xs text-primary/80">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Session Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-sm text-foreground">{webinar?.date}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="text-sm text-foreground">{webinar?.time} ({webinar?.timezone})</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="Timer" size={16} className="text-muted-foreground" />
          <span className="text-sm text-foreground">{webinar?.duration}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="Users" size={16} className="text-muted-foreground" />
          <span className="text-sm text-foreground">{webinar?.enrolledCount} enrolled</span>
        </div>
      </div>
      {/* Discount Code Section */}
      {!webinar?.isEnrolled && webinar?.status !== 'completed' && (
        <div className="mb-6">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e?.target?.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={applyDiscount}
              disabled={!discountCode || appliedDiscount}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
      {/* Action Button */}
      <div className="mb-6">
        {getActionButton()}
      </div>
      {/* Zoom Link (if applicable) */}
      {showZoomLink && webinar?.isEnrolled && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Video" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Ready to Join</span>
          </div>
          <p className="text-xs text-success/80">
            The webinar will start in 15 minutes. Click the button above to join.
          </p>
        </div>
      )}
      {/* Features */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span>Live interactive session</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span>Q&A with instructor</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span>Downloadable resources</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span>Certificate of completion</span>
        </div>
        {webinar?.recordingAvailable && (
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={14} className="text-success" />
            <span>Recording available for purchase</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentCard;