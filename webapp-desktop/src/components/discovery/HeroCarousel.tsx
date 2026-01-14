import React, { useState, useEffect } from 'react';
import { Event } from '../../types/event';
import { FeaturedEventCard } from './FeaturedEventCard';

interface HeroCarouselProps {
  events: Event[];
  autoPlay?: boolean;
  interval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  events,
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || events.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, events.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  if (events.length === 0) return null;

  return (
    <div className="relative">
      {/* Main carousel */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {events.map((event) => (
            <div key={event.id} className="w-full flex-shrink-0">
              <FeaturedEventCard event={event} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {events.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          >
            →
          </button>
        </>
      )}

      {/* Dots indicator */}
      {events.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-text-tertiary hover:bg-text-secondary'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
