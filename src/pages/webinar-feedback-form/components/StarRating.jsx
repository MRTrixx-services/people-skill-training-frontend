import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const StarRating = ({ 
  label, 
  description, 
  value, 
  onChange, 
  required = false,
  error = null 
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleStarClick = (rating) => {
    onChange(rating);
  };

  const handleStarHover = (rating) => {
    setHoverValue(rating);
  };

  const handleStarLeave = () => {
    setHoverValue(0);
  };

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return texts?.[rating] || '';
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5]?.map((star) => {
            const isActive = star <= (hoverValue || value);
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className="p-1 rounded-full hover:bg-muted transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Icon
                  name="Star"
                  size={24}
                  className={`transition-colors ${
                    isActive 
                      ? 'text-warning fill-current' :'text-border hover:text-warning'
                  }`}
                />
              </button>
            );
          })}
        </div>
        
        {(value || hoverValue) && (
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm font-medium text-text-primary">
              {hoverValue || value}
            </span>
            <span className="text-sm text-text-secondary">
              {getRatingText(hoverValue || value)}
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default StarRating;