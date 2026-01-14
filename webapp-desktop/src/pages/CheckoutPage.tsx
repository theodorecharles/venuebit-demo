import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { ordersApi } from '../api/orders';
import { Cart } from '../types/cart';
import { useUserStore } from '../store/userStore';
import { useCartStore } from '../store/cartStore';
import { useAppStore } from '../store/appStore';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import { useTracking } from '../hooks/useTracking';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PriceBreakdown } from '../components/checkout/PriceBreakdown';
import { PaymentForm, PaymentFormData } from '../components/checkout/PaymentForm';
import { CountdownBanner } from '../components/checkout/CountdownBanner';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  const { clearCart } = useCartStore();
  const addOrder = useAppStore((state) => state.addOrder);
  const { showUrgencyBanner } = useFeatureFlags();
  const { trackPageView, trackCheckout, trackPurchase } = useTracking();

  const cartId = searchParams.get('cartId');

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartId) {
      loadCart();
      trackPageView('checkout', { cart_id: cartId });
    } else {
      setLoading(false);
      setError('No cart ID provided');
    }
  }, [cartId]);

  const loadCart = async () => {
    if (!cartId) return;

    try {
      setLoading(true);
      setError(null);
      const cartData = await cartApi.getCart(cartId);
      setCart(cartData);

      // Track checkout view
      const subtotal = cartData.items.reduce((sum, item) => sum + item.subtotal, 0);
      trackCheckout(cartId, subtotal);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrices = (cart: Cart) => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    const serviceFee = subtotal * 0.15;
    const processingFee = 5;
    const total = subtotal + serviceFee + processingFee;
    return { subtotal, serviceFee, processingFee, total };
  };

  const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
    if (!cartId || !userId || !cart) return;

    try {
      setProcessing(true);

      const cardLast4 = paymentData.cardNumber.replace(/\s/g, '').slice(-4);

      const order = await ordersApi.checkout({
        cartId,
        userId,
        payment: {
          cardLast4,
          cardholderName: paymentData.cardholderName,
        },
      });

      // Track purchase
      trackPurchase(order.id, order.total);

      // Store order locally
      addOrder(order);

      // Clear cart
      clearCart();

      // Navigate to confirmation
      navigate(`/confirmation/${order.id}`);
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loading message="Loading checkout..." fullPage />;
  }

  if (error || !cart) {
    return (
      <ErrorState
        message={error || 'Cart not found'}
        onRetry={cartId ? loadCart : undefined}
      />
    );
  }

  if (cart.items.length === 0) {
    return <ErrorState message="Your cart is empty" />;
  }

  const prices = calculatePrices(cart);

  return (
    <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Complete Your Purchase</h1>

        {/* Countdown Banner for urgency */}
        {showUrgencyBanner && <CountdownBanner />}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order and Payment */}
          <div className="lg:col-span-2 space-y-6">
            <OrderSummary cart={cart} />
            <div className="bg-theme-surface rounded-lg p-6 border border-theme">
              <PaymentForm onSubmit={handlePaymentSubmit} loading={processing} />
            </div>
          </div>

          {/* Right Column - Price Breakdown */}
          <div>
            <div className="sticky top-6">
              <PriceBreakdown
                subtotal={prices.subtotal}
                serviceFee={prices.serviceFee}
                processingFee={prices.processingFee}
                total={prices.total}
              />
            </div>
          </div>
        </div>
    </div>
  );
};
