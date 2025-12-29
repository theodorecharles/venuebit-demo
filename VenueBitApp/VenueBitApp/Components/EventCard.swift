import SwiftUI

struct EventCard: View {
    let event: Event
    var isCompact: Bool = false
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            ZStack(alignment: .topTrailing) {
                CachedAsyncImage(url: URL(string: event.fullImageUrl)) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(themeManager.colors.surfaceSecondary)
                        .overlay(
                            ProgressView()
                                .tint(themeManager.colors.textPrimary)
                        )
                }
                .frame(height: isCompact ? 120 : 160)
                .clipped()

                // Category badge
                Text(event.displayEmoji)
                    .font(.caption)
                    .padding(6)
                    .background(themeManager.colors.surface.opacity(0.9))
                    .cornerRadius(8)
                    .padding(8)
            }

            // Content
            VStack(alignment: .leading, spacing: 4) {
                Text(event.title)
                    .font(isCompact ? .subheadline.bold() : .headline.bold())
                    .foregroundColor(themeManager.colors.textPrimary)
                    .lineLimit(2)

                Text(event.venue.name)
                    .font(.caption)
                    .foregroundColor(themeManager.colors.textSecondary)
                    .lineLimit(1)

                HStack {
                    Text(event.formattedDate)
                        .font(.caption2)
                        .foregroundColor(themeManager.colors.textTertiary)

                    Spacer()

                    Text(event.priceRange.minFormatted)
                        .font(.caption.bold())
                        .foregroundColor(themeManager.colors.primaryLight)
                }
            }
            .padding(12)
        }
        .background(themeManager.colors.surface)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.2), radius: 4, x: 0, y: 2)
    }
}

struct FeaturedEventCard: View {
    let event: Event
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        CachedAsyncImage(url: URL(string: event.fullImageUrl)) { image in
            image
                .resizable()
                .aspectRatio(contentMode: .fill)
        } placeholder: {
            Rectangle()
                .fill(themeManager.colors.surfaceSecondary)
                .overlay(ProgressView().tint(themeManager.colors.textPrimary))
        }
        .frame(height: 220)
        .overlay(alignment: .bottomLeading) {
            // Gradient overlay
            LinearGradient(
                colors: [.clear, .black.opacity(0.8)],
                startPoint: .top,
                endPoint: .bottom
            )
        }
        .overlay(alignment: .bottomLeading) {
            // Content
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(event.displayEmoji)
                    Text(event.category.displayName)
                        .font(.caption.bold())
                        .textCase(.uppercase)
                }
                .foregroundColor(themeManager.colors.primaryLight)

                Text(event.title)
                    .font(.title2.bold())
                    .foregroundColor(.white)
                    .lineLimit(2)

                HStack {
                    Image(systemName: "mappin")
                    Text(event.venue.name)
                }
                .font(.caption)
                .foregroundColor(.white.opacity(0.8))

                HStack {
                    Image(systemName: "calendar")
                    Text(event.formattedDate)
                    Spacer()
                    Text(event.priceRange.minFormatted)
                        .font(.subheadline.bold())
                        .foregroundColor(themeManager.colors.primaryLight)
                }
                .font(.caption)
                .foregroundColor(.white.opacity(0.8))
            }
            .padding(16)
        }
        .clipShape(RoundedRectangle(cornerRadius: 16))
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
    .environmentObject(ThemeManager.shared)
}
