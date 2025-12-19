import Foundation

@MainActor
class SearchViewModel: ObservableObject {
    @Published var searchQuery = ""
    @Published var results: [Event] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let apiClient = APIClient.shared

    func search(userId: String) async {
        guard !searchQuery.trimmingCharacters(in: .whitespaces).isEmpty else {
            results = []
            return
        }

        isLoading = true
        errorMessage = nil

        do {
            // Track search event
            OptimizelyManager.shared.trackEvent(
                eventKey: "search",
                tags: ["query": searchQuery]
            )

            results = try await apiClient.searchEvents(query: searchQuery, userId: userId)
            isLoading = false
        } catch {
            isLoading = false
            errorMessage = error.localizedDescription
            print("[SearchViewModel] Search error: \(error)")
        }
    }

    func clearResults() {
        searchQuery = ""
        results = []
    }
}
