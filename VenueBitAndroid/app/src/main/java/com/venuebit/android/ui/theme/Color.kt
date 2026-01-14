package com.venuebit.android.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * VenueBit color palette - matching iOS theme colors exactly
 */
object VenueBitColors {
    // Slate palette
    val Slate900 = Color(0xFF0F172A)
    val Slate800 = Color(0xFF1E293B)
    val Slate700 = Color(0xFF334155)
    val Slate600 = Color(0xFF475569)
    val Slate500 = Color(0xFF64748B)
    val Slate400 = Color(0xFF94A3B8)
    val Slate300 = Color(0xFFCBD5E1)
    val Slate200 = Color(0xFFE2E8F0)
    val Slate100 = Color(0xFFF1F5F9)
    val Slate50 = Color(0xFFF8FAFC)

    // Indigo palette
    val Indigo500 = Color(0xFF6366F1)
    val Indigo400 = Color(0xFF818CF8)
    val Indigo300 = Color(0xFFA5B4FC)

    // Pink palette (for logo gradient)
    val Pink400 = Color(0xFFF472B6)

    // Semantic colors
    val Green500 = Color(0xFF22C55E)
    val Orange500 = Color(0xFFF97316)
    val Red500 = Color(0xFFEF4444)

    // Basic colors
    val White = Color(0xFFFFFFFF)
    val Black = Color(0xFF000000)
}

/**
 * Color scheme for VenueBit theming
 */
data class VenueBitColorScheme(
    val primary: Color,
    val primaryLight: Color,
    val background: Color,
    val surface: Color,
    val surfaceSecondary: Color,
    val border: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textTertiary: Color,
    val isDark: Boolean
)

/**
 * Dark color scheme - Default bluish dark mode (slate colors)
 * Matches iOS .off theme
 */
val DarkColorScheme = VenueBitColorScheme(
    primary = VenueBitColors.Indigo500,
    primaryLight = VenueBitColors.Indigo400,
    background = VenueBitColors.Slate900,
    surface = VenueBitColors.Slate800,
    surfaceSecondary = VenueBitColors.Slate700,
    border = VenueBitColors.Slate700,
    textPrimary = VenueBitColors.White,
    textSecondary = VenueBitColors.Slate400,
    textTertiary = VenueBitColors.Slate500,
    isDark = true
)

/**
 * Black color scheme - Pure black OLED-friendly theme
 * Matches iOS .black theme
 */
val BlackColorScheme = VenueBitColorScheme(
    primary = VenueBitColors.Indigo500,
    primaryLight = VenueBitColors.Indigo400,
    background = VenueBitColors.Black,
    surface = Color(0xFF121212),
    surfaceSecondary = Color(0xFF1E1E1E),
    border = Color(0xFF282828),
    textPrimary = VenueBitColors.White,
    textSecondary = Color(0xFFA0A0A0),
    textTertiary = Color(0xFF787878),
    isDark = true
)

/**
 * Beige color scheme - Warm paper-like beige theme
 * Matches iOS .beige theme
 */
val BeigeColorScheme = VenueBitColorScheme(
    primary = Color(0xFF4F46B4),  // Warmer indigo
    primaryLight = Color(0xFF635AC8),
    background = Color(0xFFFAF4E6),  // Warm cream
    surface = Color(0xFFFFFBF0),     // Lighter cream
    surfaceSecondary = Color(0xFFF5EEDC),
    border = Color(0xFFDCD2BE),
    textPrimary = Color(0xFF2D2823),  // Dark brown
    textSecondary = Color(0xFF645A4B),
    textTertiary = Color(0xFF8C826E),
    isDark = false
)

/**
 * Light color scheme - Clean white light mode
 * Matches iOS .light theme
 */
val LightColorScheme = VenueBitColorScheme(
    primary = VenueBitColors.Indigo500,
    primaryLight = VenueBitColors.Indigo400,
    background = VenueBitColors.Slate50,
    surface = VenueBitColors.White,
    surfaceSecondary = VenueBitColors.Slate100,
    border = VenueBitColors.Slate200,
    textPrimary = VenueBitColors.Slate900,
    textSecondary = VenueBitColors.Slate600,
    textTertiary = VenueBitColors.Slate500,
    isDark = false
)
