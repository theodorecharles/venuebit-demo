import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useEvent';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import { useTracking } from '../hooks/useTracking';
import { useUserStore } from '../store/userStore';
import { useCartStore } from '../store/cartStore';
import { cartApi } from '../api/cart';
import { Seat } from '../types/seat';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { SeatMap } from '../components/seats/SeatMap';
import { SelectedSeats } from '../components/seats/SelectedSeats';
import { UrgencyBanner } from '../components/seats/UrgencyBanner';
import { formatDateTime, formatPrice } from '../utils/formatters';

export const SeatSelectionPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  const { setCart } = useCartStore();
  const { event, isLoading, error, refetch } = useEvent(eventId);
  const { showUrgencyBanner } = useFeatureFlags();
  const { trackPageView, trackAddToCart } = useTracking();

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (eventId) {
      trackPageView('seat_selection', { event_id: eventId });
    }
  }, [eventId, trackPageView]);

  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === 'sold') return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  const handleRemoveSeat = (seat: Seat) => {
    setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
  };

  const handleAddToCart = async () => {
    if (!eventId || !userId || selectedSeats.length === 0) return;

    try {
      setAddingToCart(true);

      // Create cart
      const cart = await cartApi.createCart({ userId });

      // Add seats to cart
      const updatedCart = await cartApi.addToCart(cart.id, {
        eventId,
        seatIds: selectedSeats.map((s) => s.id),
      });

      setCart(updatedCart);

      // Track add to cart
      const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
      trackAddToCart(eventId, selectedSeats.length, total);

      // Navigate to checkout
      navigate(`/checkout?cartId=${updatedCart.id}`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add seats to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading event..." fullPage />;
  }

  if (error || !event) {
    return <ErrorState message={error || 'Event not found'} onRetry={refetch} />;
  }

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="pb-24">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Event Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">{event.title}</h1>
          <p className="text-text-secondary">{event.performer}</p>
          <p className="text-text-tertiary">
            {event.venueName} • {formatDateTime(event.date, event.time)}
          </p>
        </div>

        {/* Urgency Banner */}
        {showUrgencyBanner && event.availableSeats && (
          <UrgencyBanner availableSeats={event.availableSeats} />
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SeatMap
              eventId={event.id}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          <div className="hidden lg:block">
            <SelectedSeats seats={selectedSeats} onRemove={handleRemoveSeat} />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-theme-surface border-t border-theme p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            {selectedSeats.length > 0 ? (
              <div>
                <span className="text-text-secondary">
                  {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                </span>
                <span className="text-text-primary font-bold ml-2">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            ) : (
              <span className="text-text-tertiary">Select seats to continue</span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={selectedSeats.length === 0 || addingToCart}
            size="lg"
          >
            {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};
