import { apiClient } from './client';
import { Cart } from '../types/cart';

export interface CreateCartRequest {
  userId: string;
}

export interface AddToCartRequest {
  eventId: string;
  seatIds: string[];
}

export const cartApi = {
  // Create a new cart
  createCart: async (data: CreateCartRequest): Promise<Cart> => {
    const response = await apiClient.post('/cart', data);
    return response.data.data;
  },

  // Get cart by ID
  getCart: async (cartId: string): Promise<Cart> => {
    const response = await apiClient.get(`/cart/${cartId}`);
    return response.data.data;
  },

  // Add seats to cart
  addToCart: async (cartId: string, data: AddToCartRequest): Promise<Cart> => {
    const response = await apiClient.post(`/cart/${cartId}/items`, data);
    return response.data.data;
  },

  // Remove item from cart
  removeFromCart: async (cartId: string, itemId: string): Promise<Cart> => {
    const response = await apiClient.delete(`/cart/${cartId}/items/${itemId}`);
    return response.data.data;
  },

  // Clear cart
  clearCart: async (cartId: string): Promise<void> => {
    await apiClient.delete(`/cart/${cartId}`);
  },
};
