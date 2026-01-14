import { useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import { useAppStore } from '../store/appStore';
import { featuresApi } from '../api/features';

type TrackEventTags = Record<string, string | number | boolean>;

export const useTracking = () => {
  const userId = useUserStore((state) => state.userId);
  const addTrackedEvent = useAppStore((state) => state.addTrackedEvent);

  const track = useCallback(
    async (eventKey: string, tags?: TrackEventTags) => {
      if (!userId) {
        console.warn('[Tracking] Cannot track event: userId not available');
        return;
      }

      try {
        await featuresApi.trackEvent(userId, eventKey, tags);

        // Store in app state for debug display
        addTrackedEvent({
          eventKey,
          timestamp: new Date().toISOString(),
          tags,
        });

        console.log('[Tracking] Event tracked:', eventKey, tags);
      } catch (error) {
        console.error('[Tracking] Failed to track event:', error);
      }
    },
    [userId, addTrackedEvent]
  );

  const trackPageView = useCallback(
    (pageName: string, data?: Record<string, string | number | boolean>) => {
      track('page_view', {
        page_name: pageName,
        ...data,
      });
    },
    [track]
  );

  const trackSearch = useCallback(
    (query: string, resultCount: number) => {
      track('search', {
        query,
        result_count: resultCount,
      });
    },
    [track]
  );

  const trackAddToCart = useCallback(
    (eventId: string, seatCount: number, totalPrice: number) => {
      track('add_to_cart', {
        event_id: eventId,
        seat_count: seatCount,
        total_price: totalPrice,
      });
    },
    [track]
  );

  const trackCheckout = useCallback(
    (cartId: string, totalPrice: number) => {
      track('checkout', {
        cart_id: cartId,
        total_price: totalPrice,
      });
    },
    [track]
  );

  const trackPurchase = useCallback(
    (orderId: string, totalPrice: number) => {
      track('purchase', {
        order_id: orderId,
        revenue: totalPrice,
      });
    },
    [track]
  );

  return {
    track,
    trackPageView,
    trackSearch,
    trackAddToCart,
    trackCheckout,
    trackPurchase,
  };
};
