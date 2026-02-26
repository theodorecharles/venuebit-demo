package com.venuebit.android.data.api

import com.venuebit.android.data.models.Order
import retrofit2.http.GET
import retrofit2.http.Path

interface OrdersApi {

    @GET("api/orders/{id}")
    suspend fun getOrder(
        @Path("id") id: String
    ): ApiResponse<Order>

    @GET("api/users/{userId}/orders")
    suspend fun getUserOrders(
        @Path("userId") userId: String
    ): ApiResponse<List<Order>>
}
