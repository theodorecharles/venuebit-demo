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

// Android WebView JavaScript interface
interface AndroidBridge {
  postMessage: (message: string) => void;
}

interface WindowWithAndroid extends Window {
  AndroidBridge?: AndroidBridge;
}

// Send message to native iOS or Android app
export const sendToNative = (action: string, data?: Record<string, unknown>): void => {
  const windowWithWebKit = window as WindowWithWebKit;
  const windowWithAndroid = window as WindowWithAndroid;

  // Check for Android bridge first
  if (windowWithAndroid.AndroidBridge) {
    try {
      // Android expects a JSON string
      windowWithAndroid.AndroidBridge.postMessage(JSON.stringify({
        action,
        ...data,
      }));
      console.log('Message sent to Android app:', action, data);
      return;
    } catch (error) {
      console.error('Error sending message to Android app:', error);
    }
  }

  // Check for iOS bridge
  if (windowWithWebKit.webkit?.messageHandlers?.nativeBridge) {
    try {
      // iOS expects action + data spread at top level
      windowWithWebKit.webkit.messageHandlers.nativeBridge.postMessage({
        action,
        ...data,
      });
      console.log('Message sent to iOS app:', action, data);
      return;
    } catch (error) {
      console.error('Error sending message to iOS app:', error);
    }
  }

  // Not running in a native app context
  console.log('Native bridge not available. Running in browser mode.');
  console.log('Would send to native:', { action, data });
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

// Request native app to scroll WebView to top
export const requestScrollToTop = (): void => {
  sendToNative('scrollToTop', {});
};

// Check if running in native app context (iOS or Android)
export const isNativeContext = (): boolean => {
  const windowWithWebKit = window as WindowWithWebKit;
  const windowWithAndroid = window as WindowWithAndroid;
  return !!windowWithWebKit.webkit?.messageHandlers?.nativeBridge || !!windowWithAndroid.AndroidBridge;
};

// Check if running in Android native context
export const isAndroidContext = (): boolean => {
  const windowWithAndroid = window as WindowWithAndroid;
  return !!windowWithAndroid.AndroidBridge;
};

// Check if running in iOS native context
export const isIOSContext = (): boolean => {
  const windowWithWebKit = window as WindowWithWebKit;
  return !!windowWithWebKit.webkit?.messageHandlers?.nativeBridge;
};
