import React, { useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useTracking } from '../hooks/useTracking';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Order } from '../types/order';
import {
  formatDateTime,
  formatPriceDetailed,
  formatOrderStatus,
  getOrderStatusColor,
  formatSeatDescription,
} from '../utils/formatters';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const statusColor = getOrderStatusColor(order.status);

  return (
    <Card className="mb-4">
      {/* Order header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-theme">
        <div>
          <p className="text-xs text-text-tertiary">Order #{order.id.slice(0, 8)}</p>
          <p className="text-sm text-text-secondary">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <span className={`text-sm font-medium ${statusColor}`}>
            {formatOrderStatus(order.status)}
          </span>
          <p className="text-lg font-bold text-text-primary">
            {formatPriceDetailed(order.total)}
          </p>
        </div>
      </div>

      {/* Order items */}
      {order.items.map((item) => (
        <div key={item.id} className="mb-4 last:mb-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-theme-surface-secondary flex items-center justify-center text-2xl">
              🎫
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary">{item.eventTitle}</h4>
              <p className="text-sm text-text-secondary">{item.venueName}</p>
              <p className="text-sm text-text-tertiary">
                {formatDateTime(item.eventDate, item.eventTime)}
              </p>
              {/* Seats */}
              <div className="mt-2 space-y-1">
                {item.seats.map((seat) => (
                  <div
                    key={seat.id}
                    className="text-xs bg-theme-surface-secondary px-2 py-1 rounded inline-block mr-2"
                  >
                    {formatSeatDescription(seat.section, seat.row, seat.seatNumber)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Order total breakdown */}
      <div className="mt-4 pt-4 border-t border-theme space-y-1 text-sm">
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
        <div className="flex justify-between text-text-primary font-semibold pt-2 border-t border-theme">
          <span>Total</span>
          <span>{formatPriceDetailed(order.total)}</span>
        </div>
      </div>
    </Card>
  );
};

export const MyTicketsPage: React.FC = () => {
  const { orders, isLoading, error, refetch } = useOrders();
  const { trackPageView } = useTracking();

  useEffect(() => {
    trackPageView('my_tickets');
  }, [trackPageView]);

  if (isLoading) {
    return <Loading message="Loading orders..." fullPage />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
        {orders.length === 0 ? (
          <EmptyState
            icon="🎫"
            title="No tickets yet"
            description="When you purchase tickets, they'll appear here"
            action={
              <Button onClick={() => window.location.href = '/'}>
                Browse Events
              </Button>
            }
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Your Orders ({orders.length})
              </h2>
            </div>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
    </div>
  );
};
