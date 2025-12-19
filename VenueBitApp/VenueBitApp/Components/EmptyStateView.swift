import SwiftUI

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 64))
                .foregroundColor(.slate600)

            Text(title)
                .font(.title2.bold())
                .foregroundColor(.white)

            Text(message)
                .font(.subheadline)
                .foregroundColor(.slate400)
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
    }
}
