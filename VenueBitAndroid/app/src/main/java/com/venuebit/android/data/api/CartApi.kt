package com.venuebit.android.data.api

import com.venuebit.android.data.models.Cart
import com.venuebit.android.data.models.Order
import com.squareup.moshi.JsonClass
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface CartApi {

    @POST("api/cart")
    suspend fun createCart(
        @Body request: CreateCartRequest
    ): ApiResponse<Cart>

    @GET("api/cart/{id}")
    suspend fun getCart(
        @Path("id") id: String
    ): ApiResponse<Cart>

    @POST("api/cart/{id}/items")
    suspend fun addToCart(
        @Path("id") id: String,
        @Body request: AddToCartRequest
    ): ApiResponse<Cart>

    @POST("api/checkout")
    suspend fun checkout(
        @Body request: CheckoutRequest
    ): ApiResponse<Order>
}

@JsonClass(generateAdapter = true)
data class CreateCartRequest(
    val userId: String
)

@JsonClass(generateAdapter = true)
data class AddToCartRequest(
    val eventId: String,
    val seatIds: List<String>
)

@JsonClass(generateAdapter = true)
data class CheckoutRequest(
    val cartId: String,
    val userId: String,
    val cardLast4: String
)
