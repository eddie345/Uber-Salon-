import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  error
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(inputValue)) return;

    const newOtp = [...value];
    newOtp[index] = inputValue.slice(-1); // Take only the last character
    onChange(newOtp);

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input and clear it
        const newOtp = [...value];
        newOtp[index - 1] = '';
        onChange(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...value];
        newOtp[index] = '';
        onChange(newOtp);
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedData.length > 0) {
      const newOtp = [...value];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      onChange(newOtp);
      
      // Focus the next empty input or the last filled one
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 mb-6">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-14 rounded-xl border-2 text-center text-[22px] font-bold text-dark bg-white
            transition-all duration-200 focus:outline-none
            ${error ? 'border-danger' : 'border-[#E0E0E0] focus:border-primary focus:shadow-md'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${value[index] ? 'border-primary bg-[#E6F3EC]' : ''}
          `}
        />
      ))}
    </div>
  );
};

export default OTPInput;
