package com.venuebit.android.data.local

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UserIdentityManager @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    companion object {
        val USER_ID_KEY = stringPreferencesKey("venuebit_user_id")
    }

    val userIdFlow: Flow<String> = dataStore.data.map { preferences ->
        preferences[USER_ID_KEY] ?: run {
            // Note: This generates a new ID each time the flow is collected if none exists.
            // For persistence, use generateAndSaveNewUserId() to save it.
            generateNewUserId()
        }
    }

    suspend fun getUserId(): String {
        val existingId = dataStore.data.first()[USER_ID_KEY]
        return existingId ?: generateAndSaveNewUserId()
    }

    suspend fun generateAndSaveNewUserId(): String {
        val newId = generateNewUserId()
        dataStore.edit { preferences ->
            preferences[USER_ID_KEY] = newId
        }
        return newId
    }

    private fun generateNewUserId(): String {
        return "user_" + UUID.randomUUID().toString().replace("-", "").take(12)
    }
}
