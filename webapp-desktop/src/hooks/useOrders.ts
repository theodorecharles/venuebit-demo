import { useAppStore } from '../store/appStore';
import { Order } from '../types/order';

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrders = (): UseOrdersReturn => {
  const orders = useAppStore((state) => state.recentOrders);

  return {
    orders,
    isLoading: false,
    error: null,
    refetch: async () => {},
  };
};
