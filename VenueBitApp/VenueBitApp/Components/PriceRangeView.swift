import SwiftUI

struct PriceRangeView: View {
    let priceRange: PriceRange

    var body: some View {
        HStack(spacing: 4) {
            Text("$")
                .foregroundColor(.slate400)
            Text("\(Int(priceRange.min))")
                .foregroundColor(.white)
            Text("-")
                .foregroundColor(.slate400)
            Text("$\(Int(priceRange.max))")
                .foregroundColor(.white)
        }
        .font(.subheadline.bold())
    }
}

struct PriceTag: View {
    let price: Double
    var label: String? = nil

    var body: some View {
        VStack(alignment: .trailing, spacing: 2) {
            if let label = label {
                Text(label)
                    .font(.caption2)
                    .foregroundColor(.slate400)
            }
            Text("$\(Int(price))")
                .font(.headline.bold())
                .foregroundColor(.indigo400)
        }
    }
}

#Preview {
    VStack(spacing: 20) {
        PriceRangeView(priceRange: PriceRange(min: 99, max: 899))
        PriceTag(price: 299, label: "From")
        PriceTag(price: 598)
    }
    .padding()
    .background(Color.slate900)
}
