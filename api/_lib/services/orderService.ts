import { Order, OrderItem, PaymentInfo } from '../types/order';
import { Cart } from '../types/cart';
import { generateOrderId } from '../utils/generateId';
import { calculatePricing } from '../utils/pricing';
import { markSeatsAsSold } from '../data/seats';
import { getEventById } from '../data/events';
import { recordUserPurchase } from './userAttributesService';

const orders = new Map<string, Order>();
const userOrders = new Map<string, string[]>();

export interface CreateOrderFromCartParams {
  userId: string;
  cart: Cart;
  payment: PaymentInfo;
}

export function createOrderFromCart(params: CreateOrderFromCartParams): { success: boolean; order?: Order; error?: string } {
  const { cart, userId, payment } = params;

  if (cart.items.length === 0) {
    return { success: false, error: 'Cart is empty' };
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

  const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  const pricing = calculatePricing(subtotal);

  const order: Order = {
    id: generateOrderId(),
    userId,
    items: orderItems,
    subtotal: pricing.subtotal,
    serviceFee: pricing.serviceFee,
    processingFee: pricing.processingFee,
    total: pricing.total,
    payment,
    createdAt: new Date(),
    status: 'completed'
  };

  cart.items.forEach(item => {
    const seatIds = item.seats.map(s => s.id);
    markSeatsAsSold(item.eventId, seatIds);

    const event = getEventById(item.eventId);
    if (event) {
      recordUserPurchase(userId, event.category);
    }
  });

  orders.set(order.id, order);

  if (!userOrders.has(userId)) {
    userOrders.set(userId, []);
  }
  userOrders.get(userId)!.push(order.id);

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
