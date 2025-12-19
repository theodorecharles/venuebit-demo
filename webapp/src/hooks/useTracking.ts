import { useCallback } from 'react';
import { optimizelyClient } from '../optimizely/client';
import { useUserStore } from '../store/userStore';

interface TrackEventTags {
  revenue?: number;
  [key: string]: string | number | boolean | undefined;
}

export const useTracking = () => {
  const userId = useUserStore((state) => state.userId);

  const track = useCallback(
    (eventKey: string, tags?: TrackEventTags) => {
      if (!userId) {
        console.warn('Cannot track event: userId not available');
        return;
      }
      optimizelyClient.track(eventKey, userId, undefined, tags);
    },
    [userId]
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

  const trackCustomEvent = useCallback(
    (eventName: string, tags?: TrackEventTags) => {
      track(eventName, tags);
    },
    [track]
  );

  return {
    trackPageView,
    trackAddToCart,
    trackCheckout,
    trackPurchase,
    trackCustomEvent,
  };
};
