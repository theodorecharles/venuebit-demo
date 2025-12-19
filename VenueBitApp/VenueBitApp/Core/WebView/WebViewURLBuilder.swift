import Foundation

/// Builds URLs for WebView navigation with proper query parameters
enum WebViewURLBuilder {
    private static let baseURL = "http://localhost:4000"

    /// Builds URL for seat selection WebView
    static func seatSelectionURL(eventId: String, userId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/seats/\(eventId)")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId)
        ]
        return components.url!
    }

    /// Builds URL for checkout WebView
    static func checkoutURL(userId: String, cartId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/checkout")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId),
            URLQueryItem(name: "cartId", value: cartId)
        ]
        return components.url!
    }

    /// Builds URL for order confirmation WebView
    static func confirmationURL(userId: String, orderId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/confirmation/\(orderId)")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId)
        ]
        return components.url!
    }
}
