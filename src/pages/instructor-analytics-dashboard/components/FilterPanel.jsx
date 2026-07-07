import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ onFiltersChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    performanceThreshold: '',
    ratingRange: ''
  });

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'data-science', label: 'Data Science' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const performanceOptions = [
    { value: '', label: 'All Performance' },
    { value: 'high', label: 'High Performance (>85%)' },
    { value: 'medium', label: 'Medium Performance (70-85%)' },
    { value: 'low', label: 'Low Performance (<70%)' }
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '4.5+', label: '4.5+ Stars' },
    { value: '4.0+', label: '4.0+ Stars' },
    { value: '3.5+', label: '3.5+ Stars' },
    { value: '<3.5', label: 'Below 3.5 Stars' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: '',
      status: '',
      performanceThreshold: '',
      ratingRange: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className={`bg-card border border-border rounded-lg shadow-elevation-1 transition-all duration-300 ${
      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Filter Options</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
              className="text-text-secondary hover:text-error"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={filters?.category}
            onChange={(value) => handleFilterChange('category', value)}
            placeholder="Select category"
          />

          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Select status"
          />

          <Select
            label="Performance"
            options={performanceOptions}
            value={filters?.performanceThreshold}
            onChange={(value) => handleFilterChange('performanceThreshold', value)}
            placeholder="Select performance"
          />

          <Select
            label="Rating Range"
            options={ratingOptions}
            value={filters?.ratingRange}
            onChange={(value) => handleFilterChange('ratingRange', value)}
            placeholder="Select rating"
          />
        </div>

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters)?.map(([key, value]) => {
                  if (!value) return null;
                  
                  const getFilterLabel = () => {
                    switch (key) {
                      case 'category':
                        return categoryOptions?.find(opt => opt?.value === value)?.label;
                      case 'status':
                        return statusOptions?.find(opt => opt?.value === value)?.label;
                      case 'performanceThreshold':
                        return performanceOptions?.find(opt => opt?.value === value)?.label;
                      case 'ratingRange':
                        return ratingOptions?.find(opt => opt?.value === value)?.label;
                      default:
                        return value;
                    }
                  };

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {getFilterLabel()}
                      <button
                        onClick={() => handleFilterChange(key, '')}
                        className="ml-1 hover:text-error transition-smooth"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;