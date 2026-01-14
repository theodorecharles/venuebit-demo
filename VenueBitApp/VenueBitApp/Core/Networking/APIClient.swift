import Foundation

class APIClient {
    static let shared = APIClient()

    private let session: URLSession

    init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.requestCachePolicy = .reloadIgnoringLocalCacheData
        config.urlCache = nil
        self.session = URLSession(configuration: config)
    }

    @MainActor
    private var baseURL: String {
        ServerConfig.shared.apiBaseURL
    }

    // MARK: - Events

    func getEvents(category: EventCategory? = nil, featured: Bool? = nil) async throws -> [Event] {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        var components = URLComponents(string: "\(apiBaseURL)/events")!
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
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/events/\(id)")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(SingleEventResponse.self, from: data)
        return response.data
    }

    func getSeats(eventId: String) async throws -> [APISeat] {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/events/\(eventId)/seats")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(SeatsDataResponse.self, from: data)
        return response.data
    }

    // MARK: - Search

    func searchEvents(query: String, userId: String) async throws -> [Event] {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        var components = URLComponents(string: "\(apiBaseURL)/search")!
        components.queryItems = [URLQueryItem(name: "q", value: query)]

        var request = URLRequest(url: components.url!)
        request.setValue(userId, forHTTPHeaderField: "X-User-ID")

        let (data, _) = try await session.data(for: request)
        let response = try JSONDecoder().decode(SearchResponse.self, from: data)
        return response.data
    }

    // MARK: - Cart

    func createCart(userId: String) async throws -> Cart {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/cart")!
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
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/cart/\(cartId)")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(CartResponse.self, from: data)
        return response.data
    }

    func addToCart(cartId: String, eventId: String, seatIds: [String]) async throws -> Cart {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/cart/\(cartId)/items")!
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
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/checkout")!
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
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/orders/\(orderId)")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(OrderResponse.self, from: data)
        return response.data
    }

    func getUserOrders(userId: String) async throws -> [Order] {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/users/\(userId)/orders")!
        let (data, _) = try await session.data(from: url)
        let response = try JSONDecoder().decode(OrdersListResponse.self, from: data)
        return response.data
    }

    // MARK: - Features

    func getFeatures(userId: String) async throws -> FeaturesResponse {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        var components = URLComponents(string: "\(apiBaseURL)/features/\(userId)")!
        components.queryItems = [URLQueryItem(name: "operating_system", value: "ios")]
        let (data, _) = try await session.data(from: components.url!)
        let response = try JSONDecoder().decode(FeaturesDataResponse.self, from: data)
        return response.data
    }

    // MARK: - Homescreen

    func getHomescreenConfig(userId: String) async throws -> HomescreenConfigResponse {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        var components = URLComponents(string: "\(apiBaseURL)/homescreen/\(userId)")!
        components.queryItems = [URLQueryItem(name: "operating_system", value: "ios")]
        let (data, _) = try await session.data(from: components.url!)
        let response = try JSONDecoder().decode(HomescreenConfigResponse.self, from: data)
        return response
    }

    // MARK: - Tracking

    func trackEvent(userId: String, eventKey: String, tags: [String: Any]?) async throws {
        let apiBaseURL = await MainActor.run { ServerConfig.shared.apiBaseURL }
        let url = URL(string: "\(apiBaseURL)/track")!
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
