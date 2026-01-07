package com.venuebit.android.ui.screens.webview

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.net.http.SslError
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.SslErrorHandler
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.graphics.toArgb
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.hilt.navigation.compose.hiltViewModel
import com.venuebit.android.ui.components.LoadingView
import com.venuebit.android.ui.theme.LocalVenueBitColors

/**
 * SeatSelectionWebViewScreen - Full-screen WebView for seat selection flow
 *
 * Displays the webapp's seat selection interface in a WebView with native bridge
 * for communication back to the app (purchase completion, close, etc.).
 *
 * @param eventId The ID of the event for seat selection
 * @param onPurchaseComplete Callback when purchase is completed with orderId and total
 * @param onClose Callback when the WebView should be closed
 * @param viewModel ViewModel providing server config, user identity, and theme
 */
private const val TAG = "VenueBit.WebView"

@OptIn(ExperimentalMaterial3Api::class)
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun SeatSelectionWebViewScreen(
    eventId: String,
    onPurchaseComplete: (orderId: String, total: Double) -> Unit,
    onClose: () -> Unit,
    viewModel: SeatSelectionWebViewViewModel = hiltViewModel()
) {
    Log.d(TAG, "SeatSelectionWebViewScreen composing with eventId: '$eventId'")

    val colors = LocalVenueBitColors.current

    // Collect state from ViewModel
    val webViewUrl by viewModel.webViewUrl.collectAsState()
    Log.d(TAG, "Current webViewUrl state: '$webViewUrl'")

    // Track loading and error states
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    // Build URL when eventId is available
    LaunchedEffect(eventId) {
        Log.d(TAG, "LaunchedEffect triggered with eventId: '$eventId'")
        viewModel.buildWebViewUrl(eventId)
    }

    // Log when URL changes
    LaunchedEffect(webViewUrl) {
        if (webViewUrl.isNotEmpty()) {
            Log.d(TAG, "WebView URL ready: $webViewUrl")
        }
    }

    // Remember WebView instance for scroll control
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Select Seats",
                        color = colors.textPrimary
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onClose) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = colors.primaryLight
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = colors.background
                )
            )
        },
        containerColor = colors.background
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            if (webViewUrl.isEmpty()) {
                // Show loading while URL is being built (waiting for userId)
                LoadingView(
                    message = "Loading...",
                    modifier = Modifier.align(Alignment.Center)
                )
            } else {
                AndroidView(
                    modifier = Modifier.fillMaxSize(),
                    factory = { ctx ->
                        WebView(ctx).apply {
                            webViewInstance = this

                            // Set WebView background to match theme
                            setBackgroundColor(colors.background.toArgb())

                            // Configure WebView settings
                            settings.apply {
                                javaScriptEnabled = true
                                domStorageEnabled = true
                                databaseEnabled = true
                                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                                // Enable modern web features
                                setSupportZoom(false)
                                builtInZoomControls = false
                                displayZoomControls = false
                                // Allow file access for local development
                                allowFileAccess = true
                                allowContentAccess = true
                                // Set user agent to indicate Android app
                                userAgentString = "$userAgentString VenueBitAndroid"
                                // Enable caching
                                cacheMode = WebSettings.LOAD_DEFAULT
                            }

                            // Set WebChromeClient for JavaScript console logging
                            webChromeClient = object : WebChromeClient() {
                                override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                                    consoleMessage?.let {
                                        Log.d(
                                            "WebView-JS",
                                            "${it.message()} -- From line ${it.lineNumber()} of ${it.sourceId()}"
                                        )
                                    }
                                    return true
                                }
                            }

                            // Set WebViewClient for page events and error handling
                            webViewClient = object : WebViewClient() {
                                override fun onPageStarted(
                                    view: WebView?,
                                    url: String?,
                                    favicon: Bitmap?
                                ) {
                                    super.onPageStarted(view, url, favicon)
                                    Log.d("SeatSelectionWebView", "Page started loading: $url")
                                    isLoading = true
                                    errorMessage = null
                                }

                                override fun onPageFinished(view: WebView?, url: String?) {
                                    super.onPageFinished(view, url)
                                    Log.d("SeatSelectionWebView", "Page finished loading: $url")
                                    isLoading = false
                                }

                                override fun onReceivedError(
                                    view: WebView?,
                                    request: WebResourceRequest?,
                                    error: WebResourceError?
                                ) {
                                    super.onReceivedError(view, request, error)
                                    // Only handle main frame errors
                                    if (request?.isForMainFrame == true) {
                                        val errorDesc = error?.description?.toString() ?: "Unknown error"
                                        Log.e(
                                            "SeatSelectionWebView",
                                            "Error loading page: $errorDesc (code: ${error?.errorCode})"
                                        )
                                        errorMessage = "Failed to load: $errorDesc"
                                        isLoading = false
                                    }
                                }

                                @SuppressLint("WebViewClientOnReceivedSslError")
                                override fun onReceivedSslError(
                                    view: WebView?,
                                    handler: SslErrorHandler?,
                                    error: SslError?
                                ) {
                                    // For development with local server, proceed anyway
                                    // In production, you would show an error
                                    Log.w("SeatSelectionWebView", "SSL error: ${error?.primaryError}")
                                    handler?.proceed()
                                }
                            }

                            // Add JavaScript interface for native bridge
                            val nativeBridge = NativeBridge(
                                onPurchaseComplete = { orderId, total ->
                                    // Run on main thread since callback comes from JS thread
                                    post {
                                        onPurchaseComplete(orderId, total)
                                    }
                                },
                                onCloseWebView = {
                                    post {
                                        onClose()
                                    }
                                },
                                onScrollToTop = {
                                    post {
                                        scrollTo(0, 0)
                                    }
                                }
                            )
                            addJavascriptInterface(nativeBridge, "AndroidBridge")

                            // Load the URL
                            Log.d("SeatSelectionWebView", "Loading URL: $webViewUrl")
                            loadUrl(webViewUrl)
                        }
                    },
                    update = { webView ->
                        // Update WebView if URL changes (shouldn't happen normally)
                        webViewInstance = webView
                    }
                )

                // Show loading overlay with themed background
                if (isLoading) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(colors.background),
                        contentAlignment = Alignment.Center
                    ) {
                        LoadingView(
                            message = "Loading seat selection..."
                        )
                    }
                }

                // Show error message if any
                errorMessage?.let { error ->
                    Column(
                        modifier = Modifier.align(Alignment.Center),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = error,
                            color = colors.textSecondary
                        )
                        Text(
                            text = "URL: $webViewUrl",
                            color = colors.textSecondary,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                }
            }
        }
    }
}
