import { useState, useEffect, useCallback } from 'react';
import { eventsApi, GetEventsParams } from '../api/events';
import { Event } from '../types/event';

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  refetch: (params?: GetEventsParams) => Promise<void>;
}

export const useEvents = (initialParams?: GetEventsParams): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (params?: GetEventsParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await eventsApi.getEvents(params);
      setEvents(data);
    } catch (err) {
      console.error('[useEvents] Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(initialParams);
  }, []);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};
