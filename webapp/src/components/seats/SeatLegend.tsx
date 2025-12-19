import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="flex items-center gap-6 bg-surface p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-success rounded"></div>
        <span className="text-sm text-text-secondary">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary rounded"></div>
        <span className="text-sm text-text-secondary">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-slate-600 rounded"></div>
        <span className="text-sm text-text-secondary">Sold</span>
      </div>
    </div>
  );
};
