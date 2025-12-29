import SwiftUI

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 64))
                .foregroundColor(themeManager.colors.textTertiary)

            Text(title)
                .font(.title2.bold())
                .foregroundColor(themeManager.colors.textPrimary)

            Text(message)
                .font(.subheadline)
                .foregroundColor(themeManager.colors.textSecondary)
                .multilineTextAlignment(.center)
        }
        .padding(32)
    }
}

#Preview {
    ZStack {
        Color.slate900.ignoresSafeArea()
        EmptyStateView(
            icon: "ticket",
            title: "No Tickets Yet",
            message: "Your purchased tickets will appear here"
        )
        .environmentObject(ThemeManager.shared)
    }
}
