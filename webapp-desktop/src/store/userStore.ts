import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Generate a random user ID
const generateUserId = (): string => {
  return `user_${Math.random().toString(36).substring(2, 11)}`;
};

interface UserState {
  userId: string;
  setUserId: (userId: string) => void;
  generateNewUserId: () => string;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: generateUserId(),
      setUserId: (userId: string) => set({ userId }),
      generateNewUserId: () => {
        const newId = generateUserId();
        set({ userId: newId });
        return newId;
      },
    }),
    {
      name: 'venuebit-desktop-user',
    }
  )
);
