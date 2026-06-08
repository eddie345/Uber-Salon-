import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import {
  IconStar,
  IconMapPin,
  IconBriefcase,
  IconClock,
  IconCalendarEvent,
  IconChevronLeft,
  IconMessage2
} from '@tabler/icons-react';

export const ArtisanProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artisans, updateBookingDraft } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'reviews'>('services');

  // Find the artisan by ID
  const artisan = artisans.find((art) => art.id === id);

  if (!artisan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA]">
        <h2 className="text-[20px] font-heading font-bold text-dark mb-2">Artisan Not Found</h2>
        <p className="text-muted text-[14px] mb-6 text-center max-w-sm">
          The artisan profile you are looking for might have been deleted or the link is incorrect.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="bg-primary text-white text-[15px] font-bold h-12 px-6 rounded-xl hover:bg-[#005230] transition flex items-center justify-center"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const handleBookService = (service: any) => {
    updateBookingDraft({
      service,
      date: null,
      timeSlot: null,
      paymentMethod: null
    });
    navigate(`/book/${artisan.id}`);
  };

  const handleGeneralBooking = () => {
    // Navigate with no service pre-selected, let them select in Step 1
    updateBookingDraft({
      service: null,
      date: null,
      timeSlot: null,
      paymentMethod: null
    });
    navigate(`/book/${artisan.id}`);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 lg:pb-12 pt-0">
      {/* Top Banner Cover Photo */}
      <div className="relative h-[200px] md:h-[260px] w-full bg-primary overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=400&fit=crop"
          alt="Barbershop cover"
          className="w-full h-full object-cover opacity-80"
        />
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-md text-dark hover:bg-white transition"
        >
          <IconChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-width-container px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column (Left 2 columns on desktop) */}
          <div className="lg:col-span-2">
            {/* Header Card */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
                <Avatar
                  name={artisan.name}
                  src={artisan.photo}
                  size="xl"
                  className="border-4 border-white shadow-md"
                />
                
                <div className="flex-1 mt-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h1 className="text-[24px] font-heading font-extrabold text-dark leading-snug">
                      {artisan.name}
                    </h1>
                    <span className="inline-block bg-[#E6F3EC] text-primary font-bold text-[13px] px-3 py-1 rounded-full uppercase tracking-wider md:self-start">
                      {artisan.specialty}
                    </span>
                  </div>

                  <p className="flex items-center justify-center md:justify-start gap-1 text-[14px] text-muted font-semibold mt-1">
                    <IconMapPin className="w-4 h-4 text-primary" />
                    <span>{artisan.city}, Ghana</span>
                  </p>

                  {/* 3 Stat Pills */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mt-5">
                    <div className="bg-gray-50 border border-gray-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
                      <IconStar className="w-4.5 h-4.5 text-accent fill-accent" />
                      <span className="text-[14px] font-extrabold text-dark">{artisan.rating}</span>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
                      <IconMessage2 className="w-4.5 h-4.5 text-primary" />
                      <span className="text-[14px] font-bold text-dark">{artisan.reviewCount} Reviews</span>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
                      <IconBriefcase className="w-4.5 h-4.5 text-primary" />
                      <span className="text-[14px] font-bold text-dark">{artisan.yearsActive} Years Active</span>
                    </div>
                  </div>

                  {/* Skills Tags - Upwork style */}
                  <div className="mt-5">
                    <h4 className="text-[13px] font-bold text-dark mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {artisan.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[12px] font-semibold text-primary bg-[#E6F3EC] px-3 py-1.5 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs Selector */}
            <div className="flex border-b border-[#EBEBEB] bg-white rounded-t-xl px-4">
              {(['services', 'portfolio', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-[15px] font-bold capitalize transition-colors relative ${
                    activeTab === tab ? 'text-primary' : 'text-muted hover:text-dark'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="bg-white border border-t-0 border-[#F0F0F0] rounded-b-xl p-6 mb-6 min-h-[300px]">
              {/* SERVICES TAB */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <h3 className="text-[18px] font-bold text-dark mb-4">Available Services</h3>
                  {artisan.services.map((service) => (
                    <div
                      key={service.id}
                      className="border border-[#F0F0F0] hover:border-gray-300 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-[16px] text-dark leading-snug">{service.name}</p>
                        <p className="text-[13px] text-muted font-medium mt-1 leading-relaxed">{service.description}</p>
                        <div className="flex items-center gap-1 text-[13px] text-muted font-semibold mt-2.5">
                          <IconClock className="w-4 h-4 text-primary" />
                          <span>{service.durationMins} minutes</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:flex-col md:items-end gap-3 flex-shrink-0">
                        <span className="text-[18px] font-extrabold text-dark">
                          GHS {service.priceGHS}
                        </span>
                        <button
                          onClick={() => handleBookService(service)}
                          className="bg-primary text-white text-[13px] font-bold h-[38px] px-4 rounded-lg hover:bg-[#005230] transition flex items-center justify-center"
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PORTFOLIO TAB */}
              {activeTab === 'portfolio' && (
                <div>
                  <h3 className="text-[18px] font-bold text-dark mb-4">Artisan's Portfolio</h3>
                  {artisan.portfolio && artisan.portfolio.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {artisan.portfolio.map((imgUrl, index) => (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden border border-[#F0F0F0] group cursor-pointer relative">
                          <img
                            src={imgUrl}
                            alt={`Portfolio work ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-[14px] text-center py-12">No portfolio pictures added yet.</p>
                  )}
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h3 className="text-[18px] font-bold text-dark mb-2">Customer Reviews</h3>
                  {artisan.reviews && artisan.reviews.length > 0 ? (
                    artisan.reviews.map((rev) => (
                      <div key={rev.id} className="border-b border-[#F5F5F5] pb-5 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-3.5">
                          <Avatar
                            name={rev.reviewerName}
                            src={`https://i.pravatar.cc/150?img=${rev.id.includes('new') ? 12 : parseInt(rev.id.replace('rev-', '')) + 8}`}
                            size="sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[14.5px] text-dark">{rev.reviewerName}</span>
                              <span className="text-[12px] text-muted font-medium">{rev.date}</span>
                            </div>
                            
                            <div className="flex items-center text-accent my-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <IconStar
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(rev.rating) ? 'fill-accent' : 'text-gray-200'
                                  }`}
                                />
                              ))}
                              <span className="text-[12px] font-bold text-dark ml-1">{rev.rating}</span>
                            </div>
                            
                            <p className="text-[14px] text-muted font-medium leading-relaxed mt-1">{rev.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-[14px] text-center py-12">No reviews available yet. Be the first to book and write a review!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky/Fixed Booking Widget Column (Right 1 column on desktop) */}
          <div className="lg:col-span-1">
            <div className="sticky top-[96px] hidden lg:block">
              <Card className="p-6 border border-[#E0E0E0]">
                <h3 className="text-[18px] font-bold text-dark mb-1">Book Appointment</h3>
                <p className="text-[13px] text-muted font-medium mb-4">
                  Select items and choose date & time.
                </p>

                <div className="space-y-4 border-t border-b border-[#F0F0F0] py-4 mb-4">
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-muted font-semibold">Specialty:</span>
                    <span className="font-bold text-dark capitalize">{artisan.specialty}</span>
                  </div>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-muted font-semibold">City:</span>
                    <span className="font-bold text-dark">{artisan.city}</span>
                  </div>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-muted font-semibold">Services:</span>
                    <span className="font-bold text-dark">{artisan.services.length} items</span>
                  </div>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-muted font-semibold">Price range:</span>
                    <span className="font-bold text-primary">From GHS {artisan.priceFrom}</span>
                  </div>
                </div>

                <button
                  onClick={handleGeneralBooking}
                  className="w-full h-[52px] rounded-[10px] bg-primary text-white font-bold hover:bg-[#005230] transition duration-200 flex items-center justify-center gap-1.5"
                >
                  <IconCalendarEvent className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Book Now Button at bottom on mobile/tablet viewports (<lg) */}
      <div className="lg:hidden fixed bottom-[64px] left-0 right-0 bg-white border-t border-[#F0F0F0] px-4 py-3 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-muted block leading-none">Starting from</span>
          <span className="text-[18px] font-extrabold text-dark mt-1 block">GHS {artisan.priceFrom}</span>
        </div>
        <button
          onClick={handleGeneralBooking}
          className="bg-primary text-white text-[15px] font-bold h-[48px] px-6 rounded-lg hover:bg-[#005230] transition flex items-center justify-center gap-1"
        >
          <IconCalendarEvent className="w-5 h-5" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
};

export default ArtisanProfilePage;
