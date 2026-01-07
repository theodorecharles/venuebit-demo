package com.venuebit.android.data.models

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

/**
 * Represents a seat for seat selection.
 */
@JsonClass(generateAdapter = true)
data class Seat(
    val id: String,
    val eventId: String,
    val section: String,
    val row: String,
    val seatNumber: Int,
    val price: Double,
    val status: String
) {
    /**
     * Returns true if the seat is available for purchase.
     */
    val isAvailable: Boolean
        get() = status == "available"

    /**
     * Returns true if the seat is reserved (in someone's cart).
     */
    val isReserved: Boolean
        get() = status == "reserved"

    /**
     * Returns true if the seat is sold.
     */
    val isSold: Boolean
        get() = status == "sold"

    /**
     * Returns a formatted description of the seat (e.g., "Section A, Row 1, Seat 5").
     */
    val seatDescription: String
        get() = "Section $section, Row $row, Seat $seatNumber"

    /**
     * Returns a short description of the seat (e.g., "A-1-5").
     */
    val shortDescription: String
        get() = "$section-$row-$seatNumber"

    /**
     * Returns the formatted price (e.g., "$125").
     */
    val formattedPrice: String
        get() = "$${price.toInt()}"

    companion object {
        /**
         * Creates a Seat from an APISeat.
         */
        fun fromAPISeat(apiSeat: APISeat): Seat {
            return Seat(
                id = apiSeat.id,
                eventId = apiSeat.eventId,
                section = apiSeat.section,
                row = apiSeat.row,
                seatNumber = apiSeat.seatNumber,
                price = apiSeat.price,
                status = apiSeat.status
            )
        }
    }
}
