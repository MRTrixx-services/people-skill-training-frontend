import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ completedSections, totalSections }) => {
  const progressPercentage = (completedSections / totalSections) * 100;

  return (
    <div className="bg-surface border-b border-border p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Feedback Progress
          </span>
          <span className="text-sm text-text-secondary">
            {completedSections} of {totalSections} sections completed
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {progressPercentage === 100 && (
          <div className="flex items-center space-x-2 mt-2 text-success">
            <Icon name="CheckCircle" size={16} />
            <span className="text-sm font-medium">Ready to submit!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;