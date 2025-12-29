import Foundation

class APIClient {
    static let shared = APIClient()

    private let baseURL = "http://localhost:4001/api"
    private let session: URLSession

    init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.requestCachePolicy = .reloadIgnoringLocalCacheData
        config.urlCache = nil
        self.session = URLSession(configuration: config)
    }

    // MARK: - Events

    func getEvents(category: EventCategory? = nil, featured: Bool? = nil) async throws -> [Event] {
        var components = URLComponents(string: "\(baseURL)/events")!
        var queryItems: [URLQueryItem] = []

        if let category = category {
            queryItems.append(URLQueryItem(name: "category", value: category.rawValue))
        }
        if let featured = featured {
            queryItems.append(URLQueryItem(name: "featured", value: String(featured)))
        }

        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }

        let (data, _) = try await session.data(from: components.url!)
        let response = try JSONDecoder().decode(EventsResponse.self, from: data)
        return response.data
    }

    func getEvent(id: String) async throws -> Event {
        let url = URL(string: "\(baseURL)/events/\(id)")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(SingleEventResponse.self, from: data)
        return response.data
    }

    func getSeats(eventId: String) async throws -> [APISeat] {
        let url = URL(string: "\(baseURL)/events/\(eventId)/seats")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(SeatsDataResponse.self, from: data)
        return response.data
    }

    // MARK: - Search

    func searchEvents(query: String, userId: String) async throws -> [Event] {
        var components = URLComponents(string: "\(baseURL)/search")!
        components.queryItems = [URLQueryItem(name: "q", value: query)]

        var request = URLRequest(url: components.url!)
        request.setValue(userId, forHTTPHeaderField: "X-User-ID")

        let (data, _) = try await session.data(for: request)
        let response = try JSONDecoder().decode(SearchResponse.self, from: data)
        return response.data
    }

    // MARK: - Cart

    func createCart(userId: String) async throws -> Cart {
        let url = URL(string: "\(baseURL)/cart")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = CreateCartRequest(userId: userId)
        request.httpBody = try JSONEncoder().encode(body)

        let (data, _) = try await session.data(for: request)
        let response = try JSONDecoder().decode(CartResponse.self, from: data)
        return response.data
    }

    func getCart(cartId: String) async throws -> Cart {
        let url = URL(string: "\(baseURL)/cart/\(cartId)")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(CartResponse.self, from: data)
        return response.data
    }

    func addToCart(cartId: String, eventId: String, seatIds: [String]) async throws -> Cart {
        let url = URL(string: "\(baseURL)/cart/\(cartId)/items")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = AddToCartRequest(eventId: eventId, seatIds: seatIds)
        request.httpBody = try JSONEncoder().encode(body)

        let (data, _) = try await session.data(for: request)
        let response = try JSONDecoder().decode(CartResponse.self, from: data)
        return response.data
    }

    // MARK: - Checkout

    func checkout(cartId: String, userId: String, cardLast4: String) async throws -> Order {
        let url = URL(string: "\(baseURL)/checkout")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = CheckoutRequest(
            cartId: cartId,
            userId: userId,
            payment: PaymentInfo(cardLast4: cardLast4)
        )
        request.httpBody = try JSONEncoder().encode(body)

        let (data, _) = try await session.data(for: request)
        let response = try JSONDecoder().decode(OrderResponse.self, from: data)
        return response.data
    }

    // MARK: - Orders

    func getOrder(orderId: String) async throws -> Order {
        let url = URL(string: "\(baseURL)/orders/\(orderId)")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(OrderResponse.self, from: data)
        return response.data
    }

    func getUserOrders(userId: String) async throws -> [Order] {
        let url = URL(string: "\(baseURL)/users/\(userId)/orders")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(OrdersListResponse.self, from: data)
        return response.data
    }

    // MARK: - Features

    func getFeatures(userId: String) async throws -> FeaturesResponse {
        let url = URL(string: "\(baseURL)/features/\(userId)")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(FeaturesDataResponse.self, from: data)
        return response.data
    }

    // MARK: - Homescreen

    func getHomescreenConfig(userId: String) async throws -> HomescreenConfigResponse {
        let url = URL(string: "\(baseURL)/homescreen/\(userId)")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(HomescreenConfigResponse.self, from: data)
        return response
    }

    // MARK: - Tracking

    func trackEvent(userId: String, eventKey: String, tags: [String: Any]?) async throws {
        let url = URL(string: "\(baseURL)/track")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        var body: [String: Any] = [
            "userId": userId,
            "eventKey": eventKey
        ]
        if let tags = tags {
            body["tags"] = tags
        }

        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        _ = try await session.data(for: request)
    }
}

// MARK: - Response Types

struct EventsResponse: Codable {
    let success: Bool
    let data: [Event]
    let count: Int?
}

struct SingleEventResponse: Codable {
    let data: Event
}

struct SeatsDataResponse: Codable {
    let success: Bool
    let data: [APISeat]
    let count: Int
}

struct SearchResponse: Codable {
    let success: Bool
    let data: [Event]
    let count: Int
    let query: String
}

struct FeaturesDataResponse: Codable {
    let data: FeaturesResponse
}

struct HomescreenConfigResponse: Codable {
    let success: Bool
    let data: [HomescreenModule]
    let variationKey: String?
    let enabled: Bool?
}

struct FeaturesResponse: Codable {
    let userId: String
    let features: [String: FeatureDecision]
}

struct FeatureDecision: Codable {
    let enabled: Bool
    let variationKey: String?
    let variables: [String: AnyCodable]
}

// Helper for decoding arbitrary JSON values
struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let bool = try? container.decode(Bool.self) {
            value = bool
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let string = try? container.decode(String.self) {
            value = string
        } else {
            value = ""
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let bool = value as? Bool {
            try container.encode(bool)
        } else if let int = value as? Int {
            try container.encode(int)
        } else if let double = value as? Double {
            try container.encode(double)
        } else if let string = value as? String {
            try container.encode(string)
        }
    }
}
