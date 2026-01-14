import SwiftUI

struct DiscoveryView: View {
    @StateObject private var viewModel = DiscoveryViewModel()
    @EnvironmentObject var optimizelyManager: OptimizelyManager
    @EnvironmentObject var userIdentityManager: UserIdentityManager
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        NavigationStack {
            ZStack {
                themeManager.colors.background.ignoresSafeArea()

                if viewModel.isLoading && viewModel.allEvents.isEmpty {
                    LoadingView(message: "Loading events...")
                } else if let error = viewModel.errorMessage {
                    ErrorView(message: error) {
                        Task { await viewModel.loadEvents(userId: userIdentityManager.userId) }
                    }
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 24) {
                            ForEach(viewModel.homescreenModules) { module in
                                renderModule(module)
                            }
                        }
                        .padding(.bottom, 100) // Space for FAB
                    }
                    .refreshable {
                        await withCheckedContinuation { continuation in
                            Task {
                                // Refresh both events and Optimizely features (including theme)
                                await optimizelyManager.fetchDecision(userId: userIdentityManager.userId)
                                await viewModel.loadEvents(userId: userIdentityManager.userId)
                                continuation.resume()
                            }
                        }
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    VenueBitLogo(size: 28)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        Task {
                            await viewModel.generateNewUserIdAndReload()
                        }
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [
                                        Color(red: 129/255, green: 140/255, blue: 248/255),
                                        Color(red: 244/255, green: 114/255, blue: 182/255)
                                    ],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                    }
                }
            }
        }
        .task {
            await viewModel.loadEvents(userId: userIdentityManager.userId)
        }
        .onReceive(NotificationCenter.default.publisher(for: .datafileDidUpdate)) { _ in
            Task {
                print("[DiscoveryView] Datafile updated - reloading homescreen config")
                await viewModel.loadEvents(userId: userIdentityManager.userId)
            }
        }
    }

    @ViewBuilder
    private func renderModule(_ module: HomescreenModule) -> some View {
        let events = viewModel.eventsForModule(module)

        switch module.module {
        case .hero_carousel:
            if !events.isEmpty {
                FeaturedEventsSection(events: events)
            }
        case .categories:
            CategoriesSection(categories: module.categoryFilters)
        case .trending_now:
            if !events.isEmpty {
                EventsHorizontalSection(title: "Trending Now", events: events)
            }
        case .this_weekend:
            if !events.isEmpty {
                EventsHorizontalSection(title: "This Weekend", events: events)
            }
        case .all_events:
            if !events.isEmpty {
                AllEventsSection(events: events)
            }
        }
    }
}

struct FeaturedEventsSection: View {
    let events: [Event]
    @State private var currentIndex = 0
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(spacing: 8) {
            TabView(selection: $currentIndex) {
                ForEach(Array(events.enumerated()), id: \.element.id) { index, event in
                    NavigationLink(destination: EventDetailView(eventId: event.id)) {
                        FeaturedEventCard(event: event)
                            .padding(.horizontal, 16)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .tag(index)
                }
            }
            .frame(height: 240)
            .tabViewStyle(.page(indexDisplayMode: .never))

            // Page dots below the image
            HStack(spacing: 6) {
                ForEach(0..<events.count, id: \.self) { index in
                    Circle()
                        .fill(index == currentIndex ? themeManager.colors.textPrimary : themeManager.colors.textTertiary)
                        .frame(width: 8, height: 8)
                }
            }
        }
    }
}

struct CategoriesSection: View {
    var categories: [EventCategory] = EventCategory.allCases
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Categories")
                .font(.headline)
                .foregroundColor(themeManager.colors.textPrimary)
                .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(categories, id: \.self) { category in
                        NavigationLink(destination: CategoryEventsView(category: category)) {
                            CategoryCard(category: category)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal, 16)
            }
        }
    }
}

struct CategoryCard: View {
    let category: EventCategory
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(spacing: 8) {
            Text(category.icon)
                .font(.title)

            Text(category.displayName)
                .font(.caption.bold())
                .foregroundColor(themeManager.colors.textPrimary)
        }
        .frame(width: 80, height: 80)
        .background(themeManager.colors.surfaceSecondary)
        .cornerRadius(12)
    }
}

struct EventsHorizontalSection: View {
    let title: String
    let events: [Event]
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(title)
                    .font(.headline)
                    .foregroundColor(themeManager.colors.textPrimary)

                Spacer()

                NavigationLink(destination: AllEventsListView(title: title, events: events)) {
                    Text("See All")
                        .font(.subheadline)
                        .foregroundColor(themeManager.colors.primaryLight)
                }
            }
            .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(events.prefix(6)) { event in
                        NavigationLink(destination: EventDetailView(eventId: event.id)) {
                            EventCard(event: event, isCompact: true)
                                .frame(width: 200)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal, 16)
            }
        }
    }
}

struct AllEventsSection: View {
    let events: [Event]
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("All Events")
                .font(.headline)
                .foregroundColor(themeManager.colors.textPrimary)
                .padding(.horizontal, 16)

            LazyVStack(spacing: 12) {
                ForEach(events) { event in
                    NavigationLink(destination: EventDetailView(eventId: event.id)) {
                        EventListRow(event: event)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal, 16)
        }
    }
}

struct EventListRow: View {
    let event: Event
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        HStack(spacing: 12) {
            CachedAsyncImage(url: URL(string: event.fullImageUrl)) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle().fill(themeManager.colors.surfaceSecondary)
                    .overlay(
                        Text(event.displayEmoji)
                    )
            }
            .frame(width: 80, height: 80)
            .cornerRadius(8)
            .clipped()

            VStack(alignment: .leading, spacing: 4) {
                Text(event.title)
                    .font(.subheadline.bold())
                    .foregroundColor(themeManager.colors.textPrimary)
                    .lineLimit(2)

                Text(event.venue.name)
                    .font(.caption)
                    .foregroundColor(themeManager.colors.textSecondary)

                HStack {
                    Text(event.formattedDate)
                        .font(.caption2)
                        .foregroundColor(themeManager.colors.textTertiary)

                    Spacer()

                    Text(event.priceRange.minFormatted)
                        .font(.caption.bold())
                        .foregroundColor(themeManager.colors.primaryLight)
                }
            }

            Image(systemName: "chevron.right")
                .foregroundColor(themeManager.colors.textTertiary)
                .font(.caption)
        }
        .padding(12)
        .background(themeManager.colors.surface)
        .cornerRadius(12)
    }
}

// Placeholder views for navigation
struct CategoryEventsView: View {
    let category: EventCategory
    @StateObject private var viewModel = DiscoveryViewModel()
    @EnvironmentObject var userIdentityManager: UserIdentityManager
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        ZStack {
            themeManager.colors.background.ignoresSafeArea()

            if viewModel.isLoading {
                LoadingView()
            } else {
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(viewModel.allEvents.filter { $0.category == category }) { event in
                            NavigationLink(destination: EventDetailView(eventId: event.id)) {
                                EventListRow(event: event)
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(16)
                }
            }
        }
        .navigationTitle(category.displayName)
        .task {
            await viewModel.loadEvents(userId: userIdentityManager.userId)
        }
    }
}

struct AllEventsListView: View {
    let title: String
    let events: [Event]
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        ZStack {
            themeManager.colors.background.ignoresSafeArea()

            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(events) { event in
                        NavigationLink(destination: EventDetailView(eventId: event.id)) {
                            EventListRow(event: event)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(16)
            }
        }
        .navigationTitle(title)
    }
}

#Preview {
    DiscoveryView()
        .environmentObject(AppState())
        .environmentObject(UserIdentityManager.shared)
        .environmentObject(OptimizelyManager.shared)
        .environmentObject(ThemeManager.shared)
}
