import SwiftUI

struct EventDetailView: View {
    let eventId: String
    @StateObject private var viewModel = EventDetailViewModel()
    @EnvironmentObject var userManager: UserIdentityManager
    @State private var showingSeatSelection = false

    var body: some View {
        ZStack {
            Color.slate900.ignoresSafeArea()

            if viewModel.isLoading {
                LoadingView(message: "Loading event...")
            } else if let error = viewModel.errorMessage {
                ErrorView(message: error) {
                    Task { await viewModel.loadEvent(id: eventId) }
                }
            } else if let event = viewModel.event {
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        // Hero image
                        AsyncImage(url: URL(string: event.imageUrl)) { phase in
                            switch phase {
                            case .success(let image):
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            default:
                                Rectangle()
                                    .fill(Color.slate700)
                                    .overlay(
                                        Image(systemName: event.categoryIcon)
                                            .font(.system(size: 60))
                                            .foregroundColor(.slate500)
                                    )
                            }
                        }
                        .frame(height: 250)
                        .clipped()

                        VStack(alignment: .leading, spacing: 20) {
                            // Category badge
                            HStack {
                                Text(event.category.icon)
                                Text(event.category.displayName)
                                    .textCase(.uppercase)
                            }
                            .font(.caption.bold())
                            .foregroundColor(.indigo400)

                            // Title
                            Text(event.title)
                                .font(.title.bold())
                                .foregroundColor(.white)

                            // Event info
                            VStack(alignment: .leading, spacing: 12) {
                                EventInfoRow(
                                    icon: "calendar",
                                    title: "Date & Time",
                                    value: event.formattedDateTime
                                )

                                EventInfoRow(
                                    icon: "mappin",
                                    title: "Venue",
                                    value: "\(event.venue.name)\n\(event.venue.cityState)"
                                )

                                EventInfoRow(
                                    icon: "dollarsign.circle",
                                    title: "Price Range",
                                    value: event.priceRange.formatted
                                )
                            }

                            Divider()
                                .background(Color.slate700)

                            // Description
                            VStack(alignment: .leading, spacing: 8) {
                                Text("About This Event")
                                    .font(.headline)
                                    .foregroundColor(.white)

                                Text(event.description)
                                    .font(.body)
                                    .foregroundColor(.slate300)
                            }

                            Divider()
                                .background(Color.slate700)

                            // Performer
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Performer")
                                    .font(.headline)
                                    .foregroundColor(.white)

                                HStack(spacing: 12) {
                                    Circle().fill(Color.slate700)
                                        .overlay(
                                            Text(String(event.performer.prefix(1)))
                                                .font(.title2.bold())
                                                .foregroundColor(.slate400)
                                        )
                                        .frame(width: 60, height: 60)

                                    Text(event.performer)
                                        .font(.subheadline.bold())
                                        .foregroundColor(.white)
                                }
                            }
                        }
                        .padding(20)
                        .padding(.bottom, 100) // Space for button
                    }
                }

                // Bottom CTA
                VStack {
                    Spacer()

                    VStack(spacing: 0) {
                        Divider()
                            .background(Color.slate700)

                        HStack {
                            VStack(alignment: .leading) {
                                Text(event.priceRange.minFormatted)
                                    .font(.headline.bold())
                                    .foregroundColor(.white)
                                Text("per ticket")
                                    .font(.caption)
                                    .foregroundColor(.slate400)
                            }

                            Spacer()

                            Button(action: { showingSeatSelection = true }) {
                                HStack {
                                    Image(systemName: "ticket.fill")
                                    Text("Get Tickets")
                                }
                                .font(.headline)
                                .foregroundColor(.white)
                                .padding(.horizontal, 24)
                                .padding(.vertical, 14)
                                .background(Color.indigo500)
                                .cornerRadius(12)
                            }
                        }
                        .padding(16)
                        .background(Color.slate800)
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                DebugBadge()
            }
        }
        .fullScreenCover(isPresented: $showingSeatSelection) {
            SeatSelectionWebView(eventId: eventId)
        }
        .task {
            await viewModel.loadEvent(id: eventId)
        }
    }
}

struct EventInfoRow: View {
    let icon: String
    let title: String
    let value: String

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            Image(systemName: icon)
                .foregroundColor(.indigo400)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.slate400)

                Text(value)
                    .font(.subheadline)
                    .foregroundColor(.white)
            }
        }
    }
}

#Preview {
    NavigationStack {
        EventDetailView(eventId: "evt_001")
            .environmentObject(AppState())
            .environmentObject(UserIdentityManager.shared)
            .environmentObject(OptimizelyManager.shared)
    }
}
