import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { checkoutApi } from '../api/checkout';
import { Cart } from '../types/cart';
import { useUserId } from '../hooks/useUserId';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { useTracking } from '../hooks/useTracking';
import { DebugBanner } from '../components/debug/DebugBanner';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PriceBreakdown } from '../components/checkout/PriceBreakdown';
import { PaymentForm, PaymentFormData } from '../components/checkout/PaymentForm';
import { Loading } from '../components/common/Loading';
import { CountdownTimerBanner } from '../components/checkout/CountdownTimerBanner';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = useUserId();
  const { isEnhanced } = useFeatureFlag();
  const { trackPageView, trackCheckout, trackPurchase } = useTracking();

  const cartId = searchParams.get('cartId');

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (cartId) {
      loadCheckoutData();
      trackPageView('checkout', { cart_id: cartId });
    }
  }, [cartId]);

  const loadCheckoutData = async () => {
    if (!cartId) return;

    try {
      setLoading(true);
      const cartData = await cartApi.getCart(cartId);
      setCart(cartData);

      // Track checkout view
      const total = calculateTotal(cartData);
      trackCheckout(cartId, total);
    } catch (error) {
      console.error('Error loading checkout data:', error);
      alert('Failed to load cart. Please try again.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = (cart: Cart): number => {
    return cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateServiceFee = (subtotal: number): number => {
    return subtotal * 0.15; // 15% service fee
  };

  const calculateTotal = (cart: Cart): number => {
    const subtotal = calculateSubtotal(cart);
    const serviceFee = calculateServiceFee(subtotal);
    return subtotal + serviceFee;
  };

  const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
    if (!cartId || !userId) return;

    try {
      setProcessing(true);

      // Extract last 4 digits from card number
      const cardLast4 = paymentData.cardNumber.replace(/\s/g, '').slice(-4);

      // Process checkout
      const order = await checkoutApi.checkout({
        cartId: cartId,
        userId: userId,
        payment: {
          cardLast4,
          cardholderName: paymentData.cardholderName,
        },
      });

      // Track purchase
      trackPurchase(order.id, order.total);

      // Navigate to confirmation
      navigate(`/confirmation/${order.id}?userId=${userId}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div>
        <DebugBanner />
        <div className="container mx-auto px-4 py-8">
          <Loading message="Loading checkout..." />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <DebugBanner />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Cart not found</h1>
          <p className="text-text-secondary">Your cart could not be found or has expired.</p>
        </div>
      </div>
    );
  }

  const cartItem = cart.items[0];
  const subtotal = calculateSubtotal(cart);
  const serviceFee = calculateServiceFee(subtotal);
  const total = subtotal + serviceFee;

  return (
    <div>
      <DebugBanner />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {/* Enhanced variation: Countdown timer banner */}
        {isEnhanced && <CountdownTimerBanner />}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <OrderSummary
              cart={cart}
              eventArtist={cartItem.eventTitle}
              eventVenue={cartItem.venueName}
              eventDate={cartItem.eventDate}
            />

            <PaymentForm
              onSubmit={handlePaymentSubmit}
              loading={processing}
              isEnhanced={isEnhanced}
            />
          </div>

          <div>
            <PriceBreakdown
              subtotal={subtotal}
              serviceFee={serviceFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
