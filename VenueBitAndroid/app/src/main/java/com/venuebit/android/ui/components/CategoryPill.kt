package com.venuebit.android.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.venuebit.android.data.models.EventCategory
import com.venuebit.android.ui.theme.LocalVenueBitColors

/**
 * Individual category pill button with emoji icon and text.
 * Shows selected state with primary color, unselected with surface and border.
 *
 * @param category The event category to display, or null for "All" option
 * @param isSelected Whether this pill is currently selected
 * @param onClick Callback when pill is tapped
 * @param modifier Modifier for the pill
 * @param label Optional custom label, defaults to category display name or "All"
 */
@Composable
fun CategoryPill(
    category: EventCategory?,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null
) {
    val colors = LocalVenueBitColors.current
    val displayLabel = label ?: category?.displayName ?: "All"
    val emoji = category?.icon

    Surface(
        modifier = modifier.clickable(onClick = onClick),
        shape = RoundedCornerShape(20.dp),
        color = if (isSelected) colors.primary else colors.surfaceSecondary,
        border = if (!isSelected) {
            BorderStroke(1.dp, colors.border)
        } else null
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (emoji != null) {
                Text(
                    text = emoji,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.width(6.dp))
            }
            Text(
                text = displayLabel,
                color = if (isSelected) Color.White else colors.textSecondary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

/**
 * Horizontal scrolling category selector with "All" option first.
 * Uses LazyRow for efficient scrolling with 8.dp spacing and 16.dp horizontal padding.
 *
 * @param categories List of categories to display
 * @param selectedCategory Currently selected category, null means "All" is selected
 * @param onCategorySelected Callback when a category is selected
 * @param modifier Modifier for the selector
 */
@Composable
fun CategorySelector(
    categories: List<EventCategory>,
    selectedCategory: EventCategory?,
    onCategorySelected: (EventCategory?) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyRow(
        modifier = modifier,
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // "All" option first
        item {
            CategoryPill(
                category = null,
                isSelected = selectedCategory == null,
                onClick = { onCategorySelected(null) },
                label = "All"
            )
        }

        // Category pills
        items(categories) { category ->
            CategoryPill(
                category = category,
                isSelected = selectedCategory == category,
                onClick = { onCategorySelected(category) }
            )
        }
    }
}

/**
 * Small badge showing category icon and name.
 * Used as an overlay on event cards.
 *
 * @param icon Emoji icon to display
 * @param name Category name
 * @param modifier Modifier for the badge
 */
@Composable
fun CategoryBadge(
    icon: String,
    name: String,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(8.dp),
        color = colors.surface.copy(alpha = 0.9f)
    ) {
        Row(
            modifier = Modifier.padding(6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = icon,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = name,
                color = colors.textPrimary,
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
