package com.venuebit.android.ui.screens.discovery

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.venuebit.android.data.models.Event
import com.venuebit.android.ui.components.EmptyStateView
import com.venuebit.android.ui.components.ErrorView
import com.venuebit.android.ui.components.LoadingView
import com.venuebit.android.ui.screens.search.SearchResultCard
import com.venuebit.android.ui.theme.LocalVenueBitColors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AllEventsListScreen(
    type: String,
    viewModel: DiscoveryViewModel = hiltViewModel(),
    onBackClick: () -> Unit,
    onEventClick: (Event) -> Unit
) {
    val colors = LocalVenueBitColors.current
    val uiState by viewModel.uiState.collectAsState()

    val title = when (type) {
        "trending" -> "Trending Now"
        "weekend" -> "This Weekend"
        "all" -> "All Events"
        else -> "Events"
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = title,
                        color = colors.textPrimary
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = colors.textPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = colors.background
                )
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(colors.background)
        ) {
            when (val state = uiState) {
                is DiscoveryViewModel.UiState.Loading -> LoadingView()

                is DiscoveryViewModel.UiState.Error -> ErrorView(
                    message = state.message,
                    onRetry = { viewModel.loadData() }
                )

                is DiscoveryViewModel.UiState.Success -> {
                    // Get events from pre-computed module events or fall back to all events
                    val events = when (type) {
                        "trending", "Trending Now" -> state.moduleEvents.values.flatten()
                            .takeIf { type == "trending" }
                            ?: state.moduleEvents.entries
                                .find { it.key.contains("trending", ignoreCase = true) }?.value
                            ?: state.allEvents.take(6)
                        "weekend", "This Weekend" -> state.moduleEvents.entries
                            .find { it.key.contains("weekend", ignoreCase = true) }?.value
                            ?: state.allEvents.take(6)
                        else -> state.allEvents
                    }

                    if (events.isEmpty()) {
                        EmptyStateView(
                            icon = "🎫",
                            title = "No Events",
                            message = "No events available at this time"
                        )
                    } else {
                        LazyColumn(
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(events) { event ->
                                SearchResultCard(
                                    event = event,
                                    serverConfig = viewModel.serverConfig,
                                    onClick = { onEventClick(event) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
