package com.venuebit.android.ui.navigation

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.venuebit.android.ui.theme.LocalVenueBitColors

/**
 * Main screen composable that hosts the navigation graph and bottom navigation bar.
 * Handles showing/hiding the bottom navigation bar for full-screen routes.
 */
@Composable
fun MainScreen(
    viewModel: MainViewModel = hiltViewModel()
) {
    val navController = rememberNavController()
    val colors = LocalVenueBitColors.current

    // Observe the current back stack entry to determine the current route
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Determine if we should show the bottom navigation bar
    val showBottomBar = !Screen.isFullScreenRoute(currentRoute)

    Scaffold(
        containerColor = colors.background,
        bottomBar = {
            AnimatedVisibility(
                visible = showBottomBar,
                enter = slideInVertically(initialOffsetY = { it }),
                exit = slideOutVertically(targetOffsetY = { it })
            ) {
                BottomNavBar(
                    navController = navController,
                    ticketBadgeManager = viewModel.ticketBadgeManager
                )
            }
        }
    ) { innerPadding ->
        MainNavGraph(
            navController = navController,
            ticketBadgeManager = viewModel.ticketBadgeManager,
            modifier = Modifier.padding(innerPadding)
        )
    }
}
