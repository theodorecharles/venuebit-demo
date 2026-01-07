package com.venuebit.android.ui.screens.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.local.UserIdentityManager
import com.venuebit.android.data.models.Event
import com.venuebit.android.data.models.EventCategory
import com.venuebit.android.data.repository.EventRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for the Search screen.
 * Handles search query input, debounced API calls, category filtering, and results state.
 */
@HiltViewModel
class SearchViewModel @Inject constructor(
    private val eventRepository: EventRepository,
    private val userIdentityManager: UserIdentityManager,
    val serverConfig: ServerConfig
) : ViewModel() {

    // Search query text input
    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    // Selected category for filtering results
    private val _selectedCategory = MutableStateFlow<EventCategory?>(null)
    val selectedCategory: StateFlow<EventCategory?> = _selectedCategory.asStateFlow()

    // Raw search results from API
    private val _searchResults = MutableStateFlow<List<Event>>(emptyList())

    // Loading state
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    // Tracks whether user has performed at least one search
    private val _hasSearched = MutableStateFlow(false)
    val hasSearched: StateFlow<Boolean> = _hasSearched.asStateFlow()

    // Error message state
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    /**
     * Filtered results combining search results with selected category filter.
     */
    private val _filteredResults = MutableStateFlow<List<Event>>(emptyList())
    val filteredResults: StateFlow<List<Event>> = _filteredResults.asStateFlow()

    init {
        setupDebouncedSearch()
        setupFilteredResults()
    }

    /**
     * Sets up debounced search that triggers API call 300ms after user stops typing.
     * Only triggers when query is not empty.
     */
    @OptIn(FlowPreview::class)
    private fun setupDebouncedSearch() {
        viewModelScope.launch {
            _query
                .debounce(300)
                .filter { it.isNotEmpty() }
                .collectLatest { queryText ->
                    performSearch(queryText)
                }
        }
    }

    /**
     * Sets up the filtered results flow that combines search results with category filter.
     */
    private fun setupFilteredResults() {
        viewModelScope.launch {
            combine(_searchResults, _selectedCategory) { results, category ->
                if (category != null) {
                    results.filter { it.category == category }
                } else {
                    results
                }
            }.collectLatest { filtered ->
                _filteredResults.value = filtered
            }
        }
    }

    /**
     * Updates the search query.
     * If query becomes empty, clears results and resets hasSearched state.
     */
    fun updateQuery(newQuery: String) {
        _query.value = newQuery
        _errorMessage.value = null

        if (newQuery.isEmpty()) {
            _searchResults.value = emptyList()
            _hasSearched.value = false
        }
    }

    /**
     * Updates the selected category filter.
     * Pass null to show all categories.
     */
    fun selectCategory(category: EventCategory?) {
        _selectedCategory.value = category
    }

    /**
     * Clears the current search and resets state.
     */
    fun clearSearch() {
        _query.value = ""
        _searchResults.value = emptyList()
        _hasSearched.value = false
        _selectedCategory.value = null
        _errorMessage.value = null
    }

    /**
     * Performs the search API call.
     */
    private suspend fun performSearch(query: String) {
        if (query.isBlank()) {
            _searchResults.value = emptyList()
            return
        }

        _isLoading.value = true
        _errorMessage.value = null

        try {
            val userId = userIdentityManager.getUserId()
            val result = eventRepository.searchEvents(query, userId)

            result.fold(
                onSuccess = { events ->
                    _searchResults.value = events
                    _hasSearched.value = true
                },
                onFailure = { exception ->
                    _errorMessage.value = exception.message ?: "Search failed"
                    _searchResults.value = emptyList()
                    _hasSearched.value = true
                }
            )
        } catch (e: Exception) {
            _errorMessage.value = e.message ?: "An unexpected error occurred"
            _searchResults.value = emptyList()
            _hasSearched.value = true
        } finally {
            _isLoading.value = false
        }
    }
}
