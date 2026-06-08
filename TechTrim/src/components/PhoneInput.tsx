import React, { useState, useEffect } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  disabled = false
}) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [formattedValue, setFormattedValue] = useState('');

  // Format phone number as Ghana format: XXX XXX XXXX
  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  // Validate Ghana phone number
  const validateGhanaPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    // Ghana numbers: 9-10 digits, starting with 0, 2, 5, etc.
    return cleaned.length >= 9 && cleaned.length <= 10;
  };

  useEffect(() => {
    const formatted = formatPhoneNumber(value);
    setFormattedValue(formatted);
    
    if (value.length > 0) {
      setIsValid(validateGhanaPhone(value));
    } else {
      setIsValid(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
    onChange(inputValue);
  };

  return (
    <div className="w-full">
      <label className="text-[14px] font-semibold text-dark mb-2 font-sans block">
        Phone Number
      </label>
      
      <div className="relative flex items-center">
        {/* Country Flag & Code - Fixed */}
        <div className="flex items-center bg-gray-50 border border-r-0 border-[#E0E0E0] rounded-l-[10px] px-4 py-3.5 select-none">
          <span className="text-[20px] mr-2">🇬🇭</span>
          <span className="text-[15px] font-bold text-dark">+233</span>
        </div>

        {/* Phone Input */}
        <div className="relative flex-1">
          <input
            type="tel"
            value={formattedValue}
            onChange={handleChange}
            placeholder="501 112 222"
            disabled={disabled}
            maxLength={12} // XXX XXX XXXX format
            className={`
              w-full h-[52px] rounded-r-[10px] border-[1.5px] bg-white text-dark text-[16px] px-4 font-sans
              transition focus:outline-none focus:border-primary focus:shadow-md
              ${error ? 'border-danger' : 'border-[#E0E0E0]'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isValid === true ? 'border-success pr-12' : ''}
              ${isValid === false ? 'border-danger pr-12' : ''}
            `}
          />

          {/* Validation Icon */}
          {isValid !== null && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <IconCheck className="w-4 h-4 text-green-600" />
                </div>
              ) : (
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <IconX className="w-4 h-4 text-red-600" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-danger text-[12px] font-semibold">
          <IconX className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {isValid && !error && (
        <div className="flex items-center gap-1.5 mt-2 text-green-600 text-[12px] font-semibold">
          <IconCheck className="w-4 h-4" />
          <span>Valid Ghana phone number</span>
        </div>
      )}

      {/* Helper Text */}
      {!isValid && !error && value.length === 0 && (
        <p className="text-[12px] text-muted mt-2">
          Enter your Ghana phone number (e.g., 501 112 222)
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
