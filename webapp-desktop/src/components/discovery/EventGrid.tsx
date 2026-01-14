import React from 'react';
import { Event } from '../../types/event';
import { EventCard } from './EventCard';

interface EventGridProps {
  events: Event[];
  columns?: 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  columns = 4,
  size = 'md',
}) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} size={size} />
      ))}
    </div>
  );
};
