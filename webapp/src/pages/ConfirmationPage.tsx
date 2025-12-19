import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { checkoutApi } from '../api/checkout';
import { Order } from '../types/order';
import { useUserId } from '../hooks/useUserId';
import { useTracking } from '../hooks/useTracking';
import { useNativeBridge } from '../hooks/useNativeBridge';
import { DebugBanner } from '../components/debug/DebugBanner';
import { Confirmation } from '../components/checkout/Confirmation';
import { Loading } from '../components/common/Loading';

export const ConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  useUserId(); // Initialize userId from URL params
  const { trackPageView } = useTracking();
  const { handlePurchaseComplete, handleCloseWebView } = useNativeBridge();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      // Scroll to top when confirmation page loads
      window.scrollTo(0, 0);
      loadOrder();
      trackPageView('confirmation', { order_id: orderId });
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const data = await checkoutApi.getOrder(orderId);
      setOrder(data);

      // Notify native app of purchase completion
      handlePurchaseComplete(orderId, data.total);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Request native app to close the web view
    handleCloseWebView();

    // Fallback: redirect to home if not in native context
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  if (loading) {
    return (
      <div>
        <DebugBanner />
        <div className="container mx-auto px-4 py-8">
          <Loading message="Loading order details..." />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <DebugBanner />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <p className="text-text-secondary">The requested order could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DebugBanner />

      <div className="container mx-auto px-4 py-8">
        <Confirmation order={order} onClose={handleClose} />
      </div>
    </div>
  );
};
