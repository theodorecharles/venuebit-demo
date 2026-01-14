import React from 'react';
import { Cart } from '../../types/cart';
import { formatDateTime, formatSeatDescription, formatPrice } from '../../utils/formatters';
import { Card } from '../common/Card';

interface OrderSummaryProps {
  cart: Cart;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cart }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Order Summary</h3>

      {cart.items.map((item) => (
        <div key={item.id} className="pb-4 border-b border-theme last:border-0 last:pb-0 mb-4 last:mb-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">
              🎫
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary">{item.eventTitle}</h4>
              <p className="text-sm text-text-secondary">{item.venueName}</p>
              <p className="text-sm text-text-tertiary">
                {formatDateTime(item.eventDate, item.eventTime)}
              </p>

              {/* Seats */}
              <div className="mt-3 space-y-2">
                {item.seats.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between p-2 bg-theme-surface-secondary rounded"
                  >
                    <span className="text-sm text-text-primary">
                      {formatSeatDescription(seat.section, seat.row, seat.seatNumber)}
                    </span>
                    <span className="text-sm font-medium text-primary-light">
                      {formatPrice(seat.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};
