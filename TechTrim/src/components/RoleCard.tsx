import React from 'react';
import { IconUser, IconScissors, IconCheck } from '@tabler/icons-react';

interface RoleCardProps {
  role: 'customer' | 'artisan';
  selected: boolean;
  onClick: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, selected, onClick }) => {
  const isCustomer = role === 'customer';
  
  return (
    <div
      onClick={onClick}
      className={`
        relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300
        flex flex-col items-center justify-center min-h-[180px]
        ${selected 
          ? 'border-primary bg-gradient-to-br from-[#E6F3EC] to-[#F0FAF4] shadow-lg scale-[1.02]' 
          : 'border-[#EBEBEB] bg-white hover:border-primary hover:shadow-md hover:-translate-y-1'
        }
      `}
    >
      {/* Icon Container */}
      <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
        ${selected 
          ? 'bg-primary text-white shadow-lg' 
          : 'bg-gray-50 text-primary hover:bg-[#E6F3EC]'
        }
      `}>
        {isCustomer ? (
          <IconUser className="w-8 h-8" />
        ) : (
          <IconScissors className="w-8 h-8" />
        )}
      </div>

      {/* Role Title */}
      <h3 className="text-[18px] font-bold text-dark mb-1">
        {isCustomer ? 'Customer' : 'Artisan'}
      </h3>

      {/* Role Description */}
      <p className="text-[13px] text-muted text-center leading-relaxed">
        {isCustomer 
          ? 'Find and book trusted barbers & salons near you' 
          : 'Grow your business and connect with more clients'
        }
      </p>

      {/* Selected Checkmark */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md animate-scaleIn">
          <IconCheck className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default RoleCard;
