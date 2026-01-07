package com.venuebit.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.lifecycleScope
import com.venuebit.android.services.OptimizelyManager
import com.venuebit.android.ui.navigation.MainScreen
import com.venuebit.android.ui.theme.ThemeManager
import com.venuebit.android.ui.theme.VenueBitTheme
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var optimizelyManager: OptimizelyManager

    @Inject
    lateinit var themeManager: ThemeManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize OptimizelyManager (connects WebSocket and loads features)
        lifecycleScope.launch {
            optimizelyManager.initialize()
        }

        setContent {
            VenueBitTheme(themeManager = themeManager) {
                MainScreen()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        optimizelyManager.disconnect()
    }
}
