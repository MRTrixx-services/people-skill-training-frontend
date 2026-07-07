import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SearchAndFilters = ({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  sortBy,
  onSortChange,
  onFilterToggle,
  isFilterOpen 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'personal-development', label: 'Personal Development' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration', label: 'Duration' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const mockSuggestions = [
    'React Fundamentals',
    'Advanced JavaScript',
    'UI/UX Design Principles',
    'Digital Marketing Strategy',
    'Python for Data Science',
    'Project Management Basics'
  ];

  const handleSearchInput = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    
    if (value?.length > 2) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
  };

  return (
    <div className="bg-surface border-b border-border p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search recordings, instructors, topics..."
            value={searchQuery}
            onChange={handleSearchInput}
            className="pl-10 pr-10"
          />
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevation-3 z-50">
            {suggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex items-center space-x-3">
                  <Icon name="Search" size={16} className="text-text-secondary" />
                  <span className="text-text-primary">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <Select
            options={categories}
            value={selectedCategory}
            onChange={onCategoryChange}
            placeholder="Select category"
          />
        </div>

        {/* Sort Options */}
        <div className="flex-1">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={onFilterToggle}
          iconName="Filter"
          iconPosition="left"
          iconSize={16}
          className={isFilterOpen ? 'bg-primary text-primary-foreground' : ''}
        >
          Filters
        </Button>
      </div>
      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {['Free', 'Under $50', 'Beginner', 'Advanced', 'New Releases', 'Trending']?.map((chip) => (
          <button
            key={chip}
            className="px-3 py-1 text-sm bg-muted text-text-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilters;