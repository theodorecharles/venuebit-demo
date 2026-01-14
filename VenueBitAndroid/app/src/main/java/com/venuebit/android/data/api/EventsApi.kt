package com.venuebit.android.data.api

import com.venuebit.android.data.models.Event
import com.venuebit.android.data.models.HomescreenModule
import com.venuebit.android.data.models.Seat
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path
import retrofit2.http.Query

interface EventsApi {

    @GET("api/events")
    suspend fun getEvents(
        @Query("category") category: String? = null,
        @Query("featured") featured: Boolean? = null
    ): ApiResponse<List<Event>>

    @GET("api/events/{id}")
    suspend fun getEvent(
        @Path("id") id: String
    ): ApiResponse<Event>

    @GET("api/events/{id}/seats")
    suspend fun getEventSeats(
        @Path("id") id: String
    ): ApiResponse<List<Seat>>

    @GET("api/search")
    suspend fun searchEvents(
        @Query("q") query: String,
        @Header("X-User-ID") userId: String
    ): ApiResponse<List<Event>>

    @GET("api/homescreen/{userId}")
    suspend fun getHomescreenConfig(
        @Path("userId") userId: String,
        @Query("operating_system") operatingSystem: String = "android"
    ): ApiResponse<List<HomescreenModule>>
}
