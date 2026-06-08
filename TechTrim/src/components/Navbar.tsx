import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Avatar from './Avatar';
import { IconScissors, IconLogout } from '@tabler/icons-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Routes where header should change to green on scroll
  const scrollRoutes = ['/home', '/about', '/search', '/bookings'];
  const shouldChangeOnScroll = scrollRoutes.includes(location.pathname);

  useEffect(() => {
    if (!shouldChangeOnScroll) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldChangeOnScroll]);

  if (!user) return null;

  return (
    <header className={`hidden lg:block sticky top-0 z-40 h-[72px] transition-colors duration-300 ${
      shouldChangeOnScroll && scrolled ? 'bg-[#006B3F] border-b border-[#006B3F]' : 'bg-white border-b border-[#F0F0F0]'
    }`}>
      <div className="max-width-container h-full flex items-center justify-between">
        {/* Logo */}
        <Link to={user.role === 'artisan' ? '/dashboard' : '/home'} className={`flex items-center gap-2 font-bold text-[20px] font-heading ${
          shouldChangeOnScroll && scrolled ? 'text-white' : 'text-primary'
        }`}>
          <div className={`p-1.5 rounded-lg flex items-center justify-center ${
            shouldChangeOnScroll && scrolled ? 'bg-white text-[#006B3F]' : 'bg-primary text-white'
          }`}>
            <IconScissors className="w-5 h-5" />
          </div>
          <span>TrimConnect<span className={`font-bold ${shouldChangeOnScroll && scrolled ? 'text-white' : 'text-accent'}`}>GH</span></span>
        </Link>

        {/* Center Links (Only for Customer) */}
        {user.role === 'customer' && (
          <nav className="flex items-center gap-8">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-[15px] font-semibold transition-colors duration-200 ${
                  shouldChangeOnScroll && scrolled
                    ? isActive
                      ? 'text-white border-b-2 border-white py-5'
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-primary border-b-2 border-primary py-5'
                      : 'text-muted hover:text-dark'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-[15px] font-semibold transition-colors duration-200 ${
                  shouldChangeOnScroll && scrolled
                    ? isActive
                      ? 'text-white border-b-2 border-white py-5'
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-primary border-b-2 border-primary py-5'
                      : 'text-muted hover:text-dark'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `text-[15px] font-semibold transition-colors duration-200 ${
                  shouldChangeOnScroll && scrolled
                    ? isActive
                      ? 'text-white border-b-2 border-white py-5'
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-primary border-b-2 border-primary py-5'
                      : 'text-muted hover:text-dark'
                }`
              }
            >
              Search
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `text-[15px] font-semibold transition-colors duration-200 ${
                  shouldChangeOnScroll && scrolled
                    ? isActive
                      ? 'text-white border-b-2 border-white py-5'
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-primary border-b-2 border-primary py-5'
                      : 'text-muted hover:text-dark'
                }`
              }
            >
              My Bookings
            </NavLink>
          </nav>
        )}

        {/* Artisan Top Navbar links (Dashboard, Schedule, Earnings) if they are outside dashboard */}
        {user.role === 'artisan' && (
          <nav className="flex items-center gap-8">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `text-[15px] font-semibold transition-colors duration-200 ${
                  shouldChangeOnScroll && scrolled
                    ? isActive
                      ? 'text-white border-b-2 border-white py-5'
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-primary border-b-2 border-primary py-5'
                      : 'text-muted hover:text-dark'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/schedule"
              className={({ isActive }) =>
                `text-[15px] font-semibold transition-colors duration-200 ${
                  shouldChangeOnScroll && scrolled
                    ? isActive
                      ? 'text-white border-b-2 border-white py-5'
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-primary border-b-2 border-primary py-5'
                      : 'text-muted hover:text-dark'
                }`
              }
            >
              Schedule
            </NavLink>
            <NavLink
              to="/dashboard/earnings"
              className={({ isActive }) =>
                `text-[15px] font-semibold transition-colors duration-200 ${
                  shouldChangeOnScroll && scrolled
                    ? isActive
                      ? 'text-white border-b-2 border-white py-5'
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-primary border-b-2 border-primary py-5'
                      : 'text-muted hover:text-dark'
                }`
              }
            >
              Earnings
            </NavLink>
          </nav>
        )}

        {/* User profile right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <p className={`text-[14px] font-bold leading-tight ${shouldChangeOnScroll && scrolled ? 'text-white' : 'text-dark'}`}>{user.name}</p>
              <p className={`text-[11px] font-semibold capitalize leading-none ${shouldChangeOnScroll && scrolled ? 'text-white/80' : 'text-muted'}`}>{user.role}</p>
            </div>
            {user.role === 'customer' ? (
              <Link to="/profile">
                <Avatar name={user.name} size="md" />
              </Link>
            ) : (
              <Avatar name={user.name} size="md" />
            )}
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className={`p-2 transition-colors duration-200 ${shouldChangeOnScroll && scrolled ? 'text-white/80 hover:text-white' : 'text-muted hover:text-danger'}`}
            title="Log Out"
          >
            <IconLogout className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
