import Foundation

@MainActor
class DiscoveryViewModel: ObservableObject {
    @Published var allEvents: [Event] = []
    @Published var featuredEvents: [Event] = []
    @Published var trendingEvents: [Event] = []
    @Published var weekendEvents: [Event] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let apiClient = APIClient.shared

    func loadEvents() async {
        // Only show loading if we have no data yet
        if allEvents.isEmpty {
            isLoading = true
        }
        errorMessage = nil

        do {
            let events = try await apiClient.getEvents()
            allEvents = events
            featuredEvents = events.filter { $0.featured }
            trendingEvents = Array(events.shuffled().prefix(6))
            weekendEvents = Array(events.shuffled().prefix(6))
            isLoading = false
        } catch is CancellationError {
            // Ignore cancellation - this happens during pull-to-refresh
            isLoading = false
        } catch {
            isLoading = false
            // Only show error if we have no data to display
            if allEvents.isEmpty {
                errorMessage = error.localizedDescription
            }
            print("[DiscoveryViewModel] Error loading events: \(error)")
        }
    }

    func loadEventsByCategory(_ category: EventCategory) async {
        isLoading = true
        errorMessage = nil

        do {
            let events = try await apiClient.getEvents(category: category)
            allEvents = events
            isLoading = false
        } catch {
            isLoading = false
            errorMessage = error.localizedDescription
        }
    }
}
