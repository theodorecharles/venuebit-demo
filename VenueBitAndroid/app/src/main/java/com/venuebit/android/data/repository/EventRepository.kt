package com.venuebit.android.data.repository

import com.venuebit.android.data.api.EventsApi
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.models.Event
import com.venuebit.android.data.models.EventCategory
import com.venuebit.android.data.models.HomescreenModule
import com.venuebit.android.data.models.Seat
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class EventRepository @Inject constructor(
    private val eventsApi: EventsApi,
    private val serverConfig: ServerConfig
) {
    suspend fun getEvents(
        category: EventCategory? = null,
        featured: Boolean? = null
    ): Result<List<Event>> {
        return try {
            val response = eventsApi.getEvents(
                category = category?.name?.lowercase(),
                featured = featured
            )
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to fetch events"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getEvent(id: String): Result<Event> {
        return try {
            val response = eventsApi.getEvent(id)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Event not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getEventSeats(id: String): Result<List<Seat>> {
        return try {
            val response = eventsApi.getEventSeats(id)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to fetch seats"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun searchEvents(query: String, userId: String): Result<List<Event>> {
        return try {
            val response = eventsApi.searchEvents(query, userId)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Search failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getHomescreenConfig(userId: String): Result<List<HomescreenModule>> {
        return try {
            val response = eventsApi.getHomescreenConfig(userId)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to fetch homescreen config"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getImageBaseUrl(): String = serverConfig.imageBaseUrl
}
