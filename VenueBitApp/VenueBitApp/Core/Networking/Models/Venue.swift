import Foundation

struct Venue: Codable, Identifiable {
    let id: String
    let name: String
    let address: String?
    let city: String
    let state: String
    let zipCode: String?
    let capacity: Int?
    let type: VenueType?

    var cityState: String {
        "\(city), \(state)"
    }

    var fullAddress: String {
        if let address = address {
            return "\(address), \(city), \(state)"
        }
        return cityState
    }
}

enum VenueType: String, Codable {
    case stadium
    case arena
    case theater
}
