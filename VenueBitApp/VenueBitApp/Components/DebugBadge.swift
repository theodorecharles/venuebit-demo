import SwiftUI

struct DebugBadge: View {
    @EnvironmentObject var optimizelyManager: OptimizelyManager

    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(optimizelyManager.currentDecision.isEnhanced ? Color.green : Color.blue)
                .frame(width: 8, height: 8)

            Text(optimizelyManager.currentDecision.variationKey)
                .font(.caption2.bold())
                .foregroundColor(.white)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Color.slate700.opacity(0.9))
        .cornerRadius(12)
    }
}

struct DebugBanner: View {
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var optimizelyManager: OptimizelyManager

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "flask")
                .foregroundColor(.slate400)

            Text("User:")
                .foregroundColor(.slate400)

            Text(userManager.userId)
                .font(.system(.caption, design: .monospaced))
                .foregroundColor(.white)

            Spacer()

            VariationBadge(variation: optimizelyManager.currentDecision.variationKey)
        }
        .font(.caption)
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(Color.slate800)
    }
}

struct VariationBadge: View {
    let variation: String

    var isEnhanced: Bool {
        variation == "enhanced"
    }

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(isEnhanced ? Color.green : Color.blue)
                .frame(width: 6, height: 6)

            Text(variation)
                .font(.caption.bold())
        }
        .foregroundColor(isEnhanced ? .green : .blue)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(
            (isEnhanced ? Color.green : Color.blue).opacity(0.2)
        )
        .cornerRadius(8)
    }
}

#Preview {
    VStack {
        DebugBanner()
        Spacer()
        DebugBadge()
    }
    .background(Color.slate900)
    .environmentObject(UserIdentityManager.shared)
    .environmentObject(OptimizelyManager.shared)
}
