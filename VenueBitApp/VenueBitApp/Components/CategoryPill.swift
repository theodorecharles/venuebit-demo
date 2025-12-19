import SwiftUI

struct CategoryPill: View {
    let category: EventCategory
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(category.icon)
                Text(category.displayName)
                    .font(.subheadline.bold())
            }
            .foregroundColor(isSelected ? .white : .slate300)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(
                isSelected ? Color.indigo500 : Color.slate700
            )
            .cornerRadius(20)
        }
    }
}

struct CategorySelector: View {
    @Binding var selectedCategory: EventCategory?
    var categories: [EventCategory] = EventCategory.allCases

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // All category
                Button(action: { selectedCategory = nil }) {
                    Text("All")
                        .font(.subheadline.bold())
                        .foregroundColor(selectedCategory == nil ? .white : .slate300)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(
                            selectedCategory == nil ? Color.indigo500 : Color.slate700
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
}
