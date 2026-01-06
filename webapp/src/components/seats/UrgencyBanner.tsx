import React, { useState, useEffect } from 'react';

interface UrgencyBannerProps {
  availableSeats: number;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({ availableSeats }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show after a short delay for dramatic effect
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Only show urgency banner when seats are limited
  const seatsLeft = Math.min(availableSeats, Math.floor(Math.random() * 15) + 5); // Simulate 5-20 seats left
  const isUrgent = seatsLeft < 15;

  if (!isUrgent || !show) return null;

  return (
    <div className="animate-in slide-in-from-top-2 duration-500">
      <div className="bg-gradient-to-r from-warning/20 to-error/20 border-2 border-warning rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-warning animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-warning">
              Popular event - seats are selling fast
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
