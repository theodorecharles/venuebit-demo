import SwiftUI

struct EventCard: View {
    let event: Event
    var isCompact: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            ZStack(alignment: .topTrailing) {
                CachedAsyncImage(url: URL(string: event.imageUrl)) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Color.slate700)
                        .overlay(
                            ProgressView()
                                .tint(.white)
                        )
                }
                .frame(height: isCompact ? 120 : 160)
                .clipped()

                // Category badge
                Text(event.displayEmoji)
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
            CachedAsyncImage(url: URL(string: event.imageUrl)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Color.slate700)
                    .overlay(ProgressView().tint(.white))
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
                    Text(event.displayEmoji)
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

// MARK: - Cached Async Image

/// A cached version of AsyncImage that properly persists images across view reappearances
struct CachedAsyncImage<Content: View, Placeholder: View>: View {
    let url: URL?
    let content: (Image) -> Content
    let placeholder: () -> Placeholder

    @State private var image: UIImage?
    @State private var loadTask: Task<Void, Never>?

    init(
        url: URL?,
        @ViewBuilder content: @escaping (Image) -> Content,
        @ViewBuilder placeholder: @escaping () -> Placeholder
    ) {
        self.url = url
        self.content = content
        self.placeholder = placeholder
    }

    var body: some View {
        Group {
            if let image = image {
                content(Image(uiImage: image))
            } else {
                placeholder()
            }
        }
        .onAppear {
            loadImageIfNeeded()
        }
    }

    private func loadImageIfNeeded() {
        // Already have image
        if image != nil { return }

        guard let url = url else { return }

        // Check cache first
        if let cached = ImageCache.shared.get(for: url) {
            self.image = cached
            return
        }

        // Cancel any existing task
        loadTask?.cancel()

        // Start new load task
        loadTask = Task {
            do {
                let (data, _) = try await URLSession.shared.data(from: url)
                if Task.isCancelled { return }

                if let uiImage = UIImage(data: data) {
                    ImageCache.shared.set(uiImage, for: url)
                    await MainActor.run {
                        self.image = uiImage
                    }
                }
            } catch {
                // Silently fail - placeholder will remain shown
            }
        }
    }
}

/// Simple in-memory image cache
class ImageCache {
    static let shared = ImageCache()

    private var cache = NSCache<NSURL, UIImage>()

    private init() {
        cache.countLimit = 100
        cache.totalCostLimit = 50 * 1024 * 1024 // 50MB
    }

    func get(for url: URL) -> UIImage? {
        return cache.object(forKey: url as NSURL)
    }

    func set(_ image: UIImage, for url: URL) {
        cache.setObject(image, forKey: url as NSURL)
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
