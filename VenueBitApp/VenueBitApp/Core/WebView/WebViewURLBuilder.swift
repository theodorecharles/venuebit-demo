import Foundation
import SwiftUI

/// Builds URLs for WebView navigation with proper query parameters
@MainActor
enum WebViewURLBuilder {
    /// Gets the base URL from ServerConfig
    private static var baseURL: String {
        ServerConfig.shared.webAppBaseURL
    }

    /// Gets the current theme from ThemeManager
    private static var currentTheme: String {
        ThemeManager.shared.currentTheme.rawValue
    }

    /// Builds URL for seat selection WebView
    static func seatSelectionURL(eventId: String, userId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/seats/\(eventId)")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId),
            URLQueryItem(name: "theme", value: currentTheme)
        ]
        return components.url!
    }

    /// Builds URL for checkout WebView
    static func checkoutURL(userId: String, cartId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/checkout")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId),
            URLQueryItem(name: "cartId", value: cartId),
            URLQueryItem(name: "theme", value: currentTheme)
        ]
        return components.url!
    }

    /// Builds URL for order confirmation WebView
    static func confirmationURL(userId: String, orderId: String) -> URL {
        var components = URLComponents(string: "\(baseURL)/confirmation/\(orderId)")!
        components.queryItems = [
            URLQueryItem(name: "userId", value: userId),
            URLQueryItem(name: "theme", value: currentTheme)
        ]
        return components.url!
    }
}
