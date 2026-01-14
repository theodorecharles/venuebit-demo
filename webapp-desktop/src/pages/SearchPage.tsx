import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useEvents } from '../hooks/useEvents';
import { useTracking } from '../hooks/useTracking';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { CategoryPills } from '../components/discovery/CategoryPills';
import { EventGrid } from '../components/discovery/EventGrid';
import { EventCategory } from '../types/event';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') as EventCategory | null;

  const { query, setQuery, results, isSearching, hasSearched } = useSearch();
  const { events, isLoading: eventsLoading } = useEvents();
  const { trackPageView, trackSearch } = useTracking();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(initialCategory);

  useEffect(() => {
    trackPageView('search');
  }, [trackPageView]);

  // Track search when results come in
  useEffect(() => {
    if (hasSearched && query) {
      trackSearch(query, results.length);
    }
  }, [hasSearched, query, results.length, trackSearch]);

  // Update URL when category changes
  const handleCategoryChange = (category: EventCategory | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // Filter results by category
  const filteredResults = selectedCategory
    ? (hasSearched ? results : events).filter((e) => e.category === selectedCategory)
    : hasSearched ? results : events;

  const displayEvents = hasSearched ? filteredResults : filteredResults;
  const showLoading = isSearching || (eventsLoading && !hasSearched);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, artists, venues..."
            className="input text-lg py-3 pl-12"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category filters */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">Filter by category</h3>
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelect={handleCategoryChange}
          />
        </div>

        {/* Results */}
        {showLoading ? (
          <Loading message={isSearching ? 'Searching...' : 'Loading events...'} />
        ) : displayEvents.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={hasSearched ? 'No results found' : 'No events available'}
            description={
              hasSearched
                ? `We couldn't find any events matching "${query}"${
                    selectedCategory ? ` in ${selectedCategory}` : ''
                  }`
                : 'Check back later for new events'
            }
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-secondary">
                {hasSearched ? (
                  <>
                    Found <span className="text-text-primary font-medium">{displayEvents.length}</span>{' '}
                    {displayEvents.length === 1 ? 'result' : 'results'}
                    {query && (
                      <>
                        {' '}for "<span className="text-text-primary">{query}</span>"
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Showing <span className="text-text-primary font-medium">{displayEvents.length}</span>{' '}
                    events
                    {selectedCategory && (
                      <> in <span className="text-text-primary">{selectedCategory}</span></>
                    )}
                  </>
                )}
              </p>
            </div>
            <EventGrid events={displayEvents} />
          </div>
        )}
    </div>
  );
};
