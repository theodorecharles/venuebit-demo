import { useState, useEffect, useCallback } from 'react';
import { eventsApi } from '../api/events';
import { Event } from '../types/event';

interface UseEventReturn {
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEvent = (eventId: string | undefined): UseEventReturn => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await eventsApi.getEvent(eventId);
      setEvent(data);
    } catch (err) {
      console.error('[useEvent] Error fetching event:', err);
      setError('Failed to load event');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    isLoading,
    error,
    refetch: fetchEvent,
  };
};
