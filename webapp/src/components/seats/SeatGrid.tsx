import React from 'react';
import { Seat as SeatComponent } from './Seat';
import { Seat as SeatType } from '../../types/seat';

interface SeatGridProps {
  seats: SeatType[];
  selectedSeats: SeatType[];
  onSeatClick: (seat: SeatType) => void;
  onSeatHover?: (seat: SeatType | null) => void;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  selectedSeats,
  onSeatClick,
  onSeatHover,
}) => {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, SeatType[]>);

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-b from-primary/30 to-transparent p-4 rounded-lg text-center mb-6">
        <div className="text-text-primary font-bold text-lg">STAGE</div>
      </div>

      {sortedRows.map((row) => (
        <div key={row} className="flex items-center gap-2">
          <div className="w-12 text-text-secondary font-semibold text-sm flex-shrink-0">
            Row {row}
          </div>
          <div className="flex flex-wrap gap-2 flex-1 justify-center">
            {seatsByRow[row].map((seat) => {
              const isSelected = selectedSeats.some((s) => s.id === seat.id);
              return (
                <SeatComponent
                  key={seat.id}
                  seat={seat}
                  isSelected={isSelected}
                  onClick={() => onSeatClick(seat)}
                  onHover={(hovering) => onSeatHover?.(hovering ? seat : null)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
