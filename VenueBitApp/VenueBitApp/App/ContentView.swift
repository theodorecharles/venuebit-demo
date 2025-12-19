import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userIdentityManager: UserIdentityManager
    @EnvironmentObject var optimizelyManager: OptimizelyManager

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            TabView(selection: $appState.selectedTab) {
                DiscoveryView()
                    .tabItem {
                        Label("Discover", systemImage: "house.fill")
                    }
                    .tag(AppTab.discover)

                SearchView()
                    .tabItem {
                        Label("Search", systemImage: "magnifyingglass")
                    }
                    .tag(AppTab.search)

                MyTicketsView()
                    .tabItem {
                        Label("My Tickets", systemImage: "ticket.fill")
                    }
                    .tag(AppTab.myTickets)

                SettingsView()
                    .tabItem {
                        Label("Settings", systemImage: "gearshape.fill")
                    }
                    .tag(AppTab.settings)
            }
            .tint(.indigo)

            // Floating Action Button for Generate New User
            GenerateUserButton()
                .padding(.trailing, 20)
                .padding(.bottom, 100)
        }
    }
}

enum AppTab: Int {
    case discover = 0
    case search = 1
    case myTickets = 2
    case settings = 3
}

#Preview {
    ContentView()
        .environmentObject(AppState())
        .environmentObject(UserIdentityManager.shared)
        .environmentObject(OptimizelyManager.shared)
}
