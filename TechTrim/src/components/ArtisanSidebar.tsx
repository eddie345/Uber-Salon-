import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  IconLayoutDashboard,
  IconClock,
  IconCash,
  IconLogout,
  IconScissors
} from '@tabler/icons-react';

export const ArtisanSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'artisan') return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: IconLayoutDashboard, end: true },
    { label: 'Schedule', path: '/dashboard/schedule', icon: IconClock },
    { label: 'Earnings', path: '/dashboard/earnings', icon: IconCash },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[240px] bg-white border-r border-[#F0F0F0] h-screen sticky top-0 flex-shrink-0">
      {/* Brand logo */}
      <div className="h-[72px] border-b border-[#F0F0F0] flex items-center px-6 gap-2">
        <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
          <IconScissors className="w-5 h-5" />
        </div>
        <span className="text-[18px] font-bold text-primary font-heading">
          TrimConnect<span className="text-accent">GH</span>
        </span>
      </div>

      {/* Artisan info card */}
      <div className="p-5 border-b border-[#F0F0F0]">
        <p className="text-[15px] font-bold text-dark truncate">{user.name}</p>
        <p className="text-[12px] font-semibold text-muted truncate capitalize">{user.role}</p>
        {user.shopName && (
          <span className="inline-block mt-2 text-[11px] font-bold text-primary bg-[#E6F3EC] px-2 py-0.5 rounded">
            {user.shopName}
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 h-[48px] rounded-[10px] text-[14px] font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-dark hover:bg-[#F9FAFB]'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-[#F0F0F0]">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-3 w-full px-4 h-[48px] rounded-[10px] text-[14px] font-bold text-muted hover:text-danger hover:bg-red-50 transition-all duration-200"
        >
          <IconLogout className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default ArtisanSidebar;
