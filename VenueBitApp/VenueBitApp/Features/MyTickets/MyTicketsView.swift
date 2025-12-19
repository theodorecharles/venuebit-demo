import SwiftUI

struct MyTicketsView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userManager: UserIdentityManager
    @State private var orders: [Order] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color.slate900.ignoresSafeArea()

                if isLoading {
                    LoadingView(message: "Loading tickets...")
                } else if appState.purchasedTickets.isEmpty && orders.isEmpty {
                    EmptyStateView(
                        icon: "ticket",
                        title: "No Tickets Yet",
                        message: "Your purchased tickets will appear here"
                    )
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 20) {
                            if !appState.purchasedTickets.isEmpty {
                                TicketsSection(
                                    title: "Recent Purchases",
                                    tickets: appState.purchasedTickets
                                )
                            }

                            if !orders.isEmpty {
                                OrdersSection(orders: orders)
                            }
                        }
                        .padding(16)
                        .padding(.bottom, 100)
                    }
                }
            }
            .navigationTitle("My Tickets")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    DebugBadge()
                }
            }
            .refreshable {
                await loadOrders()
            }
        }
        .task {
            await loadOrders()
        }
    }

    private func loadOrders() async {
        isLoading = true
        do {
            orders = try await APIClient.shared.getUserOrders(userId: userManager.userId)
        } catch {
            print("[MyTicketsView] Error loading orders: \(error)")
        }
        isLoading = false
    }
}

struct TicketsSection: View {
    let title: String
    let tickets: [Ticket]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .foregroundColor(.white)

            ForEach(tickets) { ticket in
                TicketRow(ticket: ticket)
            }
        }
    }
}

struct TicketRow: View {
    let ticket: Ticket

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(ticket.eventTitle)
                        .font(.headline)
                        .foregroundColor(.white)

                    Text(ticket.formattedDate)
                        .font(.caption)
                        .foregroundColor(.slate400)
                }

                Spacer()

                Image(systemName: "qrcode")
                    .font(.title)
                    .foregroundColor(.indigo400)
            }

            Divider()
                .background(Color.slate700)

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Venue")
                        .font(.caption2)
                        .foregroundColor(.slate500)
                    Text(ticket.venueName)
                        .font(.caption)
                        .foregroundColor(.slate300)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text("Seat")
                        .font(.caption2)
                        .foregroundColor(.slate500)
                    Text(ticket.seatDescription)
                        .font(.caption)
                        .foregroundColor(.slate300)
                }
            }
        }
        .padding(16)
        .background(Color.slate800)
        .cornerRadius(12)
    }
}

struct OrdersSection: View {
    let orders: [Order]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Order History")
                .font(.headline)
                .foregroundColor(.white)

            ForEach(orders) { order in
                OrderRow(order: order)
            }
        }
    }
}

struct OrderRow: View {
    let order: Order

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Order #\(order.id.suffix(8))")
                    .font(.subheadline.bold())
                    .foregroundColor(.white)

                Spacer()

                StatusBadge(status: order.status)
            }

            Text("\(order.tickets.count) ticket(s)")
                .font(.caption)
                .foregroundColor(.slate400)

            HStack {
                Text("Total: $\(String(format: "%.2f", order.total))")
                    .font(.caption.bold())
                    .foregroundColor(.indigo400)

                Spacer()

                Text(formatDate(order.createdAt))
                    .font(.caption2)
                    .foregroundColor(.slate500)
            }
        }
        .padding(16)
        .background(Color.slate800)
        .cornerRadius(12)
    }

    private func formatDate(_ dateString: String) -> String {
        let formatter = ISO8601DateFormatter()
        guard let date = formatter.date(from: dateString) else { return dateString }

        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "MMM d, yyyy"
        return displayFormatter.string(from: date)
    }
}

struct StatusBadge: View {
    let status: OrderStatus

    var color: Color {
        switch status {
        case .confirmed: return .green
        case .pending: return .orange
        case .cancelled, .refunded: return .red
        }
    }

    var body: some View {
        Text(status.rawValue.capitalized)
            .font(.caption2.bold())
            .foregroundColor(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.2))
            .cornerRadius(4)
    }
}

#Preview {
    MyTicketsView()
        .environmentObject(AppState())
        .environmentObject(UserIdentityManager.shared)
        .environmentObject(OptimizelyManager.shared)
}
