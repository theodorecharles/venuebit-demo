import React from 'react';
import { formatPrice } from '../../utils/formatters';

interface PriceDisplayProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <span className={`font-bold text-primary ${sizeClasses[size]} ${className}`}>
      {formatPrice(price)}
    </span>
  );
};
