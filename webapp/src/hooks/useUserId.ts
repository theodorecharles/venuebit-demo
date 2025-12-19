import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export const useUserId = () => {
  const [searchParams] = useSearchParams();
  const { userId, setUserId } = useUserStore();

  useEffect(() => {
    // Get userId from URL params
    const urlUserId = searchParams.get('userId');

    if (urlUserId && urlUserId !== userId) {
      // Update store if URL param is different
      setUserId(urlUserId);
    } else if (!userId) {
      // Auto-generate a userId if none exists
      const newUserId = generateNewUserId();
      setUserId(newUserId);
    }
  }, [searchParams, userId, setUserId]);

  return userId;
};

export const generateNewUserId = (): string => {
  // Generate a UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
