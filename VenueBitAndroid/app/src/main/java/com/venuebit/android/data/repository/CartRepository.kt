package com.venuebit.android.data.repository

import com.venuebit.android.data.api.AddToCartRequest
import com.venuebit.android.data.api.CartApi
import com.venuebit.android.data.api.CheckoutRequest
import com.venuebit.android.data.api.CreateCartRequest
import com.venuebit.android.data.models.Cart
import com.venuebit.android.data.models.Order
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CartRepository @Inject constructor(
    private val cartApi: CartApi
) {
    suspend fun createCart(userId: String): Result<Cart> {
        return try {
            val response = cartApi.createCart(CreateCartRequest(userId))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to create cart"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getCart(id: String): Result<Cart> {
        return try {
            val response = cartApi.getCart(id)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Cart not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun addToCart(cartId: String, eventId: String, seatIds: List<String>): Result<Cart> {
        return try {
            val response = cartApi.addToCart(cartId, AddToCartRequest(eventId, seatIds))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to add to cart"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun checkout(cartId: String, userId: String, cardLast4: String): Result<Order> {
        return try {
            val response = cartApi.checkout(CheckoutRequest(cartId, userId, cardLast4))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Checkout failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
