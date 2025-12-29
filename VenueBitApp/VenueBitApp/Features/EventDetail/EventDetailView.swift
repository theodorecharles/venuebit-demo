import SwiftUI

struct EventDetailView: View {
    let eventId: String
    @StateObject private var viewModel = EventDetailViewModel()
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var themeManager: ThemeManager
    @State private var showingSeatSelection = false

    var body: some View {
        ZStack {
            themeManager.colors.background.ignoresSafeArea()

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
                        AsyncImage(url: URL(string: event.fullImageUrl)) { phase in
                            switch phase {
                            case .success(let image):
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            default:
                                Rectangle()
                                    .fill(themeManager.colors.surfaceSecondary)
                                    .overlay(
                                        Image(systemName: event.categoryIcon)
                                            .font(.system(size: 60))
                                            .foregroundColor(themeManager.colors.textTertiary)
                                    )
                            }
                        }
                        .frame(height: 250)
                        .clipped()

                        VStack(alignment: .leading, spacing: 20) {
                            // Category badge
                            HStack {
                                Text(event.displayEmoji)
                                Text(event.category.displayName)
                                    .textCase(.uppercase)
                            }
                            .font(.caption.bold())
                            .foregroundColor(themeManager.colors.primaryLight)

                            // Title
                            Text(event.title)
                                .font(.title.bold())
                                .foregroundColor(themeManager.colors.textPrimary)

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
                                .background(themeManager.colors.border)

                            // Description
                            VStack(alignment: .leading, spacing: 8) {
                                Text("About This Event")
                                    .font(.headline)
                                    .foregroundColor(themeManager.colors.textPrimary)

                                Text(event.description)
                                    .font(.body)
                                    .foregroundColor(themeManager.colors.textSecondary)
                            }

                            Divider()
                                .background(themeManager.colors.border)

                            // Performer
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Performer")
                                    .font(.headline)
                                    .foregroundColor(themeManager.colors.textPrimary)

                                HStack(spacing: 12) {
                                    Circle().fill(themeManager.colors.surfaceSecondary)
                                        .overlay(
                                            Text(String(event.performer.prefix(1)))
                                                .font(.title2.bold())
                                                .foregroundColor(themeManager.colors.textSecondary)
                                        )
                                        .frame(width: 60, height: 60)

                                    Text(event.performer)
                                        .font(.subheadline.bold())
                                        .foregroundColor(themeManager.colors.textPrimary)
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
                            .background(themeManager.colors.border)

                        HStack {
                            VStack(alignment: .leading) {
                                Text(event.priceRange.minFormatted)
                                    .font(.headline.bold())
                                    .foregroundColor(themeManager.colors.textPrimary)
                                Text("per ticket")
                                    .font(.caption)
                                    .foregroundColor(themeManager.colors.textSecondary)
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
                                .background(themeManager.colors.primary)
                                .cornerRadius(12)
                            }
                        }
                        .padding(16)
                        .background(themeManager.colors.surface)
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
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
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            Image(systemName: icon)
                .foregroundColor(themeManager.colors.primaryLight)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption)
                    .foregroundColor(themeManager.colors.textSecondary)

                Text(value)
                    .font(.subheadline)
                    .foregroundColor(themeManager.colors.textPrimary)
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
            .environmentObject(ThemeManager.shared)
    }
}
