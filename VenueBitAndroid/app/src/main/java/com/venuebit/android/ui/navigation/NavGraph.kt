package com.venuebit.android.ui.navigation

import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.venuebit.android.data.local.TicketBadgeManager
import com.venuebit.android.ui.screens.discovery.AllEventsListScreen
import com.venuebit.android.ui.screens.discovery.CategoryEventsScreen
import com.venuebit.android.ui.screens.discovery.DiscoveryScreen
import com.venuebit.android.ui.screens.eventdetail.EventDetailScreen
import com.venuebit.android.ui.screens.search.SearchScreen
import com.venuebit.android.ui.screens.settings.SettingsScreen
import com.venuebit.android.ui.screens.tickets.MyTicketsScreen
import com.venuebit.android.ui.screens.webview.SeatSelectionWebViewScreen

/**
 * Main navigation graph for the VenueBit app.
 * Defines all navigation routes and their corresponding screens.
 */
@Composable
fun MainNavGraph(
    navController: NavHostController,
    ticketBadgeManager: TicketBadgeManager? = null,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Discovery.route,
        modifier = modifier
    ) {
        // Discovery Screen (Home)
        composable(route = Screen.DISCOVERY_ROUTE) {
            DiscoveryScreen(
                onEventClick = { event ->
                    navController.navigate(Screen.EventDetail.createRoute(event.id))
                },
                onCategoryClick = { category ->
                    navController.navigate(Screen.CategoryEvents.createRoute(category.name.lowercase()))
                },
                onSeeAllClick = { type, _ ->
                    navController.navigate(Screen.AllEventsList.createRoute(type))
                }
            )
        }

        // Search Screen
        composable(route = Screen.SEARCH_ROUTE) {
            SearchScreen(
                onEventClick = { event ->
                    navController.navigate(Screen.EventDetail.createRoute(event.id))
                }
            )
        }

        // My Tickets Screen
        composable(route = Screen.TICKETS_ROUTE) {
            MyTicketsScreen()
        }

        // Settings Screen
        composable(route = Screen.SETTINGS_ROUTE) {
            SettingsScreen()
        }

        // Event Detail Screen
        composable(
            route = Screen.EVENT_DETAIL_ROUTE,
            arguments = listOf(
                navArgument(Screen.ARG_EVENT_ID) {
                    type = NavType.StringType
                }
            )
        ) {
            EventDetailScreen(
                onBackClick = {
                    navController.popBackStack()
                },
                onGetTicketsClick = { event ->
                    navController.navigate(Screen.SeatSelection.createRoute(event.id))
                }
            )
        }

        // Category Events Screen
        composable(
            route = Screen.CATEGORY_EVENTS_ROUTE,
            arguments = listOf(
                navArgument(Screen.ARG_CATEGORY) {
                    type = NavType.StringType
                }
            )
        ) { backStackEntry ->
            val category = backStackEntry.arguments?.getString(Screen.ARG_CATEGORY) ?: ""
            CategoryEventsScreen(
                category = category,
                onBackClick = {
                    navController.popBackStack()
                },
                onEventClick = { event ->
                    navController.navigate(Screen.EventDetail.createRoute(event.id))
                }
            )
        }

        // All Events List Screen
        composable(
            route = Screen.ALL_EVENTS_ROUTE,
            arguments = listOf(
                navArgument(Screen.ARG_TYPE) {
                    type = NavType.StringType
                }
            )
        ) { backStackEntry ->
            val type = backStackEntry.arguments?.getString(Screen.ARG_TYPE) ?: ""
            AllEventsListScreen(
                type = type,
                onBackClick = {
                    navController.popBackStack()
                },
                onEventClick = { event ->
                    navController.navigate(Screen.EventDetail.createRoute(event.id))
                }
            )
        }

        // Seat Selection WebView Screen (Full Screen - no bottom nav)
        composable(
            route = Screen.SEAT_SELECTION_ROUTE,
            arguments = listOf(
                navArgument(Screen.ARG_EVENT_ID) {
                    type = NavType.StringType
                }
            )
        ) { backStackEntry ->
            val eventId = backStackEntry.arguments?.getString(Screen.ARG_EVENT_ID) ?: ""
            Log.d("NavGraph", "SeatSelection eventId from nav args: '$eventId'")

            // Track if purchase was made so we know where to navigate on close
            val purchaseMade = remember { mutableStateOf(false) }

            SeatSelectionWebViewScreen(
                eventId = eventId,
                onPurchaseComplete = { orderId, total ->
                    // Just track that purchase happened - don't navigate yet
                    // User stays on confirmation page until they click Close
                    Log.d("NavGraph", "Purchase complete - orderId: $orderId, total: $total")
                    purchaseMade.value = true
                    // Set badge on tickets tab
                    ticketBadgeManager?.onPurchaseComplete()
                },
                onClose = {
                    // Navigate based on whether purchase was made
                    if (purchaseMade.value) {
                        Log.d("NavGraph", "Purchase was made - navigating to Discovery and clearing stack")
                        // Go to discovery tab after purchase (user can tap badge to see tickets)
                        // Clear the entire back stack to avoid WebView being restored
                        navController.navigate(Screen.Discovery.route) {
                            // Pop everything including the start destination
                            popUpTo(0) {
                                inclusive = true
                            }
                            launchSingleTop = true
                        }
                    } else {
                        Log.d("NavGraph", "No purchase - popping back")
                        // Just go back if no purchase
                        navController.popBackStack()
                    }
                }
            )
        }
    }
}
