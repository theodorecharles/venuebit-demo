package com.venuebit.android.ui.screens.discovery

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.local.UserIdentityManager
import com.venuebit.android.data.models.Event
import com.venuebit.android.data.models.EventCategory
import com.venuebit.android.data.models.EventSortBy
import com.venuebit.android.data.models.HomescreenModule
import com.venuebit.android.data.models.HomescreenModuleType
import com.venuebit.android.data.models.ModuleConfig
import com.venuebit.android.data.repository.EventRepository
import com.venuebit.android.services.OptimizelyManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DiscoveryViewModel @Inject constructor(
    private val eventRepository: EventRepository,
    private val userIdentityManager: UserIdentityManager,
    private val optimizelyManager: OptimizelyManager,
    val serverConfig: ServerConfig
) : ViewModel() {

    companion object {
        private const val TAG = "VenueBit.Discovery"
    }

    sealed class UiState {
        data object Loading : UiState()
        data class Success(
            val modules: List<HomescreenModule>,
            val featuredEvents: List<Event>,
            val allEvents: List<Event>,
            // Pre-computed event lists for each module to avoid recomputation during recomposition
            val moduleEvents: Map<String, List<Event>>
        ) : UiState()
        data class Error(val message: String) : UiState()
    }

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    private var isLoading = false
    private var initialLoadComplete = false

    init {
        loadData()

        // Listen for feature changes from OptimizelyManager (triggered by WebSocket datafile updates)
        viewModelScope.launch {
            // Drop the first emission (initial state) to avoid double-loading on startup
            optimizelyManager.featureDecisions.drop(1).collectLatest { features ->
                Log.d(TAG, "Feature decisions changed: ${features.keys}")
                // Reload data when features change (homescreen config may have changed)
                if (initialLoadComplete) {
                    Log.d(TAG, "Reloading data due to feature change")
                    loadData()
                }
            }
        }
    }

    fun loadData() {
        // Prevent concurrent loads
        if (isLoading) {
            Log.d(TAG, "loadData() called but already loading, skipping")
            return
        }

        viewModelScope.launch {
            isLoading = true
            Log.d(TAG, "loadData() starting")

            // Only show loading if we have no data yet
            if (_uiState.value !is UiState.Success) {
                _uiState.value = UiState.Loading
            }

            try {
                val userId = userIdentityManager.getUserId()

                // Refresh features (this will update theme if changed)
                optimizelyManager.refreshFeatures()

                // Fetch events and homescreen config in parallel
                val eventsDeferred = async { eventRepository.getEvents() }
                val configDeferred = async { eventRepository.getHomescreenConfig(userId) }

                val eventsResult = eventsDeferred.await()
                val configResult = configDeferred.await()

                val events = eventsResult.getOrThrow()
                val modules = configResult.getOrElse { defaultModules() }

                val featuredEvents = events.filter { it.featured }

                // Pre-compute events for each module ONCE here, not during composition
                val moduleEvents = modules.associate { module ->
                    module.id to computeEventsForModule(module, events)
                }

                Log.d(TAG, "loadData() success - ${events.size} events, ${modules.size} modules")

                _uiState.value = UiState.Success(
                    modules = modules,
                    featuredEvents = featuredEvents,
                    allEvents = events,
                    moduleEvents = moduleEvents
                )
                initialLoadComplete = true
            } catch (e: Exception) {
                Log.e(TAG, "loadData() failed: ${e.message}")
                // If we already have data, keep showing it
                val currentState = _uiState.value
                if (currentState is UiState.Success) {
                    // Keep existing data but could show a snackbar for the error
                    isLoading = false
                    return@launch
                }
                _uiState.value = UiState.Error(e.message ?: "Failed to load events")
            } finally {
                isLoading = false
            }
        }
    }

    /**
     * Compute events for a module. Called once when data is loaded, not during composition.
     */
    private fun computeEventsForModule(module: HomescreenModule, allEvents: List<Event>): List<Event> {
        val categoryFilters = module.categoryFilters
        val filtered = allEvents.filter { categoryFilters.contains(it.category) }
        val length = module.config.length

        return when (module.module) {
            HomescreenModuleType.HERO_CAROUSEL -> {
                val featured = filtered.filter { it.featured }
                length?.let { featured.take(it) } ?: featured
            }
            HomescreenModuleType.TRENDING_NOW -> {
                // Use seeded shuffle for consistent ordering within a session
                filtered.shuffled(java.util.Random(42)).take(length ?: 6)
            }
            HomescreenModuleType.THIS_WEEKEND -> {
                // Use different seed for weekend events
                filtered.shuffled(java.util.Random(123)).take(length ?: 6)
            }
            HomescreenModuleType.ALL_EVENTS -> {
                val sorted = sortEvents(filtered, module.config.sortBy ?: EventSortBy.DATE_DESC)
                length?.let { sorted.take(it) } ?: sorted
            }
            HomescreenModuleType.CATEGORIES -> filtered
        }
    }

    /**
     * Get pre-computed events for a module. Use this during composition.
     */
    fun getEventsForModule(moduleId: String, state: UiState.Success): List<Event> {
        return state.moduleEvents[moduleId] ?: emptyList()
    }

    fun getEventsForCategory(category: EventCategory, allEvents: List<Event>): List<Event> {
        return allEvents.filter { it.category == category }
    }

    /**
     * Generate a new user ID and reload data to demonstrate A/B test bucketing
     */
    suspend fun generateNewUserIdAndReload() {
        val newUserId = userIdentityManager.generateAndSaveNewUserId()
        Log.d(TAG, "Generated new user ID: $newUserId")
        // Force reload flag reset so loadData() proceeds
        isLoading = false
        loadData()
    }

    private fun sortEvents(events: List<Event>, sortBy: EventSortBy): List<Event> {
        return when (sortBy) {
            EventSortBy.DATE_ASC -> events.sortedBy { it.date }
            EventSortBy.DATE_DESC -> events.sortedByDescending { it.date }
            EventSortBy.ALPHABETICAL_ASC -> events.sortedBy { it.title.lowercase() }
            EventSortBy.TRENDING_DESC -> events.shuffled()
        }
    }

    private fun defaultModules(): List<HomescreenModule> {
        val defaultCategories = listOf("concerts", "sports", "theater", "comedy")
        return listOf(
            HomescreenModule(
                module = HomescreenModuleType.HERO_CAROUSEL,
                config = ModuleConfig(categories = defaultCategories, sortBy = null, length = 4)
            ),
            HomescreenModule(
                module = HomescreenModuleType.CATEGORIES,
                config = ModuleConfig(categories = defaultCategories, sortBy = null, length = null)
            ),
            HomescreenModule(
                module = HomescreenModuleType.TRENDING_NOW,
                config = ModuleConfig(categories = defaultCategories, sortBy = null, length = 6)
            ),
            HomescreenModule(
                module = HomescreenModuleType.THIS_WEEKEND,
                config = ModuleConfig(categories = defaultCategories, sortBy = null, length = 6)
            ),
            HomescreenModule(
                module = HomescreenModuleType.ALL_EVENTS,
                config = ModuleConfig(categories = defaultCategories, sortBy = EventSortBy.DATE_DESC, length = null)
            )
        )
    }
}
