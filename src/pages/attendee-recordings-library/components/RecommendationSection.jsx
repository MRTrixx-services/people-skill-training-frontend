import React from 'react';
import Icon from '../../../components/AppIcon';
import RecordingCard from './RecordingCard';

const RecommendationSection = ({ 
  title, 
  recordings, 
  onPurchase, 
  onWatch, 
  onAddToWishlist, 
  onRemoveFromWishlist,
  showViewAll = true 
}) => {
  const handleViewAll = () => {
    // Navigate to filtered view or expand section
    console.log(`View all ${title}`);
  };

  if (!recordings || recordings?.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6 mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Sparkles" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        </div>
        {showViewAll && (
          <button
            onClick={handleViewAll}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <span>View All</span>
            <Icon name="ChevronRight" size={16} />
          </button>
        )}
      </div>
      {/* Recordings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recordings?.slice(0, 4)?.map((recording) => (
          <RecordingCard
            key={recording?.id}
            recording={recording}
            onPurchase={onPurchase}
            onWatch={onWatch}
            onAddToWishlist={onAddToWishlist}
            onRemoveFromWishlist={onRemoveFromWishlist}
          />
        ))}
      </div>
      {/* Show More Button for Mobile */}
      {recordings?.length > 4 && (
        <div className="mt-4 text-center lg:hidden">
          <button
            onClick={handleViewAll}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Show {recordings?.length - 4} more recordings
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;