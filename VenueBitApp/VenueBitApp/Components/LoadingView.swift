import SwiftUI

struct LoadingView: View {
    var message: String = "Loading..."
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.2)
                .tint(themeManager.colors.primaryLight)

            Text(message)
                .font(.subheadline)
                .foregroundColor(themeManager.colors.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(themeManager.colors.background)
    }
}

struct ErrorView: View {
    let message: String
    var retryAction: (() -> Void)?
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundColor(.orange)

            Text("Something went wrong")
                .font(.headline)
                .foregroundColor(themeManager.colors.textPrimary)

            Text(message)
                .font(.subheadline)
                .foregroundColor(themeManager.colors.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            if let retryAction = retryAction {
                Button(action: retryAction) {
                    HStack {
                        Image(systemName: "arrow.clockwise")
                        Text("Try Again")
                    }
                    .font(.subheadline.bold())
                    .foregroundColor(.white)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(themeManager.colors.primary)
                    .cornerRadius(8)
                }
                .padding(.top, 8)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(themeManager.colors.background)
    }
}

#Preview {
    VStack {
        LoadingView()
        ErrorView(message: "Network connection failed") {
            print("Retry tapped")
        }
    }
    .environmentObject(ThemeManager.shared)
}
