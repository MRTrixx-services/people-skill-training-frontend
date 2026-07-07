import React from 'react';
import Icon from '../../../components/AppIcon';

const MultipleChoiceQuestion = ({ 
  question, 
  options, 
  value, 
  onChange, 
  required = false,
  error = null 
}) => {
  const handleOptionChange = (optionValue) => {
    onChange(optionValue);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          {question}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      </div>
      <div className="space-y-2">
        {options?.map((option) => (
          <label
            key={option?.value}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-smooth"
            style={{ minHeight: '44px' }}
          >
            <div className="relative">
              <input
                type="radio"
                name={`question-${question}`}
                value={option?.value}
                checked={value === option?.value}
                onChange={() => handleOptionChange(option?.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === option?.value
                  ? 'border-primary bg-primary' :'border-border bg-surface'
              }`}>
                {value === option?.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-text-primary">
                {option?.label}
              </span>
              {option?.description && (
                <p className="text-xs text-text-secondary mt-1">
                  {option?.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;