import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var optimizelyManager: OptimizelyManager
    @EnvironmentObject var appState: AppState

    var body: some View {
        NavigationStack {
            ZStack {
                Color.slate900.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 20) {
                        // Debug Panel
                        DebugPanelView()

                        // About section
                        AboutSection()
                    }
                    .padding(16)
                    .padding(.bottom, 100)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

struct DebugPanelView: View {
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var optimizelyManager: OptimizelyManager
    @EnvironmentObject var appState: AppState
    @State private var showCopiedAlert = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                Image(systemName: "flask")
                    .foregroundColor(.indigo400)
                Text("OPTIMIZELY DEBUG")
                    .font(.caption.bold())
                    .foregroundColor(.indigo400)
            }

            // User ID section
            VStack(alignment: .leading, spacing: 8) {
                Text("User ID")
                    .font(.caption)
                    .foregroundColor(.slate400)

                HStack {
                    Text(userManager.userId)
                        .font(.system(.subheadline, design: .monospaced))
                        .foregroundColor(.white)

                    Spacer()

                    Button(action: copyUserId) {
                        Image(systemName: "doc.on.doc")
                            .foregroundColor(.slate400)
                    }
                }
                .padding(12)
                .background(Color.slate700)
                .cornerRadius(8)

                Button(action: generateNewUser) {
                    HStack {
                        Image(systemName: "arrow.triangle.2.circlepath")
                        Text("Generate New User ID")
                    }
                    .font(.subheadline.bold())
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(12)
                    .background(Color.indigo500)
                    .cornerRadius(8)
                }
            }

            Divider()
                .background(Color.slate700)

            // Feature flag section
            VStack(alignment: .leading, spacing: 12) {
                Text("Feature: ticket_experience")
                    .font(.subheadline.bold())
                    .foregroundColor(.white)

                // Status
                HStack {
                    Text("Status:")
                        .foregroundColor(.slate400)
                    HStack(spacing: 4) {
                        Circle()
                            .fill(optimizelyManager.currentDecision.enabled ? Color.green : Color.red)
                            .frame(width: 8, height: 8)
                        Text(optimizelyManager.currentDecision.enabled ? "Enabled" : "Disabled")
                            .foregroundColor(optimizelyManager.currentDecision.enabled ? .green : .red)
                    }
                }
                .font(.caption)

                // Variation
                HStack {
                    Text("Variation:")
                        .foregroundColor(.slate400)
                    Text(optimizelyManager.currentDecision.variationKey)
                        .foregroundColor(optimizelyManager.currentDecision.isEnhanced ? .green : .blue)
                        .bold()
                }
                .font(.caption)

                // Variables
                VStack(alignment: .leading, spacing: 6) {
                    Text("Variables:")
                        .font(.caption)
                        .foregroundColor(.slate400)

                    VariableRow(
                        name: "show_seat_preview",
                        value: optimizelyManager.currentDecision.showSeatPreview
                    )
                    VariableRow(
                        name: "show_recommendations",
                        value: optimizelyManager.currentDecision.showRecommendations
                    )
                    VariableRow(
                        name: "checkout_layout",
                        value: optimizelyManager.currentDecision.checkoutLayout
                    )
                    VariableRow(
                        name: "show_urgency_banner",
                        value: optimizelyManager.currentDecision.showUrgencyBanner
                    )
                }
                .padding(12)
                .background(Color.slate700)
                .cornerRadius(8)
            }

            Divider()
                .background(Color.slate700)

            // Recent events
            VStack(alignment: .leading, spacing: 8) {
                Text("Recent Events Tracked")
                    .font(.caption)
                    .foregroundColor(.slate400)

                if appState.recentEvents.isEmpty {
                    Text("No events tracked yet")
                        .font(.caption)
                        .foregroundColor(.slate500)
                        .padding(12)
                } else {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(appState.recentEvents.prefix(5)) { event in
                            HStack {
                                Text("• \(event.eventKey)")
                                    .foregroundColor(.white)
                                Spacer()
                                Text(event.timeAgo)
                                    .foregroundColor(.slate500)
                            }
                            .font(.caption)
                        }
                    }
                    .padding(12)
                    .background(Color.slate700)
                    .cornerRadius(8)
                }
            }
        }
        .padding(16)
        .background(Color.slate800)
        .cornerRadius(12)
        .alert("Copied!", isPresented: $showCopiedAlert) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("User ID copied to clipboard")
        }
    }

    private func copyUserId() {
        UIPasteboard.general.string = userManager.userId
        showCopiedAlert = true
    }

    private func generateNewUser() {
        userManager.generateNewUserId()
    }
}

struct VariableRow: View {
    let name: String
    let value: Any

    var body: some View {
        HStack {
            Text("• \(name):")
                .foregroundColor(.slate300)

            Spacer()

            if let boolValue = value as? Bool {
                HStack(spacing: 4) {
                    Image(systemName: boolValue ? "checkmark" : "xmark")
                        .foregroundColor(boolValue ? .green : .red)
                    Text(boolValue ? "true" : "false")
                        .foregroundColor(boolValue ? .green : .red)
                }
            } else if let stringValue = value as? String {
                Text(stringValue)
                    .foregroundColor(.indigo300)
            }
        }
        .font(.caption)
    }
}

struct AboutSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("ABOUT")
                .font(.caption.bold())
                .foregroundColor(.slate400)

            VStack(spacing: 0) {
                AboutRow(label: "App Version", value: "1.0.0")
                Divider().background(Color.slate700)
                AboutRow(label: "Build", value: "Demo")
                Divider().background(Color.slate700)
                AboutRow(label: "Platform", value: "iOS")
            }
            .background(Color.slate800)
            .cornerRadius(12)
        }
    }
}

struct AboutRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(.slate300)
            Spacer()
            Text(value)
                .foregroundColor(.slate400)
        }
        .font(.subheadline)
        .padding(16)
    }
}

#Preview {
    SettingsView()
        .environmentObject(AppState())
        .environmentObject(UserIdentityManager.shared)
        .environmentObject(OptimizelyManager.shared)
}
