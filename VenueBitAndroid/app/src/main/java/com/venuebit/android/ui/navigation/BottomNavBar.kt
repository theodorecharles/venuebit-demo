package com.venuebit.android.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ConfirmationNumber
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.ConfirmationNumber
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState
import com.venuebit.android.data.local.TicketBadgeManager
import com.venuebit.android.ui.theme.LocalVenueBitColors

/**
 * Data class representing a bottom navigation item.
 */
data class BottomNavItem(
    val screen: Screen,
    val icon: ImageVector,
    val selectedIcon: ImageVector,
    val label: String
)

/**
 * List of bottom navigation items.
 */
val bottomNavItems = listOf(
    BottomNavItem(
        screen = Screen.Discovery,
        icon = Icons.Outlined.Home,
        selectedIcon = Icons.Filled.Home,
        label = "Discover"
    ),
    BottomNavItem(
        screen = Screen.Search,
        icon = Icons.Outlined.Search,
        selectedIcon = Icons.Filled.Search,
        label = "Search"
    ),
    BottomNavItem(
        screen = Screen.Tickets,
        icon = Icons.Outlined.ConfirmationNumber,
        selectedIcon = Icons.Filled.ConfirmationNumber,
        label = "Tickets"
    ),
    BottomNavItem(
        screen = Screen.Settings,
        icon = Icons.Outlined.Settings,
        selectedIcon = Icons.Filled.Settings,
        label = "Settings"
    )
)

/**
 * Routes that are related to Discovery (should highlight Discover tab)
 */
private val discoveryRelatedRoutes = listOf(
    Screen.DISCOVERY_ROUTE,
    Screen.EVENT_DETAIL_ROUTE_BASE,
    Screen.CATEGORY_EVENTS_ROUTE_BASE,
    Screen.ALL_EVENTS_ROUTE_BASE
)

/**
 * Bottom navigation bar composable for the VenueBit app.
 * Displays navigation items and handles route highlighting.
 */
@Composable
fun BottomNavBar(
    navController: NavController,
    ticketBadgeManager: TicketBadgeManager? = null,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Collect badge state
    val hasNewTickets by ticketBadgeManager?.hasNewTickets?.collectAsState()
        ?: androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(false) }

    NavigationBar(
        modifier = modifier,
        containerColor = colors.surface,
        contentColor = colors.textPrimary
    ) {
        bottomNavItems.forEach { item ->
            // Determine selection state
            val isSelected = when (item.screen) {
                is Screen.Discovery -> {
                    // Discover is selected for discovery route and its child routes
                    currentRoute != null && discoveryRelatedRoutes.any { base ->
                        currentRoute == base || currentRoute.startsWith("$base/")
                    }
                }
                else -> currentRoute == item.screen.route
            }

            // Show badge on tickets tab if there are new tickets
            val showBadge = item.screen == Screen.Tickets && hasNewTickets

            NavigationBarItem(
                icon = {
                    if (showBadge) {
                        BadgedBox(
                            badge = {
                                Badge(
                                    containerColor = colors.primary
                                )
                            }
                        ) {
                            Icon(
                                imageVector = if (isSelected) item.selectedIcon else item.icon,
                                contentDescription = item.label
                            )
                        }
                    } else {
                        Icon(
                            imageVector = if (isSelected) item.selectedIcon else item.icon,
                            contentDescription = item.label
                        )
                    }
                },
                label = {
                    Text(text = item.label)
                },
                selected = isSelected,
                onClick = {
                    // Clear badge when clicking on tickets tab
                    if (item.screen == Screen.Tickets) {
                        ticketBadgeManager?.clearBadge()
                    }

                    // If clicking the already selected tab, just pop back to that tab's root
                    if (isSelected && item.screen.route == Screen.DISCOVERY_ROUTE) {
                        // Pop back to discovery home
                        navController.popBackStack(Screen.DISCOVERY_ROUTE, inclusive = false)
                    } else {
                        navController.navigate(item.screen.route) {
                            // Pop up to the start destination of the graph to
                            // avoid building up a large stack of destinations
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            // Avoid multiple copies of the same destination
                            launchSingleTop = true
                            // Restore state when reselecting a previously selected item
                            restoreState = true
                        }
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = colors.primary,
                    selectedTextColor = colors.primary,
                    unselectedIconColor = colors.textSecondary,
                    unselectedTextColor = colors.textSecondary,
                    indicatorColor = colors.primary.copy(alpha = 0.12f)
                )
            )
        }
    }
}
