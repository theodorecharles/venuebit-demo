import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { checkoutApi } from '../api/checkout';
import { Order } from '../types/order';
import { useUserId } from '../hooks/useUserId';
import { useTracking } from '../hooks/useTracking';
import { useNativeBridge } from '../hooks/useNativeBridge';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { DebugBanner } from '../components/debug/DebugBanner';
import { Confirmation } from '../components/checkout/Confirmation';
import { RecommendedEvents } from '../components/checkout/RecommendedEvents';
import { Loading } from '../components/common/Loading';

export const ConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  useUserId(); // Initialize userId from URL params
  const { trackPageView } = useTracking();
  const { handlePurchaseComplete, handleCloseWebView, handleScrollToTop } = useNativeBridge();
  const { showRecommendations } = useFeatureFlag();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollToTop = () => {
    // Try native WebView scroll first
    handleScrollToTop();
    // Also try web-based scroll as fallback
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const data = await checkoutApi.getOrder(orderId);
      setOrder(data);

      // Scroll to top after content loads
      setTimeout(scrollToTop, 50);

      // Notify native app of purchase completion
      handlePurchaseComplete(orderId, data.total);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      scrollToTop();
      loadOrder();
      trackPageView('confirmation', { order_id: orderId });
    }
  }, [orderId]);

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

  const firstItem = order.items?.[0];

  return (
    <div>
      <DebugBanner />

      <div className="container mx-auto px-4 py-8">
        {/* Header section */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/20 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2">You're going to see {firstItem?.eventTitle || 'the show'}!</h1>
          <p className="text-text-secondary text-lg">Your tickets have been confirmed</p>
        </div>

        {/* Recommendations - right after header */}
        {showRecommendations && firstItem && (
          <div className="max-w-2xl mx-auto">
            <RecommendedEvents
              purchasedEventId={firstItem.eventId}
              artistName={firstItem.eventTitle}
            />
          </div>
        )}

        {/* Order details */}
        <Confirmation order={order} onClose={handleClose} hideHeader />
      </div>
    </div>
  );
};
