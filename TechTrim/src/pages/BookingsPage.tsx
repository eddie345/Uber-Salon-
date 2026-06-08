import React, { useState } from 'react';
import { useApp } from '../context/useApp';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { IconCalendar, IconClock, IconStar } from '@tabler/icons-react';

export const BookingsPage: React.FC = () => {
  const { bookings, cancelBooking, artisans, addReview } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Divide bookings:
  // Upcoming = confirmed or pending
  // Past = completed or cancelled
  const upcomingBookings = bookings.filter((bk) => bk.status === 'confirmed' || bk.status === 'pending');
  const pastBookings = bookings.filter((bk) => bk.status === 'completed' || bk.status === 'cancelled');

  const activeBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCancelClick = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelBooking(bookingId);
    }
  };

  const handleOpenReviewModal = (booking: any) => {
    setSelectedBookingForReview(booking);
    setReviewStars(5);
    setReviewComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    
    addReview(
      selectedBookingForReview.artisanId,
      'Ama Koduah', // customer name
      reviewStars,
      reviewComment || 'Excellent service!'
    );

    // Update status to mark it has been reviewed if we want, or just hide/notify
    alert('Thank you! Your review for ' + selectedBookingForReview.artisanName + ' has been submitted.');
    setShowReviewModal(false);
  };

  // Find Artisan image
  const getArtisanPhoto = (artId: string) => {
    const art = artisans.find((a) => a.id === artId);
    return art ? art.photo : 'https://i.pravatar.cc/150?img=12';
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 pt-6">
      <div className="max-width-container max-w-[650px]">
        <h1 className="text-[24px] font-heading font-extrabold text-dark mb-5">
          My Bookings
        </h1>

        {/* Tab Toggle */}
        <div className="flex border border-[#E0E0E0] rounded-[12px] bg-white p-1 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 h-[44px] rounded-[9px] text-[14px] font-bold transition ${
              activeTab === 'upcoming' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 h-[44px] rounded-[9px] text-[14px] font-bold transition ${
              activeTab === 'past' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'
            }`}
          >
            Past Appointments
          </button>
        </div>

        {/* Booking Cards list */}
        {activeBookings.length > 0 ? (
          <div className="space-y-4">
            {activeBookings.map((bk) => (
              <Card key={bk.id} className="p-4 border border-[#F0F0F0] relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <img
                    src={getArtisanPhoto(bk.artisanId)}
                    alt={bk.artisanName}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-extrabold text-[16px] text-dark truncate">
                        {bk.artisanName}
                      </h3>
                      <Badge status={bk.status} />
                    </div>

                    <p className="text-[13.5px] font-bold text-primary">{bk.service}</p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-[12.5px] text-muted font-semibold">
                      <span className="flex items-center gap-1">
                        <IconCalendar className="w-4 h-4 text-primary" />
                        {bk.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconClock className="w-4 h-4 text-primary" />
                        {bk.timeSlot} ({bk.durationMins}m)
                      </span>
                    </div>

                    {/* Price and Action Footer */}
                    <div className="border-t border-[#F5F5F5] pt-3 mt-3 flex items-center justify-between">
                      <span className="text-[14px] font-bold text-dark">
                        Price: GHS {bk.priceGHS}
                      </span>

                      {activeTab === 'upcoming' && bk.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelClick(bk.id)}
                          className="text-[13px] text-[#CE1126] font-bold hover:underline transition"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {activeTab === 'past' && bk.status === 'completed' && (
                        <button
                          onClick={() => handleOpenReviewModal(bk)}
                          className="bg-primary text-white text-[12px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#005230] transition"
                        >
                          Rate & Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#F0F0F0] rounded-[14px] p-12 text-center text-muted">
            <div className="flex justify-center mb-3">
              <IconCalendar className="w-12 h-12 text-muted" />
            </div>
            <p className="text-[16px] font-bold text-dark">No bookings found</p>
            <p className="text-[13px] text-muted mt-1">
              You have no {activeTab} bookings scheduled.
            </p>
          </div>
        )}
      </div>

      {/* Review Modal Dialog */}
      {showReviewModal && selectedBookingForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-scaleUp">
            <form onSubmit={handleSubmitReview}>
              <h3 className="text-[18px] font-heading font-bold text-dark mb-1">
                Rate & Review
              </h3>
              <p className="text-[13px] text-muted font-medium mb-4">
                Share your experience with {selectedBookingForReview.artisanName}
              </p>

              {/* Stars selection */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewStars(star)}
                    className="p-1 text-[#FCD116] transition hover:scale-110"
                  >
                    <IconStar
                      className={`w-8 h-8 ${
                        star <= reviewStars ? 'fill-accent text-accent' : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Comment text */}
              <div className="flex flex-col mb-5">
                <label className="text-[13px] font-bold text-dark mb-1.5">Your Review Comments</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us what you liked (or disliked) about their service..."
                  className="w-full border-[1.5px] border-[#E0E0E0] rounded-[10px] p-3 text-[14px] focus:outline-none focus:border-primary font-sans resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 h-[52px] rounded-[10px] bg-gray-100 font-bold hover:bg-gray-200 transition text-[15px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[52px] rounded-[10px] bg-primary text-white font-bold hover:bg-[#005230] transition text-[15px]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
