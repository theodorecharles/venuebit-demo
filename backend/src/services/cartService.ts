import { Cart, CartItem } from '../types/cart';
import { generateCartId, generateCartItemId } from '../utils/generateId';
import { getEventById } from '../data/events';
import { getSeatsForEvent, reserveSeats, releaseSeats } from '../data/seats';

const carts = new Map<string, Cart>();

export function createCart(userId: string): Cart {
  const cart: Cart = {
    id: generateCartId(),
    userId,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  carts.set(cart.id, cart);
  return cart;
}

export function getCart(cartId: string): Cart | undefined {
  return carts.get(cartId);
}

export function addItemToCart(
  cartId: string,
  eventId: string,
  seatIds: string[]
): { success: boolean; cart?: Cart; error?: string } {
  const cart = carts.get(cartId);

  if (!cart) {
    return { success: false, error: 'Cart not found' };
  }

  const event = getEventById(eventId);
  if (!event) {
    return { success: false, error: 'Event not found' };
  }

  const allSeats = getSeatsForEvent(eventId, event);
  const selectedSeats = allSeats.filter(s => seatIds.includes(s.id));

  if (selectedSeats.length !== seatIds.length) {
    return { success: false, error: 'Some seats not found' };
  }

  // Always allow seats to be added (no availability check)
  reserveSeats(eventId, seatIds);

  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const cartItem: CartItem = {
    id: generateCartItemId(),
    eventId,
    eventTitle: event.title,
    eventDate: event.date,
    eventTime: event.time,
    venueName: event.venueName,
    seats: selectedSeats,
    subtotal
  };

  cart.items.push(cartItem);
  cart.updatedAt = new Date();

  return { success: true, cart };
}

export function removeItemFromCart(
  cartId: string,
  itemId: string
): { success: boolean; cart?: Cart; error?: string } {
  const cart = carts.get(cartId);

  if (!cart) {
    return { success: false, error: 'Cart not found' };
  }

  const itemIndex = cart.items.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    return { success: false, error: 'Item not found in cart' };
  }

  const item = cart.items[itemIndex];
  const seatIds = item.seats.map(s => s.id);

  releaseSeats(item.eventId, seatIds);

  cart.items.splice(itemIndex, 1);
  cart.updatedAt = new Date();

  return { success: true, cart };
}

export function clearCart(cartId: string): void {
  const cart = carts.get(cartId);

  if (cart) {
    cart.items.forEach(item => {
      const seatIds = item.seats.map(s => s.id);
      releaseSeats(item.eventId, seatIds);
    });

    carts.delete(cartId);
  }
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.subtotal, 0);
}
