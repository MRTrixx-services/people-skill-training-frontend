// pages/payment/components/CheckoutProgressSteps.jsx
import React from 'react';
import { Check } from 'lucide-react';

const CheckoutProgressSteps = ({ steps = [], currentStep = 0 }) => {
  // ✅ Add default empty array to prevent undefined error
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${
                    index < currentStep
                      ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-200'
                      : index === currentStep
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }
                `}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              <p
                className={`
                  mt-2 text-sm font-medium px-2 text-center
                  ${
                    index <= currentStep
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {step.label || step.name}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 -mt-8">
                <div
                  className={`
                    h-full transition-all duration-300 rounded-full
                    ${
                      index < currentStep
                        ? 'bg-green-500 shadow-sm'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }
                  `}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgressSteps;
