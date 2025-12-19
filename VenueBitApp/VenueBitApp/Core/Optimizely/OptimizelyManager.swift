import Foundation
import Optimizely

@MainActor
class OptimizelyManager: ObservableObject {
    static let shared = OptimizelyManager()

    @Published private(set) var isReady = false
    @Published private(set) var currentDecision: TicketExperienceDecision = .defaultDecision

    private var optimizely: OptimizelyClient?

    // Replace with your actual SDK key or load from config
    private let sdkKey = "YOUR_OPTIMIZELY_SDK_KEY"

    private var cancellables = Set<AnyCancellable>()

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
        optimizely = OptimizelyClient(sdkKey: sdkKey)

        do {
            try optimizely?.start()
            isReady = true
            await MainActor.run {
                updateDecision()
            }
            print("[Optimizely] SDK initialized successfully")
        } catch {
            print("[Optimizely] Failed to initialize: \(error)")
            isReady = false
        }
    }

    @objc private func handleUserIdChange(_ notification: Notification) {
        Task { @MainActor in
            updateDecision()
        }
    }

    private func updateDecision() {
        let userId = UserIdentityManager.shared.userId
        currentDecision = getTicketExperienceDecision(userId: userId)
    }

    func getTicketExperienceDecision(userId: String) -> TicketExperienceDecision {
        guard let optimizely = optimizely, isReady else {
            return .defaultDecision
        }

        let user = optimizely.createUserContext(userId: userId)
        let decision = user?.decide(key: "ticket_experience")

        let enabled = decision?.enabled ?? false
        let variationKey = decision?.variationKey ?? "control"

        return TicketExperienceDecision(
            enabled: enabled,
            variationKey: variationKey,
            showSeatPreview: decision?.variables["show_seat_preview"] as? Bool ?? false,
            showRecommendations: decision?.variables["show_recommendations"] as? Bool ?? false,
            checkoutLayout: decision?.variables["checkout_layout"] as? String ?? "standard",
            showUrgencyBanner: decision?.variables["show_urgency_banner"] as? Bool ?? false
        )
    }

    func trackEvent(eventKey: String, tags: [String: Any]? = nil) {
        guard let optimizely = optimizely, isReady else {
            print("[Optimizely] Cannot track - SDK not ready")
            return
        }

        let userId = UserIdentityManager.shared.userId
        let user = optimizely.createUserContext(userId: userId)

        do {
            try user?.trackEvent(eventKey: eventKey, eventTags: tags)
            print("[Optimizely] Tracked event: \(eventKey)")

            // Also update app state for debug panel
            Task { @MainActor in
                if let appState = await getAppState() {
                    appState.addTrackedEvent(eventKey, tags: tags)
                }
            }
        } catch {
            print("[Optimizely] Failed to track event: \(error)")
        }
    }

    private func getAppState() async -> AppState? {
        // This is a simplified approach - in production you'd use proper DI
        return nil
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

// Import for AnyCancellable
import Combine
