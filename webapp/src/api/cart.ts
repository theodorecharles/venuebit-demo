import { apiClient } from './client';
import { Cart } from '../types/cart';

export interface CreateCartRequest {
  user_id: string;
  event_id: string;
}

export interface AddToCartRequest {
  seat_ids: string[];
}

export const cartApi = {
  // Create a new cart
  createCart: async (data: CreateCartRequest): Promise<Cart> => {
    const response = await apiClient.post('/carts', data);
    return response.data;
  },

  // Get cart by ID
  getCart: async (cartId: string): Promise<Cart> => {
    const response = await apiClient.get(`/carts/${cartId}`);
    return response.data;
  },

  // Add seats to cart
  addToCart: async (cartId: string, data: AddToCartRequest): Promise<Cart> => {
    const response = await apiClient.post(`/carts/${cartId}/items`, data);
    return response.data;
  },

  // Remove seat from cart
  removeFromCart: async (cartId: string, seatId: string): Promise<Cart> => {
    const response = await apiClient.delete(`/carts/${cartId}/items/${seatId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (cartId: string): Promise<void> => {
    await apiClient.delete(`/carts/${cartId}`);
  },
};
