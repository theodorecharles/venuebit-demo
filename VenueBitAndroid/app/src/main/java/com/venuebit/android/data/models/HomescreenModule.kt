package com.venuebit.android.data.models

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import java.util.UUID

/**
 * Types of homescreen modules.
 */
@JsonClass(generateAdapter = false)
enum class HomescreenModuleType {
    @Json(name = "hero_carousel") HERO_CAROUSEL,
    @Json(name = "categories") CATEGORIES,
    @Json(name = "trending_now") TRENDING_NOW,
    @Json(name = "this_weekend") THIS_WEEKEND,
    @Json(name = "all_events") ALL_EVENTS
}

/**
 * Sorting options for events.
 */
@JsonClass(generateAdapter = false)
enum class EventSortBy {
    @Json(name = "date_asc") DATE_ASC,
    @Json(name = "date_desc") DATE_DESC,
    @Json(name = "alphabetical_asc") ALPHABETICAL_ASC,
    @Json(name = "trending_desc") TRENDING_DESC
}

/**
 * Configuration for a homescreen module.
 */
@JsonClass(generateAdapter = true)
data class ModuleConfig(
    val categories: List<String>? = null,
    val sortBy: EventSortBy? = null,
    val length: Int? = null
)

/**
 * Represents a homescreen module with its configuration.
 */
@JsonClass(generateAdapter = true)
data class HomescreenModule(
    val module: HomescreenModuleType,
    val config: ModuleConfig
) {
    /**
     * Unique identifier for this module instance.
     */
    val id: String = UUID.randomUUID().toString()

    /**
     * Returns the category filters as EventCategory enums.
     */
    val categoryFilters: List<EventCategory>
        get() {
            val categories = config.categories ?: return EventCategory.entries
            return categories.mapNotNull { categoryString ->
                try {
                    EventCategory.valueOf(categoryString.uppercase())
                } catch (e: IllegalArgumentException) {
                    null
                }
            }
        }

    // For backward compatibility with existing code
    val type: String
        get() = module.name.lowercase()

    val title: String?
        get() = when (module) {
            HomescreenModuleType.HERO_CAROUSEL -> "Featured"
            HomescreenModuleType.CATEGORIES -> "Categories"
            HomescreenModuleType.TRENDING_NOW -> "Trending Now"
            HomescreenModuleType.THIS_WEEKEND -> "This Weekend"
            HomescreenModuleType.ALL_EVENTS -> "All Events"
        }

    val eventCount: Int?
        get() = config.length
}

/**
 * Response wrapper for homescreen configuration.
 */
@JsonClass(generateAdapter = true)
data class HomescreenConfigResponse(
    val success: Boolean,
    val data: List<HomescreenModule>,
    val variationKey: String? = null,
    val enabled: Boolean? = null
)
