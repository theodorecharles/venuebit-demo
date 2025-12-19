import SwiftUI

struct GenerateUserButton: View {
    @EnvironmentObject var userManager: UserIdentityManager
    @EnvironmentObject var optimizelyManager: OptimizelyManager
    @State private var showingAlert = false
    @State private var previousVariation: String = ""
    @State private var newVariation: String = ""

    var body: some View {
        Button(action: generateNewUser) {
            HStack(spacing: 8) {
                Image(systemName: "arrow.triangle.2.circlepath")
                    .font(.system(size: 14, weight: .semibold))
                Text("New User")
                    .font(.subheadline.bold())
            }
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(
                LinearGradient(
                    colors: [Color.indigo, Color.indigo.opacity(0.8)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .cornerRadius(24)
            .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
        }
        .alert("New User Generated", isPresented: $showingAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text("User ID: \(userManager.userId)\n\nVariation: \(previousVariation) → \(newVariation)")
        }
    }

    private func generateNewUser() {
        previousVariation = optimizelyManager.currentDecision.variationKey
        userManager.generateNewUserId()

        // Small delay to let Optimizely re-evaluate
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            newVariation = optimizelyManager.currentDecision.variationKey
            showingAlert = true
        }
    }
}

#Preview {
    ZStack {
        Color.black.ignoresSafeArea()
        GenerateUserButton()
            .environmentObject(UserIdentityManager.shared)
            .environmentObject(OptimizelyManager.shared)
    }
}
