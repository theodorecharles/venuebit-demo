import React from 'react';
import { Seat } from '../../types/seat';
import { formatPrice, formatSeatDescription } from '../../utils/formatters';
import { Card } from '../common/Card';

interface SelectedSeatsProps {
  seats: Seat[];
  onRemove: (seat: Seat) => void;
}

export const SelectedSeats: React.FC<SelectedSeatsProps> = ({ seats, onRemove }) => {
  const total = seats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Selected Seats ({seats.length})
      </h3>

      {seats.length === 0 ? (
        <p className="text-text-secondary text-sm">No seats selected</p>
      ) : (
        <div className="space-y-3">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className="flex items-center justify-between p-3 bg-theme-surface-secondary rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {formatSeatDescription(seat.section, seat.row, seat.seatNumber)}
                </p>
                <p className="text-sm text-primary-light">{formatPrice(seat.price)}</p>
              </div>
              <button
                onClick={() => onRemove(seat)}
                className="text-text-tertiary hover:text-error transition-colors"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="pt-4 border-t border-theme">
            <div className="flex justify-between text-lg">
              <span className="font-medium text-text-primary">Total</span>
              <span className="font-bold text-primary-light">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
