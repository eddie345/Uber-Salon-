import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {/* Step Dot */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300
                ${index + 1 <= currentStep
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-200 text-muted'
                }
              `}
            >
              {index + 1}
            </div>
            {/* Step Label */}
            <span
              className={`
                text-[11px] font-medium mt-2 transition-all duration-300
                ${index + 1 === currentStep ? 'text-primary font-bold' : 'text-muted'}
              `}
            >
              {stepLabels[index]}
            </span>
          </div>

          {/* Connector Line */}
          {index < totalSteps - 1 && (
            <div
              className={`
                w-8 h-0.5 transition-all duration-300
                ${index + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressIndicator;
