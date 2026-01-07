package com.venuebit.android.data.models

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import java.text.SimpleDateFormat
import java.util.Locale

/**
 * Represents a ticket for an event.
 */
@JsonClass(generateAdapter = true)
data class Ticket(
    val id: String,
    val eventId: String,
    val eventTitle: String,
    val eventDate: String,
    val eventTime: String,
    val venueName: String,
    val section: String,
    val row: String,
    val seatNumber: Int,
    val price: Double
) {
    /**
     * Returns a formatted seat description (e.g., "Section A, Row 1, Seat 5").
     */
    val seatDescription: String
        get() = "Section $section, Row $row, Seat $seatNumber"

    /**
     * Returns a formatted date string (e.g., "Aug 15, 2025 - 19:00").
     */
    val formattedDate: String
        get() {
            return try {
                val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                val outputFormat = SimpleDateFormat("MMM d, yyyy", Locale.US)
                val date = inputFormat.parse(eventDate)
                date?.let { "${outputFormat.format(it)} - $eventTime" } ?: "$eventDate $eventTime"
            } catch (e: Exception) {
                "$eventDate $eventTime"
            }
        }

    companion object {
        /**
         * Creates a Ticket from an OrderItem and OrderSeat.
         */
        fun fromOrderItem(item: OrderItem, seat: OrderSeat): Ticket {
            return Ticket(
                id = seat.id,
                eventId = item.eventId,
                eventTitle = item.eventTitle,
                eventDate = item.eventDate,
                eventTime = item.eventTime,
                venueName = item.venueName,
                section = seat.section,
                row = seat.row,
                seatNumber = seat.seatNumber,
                price = seat.price
            )
        }
    }
}

/**
 * Represents a seat within an order.
 */
@JsonClass(generateAdapter = true)
data class OrderSeat(
    val id: String,
    val section: String,
    val row: String,
    val seatNumber: Int,
    val price: Double
)

/**
 * Represents an item within an order (contains multiple seats for an event).
 */
@JsonClass(generateAdapter = true)
data class OrderItem(
    val id: String,
    val eventId: String,
    val eventTitle: String,
    val eventDate: String,
    val eventTime: String,
    val venueName: String,
    val seats: List<OrderSeat>,
    val subtotal: Double
)
