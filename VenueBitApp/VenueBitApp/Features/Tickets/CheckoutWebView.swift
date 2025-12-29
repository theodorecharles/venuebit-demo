import SwiftUI

struct CheckoutWebView: View {
    let cartId: String
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var appState: AppState
    @State private var showingConfirmation = false
    @State private var completedOrderId: String?

    private let bridge = WebViewBridge()

    var body: some View {
        NavigationStack {
            ZStack {
                Color.slate900.ignoresSafeArea()

                WebViewContainer(
                    url: WebViewURLBuilder.checkoutURL(
                        userId: userManager.userId,
                        cartId: cartId
                    ),
                    bridge: bridge
                )
            }
            .navigationTitle("Checkout")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.indigo400)
                }
            }
            .alert("Purchase Complete!", isPresented: $showingConfirmation) {
                Button("View My Tickets") {
                    appState.selectedTab = .myTickets
                    dismiss()
                }
            } message: {
                Text("Your tickets have been added to My Tickets.")
            }
            .onAppear {
                setupBridge()
            }
        }
    }

    private func setupBridge() {
        bridge.onDismiss = {
            dismiss()
        }

        bridge.onPurchaseComplete = { orderId, total in
            completedOrderId = orderId

            // Track purchase
            OptimizelyManager.shared.trackEvent(
                eventKey: "purchase",
                tags: [
                    "order_id": orderId,
                    "revenue": total
                ]
            )

            appState.addTrackedEvent("purchase", tags: ["order_id": orderId, "revenue": total])

            // Load the new order and add tickets
            Task {
                do {
                    let order = try await APIClient.shared.getOrder(orderId: orderId)
                    await MainActor.run {
                        appState.addPurchasedTickets(order.tickets)
                        showingConfirmation = true
                    }
                } catch {
                    print("[CheckoutWebView] Error loading order: \(error)")
                    showingConfirmation = true
                }
            }
        }
    }
}

#Preview {
    CheckoutWebView(cartId: "cart_123")
        .environmentObject(AppState())
        .environmentObject(UserIdentityManager.shared)
        .environmentObject(OptimizelyManager.shared)
}
