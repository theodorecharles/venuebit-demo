import SwiftUI

struct SeatSelectionWebView: View {
    let eventId: String
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var appState: AppState
    @State private var cartId: String?
    @State private var showingCheckout = false

    private let bridge = WebViewBridge()

    var body: some View {
        NavigationStack {
            ZStack {
                Color.slate900.ignoresSafeArea()

                WebViewContainer(
                    url: WebViewURLBuilder.seatSelectionURL(
                        eventId: eventId,
                        userId: userManager.userId
                    ),
                    bridge: bridge
                )
            }
            .navigationTitle("Select Seats")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") {
                        dismiss()
                    }
                    .foregroundColor(.indigo400)
                }

                ToolbarItem(placement: .topBarTrailing) {
                    DebugBadge()
                }
            }
            .fullScreenCover(isPresented: $showingCheckout) {
                if let cartId = cartId {
                    CheckoutWebView(cartId: cartId)
                }
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

        bridge.onCartCreated = { newCartId in
            cartId = newCartId
            showingCheckout = true
        }

        bridge.onPurchaseComplete = { orderId, total in
            // Handle purchase complete if needed
            dismiss()
        }
    }
}

#Preview {
    SeatSelectionWebView(eventId: "evt_001")
        .environmentObject(AppState())
        .environmentObject(UserIdentityManager.shared)
        .environmentObject(OptimizelyManager.shared)
}
