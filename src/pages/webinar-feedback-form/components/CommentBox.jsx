import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CommentBox = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  maxLength = 500,
  required = false,
  error = null 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value ? value?.length : 0;
  const isNearLimit = characterCount > maxLength * 0.8;

  const handleTextareaChange = (e) => {
    const newValue = e?.target?.value;
    if (newValue?.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      </div>

      <div className="relative">
        <textarea
          value={value || ''}
          onChange={handleTextareaChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={4}
          className={`w-full px-3 py-3 border rounded-lg resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error 
              ? 'border-error bg-error/5' 
              : isFocused 
                ? 'border-primary bg-surface' :'border-border bg-surface hover:border-primary/50'
          }`}
        />
        
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          {characterCount > 0 && (
            <span className={`text-xs ${
              isNearLimit ? 'text-warning' : 'text-text-secondary'
            }`}>
              {characterCount}/{maxLength}
            </span>
          )}
        </div>
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

export default CommentBox;