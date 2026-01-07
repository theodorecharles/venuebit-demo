package com.venuebit.android.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

/**
 * VenueBit shape definitions for consistent UI corners
 */
object VenueBitShapes {
    // Card corners - used for cards, dialogs, bottom sheets
    val CardCornerRadius = 12.dp
    val CardShape = RoundedCornerShape(CardCornerRadius)

    // Pill corners - used for buttons, chips, tags
    val PillCornerRadius = 20.dp
    val PillShape = RoundedCornerShape(PillCornerRadius)

    // Small corners - used for small components like text fields
    val SmallCornerRadius = 8.dp
    val SmallShape = RoundedCornerShape(SmallCornerRadius)

    // Extra small corners - used for very small components
    val ExtraSmallCornerRadius = 4.dp
    val ExtraSmallShape = RoundedCornerShape(ExtraSmallCornerRadius)

    // Full rounded - for circular elements
    val FullRounded = RoundedCornerShape(percent = 50)
}

/**
 * Material3 Shapes configured for VenueBit
 */
val VenueBitMaterialShapes = Shapes(
    small = VenueBitShapes.SmallShape,
    medium = VenueBitShapes.CardShape,
    large = VenueBitShapes.PillShape
)
