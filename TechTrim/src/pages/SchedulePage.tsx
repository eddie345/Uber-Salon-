import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/useApp';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconChevronLeft, IconClock, IconCalendarCheck, IconCheck, IconBulb } from '@tabler/icons-react';

const ALL_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM"
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { artisanAvailability, saveAvailability } = useApp();
  const navigate = useNavigate();

  const [activeDay, setActiveDay] = useState<string>("Mon");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user || user.role !== 'artisan') return null;

  // Load slots for the selected day when activeDay changes
  useEffect(() => {
    const currentSlots = artisanAvailability[user.id]?.[activeDay] || [];
    setSelectedSlots(currentSlots);
    setSavedSuccess(false);
  }, [activeDay, artisanAvailability, user.id]);

  const handleToggleSlot = (slot: string) => {
    setSavedSuccess(false);
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = () => {
    saveAvailability(user.id, activeDay, selectedSlots);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
              Manage Schedule
            </h1>
            <p className="text-[14px] text-muted font-medium mt-1">
              Select a day and toggle slots to set your salon availability.
            </p>
          </div>
        </div>

        {/* Day Selector Row */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
          {DAYS.map((day) => {
            const isActive = activeDay === day;
            const slotsCount = artisanAvailability[user.id]?.[day]?.length || 0;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`h-[58px] w-[72px] rounded-xl flex flex-col items-center justify-center border-2 transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-dark border-[#E0E0E0] hover:border-muted'
                }`}
              >
                <span className="text-[13px] font-bold">{day}</span>
                <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-white/80' : 'text-muted'}`}>
                  {slotsCount} slots
                </span>
              </button>
            );
          })}
        </div>

        {/* Info card */}
        {savedSuccess && (
          <div className="bg-[#E6F3EC] border border-[#CDE5D8] text-primary p-4 rounded-xl flex items-center gap-2 mb-6 animate-fadeIn">
            <IconCheck className="w-5 h-5" />
            <span className="text-[14px] font-bold">Schedule for {activeDay} saved successfully!</span>
          </div>
        )}

        {/* Main Grid Card */}
        <Card className="p-6 border border-[#F0F0F0] mb-6">
          <div className="flex items-center justify-between mb-4 border-b border-[#F5F5F5] pb-3">
            <h3 className="text-[16px] font-bold text-dark flex items-center gap-2">
              <IconClock className="w-5 h-5 text-primary" />
              Hours for {activeDay}
            </h3>
            <button
              onClick={() => {
                if (selectedSlots.length === ALL_SLOTS.length) {
                  setSelectedSlots([]); // Clear all
                } else {
                  setSelectedSlots([...ALL_SLOTS]); // Select all
                }
              }}
              className="text-[13px] text-primary font-bold hover:underline"
            >
              {selectedSlots.length === ALL_SLOTS.length ? "Block All" : "Allow All"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3.5 mb-8">
            {ALL_SLOTS.map((slot) => {
              const isAvailable = selectedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  onClick={() => handleToggleSlot(slot)}
                  className={`h-[56px] rounded-[10px] text-[13px] font-bold transition flex items-center justify-center border-2 ${
                    isAvailable
                      ? 'bg-[#E6F3EC] text-primary border-primary hover:bg-[#d6ebd9]'
                      : 'bg-white text-muted border-[#EBEBEB] hover:border-muted hover:text-dark'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{slot}</span>
                    <span className={`text-[9px] font-bold uppercase mt-0.5 ${isAvailable ? 'text-primary' : 'text-muted'}`}>
                      {isAvailable ? 'Available' : 'Blocked'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
            className="flex items-center justify-center gap-2"
          >
            <IconCalendarCheck className="w-5 h-5" />
            <span>Save Availability</span>
          </Button>
        </Card>

        {/* Booking instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
          <IconBulb className="w-5 h-5 flex-shrink-0" />
          <div className="text-[13px] font-semibold leading-relaxed">
            <p className="font-bold text-blue-950 mb-0.5">Important schedule rules</p>
            Blocking a time slot prevents clients from scheduling appointments during that hour on the checkout page. Make sure you set your daily hours accurately to receive bookings.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
