import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  IconChevronRight,
  IconChevronLeft,
  IconCheck,
  IconCalendar,
  IconClock,
  IconCreditCard,
  IconStar,
  IconScissors,
  IconLock
} from '@tabler/icons-react';

export const BookingPage: React.FC = () => {
  const { artisanId } = useParams<{ artisanId: string }>();
  const navigate = useNavigate();
  const { artisans, bookingDraft, updateBookingDraft, clearBookingDraft, addBooking } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [success, setSuccess] = useState(false);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<any>(null);

  // Calendar state
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (bookingDraft.date) {
      return new Date(bookingDraft.date);
    }
    // Default to tomorrow to avoid booking past/same-day times
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  });
  const [dateOffset, setDateOffset] = useState(0);

  // Find Artisan (from URL if provided, otherwise from draft)
  const artisan = artisanId ? artisans.find((art) => art.id === artisanId) : bookingDraft.artisan;

  // Generate list of days for current/next 14 days (simplified booking calendar)
  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i <= 13; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Get visible 7-day chunk based on offset
  const visibleDates = useMemo(() => {
    const startIdx = dateOffset * 7;
    return availableDates.slice(startIdx, startIdx + 7);
  }, [availableDates, dateOffset]);

  // Time slots with some marked as unavailable
  const allTimeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  const unavailableSlots = ['11:00 AM', '3:00 PM']; // Randomly marked as unavailable

  if (!artisan && step > 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA]">
        <h2 className="text-[20px] font-heading font-bold text-dark mb-2">Artisan Not Found</h2>
        <button
          onClick={() => navigate('/home')}
          className="bg-primary text-white text-[15px] font-bold h-12 px-6 rounded-xl hover:bg-[#005230] transition"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // Get active day representation ('Mon', 'Tue', etc.)
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][selectedDate.getDay()];

  const handleSelectService = (service: any) => {
    updateBookingDraft({ service });
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    updateBookingDraft({ date: dateStr, timeSlot: null });
  };

  const handleSelectTime = (slot: string) => {
    updateBookingDraft({ timeSlot: slot });
  };

  const handleSelectPayment = (paymentMethod: string) => {
    updateBookingDraft({ paymentMethod });
  };

  const handleNextStep = () => {
    if (step === 1 && bookingDraft.artisan) {
      setStep(2);
    } else if (step === 2 && bookingDraft.service) {
      // If date is not selected in draft yet, update with selectedDate
      if (!bookingDraft.date) {
        updateBookingDraft({ date: selectedDate.toISOString().split('T')[0] });
      }
      setStep(3);
    } else if (step === 3 && bookingDraft.date && bookingDraft.timeSlot) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
    if (step === 4) setStep(3);
  };

  const handleSelectBarber = (selectedArtisan: any) => {
    updateBookingDraft({ artisan: selectedArtisan });
  };

  const handleConfirmBooking = () => {
    if (!bookingDraft.artisan || !bookingDraft.service || !bookingDraft.date || !bookingDraft.timeSlot || !bookingDraft.paymentMethod) {
      alert('Please fill out all booking details and payment method.');
      return;
    }

    const newBooking = addBooking(
      bookingDraft.artisan.id,
      bookingDraft.artisan.name,
      bookingDraft.service.name,
      bookingDraft.date,
      bookingDraft.timeSlot,
      bookingDraft.service.durationMins,
      bookingDraft.service.priceGHS
    );

    setConfirmedBookingDetails(newBooking);
    clearBookingDraft();
    setSuccess(true);
  };

  // Payment Options Config
  const paymentMethods = [
    { id: 'MTN MoMo', label: 'MTN Mobile Money', color: 'bg-[#FCD116] border-[#E5BD00] text-dark' },
    { id: 'Vodafone Cash', label: 'Vodafone Cash', color: 'bg-[#CE1126] border-[#B20E20] text-white' },
    { id: 'AirtelTigo', label: 'AirtelTigo Money', color: 'bg-blue-600 border-blue-700 text-white' },
    { id: 'Card', label: 'Credit / Debit Card', color: 'bg-gray-800 border-gray-900 text-white' }
  ];

  if (success && confirmedBookingDetails) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[450px] text-center">
          <div className="w-20 h-20 rounded-full bg-[#E6F3EC] text-primary flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#CDE5D8]">
            <IconCheck className="w-10 h-10 stroke-[3]" />
          </div>
          
          <h1 className="text-[26px] font-heading font-extrabold text-dark mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-[14px] text-muted mb-8 leading-relaxed">
            Your appointment has been successfully scheduled with {artisan.name}. An SMS confirmation has been sent to your phone.
          </p>

          <Card className="p-5 text-left mb-8 space-y-4">
            <h3 className="text-[16px] font-bold text-dark border-b border-[#F0F0F0] pb-2">
              Appointment Summary
            </h3>
            
            <div className="flex justify-between items-start">
              <span className="text-[13px] text-muted font-semibold">Artisan</span>
              <div className="text-right">
                <p className="text-[14px] font-bold text-dark">{artisan.name}</p>
                <p className="text-[12px] text-muted capitalize">{artisan.specialty}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-[13px] text-muted font-semibold">Service</span>
              <span className="text-[14px] font-bold text-dark">{confirmedBookingDetails.service}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[13px] text-muted font-semibold">Date & Time</span>
              <div className="text-right">
                <p className="text-[14px] font-bold text-dark">{confirmedBookingDetails.date}</p>
                <p className="text-[12px] text-muted font-semibold">{confirmedBookingDetails.timeSlot}</p>
              </div>
            </div>

            <div className="flex justify-between border-t border-[#F0F0F0] pt-3">
              <span className="text-[14px] text-muted font-bold">Total Paid</span>
              <span className="text-[16px] font-extrabold text-primary">GHS {confirmedBookingDetails.priceGHS}</span>
            </div>
          </Card>

          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              navigate('/home');
            }}
          >
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20 pt-6">
      <div className="max-width-container max-w-[650px]">
        {/* Progress Bar Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (step > 1) handlePrevStep();
                else navigate(-1);
              }}
              className="text-muted hover:text-dark flex items-center gap-1 text-[13px] font-bold"
            >
              <IconChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-[18px] font-heading font-extrabold text-dark">
              {step === 1 ? 'Choose Your Barber' : `Book ${artisan?.name || 'a Barber'}`}
            </h1>
            <div className="w-12"></div> {/* Spacer */}
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gray-200 -translate-y-1/2 z-0"></div>
            <div
              className="absolute left-0 top-1/2 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            {/* Step 1 Pill */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] transition ${
                  step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-muted'
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-bold mt-1.5 text-dark">Service</span>
            </div>

            {/* Step 2 Pill */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] transition ${
                  step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-muted'
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-bold mt-1.5 text-dark">Date & Time</span>
            </div>

            {/* Step 3 Pill */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] transition ${
                  step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-muted'
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold mt-1.5 text-dark">Payment</span>
            </div>
          </div>
        </div>

        {/* STEP 1: BARBER SELECTOR */}
        {step === 1 && (
          <div>
            <h2 className="text-[20px] font-heading font-bold text-dark mb-4">
              Choose Your Barber
            </h2>
            <div className="space-y-3.5 mb-6">
              {artisans.map((art) => {
                const isSelected = bookingDraft.artisan?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => handleSelectBarber(art)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition flex items-center justify-between gap-4 bg-white ${
                      isSelected
                        ? 'border-primary bg-[#E6F3EC] shadow-sm'
                        : 'border-[#EBEBEB] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={art.photo}
                        alt={art.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-[15px] text-dark">{art.name}</p>
                        <p className="text-[12.5px] text-muted font-medium mt-0.5 leading-relaxed capitalize">{art.specialty}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center text-[12px] text-muted font-semibold">
                            <IconStar className="w-3.5 h-3.5 text-accent fill-accent mr-1" />
                            {art.rating}
                          </span>
                          <span className="text-[12px] text-muted">•</span>
                          <span className="text-[12px] text-muted font-semibold">{art.yearsActive} yrs exp</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[14px] text-dark">From GHS {art.priceFrom}</p>
                      {isSelected && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold mt-2">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              variant="primary"
              fullWidth
              disabled={!bookingDraft.artisan}
              onClick={handleNextStep}
            >
              <span>Choose Service</span>
              <IconChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 2: SERVICE SELECTOR */}
        {step === 2 && (
          <div>
            <h2 className="text-[20px] font-heading font-bold text-dark mb-4">
              Choose Your Service
            </h2>
            <div className="space-y-3.5 mb-6">
              {artisan?.services.map((service) => {
                const isSelected = bookingDraft.service?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition flex items-center justify-between gap-4 bg-white ${
                      isSelected
                        ? 'border-primary bg-[#E6F3EC] shadow-sm'
                        : 'border-[#EBEBEB] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-bold text-[15px] text-dark">{service.name}</p>
                      <p className="text-[12.5px] text-muted font-medium mt-0.5 leading-relaxed">{service.description}</p>
                      <span className="inline-block mt-2 text-[12px] text-muted font-semibold bg-gray-50 px-2 py-0.5 rounded">
                        ⌛ {service.durationMins} mins
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[16px] text-dark">GHS {service.priceGHS}</p>
                      {isSelected && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold mt-2">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              variant="primary"
              fullWidth
              disabled={!bookingDraft.service}
              onClick={handleNextStep}
            >
              <span>Choose Date & Time</span>
              <IconChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 3: DATE & TIME SELECTOR */}
        {step === 3 && (
          <div className="bg-white rounded-[16px] border border-[#F0F0F0] p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Date & Time Picker */}
              <div className="flex-1">
                {/* Date Picker Section */}
                <div className="mb-7">
                  <label className="text-[13px] font-bold uppercase tracking-wide text-[#006B3F] mb-2 block">
                    SELECT DATE
                  </label>
                  <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-4">
                    When would you like to come in?
                  </h2>

                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex gap-2 overflow-hidden">
                      {visibleDates.map((date) => {
                        const isSelected = selectedDate.toDateString() === date.toDateString();
                        const isToday = date.toDateString() === today.toDateString();
                        const dName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
                        const dNum = date.getDate();
                        const mName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];

                        return (
                          <button
                            key={date.toDateString()}
                            onClick={() => handleSelectDate(date)}
                            className={`w-[64px] h-[72px] rounded-[12px] border-[1.5px] flex flex-col items-center justify-center transition-all flex-shrink-0 ${
                              isSelected
                                ? 'bg-[#006B3F] border-[#006B3F] text-white'
                                : 'bg-white border-[#E0E0E0] hover:border-[#006B3F] hover:scale-[1.02]'
                            }`}
                          >
                            <span className={`text-[11px] font-bold uppercase ${isSelected ? 'text-white' : 'text-[#6B7280]'}`}>
                              {dName}
                            </span>
                            <span className={`text-[22px] font-bold leading-none my-0.5 ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                              {dNum}
                            </span>
                            <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white' : 'text-[#6B7280]'}`}>
                              {mName}
                            </span>
                            {isToday && !isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#FCD116] mt-1"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {dateOffset * 7 + 7 < availableDates.length && (
                      <button
                        onClick={() => setDateOffset(dateOffset + 1)}
                        className="w-[40px] h-[72px] rounded-[12px] border-[1.5px] border-[#E0E0E0] bg-white flex items-center justify-center hover:border-[#006B3F] transition flex-shrink-0"
                      >
                        <IconChevronRight className="w-5 h-5 text-[#1A1A1A]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Time Slot Picker Section */}
                <div className="mt-7">
                  <label className="text-[13px] font-bold uppercase tracking-wide text-[#006B3F] mb-2 block">
                    SELECT TIME
                  </label>
                  <p className="text-[13px] text-gray-500 mb-3">
                    Available slots for {dayName}
                  </p>

                  <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-[10px]">
                    {allTimeSlots.map((slot) => {
                      const isSelected = bookingDraft.timeSlot === slot;
                      const isUnavailable = unavailableSlots.includes(slot);

                      return (
                        <button
                          key={slot}
                          onClick={() => !isUnavailable && handleSelectTime(slot)}
                          disabled={isUnavailable}
                          className={`h-[44px] rounded-[10px] border-[1.5px] text-[14px] font-semibold transition flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#006B3F] text-white border-[#006B3F]'
                              : isUnavailable
                              ? 'bg-[#F5F5F5] text-[#BDBDBD] border-[#E0E0E0] cursor-not-allowed'
                              : 'bg-white text-[#1A1A1A] border-[#E0E0E0] hover:border-[#006B3F] hover:bg-[#E8F5EF]'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Booking Summary Card (Sticky) */}
              <div className="w-full lg:w-[340px] lg:sticky lg:top-6">
                <div className="bg-white rounded-[14px] border border-[#F0F0F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
                  <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-4">
                    Booking Summary
                  </h3>
                  <div className="border-b border-[#F0F0F0] mb-4"></div>

                  {/* Artisan Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={artisan?.photo}
                      alt={artisan?.name}
                      className="w-[44px] h-[44px] rounded-full object-cover object-center-top border-2 border-[#006B3F]"
                    />
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#1A1A1A]">{artisan?.name}</p>
                      <span className="text-[11px] font-bold text-[#006B3F] bg-[#E8F5EF] px-2 py-0.5 rounded-md uppercase">
                        {artisan?.specialty}
                      </span>
                    </div>
                  </div>

                  {/* Service Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <IconScissors className="w-4 h-4 text-[#006B3F]" />
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#1A1A1A]">{bookingDraft.service?.name}</p>
                      <p className="text-[13px] text-gray-500">{bookingDraft.service?.durationMins} mins</p>
                    </div>
                  </div>

                  {/* Date Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <IconCalendar className="w-4 h-4 text-[#006B3F]" />
                    <div className="flex-1">
                      <p className={`text-[14px] ${bookingDraft.date ? 'font-bold text-[#1A1A1A]' : 'italic text-gray-500'}`}>
                        {bookingDraft.date ? bookingDraft.date : 'Not selected yet'}
                      </p>
                    </div>
                  </div>

                  {/* Time Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <IconClock className="w-4 h-4 text-[#006B3F]" />
                    <div className="flex-1">
                      <p className={`text-[14px] ${bookingDraft.timeSlot ? 'font-bold text-[#1A1A1A]' : 'italic text-gray-500'}`}>
                        {bookingDraft.timeSlot ? bookingDraft.timeSlot : 'Not selected yet'}
                      </p>
                    </div>
                  </div>

                  <div className="border-b border-[#F0F0F0] mb-4"></div>

                  {/* Price Row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] text-gray-500 font-semibold">Total</span>
                    <span className="text-[20px] font-extrabold text-[#006B3F]">
                      GHS {bookingDraft.service?.priceGHS}
                    </span>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleNextStep}
                    disabled={!bookingDraft.date || !bookingDraft.timeSlot}
                    className={`w-full h-[52px] rounded-[10px] text-[15px] font-bold flex items-center justify-center gap-2 transition ${
                      bookingDraft.date && bookingDraft.timeSlot
                        ? 'bg-[#006B3F] text-white hover:bg-[#005230]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Continue to Payment</span>
                    <IconChevronRight className="w-5 h-5" />
                  </button>

                  {/* Cancellation Note */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <IconLock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[12px] text-gray-500">
                      Free cancellation up to 2 hours before
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & PAYMENT SELECTOR */}
        {step === 4 && (
          <div>
            <h2 className="text-[20px] font-heading font-bold text-dark mb-4">
              Confirm & Pay
            </h2>

            {/* Order Details Card */}
            <Card className="p-5 mb-6 border border-[#F0F0F0]">
              <h3 className="text-[15px] font-bold text-dark border-b border-[#F0F0F0] pb-2.5 mb-3.5">
                Booking Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] text-muted font-semibold">Artisan</span>
                  <span className="text-[14px] font-bold text-dark text-right">{artisan.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[13px] text-muted font-semibold">Service</span>
                  <span className="text-[14px] font-bold text-dark text-right">{bookingDraft.service?.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[13px] text-muted font-semibold">Duration</span>
                  <span className="text-[14px] font-bold text-dark text-right">{bookingDraft.service?.durationMins} minutes</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[13px] text-muted font-semibold">Date</span>
                  <span className="text-[14px] font-bold text-dark text-right">{bookingDraft.date}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[13px] text-muted font-semibold">Time Slot</span>
                  <span className="text-[14px] font-bold text-dark text-right">{bookingDraft.timeSlot}</span>
                </div>
                <div className="flex justify-between items-start border-t border-[#F0F0F0] pt-3.5 mt-2">
                  <span className="text-[14px] font-bold text-dark">Amount Due</span>
                  <span className="text-[18px] font-extrabold text-primary">GHS {bookingDraft.service?.priceGHS}</span>
                </div>
              </div>
            </Card>

            {/* Payment Method Picker */}
            <div className="mb-6">
              <label className="text-[14px] font-bold text-dark mb-3 block flex items-center gap-1.5">
                <IconCreditCard className="w-4.5 h-4.5 text-primary" />
                Select Payment Method
              </label>
              
              <div className="grid grid-cols-2 gap-3.5">
                {paymentMethods.map((pm) => {
                  const isSelected = bookingDraft.paymentMethod === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => handleSelectPayment(pm.id)}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between h-[100px] ${
                        isSelected
                          ? 'border-primary bg-[#E6F3EC] shadow-sm'
                          : 'border-[#E0E0E0] bg-white hover:border-muted'
                      }`}
                    >
                      <span className="text-[14px] font-bold text-dark block leading-snug">
                        {pm.id}
                      </span>
                      <span className="text-[11px] font-semibold text-muted">
                        {pm.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              disabled={!bookingDraft.paymentMethod}
              onClick={handleConfirmBooking}
            >
              Confirm Booking (GHS {bookingDraft.service?.priceGHS})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
