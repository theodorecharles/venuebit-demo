// iOS WKWebView message handler interface
interface WebKitMessageHandler {
  postMessage: (message: unknown) => void;
}

interface WindowWithWebKit extends Window {
  webkit?: {
    messageHandlers?: {
      nativeBridge?: WebKitMessageHandler;
    };
  };
}

// Send message to native iOS app
export const sendToNative = (action: string, data?: Record<string, unknown>): void => {
  const windowWithWebKit = window as WindowWithWebKit;

  if (windowWithWebKit.webkit?.messageHandlers?.nativeBridge) {
    try {
      // iOS expects action + data spread at top level
      windowWithWebKit.webkit.messageHandlers.nativeBridge.postMessage({
        action,
        ...data,
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
  sendToNative('purchaseComplete', {
    orderId,
    total,
  });
};

// Request native app to close the web view
export const requestCloseWebView = (): void => {
  sendToNative('closeWebView', {});
};

// Check if running in native app context
export const isNativeContext = (): boolean => {
  const windowWithWebKit = window as WindowWithWebKit;
  return !!windowWithWebKit.webkit?.messageHandlers?.nativeBridge;
};
