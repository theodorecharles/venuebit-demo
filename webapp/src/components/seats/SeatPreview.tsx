import React from 'react';
import { Seat } from '../../types/seat';
import { formatPrice } from '../../utils/formatters';

interface SeatPreviewProps {
  seat: Seat;
}

export const SeatPreview: React.FC<SeatPreviewProps> = ({ seat }) => {
  // Simulated view rating (in a real app, this would come from the API)
  const viewRating = Math.floor(Math.random() * 2) + 8; // 8-9 out of 10

  return (
    <div className="fixed bottom-24 right-8 z-40 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-surface border-2 border-primary rounded-lg shadow-2xl p-4">
        <div className="mb-3">
          <h4 className="text-lg font-bold text-text-primary">View Preview</h4>
          <p className="text-sm text-text-secondary">
            {seat.section_name} - Row {seat.row}, Seat {seat.seat_number}
          </p>
        </div>

        {/* Simulated seat view image */}
        <div className="relative bg-surface-light rounded-lg overflow-hidden mb-3">
          <div className="aspect-video flex items-center justify-center">
            <div className="text-center">
              {/* Simulated stage view */}
              <div className="w-32 h-12 bg-primary/30 rounded-lg mb-4 mx-auto flex items-center justify-center">
                <span className="text-xs font-bold text-primary">STAGE</span>
              </div>
              <p className="text-xs text-text-secondary">Simulated view from this seat</p>
            </div>
          </div>

          {/* View rating badge */}
          <div className="absolute top-2 right-2 bg-success text-text-primary px-2 py-1 rounded text-xs font-bold">
            {viewRating}/10 View
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Price:</span>
          <span className="text-primary font-bold text-lg">{formatPrice(seat.price)}</span>
        </div>
      </div>
    </div>
  );
};
