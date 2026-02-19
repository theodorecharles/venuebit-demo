import { useEffect, useRef, useState } from 'react';
import { apiClient } from '../api/client';

interface UseDatafilePollingReturn {
  isPolling: boolean;
  lastRevision: string | null;
}

const POLLING_INTERVAL = 5000;

export const useDatafilePolling = (): UseDatafilePollingReturn => {
  const [isPolling, setIsPolling] = useState(false);
  const [lastRevision, setLastRevision] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const response = await apiClient.get('/datafile-status');
        if (!mounted) return;

        setIsPolling(true);
        const { revision } = response.data;
        if (revision) {
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
