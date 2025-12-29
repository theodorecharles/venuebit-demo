import Foundation

@MainActor
class WebSocketService: NSObject, ObservableObject {
    static let shared = WebSocketService()

    private var webSocket: URLSessionWebSocketTask?
    private var urlSession: URLSession?
    private var isConnected = false
    private var reconnectAttempts = 0
    private let maxReconnectAttempts = 5
    private var reconnectTimer: Timer?

    override init() {
        super.init()
        setupSession()
    }

    private func setupSession() {
        let config = URLSessionConfiguration.default
        urlSession = URLSession(configuration: config, delegate: self, delegateQueue: .main)
    }

    func connect() {
        guard !isConnected, webSocket == nil else { return }

        let wsURL = buildWebSocketURL()
        guard let url = URL(string: wsURL) else {
            print("[WebSocket] Invalid URL: \(wsURL)")
            return
        }

        print("[WebSocket] Connecting to \(wsURL)")
        webSocket = urlSession?.webSocketTask(with: url)
        webSocket?.resume()
        receiveMessage()
    }

    func disconnect() {
        reconnectTimer?.invalidate()
        reconnectTimer = nil
        webSocket?.cancel(with: .normalClosure, reason: nil)
        webSocket = nil
        isConnected = false
        reconnectAttempts = 0
        print("[WebSocket] Disconnected")
    }

    private func buildWebSocketURL() -> String {
        return ServerConfig.shared.webSocketURL
    }

    private func receiveMessage() {
        webSocket?.receive { [weak self] result in
            Task { @MainActor in
                switch result {
                case .success(let message):
                    self?.handleMessage(message)
                    self?.receiveMessage() // Continue listening
                case .failure(let error):
                    print("[WebSocket] Receive error: \(error.localizedDescription)")
                    self?.handleDisconnect()
                }
            }
        }
    }

    private func handleMessage(_ message: URLSessionWebSocketTask.Message) {
        switch message {
        case .string(let text):
            parseMessage(text)
        case .data(let data):
            if let text = String(data: data, encoding: .utf8) {
                parseMessage(text)
            }
        @unknown default:
            break
        }
    }

    private func parseMessage(_ text: String) {
        guard let data = text.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let type = json["type"] as? String else {
            print("[WebSocket] Failed to parse message: \(text)")
            return
        }

        print("[WebSocket] Received message type: \(type)")

        switch type {
        case "connected":
            print("[WebSocket] Connected to server")
            isConnected = true
            reconnectAttempts = 0

        case "datafile_updated":
            print("[WebSocket] Datafile updated - refreshing features")
            NotificationCenter.default.post(name: .datafileDidUpdate, object: nil)

        default:
            print("[WebSocket] Unknown message type: \(type)")
        }
    }

    private func handleDisconnect() {
        isConnected = false
        webSocket = nil

        guard reconnectAttempts < maxReconnectAttempts else {
            print("[WebSocket] Max reconnect attempts reached")
            return
        }

        reconnectAttempts += 1
        let delay = Double(reconnectAttempts) * 2.0 // Exponential backoff
        print("[WebSocket] Reconnecting in \(delay) seconds (attempt \(reconnectAttempts))")

        reconnectTimer = Timer.scheduledTimer(withTimeInterval: delay, repeats: false) { [weak self] _ in
            Task { @MainActor in
                self?.connect()
            }
        }
    }
}

extension WebSocketService: URLSessionWebSocketDelegate {
    nonisolated func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didOpenWithProtocol protocol: String?) {
        Task { @MainActor in
            print("[WebSocket] Connection opened")
            isConnected = true
        }
    }

    nonisolated func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didCloseWith closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
        Task { @MainActor in
            print("[WebSocket] Connection closed with code: \(closeCode)")
            handleDisconnect()
        }
    }
}

extension Notification.Name {
    static let datafileDidUpdate = Notification.Name("datafileDidUpdate")
}
