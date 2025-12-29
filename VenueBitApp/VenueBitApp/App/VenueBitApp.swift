import SwiftUI

@main
struct VenueBitApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var userIdentityManager = UserIdentityManager.shared
    @StateObject private var optimizelyManager = OptimizelyManager.shared
    @StateObject private var themeManager = ThemeManager.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(userIdentityManager)
                .environmentObject(optimizelyManager)
                .environmentObject(themeManager)
                .preferredColorScheme(themeManager.colors.isDark ? .dark : .light)
                .task {
                    await optimizelyManager.initialize()
                }
        }
    }
}
