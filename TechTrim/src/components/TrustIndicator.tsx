import React from 'react';
import { IconShieldCheck, IconLock, IconClock, IconMapPin } from '@tabler/icons-react';

interface TrustIndicatorProps {
  icon: 'verified' | 'secure' | 'fast' | 'nationwide';
  title: string;
  description: string;
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({ icon, title, description }) => {
  const getIcon = () => {
    switch (icon) {
      case 'verified':
        return <IconShieldCheck className="w-5 h-5" />;
      case 'secure':
        return <IconLock className="w-5 h-5" />;
      case 'fast':
        return <IconClock className="w-5 h-5" />;
      case 'nationwide':
        return <IconMapPin className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#F0F0F0] hover:border-primary hover:shadow-sm transition-all duration-200">
      <div className="flex-shrink-0 w-10 h-10 bg-[#E6F3EC] rounded-lg flex items-center justify-center text-primary">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="text-[14px] font-bold text-dark mb-0.5">{title}</h4>
        <p className="text-[12px] text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default TrustIndicator;
