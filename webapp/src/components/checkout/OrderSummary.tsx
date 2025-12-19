import React from 'react';
import { Cart } from '../../types/cart';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import { Card } from '../common/Card';

interface OrderSummaryProps {
  cart: Cart;
  eventArtist: string;
  eventVenue: string;
  eventDate: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  eventArtist,
  eventVenue,
  eventDate,
}) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary mb-2">{eventArtist}</h3>
        <p className="text-text-secondary">{eventVenue}</p>
        <p className="text-text-secondary">{formatDateTime(eventDate)}</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-text-primary mb-3">
          Your Tickets ({cart.items.length})
        </h4>
        {cart.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start p-3 bg-surface-light rounded"
          >
            <div>
              <div className="font-semibold">{item.section_name}</div>
              <div className="text-sm text-text-secondary">
                Row {item.row}, Seat {item.seat_number}
              </div>
            </div>
            <div className="font-semibold text-primary">
              {formatPrice(item.price)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
