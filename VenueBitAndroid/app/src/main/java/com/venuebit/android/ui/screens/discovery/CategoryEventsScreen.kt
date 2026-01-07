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
import com.venuebit.android.data.models.EventCategory
import com.venuebit.android.ui.components.EmptyStateView
import com.venuebit.android.ui.components.ErrorView
import com.venuebit.android.ui.components.LoadingView
import com.venuebit.android.ui.screens.search.SearchResultCard
import com.venuebit.android.ui.theme.LocalVenueBitColors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CategoryEventsScreen(
    category: String,
    viewModel: DiscoveryViewModel = hiltViewModel(),
    onBackClick: () -> Unit,
    onEventClick: (Event) -> Unit
) {
    val colors = LocalVenueBitColors.current
    val uiState by viewModel.uiState.collectAsState()

    val eventCategory = try {
        EventCategory.valueOf(category.uppercase())
    } catch (e: Exception) {
        null
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = eventCategory?.displayName ?: category,
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
                    val filteredEvents = if (eventCategory != null) {
                        state.allEvents.filter { it.category == eventCategory }
                    } else {
                        state.allEvents
                    }

                    if (filteredEvents.isEmpty()) {
                        EmptyStateView(
                            icon = eventCategory?.icon ?: "🎫",
                            title = "No Events",
                            message = "No ${eventCategory?.displayName ?: category} events available"
                        )
                    } else {
                        LazyColumn(
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(filteredEvents) { event ->
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
