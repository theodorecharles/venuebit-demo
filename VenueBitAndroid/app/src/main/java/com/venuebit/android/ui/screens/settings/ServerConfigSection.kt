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
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.venuebit.android.ui.theme.LocalVenueBitColors
import com.venuebit.android.ui.theme.VenueBitColors

@Composable
fun ServerConfigSection(
    serverAddress: String,
    isLocalServer: Boolean,
    onAddressChange: (String) -> Unit
) {
    val colors = LocalVenueBitColors.current
    var inputAddress by remember { mutableStateOf(serverAddress) }

    // Update input when serverAddress changes externally
    LaunchedEffect(serverAddress) {
        inputAddress = serverAddress
    }

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
            // Header with status indicator
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Storage,
                        contentDescription = null,
                        tint = colors.primaryLight,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "SERVER",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.primaryLight
                    )
                }

                // Status indicator
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(if (isLocalServer) VenueBitColors.Green500 else VenueBitColors.Orange500)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isLocalServer) "Local" else "Remote",
                        fontSize = 12.sp,
                        color = colors.textSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Server Address label
            Text(
                text = "Server Address",
                fontSize = 12.sp,
                color = colors.textSecondary
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Server address input
            OutlinedTextField(
                value = inputAddress,
                onValueChange = { inputAddress = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = {
                    Text(
                        text = "localhost",
                        fontFamily = FontFamily.Monospace
                    )
                },
                textStyle = androidx.compose.ui.text.TextStyle(
                    fontFamily = FontFamily.Monospace,
                    fontSize = 14.sp,
                    color = colors.textPrimary
                ),
                singleLine = true,
                shape = RoundedCornerShape(8.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = colors.primary,
                    unfocusedBorderColor = colors.border,
                    focusedContainerColor = colors.surfaceSecondary,
                    unfocusedContainerColor = colors.surfaceSecondary,
                    cursorColor = colors.primary
                )
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Current status display
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(if (serverAddress == "localhost") VenueBitColors.Green500 else VenueBitColors.Orange500)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (serverAddress == "localhost") "Local: localhost" else "Remote: $serverAddress",
                    fontSize = 12.sp,
                    color = colors.textSecondary
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Preset buttons row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                PresetButton(
                    text = "localhost",
                    isSelected = serverAddress == "localhost",
                    onClick = {
                        inputAddress = "localhost"
                        onAddressChange("localhost")
                    },
                    modifier = Modifier.weight(1f)
                )
                PresetButton(
                    text = "venuebit.tedcharles.net",
                    isSelected = serverAddress == "venuebit.tedcharles.net",
                    onClick = {
                        inputAddress = "venuebit.tedcharles.net"
                        onAddressChange("venuebit.tedcharles.net")
                    },
                    modifier = Modifier.weight(1f)
                )
            }

            // Only show Apply button if the input differs from current server address
            if (inputAddress != serverAddress) {
                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = { onAddressChange(inputAddress) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = colors.primary
                    )
                ) {
                    Text(
                        text = "Apply",
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
private fun PresetButton(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    if (isSelected) {
        Button(
            onClick = onClick,
            modifier = modifier,
            shape = RoundedCornerShape(6.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = colors.primary
            )
        ) {
            Text(
                text = text,
                fontSize = 12.sp,
                maxLines = 1
            )
        }
    } else {
        OutlinedButton(
            onClick = onClick,
            modifier = modifier,
            shape = RoundedCornerShape(6.dp),
            colors = ButtonDefaults.outlinedButtonColors(
                contentColor = colors.textSecondary
            )
        ) {
            Text(
                text = text,
                fontSize = 12.sp,
                maxLines = 1
            )
        }
    }
}
