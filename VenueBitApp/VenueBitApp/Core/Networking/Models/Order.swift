import Foundation

struct Order: Codable, Identifiable {
    let id: String
    let userId: String
    let status: OrderStatus
    let items: [CartItem]
    let subtotal: Double
    let fees: Double
    let total: Double
    let tickets: [Ticket]
    let createdAt: String
}

enum OrderStatus: String, Codable {
    case pending
    case confirmed
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
