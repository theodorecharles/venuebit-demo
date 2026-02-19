import { useCallback } from 'react';
import { sendToNative, notifyPurchaseComplete, requestCloseWebView, requestScrollToTop } from '../utils/nativeBridge';

export const useNativeBridge = () => {
  const handlePurchaseComplete = useCallback((orderId: string, total: number) => {
    notifyPurchaseComplete(orderId, total);
  }, []);

  const handleCloseWebView = useCallback(() => {
    requestCloseWebView();
  }, []);

  const handleScrollToTop = useCallback(() => {
    requestScrollToTop();
  }, []);

  const sendCustomMessage = useCallback((action: string, data?: Record<string, unknown>) => {
    sendToNative(action, data);
  }, []);

  return {
    handlePurchaseComplete,
    handleCloseWebView,
    handleScrollToTop,
    sendCustomMessage,
  };
};
