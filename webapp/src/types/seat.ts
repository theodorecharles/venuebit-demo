export interface Seat {
  id: string;
  eventId: string;
  section: string;
  row: string;
  seatNumber: number;
  price: number;
  status: 'available' | 'selected' | 'sold';
}

export interface SeatWithDetails extends Seat {
  view_rating?: number;
  distance_to_stage?: number;
  accessibility?: boolean;
}

export interface SimilarSeat {
  seat: Seat;
  reason: string;
  savings?: number;
}
