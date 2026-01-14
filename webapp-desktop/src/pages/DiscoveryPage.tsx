import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import { useTracking } from '../hooks/useTracking';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { HeroCarousel } from '../components/discovery/HeroCarousel';
import { CategoryPills } from '../components/discovery/CategoryPills';
import { EventRow } from '../components/discovery/EventRow';
import { EventGrid } from '../components/discovery/EventGrid';
import { HomescreenModule } from '../types/homescreen';
import { Event, EventCategory } from '../types/event';

export const DiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { events, isLoading, error, refetch } = useEvents();
  const { homescreenModules, refresh: refreshFeatures } = useFeatureFlags();
  const { trackPageView } = useTracking();

  useEffect(() => {
    trackPageView('discovery');
  }, [trackPageView]);

  const handleRefresh = async () => {
    await Promise.all([refetch(), refreshFeatures()]);
  };

  // Process events for each module
  const getEventsForModule = useCallback((module: HomescreenModule): Event[] => {
    let filteredEvents = [...events];

    // Filter by categories if specified
    if (module.config.categories && module.config.categories.length > 0) {
      filteredEvents = filteredEvents.filter((e) =>
        module.config.categories!.includes(e.category as EventCategory)
      );
    }

    // Sort
    switch (module.config.sortBy) {
      case 'date_asc':
        filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'date_desc':
        filteredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'alphabetical_asc':
        filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'trending_desc':
        // Simulate trending by featured first, then available seats
        filteredEvents.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.availableSeats || 0) - (a.availableSeats || 0);
        });
        break;
    }

    // Limit
    if (module.config.length) {
      filteredEvents = filteredEvents.slice(0, module.config.length);
    }

    return filteredEvents;
  }, [events]);

  // Render a single module based on its type
  const renderModule = (module: HomescreenModule, index: number) => {
    const moduleEvents = getEventsForModule(module);

    switch (module.module) {
      case 'hero_carousel': {
        const heroEvents = moduleEvents.filter((e) => e.featured);
        if (heroEvents.length === 0) return null;
        return (
          <section key={`${module.module}-${index}`}>
            <HeroCarousel events={heroEvents} />
          </section>
        );
      }

      case 'categories':
        return (
          <section key={`${module.module}-${index}`}>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Categories</h2>
            <CategoryPills categories={module.config.categories} linkToSearch />
          </section>
        );

      case 'trending_now': {
        if (moduleEvents.length === 0) return null;
        return (
          <EventRow
            key={`${module.module}-${index}`}
            title="Trending Now"
            events={moduleEvents}
            onSeeAll={() => navigate('/search')}
          />
        );
      }

      case 'this_weekend': {
        if (moduleEvents.length === 0) return null;
        return (
          <EventRow
            key={`${module.module}-${index}`}
            title="This Weekend"
            events={moduleEvents}
            onSeeAll={() => navigate('/search')}
          />
        );
      }

      case 'all_events': {
        if (moduleEvents.length === 0) return null;
        return (
          <section key={`${module.module}-${index}`}>
            <h2 className="text-xl font-semibold text-text-primary mb-4">All Events</h2>
            <EventGrid events={moduleEvents} />
          </section>
        );
      }

      default:
        return null;
    }
  };

  if (isLoading) {
    return <Loading message="Loading events..." fullPage />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {homescreenModules.map((module, index) => renderModule(module, index))}
    </div>
  );
};
