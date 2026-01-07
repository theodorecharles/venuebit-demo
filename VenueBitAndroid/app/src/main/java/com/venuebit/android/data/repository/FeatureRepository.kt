package com.venuebit.android.data.repository

import com.venuebit.android.data.api.FeaturesApi
import com.venuebit.android.data.api.TrackEventRequest
import com.venuebit.android.data.models.FeaturesResponse
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FeatureRepository @Inject constructor(
    private val featuresApi: FeaturesApi
) {
    suspend fun getFeatures(userId: String): Result<FeaturesResponse> {
        return try {
            val response = featuresApi.getFeatures(userId)
            if (response.success) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to fetch features"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun trackEvent(
        userId: String,
        eventKey: String,
        tags: Map<String, Any>? = null
    ): Result<Unit> {
        return try {
            val response = featuresApi.trackEvent(
                TrackEventRequest(userId, eventKey, tags)
            )
            if (response.success) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to track event"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
