export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  processingFee?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  payment?: {
    cardLast4: string;
  };
}

export interface OrderItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  seats: OrderSeat[];
  subtotal: number;
}

export interface OrderSeat {
  id: string;
  section: string;
  row: string;
  seatNumber: number;
  price: number;
}

export interface CheckoutRequest {
  cartId: string;
  userId: string;
  cart: import('./cart').Cart;
  payment: {
    cardLast4: string;
    cardholderName?: string;
  };
}
