import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeedbackSection = ({ feedback, overallRating, totalReviews }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? 'text-accent fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedback?.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const sortedFeedback = [...feedback]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b?.rating - a?.rating;
      case 'lowest':
        return a?.rating - b?.rating;
      default:
        return 0;
    }
  });

  const displayedFeedback = showAll ? sortedFeedback : sortedFeedback?.slice(0, 3);
  const distribution = getRatingDistribution();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Student Reviews
        </h2>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>
      {/* Overall Rating Summary */}
      <div className="flex items-start space-x-6 mb-8 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-1">
            {overallRating?.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-1">
            {renderStars(overallRating)}
          </div>
          <div className="text-sm text-muted-foreground">
            {totalReviews} reviews
          </div>
        </div>
        
        <div className="flex-1">
          {[5, 4, 3, 2, 1]?.map((star) => (
            <div key={star} className="flex items-center space-x-2 mb-1">
              <span className="text-sm text-muted-foreground w-3">{star}</span>
              <Icon name="Star" size={12} className="text-accent" />
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full"
                  style={{
                    width: `${totalReviews > 0 ? (distribution?.[star] / totalReviews) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">
                {distribution?.[star]}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Individual Reviews */}
      <div className="space-y-6">
        {displayedFeedback?.map((review, index) => (
          <div key={index} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={review?.avatar}
                  alt={review?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      {review?.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(review?.rating)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review?.date}
                      </span>
                    </div>
                  </div>
                  {review?.verified && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review?.comment}
                </p>
                
                {review?.helpful > 0 && (
                  <div className="flex items-center space-x-4 mt-3">
                    <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground">
                      <Icon name="ThumbsUp" size={12} />
                      <span>Helpful ({review?.helpful})</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More/Less Button */}
      {feedback?.length > 3 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            iconName={showAll ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAll ? 'Show Less' : `Show All ${feedback?.length} Reviews`}
          </Button>
        </div>
      )}
      {/* No Reviews State */}
      {feedback?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your experience with this webinar.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;