import Foundation

struct Ticket: Codable, Identifiable {
    let id: String
    let eventId: String
    let eventTitle: String
    let eventDate: String
    let eventTime: String
    let venueName: String
    let section: String
    let row: String
    let seatNumber: Int
    let price: Double

    var seatDescription: String {
        "Section \(section), Row \(row), Seat \(seatNumber)"
    }

    var formattedDate: String {
        // Try parsing the date
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: eventDate) else { return "\(eventDate) \(eventTime)" }

        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "MMM d, yyyy"
        return "\(displayFormatter.string(from: date)) • \(eventTime)"
    }

    // Create ticket from order item and seat
    static func fromOrderItem(_ item: OrderItem, seat: OrderSeat) -> Ticket {
        Ticket(
            id: seat.id,
            eventId: item.eventId,
            eventTitle: item.eventTitle,
            eventDate: item.eventDate,
            eventTime: item.eventTime,
            venueName: item.venueName,
            section: seat.section,
            row: seat.row,
            seatNumber: seat.seatNumber,
            price: seat.price
        )
    }
}

struct OrderSeat: Codable, Identifiable {
    let id: String
    let section: String
    let row: String
    let seatNumber: Int
    let price: Double
}

struct OrderItem: Codable, Identifiable {
    let id: String
    let eventId: String
    let eventTitle: String
    let eventDate: String
    let eventTime: String
    let venueName: String
    let seats: [OrderSeat]
    let subtotal: Double
}

struct CartSeat: Codable, Identifiable {
    let id: String
    let eventId: String
    let section: String
    let row: String
    let seatNumber: Int
    let price: Double
    let status: String
}

enum SeatStatus: String, Codable {
    case available
    case reserved
    case sold
}

// API response types for seats
struct SeatsResponse: Codable {
    let success: Bool
    let data: [APISeat]
    let count: Int
}

struct APISeat: Codable, Identifiable {
    let id: String
    let eventId: String
    let section: String
    let row: String
    let seatNumber: Int
    let price: Double
    let status: String
}
