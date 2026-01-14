import React from 'react';
import { Event } from '../../types/event';
import { EventCard } from './EventCard';

interface EventRowProps {
  title: string;
  events: Event[];
  onSeeAll?: () => void;
}

export const EventRow: React.FC<EventRowProps> = ({
  title,
  events,
  onSeeAll,
}) => {
  if (events.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-primary-light hover:text-primary transition-colors text-sm font-medium"
          >
            See All →
          </button>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {events.slice(0, 6).map((event) => (
          <div key={event.id} className="flex-shrink-0 w-64">
            <EventCard event={event} size="sm" />
          </div>
        ))}
      </div>
    </section>
  );
};
