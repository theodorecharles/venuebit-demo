import { Order, OrderItem, PaymentInfo } from '../types/order';
import { generateOrderId } from '../utils/generateId';
import { calculatePricing } from '../utils/pricing';
import { getCart, clearCart, getCartTotal } from './cartService';
import { markSeatsAsSold } from '../data/seats';
import { getEventById } from '../data/events';
import { recordUserPurchase } from './userAttributesService';

const orders = new Map<string, Order>();
const userOrders = new Map<string, string[]>();

export interface CreateOrderParams {
  cartId: string;
  userId: string;
  payment: PaymentInfo;
}

export function createOrder(params: CreateOrderParams): { success: boolean; order?: Order; error?: string } {
  const cart = getCart(params.cartId);

  if (!cart) {
    return { success: false, error: 'Cart not found' };
  }

  if (cart.items.length === 0) {
    return { success: false, error: 'Cart is empty' };
  }

  if (cart.userId !== params.userId) {
    return { success: false, error: 'Cart does not belong to this user' };
  }

  const orderItems: OrderItem[] = cart.items.map(item => ({
    id: item.id,
    eventId: item.eventId,
    eventTitle: item.eventTitle,
    eventDate: item.eventDate,
    eventTime: item.eventTime,
    venueName: item.venueName,
    seats: item.seats,
    subtotal: item.subtotal
  }));

  const subtotal = getCartTotal(cart);
  const pricing = calculatePricing(subtotal);

  const order: Order = {
    id: generateOrderId(),
    userId: params.userId,
    items: orderItems,
    subtotal: pricing.subtotal,
    serviceFee: pricing.serviceFee,
    processingFee: pricing.processingFee,
    total: pricing.total,
    payment: params.payment,
    createdAt: new Date(),
    status: 'completed'
  };

  cart.items.forEach(item => {
    const seatIds = item.seats.map(s => s.id);
    markSeatsAsSold(item.eventId, seatIds);

    // Record the purchase category for user attributes
    const event = getEventById(item.eventId);
    if (event) {
      recordUserPurchase(params.userId, event.category);
    }
  });

  orders.set(order.id, order);

  if (!userOrders.has(params.userId)) {
    userOrders.set(params.userId, []);
  }
  userOrders.get(params.userId)!.push(order.id);

  clearCart(params.cartId);

  return { success: true, order };
}

export function getOrder(orderId: string): Order | undefined {
  return orders.get(orderId);
}

export function getUserOrders(userId: string): Order[] {
  const orderIds = userOrders.get(userId) || [];
  return orderIds
    .map(id => orders.get(id))
    .filter((order): order is Order => order !== undefined)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
