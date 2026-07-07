import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecordingCard = ({ recording, onBuy, onWatch, viewMode = 'grid' }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const discountPercentage = recording.originalPrice > recording.price 
    ? Math.round(((recording.originalPrice - recording.price) / recording.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-14 bg-muted rounded flex items-center justify-center flex-shrink-0">
            <Icon name="Play" size={24} className="text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate mb-1">
                  {recording.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                  <span>by {recording.instructor}</span>
                  <span>•</span>
                  <span>{formatDate(recording.originalDate)}</span>
                  <span>•</span>
                  <span>{formatDuration(recording.duration)}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Icon name="Star" size={12} className="text-yellow-500 mr-1" />
                    {recording.rating}
                  </span>
                </div>
                
                {recording.owned && recording.watchProgress !== undefined && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-20 bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${recording.watchProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{recording.watchProgress}%</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <div className="text-right">
                  {recording.owned ? (
                    <span className="text-sm text-green-600 font-medium">Owned</span>
                  ) : recording.price === 0 ? (
                    <span className="text-lg font-bold text-green-600">FREE</span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-foreground">
                        ${recording.price}
                      </span>
                      {discountPercentage > 0 && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${recording.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {recording.preview && !recording.owned && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(recording.preview, '_blank')}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      Preview
                    </Button>
                  )}
                  
                  {recording.owned ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onWatch(recording)}
                      iconName="Play"
                      iconPosition="left"
                    >
                      {recording.watchProgress > 0 ? 'Continue' : 'Watch'}
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onBuy(recording)}
                      iconName={recording.price === 0 ? 'Download' : 'CreditCard'}
                      iconPosition="left"
                    >
                      {recording.price === 0 ? 'Get Free' : 'Buy Now'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-video bg-muted relative group cursor-pointer">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Icon name="Play" size={48} className="text-gray-400" />
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <Icon name="Play" size={24} className="text-gray-700 ml-1" />
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
            {formatDuration(recording.duration)}
          </span>
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Owned Badge */}
        {recording.owned && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Owned
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
            {recording.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {recording.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center space-x-2 mb-3">
          <img 
            src={recording.instructorAvatar} 
            alt={recording.instructor}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-muted-foreground">{recording.instructor}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-yellow-500" />
              <span>{recording.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} />
              <span>{recording.views.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-xs">{formatDate(recording.originalDate)}</span>
        </div>

        {/* Watch Progress (for owned recordings) */}
        {recording.owned && recording.watchProgress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{recording.watchProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${recording.watchProgress}%` }}
              />
            </div>
            {recording.lastWatched && (
              <p className="text-xs text-muted-foreground mt-1">
                Last watched: {formatDate(recording.lastWatched)}
              </p>
            )}
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            {recording.owned ? (
              <span className="text-sm text-green-600 font-medium">Owned</span>
            ) : recording.price === 0 ? (
              <span className="text-lg font-bold text-green-600">FREE</span>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground">
                  ${recording.price}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${recording.originalPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {recording.preview && !recording.owned && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(recording.preview, '_blank')}
                iconName="Eye"
                iconPosition="left"
              >
                Preview
              </Button>
            )}
            
            {recording.owned ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => onWatch(recording)}
                iconName="Play"
                iconPosition="left"
              >
                {recording.watchProgress > 0 ? 'Continue' : 'Watch'}
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => onBuy(recording)}
                iconName={recording.price === 0 ? 'Download' : 'CreditCard'}
                iconPosition="left"
              >
                {recording.price === 0 ? 'Get Free' : 'Buy Now'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingCard;
