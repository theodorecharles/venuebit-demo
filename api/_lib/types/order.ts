import { Seat } from './seat';

export interface OrderItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  seats: Seat[];
  subtotal: number;
}

export interface PaymentInfo {
  cardLast4: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  processingFee: number;
  total: number;
  payment: PaymentInfo;
  createdAt: Date;
  status: 'completed' | 'pending' | 'failed';
}
