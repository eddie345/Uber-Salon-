import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import {
  IconChevronRight,
  IconCalendar,
  IconCreditCard,
  IconBell,
  IconHelpCircle,
  IconFileText,
  IconLogout,
  IconBuildingStore
} from '@tabler/icons-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (item: string) => {
    if (item === 'Log Out') {
      handleLogout();
    } else if (item === 'My Bookings') {
      if (user.role === 'customer') {
        navigate('/bookings');
      } else {
        navigate('/dashboard');
      }
    } else if (item === 'Business Profile Settings') {
      navigate('/dashboard/profile-settings');
    } else {
      alert(`${item} is not available in the demo version.`);
    }
  };

  const customerMenu = [
    { label: 'My Bookings', icon: IconCalendar },
    { label: 'Payment Methods', icon: IconCreditCard },
    { label: 'Notifications', icon: IconBell },
    { label: 'Help & Support', icon: IconHelpCircle },
    { label: 'Terms & Conditions', icon: IconFileText },
    { label: 'Log Out', icon: IconLogout, danger: true }
  ];

  const artisanMenu = [
    { label: 'My Bookings (Dashboard)', icon: IconCalendar },
    { label: 'Business Profile Settings', icon: IconCreditCard },
    { label: 'Notifications', icon: IconBell },
    { label: 'Help & Support', icon: IconHelpCircle },
    { label: 'Terms & Conditions', icon: IconFileText },
    { label: 'Log Out', icon: IconLogout, danger: true }
  ];

  const menu = user.role === 'customer' ? customerMenu : artisanMenu;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 pt-6">
      <div className="max-width-container max-w-[600px]">
        {/* Profile Card */}
        <Card className="p-6 mb-6 text-center flex flex-col items-center">
          <Avatar name={user.name} size="xl" className="shadow-md mb-4" />
          <h2 className="text-[20px] font-heading font-extrabold text-dark leading-tight">
            {user.name}
          </h2>
          <p className="text-[14px] text-muted font-semibold mt-1">
            +233 {user.phone.substring(1)}
          </p>
          <span className="inline-block mt-3 text-[11px] font-bold text-primary bg-[#E6F3EC] px-3 py-1 rounded-full uppercase tracking-wider">
            {user.role} Account
          </span>
          {user.shopName && (
            <p className="text-[13px] font-bold text-dark mt-2.5 flex items-center gap-2">
              <IconBuildingStore className="w-4 h-4 text-primary" />
              {user.shopName}
            </p>
          )}
        </Card>

        {/* Menu list */}
        <div className="bg-white border border-[#F0F0F0] rounded-[14px] overflow-hidden divide-y divide-[#F5F5F5] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          {menu.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => handleMenuClick(item.label)}
                className="h-[56px] px-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition duration-150 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-1.5 rounded-lg ${item.danger ? 'text-danger bg-red-50' : 'text-primary bg-[#E6F3EC]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[15px] font-bold ${item.danger ? 'text-danger' : 'text-dark'}`}>
                    {item.label}
                  </span>
                </div>
                <IconChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-0.5 ${item.danger ? 'text-danger/70' : 'text-muted'}`} />
              </div>
            );
          })}
        </div>

        {/* Footer credits */}
        <p className="text-[12px] text-muted text-center mt-8 font-semibold">
          TrimConnect GH v1.0.0
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
