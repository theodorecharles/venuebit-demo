import { apiClient } from './client';
import { Event, Section } from '../types/event';
import { Seat } from '../types/seat';

export interface GetSeatsParams {
  event_id: string;
  section_id?: string;
}

// Transform backend response to add compatibility fields
const transformEvent = (data: any): Event => ({
  ...data,
  artist: data.performer,
  venue: data.venueName,
});

export const eventsApi = {
  // Get event details
  getEvent: async (eventId: string): Promise<Event> => {
    console.log('[eventsApi] Fetching event with ID:', eventId);
    const response = await apiClient.get(`/events/${eventId}`);
    console.log('[eventsApi] Event response:', response.data);
    return transformEvent(response.data.data);
  },

  // Get all events
  getEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get('/events');
    return response.data.data.map(transformEvent);
  },

  // Get sections for an event
  getSections: async (eventId: string): Promise<Section[]> => {
    const response = await apiClient.get(`/events/${eventId}/sections`);
    return response.data.data || response.data;
  },

  // Get seats for an event/section
  getSeats: async (params: GetSeatsParams): Promise<Seat[]> => {
    const { event_id, section_id } = params;
    const url = section_id
      ? `/events/${event_id}/sections/${section_id}/seats`
      : `/events/${event_id}/seats`;
    const response = await apiClient.get(url);
    return response.data.data || response.data;
  },

  // Reserve seats (temporary hold)
  reserveSeats: async (eventId: string, seatIds: string[], userId: string): Promise<void> => {
    await apiClient.post(`/events/${eventId}/reserve`, {
      seat_ids: seatIds,
      user_id: userId,
    });
  },
};
