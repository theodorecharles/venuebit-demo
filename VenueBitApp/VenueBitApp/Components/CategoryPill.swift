import SwiftUI

struct CategoryPill: View {
    let category: EventCategory
    let isSelected: Bool
    let action: () -> Void
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(category.icon)
                Text(category.displayName)
                    .font(.subheadline.bold())
            }
            .foregroundColor(isSelected ? .white : themeManager.colors.textSecondary)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(
                isSelected ? themeManager.colors.primary : themeManager.colors.surfaceSecondary
            )
            .cornerRadius(20)
        }
    }
}

struct CategorySelector: View {
    @Binding var selectedCategory: EventCategory?
    var categories: [EventCategory] = EventCategory.allCases
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // All category
                Button(action: { selectedCategory = nil }) {
                    Text("All")
                        .font(.subheadline.bold())
                        .foregroundColor(selectedCategory == nil ? .white : themeManager.colors.textSecondary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(
                            selectedCategory == nil ? themeManager.colors.primary : themeManager.colors.surfaceSecondary
                        )
                        .cornerRadius(20)
                }

                ForEach(categories, id: \.self) { category in
                    CategoryPill(
                        category: category,
                        isSelected: selectedCategory == category
                    ) {
                        selectedCategory = category
                    }
                }
            }
            .padding(.horizontal, 16)
        }
    }
}

#Preview {
    VStack {
        CategorySelector(selectedCategory: .constant(nil))
        CategorySelector(selectedCategory: .constant(.concerts))
    }
    .padding(.vertical)
    .background(Color.slate900)
    .environmentObject(ThemeManager.shared)
}
