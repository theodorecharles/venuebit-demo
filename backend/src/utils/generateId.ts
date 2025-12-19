import { v4 as uuidv4 } from 'uuid';

export function generateCartId(): string {
  return `cart-${uuidv4()}`;
}

export function generateOrderId(): string {
  return `order-${uuidv4()}`;
}

export function generateCartItemId(): string {
  return `item-${uuidv4()}`;
}
