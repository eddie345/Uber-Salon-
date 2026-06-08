import React from 'react';
import { IconLoader2 } from '@tabler/icons-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'h-[52px] rounded-[10px] font-bold text-[15px] px-6 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-[#005230] hover:shadow-lg hover:-translate-y-0.5 border border-transparent',
    secondary: 'bg-white text-primary border-[1.5px] border-primary hover:bg-[#F2FAF6] hover:shadow-md',
    danger: 'bg-danger text-white hover:bg-[#A80D1C] hover:shadow-lg hover:-translate-y-0.5 border border-transparent'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <IconLoader2 className="w-5 h-5 animate-spin mr-2" />
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </button>
  );
};
export default Button;
