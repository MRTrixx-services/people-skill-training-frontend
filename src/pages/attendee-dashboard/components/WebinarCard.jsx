import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WebinarCard = ({ webinar, onEnroll, onViewDetails, userType = 'attendee' }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = new Date(webinar.date) > new Date();
  const spotsRemaining = webinar.maxAttendees - webinar.enrolledCount;
  const enrollmentPercentage = (webinar.enrolledCount / webinar.maxAttendees) * 100;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header with Tags */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {webinar.tags?.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  tag === 'Free' ? 'bg-green-100 text-green-800' :
                  tag === 'Premium' ? 'bg-purple-100 text-purple-800' :
                  tag === 'Popular' ? 'bg-orange-100 text-orange-800' :
                  tag === 'Certificate' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-1 text-yellow-500">
            <Icon name="Star" size={14} className="fill-current" />
            <span className="text-xs font-medium text-foreground">{webinar.rating}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            webinar.level === 'Beginner' ? 'bg-green-50 text-green-700' :
            webinar.level === 'Intermediate' ? 'bg-yellow-50 text-yellow-700' :
            'bg-red-50 text-red-700'
          }`}>
            {webinar.level}
          </span>
          <span className="text-xs text-muted-foreground">{webinar.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {webinar.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {webinar.description}
        </p>

        {/* Instructor Info */}
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src={webinar.instructorAvatar} 
            alt={webinar.instructor}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {webinar.instructor}
            </p>
          </div>
        </div>

        {/* Session Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(webinar.date)}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>{webinar.duration} min</span>
            </div>
          </div>

          {/* Enrollment Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {webinar.enrolledCount}/{webinar.maxAttendees} enrolled
              </span>
              <span className={`font-medium ${
                spotsRemaining < 10 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {spotsRemaining} spots left
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all ${
                  enrollmentPercentage > 90 ? 'bg-red-500' :
                  enrollmentPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Resources Preview */}
        {webinar.resources && webinar.resources.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-2">Includes:</p>
            <div className="flex flex-wrap gap-1">
              {webinar.resources.slice(0, 3).map((resource, index) => (
                <span 
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {resource}
                </span>
              ))}
              {webinar.resources.length > 3 && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  +{webinar.resources.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            {webinar.type === 'free' ? (
              <span className="text-lg font-bold text-green-600">FREE</span>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground">
                  ${webinar.price}
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(webinar)}
            >
              Details
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => onEnroll(webinar)}
              disabled={spotsRemaining === 0}
              iconName={webinar.type === 'free' ? 'BookOpen' : 'CreditCard'}
              iconPosition="left"
            >
              {spotsRemaining === 0 ? 'Full' : webinar.type === 'free' ? 'Enroll' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarCard;
