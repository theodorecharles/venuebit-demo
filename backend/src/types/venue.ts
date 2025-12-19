export type VenueType = 'stadium' | 'arena' | 'theater';

export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity: number;
  type: VenueType;
  address: string;
  imageUrl: string;
}
