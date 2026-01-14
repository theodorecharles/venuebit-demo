import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import { Order } from '../types/order';
import { useTracking } from '../hooks/useTracking';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  formatDateTime,
  formatPriceDetailed,
  formatSeatDescription,
} from '../utils/formatters';

export const ConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { trackPageView } = useTracking();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
      trackPageView('confirmation', { order_id: orderId });
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await ordersApi.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading order..." fullPage />;
  }

  if (error || !order) {
    return <ErrorState message={error || 'Order not found'} onRetry={loadOrder} />;
  }

  const firstItem = order.items?.[0];

  return (
    <div className="p-6 max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            You're going to see {firstItem?.eventTitle || 'the show'}!
          </h1>
          <p className="text-text-secondary">Your tickets have been confirmed</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-theme">
            <div>
              <p className="text-sm text-text-tertiary">Order Number</p>
              <p className="font-mono text-text-primary">{order.id.slice(0, 12)}...</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-tertiary">Order Date</p>
              <p className="text-text-primary">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tickets */}
          {order.items.map((item) => (
            <div key={item.id} className="mb-6 last:mb-0">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center text-3xl">
                  🎫
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {item.eventTitle}
                  </h3>
                  <p className="text-text-secondary">{item.venueName}</p>
                  <p className="text-text-tertiary">
                    {formatDateTime(item.eventDate, item.eventTime)}
                  </p>
                </div>
              </div>

              {/* Seat details */}
              <div className="bg-theme-surface-secondary rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-secondary mb-3">Your Seats</h4>
                <div className="grid gap-2">
                  {item.seats.map((seat) => (
                    <div
                      key={seat.id}
                      className="flex items-center justify-between p-3 bg-theme-surface rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💺</span>
                        <span className="font-medium text-text-primary">
                          {formatSeatDescription(seat.section, seat.row, seat.seatNumber)}
                        </span>
                      </div>
                      <span className="text-primary-light font-medium">
                        {formatPriceDetailed(seat.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Price Summary */}
          <div className="mt-6 pt-4 border-t border-theme space-y-2">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatPriceDetailed(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Service Fee</span>
              <span>{formatPriceDetailed(order.serviceFee)}</span>
            </div>
            {order.processingFee && (
              <div className="flex justify-between text-text-secondary">
                <span>Processing Fee</span>
                <span>{formatPriceDetailed(order.processingFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg pt-2 border-t border-theme">
              <span className="font-semibold text-text-primary">Total Paid</span>
              <span className="font-bold text-primary-light">
                {formatPriceDetailed(order.total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => navigate('/tickets')} fullWidth>
            View My Tickets
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} fullWidth>
            Continue Browsing
          </Button>
        </div>

        {/* Note */}
        <p className="text-center text-text-tertiary text-sm mt-6">
          A confirmation email has been sent to your registered email address
        </p>
    </div>
  );
};
