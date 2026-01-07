package com.venuebit.android.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Science
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.venuebit.android.ui.theme.LocalVenueBitColors
import com.venuebit.android.ui.theme.VenueBitColors

@Composable
fun DebugPanelSection(
    userId: String,
    featureDecisions: FeatureDecisionsState,
    onCopyUserId: () -> Unit,
    onGenerateNewId: () -> Unit
) {
    val colors = LocalVenueBitColors.current

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = colors.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Science,
                    contentDescription = null,
                    tint = colors.primaryLight,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "OPTIMIZELY DEBUG",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.primaryLight
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // User ID section
            Text(
                text = "User ID",
                fontSize = 12.sp,
                color = colors.textSecondary
            )

            Spacer(modifier = Modifier.height(8.dp))

            // User ID row with copy button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(colors.surfaceSecondary)
                    .padding(12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = userId.ifEmpty { "Loading..." },
                    fontSize = 14.sp,
                    fontFamily = FontFamily.Monospace,
                    color = colors.textPrimary,
                    modifier = Modifier.weight(1f)
                )
                IconButton(
                    onClick = onCopyUserId,
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy User ID",
                        tint = colors.textSecondary,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Generate new user ID button
            Button(
                onClick = onGenerateNewId,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = colors.primary
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Refresh,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Generate New User ID",
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
            Divider(color = colors.border)
            Spacer(modifier = Modifier.height(16.dp))

            // Feature Flags section
            Text(
                text = "Feature Flags",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = colors.textPrimary
            )

            Spacer(modifier = Modifier.height(12.dp))

            if (featureDecisions.features.isEmpty()) {
                Text(
                    text = "No features loaded",
                    fontSize = 12.sp,
                    color = colors.textTertiary
                )
            } else {
                featureDecisions.features.forEach { (featureKey, feature) ->
                    FeatureFlagRow(name = featureKey, feature = feature)
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
        }
    }
}

@Composable
private fun FeatureFlagRow(
    name: String,
    feature: FeatureInfo
) {
    val colors = LocalVenueBitColors.current

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(colors.surfaceSecondary)
            .padding(12.dp)
    ) {
        // Feature name
        Text(
            text = name,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = colors.primaryLight
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Status and Variation
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(if (feature.enabled) VenueBitColors.Green500 else VenueBitColors.Red500)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = if (feature.enabled) "Enabled" else "Disabled",
                    fontSize = 12.sp,
                    color = if (feature.enabled) VenueBitColors.Green500 else VenueBitColors.Red500
                )
            }
            Text(
                text = "Variation: ${feature.variationKey}",
                fontSize = 12.sp,
                color = colors.textSecondary
            )
        }

        // Variables
        if (feature.variables.isNotEmpty()) {
            Spacer(modifier = Modifier.height(8.dp))
            feature.variables.forEach { (varKey, varValue) ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "• $varKey:",
                        fontSize = 11.sp,
                        color = colors.textSecondary
                    )
                    Text(
                        text = varValue,
                        fontSize = 11.sp,
                        color = when (varValue.lowercase()) {
                            "true" -> VenueBitColors.Green500
                            "false" -> VenueBitColors.Red500
                            else -> colors.primaryLight
                        }
                    )
                }
            }
        }
    }
}
