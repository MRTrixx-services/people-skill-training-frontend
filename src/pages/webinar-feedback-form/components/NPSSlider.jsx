import React from 'react';
import Icon from '../../../components/AppIcon';

const NPSSlider = ({ value, onChange, error = null }) => {
  const handleSliderChange = (e) => {
    onChange(parseInt(e?.target?.value));
  };

  const getNPSCategory = (score) => {
    if (score >= 9) return { label: 'Promoter', color: 'text-success' };
    if (score >= 7) return { label: 'Passive', color: 'text-warning' };
    return { label: 'Detractor', color: 'text-error' };
  };

  const category = value !== null ? getNPSCategory(value) : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          How likely are you to recommend this webinar to others?
          <span className="text-error ml-1">*</span>
        </label>
        <p className="text-sm text-text-secondary">
          Rate from 0 (not at all likely) to 10 (extremely likely)
        </p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="range"
            min="0"
            max="10"
            value={value || 0}
            onChange={handleSliderChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-text-secondary mt-2">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>

        {value !== null && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-text-primary">{value}</span>
              <span className={`text-sm font-medium ${category?.color}`}>
                {category?.label}
              </span>
            </div>
            <div className="text-sm text-text-secondary">
              {value === 0 && "Not at all likely"}
              {value >= 1 && value <= 3 && "Unlikely"}
              {value >= 4 && value <= 6 && "Neutral"}
              {value >= 7 && value <= 8 && "Likely"}
              {value >= 9 && value <= 10 && "Very likely"}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </p>
      )}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default NPSSlider;