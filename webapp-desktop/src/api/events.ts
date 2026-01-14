import { apiClient } from './client';
import { Event, EventCategory, Section } from '../types/event';
import { Seat } from '../types/seat';

export interface GetEventsParams {
  category?: EventCategory;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetSeatsParams {
  eventId: string;
  sectionId?: string;
}

export const eventsApi = {
  // Get all events with optional filtering
  getEvents: async (params?: GetEventsParams): Promise<Event[]> => {
    const response = await apiClient.get('/events', { params });
    return response.data.data;
  },

  // Get event details
  getEvent: async (eventId: string): Promise<Event> => {
    console.log('[eventsApi] Fetching event with ID:', eventId);
    const response = await apiClient.get(`/events/${eventId}`);
    console.log('[eventsApi] Event response:', response.data);
    return response.data.data;
  },

  // Get sections for an event
  getSections: async (eventId: string): Promise<Section[]> => {
    const response = await apiClient.get(`/events/${eventId}/sections`);
    return response.data.data || response.data;
  },

  // Get seats for an event/section
  getSeats: async (params: GetSeatsParams): Promise<Seat[]> => {
    const { eventId, sectionId } = params;
    const url = sectionId
      ? `/events/${eventId}/sections/${sectionId}/seats`
      : `/events/${eventId}/seats`;
    const response = await apiClient.get(url);
    return response.data.data || response.data;
  },

  // Search events
  searchEvents: async (query: string, userId?: string): Promise<Event[]> => {
    const response = await apiClient.get('/search', {
      params: { q: query, userId },
    });
    return response.data.data;
  },
};
