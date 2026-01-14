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
    <div className="space-y-1">
      <div className="bg-gradient-to-b from-primary/30 to-transparent p-3 rounded-lg text-center mb-4">
        <div className="text-text-primary font-bold text-sm">STAGE</div>
      </div>

      {sortedRows.map((row) => (
        <div key={row} className="flex items-center gap-1">
          <div className="w-16 text-text-secondary font-semibold text-xs flex-shrink-0">
            Row {row}
          </div>
          <div className="flex gap-1 flex-wrap">
            {seatsByRow[row]
              .sort((a, b) => a.seatNumber - b.seatNumber)
              .slice(0, 12)
              .map((seat) => {
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
