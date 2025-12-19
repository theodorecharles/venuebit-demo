import { Seat, SeatStatus } from '../types/seat';
import { Event } from '../types/event';
import { getVenueById } from './venues';
import { v4 as uuidv4 } from 'uuid';

interface SeatConfiguration {
  section: string;
  rows: string[];
  seatsPerRow: number;
  basePrice: number;
}

function getStadiumConfiguration(eventMinPrice: number, eventMaxPrice: number): SeatConfiguration[] {
  return [
    {
      section: 'Floor',
      rows: ['A', 'B', 'C', 'D', 'E', 'F'],
      seatsPerRow: 20,
      basePrice: eventMaxPrice
    },
    {
      section: 'Lower 100s',
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      seatsPerRow: 30,
      basePrice: (eventMaxPrice + eventMinPrice) / 2
    },
    {
      section: 'Upper 200s',
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      seatsPerRow: 35,
      basePrice: eventMinPrice
    }
  ];
}

function getArenaConfiguration(eventMinPrice: number, eventMaxPrice: number): SeatConfiguration[] {
  return [
    {
      section: 'Floor',
      rows: ['A', 'B', 'C', 'D'],
      seatsPerRow: 15,
      basePrice: eventMaxPrice
    },
    {
      section: 'Lower 100s',
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
      seatsPerRow: 25,
      basePrice: (eventMaxPrice + eventMinPrice) / 2
    },
    {
      section: 'Upper 200s',
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
      seatsPerRow: 30,
      basePrice: eventMinPrice
    }
  ];
}

function getTheaterConfiguration(eventMinPrice: number, eventMaxPrice: number): SeatConfiguration[] {
  return [
    {
      section: 'Orchestra',
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'],
      seatsPerRow: 40,
      basePrice: eventMaxPrice
    },
    {
      section: 'Mezzanine',
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      seatsPerRow: 35,
      basePrice: (eventMaxPrice + eventMinPrice) / 2
    },
    {
      section: 'Balcony',
      rows: ['A', 'B', 'C', 'D', 'E', 'F'],
      seatsPerRow: 30,
      basePrice: eventMinPrice
    }
  ];
}

function generateSeatsForConfiguration(
  eventId: string,
  configurations: SeatConfiguration[]
): Seat[] {
  const seats: Seat[] = [];

  for (const config of configurations) {
    for (const row of config.rows) {
      for (let seatNum = 1; seatNum <= config.seatsPerRow; seatNum++) {
        const isSold = Math.random() < 0.3;
        const priceVariation = Math.random() * 20 - 10;

        seats.push({
          id: uuidv4(),
          eventId,
          section: config.section,
          row,
          seatNumber: seatNum,
          price: Math.round(config.basePrice + priceVariation),
          status: isSold ? 'sold' : 'available'
        });
      }
    }
  }

  return seats;
}

export function generateSeatsForEvent(event: Event): Seat[] {
  const venue = getVenueById(event.venueId);

  if (!venue) {
    return [];
  }

  let configurations: SeatConfiguration[];

  switch (venue.type) {
    case 'stadium':
      configurations = getStadiumConfiguration(event.minPrice, event.maxPrice);
      break;
    case 'arena':
      configurations = getArenaConfiguration(event.minPrice, event.maxPrice);
      break;
    case 'theater':
      configurations = getTheaterConfiguration(event.minPrice, event.maxPrice);
      break;
    default:
      return [];
  }

  return generateSeatsForConfiguration(event.id, configurations);
}

const seatCache = new Map<string, Seat[]>();

export function getSeatsForEvent(eventId: string, event?: Event): Seat[] {
  if (seatCache.has(eventId)) {
    return seatCache.get(eventId)!;
  }

  if (!event) {
    return [];
  }

  const seats = generateSeatsForEvent(event);
  seatCache.set(eventId, seats);

  return seats;
}

export function getSeatById(eventId: string, seatId: string): Seat | undefined {
  const seats = seatCache.get(eventId);
  return seats?.find(s => s.id === seatId);
}

export function updateSeatStatus(eventId: string, seatId: string, status: SeatStatus): boolean {
  const seats = seatCache.get(eventId);
  if (!seats) return false;

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return false;

  seat.status = status;
  return true;
}

export function reserveSeats(eventId: string, seatIds: string[]): boolean {
  const seats = seatCache.get(eventId);
  if (!seats) return false;

  const seatsToReserve = seats.filter(s => seatIds.includes(s.id));

  if (seatsToReserve.length !== seatIds.length) {
    return false;
  }

  const allAvailable = seatsToReserve.every(s => s.status === 'available');
  if (!allAvailable) {
    return false;
  }

  seatsToReserve.forEach(s => s.status = 'reserved');
  return true;
}

export function releaseSeats(eventId: string, seatIds: string[]): void {
  const seats = seatCache.get(eventId);
  if (!seats) return;

  const seatsToRelease = seats.filter(s => seatIds.includes(s.id) && s.status === 'reserved');
  seatsToRelease.forEach(s => s.status = 'available');
}

export function markSeatsAsSold(eventId: string, seatIds: string[]): void {
  const seats = seatCache.get(eventId);
  if (!seats) return;

  const seatsToSell = seats.filter(s => seatIds.includes(s.id));
  seatsToSell.forEach(s => s.status = 'sold');
}
