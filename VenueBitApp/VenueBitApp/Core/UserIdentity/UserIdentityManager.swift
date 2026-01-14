import Foundation
import Combine

@MainActor
class UserIdentityManager: ObservableObject {
    static let shared = UserIdentityManager()

    @Published private(set) var userId: String

    private let userIdKey = "venuebit_user_id"

    init() {
        if let existingId = UserDefaults.standard.string(forKey: userIdKey) {
            self.userId = existingId
        } else {
            let newId = Self.generateUserId()
            UserDefaults.standard.set(newId, forKey: userIdKey)
            self.userId = newId
        }
    }

    /// Generates a new user ID and triggers Optimizely re-evaluation
    func generateNewUserId() {
        generateNewUserId(notifyListeners: true)
    }

    /// Generates a new user ID with optional notification
    /// - Parameter notifyListeners: If false, skips posting the userIdDidChange notification
    func generateNewUserId(notifyListeners: Bool) {
        let newId = Self.generateUserId()
        UserDefaults.standard.set(newId, forKey: userIdKey)
        self.userId = newId

        if notifyListeners {
            // Notify Optimizely manager to re-evaluate decisions
            NotificationCenter.default.post(name: .userIdDidChange, object: newId)
        }
    }

    private static func generateUserId() -> String {
        let uuid = UUID().uuidString.lowercased()
        let shortId = String(uuid.prefix(12)).replacingOccurrences(of: "-", with: "")
        return "user_\(shortId)"
    }
}

extension Notification.Name {
    static let userIdDidChange = Notification.Name("userIdDidChange")
}
