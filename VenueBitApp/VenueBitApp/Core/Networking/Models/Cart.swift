import Foundation

struct Cart: Codable, Identifiable {
    let id: String
    let userId: String
    let items: [CartItemData]
    let createdAt: String
    let updatedAt: String
}

struct CartItemData: Codable, Identifiable {
    let id: String
    let eventId: String
    let eventTitle: String
    let eventDate: String
    let eventTime: String
    let venueName: String
    let seats: [CartSeat]
    let subtotal: Double

    var seatsDescription: String {
        if seats.isEmpty { return "" }
        let section = seats.first?.section ?? ""
        let row = seats.first?.row ?? ""
        let seatNumbers = seats.map { String($0.seatNumber) }.joined(separator: ", ")
        return "\(section), Row \(row), Seats \(seatNumbers)"
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
