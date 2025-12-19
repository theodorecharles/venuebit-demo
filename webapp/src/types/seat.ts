export interface Seat {
  id: string;
  seat_number: string;
  row: string;
  section_id: string;
  section_name: string;
  price: number;
  status: 'available' | 'selected' | 'sold';
  position?: {
    x: number;
    y: number;
  };
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
