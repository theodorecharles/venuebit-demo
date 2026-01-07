package com.venuebit.android.ui.screens.discovery

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.pullrefresh.PullRefreshIndicator
import androidx.compose.material.pullrefresh.pullRefresh
import androidx.compose.material.pullrefresh.rememberPullRefreshState
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.models.Event
import com.venuebit.android.data.models.EventCategory
import com.venuebit.android.data.models.HomescreenModuleType
import com.venuebit.android.ui.components.ErrorView
import com.venuebit.android.ui.components.LoadingView
import com.venuebit.android.ui.components.VenueBitLogo
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterialApi::class)
@Composable
fun DiscoveryScreen(
    viewModel: DiscoveryViewModel = hiltViewModel(),
    onEventClick: (Event) -> Unit,
    onCategoryClick: (EventCategory) -> Unit,
    onSeeAllClick: (String, List<Event>) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val scope = rememberCoroutineScope()
    var isRefreshing by remember { mutableStateOf(false) }

    val pullRefreshState = rememberPullRefreshState(
        refreshing = isRefreshing,
        onRefresh = {
            scope.launch {
                isRefreshing = true
                viewModel.loadData()
                delay(500) // Minimum refresh time for visual feedback
                isRefreshing = false
            }
        }
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .pullRefresh(pullRefreshState)
    ) {
        when (val state = uiState) {
            is DiscoveryViewModel.UiState.Loading -> {
                LoadingView(message = "Loading events...")
            }

            is DiscoveryViewModel.UiState.Error -> {
                ErrorView(
                    message = state.message,
                    onRetry = { viewModel.loadData() }
                )
            }

            is DiscoveryViewModel.UiState.Success -> {
                DiscoveryContent(
                    state = state,
                    serverConfig = viewModel.serverConfig,
                    viewModel = viewModel,
                    onEventClick = onEventClick,
                    onCategoryClick = onCategoryClick,
                    onSeeAllClick = onSeeAllClick
                )
            }
        }

        PullRefreshIndicator(
            refreshing = isRefreshing,
            state = pullRefreshState,
            modifier = Modifier.align(Alignment.TopCenter),
            backgroundColor = MaterialTheme.colorScheme.surface,
            contentColor = MaterialTheme.colorScheme.primary
        )
    }
}

@Composable
private fun DiscoveryContent(
    state: DiscoveryViewModel.UiState.Success,
    serverConfig: ServerConfig,
    viewModel: DiscoveryViewModel,
    onEventClick: (Event) -> Unit,
    onCategoryClick: (EventCategory) -> Unit,
    onSeeAllClick: (String, List<Event>) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 100.dp) // Space for FAB/bottom nav
    ) {
        // Header with VenueBit logo
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                VenueBitLogo(fontSize = 28.sp)
            }
        }

        // Render modules based on config
        items(state.modules, key = { it.id }) { module ->
            // Get pre-computed events from state (not recomputed on each recomposition)
            val events = viewModel.getEventsForModule(module.id, state)

            when (module.module) {
                HomescreenModuleType.HERO_CAROUSEL -> {
                    if (events.isNotEmpty()) {
                        FeaturedEventsCarousel(
                            events = events,
                            serverConfig = serverConfig,
                            onEventClick = onEventClick
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }

                HomescreenModuleType.CATEGORIES -> {
                    CategoriesSection(
                        categories = module.categoryFilters,
                        onCategoryClick = onCategoryClick
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                }

                HomescreenModuleType.TRENDING_NOW -> {
                    if (events.isNotEmpty()) {
                        EventsHorizontalSection(
                            title = "Trending Now",
                            events = events,
                            serverConfig = serverConfig,
                            onEventClick = onEventClick,
                            onSeeAllClick = { onSeeAllClick("Trending Now", events) }
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }

                HomescreenModuleType.THIS_WEEKEND -> {
                    if (events.isNotEmpty()) {
                        EventsHorizontalSection(
                            title = "This Weekend",
                            events = events,
                            serverConfig = serverConfig,
                            onEventClick = onEventClick,
                            onSeeAllClick = { onSeeAllClick("This Weekend", events) }
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }

                HomescreenModuleType.ALL_EVENTS -> {
                    if (events.isNotEmpty()) {
                        AllEventsSection(
                            title = "All Events",
                            events = events,
                            serverConfig = serverConfig,
                            onEventClick = onEventClick,
                            onSeeAllClick = { onSeeAllClick("All Events", events) }
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
            }
        }
    }
}
