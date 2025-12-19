import Foundation

struct Event: Codable, Identifiable {
    let id: String
    let title: String
    let category: EventCategory
    let performer: Performer
    let venue: Venue
    let dateTime: String
    let priceRange: PriceRange
    let imageUrl: String
    let description: String
    let status: EventStatus
    let featured: Bool

    var formattedDate: String {
        let formatter = ISO8601DateFormatter()
        guard let date = formatter.date(from: dateTime) else { return dateTime }

        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "EEEE, MMMM d, yyyy"
        return displayFormatter.string(from: date)
    }

    var formattedTime: String {
        let formatter = ISO8601DateFormatter()
        guard let date = formatter.date(from: dateTime) else { return "" }

        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "h:mm a"
        return displayFormatter.string(from: date)
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

enum EventStatus: String, Codable {
    case onSale = "on_sale"
    case soldOut = "sold_out"
    case cancelled
    case postponed
}

struct Performer: Codable {
    let id: String
    let name: String
    let imageUrl: String
}

struct PriceRange: Codable {
    let min: Double
    let max: Double

    var formatted: String {
        "$\(Int(min)) - $\(Int(max))"
    }

    var minFormatted: String {
        "From $\(Int(min))"
    }
}
