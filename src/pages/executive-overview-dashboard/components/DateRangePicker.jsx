import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DateRangePicker = ({ onDateRangeChange = () => {} }) => {
  const [selectedRange, setSelectedRange] = useState('current-quarter');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dateRanges = [
    { value: 'today', label: 'Today', description: 'Current day' },
    { value: 'yesterday', label: 'Yesterday', description: 'Previous day' },
    { value: 'last-7-days', label: 'Last 7 Days', description: 'Past week' },
    { value: 'last-30-days', label: 'Last 30 Days', description: 'Past month' },
    { value: 'current-quarter', label: 'Current Quarter', description: 'Q3 2024' },
    { value: 'last-quarter', label: 'Last Quarter', description: 'Q2 2024' },
    { value: 'current-year', label: 'Current Year', description: '2024' },
    { value: 'last-year', label: 'Last Year', description: '2023' }
  ];

  const handleRangeSelect = (range) => {
    setSelectedRange(range?.value);
    setIsDropdownOpen(false);
    onDateRangeChange(range?.value, comparisonEnabled);
  };

  const toggleComparison = () => {
    const newComparisonState = !comparisonEnabled;
    setComparisonEnabled(newComparisonState);
    onDateRangeChange(selectedRange, newComparisonState);
  };

  const getCurrentRangeLabel = () => {
    const range = dateRanges?.find(r => r?.value === selectedRange);
    return range ? range?.label : 'Select Range';
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Date Range Selector */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          iconName="Calendar"
          iconPosition="left"
          className="min-w-48"
        >
          {getCurrentRangeLabel()}
          <Icon name="ChevronDown" size={16} className="ml-2" />
        </Button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation-3 z-50">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                Select Date Range
              </div>
              {dateRanges?.map((range) => (
                <button
                  key={range?.value}
                  onClick={() => handleRangeSelect(range)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm transition-micro
                    hover:bg-muted/50 flex items-center justify-between
                    ${selectedRange === range?.value ? 'bg-primary/10 text-primary' : 'text-foreground'}
                  `}
                >
                  <div>
                    <div className="font-medium">{range?.label}</div>
                    <div className="text-xs text-muted-foreground">{range?.description}</div>
                  </div>
                  {selectedRange === range?.value && (
                    <Icon name="Check" size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Comparison Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleComparison}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-micro
            ${comparisonEnabled 
              ? 'bg-primary/10 text-primary border border-primary/20' :'bg-muted/50 text-muted-foreground hover:bg-muted'
            }
          `}
        >
          <Icon name="GitCompare" size={16} />
          <span>Compare</span>
        </button>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location?.reload()}
          title="Refresh Data"
        >
          <Icon name="RefreshCw" size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          title="Export Data"
        >
          <Icon name="Download" size={16} />
        </Button>
      </div>
      {/* Click outside handler */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangePicker;