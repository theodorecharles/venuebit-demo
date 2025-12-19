import SwiftUI
import WebKit

struct WebViewContainer: UIViewRepresentable {
    let url: URL
    let bridge: WebViewBridge
    var onURLChange: ((URL) -> Void)?

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
        context.coordinator.onURLChange = onURLChange

        // Load the initial URL
        let request = URLRequest(url: url)
        webView.load(request)

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        // Don't reload - the webapp handles all navigation via client-side routing
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        var onURLChange: ((URL) -> Void)?

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("[WebView] Finished loading: \(webView.url?.absoluteString ?? "unknown")")
            if let url = webView.url {
                onURLChange?(url)
            }
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("[WebView] Failed to load: \(error.localizedDescription)")
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            print("[WebView] Failed provisional navigation: \(error.localizedDescription)")
        }
    }
}

