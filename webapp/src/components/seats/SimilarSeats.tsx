import React from 'react';
import { Seat } from '../../types/seat';
import { formatPrice } from '../../utils/formatters';
import { Card } from '../common/Card';

interface SimilarSeatsProps {
  currentSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export const SimilarSeats: React.FC<SimilarSeatsProps> = ({ currentSeats, onSeatClick }) => {
  // Generate simulated similar seats based on current selection
  const generateSimilarSeats = (): Array<{ seat: Seat; reason: string; savings?: number }> => {
    if (currentSeats.length === 0) return [];

    const avgPrice = currentSeats.reduce((sum, s) => sum + s.price, 0) / currentSeats.length;

    return [
      {
        seat: {
          id: 'sim-1',
          seat_number: '15',
          row: 'C',
          section_id: 'section-2',
          section_name: 'Orchestra Center',
          price: avgPrice - 20,
          status: 'available' as const,
        },
        reason: 'Similar view, better price',
        savings: 20,
      },
      {
        seat: {
          id: 'sim-2',
          seat_number: '8',
          row: 'B',
          section_id: 'section-2',
          section_name: 'Orchestra Center',
          price: avgPrice + 15,
          status: 'available' as const,
        },
        reason: 'Better view, premium location',
      },
      {
        seat: {
          id: 'sim-3',
          seat_number: '12',
          row: 'D',
          section_id: 'section-3',
          section_name: 'Mezzanine',
          price: avgPrice - 10,
          status: 'available' as const,
        },
        reason: 'Great value alternative',
        savings: 10,
      },
    ];
  };

  const similarSeats = generateSimilarSeats();

  if (similarSeats.length === 0) return null;

  return (
    <Card className="mt-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        You might also like
      </h3>

      <div className="grid gap-4">
        {similarSeats.map((item) => (
          <button
            key={item.seat.id}
            onClick={() => onSeatClick(item.seat)}
            className="text-left p-4 bg-surface-light rounded-lg hover:bg-slate-600 transition-all duration-200 border-2 border-transparent hover:border-primary"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-semibold text-text-primary mb-1">
                  {item.seat.section_name}
                </div>
                <div className="text-sm text-text-secondary mb-2">
                  Row {item.seat.row}, Seat {item.seat.seat_number}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded">
                    {item.reason}
                  </span>
                  {item.savings && (
                    <span className="text-xs text-success bg-success/20 px-2 py-1 rounded font-semibold">
                      Save ${item.savings}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-primary font-bold text-lg">
                  {formatPrice(item.seat.price)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
