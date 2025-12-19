import Foundation
import Combine

@MainActor
class OptimizelyManager: ObservableObject {
    static let shared = OptimizelyManager()

    @Published private(set) var isReady = false
    @Published private(set) var currentDecision: TicketExperienceDecision = .defaultDecision

    // Set to a valid SDK key to enable Optimizely
    private let sdkKey: String? = nil

    init() {
        // Listen for user ID changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleUserIdChange),
            name: .userIdDidChange,
            object: nil
        )
    }

    func initialize() async {
        // Skip Optimizely initialization if no SDK key is configured
        guard let sdkKey = sdkKey, !sdkKey.isEmpty, sdkKey != "YOUR_OPTIMIZELY_SDK_KEY" else {
            print("[Optimizely] No SDK key configured - using default values")
            isReady = true
            currentDecision = .defaultDecision
            return
        }

        // Optimizely initialization would go here when SDK key is available
        print("[Optimizely] SDK key provided - would initialize here")
        isReady = true
        updateDecision()
    }

    @objc private func handleUserIdChange(_ notification: Notification) {
        Task { @MainActor in
            updateDecision()
        }
    }

    private func updateDecision() {
        // Without Optimizely, just use defaults
        currentDecision = .defaultDecision
    }

    func getTicketExperienceDecision(userId: String) -> TicketExperienceDecision {
        // Without Optimizely, return default decision
        return .defaultDecision
    }

    func trackEvent(eventKey: String, tags: [String: Any]? = nil) {
        // Log locally for debugging, but don't require Optimizely
        print("[Optimizely] Event tracked (local only): \(eventKey)")
    }
}

struct TicketExperienceDecision {
    let enabled: Bool
    let variationKey: String
    let showSeatPreview: Bool
    let showRecommendations: Bool
    let checkoutLayout: String
    let showUrgencyBanner: Bool

    var isEnhanced: Bool {
        variationKey == "enhanced"
    }

    static let defaultDecision = TicketExperienceDecision(
        enabled: false,
        variationKey: "control",
        showSeatPreview: false,
        showRecommendations: false,
        checkoutLayout: "standard",
        showUrgencyBanner: false
    )
}
