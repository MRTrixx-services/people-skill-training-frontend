import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DateRangePicker = ({ onDateRangeChange, selectedRange = 'last30' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const presetRanges = [
    { id: 'last7', label: 'Last 7 days', days: 7 },
    { id: 'last30', label: 'Last 30 days', days: 30 },
    { id: 'last90', label: 'Last 3 months', days: 90 },
    { id: 'thisYear', label: 'This year', days: 365 },
    { id: 'custom', label: 'Custom range', days: null }
  ];

  const handlePresetSelect = (rangeId) => {
    const range = presetRanges?.find(r => r?.id === rangeId);
    if (range && range?.days) {
      const endDate = new Date();
      const startDate = new Date();
      startDate?.setDate(endDate?.getDate() - range?.days);
      
      onDateRangeChange({
        startDate: startDate?.toISOString()?.split('T')?.[0],
        endDate: endDate?.toISOString()?.split('T')?.[0],
        preset: rangeId
      });
    }
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      onDateRangeChange({
        startDate: customStartDate,
        endDate: customEndDate,
        preset: 'custom'
      });
      setIsOpen(false);
    }
  };

  const getSelectedLabel = () => {
    const preset = presetRanges?.find(r => r?.id === selectedRange);
    return preset ? preset?.label : 'Select range';
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Calendar"
        iconPosition="left"
        iconSize={16}
        className="min-w-40"
      >
        {getSelectedLabel()}
        <Icon name="ChevronDown" size={16} className="ml-2" />
      </Button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-3 z-50">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-text-primary">Select Date Range</h3>
            </div>
            
            <div className="p-4 space-y-2">
              {presetRanges?.map((range) => (
                <button
                  key={range?.id}
                  onClick={() => range?.id !== 'custom' ? handlePresetSelect(range?.id) : null}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-smooth ${
                    selectedRange === range?.id
                      ? 'bg-primary/10 text-primary' :'hover:bg-muted text-text-primary'
                  }`}
                >
                  {range?.label}
                </button>
              ))}
            </div>

            {selectedRange === 'custom' && (
              <div className="p-4 border-t border-border space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCustomApply}
                  disabled={!customStartDate || !customEndDate}
                  fullWidth
                >
                  Apply Custom Range
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;