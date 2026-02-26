import { apiClient } from './client';
import { Order, CheckoutRequest } from '../types/order';

export const ordersApi = {
  // Create order (checkout)
  checkout: async (data: CheckoutRequest): Promise<Order> => {
    const response = await apiClient.post('/checkout', data);
    return response.data.data;
  },

  // Get order by ID
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data.data;
  },

  // Get all orders for a user
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response = await apiClient.get(`/users/${userId}/orders`);
    return response.data.data;
  },
};
