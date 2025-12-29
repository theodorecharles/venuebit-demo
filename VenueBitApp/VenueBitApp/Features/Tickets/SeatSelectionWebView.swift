import SwiftUI

struct SeatSelectionWebView: View {
    let eventId: String
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var themeManager: ThemeManager
    @State private var currentTitle = "Select Seats"

    private let bridge = WebViewBridge()

    var body: some View {
        NavigationStack {
            ZStack {
                themeManager.colors.background.ignoresSafeArea()

                WebViewContainer(
                    url: WebViewURLBuilder.seatSelectionURL(
                        eventId: eventId,
                        userId: userManager.userId
                    ),
                    bridge: bridge,
                    onURLChange: { url in
                        updateTitle(for: url)
                    }
                )
            }
            .navigationTitle(currentTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") {
                        dismiss()
                    }
                    .foregroundColor(themeManager.colors.primaryLight)
                }
            }
            .onAppear {
                setupBridge()
            }
        }
    }

    private func updateTitle(for url: URL) {
        let path = url.path
        if path.contains("/confirmation") {
            currentTitle = "Confirmed"
        } else if path.contains("/checkout") {
            currentTitle = "Checkout"
        } else {
            currentTitle = "Select Seats"
        }
    }

    private func setupBridge() {
        bridge.onDismiss = {
            // Switch to My Tickets tab when closing from confirmation
            if currentTitle == "Confirmed" {
                appState.selectedTab = .myTickets
            }
            dismiss()
        }

        bridge.onPurchaseComplete = { orderId, total in
            // Track purchase
            OptimizelyManager.shared.trackEvent(
                eventKey: "purchase",
                tags: [
                    "order_id": orderId,
                    "revenue": total
                ]
            )

            appState.addTrackedEvent("purchase", tags: ["order_id": orderId, "revenue": total])

            // Load the new order and add tickets silently
            Task {
                do {
                    let order = try await APIClient.shared.getOrder(orderId: orderId)
                    await MainActor.run {
                        appState.addPurchasedTickets(order.tickets)
                    }
                } catch {
                    print("[SeatSelectionWebView] Error loading order: \(error)")
                }
            }
        }
    }
}

#Preview {
    SeatSelectionWebView(eventId: "evt_001")
        .environmentObject(AppState())
        .environmentObject(UserIdentityManager.shared)
        .environmentObject(OptimizelyManager.shared)
        .environmentObject(ThemeManager.shared)
}
