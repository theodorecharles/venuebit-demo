import Foundation
import SwiftUI

@MainActor
class ServerConfig: ObservableObject {
    static let shared = ServerConfig()

    private let serverAddressKey = "server_address"
    private let defaultAddress = "localhost"

    @Published var serverAddress: String {
        didSet {
            UserDefaults.standard.set(serverAddress, forKey: serverAddressKey)
            print("[ServerConfig] Server address changed to: \(serverAddress)")
        }
    }

    init() {
        self.serverAddress = UserDefaults.standard.string(forKey: serverAddressKey) ?? defaultAddress
    }

    /// Base URL for the API (backend on port 4001)
    var apiBaseURL: String {
        let protocol_ = serverAddress == "localhost" ? "http" : "https"
        let port = serverAddress == "localhost" ? ":4001" : ""
        return "\(protocol_)://\(serverAddress)\(port)/api"
    }

    /// Base URL for the WebApp (frontend on port 4000)
    var webAppBaseURL: String {
        let protocol_ = serverAddress == "localhost" ? "http" : "https"
        let port = serverAddress == "localhost" ? ":4000" : ""
        return "\(protocol_)://\(serverAddress)\(port)"
    }

    /// Base URL for images (served from backend)
    var imageBaseURL: String {
        let protocol_ = serverAddress == "localhost" ? "http" : "https"
        let port = serverAddress == "localhost" ? ":4001" : ""
        return "\(protocol_)://\(serverAddress)\(port)"
    }

    /// WebSocket URL for real-time updates
    var webSocketURL: String {
        let scheme = serverAddress == "localhost" ? "ws" : "wss"
        let port = serverAddress == "localhost" ? ":4001" : ""
        return "\(scheme)://\(serverAddress)\(port)/api/ws"
    }

    /// Reset to default localhost
    func resetToDefault() {
        serverAddress = defaultAddress
    }

    /// Check if using remote server
    var isRemote: Bool {
        serverAddress != defaultAddress
    }
}
