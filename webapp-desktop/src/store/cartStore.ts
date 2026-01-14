import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart } from '../types/cart';

interface CartState {
  cart: Cart | null;
  cartId: string | null;
  setCart: (cart: Cart) => void;
  setCartId: (cartId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      cartId: null,
      setCart: (cart: Cart) => set({ cart, cartId: cart.id }),
      setCartId: (cartId: string) => set({ cartId }),
      clearCart: () => set({ cart: null, cartId: null }),
    }),
    {
      name: 'venuebit-desktop-cart',
    }
  )
);
