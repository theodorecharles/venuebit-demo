package com.venuebit.android.data.local

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ServerConfig @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    companion object {
        private val SERVER_ADDRESS_KEY = stringPreferencesKey("server_address")
        const val DEFAULT_ADDRESS = "localhost"
    }

    val serverAddressFlow: Flow<String> = dataStore.data.map { preferences ->
        preferences[SERVER_ADDRESS_KEY] ?: DEFAULT_ADDRESS
    }

    suspend fun setServerAddress(address: String) {
        dataStore.edit { preferences ->
            preferences[SERVER_ADDRESS_KEY] = address
        }
    }

    val apiBaseUrl: String
        get() = buildApiUrl(runBlocking { serverAddressFlow.first() })

    val imageBaseUrl: String
        get() = buildImageUrl(runBlocking { serverAddressFlow.first() })

    val webAppUrl: String
        get() = buildWebAppUrl(runBlocking { serverAddressFlow.first() })

    private fun buildApiUrl(address: String): String {
        return if (address == "localhost") {
            "http://10.0.2.2:4001/"
        } else {
            "https://$address/"
        }
    }

    private fun buildImageUrl(address: String): String {
        return if (address == "localhost") {
            "http://10.0.2.2:4001"
        } else {
            "https://$address"
        }
    }

    private fun buildWebAppUrl(address: String): String {
        return if (address == "localhost") {
            "http://10.0.2.2:4000"
        } else {
            "https://$address"
        }
    }

    val isLocalServer: Boolean
        get() = runBlocking { serverAddressFlow.first() } == "localhost"
}
