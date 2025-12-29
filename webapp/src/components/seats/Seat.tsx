import React from 'react';
import { Seat as SeatType } from '../../types/seat';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: () => void;
  onHover?: (hovering: boolean) => void;
}

export const Seat: React.FC<SeatProps> = ({ seat, isSelected, onClick, onHover }) => {
  const isSold = seat.status === 'sold';

  const getColorClasses = () => {
    if (isSold) {
      return 'bg-surface-light cursor-not-allowed opacity-50';
    }
    if (isSelected) {
      return 'bg-primary hover:bg-primary-dark cursor-pointer';
    }
    return 'bg-success hover:bg-emerald-600 cursor-pointer';
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      disabled={isSold}
      className={`w-7 h-7 rounded transition-all duration-200 ${getColorClasses()} flex items-center justify-center text-[10px] font-semibold text-text-primary`}
      title={`Seat ${seat.seatNumber} - Row ${seat.row} - $${seat.price}`}
    >
      {seat.seatNumber}
    </button>
  );
};
