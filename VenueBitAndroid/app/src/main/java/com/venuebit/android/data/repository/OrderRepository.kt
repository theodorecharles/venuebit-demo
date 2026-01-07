package com.venuebit.android.data.repository

import com.venuebit.android.data.api.OrdersApi
import com.venuebit.android.data.models.Order
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OrderRepository @Inject constructor(
    private val ordersApi: OrdersApi
) {
    suspend fun getOrder(id: String): Result<Order> {
        return try {
            val response = ordersApi.getOrder(id)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Order not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUserOrders(userId: String): Result<List<Order>> {
        return try {
            val response = ordersApi.getUserOrders(userId)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to fetch orders"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
