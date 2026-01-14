import React from 'react';
import { formatPriceDetailed } from '../../utils/formatters';
import { Card } from '../common/Card';

interface PriceBreakdownProps {
  subtotal: number;
  serviceFee: number;
  processingFee?: number;
  total: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  subtotal,
  serviceFee,
  processingFee = 5,
  total,
}) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Price Details</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span>{formatPriceDetailed(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Service Fee (15%)</span>
          <span>{formatPriceDetailed(serviceFee)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Processing Fee</span>
          <span>{formatPriceDetailed(processingFee)}</span>
        </div>
        <div className="pt-3 border-t border-theme">
          <div className="flex justify-between text-lg">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="font-bold text-primary-light">{formatPriceDetailed(total)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
