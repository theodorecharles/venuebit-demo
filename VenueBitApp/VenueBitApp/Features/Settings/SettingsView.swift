import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var optimizelyManager: OptimizelyManager
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        NavigationStack {
            ZStack {
                themeManager.colors.background.ignoresSafeArea()

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
    @EnvironmentObject var themeManager: ThemeManager
    @State private var showCopiedAlert = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                Image(systemName: "flask")
                    .foregroundColor(themeManager.colors.primaryLight)
                Text("OPTIMIZELY DEBUG")
                    .font(.caption.bold())
                    .foregroundColor(themeManager.colors.primaryLight)
            }

            // User ID section
            VStack(alignment: .leading, spacing: 8) {
                Text("User ID")
                    .font(.caption)
                    .foregroundColor(themeManager.colors.textSecondary)

                HStack {
                    Text(userManager.userId)
                        .font(.system(.subheadline, design: .monospaced))
                        .foregroundColor(themeManager.colors.textPrimary)

                    Spacer()

                    Button(action: copyUserId) {
                        Image(systemName: "doc.on.doc")
                            .foregroundColor(themeManager.colors.textSecondary)
                    }
                }
                .padding(12)
                .background(themeManager.colors.surfaceSecondary)
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
                    .background(themeManager.colors.primary)
                    .cornerRadius(8)
                }
            }

            Divider()
                .background(themeManager.colors.border)

            // All Features section
            VStack(alignment: .leading, spacing: 16) {
                Text("Feature Flags")
                    .font(.subheadline.bold())
                    .foregroundColor(themeManager.colors.textPrimary)

                if optimizelyManager.allFeatures.isEmpty {
                    Text("No features loaded")
                        .font(.caption)
                        .foregroundColor(themeManager.colors.textTertiary)
                } else {
                    ForEach(Array(optimizelyManager.allFeatures.keys.sorted()), id: \.self) { featureKey in
                        if let feature = optimizelyManager.allFeatures[featureKey] {
                            FeatureFlagSection(name: featureKey, feature: feature)
                        }
                    }
                }
            }

            Divider()
                .background(themeManager.colors.border)

            // Recent events
            VStack(alignment: .leading, spacing: 8) {
                Text("Recent Events Tracked")
                    .font(.caption)
                    .foregroundColor(themeManager.colors.textSecondary)

                if appState.recentEvents.isEmpty {
                    Text("No events tracked yet")
                        .font(.caption)
                        .foregroundColor(themeManager.colors.textTertiary)
                        .padding(12)
                } else {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(appState.recentEvents.prefix(5)) { event in
                            HStack {
                                Text("• \(event.eventKey)")
                                    .foregroundColor(themeManager.colors.textPrimary)
                                Spacer()
                                Text(event.timeAgo)
                                    .foregroundColor(themeManager.colors.textTertiary)
                            }
                            .font(.caption)
                        }
                    }
                    .padding(12)
                    .background(themeManager.colors.surfaceSecondary)
                    .cornerRadius(8)
                }
            }
        }
        .padding(16)
        .background(themeManager.colors.surface)
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

struct FeatureFlagSection: View {
    let name: String
    let feature: FeatureDecisionInfo
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Feature name
            Text(name)
                .font(.caption.bold())
                .foregroundColor(themeManager.colors.primaryLight)

            // Status and Variation
            HStack {
                HStack(spacing: 4) {
                    Circle()
                        .fill(feature.enabled ? Color.green : Color.red)
                        .frame(width: 8, height: 8)
                    Text(feature.enabled ? "Enabled" : "Disabled")
                        .foregroundColor(feature.enabled ? .green : .red)
                }

                Spacer()

                Text("Variation: \(feature.variationKey)")
                    .foregroundColor(themeManager.colors.textSecondary)
            }
            .font(.caption)

            // Variables
            if !feature.variables.isEmpty {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(Array(feature.variables.keys.sorted()), id: \.self) { varKey in
                        if let varValue = feature.variables[varKey] {
                            HStack {
                                Text("• \(varKey):")
                                    .foregroundColor(themeManager.colors.textSecondary)
                                Spacer()
                                Text(varValue)
                                    .foregroundColor(varValue == "true" ? .green : (varValue == "false" ? .red : themeManager.colors.primaryLight))
                            }
                            .font(.caption2)
                        }
                    }
                }
            }
        }
        .padding(12)
        .background(themeManager.colors.surfaceSecondary)
        .cornerRadius(8)
    }
}

struct VariableRow: View {
    let name: String
    let value: Any
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        HStack {
            Text("• \(name):")
                .foregroundColor(themeManager.colors.textSecondary)

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
                    .foregroundColor(themeManager.colors.primaryLight)
            }
        }
        .font(.caption)
    }
}

struct AboutSection: View {
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("ABOUT")
                .font(.caption.bold())
                .foregroundColor(themeManager.colors.textSecondary)

            VStack(spacing: 0) {
                AboutRow(label: "App Version", value: "1.0.0")
                Divider().background(themeManager.colors.border)
                AboutRow(label: "Build", value: "Demo")
                Divider().background(themeManager.colors.border)
                AboutRow(label: "Platform", value: "iOS")
            }
            .background(themeManager.colors.surface)
            .cornerRadius(12)
        }
    }
}

struct AboutRow: View {
    let label: String
    let value: String
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(themeManager.colors.textSecondary)
            Spacer()
            Text(value)
                .foregroundColor(themeManager.colors.textTertiary)
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
        .environmentObject(ThemeManager.shared)
}
