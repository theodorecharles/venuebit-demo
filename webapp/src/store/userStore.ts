import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string | null;
  setUserId: (userId: string) => void;
  clearUserId: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (userId: string) => set({ userId }),
      clearUserId: () => set({ userId: null }),
    }),
    {
      name: 'venuebit-user',
    }
  )
);
