package com.venuebit.android.ui.components

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
import com.venuebit.android.R
import com.venuebit.android.ui.theme.VenueBitColors

// Note: Requires pacifico_regular.ttf font file in res/font/
val PacificoFontFamily = FontFamily(
    Font(R.font.pacifico_regular)
)

@Composable
fun VenueBitLogo(
    modifier: Modifier = Modifier,
    fontSize: TextUnit = 28.sp
) {
    val gradientBrush = Brush.horizontalGradient(
        colors = listOf(
            VenueBitColors.Indigo400,
            VenueBitColors.Indigo500
        )
    )

    Text(
        text = "VenueBit",
        style = TextStyle(
            fontFamily = PacificoFontFamily,
            fontSize = fontSize,
            brush = gradientBrush
        ),
        modifier = modifier
    )
}
