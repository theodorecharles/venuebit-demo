import { useState, useCallback, useRef, useEffect } from 'react';
import { eventsApi } from '../api/events';
import { Event } from '../types/event';
import { useUserStore } from '../store/userStore';

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: Event[];
  isSearching: boolean;
  error: string | null;
  hasSearched: boolean;
}

export const useSearch = (debounceMs: number = 300): UseSearchReturn => {
  const userId = useUserStore((state) => state.userId);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const data = await eventsApi.searchEvents(searchQuery, userId);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      console.error('[useSearch] Error searching events:', err);
      setError('Failed to search events');
    } finally {
      setIsSearching(false);
    }
  }, [userId]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debounceMs, performSearch]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    hasSearched,
  };
};
