import React, { useState } from 'react';
import { Button } from '../common/Button';

export interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  loading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: 'John Doe',
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/28',
    cvv: '123',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid =
    formData.cardholderName.length > 0 &&
    formData.cardNumber.replace(/\s/g, '').length >= 15 &&
    formData.expiryDate.length === 5 &&
    formData.cvv.length >= 3;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Details</h3>

      <div>
        <label className="label">Cardholder Name</label>
        <input
          type="text"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleChange}
          placeholder="John Doe"
          className="input"
          required
        />
      </div>

      <div>
        <label className="label">Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          className="input font-mono"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Expiry Date</label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">CVV</label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            className="input"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={!isValid || loading}
      >
        {loading ? 'Processing...' : '🔒 Complete Purchase'}
      </Button>

      <p className="text-xs text-text-tertiary text-center">
        Your payment information is securely processed
      </p>
    </form>
  );
};
