import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { mockArtisans } from '../mocks/mockArtisans';
import type { Artisan, Review, Service } from '../mocks/mockArtisans';
import { mockBookings } from '../mocks/mockBookings';
import type { Booking } from '../mocks/mockBookings';
import { mockServices } from '../mocks/mockServices';
import type { ServiceCategory } from '../mocks/mockServices';

export interface BookingDraft {
  artisan: Artisan | null;
  service: Service | null;
  date: string | null; // "YYYY-MM-DD"
  timeSlot: string | null; // e.g. "10:00 AM"
  paymentMethod: string | null; // "MTN MoMo" | "Vodafone Cash" | "AirtelTigo" | "Card"
}

export interface AppContextType {
  artisans: Artisan[];
  bookings: Booking[];
  services: ServiceCategory[];
  searchFilter: string; // 'All' | 'Near Me' | 'Top Rated' | 'Haircut' | 'Braids' etc
  searchQuery: string;
  selectedCity: 'Accra' | 'Kumasi' | 'Takoradi' | 'Tamale' | 'Cape Coast';
  bookingDraft: BookingDraft;
  artisanAvailability: Record<string, Record<string, string[]>>; // artisanId -> day (Mon-Sun) -> list of available slots
  setSearchFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCity: (city: 'Accra' | 'Kumasi' | 'Takoradi' | 'Tamale' | 'Cape Coast') => void;
  updateBookingDraft: (draft: Partial<BookingDraft>) => void;
  clearBookingDraft: () => void;
  addBooking: (artisanId: string, artisanName: string, service: string, date: string, timeSlot: string, durationMins: number, priceGHS: number) => Booking;
  cancelBooking: (bookingId: string) => void;
  addReview: (artisanId: string, reviewerName: string, rating: number, comment: string) => void;
  saveAvailability: (artisanId: string, day: string, availableSlots: string[]) => void;
}

const DEFAULT_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const INITIAL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artisans, setArtisans] = useState<Artisan[]>(mockArtisans);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [services] = useState<ServiceCategory[]>(mockServices);
  const [searchFilter, setSearchFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<'Accra' | 'Kumasi' | 'Takoradi' | 'Tamale' | 'Cape Coast'>('Accra');

  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({
    artisan: null,
    service: null,
    date: null,
    timeSlot: null,
    paymentMethod: null
  });

  // Schedule management state: default some slots to be available for each mock artisan
  const [artisanAvailability, setArtisanAvailability] = useState<Record<string, Record<string, string[]>>>(() => {
    const init: Record<string, Record<string, string[]>> = {};
    mockArtisans.forEach((art) => {
      init[art.id] = {};
      INITIAL_DAYS.forEach((day) => {
        // By default, Monday to Friday has slots 9am-5pm. Saturday/Sunday has fewer slots
        if (day === "Sun") {
          init[art.id][day] = ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"]; // Block others
        } else {
          init[art.id][day] = [...DEFAULT_SLOTS]; // All available
        }
      });
    });
    return init;
  });

  const updateBookingDraft = (draft: Partial<BookingDraft>) => {
    setBookingDraft((prev) => ({ ...prev, ...draft }));
  };

  const clearBookingDraft = () => {
    setBookingDraft({
      artisan: null,
      service: null,
      date: null,
      timeSlot: null,
      paymentMethod: null
    });
  };

  const addBooking = (
    artisanId: string,
    artisanName: string,
    service: string,
    date: string,
    timeSlot: string,
    durationMins: number,
    priceGHS: number
  ): Booking => {
    const newBooking: Booking = {
      id: `bk-new-${Date.now()}`,
      artisanId,
      artisanName,
      service,
      date,
      timeSlot,
      durationMins,
      priceGHS,
      status: 'confirmed' // Confirmed directly for the mock flow
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === bookingId ? { ...bk, status: 'cancelled' } : bk))
    );
  };

  const addReview = (artisanId: string, reviewerName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-new-${Date.now()}`,
      reviewerName,
      rating,
      date: new Date().toISOString().split('T')[0],
      comment
    };

    setArtisans((prev) =>
      prev.map((art) => {
        if (art.id === artisanId) {
          const updatedReviews = [newReview, ...art.reviews];
          const newReviewCount = updatedReviews.length;
          const newRating = parseFloat(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewCount).toFixed(1)
          );
          return {
            ...art,
            reviews: updatedReviews,
            reviewCount: newReviewCount,
            rating: newRating
          };
        }
        return art;
      })
    );
  };

  const saveAvailability = (artisanId: string, day: string, availableSlots: string[]) => {
    setArtisanAvailability((prev) => ({
      ...prev,
      [artisanId]: {
        ...prev[artisanId],
        [day]: availableSlots
      }
    }));
  };

  return (
    <AppContext.Provider
      value={{
        artisans,
        bookings,
        services,
        searchFilter,
        searchQuery,
        selectedCity,
        bookingDraft,
        artisanAvailability,
        setSearchFilter,
        setSearchQuery,
        setSelectedCity,
        updateBookingDraft,
        clearBookingDraft,
        addBooking,
        cancelBooking,
        addReview,
        saveAvailability
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
