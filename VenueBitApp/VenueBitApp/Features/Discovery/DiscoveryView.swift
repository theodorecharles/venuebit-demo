import SwiftUI

struct DiscoveryView: View {
    @StateObject private var viewModel = DiscoveryViewModel()
    @EnvironmentObject var optimizelyManager: OptimizelyManager

    var body: some View {
        NavigationStack {
            ZStack {
                Color.slate900.ignoresSafeArea()

                if viewModel.isLoading && viewModel.featuredEvents.isEmpty {
                    LoadingView(message: "Loading events...")
                } else if let error = viewModel.errorMessage {
                    ErrorView(message: error) {
                        Task { await viewModel.loadEvents() }
                    }
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 24) {
                            // Featured Events Carousel
                            if !viewModel.featuredEvents.isEmpty {
                                FeaturedEventsSection(events: viewModel.featuredEvents)
                            }

                            // Categories
                            CategoriesSection()

                            // Trending Now
                            if !viewModel.trendingEvents.isEmpty {
                                EventsHorizontalSection(
                                    title: "Trending Now",
                                    events: viewModel.trendingEvents
                                )
                            }

                            // This Weekend
                            if !viewModel.weekendEvents.isEmpty {
                                EventsHorizontalSection(
                                    title: "This Weekend",
                                    events: viewModel.weekendEvents
                                )
                            }

                            // All Events
                            if !viewModel.allEvents.isEmpty {
                                AllEventsSection(events: viewModel.allEvents)
                            }
                        }
                        .padding(.bottom, 100) // Space for FAB
                    }
                    .refreshable {
                        await viewModel.loadEvents()
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
            await viewModel.loadEvents()
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
            .frame(height: 230)
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
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Categories")
                .font(.headline)
                .foregroundColor(.white)
                .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(EventCategory.allCases, id: \.self) { category in
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
            await viewModel.loadEvents()
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
