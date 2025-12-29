import SwiftUI

struct MyTicketsView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var themeManager: ThemeManager
    @State private var orders: [Order] = []
    @State private var isLoading = false
    @State private var showingClearAlert = false

    var body: some View {
        NavigationStack {
            ZStack {
                themeManager.colors.background.ignoresSafeArea()

                if isLoading {
                    LoadingView(message: "Loading tickets...")
                } else if appState.purchasedTickets.isEmpty && orders.isEmpty {
                    EmptyStateView(
                        icon: "ticket",
                        title: "No Tickets Yet",
                        message: "Your purchased tickets will appear here"
                    )
                } else {
                    List {
                        if !appState.purchasedTickets.isEmpty {
                            Section {
                                ForEach(appState.purchasedTickets) { ticket in
                                    TicketRow(ticket: ticket)
                                        .listRowBackground(themeManager.colors.surface)
                                }
                                .onDelete { indexSet in
                                    for index in indexSet {
                                        appState.removeTicket(appState.purchasedTickets[index])
                                    }
                                }
                            } header: {
                                Text("Recent Purchases")
                                    .foregroundColor(themeManager.colors.textPrimary)
                            }
                        }

                        if !orders.isEmpty {
                            Section {
                                ForEach(orders) { order in
                                    OrderRow(order: order)
                                        .listRowBackground(themeManager.colors.surface)
                                }
                            } header: {
                                Text("Order History")
                                    .foregroundColor(themeManager.colors.textPrimary)
                            }
                        }
                    }
                    .listStyle(.grouped)
                    .scrollContentBackground(.hidden)
                }
            }
            .navigationTitle("My Tickets")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    if !appState.purchasedTickets.isEmpty {
                        Button("Clear All") {
                            showingClearAlert = true
                        }
                        .foregroundColor(.red)
                    }
                }
            }
            .alert("Clear All Tickets?", isPresented: $showingClearAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Clear", role: .destructive) {
                    appState.clearAllTickets()
                }
            } message: {
                Text("This will remove all tickets from this view. This is for demo purposes only.")
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
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .foregroundColor(themeManager.colors.textPrimary)

            ForEach(tickets) { ticket in
                TicketRow(ticket: ticket)
            }
        }
    }
}

struct TicketRow: View {
    let ticket: Ticket
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(ticket.eventTitle)
                        .font(.headline)
                        .foregroundColor(themeManager.colors.textPrimary)

                    Text(ticket.formattedDate)
                        .font(.caption)
                        .foregroundColor(themeManager.colors.textSecondary)
                }

                Spacer()

                Image(systemName: "qrcode")
                    .font(.title)
                    .foregroundColor(themeManager.colors.primaryLight)
            }

            Divider()
                .background(themeManager.colors.border)

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Venue")
                        .font(.caption2)
                        .foregroundColor(themeManager.colors.textTertiary)
                    Text(ticket.venueName)
                        .font(.caption)
                        .foregroundColor(themeManager.colors.textSecondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text("Seat")
                        .font(.caption2)
                        .foregroundColor(themeManager.colors.textTertiary)
                    Text(ticket.seatDescription)
                        .font(.caption)
                        .foregroundColor(themeManager.colors.textSecondary)
                }
            }
        }
        .padding(16)
        .background(themeManager.colors.surface)
        .cornerRadius(12)
    }
}

struct OrdersSection: View {
    let orders: [Order]
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Order History")
                .font(.headline)
                .foregroundColor(themeManager.colors.textPrimary)

            ForEach(orders) { order in
                OrderRow(order: order)
            }
        }
    }
}

struct OrderRow: View {
    let order: Order
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Order #\(order.id.suffix(8))")
                    .font(.subheadline.bold())
                    .foregroundColor(themeManager.colors.textPrimary)

                Spacer()

                StatusBadge(status: order.status)
            }

            Text("\(order.tickets.count) ticket(s)")
                .font(.caption)
                .foregroundColor(themeManager.colors.textSecondary)

            HStack {
                Text("Total: $\(String(format: "%.2f", order.total))")
                    .font(.caption.bold())
                    .foregroundColor(themeManager.colors.primaryLight)

                Spacer()

                Text(formatDate(order.createdAt))
                    .font(.caption2)
                    .foregroundColor(themeManager.colors.textTertiary)
            }
        }
        .padding(16)
        .background(themeManager.colors.surface)
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
        case .confirmed, .completed: return .green
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
        .environmentObject(ThemeManager.shared)
}
