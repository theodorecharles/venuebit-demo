package com.venuebit.android.ui.screens.settings

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.venuebit.android.ui.theme.LocalVenueBitColors

@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val colors = LocalVenueBitColors.current

    val userId by viewModel.userId.collectAsState()
    val serverAddress by viewModel.serverAddress.collectAsState()
    val featureDecisions by viewModel.featureDecisions.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Settings header
        item {
            Text(
                text = "Settings",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = colors.textPrimary,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }

        // Debug Panel Section
        item {
            DebugPanelSection(
                userId = userId,
                featureDecisions = featureDecisions,
                onCopyUserId = {
                    viewModel.copyUserIdToClipboard(context)
                    Toast.makeText(context, "User ID copied to clipboard", Toast.LENGTH_SHORT).show()
                },
                onGenerateNewId = {
                    viewModel.generateNewUserId()
                    Toast.makeText(context, "New User ID generated", Toast.LENGTH_SHORT).show()
                }
            )
        }

        // About Section
        item {
            AboutSection()
        }

        // Server Config Section
        item {
            ServerConfigSection(
                serverAddress = serverAddress,
                isLocalServer = viewModel.isLocalServer,
                onAddressChange = { address ->
                    viewModel.setServerAddress(address)
                    Toast.makeText(
                        context,
                        "Server changed to $address. Pull to refresh to reload data.",
                        Toast.LENGTH_LONG
                    ).show()
                }
            )
        }

        // Bottom padding for navigation bar
        item {
            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}
