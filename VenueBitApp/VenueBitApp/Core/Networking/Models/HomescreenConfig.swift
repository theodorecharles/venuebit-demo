import Foundation

enum HomescreenModuleType: String, Codable {
    case hero_carousel
    case categories
    case trending_now
    case this_weekend
    case all_events
}

enum EventSortBy: String, Codable {
    case date_asc
    case date_desc
    case alphabetical_asc
    case trending_desc
}

struct ModuleConfig: Codable, Equatable {
    let categories: [String]?
    let sortBy: EventSortBy?
    let length: Int?
}

struct HomescreenModule: Codable, Identifiable, Equatable {
    let module: HomescreenModuleType
    let config: ModuleConfig
    let id: UUID

    init(module: HomescreenModuleType, config: ModuleConfig) {
        self.module = module
        self.config = config
        self.id = UUID()
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        module = try container.decode(HomescreenModuleType.self, forKey: .module)
        config = try container.decode(ModuleConfig.self, forKey: .config)
        id = UUID()
    }

    enum CodingKeys: String, CodingKey {
        case module, config
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(module, forKey: .module)
        try container.encode(config, forKey: .config)
    }

    var categoryFilters: [EventCategory] {
        guard let categories = config.categories else {
            return EventCategory.allCases
        }
        return categories.compactMap { EventCategory(rawValue: $0) }
    }
}
