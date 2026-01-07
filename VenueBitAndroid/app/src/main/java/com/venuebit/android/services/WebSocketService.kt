package com.venuebit.android.services

import android.util.Log
import com.venuebit.android.data.local.ServerConfig
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import org.json.JSONObject
import javax.inject.Inject
import javax.inject.Singleton

sealed class WebSocketMessage {
    data class DatafileUpdate(val datafile: String) : WebSocketMessage()
    data class ThemeUpdate(val theme: String) : WebSocketMessage()
    object Connected : WebSocketMessage()
    object Disconnected : WebSocketMessage()
}

@Singleton
class WebSocketService @Inject constructor(
    private val okHttpClient: OkHttpClient,
    private val serverConfig: ServerConfig
) {
    companion object {
        private const val TAG = "WebSocketService"
    }

    private var webSocket: WebSocket? = null

    // Use extraBufferCapacity to ensure tryEmit() doesn't fail when there's no active collector
    private val _messages = MutableSharedFlow<WebSocketMessage>(
        replay = 0,
        extraBufferCapacity = 10
    )
    val messages: SharedFlow<WebSocketMessage> = _messages.asSharedFlow()

    fun connect() {
        val wsUrl = if (serverConfig.isLocalServer) {
            "ws://10.0.2.2:4001/api/ws"
        } else {
            "wss://${serverConfig.apiBaseUrl.removePrefix("https://").removeSuffix("/")}/api/ws"
        }

        Log.d(TAG, "Connecting to WebSocket: $wsUrl")

        val request = Request.Builder()
            .url(wsUrl)
            .build()

        webSocket = okHttpClient.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                Log.d(TAG, "WebSocket connected")
                _messages.tryEmit(WebSocketMessage.Connected)
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                Log.d(TAG, "WebSocket message received: $text")
                parseMessage(text)?.let { message ->
                    val emitted = _messages.tryEmit(message)
                    Log.d(TAG, "Emitted message $message: success=$emitted")
                }
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                Log.d(TAG, "WebSocket closed: $code - $reason")
                _messages.tryEmit(WebSocketMessage.Disconnected)
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                Log.e(TAG, "WebSocket failure: ${t.message}", t)
                _messages.tryEmit(WebSocketMessage.Disconnected)
            }
        })
    }

    fun disconnect() {
        webSocket?.close(1000, "User disconnected")
        webSocket = null
    }

    private fun parseMessage(text: String): WebSocketMessage? {
        return try {
            val json = JSONObject(text)
            val type = json.optString("type")
            Log.d(TAG, "Parsing message type: $type")
            when (type) {
                "connected" -> {
                    Log.d(TAG, "Received connected message from server")
                    null // Already handled by onOpen
                }
                "datafile_updated" -> {
                    Log.d(TAG, "Datafile update notification received")
                    WebSocketMessage.DatafileUpdate("")
                }
                "theme_update" -> {
                    val theme = json.optString("theme", "")
                    WebSocketMessage.ThemeUpdate(theme)
                }
                else -> {
                    Log.d(TAG, "Unknown message type: $type")
                    null
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to parse WebSocket message: ${e.message}")
            null
        }
    }
}
