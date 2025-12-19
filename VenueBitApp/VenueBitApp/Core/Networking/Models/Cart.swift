import Foundation

struct Cart: Codable, Identifiable {
    let id: String
    let userId: String
    let items: [CartItem]
    let subtotal: Double
    let fees: Double
    let total: Double
    let createdAt: String
    let expiresAt: String
}

struct CartItem: Codable, Identifiable {
    let id: String
    let eventId: String
    let eventTitle: String
    let eventDateTime: String
    let venueName: String
    let seats: [Seat]
    let subtotal: Double

    var seatsDescription: String {
        if seats.isEmpty { return "" }
        let sectionName = seats.first?.sectionName ?? ""
        let row = seats.first?.row ?? ""
        let seatNumbers = seats.map { String($0.number) }.joined(separator: ", ")
        return "\(sectionName), Row \(row), Seats \(seatNumbers)"
    }
}

struct CreateCartRequest: Codable {
    let userId: String
}

struct AddToCartRequest: Codable {
    let eventId: String
    let seatIds: [String]
}

struct CartResponse: Codable {
    let data: Cart
}
