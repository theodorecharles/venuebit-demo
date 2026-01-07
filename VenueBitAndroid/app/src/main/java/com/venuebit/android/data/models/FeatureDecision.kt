package com.venuebit.android.data.models

import com.squareup.moshi.JsonClass

/**
 * Response wrapper for features endpoint.
 * Matches API response: { "success": true, "data": { "userId": "...", "features": {...} } }
 */
@JsonClass(generateAdapter = true)
data class FeaturesDataResponse(
    val success: Boolean,
    val data: FeaturesResponse
)

/**
 * Contains the user ID and their feature decisions.
 */
@JsonClass(generateAdapter = true)
data class FeaturesResponse(
    val userId: String,
    val features: Map<String, FeatureDecision>
)

/**
 * Represents a feature flag decision with its configuration.
 */
@JsonClass(generateAdapter = true)
data class FeatureDecision(
    val enabled: Boolean,
    val variationKey: String? = null,
    val variables: Map<String, Any> = emptyMap()
)

/**
 * Helper class for decoding arbitrary JSON values in feature variables.
 * Supports Bool, Int, Double, and String values.
 */
class AnyCodable(val value: Any) {
    companion object {
        fun fromAny(value: Any?): AnyCodable {
            return when (value) {
                is Boolean -> AnyCodable(value)
                is Int -> AnyCodable(value)
                is Double -> AnyCodable(value)
                is String -> AnyCodable(value)
                else -> AnyCodable("")
            }
        }
    }

    fun asBoolean(): Boolean? = value as? Boolean
    fun asInt(): Int? = value as? Int
    fun asDouble(): Double? = value as? Double
    fun asString(): String? = value as? String
}

/**
 * Feature decision info for display in settings.
 */
data class FeatureDecisionInfo(
    val enabled: Boolean,
    val variationKey: String,
    val variables: Map<String, String>
)

/**
 * Ticket experience decision for A/B testing.
 */
data class TicketExperienceDecision(
    val enabled: Boolean,
    val variationKey: String,
    val showRecommendations: Boolean,
    val checkoutLayout: String,
    val showUrgencyBanner: Boolean
) {
    val isVariation: Boolean
        get() = variationKey == "variation"

    companion object {
        val defaultDecision = TicketExperienceDecision(
            enabled = false,
            variationKey = "control",
            showRecommendations = false,
            checkoutLayout = "standard",
            showUrgencyBanner = false
        )
    }
}
