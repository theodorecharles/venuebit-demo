import React from 'react';
import { formatPrice } from '../../utils/formatters';
import { Card } from '../common/Card';

interface PriceBreakdownProps {
  subtotal: number;
  serviceFee: number;
  total: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  subtotal,
  serviceFee,
  total,
}) => {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Price Breakdown</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Service Fee</span>
          <span className="font-semibold">{formatPrice(serviceFee)}</span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
