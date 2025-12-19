import { apiClient } from './client';
import { Order, CheckoutRequest } from '../types/order';

export const checkoutApi = {
  // Complete checkout and create order
  checkout: async (data: CheckoutRequest): Promise<Order> => {
    const response = await apiClient.post('/checkout', data);
    return response.data;
  },

  // Get order by ID
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get orders for a user
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response = await apiClient.get(`/users/${userId}/orders`);
    return response.data;
  },
};
