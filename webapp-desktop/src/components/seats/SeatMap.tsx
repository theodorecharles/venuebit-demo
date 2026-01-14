import React, { useState, useEffect } from 'react';
import { eventsApi } from '../../api/events';
import { Seat } from '../../types/seat';
import { SeatGrid } from './SeatGrid';
import { SeatLegend } from './SeatLegend';
import { Loading } from '../common/Loading';
import { formatPrice } from '../../utils/formatters';

interface SeatMapProps {
  eventId: string;
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  onSeatHover?: (seat: Seat | null) => void;
}

interface SectionData {
  name: string;
  seats: Seat[];
  availableCount: number;
  minPrice: number;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  eventId,
  selectedSeats,
  onSeatSelect,
  onSeatHover,
}) => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeats();
  }, [eventId]);

  const loadSeats = async () => {
    try {
      setLoading(true);
      const seats = await eventsApi.getSeats({ eventId });

      // Group seats by section
      const sectionMap = new Map<string, Seat[]>();
      seats.forEach((seat: Seat) => {
        const sectionName = seat.section || 'General';
        if (!sectionMap.has(sectionName)) {
          sectionMap.set(sectionName, []);
        }
        sectionMap.get(sectionName)!.push(seat);
      });

      // Convert to section data
      const sectionData: SectionData[] = Array.from(sectionMap.entries()).map(([name, seatList]) => ({
        name,
        seats: seatList,
        availableCount: seatList.filter(s => s.status === 'available').length,
        minPrice: Math.min(...seatList.map(s => s.price)),
      }));

      setSections(sectionData);
    } catch (error) {
      console.error('Error loading seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (section: SectionData) => {
    setSelectedSection(section);
  };

  const handleBack = () => {
    setSelectedSection(null);
  };

  if (loading) {
    return <Loading message="Loading seat map..." />;
  }

  return (
    <div className="space-y-6">
      <SeatLegend />

      {!selectedSection ? (
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">Select a Section</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sections.map((section) => (
              <button
                key={section.name}
                onClick={() => handleSectionClick(section)}
                className="p-4 bg-theme-surface rounded-lg border border-theme hover:border-primary transition-all text-left"
              >
                <h3 className="font-semibold text-text-primary">{section.name}</h3>
                <p className="text-text-secondary text-sm mt-1">
                  {section.availableCount} seats available
                </p>
                <p className="text-primary-light font-semibold mt-2">
                  From {formatPrice(section.minPrice)}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleBack}
            className="text-primary-light hover:text-primary transition-colors flex items-center gap-2 mb-4"
          >
            ← Back to Sections
          </button>

          <h2 className="text-xl font-semibold text-text-primary mb-2">{selectedSection.name}</h2>
          <p className="text-text-secondary mb-6">
            {selectedSection.availableCount} seats available
          </p>

          <SeatGrid
            seats={selectedSection.seats}
            selectedSeats={selectedSeats}
            onSeatClick={onSeatSelect}
            onSeatHover={onSeatHover}
          />
        </div>
      )}
    </div>
  );
};
