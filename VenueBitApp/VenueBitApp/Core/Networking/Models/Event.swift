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
        case .sports: return sportIcon
        case .theater: return "theatermasks"
        case .comedy: return "face.smiling"
        }
    }

    /// Returns the appropriate SF Symbol for the specific sport
    private var sportIcon: String {
        let titleLower = title.lowercased()

        // Basketball
        if titleLower.contains("lakers") || titleLower.contains("celtics") ||
           titleLower.contains("warriors") || titleLower.contains("clippers") ||
           titleLower.contains("mavericks") {
            return "basketball.fill"
        }

        // Baseball
        if titleLower.contains("dodgers") || titleLower.contains("yankees") ||
           titleLower.contains("giants") && !titleLower.contains("49ers") {
            return "baseball.fill"
        }

        // Football (NFL & College)
        if titleLower.contains("rams") || titleLower.contains("49ers") ||
           titleLower.contains("chargers") || titleLower.contains("chiefs") ||
           titleLower.contains("usc") || titleLower.contains("ucla") ||
           titleLower.contains("football") {
            return "football.fill"
        }

        // Hockey
        if titleLower.contains("kings") && titleLower.contains("golden knights") ||
           titleLower.contains("hockey") || titleLower.contains("nhl") {
            return "hockey.puck.fill"
        }

        // Soccer/MLS
        if titleLower.contains("lafc") || titleLower.contains("galaxy") ||
           titleLower.contains("tráfico") || titleLower.contains("mls") {
            return "soccerball"
        }

        // MMA/UFC
        if titleLower.contains("ufc") || titleLower.contains("mma") {
            return "figure.boxing"
        }

        return "sportscourt"
    }

    /// Returns the appropriate emoji for the specific sport
    var sportEmoji: String {
        let titleLower = title.lowercased()

        // Basketball
        if titleLower.contains("lakers") || titleLower.contains("celtics") ||
           titleLower.contains("warriors") || titleLower.contains("clippers") ||
           titleLower.contains("mavericks") {
            return "🏀"
        }

        // Baseball
        if titleLower.contains("dodgers") || titleLower.contains("yankees") ||
           titleLower.contains("giants") && !titleLower.contains("49ers") {
            return "⚾"
        }

        // Football (NFL & College)
        if titleLower.contains("rams") || titleLower.contains("49ers") ||
           titleLower.contains("chargers") || titleLower.contains("chiefs") ||
           titleLower.contains("usc") || titleLower.contains("ucla") ||
           titleLower.contains("football") {
            return "🏈"
        }

        // Hockey
        if titleLower.contains("kings") && titleLower.contains("golden knights") ||
           titleLower.contains("hockey") || titleLower.contains("nhl") {
            return "🏒"
        }

        // Soccer/MLS
        if titleLower.contains("lafc") || titleLower.contains("galaxy") ||
           titleLower.contains("tráfico") || titleLower.contains("mls") {
            return "⚽"
        }

        // MMA/UFC
        if titleLower.contains("ufc") || titleLower.contains("mma") {
            return "🥊"
        }

        return "🏟️"
    }

    /// Returns the appropriate emoji for this event's category (sport-aware)
    var displayEmoji: String {
        if category == .sports {
            return sportEmoji
        }
        return category.icon
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
        title: "Beyoncé - Renaissance World Tour",
        category: .concerts,
        performer: "Beyoncé",
        date: "2025-08-15",
        time: "19:00",
        venueId: "ven_001",
        venueName: "SoFi Stadium",
        city: "Los Angeles",
        state: "CA",
        description: "Queen Bey brings her groundbreaking Renaissance World Tour to LA",
        imageUrl: "https://picsum.photos/400/300",
        featured: true,
        minPrice: 149,
        maxPrice: 999,
        availableSeats: 1000
    )
}
