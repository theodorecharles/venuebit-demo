import React from 'react';
import { Link } from 'react-router-dom';
import { Event, categoryEmojis } from '../../types/event';
import { formatShortDate, formatTime, getFullImageUrl } from '../../utils/formatters';
import { PriceRange } from '../common/PriceRange';

interface FeaturedEventCardProps {
  event: Event;
}

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
        {/* Background Image */}
        {event.imageUrl ? (
          <img
            src={getFullImageUrl(event.imageUrl)}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center">
            <span className="text-8xl">
              {categoryEmojis[event.category] || '🎫'}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content - extra left/right padding to avoid arrow overlap */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pl-16 pr-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 rounded bg-primary text-white text-xs font-medium">
              {categoryEmojis[event.category]} {event.category}
            </span>
            {event.featured && (
              <span className="px-2 py-1 rounded bg-pink-500 text-white text-xs font-medium">
                ⭐ Featured
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 line-clamp-2">
            {event.title}
          </h2>
          <p className="text-lg text-white/90 mb-2">{event.performer}</p>
          <div className="flex items-center justify-between">
            <div className="text-white/80">
              <p>{event.venueName}</p>
              <p className="text-sm">
                {formatShortDate(event.date)} • {formatTime(event.time)}
              </p>
            </div>
            <div className="text-right">
              <PriceRange
                minPrice={event.minPrice}
                maxPrice={event.maxPrice}
                size="lg"
                className="text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
