import React from 'react';
import Icon from '../../../components/AppIcon';

const ViewToggle = ({ onViewChange, currentView }) => (
  <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
    <button
      onClick={() => onViewChange('grid')}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === 'grid'
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon name="Grid3x3" size={16} />
      <span>Grid</span>
    </button>
    <button
      onClick={() => onViewChange('list')}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === 'list'
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon name="List" size={16} />
      <span>List</span>
    </button>
  </div>
);

export default ViewToggle;
