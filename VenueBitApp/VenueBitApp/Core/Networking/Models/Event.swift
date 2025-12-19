import Foundation

struct Event: Codable, Identifiable {
    let id: String
    let title: String
    let category: EventCategory
    let performer: String
    let date: String
    let time: String
    let venueId: String
    let venueName: String
    let city: String
    let state: String
    let description: String
    let imageUrl: String
    let featured: Bool
    let minPrice: Double
    let maxPrice: Double
    let availableSeats: Int

    var formattedDate: String {
        // Parse "2025-08-15" format
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let dateObj = formatter.date(from: date) else { return date }

        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "EEEE, MMMM d, yyyy"
        return displayFormatter.string(from: dateObj)
    }

    var formattedTime: String {
        // Parse "19:00" format
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        guard let timeObj = formatter.date(from: time) else { return time }

        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "h:mm a"
        return displayFormatter.string(from: timeObj)
    }

    var formattedDateTime: String {
        "\(formattedDate) • \(formattedTime)"
    }

    var categoryIcon: String {
        switch category {
        case .concerts: return "music.note"
        case .sports: return "sportscourt"
        case .theater: return "theatermasks"
        case .comedy: return "face.smiling"
        }
    }

    var priceRange: PriceRange {
        PriceRange(min: minPrice, max: maxPrice)
    }

    var venue: VenueInfo {
        VenueInfo(id: venueId, name: venueName, city: city, state: state)
    }
}

struct VenueInfo {
    let id: String
    let name: String
    let city: String
    let state: String

    var cityState: String {
        "\(city), \(state)"
    }
}

enum EventCategory: String, Codable, CaseIterable {
    case concerts
    case sports
    case theater
    case comedy

    var displayName: String {
        rawValue.capitalized
    }

    var icon: String {
        switch self {
        case .concerts: return "🎵"
        case .sports: return "⚽"
        case .theater: return "🎭"
        case .comedy: return "😂"
        }
    }
}

struct PriceRange {
    let min: Double
    let max: Double

    var formatted: String {
        "$\(Int(min)) - $\(Int(max))"
    }

    var minFormatted: String {
        "From $\(Int(min))"
    }
}

extension Event {
    static let preview = Event(
        id: "evt_001",
        title: "Taylor Swift - Eras Tour",
        category: .concerts,
        performer: "Taylor Swift",
        date: "2025-08-15",
        time: "19:30",
        venueId: "ven_001",
        venueName: "SoFi Stadium",
        city: "Los Angeles",
        state: "CA",
        description: "Experience the record-breaking Eras Tour",
        imageUrl: "https://picsum.photos/400/300",
        featured: true,
        minPrice: 99,
        maxPrice: 899,
        availableSeats: 1000
    )
}
