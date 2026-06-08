import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-[14px] border border-[#F0F0F0] shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-5 transition duration-200 ${
        hoverable ? 'hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
