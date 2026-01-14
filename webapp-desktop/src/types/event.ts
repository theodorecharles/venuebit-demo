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
  description?: string;
  imageUrl?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  availableSeats?: number;
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

export const categoryEmojis: Record<EventCategory, string> = {
  concerts: '🎵',
  sports: '⚽',
  theater: '🎭',
  comedy: '😂',
};

export const categoryDisplayNames: Record<EventCategory, string> = {
  concerts: 'Concerts',
  sports: 'Sports',
  theater: 'Theater',
  comedy: 'Comedy',
};
