import React from 'react';

const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="bg-card rounded-lg border border-border shadow-elevation-1 overflow-hidden animate-pulse">
          {/* Thumbnail Skeleton */}
          <div className="aspect-video bg-muted"></div>
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            
            {/* Instructor */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="w-3 h-3 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-3 bg-muted rounded w-12"></div>
            </div>
            
            {/* Price and Button */}
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
            
            {/* Tags */}
            <div className="flex space-x-2">
              <div className="h-6 bg-muted rounded w-12"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
              <div className="h-6 bg-muted rounded w-10"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;