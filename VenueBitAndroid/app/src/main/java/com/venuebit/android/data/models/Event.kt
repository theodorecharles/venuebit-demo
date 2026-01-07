package com.venuebit.android.data.models

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import java.text.SimpleDateFormat
import java.util.Locale

/**
 * Represents an event in the VenueBit app.
 */
@JsonClass(generateAdapter = true)
data class Event(
    val id: String,
    val title: String,
    val category: EventCategory,
    val performer: String,
    val date: String,
    val time: String,
    val venueId: String,
    val venueName: String,
    val city: String,
    val state: String,
    val description: String,
    val imageUrl: String,
    val featured: Boolean,
    val minPrice: Double,
    val maxPrice: Double,
    val availableSeats: Int
) {
    /**
     * Returns a VenueInfo object constructed from this event's venue data.
     */
    val venue: VenueInfo
        get() = VenueInfo(
            id = venueId,
            name = venueName,
            city = city,
            state = state
        )

    /**
     * Returns a PriceRange object for this event.
     */
    val priceRange: PriceRange
        get() = PriceRange(min = minPrice, max = maxPrice)

    /**
     * Formats the date string (e.g., "2025-08-15") to a display format (e.g., "Friday, August 15, 2025").
     */
    val formattedDate: String
        get() {
            return try {
                val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                val outputFormat = SimpleDateFormat("EEEE, MMMM d, yyyy", Locale.US)
                val dateObj = inputFormat.parse(date)
                dateObj?.let { outputFormat.format(it) } ?: date
            } catch (e: Exception) {
                date
            }
        }

    /**
     * Formats the time string (e.g., "19:00") to a display format (e.g., "7:00 PM").
     */
    val formattedTime: String
        get() {
            return try {
                val inputFormat = SimpleDateFormat("HH:mm", Locale.US)
                val outputFormat = SimpleDateFormat("h:mm a", Locale.US)
                val timeObj = inputFormat.parse(time)
                timeObj?.let { outputFormat.format(it) } ?: time
            } catch (e: Exception) {
                time
            }
        }

    /**
     * Returns the formatted date and time combined.
     */
    val formattedDateTime: String
        get() = "$formattedDate - $formattedTime"

    /**
     * Returns the appropriate icon name for the event category.
     * Uses Android drawable resource names instead of SF Symbols.
     */
    val categoryIcon: String
        get() = when (category) {
            EventCategory.CONCERTS -> "ic_music_note"
            EventCategory.SPORTS -> getSportIcon()
            EventCategory.THEATER -> "ic_theater_masks"
            EventCategory.COMEDY -> "ic_face_smiling"
        }

    /**
     * Returns the appropriate icon for the specific sport based on title.
     */
    private fun getSportIcon(): String {
        val titleLower = title.lowercase()

        // Basketball
        if (titleLower.contains("lakers") || titleLower.contains("celtics") ||
            titleLower.contains("warriors") || titleLower.contains("clippers") ||
            titleLower.contains("mavericks")
        ) {
            return "ic_basketball"
        }

        // Baseball
        if (titleLower.contains("dodgers") || titleLower.contains("yankees") ||
            (titleLower.contains("giants") && !titleLower.contains("49ers"))
        ) {
            return "ic_baseball"
        }

        // Football (NFL & College)
        if (titleLower.contains("rams") || titleLower.contains("49ers") ||
            titleLower.contains("chargers") || titleLower.contains("chiefs") ||
            titleLower.contains("usc") || titleLower.contains("ucla") ||
            titleLower.contains("football")
        ) {
            return "ic_football"
        }

        // Hockey
        if ((titleLower.contains("kings") && titleLower.contains("golden knights")) ||
            titleLower.contains("hockey") || titleLower.contains("nhl")
        ) {
            return "ic_hockey_puck"
        }

        // Soccer/MLS
        if (titleLower.contains("lafc") || titleLower.contains("galaxy") ||
            titleLower.contains("trafico") || titleLower.contains("mls")
        ) {
            return "ic_soccer_ball"
        }

        // MMA/UFC
        if (titleLower.contains("ufc") || titleLower.contains("mma")) {
            return "ic_boxing"
        }

        return "ic_sports_court"
    }

    /**
     * Returns the appropriate emoji for the specific sport based on title.
     * Matches the iOS implementation exactly.
     */
    val sportEmoji: String
        get() {
            val titleLower = title.lowercase()

            // Basketball
            if (titleLower.contains("lakers") || titleLower.contains("celtics") ||
                titleLower.contains("warriors") || titleLower.contains("clippers") ||
                titleLower.contains("mavericks")
            ) {
                return "\uD83C\uDFC0" // Basketball emoji
            }

            // Baseball
            if (titleLower.contains("dodgers") || titleLower.contains("yankees") ||
                (titleLower.contains("giants") && !titleLower.contains("49ers"))
            ) {
                return "\u26BE" // Baseball emoji
            }

            // Football (NFL & College)
            if (titleLower.contains("rams") || titleLower.contains("49ers") ||
                titleLower.contains("chargers") || titleLower.contains("chiefs") ||
                titleLower.contains("usc") || titleLower.contains("ucla") ||
                titleLower.contains("football")
            ) {
                return "\uD83C\uDFC8" // Football emoji
            }

            // Hockey
            if ((titleLower.contains("kings") && titleLower.contains("golden knights")) ||
                titleLower.contains("hockey") || titleLower.contains("nhl")
            ) {
                return "\uD83C\uDFD2" // Hockey emoji
            }

            // Soccer/MLS
            if (titleLower.contains("lafc") || titleLower.contains("galaxy") ||
                titleLower.contains("trafico") || titleLower.contains("mls")
            ) {
                return "\u26BD" // Soccer ball emoji
            }

            // MMA/UFC
            if (titleLower.contains("ufc") || titleLower.contains("mma")) {
                return "\uD83E\uDD4A" // Boxing glove emoji
            }

            return "\uD83C\uDFDF\uFE0F" // Stadium emoji
        }

    /**
     * Returns the appropriate emoji for this event's category (sport-aware).
     */
    val displayEmoji: String
        get() = if (category == EventCategory.SPORTS) {
            sportEmoji
        } else {
            category.icon
        }

    /**
     * Returns the full image URL by prepending the server base URL to the relative image path.
     */
    fun fullImageUrl(baseUrl: String): String {
        // If already a full URL, return as-is
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl
        }
        // Otherwise, prepend the image base URL from server config
        return baseUrl + imageUrl
    }

    /**
     * Returns the full image URL using ServerConfig's imageBaseUrl.
     */
    fun fullImageUrl(serverConfig: com.venuebit.android.data.local.ServerConfig): String {
        return fullImageUrl(serverConfig.imageBaseUrl)
    }

    companion object {
        val preview = Event(
            id = "evt_001",
            title = "Beyonce - Renaissance World Tour",
            category = EventCategory.CONCERTS,
            performer = "Beyonce",
            date = "2025-08-15",
            time = "19:00",
            venueId = "ven_001",
            venueName = "SoFi Stadium",
            city = "Los Angeles",
            state = "CA",
            description = "Queen Bey brings her groundbreaking Renaissance World Tour to LA",
            imageUrl = "https://picsum.photos/400/300",
            featured = true,
            minPrice = 149.0,
            maxPrice = 999.0,
            availableSeats = 1000
        )
    }
}

/**
 * Event category enum with display names and icons.
 */
@JsonClass(generateAdapter = false)
enum class EventCategory {
    @Json(name = "concerts") CONCERTS,
    @Json(name = "sports") SPORTS,
    @Json(name = "theater") THEATER,
    @Json(name = "comedy") COMEDY;

    val displayName: String
        get() = name.lowercase().replaceFirstChar { it.uppercase() }

    val icon: String
        get() = when (this) {
            CONCERTS -> "\uD83C\uDFB5" // Musical note emoji
            SPORTS -> "\u26BD" // Soccer ball emoji
            THEATER -> "\uD83C\uDFAD" // Theater masks emoji
            COMEDY -> "\uD83D\uDE02" // Laughing emoji
        }
}

/**
 * Price range for events.
 */
data class PriceRange(
    val min: Double,
    val max: Double
) {
    val formatted: String
        get() = "$${min.toInt()} - $${max.toInt()}"

    val minFormatted: String
        get() = "From $${min.toInt()}"
}
