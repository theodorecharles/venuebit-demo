import React from 'react';
import { Seat as SeatType } from '../../types/seat';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: () => void;
  onHover?: (hovering: boolean) => void;
}

export const Seat: React.FC<SeatProps> = ({
  seat,
  isSelected,
  onClick,
  onHover,
}) => {
  const isSold = seat.status === 'sold';

  const baseClasses = 'w-8 h-8 rounded text-xs font-medium flex items-center justify-center transition-all';

  let stateClasses = '';
  if (isSold) {
    stateClasses = 'bg-text-tertiary/50 text-text-tertiary cursor-not-allowed';
  } else if (isSelected) {
    stateClasses = 'bg-primary text-white shadow-lg scale-110';
  } else {
    stateClasses = 'bg-theme-surface-secondary hover:bg-primary/50 text-text-secondary hover:text-text-primary cursor-pointer';
  }

  return (
    <button
      className={`${baseClasses} ${stateClasses}`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      disabled={isSold}
      title={`Row ${seat.row}, Seat ${seat.seatNumber} - $${seat.price}`}
    >
      {seat.seatNumber}
    </button>
  );
};
