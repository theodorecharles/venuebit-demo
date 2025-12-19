export interface CartItem {
  seat_id: string;
  seat_number: string;
  row: string;
  section_name: string;
  price: number;
}

export interface Cart {
  id: string;
  user_id: string;
  event_id: string;
  items: CartItem[];
  created_at: string;
  expires_at: string;
}

export interface CartSummary {
  subtotal: number;
  service_fee: number;
  total: number;
  item_count: number;
}
