import React, { useState, useEffect } from 'react';

interface CountdownBannerProps {
  initialMinutes?: number;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ initialMinutes = 10 }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const urgencyColor = timeLeft < 120 ? 'bg-error' : timeLeft < 300 ? 'bg-warning' : 'bg-primary';

  return (
    <div className={`${urgencyColor} text-white p-4 rounded-lg mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="font-semibold">Complete your purchase</p>
            <p className="text-sm opacity-90">Your seats are reserved for a limited time</p>
          </div>
        </div>
        <div className="text-2xl font-mono font-bold">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};
