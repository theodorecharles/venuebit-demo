import { useEffect, useRef, useState } from 'react';
import { apiClient } from '../api/client';

interface UseDatafilePollingOptions {
  onDatafileUpdate?: () => void;
}

interface UseDatafilePollingReturn {
  isPolling: boolean;
  lastRevision: string | null;
}

const POLLING_INTERVAL = 5000;

export const useDatafilePolling = (options?: UseDatafilePollingOptions): UseDatafilePollingReturn => {
  const [isPolling, setIsPolling] = useState(false);
  const [lastRevision, setLastRevision] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onDatafileUpdateRef = useRef(options?.onDatafileUpdate);
  const lastRevisionRef = useRef<string | null>(null);

  useEffect(() => {
    onDatafileUpdateRef.current = options?.onDatafileUpdate;
  }, [options?.onDatafileUpdate]);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const response = await apiClient.get('/datafile-status');
        if (!mounted) return;

        setIsPolling(true);
        const { revision } = response.data;
        if (revision) {
          // Check if revision changed (skip first poll)
          if (lastRevisionRef.current !== null && revision !== lastRevisionRef.current) {
            console.log(`[Polling] Datafile changed! Revision: ${lastRevisionRef.current} -> ${revision}`);
            if (onDatafileUpdateRef.current) {
              onDatafileUpdateRef.current();
            }
          }
          lastRevisionRef.current = revision;
          setLastRevision(revision);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('[Polling] Error fetching datafile status:', error);
        setIsPolling(false);
      }
    };

    // Initial poll
    poll();

    // Set up interval
    intervalRef.current = setInterval(poll, POLLING_INTERVAL);

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { isPolling, lastRevision };
};
