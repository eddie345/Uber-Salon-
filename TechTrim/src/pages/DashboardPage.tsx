import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/useApp';
import Card from '../components/Card';
import Badge from '../components/Badge';
import {
  IconCalendarEvent,
  IconCash,
  IconEye,
  IconStar,
  IconClock,
  IconAdjustmentsHorizontal,
  IconBuildingStore,
  IconScissors
} from '@tabler/icons-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { bookings, artisans } = useApp();
  const navigate = useNavigate();

  if (!user || user.role !== 'artisan') return null;

  // Find this artisan's profile to display real-time rating & details
  // Use 'art-1' as fallback if the artisan registered just now and doesn't match mock database
  const artisanProfile = artisans.find((art) => art.id === user.id) || artisans[0];

  // Filter bookings for this artisan only
  // Match either by user.id (like 'art-1') or shopName/name
  const artisanBookings = bookings.filter(
    (bk) => bk.artisanId === user.id || bk.artisanName === user.name
  );

  // Calculate Metrics
  const todayStr = '2026-06-06'; // Simulating today's date based on mock bookings
  const todaysBookingsCount = artisanBookings.filter(
    (bk) => bk.date === todayStr && bk.status !== 'cancelled'
  ).length;

  const totalEarnings = artisanBookings
    .filter((bk) => bk.status === 'confirmed' || bk.status === 'completed')
    .reduce((sum, bk) => sum + bk.priceGHS, 0);

  const profileViews = 384; // Mock static views metric
  const ratingVal = artisanProfile.rating;

  const upcomingBookings = artisanBookings.filter(
    (bk) => bk.status === 'confirmed' || bk.status === 'pending'
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen p-4 md:p-8 pb-20 lg:pb-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[24px] font-heading font-extrabold text-dark leading-tight">
              Dashboard
            </h1>
            <p className="text-[14px] text-muted font-medium mt-1">
              Welcome back, <span className="font-bold text-dark">{user.name}</span>. Here's your salon's status today.
            </p>
          </div>
          
          {/* Quick Stats Shop Pill */}
          {user.shopName && (
            <div className="self-start md:self-auto bg-white border border-[#E0E0E0] px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
              <IconBuildingStore className="w-5 h-5 text-primary" />
              <span className="text-[13px] font-bold text-dark">{user.shopName}</span>
            </div>
          )}
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Today's Bookings */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-muted">Today's Bookings</span>
              <div className="bg-[#E6F3EC] text-primary p-2 rounded-lg">
                <IconCalendarEvent className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-dark leading-none">
                {todaysBookingsCount}
              </p>
              <p className="text-[11px] font-semibold text-primary mt-1.5">Active sessions</p>
            </div>
          </Card>

          {/* This Week's Earnings */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-muted">Weekly Earnings</span>
              <div className="bg-[#E6F3EC] text-primary p-2 rounded-lg">
                <IconCash className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-dark leading-none">
                GHS {totalEarnings}
              </p>
              <p className="text-[11px] font-semibold text-primary mt-1.5">Total payout eligible</p>
            </div>
          </Card>

          {/* Profile Views */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-muted">Profile Views</span>
              <div className="bg-[#E6F3EC] text-primary p-2 rounded-lg">
                <IconEye className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-dark leading-none">
                {profileViews}
              </p>
              <p className="text-[11px] font-semibold text-primary mt-1.5">Up 12% this week</p>
            </div>
          </Card>

          {/* Rating */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-muted">Rating</span>
              <div className="bg-[#FFFBE6] text-[#C9A200] p-2 rounded-lg">
                <IconStar className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-dark leading-none">
                {ratingVal}
              </p>
              <p className="text-[11px] font-semibold text-muted mt-1.5">
                {artisanProfile.reviewCount} total reviews
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-[#F0F0F0] rounded-[14px] p-5 mb-8">
          <h3 className="text-[15px] font-bold text-dark mb-4">Quick Business Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/dashboard/schedule')}
              className="h-[52px] bg-primary text-white font-bold rounded-[10px] hover:bg-[#005230] transition flex items-center justify-center gap-2"
            >
              <IconClock className="w-5 h-5" />
              <span>Set Availability</span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/earnings')}
              className="h-[52px] bg-white border-[1.5px] border-primary text-primary font-bold rounded-[10px] hover:bg-[#F2FAF6] transition flex items-center justify-center gap-2"
            >
              <IconCash className="w-5 h-5" />
              <span>View Earnings</span>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="h-[52px] bg-gray-50 border border-[#E0E0E0] text-dark hover:bg-gray-100 font-bold rounded-[10px] transition flex items-center justify-center gap-2"
            >
              <IconAdjustmentsHorizontal className="w-5 h-5 text-muted" />
              <span>Edit Settings</span>
            </button>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-heading font-extrabold text-dark">
              Upcoming Bookings
            </h3>
            <span className="text-[13px] text-muted font-bold">
              {upcomingBookings.length} sessions scheduled
            </span>
          </div>

          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((bk) => (
                <Card key={bk.id} className="p-4 border border-[#F0F0F0]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#E6F3EC] text-primary font-heading font-extrabold flex items-center justify-center">
                        <IconScissors className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-[15px] text-dark">{bk.service}</p>
                          <Badge status={bk.status} />
                        </div>
                        <p className="text-[13px] text-muted font-semibold mt-1">
                          Client: <span className="font-bold text-dark">Ama Koduah</span>
                        </p>
                        
                        <div className="flex items-center gap-4 text-[12px] text-muted font-bold mt-2">
                          <span className="flex items-center gap-1">
                            <IconCalendarEvent className="w-4 h-4" /> {bk.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconClock className="w-4 h-4" /> {bk.timeSlot} ({bk.durationMins} min)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end border-t border-[#F5F5F5] sm:border-0 pt-3 sm:pt-0">
                      <div>
                        <span className="text-[11px] text-muted font-semibold block leading-none">Earnings</span>
                        <span className="text-[16px] font-extrabold text-primary mt-1 block">GHS {bk.priceGHS}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#F0F0F0] rounded-[14px] p-8 text-center text-muted">
              <p className="text-[14px] font-semibold text-muted">You have no upcoming bookings.</p>
              <button
                onClick={() => navigate('/dashboard/schedule')}
                className="mt-3 text-primary font-bold hover:underline"
              >
                Configure availability schedules
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
