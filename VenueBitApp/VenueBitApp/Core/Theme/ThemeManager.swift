import SwiftUI

enum AppTheme: String, CaseIterable {
    case off = "off"       // Current bluish dark mode (default)
    case black = "black"   // Pure black background
    case dark = "dark"     // Neutral dark gray
    case beige = "beige"   // Yellowy off-white paper style
    case light = "light"   // White background light mode

    var displayName: String {
        switch self {
        case .off: return "Default (Blue Dark)"
        case .black: return "Black"
        case .dark: return "Dark Gray"
        case .beige: return "Beige"
        case .light: return "Light"
        }
    }
}

struct ThemeColors {
    let background: Color
    let surface: Color
    let surfaceSecondary: Color
    let border: Color
    let textPrimary: Color
    let textSecondary: Color
    let textTertiary: Color
    let primary: Color
    let primaryLight: Color

    // For status bar and navigation
    let isDark: Bool
}

@MainActor
class ThemeManager: ObservableObject {
    static let shared = ThemeManager()

    @Published private(set) var currentTheme: AppTheme = .off
    @Published private(set) var colors: ThemeColors = ThemeManager.colorsFor(.off)

    func setTheme(_ theme: AppTheme) {
        currentTheme = theme
        colors = ThemeManager.colorsFor(theme)
        print("[ThemeManager] Theme changed to: \(theme.rawValue)")
    }

    static func colorsFor(_ theme: AppTheme) -> ThemeColors {
        switch theme {
        case .off:
            // Current bluish dark mode (slate colors)
            return ThemeColors(
                background: Color(red: 15/255, green: 23/255, blue: 42/255),      // slate900
                surface: Color(red: 30/255, green: 41/255, blue: 59/255),         // slate800
                surfaceSecondary: Color(red: 51/255, green: 65/255, blue: 85/255), // slate700
                border: Color(red: 51/255, green: 65/255, blue: 85/255),          // slate700
                textPrimary: .white,
                textSecondary: Color(red: 148/255, green: 163/255, blue: 184/255), // slate400
                textTertiary: Color(red: 100/255, green: 116/255, blue: 139/255), // slate500
                primary: Color(red: 99/255, green: 102/255, blue: 241/255),       // indigo500
                primaryLight: Color(red: 129/255, green: 140/255, blue: 248/255), // indigo400
                isDark: true
            )

        case .black:
            // Pure black OLED-friendly theme
            return ThemeColors(
                background: .black,
                surface: Color(red: 18/255, green: 18/255, blue: 18/255),
                surfaceSecondary: Color(red: 30/255, green: 30/255, blue: 30/255),
                border: Color(red: 40/255, green: 40/255, blue: 40/255),
                textPrimary: .white,
                textSecondary: Color(red: 160/255, green: 160/255, blue: 160/255),
                textTertiary: Color(red: 120/255, green: 120/255, blue: 120/255),
                primary: Color(red: 99/255, green: 102/255, blue: 241/255),       // indigo500
                primaryLight: Color(red: 129/255, green: 140/255, blue: 248/255), // indigo400
                isDark: true
            )

        case .dark:
            // Neutral dark gray
            return ThemeColors(
                background: Color(red: 28/255, green: 28/255, blue: 30/255),      // iOS system dark
                surface: Color(red: 44/255, green: 44/255, blue: 46/255),
                surfaceSecondary: Color(red: 58/255, green: 58/255, blue: 60/255),
                border: Color(red: 58/255, green: 58/255, blue: 60/255),
                textPrimary: .white,
                textSecondary: Color(red: 174/255, green: 174/255, blue: 178/255),
                textTertiary: Color(red: 142/255, green: 142/255, blue: 147/255),
                primary: Color(red: 99/255, green: 102/255, blue: 241/255),       // indigo500
                primaryLight: Color(red: 129/255, green: 140/255, blue: 248/255), // indigo400
                isDark: true
            )

        case .beige:
            // Warm paper-like beige theme
            return ThemeColors(
                background: Color(red: 250/255, green: 244/255, blue: 230/255),   // Warm cream
                surface: Color(red: 255/255, green: 251/255, blue: 240/255),      // Lighter cream
                surfaceSecondary: Color(red: 245/255, green: 238/255, blue: 220/255),
                border: Color(red: 220/255, green: 210/255, blue: 190/255),
                textPrimary: Color(red: 45/255, green: 40/255, blue: 35/255),     // Dark brown
                textSecondary: Color(red: 100/255, green: 90/255, blue: 75/255),
                textTertiary: Color(red: 140/255, green: 130/255, blue: 110/255),
                primary: Color(red: 79/255, green: 70/255, blue: 180/255),        // Warmer indigo
                primaryLight: Color(red: 99/255, green: 90/255, blue: 200/255),
                isDark: false
            )

        case .light:
            // Clean white light mode
            return ThemeColors(
                background: Color(red: 248/255, green: 250/255, blue: 252/255),   // slate50
                surface: .white,
                surfaceSecondary: Color(red: 241/255, green: 245/255, blue: 249/255), // slate100
                border: Color(red: 226/255, green: 232/255, blue: 240/255),       // slate200
                textPrimary: Color(red: 15/255, green: 23/255, blue: 42/255),     // slate900
                textSecondary: Color(red: 71/255, green: 85/255, blue: 105/255),  // slate600
                textTertiary: Color(red: 100/255, green: 116/255, blue: 139/255), // slate500
                primary: Color(red: 99/255, green: 102/255, blue: 241/255),       // indigo500
                primaryLight: Color(red: 129/255, green: 140/255, blue: 248/255), // indigo400
                isDark: false
            )
        }
    }
}

