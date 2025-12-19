import React from 'react';
import { Section } from '../../types/event';
import { formatPrice } from '../../utils/formatters';

interface VenueSectionProps {
  section: Section;
  onClick: () => void;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ section, onClick }) => {
  const hasSeats = section.available_seats > 0;

  return (
    <button
      onClick={onClick}
      disabled={!hasSeats}
      className={`card p-4 text-left transition-all duration-200 ${
        hasSeats
          ? 'hover:bg-surface-light hover:border-primary border-2 border-transparent cursor-pointer'
          : 'opacity-50 cursor-not-allowed'
      }`}
    >
      <h3 className="font-bold text-lg mb-2">{section.name}</h3>
      <div className="space-y-1">
        <p className="text-text-secondary text-sm">
          {hasSeats ? `${section.available_seats} seats available` : 'Sold out'}
        </p>
        <p className="text-primary font-semibold">
          From {formatPrice(section.base_price)}
        </p>
      </div>
    </button>
  );
};
