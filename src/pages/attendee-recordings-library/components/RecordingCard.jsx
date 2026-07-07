import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecordingCard = ({ recording, onPurchase, onWatch, onAddToWishlist, onRemoveFromWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price?.toFixed(2)}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(recording);
    }
  };

  const handleWatch = () => {
    if (onWatch) {
      onWatch(recording);
    }
  };

  const handleWishlistToggle = () => {
    if (recording?.isInWishlist) {
      onRemoveFromWishlist?.(recording?.id);
    } else {
      onAddToWishlist?.(recording?.id);
    }
  };

  return (
    <div 
      className="bg-card rounded-lg border border-border shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <Image
          src={recording?.thumbnail}
          alt={recording?.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Play Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered || !imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Icon name="Play" size={24} className="text-primary ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {formatDuration(recording?.duration)}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Icon 
            name="Heart" 
            size={16} 
            className={recording?.isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'} 
          />
        </button>

        {/* Free Badge */}
        {recording?.price === 0 && (
          <div className="absolute top-2 left-2 bg-success text-success-foreground text-xs px-2 py-1 rounded font-medium">
            Free
          </div>
        )}

        {/* Progress Bar for Purchased Content */}
        {recording?.isPurchased && recording?.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${recording?.progress}%` }}
            />
          </div>
        )}
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {recording?.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={12} color="white" />
          </div>
          <span className="text-text-secondary text-xs">{recording?.instructor}</span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(recording?.rating)}
          </div>
          <span className="text-text-secondary text-xs">
            {recording?.rating?.toFixed(1)} ({recording?.reviewCount})
          </span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">
              {formatPrice(recording?.price)}
            </span>
            {recording?.originalPrice && recording?.originalPrice > recording?.price && (
              <span className="text-text-secondary text-xs line-through">
                ${recording?.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {recording?.isPurchased ? (
              <Button
                variant="default"
                size="sm"
                onClick={handleWatch}
                iconName="Play"
                iconPosition="left"
                iconSize={14}
              >
                {recording?.progress > 0 ? 'Resume' : 'Watch'}
              </Button>
            ) : recording?.price === 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleWatch}
                iconName="Play"
                iconPosition="left"
                iconSize={14}
              >
                Watch Now
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handlePurchase}
                iconName="ShoppingCart"
                iconPosition="left"
                iconSize={14}
              >
                Purchase
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        {recording?.tags && recording?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {recording?.tags?.slice(0, 3)?.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-muted text-text-secondary px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingCard;