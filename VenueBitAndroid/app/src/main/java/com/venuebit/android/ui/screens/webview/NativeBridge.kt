package com.venuebit.android.ui.screens.webview

import android.util.Log
import android.webkit.JavascriptInterface
import org.json.JSONObject

/**
 * NativeBridge - JavaScript interface for WebView communication
 *
 * Enables bidirectional communication between the web content and native Android app.
 * The webapp can call AndroidBridge.postMessage(jsonString) to send messages to native code.
 */
class NativeBridge(
    private val onPurchaseComplete: (orderId: String, total: Double) -> Unit,
    private val onCloseWebView: () -> Unit,
    private val onScrollToTop: () -> Unit
) {
    companion object {
        private const val TAG = "NativeBridge"
    }

    /**
     * Receives messages from JavaScript in the WebView.
     * Called from webapp via: AndroidBridge.postMessage(JSON.stringify({ action: "...", ... }))
     *
     * @param messageJson JSON string containing the message with an "action" field
     */
    @JavascriptInterface
    fun postMessage(messageJson: String) {
        try {
            Log.d(TAG, "Received message: $messageJson")

            val jsonObject = JSONObject(messageJson)
            val action = jsonObject.getString("action")

            Log.d(TAG, "Processing action: $action")

            when (action) {
                "purchaseComplete" -> {
                    val orderId = jsonObject.getString("orderId")
                    val total = jsonObject.getDouble("total")
                    Log.d(TAG, "Purchase complete - orderId: $orderId, total: $total")
                    onPurchaseComplete(orderId, total)
                }

                "closeWebView" -> {
                    Log.d(TAG, "Close WebView requested")
                    onCloseWebView()
                }

                "scrollToTop" -> {
                    Log.d(TAG, "Scroll to top requested")
                    onScrollToTop()
                }

                else -> {
                    Log.w(TAG, "Unknown action: $action")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error processing message: ${e.message}", e)
        }
    }
}
