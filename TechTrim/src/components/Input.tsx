import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefixElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefixElement, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col mb-4">
        {label && (
          <label className="text-[14px] font-semibold text-dark mb-1.5 font-sans">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {prefixElement && (
            <div className="absolute left-4 flex items-center pointer-events-none text-muted font-semibold">
              {prefixElement}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-[52px] rounded-[10px] border-[1.5px] bg-white text-dark text-[15px] px-4 font-sans transition focus:outline-none focus:border-primary ${
              prefixElement ? 'pl-[76px]' : ''
            } ${error ? 'border-danger' : 'border-[#E0E0E0]'} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-[12px] text-danger font-semibold mt-1 font-sans">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
