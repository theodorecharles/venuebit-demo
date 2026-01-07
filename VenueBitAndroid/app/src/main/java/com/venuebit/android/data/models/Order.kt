package com.venuebit.android.data.models

import androidx.compose.ui.graphics.Color
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import java.text.SimpleDateFormat
import java.util.Locale

/**
 * Represents an order in the VenueBit app.
 */
@JsonClass(generateAdapter = true)
data class Order(
    val id: String,
    val userId: String,
    val status: OrderStatus,
    val items: List<OrderItem>,
    val subtotal: Double,
    val serviceFee: Double,
    val total: Double,
    val createdAt: String
) {
    /**
     * Converts order items and seats to a flat list of tickets for display.
     */
    val tickets: List<Ticket>
        get() = items.flatMap { item ->
            item.seats.map { seat ->
                Ticket.fromOrderItem(item, seat)
            }
        }

    /**
     * Returns a formatted date string from the createdAt timestamp.
     */
    val formattedDate: String
        get() {
            return try {
                // Try ISO 8601 format first
                val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
                val outputFormat = SimpleDateFormat("MMM d, yyyy", Locale.US)
                val date = inputFormat.parse(createdAt)
                date?.let { outputFormat.format(it) } ?: createdAt
            } catch (e: Exception) {
                try {
                    // Try alternative ISO format without milliseconds
                    val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
                    val outputFormat = SimpleDateFormat("MMM d, yyyy", Locale.US)
                    val date = inputFormat.parse(createdAt)
                    date?.let { outputFormat.format(it) } ?: createdAt
                } catch (e: Exception) {
                    createdAt
                }
            }
        }
}

/**
 * Order status enum with associated colors.
 */
@JsonClass(generateAdapter = false)
enum class OrderStatus {
    @Json(name = "pending") PENDING,
    @Json(name = "confirmed") CONFIRMED,
    @Json(name = "completed") COMPLETED,
    @Json(name = "cancelled") CANCELLED,
    @Json(name = "refunded") REFUNDED;

    /**
     * Returns the display color for this order status.
     */
    val color: Color
        get() = when (this) {
            CONFIRMED, COMPLETED -> Color(0xFF22C55E) // Green
            PENDING -> Color(0xFFF97316) // Orange
            CANCELLED, REFUNDED -> Color(0xFFEF4444) // Red
        }

    val displayName: String
        get() = name.lowercase().replaceFirstChar { it.uppercase() }
}

/**
 * Request model for checkout.
 */
@JsonClass(generateAdapter = true)
data class CheckoutRequest(
    val cartId: String,
    val userId: String,
    val payment: PaymentInfo
)

/**
 * Payment information for checkout.
 */
@JsonClass(generateAdapter = true)
data class PaymentInfo(
    val cardLast4: String
)

/**
 * Response wrapper for a single order.
 */
@JsonClass(generateAdapter = true)
data class OrderResponse(
    val data: Order
)

/**
 * Response wrapper for a list of orders.
 */
@JsonClass(generateAdapter = true)
data class OrdersListResponse(
    val data: List<Order>
)
