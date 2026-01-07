package com.venuebit.android.data.models

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

/**
 * Represents a venue.
 */
@JsonClass(generateAdapter = true)
data class Venue(
    val id: String,
    val name: String,
    val address: String? = null,
    val city: String,
    val state: String,
    val zipCode: String? = null,
    val capacity: Int? = null,
    val type: VenueType? = null
) {
    /**
     * Returns the city and state combined (e.g., "Los Angeles, CA").
     */
    val cityState: String
        get() = "$city, $state"

    /**
     * Returns the full address including city and state.
     */
    val fullAddress: String
        get() = address?.let { "$it, $city, $state" } ?: cityState
}

/**
 * Venue type enum.
 */
@JsonClass(generateAdapter = false)
enum class VenueType {
    @Json(name = "stadium") STADIUM,
    @Json(name = "arena") ARENA,
    @Json(name = "theater") THEATER
}

/**
 * Simplified venue info (used for computed properties in Event).
 */
data class VenueInfo(
    val id: String,
    val name: String,
    val city: String,
    val state: String
) {
    /**
     * Returns the city and state combined (e.g., "Los Angeles, CA").
     */
    val cityState: String
        get() = "$city, $state"
}
