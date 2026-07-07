import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WebinarListItem = ({ webinar, onEnroll, onViewDetails }) => {
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

  const spotsRemaining = webinar.maxAttendees - webinar.enrolledCount;

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {/* Instructor Avatar */}
        <img 
          src={webinar.instructorAvatar} 
          alt={webinar.instructor}
          className="w-12 h-12 rounded-full flex-shrink-0"
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {webinar.title}
                </h3>
                {webinar.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tag === 'Free' ? 'bg-green-100 text-green-800' :
                      tag === 'Premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {webinar.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>by {webinar.instructor}</span>
                <span>•</span>
                <span>{formatDate(webinar.date)}</span>
                <span>•</span>
                <span>{webinar.duration} min</span>
                <span>•</span>
                <span>{webinar.level}</span>
              </div>
            </div>
            
            {/* Right side - Price and Actions */}
            <div className="flex items-center space-x-4 ml-4">
              <div className="text-right">
                {webinar.type === 'free' ? (
                  <span className="text-lg font-bold text-green-600">FREE</span>
                ) : (
                  <span className="text-lg font-bold text-foreground">
                    ${webinar.price}
                  </span>
                )}
                <p className="text-xs text-muted-foreground">
                  {spotsRemaining} spots left
                </p>
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
      </div>
    </div>
  );
};

export default WebinarListItem;
