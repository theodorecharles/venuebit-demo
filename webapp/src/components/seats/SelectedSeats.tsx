import React from 'react';
import { Seat } from '../../types/seat';
import { formatPrice } from '../../utils/formatters';
import { Card } from '../common/Card';

interface SelectedSeatsProps {
  seats: Seat[];
  onRemove: (seat: Seat) => void;
}

export const SelectedSeats: React.FC<SelectedSeatsProps> = ({ seats, onRemove }) => {
  const total = seats.reduce((sum, seat) => sum + seat.price, 0);

  if (seats.length === 0) {
    return (
      <Card className="sticky top-24">
        <h3 className="text-lg font-bold mb-4">Selected Seats</h3>
        <p className="text-text-secondary text-center py-8">
          No seats selected yet. Click on available seats to add them.
        </p>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24">
      <h3 className="text-lg font-bold mb-4">
        Selected Seats ({seats.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className="flex items-start justify-between gap-3 p-3 bg-surface-light rounded"
          >
            <div className="flex-1">
              <div className="font-semibold text-text-primary">
                {seat.section_name}
              </div>
              <div className="text-sm text-text-secondary">
                Row {seat.row}, Seat {seat.seat_number}
              </div>
              <div className="text-primary font-semibold mt-1">
                {formatPrice(seat.price)}
              </div>
            </div>
            <button
              onClick={() => onRemove(seat)}
              className="text-error hover:text-red-600 transition-colors p-1"
              title="Remove seat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-semibold text-lg">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-text-secondary">
          Service fees will be added at checkout
        </p>
      </div>
    </Card>
  );
};
