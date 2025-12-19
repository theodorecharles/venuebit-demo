export type SeatStatus = 'available' | 'sold' | 'reserved';

export interface Seat {
  id: string;
  eventId: string;
  section: string;
  row: string;
  seatNumber: number;
  price: number;
  status: SeatStatus;
}
