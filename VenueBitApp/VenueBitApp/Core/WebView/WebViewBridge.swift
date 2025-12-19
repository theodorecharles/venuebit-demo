import WebKit

class WebViewBridge: NSObject, WKScriptMessageHandler {
    weak var webView: WKWebView?
    var onDismiss: (() -> Void)?
    var onPurchaseComplete: ((String, Double) -> Void)?
    var onCartCreated: ((String) -> Void)?

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard let body = message.body as? [String: Any],
              let action = body["action"] as? String else {
            print("[WebViewBridge] Invalid message format")
            return
        }

        print("[WebViewBridge] Received action: \(action)")

        switch action {
        case "closeWebView":
            DispatchQueue.main.async {
                self.onDismiss?()
            }

        case "purchaseComplete":
            if let orderId = body["orderId"] as? String,
               let total = body["total"] as? Double {
                DispatchQueue.main.async {
                    self.onPurchaseComplete?(orderId, total)
                }
            }

        case "cartCreated":
            if let cartId = body["cartId"] as? String {
                DispatchQueue.main.async {
                    self.onCartCreated?(cartId)
                }
            }

        case "trackEvent":
            if let eventKey = body["eventKey"] as? String {
                let tags = body["tags"] as? [String: Any]
                print("[WebViewBridge] Track event: \(eventKey), tags: \(String(describing: tags))")
                // Tracking is handled in the web view via Optimizely JS SDK
            }

        case "scrollToTop":
            DispatchQueue.main.async {
                self.webView?.scrollView.setContentOffset(.zero, animated: false)
            }

        case "navigateToCheckout":
            if let cartId = body["cartId"] as? String {
                print("[WebViewBridge] Navigate to checkout with cart: \(cartId)")
                // This would trigger navigation - handled by parent view
            }

        default:
            print("[WebViewBridge] Unknown action: \(action)")
        }
    }

    // Inject JavaScript to set up the bridge on the web side
    func injectBridgeScript() -> String {
        return """
        window.iOSBridge = {
            postMessage: function(action, data) {
                window.webkit.messageHandlers.nativeBridge.postMessage({
                    action: action,
                    ...data
                });
            },
            closeWebView: function() {
                this.postMessage('closeWebView', {});
            },
            notifyPurchaseComplete: function(orderId, total) {
                this.postMessage('purchaseComplete', { orderId: orderId, total: total });
            },
            notifyCartCreated: function(cartId) {
                this.postMessage('cartCreated', { cartId: cartId });
            },
            trackEvent: function(eventKey, tags) {
                this.postMessage('trackEvent', { eventKey: eventKey, tags: tags });
            },
            scrollToTop: function() {
                this.postMessage('scrollToTop', {});
            }
        };
        console.log('[iOSBridge] Bridge initialized');
        """
    }
}
