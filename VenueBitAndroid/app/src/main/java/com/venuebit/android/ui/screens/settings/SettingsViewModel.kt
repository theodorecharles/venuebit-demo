package com.venuebit.android.ui.screens.settings

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.local.UserIdentityManager
import com.venuebit.android.services.OptimizelyManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Simple state holder for feature decisions (placeholder for now)
 */
data class FeatureDecisionsState(
    val features: Map<String, FeatureInfo> = emptyMap()
)

data class FeatureInfo(
    val enabled: Boolean,
    val variationKey: String,
    val variables: Map<String, String> = emptyMap()
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val userIdentityManager: UserIdentityManager,
    private val serverConfig: ServerConfig,
    private val optimizelyManager: OptimizelyManager
) : ViewModel() {

    val userId: StateFlow<String> = userIdentityManager.userIdFlow
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = ""
        )

    val serverAddress: StateFlow<String> = serverConfig.serverAddressFlow
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = ServerConfig.DEFAULT_ADDRESS
        )

    val isLocalServer: Boolean
        get() = serverConfig.isLocalServer

    val featureDecisions: StateFlow<FeatureDecisionsState> = optimizelyManager.featureDecisions
        .map { decisions ->
            FeatureDecisionsState(
                features = decisions.mapValues { (_, decision) ->
                    FeatureInfo(
                        enabled = decision.enabled,
                        variationKey = decision.variationKey ?: "off",
                        variables = decision.variables.mapValues { (_, value) ->
                            when (value) {
                                is Boolean -> value.toString()
                                is Number -> value.toString()
                                is String -> value
                                else -> value.toString()
                            }
                        }
                    )
                }
            )
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = FeatureDecisionsState()
        )

    fun generateNewUserId() {
        viewModelScope.launch {
            userIdentityManager.generateAndSaveNewUserId()
            // Refresh features after generating new user ID
            optimizelyManager.refreshFeatures()
        }
    }

    fun copyUserIdToClipboard(context: Context) {
        val clipboardManager = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("User ID", userId.value)
        clipboardManager.setPrimaryClip(clip)
    }

    fun setServerAddress(address: String) {
        viewModelScope.launch {
            serverConfig.setServerAddress(address)
        }
    }
}
