package com.venuebit.android.ui.navigation

/**
 * Sealed class representing all navigation destinations in the VenueBit app.
 * Each screen has a unique route used for navigation.
 */
sealed class Screen(val route: String) {

    // Bottom navigation destinations
    object Discovery : Screen(DISCOVERY_ROUTE)
    object Search : Screen(SEARCH_ROUTE)
    object Tickets : Screen(TICKETS_ROUTE)
    object Settings : Screen(SETTINGS_ROUTE)

    // Detail screens with arguments
    data class EventDetail(val eventId: String) : Screen("$EVENT_DETAIL_ROUTE_BASE/$eventId") {
        companion object {
            fun createRoute(eventId: String) = "$EVENT_DETAIL_ROUTE_BASE/$eventId"
        }
    }

    data class CategoryEvents(val category: String) : Screen("$CATEGORY_EVENTS_ROUTE_BASE/$category") {
        companion object {
            fun createRoute(category: String) = "$CATEGORY_EVENTS_ROUTE_BASE/$category"
        }
    }

    data class AllEventsList(val type: String) : Screen("$ALL_EVENTS_ROUTE_BASE/$type") {
        companion object {
            fun createRoute(type: String) = "$ALL_EVENTS_ROUTE_BASE/$type"
        }
    }

    data class SeatSelection(val eventId: String) : Screen("$SEAT_SELECTION_ROUTE_BASE/$eventId") {
        companion object {
            fun createRoute(eventId: String) = "$SEAT_SELECTION_ROUTE_BASE/$eventId"
        }
    }

    companion object {
        // Route constants
        const val DISCOVERY_ROUTE = "discovery"
        const val SEARCH_ROUTE = "search"
        const val TICKETS_ROUTE = "tickets"
        const val SETTINGS_ROUTE = "settings"

        // Route bases for parameterized screens
        const val EVENT_DETAIL_ROUTE_BASE = "event"
        const val CATEGORY_EVENTS_ROUTE_BASE = "category"
        const val ALL_EVENTS_ROUTE_BASE = "events"
        const val SEAT_SELECTION_ROUTE_BASE = "seats"

        // Full route patterns with placeholders
        const val EVENT_DETAIL_ROUTE = "event/{eventId}"
        const val CATEGORY_EVENTS_ROUTE = "category/{category}"
        const val ALL_EVENTS_ROUTE = "events/{type}"
        const val SEAT_SELECTION_ROUTE = "seats/{eventId}"

        // Argument names
        const val ARG_EVENT_ID = "eventId"
        const val ARG_CATEGORY = "category"
        const val ARG_TYPE = "type"

        // Full-screen routes (without bottom navigation)
        val fullScreenRoutes = listOf(SEAT_SELECTION_ROUTE_BASE)

        /**
         * Check if a route is a full-screen route that should hide the bottom navigation bar.
         */
        fun isFullScreenRoute(route: String?): Boolean {
            if (route == null) return false
            return fullScreenRoutes.any { route.startsWith(it) }
        }
    }
}
