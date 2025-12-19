import Foundation

@MainActor
class EventDetailViewModel: ObservableObject {
    @Published var event: Event?
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let apiClient = APIClient.shared

    func loadEvent(id: String) async {
        isLoading = true
        errorMessage = nil

        do {
            event = try await apiClient.getEvent(id: id)
            isLoading = false

            // Track page view
            OptimizelyManager.shared.trackEvent(
                eventKey: "page_view",
                tags: ["page": "event_detail", "event_id": id]
            )
        } catch {
            isLoading = false
            errorMessage = error.localizedDescription
            print("[EventDetailViewModel] Error loading event: \(error)")
        }
    }
}
