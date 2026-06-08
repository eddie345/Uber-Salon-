export interface Booking {
  id: string;
  artisanId: string;
  artisanName: string;
  service: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  durationMins: number;
  priceGHS: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

export const mockBookings: Booking[] = [
  {
    id: "bk-1",
    artisanId: "art-1",
    artisanName: "Kwesi Mensah",
    service: "Premium Fade",
    date: "2026-06-06",
    timeSlot: "10:00 AM",
    durationMins: 30,
    priceGHS: 50,
    status: "confirmed"
  },
  {
    id: "bk-2",
    artisanId: "art-2",
    artisanName: "Ama Serwaa",
    service: "Box Braids",
    date: "2026-06-08",
    timeSlot: "02:00 PM",
    durationMins: 180,
    priceGHS: 150,
    status: "pending"
  },
  {
    id: "bk-3",
    artisanId: "art-3",
    artisanName: "Yaw Owusu",
    service: "Basic Haircut",
    date: "2026-06-01",
    timeSlot: "09:00 AM",
    durationMins: 20,
    priceGHS: 40,
    status: "completed"
  },
  {
    id: "bk-4",
    artisanId: "art-4",
    artisanName: "Esi Bedu",
    service: "Sisterlocks Installation",
    date: "2026-05-25",
    timeSlot: "11:00 AM",
    durationMins: 360,
    priceGHS: 450,
    status: "cancelled"
  },
  {
    id: "bk-5",
    artisanId: "art-1",
    artisanName: "Kwesi Mensah",
    service: "Beard Trim & Oil",
    date: "2026-06-10",
    timeSlot: "04:30 PM",
    durationMins: 20,
    priceGHS: 30,
    status: "confirmed"
  }
];
