package com.venuebit.android.ui.theme

import android.app.Activity
import android.util.Log
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private const val TAG = "VenueBit.Theme"

/**
 * Available theme options for VenueBit
 */
enum class VenueBitTheme {
    BLACK,
    DARK,
    BEIGE,
    LIGHT
}

/**
 * CompositionLocal for accessing VenueBit colors throughout the app
 */
val LocalVenueBitColors = staticCompositionLocalOf<VenueBitColorScheme> { DarkColorScheme }

/**
 * Helper object to access current theme colors
 */
object VenueBitThemeColors {
    val colors: VenueBitColorScheme
        @Composable
        get() = LocalVenueBitColors.current
}

/**
 * VenueBit Theme composable that provides theming throughout the app
 *
 * @param themeManager The ThemeManager instance for managing theme state
 * @param content The composable content to be themed
 */
@Composable
fun VenueBitTheme(
    themeManager: ThemeManager,
    content: @Composable () -> Unit
) {
    val currentTheme by themeManager.currentTheme.collectAsState()

    // Derive color scheme from the observed currentTheme value
    val colorScheme = when (currentTheme) {
        VenueBitTheme.BLACK -> BlackColorScheme
        VenueBitTheme.DARK -> DarkColorScheme
        VenueBitTheme.BEIGE -> BeigeColorScheme
        VenueBitTheme.LIGHT -> LightColorScheme
    }

    Log.d(TAG, "VenueBitTheme recomposing with theme: $currentTheme, colorScheme.isDark: ${colorScheme.isDark}")

    // Update system bar appearance based on theme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            // For dark themes, use light status bar icons (white icons)
            // For light themes, use dark status bar icons (black icons)
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !colorScheme.isDark
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !colorScheme.isDark
        }
    }

    // Create Material3 color scheme based on current theme
    val materialColorScheme = if (colorScheme.isDark) {
        darkColorScheme(
            primary = colorScheme.primary,
            onPrimary = VenueBitColors.White,
            secondary = colorScheme.primaryLight,
            onSecondary = VenueBitColors.White,
            background = colorScheme.background,
            onBackground = colorScheme.textPrimary,
            surface = colorScheme.surface,
            onSurface = colorScheme.textPrimary,
            surfaceVariant = colorScheme.surfaceSecondary,
            onSurfaceVariant = colorScheme.textSecondary,
            outline = colorScheme.border
        )
    } else {
        lightColorScheme(
            primary = colorScheme.primary,
            onPrimary = VenueBitColors.White,
            secondary = colorScheme.primaryLight,
            onSecondary = VenueBitColors.White,
            background = colorScheme.background,
            onBackground = colorScheme.textPrimary,
            surface = colorScheme.surface,
            onSurface = colorScheme.textPrimary,
            surfaceVariant = colorScheme.surfaceSecondary,
            onSurfaceVariant = colorScheme.textSecondary,
            outline = colorScheme.border
        )
    }

    CompositionLocalProvider(LocalVenueBitColors provides colorScheme) {
        MaterialTheme(
            colorScheme = materialColorScheme,
            typography = VenueBitTypography,
            shapes = VenueBitMaterialShapes,
            content = content
        )
    }
}

/**
 * Overloaded VenueBit Theme for preview purposes without ThemeManager
 */
@Composable
fun VenueBitTheme(
    theme: VenueBitTheme = VenueBitTheme.DARK,
    content: @Composable () -> Unit
) {
    val colorScheme = when (theme) {
        VenueBitTheme.BLACK -> BlackColorScheme
        VenueBitTheme.DARK -> DarkColorScheme
        VenueBitTheme.BEIGE -> BeigeColorScheme
        VenueBitTheme.LIGHT -> LightColorScheme
    }

    val materialColorScheme = if (colorScheme.isDark) {
        darkColorScheme(
            primary = colorScheme.primary,
            onPrimary = VenueBitColors.White,
            secondary = colorScheme.primaryLight,
            onSecondary = VenueBitColors.White,
            background = colorScheme.background,
            onBackground = colorScheme.textPrimary,
            surface = colorScheme.surface,
            onSurface = colorScheme.textPrimary,
            surfaceVariant = colorScheme.surfaceSecondary,
            onSurfaceVariant = colorScheme.textSecondary,
            outline = colorScheme.border
        )
    } else {
        lightColorScheme(
            primary = colorScheme.primary,
            onPrimary = VenueBitColors.White,
            secondary = colorScheme.primaryLight,
            onSecondary = VenueBitColors.White,
            background = colorScheme.background,
            onBackground = colorScheme.textPrimary,
            surface = colorScheme.surface,
            onSurface = colorScheme.textPrimary,
            surfaceVariant = colorScheme.surfaceSecondary,
            onSurfaceVariant = colorScheme.textSecondary,
            outline = colorScheme.border
        )
    }

    CompositionLocalProvider(LocalVenueBitColors provides colorScheme) {
        MaterialTheme(
            colorScheme = materialColorScheme,
            typography = VenueBitTypography,
            shapes = VenueBitMaterialShapes,
            content = content
        )
    }
}
