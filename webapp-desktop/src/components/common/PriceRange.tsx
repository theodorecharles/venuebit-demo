import React from 'react';
import { formatPriceRange } from '../../utils/formatters';

interface PriceRangeProps {
  minPrice?: number;
  maxPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceRange: React.FC<PriceRangeProps> = ({
  minPrice,
  maxPrice: _maxPrice,
  size = 'md',
  className = '',
}) => {
  void _maxPrice; // Reserved for future use
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const priceText = minPrice !== undefined
    ? `From ${formatPriceRange(minPrice, minPrice)}`
    : 'Price TBD';

  return (
    <span className={`font-semibold text-primary-light ${sizeClasses[size]} ${className}`}>
      {priceText}
    </span>
  );
};
