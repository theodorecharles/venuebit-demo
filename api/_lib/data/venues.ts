import { Venue } from '../types/venue';

export const venues: Venue[] = [
  {
    id: 'venue-1',
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 70000,
    type: 'stadium',
    address: '1001 Stadium Dr, Inglewood, CA 90301',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'
  },
  {
    id: 'venue-2',
    name: 'Crypto.com Arena',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 20000,
    type: 'arena',
    address: '1111 S Figueroa St, Los Angeles, CA 90015',
    imageUrl: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800'
  },
  {
    id: 'venue-3',
    name: 'Pantages Theatre',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 2700,
    type: 'theater',
    address: '6233 Hollywood Blvd, Los Angeles, CA 90028',
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'
  },
  {
    id: 'venue-4',
    name: 'The Forum',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 17500,
    type: 'arena',
    address: '3900 W Manchester Blvd, Inglewood, CA 90305',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
  },
  {
    id: 'venue-5',
    name: 'Rose Bowl',
    city: 'Pasadena',
    state: 'CA',
    capacity: 90000,
    type: 'stadium',
    address: '1001 Rose Bowl Dr, Pasadena, CA 91103',
    imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800'
  },
  {
    id: 'venue-6',
    name: 'Dodger Stadium',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 56000,
    type: 'stadium',
    address: '1000 Vin Scully Ave, Los Angeles, CA 90012',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9c82?w=800'
  },
  {
    id: 'venue-7',
    name: 'Hollywood Bowl',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 17500,
    type: 'arena',
    address: '2301 N Highland Ave, Los Angeles, CA 90068',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
  },
  {
    id: 'venue-8',
    name: 'The Colosseum at Caesars Palace',
    city: 'Las Vegas',
    state: 'NV',
    capacity: 4300,
    type: 'theater',
    address: '3570 Las Vegas Blvd S, Las Vegas, NV 89109',
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'
  },
  {
    id: 'venue-9',
    name: 'Intuit Dome',
    city: 'Inglewood',
    state: 'CA',
    capacity: 18000,
    type: 'arena',
    address: '3930 W Century Blvd, Inglewood, CA 90303',
    imageUrl: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800'
  },
  {
    id: 'venue-10',
    name: 'BMO Stadium',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 22000,
    type: 'stadium',
    address: '3939 S Figueroa St, Los Angeles, CA 90037',
    imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800'
  },
  {
    id: 'venue-11',
    name: 'Los Angeles Memorial Coliseum',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 78000,
    type: 'stadium',
    address: '3911 S Figueroa St, Los Angeles, CA 90037',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'
  },
  {
    id: 'venue-12',
    name: 'Dolby Theatre',
    city: 'Los Angeles',
    state: 'CA',
    capacity: 3400,
    type: 'theater',
    address: '6801 Hollywood Blvd, Hollywood, CA 90028',
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'
  }
];

export function getVenueById(id: string): Venue | undefined {
  return venues.find(v => v.id === id);
}
