import Foundation

struct Order: Codable, Identifiable {
    let id: String
    let userId: String
    let status: OrderStatus
    let items: [OrderItem]
    let subtotal: Double
    let serviceFee: Double
    let total: Double
    let createdAt: String

    // Convert order items + seats to tickets for display
    var tickets: [Ticket] {
        items.flatMap { item in
            item.seats.map { seat in
                Ticket.fromOrderItem(item, seat: seat)
            }
        }
    }
}

enum OrderStatus: String, Codable {
    case pending
    case confirmed
    case completed
    case cancelled
    case refunded
}

struct CheckoutRequest: Codable {
    let cartId: String
    let userId: String
    let payment: PaymentInfo
}

struct PaymentInfo: Codable {
    let cardLast4: String
}

struct OrderResponse: Codable {
    let data: Order
}

struct OrdersListResponse: Codable {
    let data: [Order]
}
