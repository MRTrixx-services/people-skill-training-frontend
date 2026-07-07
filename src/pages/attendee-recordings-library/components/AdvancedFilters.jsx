import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const AdvancedFilters = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState({
    priceRange: currentFilters?.priceRange || 'all',
    duration: currentFilters?.duration || 'all',
    level: currentFilters?.level || [],
    rating: currentFilters?.rating || 0,
    instructor: currentFilters?.instructor || 'all',
    language: currentFilters?.language || 'all',
    features: currentFilters?.features || []
  });

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: '0-25', label: '$0 - $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: '$100+' }
  ];

  const durations = [
    { value: 'all', label: 'Any Duration' },
    { value: '0-30', label: 'Under 30 minutes' },
    { value: '30-60', label: '30-60 minutes' },
    { value: '60-120', label: '1-2 hours' },
    { value: '120+', label: '2+ hours' }
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const instructors = [
    { value: 'all', label: 'All Instructors' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'michael-chen', label: 'Michael Chen' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'david-wilson', label: 'David Wilson' },
    { value: 'lisa-anderson', label: 'Lisa Anderson' }
  ];

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' }
  ];

  const features = [
    { value: 'captions', label: 'Closed Captions' },
    { value: 'downloadable', label: 'Downloadable Resources' },
    { value: 'certificate', label: 'Certificate of Completion' },
    { value: 'mobile', label: 'Mobile Friendly' },
    { value: 'lifetime', label: 'Lifetime Access' }
  ];

  const handleLevelChange = (level, checked) => {
    setFilters(prev => ({
      ...prev,
      level: checked 
        ? [...prev?.level, level]
        : prev?.level?.filter(l => l !== level)
    }));
  };

  const handleFeatureChange = (feature, checked) => {
    setFilters(prev => ({
      ...prev,
      features: checked 
        ? [...prev?.features, feature]
        : prev?.features?.filter(f => f !== feature)
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, rating }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: 'all',
      duration: 'all',
      level: [],
      rating: 0,
      instructor: 'all',
      language: 'all',
      features: []
    };
    setFilters(resetFilters);
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => interactive && handleRatingChange(index + 1)}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        disabled={!interactive}
      >
        <Icon
          name="Star"
          size={16}
          className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={onClose} />
      {/* Filter Panel */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-surface border-l border-border shadow-elevation-3 z-50 transform transition-transform duration-300 lg:relative lg:inset-auto lg:w-full lg:shadow-none lg:border-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-text-primary">Advanced Filters</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Price Range */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Price Range</h4>
              <Select
                options={priceRanges}
                value={filters?.priceRange}
                onChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
              />
            </div>

            {/* Duration */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Duration</h4>
              <Select
                options={durations}
                value={filters?.duration}
                onChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}
              />
            </div>

            {/* Level */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Difficulty Level</h4>
              <div className="space-y-2">
                {levels?.map((level) => (
                  <Checkbox
                    key={level?.value}
                    label={level?.label}
                    checked={filters?.level?.includes(level?.value)}
                    onChange={(e) => handleLevelChange(level?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1]?.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
                      filters?.rating === rating ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      {renderStars(rating)}
                    </div>
                    <span className="text-sm">& up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Instructor</h4>
              <Select
                options={instructors}
                value={filters?.instructor}
                onChange={(value) => setFilters(prev => ({ ...prev, instructor: value }))}
                searchable
              />
            </div>

            {/* Language */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Language</h4>
              <Select
                options={languages}
                value={filters?.language}
                onChange={(value) => setFilters(prev => ({ ...prev, language: value }))}
              />
            </div>

            {/* Features */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Features</h4>
              <div className="space-y-2">
                {features?.map((feature) => (
                  <Checkbox
                    key={feature?.value}
                    label={feature?.label}
                    checked={filters?.features?.includes(feature?.value)}
                    onChange={(e) => handleFeatureChange(feature?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button variant="default" fullWidth onClick={handleApply}>
              Apply Filters
            </Button>
            <Button variant="outline" fullWidth onClick={handleReset}>
              Reset All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedFilters;