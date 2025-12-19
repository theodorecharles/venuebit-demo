import React from 'react';
import { Order } from '../../types/order';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface ConfirmationProps {
  order: Order;
  onClose: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ order, onClose }) => {
  // Get first item for event details, flatten all seats
  const firstItem = order.items?.[0];
  const allSeats = order.items?.flatMap((item) => item.seats) || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/20 rounded-full mb-4">
          <svg
            className="w-12 h-12 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-2">You're going to see {firstItem?.eventTitle || 'the show'}!</h1>
        <p className="text-text-secondary text-lg">Your tickets have been confirmed</p>
      </div>

      <Card className="mb-6">
        <div className="border-b border-slate-600 pb-4 mb-4">
          <div className="text-sm text-text-secondary mb-1">Order Number</div>
          <div className="text-2xl font-bold text-primary font-mono">
            #{order.id.substring(0, 8).toUpperCase()}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{firstItem?.eventTitle}</h3>
          <p className="text-text-secondary">{firstItem?.venueName}</p>
          <p className="text-text-secondary">{formatDateTime(firstItem?.eventDate || '')}</p>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className="font-semibold">Your Tickets ({allSeats.length})</h4>
          {allSeats.map((seat) => (
            <div
              key={seat.id}
              className="flex justify-between items-center p-3 bg-surface-light rounded"
            >
              <div>
                <div className="font-semibold">{seat.section}</div>
                <div className="text-sm text-text-secondary">
                  Row {seat.row}, Seat {seat.seatNumber}
                </div>
              </div>
              <div className="font-semibold text-primary">
                {formatPrice(seat.price)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-600 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-semibold">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Service Fee</span>
            <span className="font-semibold">{formatPrice(order.serviceFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-slate-600 pt-2">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </Card>

      <div className="bg-surface-light border border-slate-600 rounded-lg p-4 mb-6">
        <p className="text-sm text-text-secondary">
          A confirmation email has been sent to your email address with your tickets and event details.
        </p>
      </div>

      <Button onClick={onClose} fullWidth variant="primary">
        Return to App
      </Button>
    </div>
  );
};
