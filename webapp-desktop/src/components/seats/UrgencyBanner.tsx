import React from 'react';

interface UrgencyBannerProps {
  availableSeats: number;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({ availableSeats }) => {
  if (availableSeats > 50) return null;

  const urgencyLevel = availableSeats <= 10 ? 'high' : availableSeats <= 25 ? 'medium' : 'low';

  const colors = {
    high: 'bg-error/20 border-error text-error',
    medium: 'bg-warning/20 border-warning text-warning',
    low: 'bg-primary/20 border-primary text-primary-light',
  };

  return (
    <div className={`p-4 rounded-lg border mb-6 ${colors[urgencyLevel]}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="font-semibold">
            {urgencyLevel === 'high'
              ? 'Almost sold out!'
              : urgencyLevel === 'medium'
              ? 'Selling fast!'
              : 'Limited availability'}
          </p>
          <p className="text-sm opacity-80">
            Only {availableSeats} seats remaining at this price
          </p>
        </div>
      </div>
    </div>
  );
};
