import React, { useState, useEffect } from 'react';
import { eventsApi } from '../../api/events';
import { Section } from '../../types/event';
import { Seat } from '../../types/seat';
import { VenueSection } from './VenueSection';
import { SeatGrid } from './SeatGrid';
import { SeatLegend } from './SeatLegend';
import { Loading } from '../common/Loading';

interface SeatMapProps {
  eventId: string;
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  onSeatHover?: (seat: Seat | null) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  eventId,
  selectedSeats,
  onSeatSelect,
  onSeatHover,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);

  useEffect(() => {
    loadSections();
  }, [eventId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getSections(eventId);
      setSections(data);
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = async (section: Section) => {
    setSelectedSection(section);
    try {
      setLoadingSeats(true);
      const data = await eventsApi.getSeats({
        event_id: eventId,
        section_id: section.id,
      });
      setSeats(data);
    } catch (error) {
      console.error('Error loading seats:', error);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleBack = () => {
    setSelectedSection(null);
    setSeats([]);
  };

  if (loading) {
    return <Loading message="Loading seat map..." />;
  }

  return (
    <div className="space-y-6">
      <SeatLegend />

      {!selectedSection ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select a Section</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sections.map((section) => (
              <VenueSection
                key={section.id}
                section={section}
                onClick={() => handleSectionClick(section)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="text-primary hover:text-primary-dark transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Sections
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">{selectedSection.name}</h2>
          <p className="text-text-secondary mb-6">
            {selectedSection.available_seats} seats available
          </p>

          {loadingSeats ? (
            <Loading message="Loading seats..." />
          ) : (
            <SeatGrid
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatClick={onSeatSelect}
              onSeatHover={onSeatHover}
            />
          )}
        </div>
      )}
    </div>
  );
};
