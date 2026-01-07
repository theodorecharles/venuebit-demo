package com.venuebit.android.ui.theme

import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * ThemeManager - Singleton class for managing app-wide theming
 *
 * Provides reactive theme state management with StateFlow for
 * seamless integration with Jetpack Compose.
 */
@Singleton
class ThemeManager @Inject constructor() {

    companion object {
        private const val TAG = "VenueBit.Theme"
    }

    private val _currentTheme = MutableStateFlow(VenueBitTheme.DARK)

    /**
     * Observable state of the current theme
     */
    val currentTheme: StateFlow<VenueBitTheme> = _currentTheme.asStateFlow()

    /**
     * Get the color scheme for the current theme
     */
    val colorScheme: VenueBitColorScheme
        get() = getColorSchemeForTheme(_currentTheme.value)

    /**
     * Set the theme by enum value
     */
    fun setTheme(theme: VenueBitTheme) {
        val oldTheme = _currentTheme.value
        _currentTheme.value = theme
        Log.d(TAG, "Theme changed: $oldTheme -> $theme (current value: ${_currentTheme.value})")
    }

    /**
     * Set the theme by string name (for backend/settings integration)
     *
     * @param themeName One of: "black", "dark", "beige", "light"
     */
    fun setTheme(themeName: String) {
        val theme = when (themeName.lowercase()) {
            "black" -> VenueBitTheme.BLACK
            "dark" -> VenueBitTheme.DARK
            "beige" -> VenueBitTheme.BEIGE
            "light" -> VenueBitTheme.LIGHT
            else -> {
                Log.w(TAG, "Unknown theme name: $themeName, defaulting to DARK")
                VenueBitTheme.DARK
            }
        }
        setTheme(theme)
    }

    /**
     * Get the color scheme for a specific theme
     */
    private fun getColorSchemeForTheme(theme: VenueBitTheme): VenueBitColorScheme {
        return when (theme) {
            VenueBitTheme.BLACK -> BlackColorScheme
            VenueBitTheme.DARK -> DarkColorScheme
            VenueBitTheme.BEIGE -> BeigeColorScheme
            VenueBitTheme.LIGHT -> LightColorScheme
        }
    }

    /**
     * Check if the current theme is a dark theme
     */
    val isDarkTheme: Boolean
        get() = colorScheme.isDark

    /**
     * Toggle between light and dark themes
     */
    fun toggleDarkMode() {
        val newTheme = if (isDarkTheme) VenueBitTheme.LIGHT else VenueBitTheme.DARK
        setTheme(newTheme)
    }

    /**
     * Get display name for the current theme
     */
    val currentThemeDisplayName: String
        get() = when (_currentTheme.value) {
            VenueBitTheme.BLACK -> "Black"
            VenueBitTheme.DARK -> "Dark"
            VenueBitTheme.BEIGE -> "Beige"
            VenueBitTheme.LIGHT -> "Light"
        }
}
