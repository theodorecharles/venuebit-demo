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

// Custom colors extension
extension Color {
    static let slate400 = Color(red: 148/255, green: 163/255, blue: 184/255)
    static let slate500 = Color(red: 100/255, green: 116/255, blue: 139/255)
    static let slate700 = Color(red: 51/255, green: 65/255, blue: 85/255)
    static let slate800 = Color(red: 30/255, green: 41/255, blue: 59/255)
    static let slate900 = Color(red: 15/255, green: 23/255, blue: 42/255)
    static let indigo300 = Color(red: 165/255, green: 180/255, blue: 252/255)
    static let indigo400 = Color(red: 129/255, green: 140/255, blue: 248/255)
    static let indigo500 = Color(red: 99/255, green: 102/255, blue: 241/255)
    static let slate300 = Color(red: 203/255, green: 213/255, blue: 225/255)
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

extension Event {
    static let preview = Event(
        id: "evt_001",
        title: "Taylor Swift - Eras Tour",
        category: .concerts,
        performer: Performer(id: "prf_001", name: "Taylor Swift", imageUrl: ""),
        venue: Venue(id: "ven_001", name: "SoFi Stadium", address: nil, city: "Los Angeles", state: "CA", zipCode: nil, capacity: 70000, type: .stadium),
        dateTime: "2025-08-15T19:30:00Z",
        priceRange: PriceRange(min: 99, max: 899),
        imageUrl: "https://picsum.photos/400/300",
        description: "Experience the record-breaking Eras Tour",
        status: .onSale,
        featured: true
    )
}
