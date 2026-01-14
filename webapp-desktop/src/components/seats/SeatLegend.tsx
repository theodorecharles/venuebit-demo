import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-theme-surface rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-theme-surface-secondary border border-theme" />
        <span className="text-sm text-text-secondary">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-primary" />
        <span className="text-sm text-text-secondary">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-text-tertiary opacity-50" />
        <span className="text-sm text-text-secondary">Sold</span>
      </div>
    </div>
  );
};
