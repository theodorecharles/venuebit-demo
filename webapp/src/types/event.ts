export interface Event {
  id: string;
  artist: string;
  venue: string;
  date: string;
  city: string;
  image_url?: string;
  description?: string;
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
