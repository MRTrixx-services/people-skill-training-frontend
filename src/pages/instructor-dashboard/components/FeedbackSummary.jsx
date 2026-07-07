import React from 'react';
import Icon from '../../../components/AppIcon';

const FeedbackSummary = ({ feedback }) => {
  const averageRating = feedback?.ratings?.reduce((sum, rating) => sum + rating?.value, 0) / feedback?.ratings?.length;
  
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedback?.ratings?.forEach(rating => {
      distribution[rating.value]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalRatings = feedback?.ratings?.length;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Session Feedback</h3>
        <span className="text-sm text-muted-foreground">{totalRatings} responses</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Rating */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-3xl font-bold text-foreground mb-2">
              {averageRating?.toFixed(1)}
            </p>
            <div className="flex items-center justify-center space-x-1 mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </div>
        
        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1]?.map(rating => {
            const count = distribution?.[rating];
            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm text-foreground">{rating}</span>
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Recent Comments */}
      {feedback?.comments && feedback?.comments?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Recent Comments</h4>
          <div className="space-y-4 max-h-48 overflow-y-auto">
            {feedback?.comments?.slice(0, 3)?.map((comment, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(comment?.rating)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.date)?.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground">{comment?.text}</p>
                <p className="text-xs text-muted-foreground mt-2">- {comment?.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSummary;