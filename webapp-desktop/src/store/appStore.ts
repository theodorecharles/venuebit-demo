import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '../types/order';

interface TrackedEvent {
  eventKey: string;
  timestamp: string;
  tags?: Record<string, string | number | boolean>;
}

interface AppState {
  // Recent orders (purchased tickets)
  recentOrders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;

  // Tracked events for debug display
  trackedEvents: TrackedEvent[];
  addTrackedEvent: (event: TrackedEvent) => void;
  clearTrackedEvents: () => void;

  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      recentOrders: [],
      addOrder: (order: Order) =>
        set((state) => ({
          recentOrders: [order, ...state.recentOrders].slice(0, 50),
        })),
      clearOrders: () => set({ recentOrders: [] }),

      trackedEvents: [],
      addTrackedEvent: (event: TrackedEvent) =>
        set((state) => ({
          trackedEvents: [event, ...state.trackedEvents].slice(0, 100),
        })),
      clearTrackedEvents: () => set({ trackedEvents: [] }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'venuebit-desktop-app',
      partialize: (state) => ({
        recentOrders: state.recentOrders,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
