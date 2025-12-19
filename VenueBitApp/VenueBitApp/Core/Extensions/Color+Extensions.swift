import SwiftUI

extension Color {
    // Slate color palette
    static let slate900 = Color(red: 15/255, green: 23/255, blue: 42/255)
    static let slate800 = Color(red: 30/255, green: 41/255, blue: 59/255)
    static let slate700 = Color(red: 51/255, green: 65/255, blue: 85/255)
    static let slate600 = Color(red: 71/255, green: 85/255, blue: 105/255)
    static let slate500 = Color(red: 100/255, green: 116/255, blue: 139/255)
    static let slate400 = Color(red: 148/255, green: 163/255, blue: 184/255)
    static let slate300 = Color(red: 203/255, green: 213/255, blue: 225/255)
    static let slate200 = Color(red: 226/255, green: 232/255, blue: 240/255)
    static let slate100 = Color(red: 241/255, green: 245/255, blue: 249/255)

    // Indigo color palette
    static let indigo500 = Color(red: 99/255, green: 102/255, blue: 241/255)
    static let indigo400 = Color(red: 129/255, green: 140/255, blue: 248/255)
    static let indigo300 = Color(red: 165/255, green: 180/255, blue: 252/255)

    // Semantic colors
    static let primaryColor = indigo500
    static let backgroundColor = slate900
    static let surfaceColor = slate800
    static let textPrimary = Color.white
    static let textSecondary = slate400
}
