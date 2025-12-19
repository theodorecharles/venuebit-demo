export interface Order {
  id: string;
  user_id: string;
  event_id: string;
  event_artist: string;
  event_venue: string;
  event_date: string;
  tickets: OrderTicket[];
  subtotal: number;
  service_fee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface OrderTicket {
  seat_id: string;
  seat_number: string;
  row: string;
  section_name: string;
  price: number;
}

export interface CheckoutRequest {
  cart_id: string;
  user_id: string;
  payment_method: string;
  cardholder_name?: string;
}
