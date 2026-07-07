import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  steps = [],
  currentStep = 0,
  onStepClick,
  variant = 'horizontal' // 'horizontal' | 'vertical'
}) => {
  const handleStepClick = (stepIndex, step) => {
    if (onStepClick && !step?.disabled && stepIndex <= currentStep) {
      onStepClick(stepIndex, step);
    }
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (stepIndex, step) => {
    const status = getStepStatus(stepIndex);
    const isClickable = onStepClick && !step?.disabled && stepIndex <= currentStep;
    
    let classes = 'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ';
    
    if (status === 'completed') {
      classes += 'bg-success text-success-foreground ';
    } else if (status === 'current') {
      classes += 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ';
    } else {
      classes += 'bg-muted text-muted-foreground ';
    }
    
    if (isClickable) {
      classes += 'cursor-pointer hover-lift focus-ring ';
    } else if (step?.disabled) {
      classes += 'opacity-50 cursor-not-allowed ';
    }
    
    return classes;
  };

  const getConnectorClasses = (stepIndex) => {
    const isCompleted = stepIndex < currentStep;
    return `flex-1 h-0.5 transition-colors duration-200 ${
      isCompleted ? 'bg-success' : 'bg-muted'
    }`;
  };

  if (variant === 'vertical') {
    return (
      <div className="flex flex-col space-y-4">
        {steps?.map((step, index) => (
          <div key={step?.id || index} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <button
                onClick={() => handleStepClick(index, step)}
                className={getStepClasses(index, step)}
                disabled={step?.disabled || (!onStepClick || index > currentStep)}
                aria-label={`Step ${index + 1}: ${step?.title}`}
              >
                {getStepStatus(index) === 'completed' ? (
                  <Icon name="Check" size={16} color="currentColor" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              {index < steps?.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 transition-colors duration-200 ${
                  index < currentStep ? 'bg-success' : 'bg-muted'
                }`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium ${
                getStepStatus(index) === 'current' ?'text-foreground' 
                  : getStepStatus(index) === 'completed' ?'text-success' :'text-muted-foreground'
              }`}>
                {step?.title}
              </h3>
              {step?.description && (
                <p className="text-xs text-text-secondary mt-1">
                  {step?.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id || index}>
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(index, step)}
                className={getStepClasses(index, step)}
                disabled={step?.disabled || (!onStepClick || index > currentStep)}
                aria-label={`Step ${index + 1}: ${step?.title}`}
              >
                {getStepStatus(index) === 'completed' ? (
                  <Icon name="Check" size={16} color="currentColor" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <div className="mt-2 text-center">
                <h3 className={`text-xs font-medium ${
                  getStepStatus(index) === 'current' ?'text-foreground' 
                    : getStepStatus(index) === 'completed' ?'text-success' :'text-muted-foreground'
                }`}>
                  {step?.title}
                </h3>
                {step?.description && (
                  <p className="text-xs text-text-secondary mt-1 hidden sm:block">
                    {step?.description}
                  </p>
                )}
              </div>
            </div>
            {index < steps?.length - 1 && (
              <div className={getConnectorClasses(index)} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;