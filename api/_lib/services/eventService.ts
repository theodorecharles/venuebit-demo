import { Event, EventCategory } from '../types/event';
import { events, getEventById, searchEvents } from '../data/events';
import { getSeatsForEvent } from '../data/seats';
import { Seat } from '../types/seat';

export interface EventFilters {
  category?: EventCategory;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export function getEvents(filters: EventFilters = {}): Event[] {
  let filteredEvents = [...events];

  if (filters.category) {
    filteredEvents = filteredEvents.filter(e => e.category === filters.category);
  }

  if (filters.featured !== undefined) {
    filteredEvents = filteredEvents.filter(e => e.featured === filters.featured);
  }

  filteredEvents.forEach(event => {
    const seats = getSeatsForEvent(event.id, event);
    event.availableSeats = seats.filter(s => s.status === 'available').length;
  });

  const offset = filters.offset || 0;
  const limit = filters.limit || filteredEvents.length;

  return filteredEvents.slice(offset, offset + limit);
}

export function getEvent(id: string): Event | undefined {
  const event = getEventById(id);

  if (event) {
    const seats = getSeatsForEvent(event.id, event);
    event.availableSeats = seats.filter(s => s.status === 'available').length;
  }

  return event;
}

export function getEventSeats(eventId: string): Seat[] {
  const event = getEventById(eventId);
  if (!event) {
    return [];
  }

  return getSeatsForEvent(eventId, event);
}

export function searchEventsService(query: string): Event[] {
  const results = searchEvents(query);

  results.forEach(event => {
    const seats = getSeatsForEvent(event.id, event);
    event.availableSeats = seats.filter(s => s.status === 'available').length;
  });

  return results;
}
