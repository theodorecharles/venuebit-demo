import React from 'react';
import { Link } from 'react-router-dom';
import { Event, categoryEmojis } from '../../types/event';
import { formatShortDate, formatTime, getFullImageUrl } from '../../utils/formatters';
import { PriceRange } from '../common/PriceRange';

interface EventCardProps {
  event: Event;
  size?: 'sm' | 'md' | 'lg';
}

export const EventCard: React.FC<EventCardProps> = ({ event, size = 'md' }) => {
  const imageHeight = size === 'sm' ? 'h-32' : size === 'lg' ? 'h-56' : 'h-44';

  return (
    <Link
      to={`/events/${event.id}`}
      className="block group"
    >
      <div className="bg-theme-surface rounded-lg overflow-hidden border border-theme hover:border-primary transition-all duration-200">
        {/* Image */}
        <div className={`${imageHeight} relative overflow-hidden`}>
          {event.imageUrl ? (
            <img
              src={getFullImageUrl(event.imageUrl)}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-theme-surface-secondary flex items-center justify-center">
              <span className="text-4xl">
                {categoryEmojis[event.category] || '🎫'}
              </span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium">
            {categoryEmojis[event.category]} {event.category}
          </div>
          {/* Featured badge */}
          {event.featured && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded bg-primary text-white text-xs font-medium">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-text-primary line-clamp-2 group-hover:text-primary-light transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-text-secondary mt-1 line-clamp-1">
            {event.performer}
          </p>
          <p className="text-sm text-text-tertiary mt-1">
            {event.venueName} • {event.city}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-text-secondary">
              {formatShortDate(event.date)} • {formatTime(event.time)}
            </span>
            <PriceRange minPrice={event.minPrice} maxPrice={event.maxPrice} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
};
