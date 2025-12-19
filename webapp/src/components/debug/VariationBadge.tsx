import React from 'react';
import { VariationType, VARIATIONS } from '../../optimizely/features';

interface VariationBadgeProps {
  variation: VariationType;
}

export const VariationBadge: React.FC<VariationBadgeProps> = ({ variation }) => {
  const isEnhanced = variation === VARIATIONS.ENHANCED;

  return (
    <div className="flex items-center gap-2">
      <span className="text-text-secondary text-sm font-medium">Variation:</span>
      <span
        className={`px-3 py-1 rounded text-sm font-bold ${
          isEnhanced
            ? 'bg-success/20 text-success border border-success/50'
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
        }`}
      >
        {variation.toUpperCase()}
      </span>
    </div>
  );
};
