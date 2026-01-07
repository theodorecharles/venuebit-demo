package com.venuebit.android.ui.screens.webview

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.local.UserIdentityManager
import com.venuebit.android.ui.theme.ThemeManager
import com.venuebit.android.ui.theme.VenueBitTheme
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for SeatSelectionWebViewScreen
 *
 * Manages the state needed to build the WebView URL including userId and theme.
 */
@HiltViewModel
class SeatSelectionWebViewViewModel @Inject constructor(
    private val serverConfig: ServerConfig,
    private val userIdentityManager: UserIdentityManager,
    private val themeManager: ThemeManager
) : ViewModel() {

    companion object {
        private const val TAG = "SeatSelectionWebViewVM"
    }

    private val _userId = MutableStateFlow("")
    val userId: StateFlow<String> = _userId.asStateFlow()

    private val _webViewUrl = MutableStateFlow("")
    val webViewUrl: StateFlow<String> = _webViewUrl.asStateFlow()

    private val _currentThemeName = MutableStateFlow("dark")
    val currentThemeName: StateFlow<String> = _currentThemeName.asStateFlow()

    init {
        // Observe theme changes
        viewModelScope.launch {
            themeManager.currentTheme.collect { theme ->
                _currentThemeName.value = getThemeNameForWebView(theme)
            }
        }

        // Load userId on initialization
        viewModelScope.launch {
            loadUserId()
        }
    }

    private suspend fun loadUserId() {
        val id = userIdentityManager.getUserId()
        _userId.value = id
        Log.d(TAG, "Loaded userId: $id")
    }

    /**
     * Build the WebView URL for the given event
     */
    fun buildWebViewUrl(eventId: String) {
        Log.d(TAG, "buildWebViewUrl called with eventId: '$eventId'")
        viewModelScope.launch {
            // Ensure userId is loaded
            if (_userId.value.isEmpty()) {
                loadUserId()
            }

            val baseUrl = serverConfig.webAppUrl
            Log.d(TAG, "webAppUrl: $baseUrl, isLocalServer: ${serverConfig.isLocalServer}")
            // Webapp route is /seats/:eventId
            val url = "${baseUrl}/seats/$eventId?userId=${_userId.value}&theme=${_currentThemeName.value}"

            Log.d(TAG, "Built WebView URL: $url")
            _webViewUrl.value = url
        }
    }

    /**
     * Convert VenueBitTheme enum to webapp theme name string
     */
    private fun getThemeNameForWebView(theme: VenueBitTheme): String {
        return when (theme) {
            VenueBitTheme.BLACK -> "black"
            VenueBitTheme.DARK -> "dark"
            VenueBitTheme.BEIGE -> "beige"
            VenueBitTheme.LIGHT -> "light"
        }
    }
}
