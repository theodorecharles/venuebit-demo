package com.venuebit.android.data.models

import com.squareup.moshi.JsonClass

/**
 * Generic API response wrapper.
 * Used for standard API responses that include success status and data.
 */
@JsonClass(generateAdapter = true)
data class ApiResponse<T>(
    val success: Boolean,
    val data: T,
    val count: Int? = null
)

/**
 * Response wrapper for events list.
 */
@JsonClass(generateAdapter = true)
data class EventsResponse(
    val success: Boolean,
    val data: List<Event>,
    val count: Int? = null
)

/**
 * Response wrapper for a single event.
 */
@JsonClass(generateAdapter = true)
data class SingleEventResponse(
    val data: Event
)

/**
 * Response wrapper for seats data.
 */
@JsonClass(generateAdapter = true)
data class SeatsDataResponse(
    val success: Boolean,
    val data: List<APISeat>,
    val count: Int
)

/**
 * Response wrapper for search results.
 */
@JsonClass(generateAdapter = true)
data class SearchResponse(
    val success: Boolean,
    val data: List<Event>,
    val count: Int,
    val query: String
)

/**
 * API seat representation (matches server response).
 */
@JsonClass(generateAdapter = true)
data class APISeat(
    val id: String,
    val eventId: String,
    val section: String,
    val row: String,
    val seatNumber: Int,
    val price: Double,
    val status: String
)

/**
 * Response for seats endpoint (alternative format).
 */
@JsonClass(generateAdapter = true)
data class SeatsResponse(
    val success: Boolean,
    val data: List<APISeat>,
    val count: Int
)
