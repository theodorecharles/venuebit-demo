import { useCallback } from 'react';
import { sendToNative, notifyPurchaseComplete, requestCloseWebView } from '../utils/nativeBridge';

export const useNativeBridge = () => {
  const handlePurchaseComplete = useCallback((orderId: string, total: number) => {
    notifyPurchaseComplete(orderId, total);
  }, []);

  const handleCloseWebView = useCallback(() => {
    requestCloseWebView();
  }, []);

  const sendCustomMessage = useCallback((action: string, data?: unknown) => {
    sendToNative(action, data);
  }, []);

  return {
    handlePurchaseComplete,
    handleCloseWebView,
    sendCustomMessage,
  };
};
