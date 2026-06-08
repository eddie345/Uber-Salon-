import React from 'react';
import { IconShield, IconLock, IconShieldCheck } from '@tabler/icons-react';

export const PhoneTrustIndicators: React.FC = () => {
  const indicators = [
    {
      icon: IconShieldCheck,
      text: 'Secure verification',
      color: 'text-green-600'
    },
    {
      icon: IconShield,
      text: 'No spam',
      color: 'text-primary'
    },
    {
      icon: IconLock,
      text: 'Your data is protected',
      color: 'text-primary'
    }
  ];

  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      {indicators.map((indicator, index) => (
        <div key={index} className="flex items-center gap-2">
          <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
          <span className="text-[12px] text-muted font-medium">{indicator.text}</span>
        </div>
      ))}
    </div>
  );
};

export default PhoneTrustIndicators;
