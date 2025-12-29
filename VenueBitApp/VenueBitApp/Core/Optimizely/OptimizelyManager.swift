import Foundation
import Combine

@MainActor
class OptimizelyManager: ObservableObject {
    static let shared = OptimizelyManager()

    @Published private(set) var isReady = false
    @Published private(set) var currentDecision: TicketExperienceDecision = .defaultDecision
    @Published private(set) var allFeatures: [String: FeatureDecisionInfo] = [:]

    private let apiClient = APIClient.shared

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
        isReady = true
        await fetchDecision(userId: UserIdentityManager.shared.userId)
    }

    @objc private func handleUserIdChange(_ notification: Notification) {
        Task { @MainActor in
            await fetchDecision(userId: UserIdentityManager.shared.userId)
        }
    }

    func fetchDecision(userId: String) async {
        do {
            let features = try await apiClient.getFeatures(userId: userId)

            // Store all features for display in settings
            var newFeatures: [String: FeatureDecisionInfo] = [:]

            for (key, feature) in features.features {
                var variables: [String: String] = [:]
                for (varKey, varValue) in feature.variables {
                    if let boolVal = varValue.value as? Bool {
                        variables[varKey] = boolVal ? "true" : "false"
                    } else if let strVal = varValue.value as? String {
                        variables[varKey] = strVal
                    } else if let intVal = varValue.value as? Int {
                        variables[varKey] = String(intVal)
                    } else if let doubleVal = varValue.value as? Double {
                        variables[varKey] = String(doubleVal)
                    }
                }

                newFeatures[key] = FeatureDecisionInfo(
                    enabled: feature.enabled,
                    variationKey: feature.variationKey ?? "off",
                    variables: variables
                )
            }

            allFeatures = newFeatures

            if let ticketExperience = features.features["ticket_experience"] {
                let variables = ticketExperience.variables

                currentDecision = TicketExperienceDecision(
                    enabled: ticketExperience.enabled,
                    variationKey: ticketExperience.variationKey ?? "control",
                    showSeatPreview: (variables["show_seat_preview"]?.value as? Bool) ?? false,
                    showRecommendations: (variables["show_recommendations"]?.value as? Bool) ?? false,
                    checkoutLayout: (variables["checkout_layout"]?.value as? String) ?? "standard",
                    showUrgencyBanner: (variables["show_urgency_banner"]?.value as? Bool) ?? false
                )
                print("[Optimizely] Fetched decision from backend: \(currentDecision.variationKey)")
            } else {
                currentDecision = .defaultDecision
                print("[Optimizely] No ticket_experience feature found, using defaults")
            }

            // Handle app_theme feature
            if let appTheme = features.features["app_theme"] {
                let themeValue = appTheme.variables["theme"]?.value as? String ?? appTheme.variationKey ?? "off"
                if let theme = AppTheme(rawValue: themeValue) {
                    ThemeManager.shared.setTheme(theme)
                } else {
                    ThemeManager.shared.setTheme(.off)
                }
            } else {
                ThemeManager.shared.setTheme(.off)
            }

            print("[Optimizely] Loaded \(allFeatures.count) features")
        } catch {
            print("[Optimizely] Error fetching features: \(error)")
            currentDecision = .defaultDecision
            ThemeManager.shared.setTheme(.off)
        }
    }

    func getTicketExperienceDecision(userId: String) -> TicketExperienceDecision {
        return currentDecision
    }

    func trackEvent(eventKey: String, tags: [String: Any]? = nil) {
        Task {
            do {
                try await apiClient.trackEvent(
                    userId: UserIdentityManager.shared.userId,
                    eventKey: eventKey,
                    tags: tags
                )
                print("[Optimizely] Event tracked: \(eventKey)")
            } catch {
                print("[Optimizely] Error tracking event: \(error)")
            }
        }
    }
}

struct FeatureDecisionInfo {
    let enabled: Bool
    let variationKey: String
    let variables: [String: String]
}

struct TicketExperienceDecision {
    let enabled: Bool
    let variationKey: String
    let showSeatPreview: Bool
    let showRecommendations: Bool
    let checkoutLayout: String
    let showUrgencyBanner: Bool

    var isVariation: Bool {
        variationKey == "variation"
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
