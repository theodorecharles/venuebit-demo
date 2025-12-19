import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi } from '../api/events';
import { cartApi } from '../api/cart';
import { Event } from '../types/event';
import { Seat } from '../types/seat';
import { useUserId } from '../hooks/useUserId';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { useTracking } from '../hooks/useTracking';
import { useCartStore } from '../store/cartStore';
import { formatDateTime } from '../utils/formatters';
import { DebugBanner } from '../components/debug/DebugBanner';
import { SeatMap } from '../components/seats/SeatMap';
import { SelectedSeats } from '../components/seats/SelectedSeats';
import { SeatPreview } from '../components/seats/SeatPreview';
import { SimilarSeats } from '../components/seats/SimilarSeats';
import { UrgencyBanner } from '../components/seats/UrgencyBanner';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';

export const SeatSelectionPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const userId = useUserId();
  const { isEnhanced } = useFeatureFlag();
  const { trackPageView, trackAddToCart } = useTracking();
  const { setCart } = useCartStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEvent();
      trackPageView('seat_selection', { event_id: eventId });
    }
  }, [eventId]);

  const loadEvent = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const data = await eventsApi.getEvent(eventId);
      setEvent(data);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === 'sold') return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
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
      const cart = await cartApi.createCart({
        userId: userId,
      });

      // Add seats to cart
      const updatedCart = await cartApi.addToCart(cart.id, {
        eventId: eventId,
        seatIds: selectedSeats.map((s) => s.id),
      });

      setCart(updatedCart);

      // Track add to cart event
      const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
      trackAddToCart(eventId, selectedSeats.length, total);

      // Navigate to checkout
      navigate(`/checkout?userId=${userId}&cartId=${updatedCart.id}`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add seats to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div>
        <DebugBanner />
        <div className="container mx-auto px-4 py-8">
          <Loading message="Loading event details..." />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <DebugBanner />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <p className="text-text-secondary">The requested event could not be found.</p>
        </div>
      </div>
    );
  }

  const totalSeatsAvailable = 150; // Mock value

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="pb-24">
      <DebugBanner />

      <div className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{event.performer}</h1>
          <p className="text-xl text-text-secondary mb-1">{event.venueName}</p>
          <p className="text-text-secondary">{formatDateTime(event.date, event.time)}</p>
        </div>

        {/* Enhanced variation: Urgency Banner */}
        {isEnhanced && <UrgencyBanner availableSeats={totalSeatsAvailable} />}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SeatMap
              eventId={event.id}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              onSeatHover={isEnhanced ? setHoveredSeat : undefined}
            />

            {/* Enhanced variation: Similar Seats */}
            {isEnhanced && (
              <SimilarSeats
                currentSeats={selectedSeats}
                onSeatClick={handleSeatSelect}
              />
            )}
          </div>

          <div className="hidden lg:block">
            <SelectedSeats seats={selectedSeats} onRemove={handleRemoveSeat} />
          </div>
        </div>

        {/* Enhanced variation: Seat Preview */}
        {isEnhanced && hoveredSeat && hoveredSeat.status === 'available' && (
          <SeatPreview seat={hoveredSeat} />
        )}
      </div>

      {/* Sticky Add to Cart Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-light border-t border-slate-600 px-4 py-4 z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            {selectedSeats.length > 0 && (
              <div>
                <span className="text-text-secondary text-sm">{selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected</span>
                <span className="text-white font-bold ml-2">${total.toFixed(2)}</span>
              </div>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={selectedSeats.length === 0 || addingToCart}
            className="px-8"
          >
            {addingToCart ? 'Adding to Cart...' : `Add to Cart`}
          </Button>
        </div>
      </div>
    </div>
  );
};
