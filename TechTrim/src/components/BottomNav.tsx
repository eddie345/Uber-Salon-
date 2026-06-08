import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  IconHome,
  IconSearch,
  IconCalendar,
  IconUser,
  IconLayoutDashboard,
  IconClock,
  IconCash
} from '@tabler/icons-react';

export const BottomNav: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const isCustomer = user.role === 'customer';

  interface TabConfig {
    label: string;
    path: string;
    icon: React.ComponentType<any>;
    end?: boolean;
  }

  const customerTabs: TabConfig[] = [
    { label: 'Home', path: '/home', icon: IconHome },
    { label: 'Search', path: '/search', icon: IconSearch },
    { label: 'Bookings', path: '/bookings', icon: IconCalendar },
    { label: 'Profile', path: '/profile', icon: IconUser }
  ];

  const artisanTabs: TabConfig[] = [
    { label: 'Dashboard', path: '/dashboard', icon: IconLayoutDashboard, end: true },
    { label: 'Schedule', path: '/dashboard/schedule', icon: IconClock },
    { label: 'Earnings', path: '/dashboard/earnings', icon: IconCash },
    { label: 'Profile', path: '/profile', icon: IconUser }
  ];

  const tabs: TabConfig[] = isCustomer ? customerTabs : artisanTabs;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F0] h-[64px] z-40 pb-safe">
      <nav className="h-full flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-full transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted'
                }`
              }
            >
              <Icon className="w-6 h-6 mb-0.5" />
              <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
