package com.venuebit.android.services

import android.util.Log
import com.venuebit.android.data.local.UserIdentityManager
import com.venuebit.android.data.models.FeatureDecision
import com.venuebit.android.data.repository.FeatureRepository
import com.venuebit.android.ui.theme.ThemeManager
import com.venuebit.android.ui.theme.VenueBitTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

data class TrackedEvent(
    val eventKey: String,
    val timestamp: Long,
    val tags: Map<String, Any>?
)

@Singleton
class OptimizelyManager @Inject constructor(
    private val featureRepository: FeatureRepository,
    private val userIdentityManager: UserIdentityManager,
    private val webSocketService: WebSocketService,
    private val themeManager: ThemeManager
) {
    companion object {
        private const val TAG = "VenueBit.Optimizely"
    }

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    // Store features as a Map keyed by feature key
    private val _featureDecisions = MutableStateFlow<Map<String, FeatureDecision>>(emptyMap())
    val featureDecisions: StateFlow<Map<String, FeatureDecision>> = _featureDecisions.asStateFlow()

    private val _recentEvents = MutableStateFlow<List<TrackedEvent>>(emptyList())
    val recentEvents: StateFlow<List<TrackedEvent>> = _recentEvents.asStateFlow()

    private val _isConnected = MutableStateFlow(false)
    val isConnected: StateFlow<Boolean> = _isConnected.asStateFlow()

    init {
        // Listen to WebSocket messages for real-time updates
        scope.launch {
            webSocketService.messages.collect { message ->
                when (message) {
                    is WebSocketMessage.Connected -> {
                        Log.d(TAG, "WebSocket connected")
                        _isConnected.value = true
                    }
                    is WebSocketMessage.Disconnected -> {
                        Log.d(TAG, "WebSocket disconnected")
                        _isConnected.value = false
                    }
                    is WebSocketMessage.DatafileUpdate -> {
                        Log.d(TAG, "Datafile updated via WebSocket - refreshing features")
                        refreshFeatures()
                    }
                    is WebSocketMessage.ThemeUpdate -> {
                        Log.d(TAG, "Theme update received: ${message.theme}")
                        applyTheme(message.theme)
                    }
                }
            }
        }
    }

    /**
     * Initialize the manager by connecting WebSocket and loading initial features
     */
    suspend fun initialize() {
        Log.d(TAG, "Initializing OptimizelyManager")
        webSocketService.connect()
        refreshFeatures()
    }

    suspend fun refreshFeatures() {
        val userId = userIdentityManager.getUserId()
        Log.d(TAG, "Refreshing features for user: $userId")
        val result = featureRepository.getFeatures(userId)
        result.onSuccess { response ->
            _featureDecisions.value = response.features
            Log.d(TAG, "Features loaded: ${response.features.keys}")

            // Apply app_theme feature if present
            response.features["app_theme"]?.let { appTheme ->
                val themeValue = appTheme.variables["theme"] as? String
                    ?: appTheme.variationKey
                    ?: "dark"
                Log.d(TAG, "Applying theme from app_theme feature: $themeValue")
                applyTheme(themeValue)
            }
        }
        result.onFailure { error ->
            Log.e(TAG, "Failed to load features: ${error.message}")
        }
    }

    private fun applyTheme(themeName: String) {
        val theme = when (themeName.lowercase()) {
            "black" -> VenueBitTheme.BLACK
            "dark" -> VenueBitTheme.DARK
            "beige" -> VenueBitTheme.BEIGE
            "light" -> VenueBitTheme.LIGHT
            "off" -> VenueBitTheme.DARK // Default to dark when feature is off
            else -> {
                Log.w(TAG, "Unknown theme: $themeName, defaulting to DARK")
                VenueBitTheme.DARK
            }
        }
        themeManager.setTheme(theme)
    }

    fun isFeatureEnabled(featureKey: String): Boolean {
        return _featureDecisions.value[featureKey]?.enabled ?: false
    }

    fun getVariationKey(featureKey: String): String? {
        return _featureDecisions.value[featureKey]?.variationKey
    }

    fun getFeatureVariable(featureKey: String, variableKey: String): Any? {
        val decision = _featureDecisions.value[featureKey]
        return decision?.variables?.get(variableKey)
    }

    suspend fun trackEvent(eventKey: String, tags: Map<String, Any>? = null) {
        val userId = userIdentityManager.getUserId()
        featureRepository.trackEvent(userId, eventKey, tags)

        val trackedEvent = TrackedEvent(
            eventKey = eventKey,
            timestamp = System.currentTimeMillis(),
            tags = tags
        )

        _recentEvents.value = (_recentEvents.value + trackedEvent).takeLast(5)
    }

    fun disconnect() {
        webSocketService.disconnect()
    }
}
