import React from 'react';

export type BadgeStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

interface BadgeProps {
  status: BadgeStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    confirmed: {
      bg: 'bg-[#E6F3EC]',
      text: 'text-[#006B3F]',
      label: 'Confirmed'
    },
    pending: {
      bg: 'bg-[#FFFBE6]',
      text: 'text-[#C9A200]', // Readable gold
      label: 'Pending'
    },
    cancelled: {
      bg: 'bg-[#FDF2F2]',
      text: 'text-[#CE1126]',
      label: 'Cancelled'
    },
    completed: {
      bg: 'bg-[#F3F4F6]',
      text: 'text-[#6B7280]',
      label: 'Completed'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-wide ${config.bg} ${config.text} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
      {config.label}
    </span>
  );
};

export default Badge;
