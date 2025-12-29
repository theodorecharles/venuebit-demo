import SwiftUI

struct DiscoveryView: View {
    @StateObject private var viewModel = DiscoveryViewModel()
    @EnvironmentObject var optimizelyManager: OptimizelyManager
    @EnvironmentObject var userIdentityManager: UserIdentityManager

    var body: some View {
        NavigationStack {
            ZStack {
                Color.slate900.ignoresSafeArea()

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
                ToolbarItem(placement: .topBarTrailing) {
                    DebugBadge()
                }
            }
        }
        .task {
            await viewModel.loadEvents(userId: userIdentityManager.userId)
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
                        .fill(index == currentIndex ? Color.white : Color.slate500)
                        .frame(width: 8, height: 8)
                }
            }
        }
    }
}

struct CategoriesSection: View {
    var categories: [EventCategory] = EventCategory.allCases

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Categories")
                .font(.headline)
                .foregroundColor(.white)
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

    var body: some View {
        VStack(spacing: 8) {
            Text(category.icon)
                .font(.title)

            Text(category.displayName)
                .font(.caption.bold())
                .foregroundColor(.white)
        }
        .frame(width: 80, height: 80)
        .background(Color.slate700)
        .cornerRadius(12)
    }
}

struct EventsHorizontalSection: View {
    let title: String
    let events: [Event]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(title)
                    .font(.headline)
                    .foregroundColor(.white)

                Spacer()

                NavigationLink(destination: AllEventsListView(title: title, events: events)) {
                    Text("See All")
                        .font(.subheadline)
                        .foregroundColor(.indigo400)
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

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("All Events")
                .font(.headline)
                .foregroundColor(.white)
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

    var body: some View {
        HStack(spacing: 12) {
            CachedAsyncImage(url: URL(string: event.imageUrl)) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle().fill(Color.slate700)
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
                    .foregroundColor(.white)
                    .lineLimit(2)

                Text(event.venue.name)
                    .font(.caption)
                    .foregroundColor(.slate400)

                HStack {
                    Text(event.formattedDate)
                        .font(.caption2)
                        .foregroundColor(.slate500)

                    Spacer()

                    Text(event.priceRange.minFormatted)
                        .font(.caption.bold())
                        .foregroundColor(.indigo400)
                }
            }

            Image(systemName: "chevron.right")
                .foregroundColor(.slate500)
                .font(.caption)
        }
        .padding(12)
        .background(Color.slate800)
        .cornerRadius(12)
    }
}

// Placeholder views for navigation
struct CategoryEventsView: View {
    let category: EventCategory
    @StateObject private var viewModel = DiscoveryViewModel()
    @EnvironmentObject var userIdentityManager: UserIdentityManager

    var body: some View {
        ZStack {
            Color.slate900.ignoresSafeArea()

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

    var body: some View {
        ZStack {
            Color.slate900.ignoresSafeArea()

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
}
