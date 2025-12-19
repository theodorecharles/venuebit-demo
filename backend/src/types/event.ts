export type EventCategory = 'concerts' | 'sports' | 'theater' | 'comedy';

export interface Event {
  id: string;
  title: string;
  performer: string;
  category: EventCategory;
  date: string;
  time: string;
  venueId: string;
  venueName: string;
  city: string;
  state: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  minPrice: number;
  maxPrice: number;
  availableSeats: number;
}
