package com.venuebit.android.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
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
import com.venuebit.android.ui.theme.LocalVenueBitColors

/**
 * Small surface with price text on primary color background.
 * Used for displaying event prices in cards and lists.
 *
 * @param price Price string to display (e.g., "$99")
 * @param modifier Modifier for the tag
 */
@Composable
fun PriceTag(
    price: String,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(6.dp),
        color = colors.primary
    ) {
        Text(
            text = price,
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}

/**
 * Displays a price range with min and max values.
 * Format: $min - $max
 *
 * @param minPrice Minimum price value
 * @param maxPrice Maximum price value
 * @param modifier Modifier for the view
 */
@Composable
fun PriceRangeView(
    minPrice: Double,
    maxPrice: Double,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "$",
            color = colors.textTertiary,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "${minPrice.toInt()}",
            color = Color.White,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = "-",
            color = colors.textTertiary,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = "$${maxPrice.toInt()}",
            color = Color.White,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

/**
 * Price tag with optional label above.
 * Used for detailed price displays (e.g., "From $99").
 *
 * @param price Price value to display
 * @param label Optional label (e.g., "From")
 * @param modifier Modifier for the view
 */
@Composable
fun PriceTagWithLabel(
    price: Double,
    label: String? = null,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.Bottom
    ) {
        if (label != null) {
            Text(
                text = label,
                color = colors.textTertiary,
                fontSize = 10.sp,
                modifier = Modifier.padding(end = 4.dp)
            )
        }
        Text(
            text = "$${price.toInt()}",
            color = colors.primaryLight,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold
        )
    }
}
