import SwiftUI
import Combine

@MainActor
class AppState: ObservableObject {
    @Published var selectedTab: AppTab = .discover
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var purchasedTickets: [Ticket] = []
    @Published var recentEvents: [TrackedEvent] = []

    struct TrackedEvent: Identifiable {
        let id = UUID()
        let eventKey: String
        let tags: [String: Any]?
        let timestamp: Date

        var timeAgo: String {
            let seconds = Int(-timestamp.timeIntervalSinceNow)
            if seconds < 60 {
                return "\(seconds)s ago"
            } else if seconds < 3600 {
                return "\(seconds / 60)m ago"
            } else {
                return "\(seconds / 3600)h ago"
            }
        }
    }

    func addTrackedEvent(_ eventKey: String, tags: [String: Any]? = nil) {
        let event = TrackedEvent(eventKey: eventKey, tags: tags, timestamp: Date())
        recentEvents.insert(event, at: 0)
        if recentEvents.count > 10 {
            recentEvents.removeLast()
        }
    }

    func addPurchasedTickets(_ tickets: [Ticket]) {
        // Only add tickets that aren't already in the list (by ID)
        let existingIds = Set(purchasedTickets.map { $0.id })
        let newTickets = tickets.filter { !existingIds.contains($0.id) }
        purchasedTickets.append(contentsOf: newTickets)
    }

    func removeTicket(_ ticket: Ticket) {
        purchasedTickets.removeAll { $0.id == ticket.id }
    }

    func clearAllTickets() {
        purchasedTickets.removeAll()
    }
}
