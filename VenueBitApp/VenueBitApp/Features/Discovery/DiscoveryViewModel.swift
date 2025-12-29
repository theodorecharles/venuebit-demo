import Foundation

@MainActor
class DiscoveryViewModel: ObservableObject {
    @Published var allEvents: [Event] = []
    @Published var homescreenModules: [HomescreenModule] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let apiClient = APIClient.shared

    private static let defaultModules: [HomescreenModule] = [
        HomescreenModule(module: .hero_carousel, config: ModuleConfig(categories: ["concerts", "sports", "theater", "comedy"], sortBy: nil, length: 4)),
        HomescreenModule(module: .categories, config: ModuleConfig(categories: ["concerts", "sports", "theater", "comedy"], sortBy: nil, length: nil)),
        HomescreenModule(module: .trending_now, config: ModuleConfig(categories: ["concerts", "sports", "theater", "comedy"], sortBy: nil, length: 6)),
        HomescreenModule(module: .this_weekend, config: ModuleConfig(categories: ["concerts", "sports", "theater", "comedy"], sortBy: nil, length: 6)),
        HomescreenModule(module: .all_events, config: ModuleConfig(categories: ["concerts", "sports", "theater", "comedy"], sortBy: .date_desc, length: nil))
    ]

    func loadEvents(userId: String) async {
        // Only show loading if we have no data yet
        if allEvents.isEmpty {
            isLoading = true
        }
        errorMessage = nil

        // Use withTaskCancellationHandler to ensure we complete the fetch even if cancelled
        do {
            let events = try await apiClient.getEvents()

            // Check for cancellation before second request
            try Task.checkCancellation()

            let config = try await apiClient.getHomescreenConfig(userId: userId)

            allEvents = events
            homescreenModules = config
            isLoading = false
            print("[DiscoveryViewModel] Loaded \(events.count) events and \(config.count) modules")
        } catch is CancellationError {
            // Silently ignore cancellation - this happens during pull-to-refresh
            print("[DiscoveryViewModel] Request cancelled (normal during refresh)")
        } catch let urlError as URLError where urlError.code == .cancelled {
            // URLSession was cancelled - this happens during pull-to-refresh
            print("[DiscoveryViewModel] URLSession cancelled (normal during refresh)")
        } catch {
            isLoading = false
            // Fall back to default modules if config fetch fails
            if homescreenModules.isEmpty {
                homescreenModules = Self.defaultModules
            }
            // Only show error if we have no data to display
            if allEvents.isEmpty {
                errorMessage = error.localizedDescription
            }
            print("[DiscoveryViewModel] Error loading events: \(error)")
        }
    }

    func eventsForModule(_ module: HomescreenModule) -> [Event] {
        let categoryFilters = module.categoryFilters
        let filtered = allEvents.filter { categoryFilters.contains($0.category) }
        let length = module.config.length

        switch module.module {
        case .hero_carousel:
            let featured = filtered.filter { $0.featured }
            return length.map { Array(featured.prefix($0)) } ?? featured
        case .trending_now:
            let shuffled = filtered.shuffled()
            return Array(shuffled.prefix(length ?? 6))
        case .this_weekend:
            let shuffled = filtered.shuffled()
            return Array(shuffled.prefix(length ?? 6))
        case .all_events:
            let sorted = sortEvents(filtered, by: module.config.sortBy ?? .date_desc)
            return length.map { Array(sorted.prefix($0)) } ?? sorted
        case .categories:
            return filtered
        }
    }

    private func sortEvents(_ events: [Event], by sortBy: EventSortBy) -> [Event] {
        switch sortBy {
        case .date_asc:
            return events.sorted { $0.date < $1.date }
        case .date_desc:
            return events.sorted { $0.date > $1.date }
        case .alphabetical_asc:
            return events.sorted { $0.title.lowercased() < $1.title.lowercased() }
        case .trending_desc:
            // Trending would be based on popularity metrics; for now just shuffle
            return events.shuffled()
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
