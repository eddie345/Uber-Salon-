import React, { useState } from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  // Generate initials
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-10 h-10 text-[14px]',
    lg: 'w-14 h-14 text-[18px]',
    xl: 'w-24 h-24 text-[32px]'
  };

  // Get a consistent background color based on name string
  const getBgColor = (text: string) => {
    const colors = [
      'bg-[#006B3F] text-white',
      'bg-[#FCD116] text-dark',
      'bg-indigo-600 text-white',
      'bg-purple-600 text-white',
      'bg-blue-600 text-white',
      'bg-rose-600 text-white'
    ];
    let sum = 0;
    for (let i = 0; i < text.length; i++) {
      sum += text.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const initials = getInitials(name || 'User');
  const bgClass = getBgColor(name || 'User');

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold overflow-hidden select-none flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${bgClass}`}>
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
