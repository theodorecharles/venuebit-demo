package com.venuebit.android.data.api

import com.venuebit.android.data.models.FeaturesDataResponse
import com.squareup.moshi.JsonClass
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface FeaturesApi {

    @GET("api/features/{userId}")
    suspend fun getFeatures(
        @Path("userId") userId: String
    ): FeaturesDataResponse

    @POST("api/track")
    suspend fun trackEvent(
        @Body request: TrackEventRequest
    ): ApiResponse<Unit>
}

@JsonClass(generateAdapter = true)
data class TrackEventRequest(
    val userId: String,
    val eventKey: String,
    val tags: Map<String, Any>? = null
)
