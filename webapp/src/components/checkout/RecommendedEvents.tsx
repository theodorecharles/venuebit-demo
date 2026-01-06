import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../../api/events';
import { Event } from '../../types/event';
import { formatPrice } from '../../utils/formatters';
import { Card } from '../common/Card';

// Fix image URLs - backend is on port 4001, not 4000
const getImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  // Fix incorrect port if present
  if (url.includes('localhost:4000')) {
    return url.replace('localhost:4000', 'localhost:4001');
  }
  // If it's a relative path, make it absolute to the API
  if (url.startsWith('/images/')) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://localhost:4001${url}`;
    }
    return url;
  }
  return url;
};

interface RecommendedEventsProps {
  purchasedEventId: string;
  artistName: string;
}

export const RecommendedEvents: React.FC<RecommendedEventsProps> = ({
  purchasedEventId,
  artistName,
}) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEventClick = (eventId: string) => {
    navigate(`/seats/${eventId}`);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const allEvents = await eventsApi.getEvents();

        // Get the purchased event to find its category
        const purchasedEvent = allEvents.find(e => e.id === purchasedEventId);
        const category = purchasedEvent?.category || 'concerts';

        // Filter to same category, exclude purchased event, take up to 3
        const similar = allEvents
          .filter(e => e.category === category && e.id !== purchasedEventId)
          .slice(0, 3);

        setRecommendations(similar);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [purchasedEventId]);

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: 'var(--color-text-primary, #f1f5f9)'
      }}>
        You might also like:
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recommendations.map((event) => (
          <Card
            key={event.id}
            className="p-4"
            onClick={() => handleEventClick(event.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {event.imageUrl && (
                <img
                  src={getImageUrl(event.imageUrl)}
                  alt={event.title}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  color: 'var(--color-text-primary, #f1f5f9)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {event.title}
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary, #94a3b8)',
                  marginBottom: '4px',
                }}>
                  {event.venueName}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary, #94a3b8)',
                }}>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {event.minPrice && (
                <div style={{
                  textAlign: 'right',
                  flexShrink: 0,
                }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary, #94a3b8)',
                  }}>
                    From
                  </p>
                  <p style={{
                    fontWeight: 'bold',
                    color: 'var(--color-primary, #6366f1)',
                  }}>
                    {formatPrice(event.minPrice)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
