// iOS WKWebView message handler interface
interface WebKitMessageHandler {
  postMessage: (message: unknown) => void;
}

interface WindowWithWebKit extends Window {
  webkit?: {
    messageHandlers?: {
      venuebit?: WebKitMessageHandler;
    };
  };
}

// Send message to native iOS app
export const sendToNative = (action: string, data?: unknown): void => {
  const windowWithWebKit = window as WindowWithWebKit;

  if (windowWithWebKit.webkit?.messageHandlers?.venuebit) {
    try {
      windowWithWebKit.webkit.messageHandlers.venuebit.postMessage({
        action,
        data,
        timestamp: new Date().toISOString(),
      });
      console.log('Message sent to native app:', action, data);
    } catch (error) {
      console.error('Error sending message to native app:', error);
    }
  } else {
    console.log('Native bridge not available. Running in browser mode.');
    console.log('Would send to native:', { action, data });
  }
};

// Notify native app of purchase completion
export const notifyPurchaseComplete = (orderId: string, total: number): void => {
  sendToNative('purchase_complete', {
    order_id: orderId,
    total,
  });
};

// Request native app to close the web view
export const requestCloseWebView = (): void => {
  sendToNative('close_webview');
};

// Check if running in native app context
export const isNativeContext = (): boolean => {
  const windowWithWebKit = window as WindowWithWebKit;
  return !!windowWithWebKit.webkit?.messageHandlers?.venuebit;
};
