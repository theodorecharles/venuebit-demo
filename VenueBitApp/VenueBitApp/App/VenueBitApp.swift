import SwiftUI

@main
struct VenueBitApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var userIdentityManager = UserIdentityManager.shared
    @StateObject private var optimizelyManager = OptimizelyManager.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(userIdentityManager)
                .environmentObject(optimizelyManager)
                .preferredColorScheme(.dark)
                .task {
                    await optimizelyManager.initialize()
                }
        }
    }
}
