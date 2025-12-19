import SwiftUI

struct LoadingView: View {
    var message: String = "Loading..."

    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.2)
                .tint(.indigo400)

            Text(message)
                .font(.subheadline)
                .foregroundColor(.slate400)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.slate900)
    }
}

struct ErrorView: View {
    let message: String
    var retryAction: (() -> Void)?

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundColor(.orange)

            Text("Something went wrong")
                .font(.headline)
                .foregroundColor(.white)

            Text(message)
                .font(.subheadline)
                .foregroundColor(.slate400)
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
                    .background(Color.indigo500)
                    .cornerRadius(8)
                }
                .padding(.top, 8)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.slate900)
    }
}

#Preview {
    VStack {
        LoadingView()
        ErrorView(message: "Network connection failed") {
            print("Retry tapped")
        }
    }
}
