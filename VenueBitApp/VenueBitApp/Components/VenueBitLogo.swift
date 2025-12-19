import SwiftUI

struct VenueBitLogo: View {
    var size: CGFloat = 28

    var body: some View {
        Text("VenueBit")
            .font(.custom("Pacifico-Regular", size: size))
            .foregroundStyle(
                LinearGradient(
                    colors: [
                        Color(red: 129/255, green: 140/255, blue: 248/255), // indigo-400
                        Color(red: 244/255, green: 114/255, blue: 182/255)  // pink-400
                    ],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
    }
}

#Preview {
    ZStack {
        Color.slate900.ignoresSafeArea()
        VStack(spacing: 20) {
            VenueBitLogo(size: 24)
            VenueBitLogo(size: 32)
            VenueBitLogo(size: 40)
        }
    }
}
