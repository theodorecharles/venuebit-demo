import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useEvent';
import { useTracking } from '../hooks/useTracking';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { formatDateTime, formatPriceRange, getFullImageUrl } from '../utils/formatters';
import { categoryEmojis, categoryDisplayNames } from '../types/event';

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { event, isLoading, error, refetch } = useEvent(eventId);
  const { trackPageView } = useTracking();

  useEffect(() => {
    if (eventId) {
      trackPageView('event_detail', { event_id: eventId });
    }
  }, [eventId, trackPageView]);

  const handleGetTickets = () => {
    navigate(`/events/${eventId}/seats`);
  };

  if (isLoading) {
    return <Loading message="Loading event..." fullPage />;
  }

  if (error || !event) {
    return <ErrorState message={error || 'Event not found'} onRetry={refetch} />;
  }

  return (
    <div className="max-w-5xl mx-auto">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96">
          {event.imageUrl ? (
            <img
              src={getFullImageUrl(event.imageUrl)}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center">
              <span className="text-8xl">
                {categoryEmojis[event.category] || '🎫'}
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          {/* Category badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-sm font-medium">
              {categoryEmojis[event.category]} {categoryDisplayNames[event.category]}
            </span>
            {event.featured && (
              <span className="px-3 py-1.5 rounded-full bg-primary text-white text-sm font-medium">
                ⭐ Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 -mt-16 relative z-10">
          <div className="bg-theme-surface rounded-xl p-6 border border-theme">
            {/* Title and performer */}
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {event.title}
            </h1>
            <p className="text-xl text-text-secondary mb-4">{event.performer}</p>

            {/* Event details grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Left column */}
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-sm text-text-tertiary">Date & Time</p>
                    <p className="text-text-primary font-medium">
                      {formatDateTime(event.date, event.time)}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm text-text-tertiary">Venue</p>
                    <p className="text-text-primary font-medium">{event.venueName}</p>
                    <p className="text-text-secondary text-sm">
                      {event.city}, {event.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Price */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-sm text-text-tertiary">Price Range</p>
                    <p className="text-primary-light font-semibold text-lg">
                      {formatPriceRange(event.minPrice, event.maxPrice)}
                    </p>
                  </div>
                </div>

                {/* Available seats */}
                {event.availableSeats !== undefined && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎫</span>
                    <div>
                      <p className="text-sm text-text-tertiary">Available Seats</p>
                      <p className="text-text-primary font-medium">
                        {event.availableSeats} seats available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-2">
                  About This Event
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div className="flex gap-4">
              <Button size="lg" onClick={handleGetTickets} className="flex-1 md:flex-none">
                🎟️ Get Tickets
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};
