import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../api/orders';
import { Order } from '../types/order';
import { useUserStore } from '../store/userStore';

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrders = (): UseOrdersReturn => {
  const userId = useUserStore((state) => state.userId);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await ordersApi.getUserOrders(userId);
      setOrders(data);
    } catch (err) {
      console.error('[useOrders] Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
  };
};
