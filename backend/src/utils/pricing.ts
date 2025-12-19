export interface PricingBreakdown {
  subtotal: number;
  serviceFee: number;
  processingFee: number;
  total: number;
}

const SERVICE_FEE_PERCENTAGE = 0.15;
const PROCESSING_FEE = 5.00;

export function calculatePricing(subtotal: number): PricingBreakdown {
  const serviceFee = Math.round(subtotal * SERVICE_FEE_PERCENTAGE * 100) / 100;
  const processingFee = PROCESSING_FEE;
  const total = Math.round((subtotal + serviceFee + processingFee) * 100) / 100;

  return {
    subtotal,
    serviceFee,
    processingFee,
    total
  };
}
