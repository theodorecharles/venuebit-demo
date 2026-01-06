import React, { useState, useEffect } from 'react';

interface CountdownTimerBannerProps {
  initialSeconds?: number;
  onExpire?: () => void;
}

export const CountdownTimerBanner: React.FC<CountdownTimerBannerProps> = ({
  initialSeconds = 120,
  onExpire,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const isUrgent = secondsLeft <= 30;

  return (
    <div
      style={{
        backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
        border: `2px solid ${isUrgent ? '#EF4444' : '#F59E0B'}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg
          style={{
            width: '24px',
            height: '24px',
            flexShrink: 0,
            color: isUrgent ? '#EF4444' : '#F59E0B'
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div style={{ flex: 1 }}>
          <p style={{
            fontWeight: 'bold',
            color: isUrgent ? '#EF4444' : '#F59E0B',
            margin: 0
          }}>
            Complete checkout in{' '}
            <span style={{ fontFamily: 'monospace', fontSize: '1.125rem' }}>{timeDisplay}</span>
            {' '}to keep these seats
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#9CA3AF',
            marginTop: '4px',
            marginBottom: 0
          }}>
            These seats are being held for you. Don't miss out!
          </p>
        </div>
      </div>
    </div>
  );
};
