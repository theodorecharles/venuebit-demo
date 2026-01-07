package com.venuebit.android.data.models

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

/**
 * Represents a shopping cart.
 */
@JsonClass(generateAdapter = true)
data class Cart(
    val id: String,
    val userId: String,
    val items: List<CartItemData>,
    val createdAt: String,
    val updatedAt: String
)

/**
 * Represents an item in the cart (contains event info and seats).
 */
@JsonClass(generateAdapter = true)
data class CartItemData(
    val id: String,
    val eventId: String,
    val eventTitle: String,
    val eventDate: String,
    val eventTime: String,
    val venueName: String,
    val seats: List<CartSeat>,
    val subtotal: Double
) {
    /**
     * Returns a formatted description of the seats (e.g., "Section A, Row 1, Seats 5, 6, 7").
     */
    val seatsDescription: String
        get() {
            if (seats.isEmpty()) return ""
            val section = seats.firstOrNull()?.section ?: ""
            val row = seats.firstOrNull()?.row ?: ""
            val seatNumbers = seats.map { it.seatNumber.toString() }.joinToString(", ")
            return "$section, Row $row, Seats $seatNumbers"
        }
}

/**
 * Represents a seat in the cart.
 */
@JsonClass(generateAdapter = true)
data class CartSeat(
    val id: String,
    val eventId: String,
    val section: String,
    val row: String,
    val seatNumber: Int,
    val price: Double,
    val status: String
)

/**
 * Seat status enum.
 */
@JsonClass(generateAdapter = false)
enum class SeatStatus {
    @Json(name = "available") AVAILABLE,
    @Json(name = "reserved") RESERVED,
    @Json(name = "sold") SOLD
}

/**
 * Request model for creating a new cart.
 */
@JsonClass(generateAdapter = true)
data class CreateCartRequest(
    val userId: String
)

/**
 * Request model for adding items to cart.
 */
@JsonClass(generateAdapter = true)
data class AddToCartRequest(
    val eventId: String,
    val seatIds: List<String>
)

/**
 * Response wrapper for cart data.
 */
@JsonClass(generateAdapter = true)
data class CartResponse(
    val data: Cart
)
