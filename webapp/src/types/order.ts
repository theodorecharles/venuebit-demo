export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
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
  payment: {
    cardLast4: string;
    cardholderName?: string;
  };
}
