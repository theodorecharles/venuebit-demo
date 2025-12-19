import SwiftUI
import WebKit

struct WebViewContainer: UIViewRepresentable {
    let url: URL
    let bridge: WebViewBridge

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()

        // Set up message handler for native bridge
        let contentController = WKUserContentController()
        contentController.add(bridge, name: "nativeBridge")
        configuration.userContentController = contentController

        // Allow inline media playback
        configuration.allowsInlineMediaPlayback = true

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 15/255, green: 23/255, blue: 42/255, alpha: 1)
        webView.scrollView.backgroundColor = UIColor(red: 15/255, green: 23/255, blue: 42/255, alpha: 1)

        bridge.webView = webView

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        webView.load(request)
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("[WebView] Finished loading: \(webView.url?.absoluteString ?? "unknown")")
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("[WebView] Failed to load: \(error.localizedDescription)")
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            print("[WebView] Failed provisional navigation: \(error.localizedDescription)")
        }
    }
}

// MARK: - URL Builders

struct WebViewURLBuilder {
    static let baseURL = "http://localhost:4000"

    static func seatSelectionURL(eventId: String, userId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/seats/\(eventId)")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId),
            URLQueryItem(name: "platform", value: "ios")
        ]
        return components.url!
    }

    static func checkoutURL(userId: String, cartId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/checkout")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId),
            URLQueryItem(name: "cartId", value: cartId),
            URLQueryItem(name: "platform", value: "ios")
        ]
        return components.url!
    }

    static func confirmationURL(orderId: String, userId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/confirmation/\(orderId)")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId),
            URLQueryItem(name: "platform", value: "ios")
        ]
        return components.url!
    }
}
