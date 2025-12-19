import React, { useState } from 'react';
import { Card } from '../common/Card';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  loading: boolean;
  isEnhanced: boolean;
}

export interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, loading, isEnhanced }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: 'John Doe',
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    email: 'john.doe@example.com',
  });

  const [showContactInfo, setShowContactInfo] = useState(!isEnhanced);
  const [showPaymentDetails, setShowPaymentDetails] = useState(!isEnhanced);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section */}
        <div>
          <div
            className={`flex items-center justify-between mb-4 ${
              isEnhanced ? 'cursor-pointer' : ''
            }`}
            onClick={() => isEnhanced && setShowContactInfo(!showContactInfo)}
          >
            <h3 className="text-lg font-semibold">Contact Information</h3>
            {isEnhanced && (
              <svg
                className={`w-5 h-5 transition-transform ${
                  showContactInfo ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>

          {showContactInfo && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="cardholderName" className="label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}
        </div>

        {/* Payment Details Section */}
        <div>
          <div
            className={`flex items-center justify-between mb-4 ${
              isEnhanced ? 'cursor-pointer' : ''
            }`}
            onClick={() => isEnhanced && setShowPaymentDetails(!showPaymentDetails)}
          >
            <h3 className="text-lg font-semibold">Payment Details</h3>
            {isEnhanced && (
              <svg
                className={`w-5 h-5 transition-transform ${
                  showPaymentDetails ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>

          {showPaymentDetails && (
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="label">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                />
                <p className="text-xs text-text-secondary mt-1">
                  Test card: 4242 4242 4242 4242
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="label">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label htmlFor="cvv" className="label">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-lg py-3"
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>

        <p className="text-xs text-text-secondary text-center">
          By completing this purchase, you agree to the terms and conditions.
        </p>
      </form>
    </Card>
  );
};
