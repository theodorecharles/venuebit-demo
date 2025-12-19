import SwiftUI

struct SearchView: View {
    @StateObject private var viewModel = SearchViewModel()
    @EnvironmentObject var userManager: UserIdentityManager
    @State private var selectedCategory: EventCategory?

    var body: some View {
        NavigationStack {
            ZStack {
                Color.slate900.ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search bar
                    SearchBar(text: $viewModel.searchQuery)
                        .onChange(of: viewModel.searchQuery) { _, newValue in
                            // Search as user types (with small delay handled in view model)
                            Task {
                                try? await Task.sleep(nanoseconds: 300_000_000) // 0.3s debounce
                                if viewModel.searchQuery == newValue {
                                    await viewModel.search(userId: userManager.userId)
                                }
                            }
                        }

                    // Category filter
                    CategorySelector(selectedCategory: $selectedCategory)
                        .padding(.vertical, 12)

                    // Results
                    if viewModel.isLoading {
                        Spacer()
                        LoadingView(message: "Searching...")
                        Spacer()
                    } else if viewModel.searchQuery.isEmpty && viewModel.results.isEmpty {
                        Spacer()
                        EmptyStateView(
                            icon: "magnifyingglass",
                            title: "Search Events",
                            message: "Find concerts, sports, theater, and more"
                        )
                        Spacer()
                    } else if viewModel.results.isEmpty && !viewModel.searchQuery.isEmpty {
                        Spacer()
                        EmptyStateView(
                            icon: "magnifyingglass",
                            title: "No Results",
                            message: "Try a different search term"
                        )
                        Spacer()
                    } else {
                        ScrollView {
                            LazyVStack(spacing: 12) {
                                ForEach(filteredResults) { event in
                                    NavigationLink(destination: EventDetailView(eventId: event.id)) {
                                        EventListRow(event: event)
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                }
                            }
                            .padding(16)
                            .padding(.bottom, 100)
                        }
                    }
                }
            }
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    DebugBadge()
                }
            }
        }
    }

    var filteredResults: [Event] {
        if let category = selectedCategory {
            return viewModel.results.filter { $0.category == category }
        }
        return viewModel.results
    }
}

struct SearchBar: View {
    @Binding var text: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.slate400)

            TextField("Search events, artists, venues...", text: $text)
                .foregroundColor(.white)
                .autocorrectionDisabled()

            if !text.isEmpty {
                Button(action: { text = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.slate400)
                }
            }
        }
        .padding(12)
        .background(Color.slate800)
        .cornerRadius(12)
        .padding(.horizontal, 16)
        .padding(.top, 8)
    }
}

#Preview {
    SearchView()
        .environmentObject(AppState())
        .environmentObject(UserIdentityManager.shared)
        .environmentObject(OptimizelyManager.shared)
}
