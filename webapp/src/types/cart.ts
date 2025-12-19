export interface CartSeat {
  id: string;
  eventId: string;
  section: string;
  row: string;
  seatNumber: number;
  price: number;
  status: string;
}

export interface CartItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  seats: CartSeat[];
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  serviceFee: number;
  total: number;
  itemCount: number;
}
