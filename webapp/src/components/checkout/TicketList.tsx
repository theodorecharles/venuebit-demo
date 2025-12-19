import React from 'react';
import { CartItem } from '../../types/cart';
import { formatPrice } from '../../utils/formatters';

interface TicketListProps {
  items: CartItem[];
}

export const TicketList: React.FC<TicketListProps> = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-3 bg-surface-light rounded"
        >
          <div>
            <div className="font-semibold text-text-primary">
              {item.section_name}
            </div>
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
  );
};
