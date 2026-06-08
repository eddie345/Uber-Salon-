import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/useApp';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconChevronLeft, IconWallet, IconCheck, IconReceipt } from '@tabler/icons-react';

export const EarningsPage: React.FC = () => {
  const { user } = useAuth();
  const { bookings } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('week');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  if (!user || user.role !== 'artisan') return null;

  // Filter bookings for this artisan that are completed or confirmed (paid)
  const artisanBookings = bookings.filter(
    (bk) => (bk.artisanId === user.id || bk.artisanName === user.name) &&
            (bk.status === 'confirmed' || bk.status === 'completed')
  );

  // Filter based on selected time period
  const todayStr = '2026-06-06'; // Simulated today
  
  const filteredBookings = artisanBookings.filter((bk) => {
    if (activeTab === 'today') {
      return bk.date === todayStr;
    }
    if (activeTab === 'week') {
      // Simulating bookings between 2026-06-01 and 2026-06-07
      return bk.date >= '2026-06-01' && bk.date <= '2026-06-07';
    }
    // month
    return bk.date >= '2026-05-01' && bk.date <= '2026-06-30';
  });

  // Calculate sum of earnings
  const earningsSum = filteredBookings.reduce((sum, bk) => sum + bk.priceGHS, 0);

  const handleRequestPayout = () => {
    if (earningsSum <= 0) {
      alert('You do not have any earnings to request a payout.');
      return;
    }
    setShowPayoutModal(true);
  };

  const handleConfirmPayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => {
      setShowPayoutModal(false);
      setPayoutSuccess(false);
      alert(`Payout of GHS ${earningsSum} successfully requested to your mobile money account.`);
    }, 1500);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen p-4 md:p-8 pb-20 lg:pb-8">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="lg:hidden text-muted hover:text-dark p-1"
          >
            <IconChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-[24px] font-heading font-extrabold text-dark leading-tight">
              Earnings
            </h1>
            <p className="text-[14px] text-muted font-medium mt-1">
              Track your daily, weekly, and monthly salon payouts.
            </p>
          </div>
        </div>

        {/* Toggle Range */}
        <div className="flex border border-[#E0E0E0] rounded-[12px] bg-white p-1 mb-6">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 h-[44px] rounded-[9px] text-[13.5px] font-bold transition ${
              activeTab === 'today' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`flex-1 h-[44px] rounded-[9px] text-[13.5px] font-bold transition ${
              activeTab === 'week' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`flex-1 h-[44px] rounded-[9px] text-[13.5px] font-bold transition ${
              activeTab === 'month' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'
            }`}
          >
            This Month
          </button>
        </div>

        {/* Large bold total figure */}
        <Card className="p-6 text-center border border-[#F0F0F0] mb-6 flex flex-col items-center">
          <div className="bg-[#E6F3EC] text-primary p-3.5 rounded-full mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-[#CDE5D8]">
            <IconWallet className="w-8 h-8" />
          </div>
          <span className="text-[13px] font-bold text-muted uppercase tracking-wider block">
            Total {activeTab === 'today' ? 'Today' : activeTab === 'week' ? 'Weekly' : 'Monthly'} Earnings
          </span>
          <h2 className="text-[36px] font-heading font-extrabold text-dark mt-2 mb-5">
            GHS {earningsSum}.00
          </h2>

          <Button
            variant="primary"
            fullWidth
            onClick={handleRequestPayout}
            disabled={earningsSum <= 0}
          >
            Request Payout
          </Button>
        </Card>

        {/* Transaction list */}
        <section>
          <h3 className="text-[17px] font-heading font-extrabold text-dark mb-4 flex items-center gap-2">
            <IconReceipt className="w-5 h-5 text-primary" />
            Transaction History
          </h3>

          {filteredBookings.length > 0 ? (
            <div className="bg-white border border-[#F0F0F0] rounded-[14px] overflow-hidden divide-y divide-[#F5F5F5]">
              {filteredBookings.map((bk) => (
                <div key={bk.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-[14.5px] text-dark leading-snug">
                      Ama Koduah
                    </p>
                    <p className="text-[12.5px] text-primary font-bold mt-0.5">
                      {bk.service}
                    </p>
                    <p className="text-[11.5px] text-muted font-semibold mt-1">
                      Date: {bk.date} • Time: {bk.timeSlot}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[15.5px] font-extrabold text-primary">
                      + GHS {bk.priceGHS}.00
                    </span>
                    <span className="block text-[10px] text-primary font-bold mt-1 uppercase tracking-wider bg-[#E6F3EC] px-2 py-0.5 rounded">
                      Paid
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#F0F0F0] rounded-[14px] p-8 text-center text-muted">
              <p className="text-[14px] font-semibold text-muted">
                No transactions recorded for this period.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-scaleUp text-center">
            {payoutSuccess ? (
              <div className="py-6">
                <div className="w-16 h-16 rounded-full bg-[#E6F3EC] text-primary flex items-center justify-center mx-auto mb-4 border border-[#CDE5D8]">
                  <IconCheck className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-[18px] font-heading font-bold text-dark mb-1">
                  Payout Requested!
                </h3>
                <p className="text-[13px] text-muted font-medium">
                  Transferring GHS {earningsSum}.00 to mobile wallet...
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-[18px] font-heading font-bold text-dark mb-1">
                  Confirm Payout Request
                </h3>
                <p className="text-[13px] text-muted font-semibold mb-6">
                  Would you like to withdraw GHS {earningsSum}.00 to your registered Mobile Money wallet (+233 {user.phone.substring(1)})?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 h-[52px] rounded-[10px] bg-gray-100 font-bold hover:bg-gray-200 transition text-[15px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPayout}
                    className="flex-1 h-[52px] rounded-[10px] bg-primary text-white font-bold hover:bg-[#005230] transition text-[15px]"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsPage;
