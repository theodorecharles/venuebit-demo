package com.venuebit.android.ui.screens.settings

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.venuebit.android.ui.theme.LocalVenueBitColors

@Composable
fun AboutSection() {
    val colors = LocalVenueBitColors.current

    Column {
        // Header
        Text(
            text = "ABOUT",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textSecondary,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(
                containerColor = colors.surface
            )
        ) {
            Column {
                AboutRow(label = "App Version", value = "1.0.0")
                Divider(color = colors.border)
                AboutRow(label = "Build", value = "Demo")
                Divider(color = colors.border)
                AboutRow(label = "Platform", value = "Android")
            }
        }
    }
}

@Composable
fun AboutRow(
    label: String,
    value: String
) {
    val colors = LocalVenueBitColors.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            fontSize = 14.sp,
            color = colors.textSecondary
        )
        Text(
            text = value,
            fontSize = 14.sp,
            color = colors.textTertiary
        )
    }
}
