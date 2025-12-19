import Foundation

struct Ticket: Codable, Identifiable {
    let id: String
    let eventId: String
    let eventTitle: String
    let eventDateTime: String
    let venueName: String
    let section: String
    let row: String
    let seat: Int
    let price: Double

    var seatDescription: String {
        "Section \(section), Row \(row), Seat \(seat)"
    }

    var formattedDate: String {
        let formatter = ISO8601DateFormatter()
        guard let date = formatter.date(from: eventDateTime) else { return eventDateTime }

        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "MMM d, yyyy • h:mm a"
        return displayFormatter.string(from: date)
    }
}

struct Seat: Codable, Identifiable {
    let id: String
    let sectionId: String
    let sectionName: String
    let row: String
    let number: Int
    let price: Double
    let status: SeatStatus
}

enum SeatStatus: String, Codable {
    case available
    case held
    case sold
}

struct Section: Codable, Identifiable {
    let id: String
    let name: String
    let rows: [SeatRow]
}

struct SeatRow: Codable {
    let row: String
    let seats: [Seat]
}

struct SeatsResponse: Codable {
    let eventId: String
    let sections: [Section]
}
