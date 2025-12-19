export interface Event {
  id: string;
  title: string;
  performer: string;
  category: string;
  date: string;
  time: string;
  venueId: string;
  venueName: string;
  city: string;
  state: string;
  description?: string;
  imageUrl?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  availableSeats?: number;
  // Computed for backwards compatibility
  artist?: string;
  venue?: string;
}

export interface Section {
  id: string;
  name: string;
  available_seats: number;
  base_price: number;
  position?: {
    x: number;
    y: number;
  };
}
