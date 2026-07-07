import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EnrollmentHistory = ({ history }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (enrollment) => {
    if (enrollment.refunded) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Refunded</span>;
    }
    
    switch (enrollment.status) {
      case 'completed':
        return enrollment.attended 
          ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Completed</span>
          : <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Missed</span>;
      case 'cancelled':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Cancelled</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{enrollment.status}</span>;
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        <span className="text-xs text-muted-foreground">Rating:</span>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name="Star"
            size={12}
            className={i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No enrollment history</h3>
        <p className="text-muted-foreground">Your webinar enrollment history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((enrollment) => (
        <div key={enrollment.id} className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Left Section */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">{enrollment.webinarTitle}</h3>
                {getStatusBadge(enrollment)}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <span>by {enrollment.instructor}</span>
                <span>•</span>
                <span>{formatDate(enrollment.date)}</span>
                <span>•</span>
                <span>${enrollment.price}</span>
              </div>

              {/* Attendance Info */}
              {enrollment.attended && (
                <div className="flex items-center space-x-6 mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Attended {enrollment.duration} minutes
                    </span>
                  </div>
                  {renderStars(enrollment.rating)}
                </div>
              )}

              {/* Refund Info */}
              {enrollment.refunded && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-2 text-red-800">
                    <Icon name="RefreshCw" size={16} />
                    <span className="text-sm font-medium">
                      Refunded ${enrollment.refundAmount} on {formatDate(enrollment.refundDate)}
                    </span>
                  </div>
                </div>
              )}

              {/* Features Earned */}
              <div className="flex items-center space-x-4">
                {enrollment.certificateEarned && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Icon name="Award" size={16} />
                    <span className="text-sm font-medium">Certificate Earned</span>
                  </div>
                )}
                {enrollment.recordingAccess && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Icon name="Play" size={16} />
                    <span className="text-sm font-medium">Recording Access</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
              {enrollment.certificateEarned && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => console.log('Download certificate')}
                >
                  Certificate
                </Button>
              )}
              
              {enrollment.recordingAccess && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Play"
                  iconPosition="left"
                  onClick={() => console.log('Watch recording')}
                >
                  Recording
                </Button>
              )}

              {enrollment.attended && !enrollment.rating && (
                <Button
                  variant="default"
                  size="sm"
                  iconName="Star"
                  iconPosition="left"
                  onClick={() => console.log('Rate webinar')}
                >
                  Rate
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnrollmentHistory;
