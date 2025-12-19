import SwiftUI

struct EventCard: View {
    let event: Event
    var isCompact: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: event.imageUrl)) { phase in
                    switch phase {
                    case .empty:
                        Rectangle()
                            .fill(Color.slate700)
                            .overlay(
                                ProgressView()
                                    .tint(.white)
                            )
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure:
                        Rectangle()
                            .fill(Color.slate700)
                            .overlay(
                                Image(systemName: event.categoryIcon)
                                    .font(.largeTitle)
                                    .foregroundColor(.slate400)
                            )
                    @unknown default:
                        Rectangle()
                            .fill(Color.slate700)
                    }
                }
                .frame(height: isCompact ? 120 : 160)
                .clipped()

                // Category badge
                Text(event.category.icon)
                    .font(.caption)
                    .padding(6)
                    .background(Color.slate800.opacity(0.9))
                    .cornerRadius(8)
                    .padding(8)
            }

            // Content
            VStack(alignment: .leading, spacing: 4) {
                Text(event.title)
                    .font(isCompact ? .subheadline.bold() : .headline.bold())
                    .foregroundColor(.white)
                    .lineLimit(2)

                Text(event.venue.name)
                    .font(.caption)
                    .foregroundColor(.slate400)
                    .lineLimit(1)

                HStack {
                    Text(event.formattedDate)
                        .font(.caption2)
                        .foregroundColor(.slate500)

                    Spacer()

                    Text(event.priceRange.minFormatted)
                        .font(.caption.bold())
                        .foregroundColor(.indigo400)
                }
            }
            .padding(12)
        }
        .background(Color.slate800)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.2), radius: 4, x: 0, y: 2)
    }
}

struct FeaturedEventCard: View {
    let event: Event

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            // Background image
            AsyncImage(url: URL(string: event.imageUrl)) { phase in
                switch phase {
                case .empty:
                    Rectangle()
                        .fill(Color.slate700)
                        .overlay(ProgressView().tint(.white))
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                case .failure:
                    Rectangle()
                        .fill(Color.slate700)
                        .overlay(
                            Image(systemName: event.categoryIcon)
                                .font(.system(size: 60))
                                .foregroundColor(.slate500)
                        )
                @unknown default:
                    Rectangle().fill(Color.slate700)
                }
            }
            .frame(height: 220)
            .clipped()

            // Gradient overlay
            LinearGradient(
                colors: [.clear, .black.opacity(0.8)],
                startPoint: .top,
                endPoint: .bottom
            )

            // Content
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(event.category.icon)
                    Text(event.category.displayName)
                        .font(.caption.bold())
                        .textCase(.uppercase)
                }
                .foregroundColor(.indigo300)

                Text(event.title)
                    .font(.title2.bold())
                    .foregroundColor(.white)
                    .lineLimit(2)

                HStack {
                    Image(systemName: "mappin")
                    Text(event.venue.name)
                }
                .font(.caption)
                .foregroundColor(.slate300)

                HStack {
                    Image(systemName: "calendar")
                    Text(event.formattedDate)
                    Spacer()
                    Text(event.priceRange.minFormatted)
                        .font(.subheadline.bold())
                        .foregroundColor(.indigo300)
                }
                .font(.caption)
                .foregroundColor(.slate300)
            }
            .padding(16)
        }
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
    }
}

#Preview {
    ScrollView {
        VStack(spacing: 16) {
            FeaturedEventCard(event: .preview)
            EventCard(event: .preview)
            EventCard(event: .preview, isCompact: true)
        }
        .padding()
    }
    .background(Color.slate900)
}
