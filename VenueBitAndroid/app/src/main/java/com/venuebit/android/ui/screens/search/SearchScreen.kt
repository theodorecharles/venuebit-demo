package com.venuebit.android.ui.screens.search

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.venuebit.android.data.models.Event
import com.venuebit.android.data.models.EventCategory
import com.venuebit.android.ui.components.CategorySelector
import com.venuebit.android.ui.components.EmptyStateView
import com.venuebit.android.ui.components.LoadingView
import com.venuebit.android.ui.theme.LocalVenueBitColors

/**
 * Search screen composable.
 * Displays a search bar, category filter, and search results.
 *
 * @param viewModel The SearchViewModel instance (injected via Hilt)
 * @param onEventClick Callback when an event is clicked
 */
@Composable
fun SearchScreen(
    viewModel: SearchViewModel = hiltViewModel(),
    onEventClick: (Event) -> Unit
) {
    val colors = LocalVenueBitColors.current

    val query by viewModel.query.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val filteredResults by viewModel.filteredResults.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val hasSearched by viewModel.hasSearched.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
    ) {
        // Header
        Text(
            text = "Search",
            color = colors.textPrimary,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .padding(top = 16.dp, bottom = 8.dp)
        )

        // Search bar
        com.venuebit.android.ui.components.SearchBar(
            query = query,
            onQueryChange = { newQuery ->
                if (newQuery.isEmpty()) {
                    viewModel.clearSearch()
                } else {
                    viewModel.updateQuery(newQuery)
                }
            },
            placeholder = "Search events, artists, venues...",
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Category selector for filtering
        CategorySelector(
            categories = EventCategory.entries,
            selectedCategory = selectedCategory,
            onCategorySelected = { viewModel.selectCategory(it) }
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Content based on state
        Box(
            modifier = Modifier
                .fillMaxSize()
                .weight(1f)
        ) {
            when {
                isLoading -> {
                    LoadingView(
                        message = "Searching...",
                        modifier = Modifier.fillMaxSize()
                    )
                }

                !hasSearched -> {
                    // Initial state - show search prompt
                    EmptyStateView(
                        icon = "\uD83D\uDD0D", // Magnifying glass emoji
                        title = "Search Events",
                        message = "Find concerts, sports, theater, and more",
                        modifier = Modifier
                            .fillMaxSize()
                            .align(Alignment.Center)
                    )
                }

                filteredResults.isEmpty() -> {
                    // No results found
                    EmptyStateView(
                        icon = "\uD83D\uDD0D", // Magnifying glass emoji
                        title = "No Results",
                        message = "Try a different search term or category",
                        modifier = Modifier
                            .fillMaxSize()
                            .align(Alignment.Center)
                    )
                }

                else -> {
                    // Show search results
                    SearchResultsList(
                        events = filteredResults,
                        serverConfig = viewModel.serverConfig,
                        onEventClick = onEventClick
                    )
                }
            }
        }
    }
}

/**
 * LazyColumn displaying search result cards.
 */
@Composable
private fun SearchResultsList(
    events: List<Event>,
    serverConfig: com.venuebit.android.data.local.ServerConfig,
    onEventClick: (Event) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(
            horizontal = 16.dp,
            vertical = 8.dp
        ),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(
            items = events,
            key = { it.id }
        ) { event ->
            SearchResultCard(
                event = event,
                serverConfig = serverConfig,
                onClick = { onEventClick(event) }
            )
        }

        // Bottom padding for navigation bar
        item {
            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}
