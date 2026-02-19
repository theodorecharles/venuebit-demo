import React from 'react';
import { CartItem } from '../../types/cart';
import { formatPrice } from '../../utils/formatters';

interface TicketListProps {
  items: CartItem[];
}

export const TicketList: React.FC<TicketListProps> = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id}>
          <div className="font-semibold text-text-primary mb-1">{item.eventTitle}</div>
          {item.seats.map((seat, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-3 bg-surface-light rounded mb-1"
            >
              <div>
                <div className="font-semibold text-text-primary">
                  {seat.section}
                </div>
                <div className="text-sm text-text-secondary">
                  Row {seat.row}, Seat {seat.seatNumber}
                </div>
              </div>
              <div className="font-semibold text-primary">
                {formatPrice(seat.price)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
