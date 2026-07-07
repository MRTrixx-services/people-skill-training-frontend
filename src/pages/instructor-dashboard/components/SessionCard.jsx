import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionCard = ({ session, onViewZoom, onViewDetails }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary text-primary-foreground';
      case 'live':
        return 'bg-success text-success-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{session?.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session?.status)}`}>
              {session?.status?.charAt(0)?.toUpperCase() + session?.status?.slice(1)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{session?.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>{formatDate(session?.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={16} />
              <span>{formatTime(session?.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={16} />
              <span>{session?.enrolledCount} enrolled</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActions(!showActions)}
          >
            <Icon name="MoreVertical" size={16} />
          </Button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal z-10">
              <div className="p-1">
                {/* <button
                  onClick={() => {
                    onEdit(session);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
                >
                  <Icon name="Edit" size={16} />
                  <span>Edit Session</span>
                </button> */}
                {/* <button
                  onClick={() => {
                    onUploadResource(session);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
                >
                  <Icon name="Upload" size={16} />
                  <span>Upload Resources</span>
                </button> */}
                <button
                  onClick={() => {
                    onViewZoom(session);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
                >
                  <Icon name="Video" size={16} />
                  <span>Zoom Link</span>
                </button>
                <button
                  onClick={() => {
                    onViewDetails(session);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
                >
                  <Icon name="Eye" size={16} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <div className="flex items-center space-x-1 text-sm">
            <Icon name="DollarSign" size={16} className="text-success" />
            <span className="text-foreground font-medium">${session?.price}</span>
          </div> */}
          <div className="flex items-center space-x-1 text-sm">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">{session?.duration} min</span>
          </div>
        </div>
        
        {session?.status === 'scheduled' && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onViewZoom(session)}
            iconName="Video"
            iconPosition="left"
            iconSize={16}
          >
            Join Session
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;