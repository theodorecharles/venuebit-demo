# VenueBit Android Port - Comprehensive Implementation Plan

## Executive Summary

This document outlines the complete plan to port the VenueBit iOS app to Android, achieving full feature parity. The Android app will use **Kotlin** with **Jetpack Compose** (declarative UI framework equivalent to SwiftUI), connecting to the existing webapp and backend containers.

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Project Setup](#3-project-setup)
4. [Data Layer Implementation](#4-data-layer-implementation)
5. [Core Services](#5-core-services)
6. [UI Components](#6-ui-components)
7. [Feature Modules](#7-feature-modules)
8. [WebView Integration](#8-webview-integration)
9. [Feature Flags (Optimizely)](#9-feature-flags-optimizely)
10. [Theming System](#10-theming-system)
11. [Testing Strategy](#11-testing-strategy)
12. [Build & Release](#12-build--release)

---

## 1. Project Architecture

### 1.1 Overall Structure

```
VenueBitAndroid/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/venuebit/android/
│   │   │   │   ├── VenueBitApplication.kt          # Application class
│   │   │   │   ├── MainActivity.kt                  # Single activity host
│   │   │   │   │
│   │   │   │   ├── data/                            # Data layer
│   │   │   │   │   ├── api/                         # API service interfaces
│   │   │   │   │   │   ├── ApiClient.kt
│   │   │   │   │   │   ├── EventsApi.kt
│   │   │   │   │   │   ├── CartApi.kt
│   │   │   │   │   │   ├── OrdersApi.kt
│   │   │   │   │   │   └── FeaturesApi.kt
│   │   │   │   │   │
│   │   │   │   │   ├── models/                      # Data models
│   │   │   │   │   │   ├── Event.kt
│   │   │   │   │   │   ├── Ticket.kt
│   │   │   │   │   │   ├── Order.kt
│   │   │   │   │   │   ├── Cart.kt
│   │   │   │   │   │   ├── Venue.kt
│   │   │   │   │   │   ├── HomescreenModule.kt
│   │   │   │   │   │   └── FeatureDecision.kt
│   │   │   │   │   │
│   │   │   │   │   ├── repository/                  # Repository pattern
│   │   │   │   │   │   ├── EventRepository.kt
│   │   │   │   │   │   ├── CartRepository.kt
│   │   │   │   │   │   ├── OrderRepository.kt
│   │   │   │   │   │   └── FeatureRepository.kt
│   │   │   │   │   │
│   │   │   │   │   └── local/                       # Local storage
│   │   │   │   │       ├── PreferencesManager.kt
│   │   │   │   │       └── UserIdentityManager.kt
│   │   │   │   │
│   │   │   │   ├── domain/                          # Business logic
│   │   │   │   │   └── usecase/
│   │   │   │   │       ├── GetEventsUseCase.kt
│   │   │   │   │       ├── SearchEventsUseCase.kt
│   │   │   │   │       ├── GetOrdersUseCase.kt
│   │   │   │   │       └── CheckoutUseCase.kt
│   │   │   │   │
│   │   │   │   ├── ui/                              # Presentation layer
│   │   │   │   │   ├── theme/                       # Compose theming
│   │   │   │   │   │   ├── Color.kt
│   │   │   │   │   │   ├── Type.kt
│   │   │   │   │   │   ├── Shape.kt
│   │   │   │   │   │   ├── Theme.kt
│   │   │   │   │   │   └── ThemeManager.kt
│   │   │   │   │   │
│   │   │   │   │   ├── components/                  # Reusable UI components
│   │   │   │   │   │   ├── EventCard.kt
│   │   │   │   │   │   ├── FeaturedEventCard.kt
│   │   │   │   │   │   ├── CategoryPill.kt
│   │   │   │   │   │   ├── SearchBar.kt
│   │   │   │   │   │   ├── EmptyStateView.kt
│   │   │   │   │   │   ├── LoadingView.kt
│   │   │   │   │   │   ├── ErrorView.kt
│   │   │   │   │   │   ├── VenueBitLogo.kt
│   │   │   │   │   │   ├── PriceRangeView.kt
│   │   │   │   │   │   ├── TicketRow.kt
│   │   │   │   │   │   ├── OrderRow.kt
│   │   │   │   │   │   ├── StatusBadge.kt
│   │   │   │   │   │   └── CachedAsyncImage.kt
│   │   │   │   │   │
│   │   │   │   │   ├── navigation/                  # Navigation
│   │   │   │   │   │   ├── NavGraph.kt
│   │   │   │   │   │   ├── BottomNavBar.kt
│   │   │   │   │   │   └── Screen.kt
│   │   │   │   │   │
│   │   │   │   │   └── screens/                     # Feature screens
│   │   │   │   │       ├── discovery/
│   │   │   │   │       │   ├── DiscoveryScreen.kt
│   │   │   │   │       │   ├── DiscoveryViewModel.kt
│   │   │   │   │       │   ├── FeaturedEventsSection.kt
│   │   │   │   │       │   ├── CategoriesSection.kt
│   │   │   │   │       │   ├── EventsHorizontalSection.kt
│   │   │   │   │       │   ├── AllEventsSection.kt
│   │   │   │   │       │   ├── CategoryEventsScreen.kt
│   │   │   │   │       │   └── AllEventsListScreen.kt
│   │   │   │   │       │
│   │   │   │   │       ├── search/
│   │   │   │   │       │   ├── SearchScreen.kt
│   │   │   │   │       │   └── SearchViewModel.kt
│   │   │   │   │       │
│   │   │   │   │       ├── eventdetail/
│   │   │   │   │       │   ├── EventDetailScreen.kt
│   │   │   │   │       │   └── EventDetailViewModel.kt
│   │   │   │   │       │
│   │   │   │   │       ├── tickets/
│   │   │   │   │       │   ├── MyTicketsScreen.kt
│   │   │   │   │       │   └── MyTicketsViewModel.kt
│   │   │   │   │       │
│   │   │   │   │       ├── settings/
│   │   │   │   │       │   ├── SettingsScreen.kt
│   │   │   │   │       │   ├── SettingsViewModel.kt
│   │   │   │   │       │   ├── DebugPanelSection.kt
│   │   │   │   │       │   ├── AboutSection.kt
│   │   │   │   │       │   └── ServerConfigSection.kt
│   │   │   │   │       │
│   │   │   │   │       └── webview/
│   │   │   │   │           ├── SeatSelectionWebViewScreen.kt
│   │   │   │   │           └── NativeBridge.kt
│   │   │   │   │
│   │   │   │   ├── services/                        # Background services
│   │   │   │   │   ├── OptimizelyManager.kt
│   │   │   │   │   └── WebSocketService.kt
│   │   │   │   │
│   │   │   │   └── di/                              # Dependency injection
│   │   │   │       ├── AppModule.kt
│   │   │   │       ├── NetworkModule.kt
│   │   │   │       └── RepositoryModule.kt
│   │   │   │
│   │   │   ├── res/
│   │   │   │   ├── drawable/
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   └── themes.xml
│   │   │   │   ├── font/
│   │   │   │   │   └── pacifico_regular.ttf
│   │   │   │   └── xml/
│   │   │   │       └── network_security_config.xml
│   │   │   │
│   │   │   └── AndroidManifest.xml
│   │   │
│   │   └── test/                                    # Unit tests
│   │
│   └── build.gradle.kts
│
├── gradle/
├── build.gradle.kts                                 # Project-level build
├── settings.gradle.kts
└── gradle.properties
```

### 1.2 Architecture Pattern: MVVM + Clean Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        UI Layer (Compose)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Screen    │  │   Screen    │  │   Screen    │  ...         │
│  │  Composable │  │  Composable │  │  Composable │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐              │
│  │  ViewModel  │  │  ViewModel  │  │  ViewModel  │              │
│  │ (StateFlow) │  │ (StateFlow) │  │ (StateFlow) │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
┌─────────▼────────────────▼────────────────▼─────────────────────┐
│                      Domain Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   UseCase    │  │   UseCase    │  │   UseCase    │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
┌─────────▼────────────────▼────────────────▼─────────────────────┐
│                       Data Layer                                 │
│  ┌──────────────────────────────────────────────────────┐       │
│  │                    Repository                         │       │
│  │  ┌─────────────────┐       ┌─────────────────┐       │       │
│  │  │   Remote Data   │       │   Local Data    │       │       │
│  │  │   (Retrofit)    │       │ (SharedPrefs)   │       │       │
│  │  └─────────────────┘       └─────────────────┘       │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Core Technologies

| Category | iOS (Current) | Android (Target) |
|----------|---------------|------------------|
| **Language** | Swift 5.9 | Kotlin 1.9+ |
| **UI Framework** | SwiftUI | Jetpack Compose |
| **Min SDK** | iOS 17 | Android API 26 (8.0) |
| **Target SDK** | iOS 17 | Android API 34 (14) |
| **Architecture** | MVVM | MVVM + Clean Architecture |
| **DI** | Manual/Environment | Hilt |
| **Networking** | URLSession | Retrofit + OkHttp |
| **JSON Parsing** | Codable | Kotlinx Serialization / Moshi |
| **Async** | async/await | Kotlin Coroutines + Flow |
| **Image Loading** | AsyncImage + NSCache | Coil |
| **Local Storage** | UserDefaults | DataStore / SharedPreferences |
| **Navigation** | NavigationStack | Navigation Compose |
| **WebView** | WKWebView | Android WebView |
| **WebSocket** | URLSessionWebSocketTask | OkHttp WebSocket |
| **Feature Flags** | Optimizely Swift SDK | Optimizely Android SDK |

### 2.2 Dependencies (build.gradle.kts)

```kotlin
dependencies {
    // Core Android
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    // Jetpack Compose
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Lifecycle + ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")

    // Dependency Injection - Hilt
    implementation("com.google.dagger:hilt-android:2.50")
    kapt("com.google.dagger:hilt-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")

    // Networking - Retrofit + OkHttp
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-moshi:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // JSON - Moshi
    implementation("com.squareup.moshi:moshi-kotlin:1.15.0")
    kapt("com.squareup.moshi:moshi-kotlin-codegen:1.15.0")

    // Image Loading - Coil
    implementation("io.coil-kt:coil-compose:2.5.0")

    // DataStore (modern SharedPreferences replacement)
    implementation("androidx.datastore:datastore-preferences:1.0.0")

    // Optimizely Feature Flags
    implementation("com.optimizely.ab:android-sdk:4.0.0")

    // Pull-to-refresh
    implementation("androidx.compose.material:material:1.6.0")

    // WebView accompanist (optional, for enhanced WebView)
    implementation("com.google.accompanist:accompanist-webview:0.34.0")

    // Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.2.1")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.0")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
}
```

---

## 3. Project Setup

### 3.1 Create Android Studio Project

**Step 1: Initialize Project**
- Open Android Studio
- Create New Project → "Empty Compose Activity"
- Name: VenueBit
- Package: `com.venuebit.android`
- Language: Kotlin
- Minimum SDK: API 26 (Android 8.0)
- Build configuration: Kotlin DSL

**Step 2: Configure Gradle**

`settings.gradle.kts`:
```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "VenueBit"
include(":app")
```

`build.gradle.kts` (Project level):
```kotlin
plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
    id("com.google.dagger.hilt.android") version "2.50" apply false
}
```

**Step 3: Configure Network Security**

`res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Allow cleartext for local development -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">venuebit.tedcharles.net</domain>
    </domain-config>
</network-security-config>
```

`AndroidManifest.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".VenueBitApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:networkSecurityConfig="@xml/network_security_config"
        android:supportsRtl="true"
        android:theme="@style/Theme.VenueBit">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.VenueBit">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>
```

---

## 4. Data Layer Implementation

### 4.1 Data Models

#### Event.kt
```kotlin
@JsonClass(generateAdapter = true)
data class Event(
    val id: String,
    val title: String,
    val category: EventCategory,
    val performer: String,
    val date: String,           // "2025-08-15" format
    val time: String,           // "19:00" format
    val venueId: String,
    val venueName: String,
    val city: String,
    val state: String,
    val description: String,
    val imageUrl: String?,
    val featured: Boolean,
    val minPrice: Double,
    val maxPrice: Double,
    val availableSeats: Int
) {
    val venue: String get() = "$venueName, $city, $state"

    val priceRange: String get() = when {
        minPrice == maxPrice -> "$${minPrice.toInt()}"
        else -> "$${minPrice.toInt()} - $${maxPrice.toInt()}"
    }

    val formattedDate: String get() {
        // Parse "2025-08-15" and format to "Fri, Aug 15"
        val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val outputFormat = SimpleDateFormat("EEE, MMM d", Locale.US)
        return try {
            val date = inputFormat.parse(date)
            outputFormat.format(date!!)
        } catch (e: Exception) { date }
    }

    val formattedTime: String get() {
        // Parse "19:00" and format to "7:00 PM"
        val inputFormat = SimpleDateFormat("HH:mm", Locale.US)
        val outputFormat = SimpleDateFormat("h:mm a", Locale.US)
        return try {
            val time = inputFormat.parse(time)
            outputFormat.format(time!!)
        } catch (e: Exception) { time }
    }

    val categoryIcon: String get() = category.icon

    val displayEmoji: String get() = when {
        category == EventCategory.SPORTS -> getSportEmoji()
        else -> category.icon
    }

    private fun getSportEmoji(): String {
        val titleLower = title.lowercase()
        return when {
            titleLower.contains("basketball") || titleLower.contains("lakers") ||
            titleLower.contains("celtics") || titleLower.contains("warriors") -> "🏀"
            titleLower.contains("baseball") || titleLower.contains("yankees") ||
            titleLower.contains("dodgers") || titleLower.contains("cubs") -> "⚾"
            titleLower.contains("football") || titleLower.contains("49ers") ||
            titleLower.contains("cowboys") || titleLower.contains("patriots") -> "🏈"
            titleLower.contains("hockey") || titleLower.contains("rangers") ||
            titleLower.contains("bruins") || titleLower.contains("blackhawks") -> "🏒"
            titleLower.contains("soccer") || titleLower.contains("fc") ||
            titleLower.contains("united") -> "⚽"
            titleLower.contains("mma") || titleLower.contains("ufc") -> "🥊"
            else -> "⚽"
        }
    }

    fun fullImageUrl(serverConfig: ServerConfig): String? {
        return imageUrl?.let { serverConfig.imageBaseUrl + it }
    }
}

enum class EventCategory {
    @Json(name = "concerts") CONCERTS,
    @Json(name = "sports") SPORTS,
    @Json(name = "theater") THEATER,
    @Json(name = "comedy") COMEDY;

    val displayName: String get() = name.lowercase().replaceFirstChar { it.uppercase() }

    val icon: String get() = when (this) {
        CONCERTS -> "🎵"
        SPORTS -> "⚽"
        THEATER -> "🎭"
        COMEDY -> "😂"
    }
}
```

#### Ticket.kt
```kotlin
@JsonClass(generateAdapter = true)
data class Ticket(
    val id: String,
    val eventId: String,
    val eventTitle: String,
    val eventDate: String,
    val eventTime: String,
    val venueName: String,
    val section: String,
    val row: String,
    val seatNumber: Int,
    val price: Double
)

@JsonClass(generateAdapter = true)
data class OrderSeat(
    val id: String,
    val seatId: String,
    val section: String,
    val row: String,
    val seatNumber: Int,
    val price: Double
)

@JsonClass(generateAdapter = true)
data class OrderItem(
    val eventId: String,
    val eventTitle: String,
    val eventDate: String,
    val eventTime: String,
    val venueName: String,
    val seats: List<OrderSeat>
)
```

#### Order.kt
```kotlin
@JsonClass(generateAdapter = true)
data class Order(
    val id: String,
    val userId: String,
    val status: OrderStatus,
    val items: List<OrderItem>,
    val subtotal: Double,
    val serviceFee: Double,
    val total: Double,
    val createdAt: String  // ISO8601 format
) {
    val tickets: List<Ticket> get() = items.flatMap { item ->
        item.seats.map { seat ->
            Ticket(
                id = seat.id,
                eventId = item.eventId,
                eventTitle = item.eventTitle,
                eventDate = item.eventDate,
                eventTime = item.eventTime,
                venueName = item.venueName,
                section = seat.section,
                row = seat.row,
                seatNumber = seat.seatNumber,
                price = seat.price
            )
        }
    }

    val formattedDate: String get() {
        // Parse ISO8601 and format to "MMM d, yyyy"
        return try {
            val instant = Instant.parse(createdAt)
            val formatter = DateTimeFormatter.ofPattern("MMM d, yyyy")
                .withZone(ZoneId.systemDefault())
            formatter.format(instant)
        } catch (e: Exception) { createdAt }
    }
}

enum class OrderStatus {
    @Json(name = "pending") PENDING,
    @Json(name = "confirmed") CONFIRMED,
    @Json(name = "completed") COMPLETED,
    @Json(name = "cancelled") CANCELLED,
    @Json(name = "refunded") REFUNDED;

    val color: Color get() = when (this) {
        CONFIRMED, COMPLETED -> Color(0xFF22C55E)  // Green
        PENDING -> Color(0xFFF97316)               // Orange
        CANCELLED, REFUNDED -> Color(0xFFEF4444)   // Red
    }
}
```

#### Cart.kt
```kotlin
@JsonClass(generateAdapter = true)
data class Cart(
    val id: String,
    val userId: String,
    val items: List<CartItem>,
    val createdAt: String,
    val updatedAt: String
)

@JsonClass(generateAdapter = true)
data class CartItem(
    val eventId: String,
    val seats: List<CartSeat>
)

@JsonClass(generateAdapter = true)
data class CartSeat(
    val seatId: String,
    val section: String,
    val row: String,
    val seatNumber: Int,
    val price: Double
)

data class CreateCartRequest(val userId: String)
data class AddToCartRequest(val eventId: String, val seatIds: List<String>)
```

#### HomescreenModule.kt
```kotlin
@JsonClass(generateAdapter = true)
data class HomescreenModule(
    val type: String,
    val title: String?,
    val eventCount: Int?
)
```

#### FeatureDecision.kt
```kotlin
@JsonClass(generateAdapter = true)
data class FeaturesResponse(
    val userId: String,
    val decisions: List<FeatureDecision>
)

@JsonClass(generateAdapter = true)
data class FeatureDecision(
    val featureKey: String,
    val enabled: Boolean,
    val variationKey: String?,
    val variables: Map<String, Any>?
)
```

### 4.2 API Client

#### ApiClient.kt
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("Content-Type", "application/json")
                    .build()
                chain.proceed(request)
            }
            .build()
    }

    @Provides
    @Singleton
    fun provideMoshi(): Moshi {
        return Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(
        okHttpClient: OkHttpClient,
        moshi: Moshi,
        serverConfig: ServerConfig
    ): Retrofit {
        return Retrofit.Builder()
            .baseUrl(serverConfig.apiBaseUrl)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
    }
}
```

#### EventsApi.kt
```kotlin
interface EventsApi {

    @GET("api/events")
    suspend fun getEvents(
        @Query("category") category: String? = null,
        @Query("featured") featured: Boolean? = null
    ): ApiResponse<List<Event>>

    @GET("api/events/{id}")
    suspend fun getEvent(@Path("id") id: String): ApiResponse<Event>

    @GET("api/events/{id}/seats")
    suspend fun getEventSeats(@Path("id") id: String): ApiResponse<List<Seat>>

    @GET("api/search")
    suspend fun searchEvents(
        @Query("q") query: String,
        @Header("X-User-ID") userId: String
    ): ApiResponse<List<Event>>

    @GET("api/homescreen/{userId}")
    suspend fun getHomescreenConfig(
        @Path("userId") userId: String
    ): ApiResponse<List<HomescreenModule>>
}

@JsonClass(generateAdapter = true)
data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val count: Int?
)
```

#### OrdersApi.kt
```kotlin
interface OrdersApi {

    @GET("api/orders/{id}")
    suspend fun getOrder(@Path("id") id: String): ApiResponse<Order>

    @GET("api/users/{userId}/orders")
    suspend fun getUserOrders(@Path("userId") userId: String): ApiResponse<List<Order>>
}
```

#### FeaturesApi.kt
```kotlin
interface FeaturesApi {

    @GET("api/features/{userId}")
    suspend fun getFeatures(@Path("userId") userId: String): FeaturesResponse

    @POST("api/track")
    suspend fun trackEvent(@Body event: TrackEventRequest): ApiResponse<Unit>
}

@JsonClass(generateAdapter = true)
data class TrackEventRequest(
    val userId: String,
    val eventKey: String,
    val tags: Map<String, Any>?
)
```

### 4.3 Repository Pattern

#### EventRepository.kt
```kotlin
@Singleton
class EventRepository @Inject constructor(
    private val eventsApi: EventsApi,
    private val serverConfig: ServerConfig
) {
    suspend fun getEvents(
        category: EventCategory? = null,
        featured: Boolean? = null
    ): Result<List<Event>> {
        return try {
            val response = eventsApi.getEvents(
                category = category?.name?.lowercase(),
                featured = featured
            )
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to fetch events"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getEvent(id: String): Result<Event> {
        return try {
            val response = eventsApi.getEvent(id)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Event not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun searchEvents(query: String, userId: String): Result<List<Event>> {
        return try {
            val response = eventsApi.searchEvents(query, userId)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Search failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getHomescreenConfig(userId: String): Result<List<HomescreenModule>> {
        return try {
            val response = eventsApi.getHomescreenConfig(userId)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception("Failed to fetch homescreen config"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

### 4.4 Local Storage

#### ServerConfig.kt
```kotlin
@Singleton
class ServerConfig @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    companion object {
        private val SERVER_ADDRESS_KEY = stringPreferencesKey("server_address")
        const val DEFAULT_ADDRESS = "localhost"
    }

    val serverAddressFlow: Flow<String> = dataStore.data.map { preferences ->
        preferences[SERVER_ADDRESS_KEY] ?: DEFAULT_ADDRESS
    }

    suspend fun setServerAddress(address: String) {
        dataStore.edit { preferences ->
            preferences[SERVER_ADDRESS_KEY] = address
        }
    }

    val apiBaseUrl: String
        get() = buildApiUrl(runBlocking { serverAddressFlow.first() })

    val imageBaseUrl: String
        get() = buildImageUrl(runBlocking { serverAddressFlow.first() })

    val webAppUrl: String
        get() = buildWebAppUrl(runBlocking { serverAddressFlow.first() })

    private fun buildApiUrl(address: String): String {
        return if (address == "localhost") {
            "http://10.0.2.2:4001/"  // Android emulator localhost
        } else {
            "https://$address/"
        }
    }

    private fun buildImageUrl(address: String): String {
        return if (address == "localhost") {
            "http://10.0.2.2:4001"
        } else {
            "https://$address"
        }
    }

    private fun buildWebAppUrl(address: String): String {
        return if (address == "localhost") {
            "http://10.0.2.2:4000"
        } else {
            "https://$address"
        }
    }

    val isLocalServer: Boolean
        get() = runBlocking { serverAddressFlow.first() } == "localhost"
}
```

#### UserIdentityManager.kt
```kotlin
@Singleton
class UserIdentityManager @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    companion object {
        private val USER_ID_KEY = stringPreferencesKey("venuebit_user_id")
    }

    val userIdFlow: Flow<String> = dataStore.data.map { preferences ->
        preferences[USER_ID_KEY] ?: generateNewUserId()
    }

    suspend fun getUserId(): String {
        return userIdFlow.first()
    }

    suspend fun generateAndSaveNewUserId(): String {
        val newId = generateNewUserId()
        dataStore.edit { preferences ->
            preferences[USER_ID_KEY] = newId
        }
        return newId
    }

    private fun generateNewUserId(): String {
        return "user_${UUID.randomUUID().toString().replace("-", "").take(12)}"
    }
}
```

---

## 5. Core Services

### 5.1 OptimizelyManager

```kotlin
@Singleton
class OptimizelyManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val userIdentityManager: UserIdentityManager,
    private val featuresApi: FeaturesApi
) {
    private var optimizelyClient: OptimizelyClient? = null

    private val _featureDecisions = MutableStateFlow<List<FeatureDecision>>(emptyList())
    val featureDecisions: StateFlow<List<FeatureDecision>> = _featureDecisions.asStateFlow()

    private val _recentEvents = MutableStateFlow<List<TrackedEvent>>(emptyList())
    val recentEvents: StateFlow<List<TrackedEvent>> = _recentEvents.asStateFlow()

    data class TrackedEvent(
        val eventKey: String,
        val timestamp: Long,
        val tags: Map<String, Any>?
    )

    suspend fun initialize(sdkKey: String) {
        val optimizelyManager = OptimizelyManager.builder()
            .withSDKKey(sdkKey)
            .build(context)

        optimizelyClient = optimizelyManager.initialize(context, 10000)
        refreshFeatures()
    }

    suspend fun refreshFeatures() {
        try {
            val userId = userIdentityManager.getUserId()
            val response = featuresApi.getFeatures(userId)
            _featureDecisions.value = response.decisions
        } catch (e: Exception) {
            Log.e("OptimizelyManager", "Failed to refresh features", e)
        }
    }

    fun isFeatureEnabled(featureKey: String): Boolean {
        return _featureDecisions.value
            .find { it.featureKey == featureKey }
            ?.enabled ?: false
    }

    fun getVariationKey(featureKey: String): String? {
        return _featureDecisions.value
            .find { it.featureKey == featureKey }
            ?.variationKey
    }

    fun getFeatureVariable(featureKey: String, variableKey: String): Any? {
        return _featureDecisions.value
            .find { it.featureKey == featureKey }
            ?.variables
            ?.get(variableKey)
    }

    suspend fun trackEvent(eventKey: String, tags: Map<String, Any>? = null) {
        try {
            val userId = userIdentityManager.getUserId()
            featuresApi.trackEvent(
                TrackEventRequest(
                    userId = userId,
                    eventKey = eventKey,
                    tags = tags
                )
            )

            // Update recent events (keep last 5)
            val newEvent = TrackedEvent(eventKey, System.currentTimeMillis(), tags)
            _recentEvents.update { events ->
                (listOf(newEvent) + events).take(5)
            }
        } catch (e: Exception) {
            Log.e("OptimizelyManager", "Failed to track event", e)
        }
    }
}
```

### 5.2 WebSocketService

```kotlin
@Singleton
class WebSocketService @Inject constructor(
    private val okHttpClient: OkHttpClient,
    private val serverConfig: ServerConfig
) {
    private var webSocket: WebSocket? = null

    private val _messages = MutableSharedFlow<WebSocketMessage>()
    val messages: SharedFlow<WebSocketMessage> = _messages.asSharedFlow()

    sealed class WebSocketMessage {
        data class DatafileUpdate(val datafile: String) : WebSocketMessage()
        data class ThemeUpdate(val theme: String) : WebSocketMessage()
        object Connected : WebSocketMessage()
        object Disconnected : WebSocketMessage()
    }

    fun connect() {
        val wsUrl = if (serverConfig.isLocalServer) {
            "ws://10.0.2.2:4001/ws"
        } else {
            "wss://${serverConfig.apiBaseUrl}/ws"
        }

        val request = Request.Builder()
            .url(wsUrl)
            .build()

        webSocket = okHttpClient.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                CoroutineScope(Dispatchers.IO).launch {
                    _messages.emit(WebSocketMessage.Connected)
                }
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                CoroutineScope(Dispatchers.IO).launch {
                    parseMessage(text)?.let { _messages.emit(it) }
                }
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                CoroutineScope(Dispatchers.IO).launch {
                    _messages.emit(WebSocketMessage.Disconnected)
                }
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                Log.e("WebSocketService", "WebSocket failure", t)
                CoroutineScope(Dispatchers.IO).launch {
                    _messages.emit(WebSocketMessage.Disconnected)
                }
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
            when (json.optString("type")) {
                "datafile_update" -> WebSocketMessage.DatafileUpdate(
                    json.optString("datafile")
                )
                "theme_update" -> WebSocketMessage.ThemeUpdate(
                    json.optString("theme")
                )
                else -> null
            }
        } catch (e: Exception) {
            null
        }
    }
}
```

---

## 6. UI Components

### 6.1 Theme System

#### Color.kt
```kotlin
object VenueBitColors {
    // Slate palette
    val Slate900 = Color(0xFF0F172A)
    val Slate800 = Color(0xFF1E293B)
    val Slate700 = Color(0xFF334155)
    val Slate600 = Color(0xFF475569)
    val Slate500 = Color(0xFF64748B)
    val Slate400 = Color(0xFF94A3B8)
    val Slate300 = Color(0xFFCBD5E1)
    val Slate200 = Color(0xFFE2E8F0)
    val Slate100 = Color(0xFFF1F5F9)

    // Indigo palette
    val Indigo500 = Color(0xFF6366F1)
    val Indigo400 = Color(0xFF818CF8)
    val Indigo300 = Color(0xFFA5B4FC)

    // Semantic colors
    val Green500 = Color(0xFF22C55E)
    val Orange500 = Color(0xFFF97316)
    val Red500 = Color(0xFFEF4444)
}

data class VenueBitColorScheme(
    val primary: Color,
    val background: Color,
    val surface: Color,
    val surfaceSecondary: Color,
    val border: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textTertiary: Color
)

val DarkColorScheme = VenueBitColorScheme(
    primary = VenueBitColors.Indigo500,
    background = VenueBitColors.Slate900,
    surface = VenueBitColors.Slate800,
    surfaceSecondary = VenueBitColors.Slate700,
    border = VenueBitColors.Slate700,
    textPrimary = Color.White,
    textSecondary = VenueBitColors.Slate400,
    textTertiary = VenueBitColors.Slate500
)

val BlackColorScheme = DarkColorScheme.copy(
    background = Color.Black,
    surface = Color(0xFF0A0A0A)
)

val BeigeColorScheme = VenueBitColorScheme(
    primary = VenueBitColors.Indigo500,
    background = Color(0xFFF5F5DC),
    surface = Color(0xFFE8E8D0),
    surfaceSecondary = Color(0xFFDADAC4),
    border = Color(0xFFCCCCB8),
    textPrimary = Color(0xFF2D2D2D),
    textSecondary = Color(0xFF5A5A5A),
    textTertiary = Color(0xFF787878)
)

val LightColorScheme = VenueBitColorScheme(
    primary = VenueBitColors.Indigo500,
    background = Color.White,
    surface = VenueBitColors.Slate100,
    surfaceSecondary = VenueBitColors.Slate200,
    border = VenueBitColors.Slate300,
    textPrimary = VenueBitColors.Slate900,
    textSecondary = VenueBitColors.Slate600,
    textTertiary = VenueBitColors.Slate500
)
```

#### ThemeManager.kt
```kotlin
@Singleton
class ThemeManager @Inject constructor() {
    private val _currentTheme = MutableStateFlow<VenueBitTheme>(VenueBitTheme.DARK)
    val currentTheme: StateFlow<VenueBitTheme> = _currentTheme.asStateFlow()

    val colorScheme: VenueBitColorScheme
        get() = when (_currentTheme.value) {
            VenueBitTheme.BLACK -> BlackColorScheme
            VenueBitTheme.DARK -> DarkColorScheme
            VenueBitTheme.BEIGE -> BeigeColorScheme
            VenueBitTheme.LIGHT -> LightColorScheme
        }

    fun setTheme(themeName: String) {
        _currentTheme.value = when (themeName.lowercase()) {
            "black" -> VenueBitTheme.BLACK
            "dark" -> VenueBitTheme.DARK
            "beige" -> VenueBitTheme.BEIGE
            "light" -> VenueBitTheme.LIGHT
            else -> VenueBitTheme.DARK
        }
    }
}

enum class VenueBitTheme {
    BLACK, DARK, BEIGE, LIGHT
}
```

### 6.2 Reusable Components

#### EventCard.kt
```kotlin
@Composable
fun EventCard(
    event: Event,
    serverConfig: ServerConfig,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Card(
        modifier = modifier
            .width(200.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = colors.surface)
    ) {
        Column {
            // Image with fallback emoji
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(colors.surfaceSecondary),
                contentAlignment = Alignment.Center
            ) {
                event.fullImageUrl(serverConfig)?.let { url ->
                    AsyncImage(
                        model = url,
                        contentDescription = event.title,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } ?: Text(
                    text = event.displayEmoji,
                    fontSize = 48.sp
                )
            }

            Column(
                modifier = Modifier.padding(12.dp)
            ) {
                // Category badge
                CategoryBadge(
                    icon = event.categoryIcon,
                    name = event.category.displayName
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Title
                Text(
                    text = event.title,
                    style = MaterialTheme.typography.titleSmall,
                    color = colors.textPrimary,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Date & venue
                Text(
                    text = "${event.formattedDate} • ${event.venueName}",
                    style = MaterialTheme.typography.bodySmall,
                    color = colors.textSecondary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Price
                PriceTag(price = "From $${event.minPrice.toInt()}")
            }
        }
    }
}

@Composable
fun FeaturedEventCard(
    event: Event,
    serverConfig: ServerConfig,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(220.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp)
    ) {
        Box {
            // Background image
            event.fullImageUrl(serverConfig)?.let { url ->
                AsyncImage(
                    model = url,
                    contentDescription = event.title,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } ?: Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(colors.surfaceSecondary),
                contentAlignment = Alignment.Center
            ) {
                Text(text = event.displayEmoji, fontSize = 64.sp)
            }

            // Gradient overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.Transparent,
                                Color.Black.copy(alpha = 0.8f)
                            )
                        )
                    )
            )

            // Content overlay
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(16.dp)
            ) {
                CategoryBadge(
                    icon = event.categoryIcon,
                    name = event.category.displayName
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = event.title,
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "${event.formattedDate} • ${event.venue}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.White.copy(alpha = 0.8f)
                )

                Spacer(modifier = Modifier.height(8.dp))

                PriceTag(price = event.priceRange)
            }
        }
    }
}
```

#### CategoryPill.kt
```kotlin
@Composable
fun CategoryPill(
    category: EventCategory,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Surface(
        modifier = modifier.clickable(onClick = onClick),
        shape = RoundedCornerShape(20.dp),
        color = if (isSelected) colors.primary else colors.surface,
        border = if (!isSelected) BorderStroke(1.dp, colors.border) else null
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(text = category.icon, fontSize = 16.sp)
            Text(
                text = category.displayName,
                style = MaterialTheme.typography.bodyMedium,
                color = if (isSelected) Color.White else colors.textPrimary
            )
        }
    }
}

@Composable
fun CategorySelector(
    categories: List<EventCategory>,
    selectedCategory: EventCategory?,
    onCategorySelected: (EventCategory?) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = PaddingValues(horizontal = 16.dp)
    ) {
        // "All" option
        item {
            CategoryPill(
                category = null,
                isSelected = selectedCategory == null,
                onClick = { onCategorySelected(null) },
                label = "All"
            )
        }

        items(categories) { category ->
            CategoryPill(
                category = category,
                isSelected = selectedCategory == category,
                onClick = { onCategorySelected(category) }
            )
        }
    }
}
```

#### SearchBar.kt
```kotlin
@Composable
fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    placeholder: String = "Search events...",
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    TextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp)),
        placeholder = {
            Text(
                text = placeholder,
                color = colors.textTertiary
            )
        },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = colors.textSecondary
            )
        },
        trailingIcon = {
            if (query.isNotEmpty()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(
                        imageVector = Icons.Default.Clear,
                        contentDescription = "Clear",
                        tint = colors.textSecondary
                    )
                }
            }
        },
        colors = TextFieldDefaults.colors(
            focusedContainerColor = colors.surface,
            unfocusedContainerColor = colors.surface,
            focusedTextColor = colors.textPrimary,
            unfocusedTextColor = colors.textPrimary,
            cursorColor = colors.primary,
            focusedIndicatorColor = Color.Transparent,
            unfocusedIndicatorColor = Color.Transparent
        ),
        singleLine = true
    )
}
```

#### VenueBitLogo.kt
```kotlin
@Composable
fun VenueBitLogo(
    modifier: Modifier = Modifier,
    fontSize: TextUnit = 28.sp
) {
    val pacificoFont = FontFamily(Font(R.font.pacifico_regular))

    Text(
        text = "VenueBit",
        modifier = modifier,
        style = TextStyle(
            fontFamily = pacificoFont,
            fontSize = fontSize,
            brush = Brush.linearGradient(
                colors = listOf(
                    VenueBitColors.Indigo400,
                    VenueBitColors.Indigo500
                )
            )
        )
    )
}
```

#### EmptyStateView.kt
```kotlin
@Composable
fun EmptyStateView(
    icon: String,
    title: String,
    message: String,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = icon, fontSize = 64.sp)

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = title,
            style = MaterialTheme.typography.titleLarge,
            color = colors.textPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = colors.textSecondary,
            textAlign = TextAlign.Center
        )
    }
}
```

#### LoadingView.kt
```kotlin
@Composable
fun LoadingView(
    message: String = "Loading...",
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Column(
        modifier = modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        CircularProgressIndicator(color = colors.primary)

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = colors.textSecondary
        )
    }
}

@Composable
fun ErrorView(
    message: String,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "❌", fontSize = 48.sp)

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Something went wrong",
            style = MaterialTheme.typography.titleMedium,
            color = colors.textPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = colors.textSecondary,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onRetry,
            colors = ButtonDefaults.buttonColors(
                containerColor = colors.primary
            )
        ) {
            Text("Try Again")
        }
    }
}
```

#### StatusBadge.kt
```kotlin
@Composable
fun StatusBadge(
    status: OrderStatus,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        color = status.color.copy(alpha = 0.15f)
    ) {
        Text(
            text = status.name.lowercase().replaceFirstChar { it.uppercase() },
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            color = status.color,
            fontWeight = FontWeight.SemiBold
        )
    }
}
```

---

## 7. Feature Modules

### 7.1 Discovery Screen (Home)

#### DiscoveryViewModel.kt
```kotlin
@HiltViewModel
class DiscoveryViewModel @Inject constructor(
    private val eventRepository: EventRepository,
    private val optimizelyManager: OptimizelyManager,
    private val userIdentityManager: UserIdentityManager,
    val serverConfig: ServerConfig
) : ViewModel() {

    sealed class UiState {
        object Loading : UiState()
        data class Success(
            val modules: List<HomescreenModule>,
            val featuredEvents: List<Event>,
            val allEvents: List<Event>
        ) : UiState()
        data class Error(val message: String) : UiState()
    }

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init {
        loadData()
    }

    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading

            try {
                val userId = userIdentityManager.getUserId()

                // Fetch in parallel
                val eventsDeferred = async { eventRepository.getEvents() }
                val configDeferred = async { eventRepository.getHomescreenConfig(userId) }

                val eventsResult = eventsDeferred.await()
                val configResult = configDeferred.await()

                if (eventsResult.isSuccess) {
                    val events = eventsResult.getOrNull()!!
                    val modules = configResult.getOrNull() ?: defaultModules()

                    _uiState.value = UiState.Success(
                        modules = modules,
                        featuredEvents = events.filter { it.featured }.shuffled(),
                        allEvents = events.sortedBy { it.date }
                    )
                } else {
                    _uiState.value = UiState.Error(
                        eventsResult.exceptionOrNull()?.message ?: "Unknown error"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    fun getEventsForCategory(category: EventCategory, allEvents: List<Event>): List<Event> {
        return allEvents.filter { it.category == category }.shuffled().take(6)
    }

    fun getTrendingEvents(allEvents: List<Event>): List<Event> {
        return allEvents.shuffled().take(6)
    }

    fun getWeekendEvents(allEvents: List<Event>): List<Event> {
        // Filter events happening this weekend
        return allEvents.shuffled().take(6)
    }

    private fun defaultModules() = listOf(
        HomescreenModule("hero_carousel", "Featured", null),
        HomescreenModule("categories", "Browse by Category", null),
        HomescreenModule("trending_now", "Trending Now", 6),
        HomescreenModule("this_weekend", "This Weekend", 6),
        HomescreenModule("all_events", "All Events", null)
    )
}
```

#### DiscoveryScreen.kt
```kotlin
@Composable
fun DiscoveryScreen(
    viewModel: DiscoveryViewModel = hiltViewModel(),
    onEventClick: (Event) -> Unit,
    onCategoryClick: (EventCategory) -> Unit,
    onSeeAllClick: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val colors = LocalVenueBitColors.current

    val pullRefreshState = rememberPullRefreshState(
        refreshing = uiState is DiscoveryViewModel.UiState.Loading,
        onRefresh = { viewModel.loadData() }
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .pullRefresh(pullRefreshState)
    ) {
        when (val state = uiState) {
            is DiscoveryViewModel.UiState.Loading -> LoadingView()

            is DiscoveryViewModel.UiState.Error -> ErrorView(
                message = state.message,
                onRetry = { viewModel.loadData() }
            )

            is DiscoveryViewModel.UiState.Success -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(bottom = 80.dp)
                ) {
                    // Header
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            VenueBitLogo()
                        }
                    }

                    // Render modules based on config
                    state.modules.forEach { module ->
                        when (module.type) {
                            "hero_carousel" -> item {
                                FeaturedEventsCarousel(
                                    events = state.featuredEvents,
                                    serverConfig = viewModel.serverConfig,
                                    onEventClick = onEventClick
                                )
                            }

                            "categories" -> item {
                                CategoriesSection(
                                    onCategoryClick = onCategoryClick
                                )
                            }

                            "trending_now" -> item {
                                EventsHorizontalSection(
                                    title = module.title ?: "Trending Now",
                                    events = viewModel.getTrendingEvents(state.allEvents),
                                    serverConfig = viewModel.serverConfig,
                                    onEventClick = onEventClick,
                                    onSeeAllClick = { onSeeAllClick("trending") }
                                )
                            }

                            "this_weekend" -> item {
                                EventsHorizontalSection(
                                    title = module.title ?: "This Weekend",
                                    events = viewModel.getWeekendEvents(state.allEvents),
                                    serverConfig = viewModel.serverConfig,
                                    onEventClick = onEventClick,
                                    onSeeAllClick = { onSeeAllClick("weekend") }
                                )
                            }

                            "all_events" -> item {
                                AllEventsSection(
                                    title = module.title ?: "All Events",
                                    events = state.allEvents,
                                    serverConfig = viewModel.serverConfig,
                                    onEventClick = onEventClick,
                                    onSeeAllClick = { onSeeAllClick("all") }
                                )
                            }
                        }
                    }
                }
            }
        }

        PullRefreshIndicator(
            refreshing = uiState is DiscoveryViewModel.UiState.Loading,
            state = pullRefreshState,
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}

@Composable
fun FeaturedEventsCarousel(
    events: List<Event>,
    serverConfig: ServerConfig,
    onEventClick: (Event) -> Unit
) {
    var currentPage by remember { mutableIntStateOf(0) }
    val pagerState = rememberPagerState { events.size }

    Column {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .height(240.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            pageSpacing = 12.dp
        ) { page ->
            FeaturedEventCard(
                event = events[page],
                serverConfig = serverConfig,
                onClick = { onEventClick(events[page]) }
            )
        }

        // Page indicators
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 12.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            repeat(events.size) { index ->
                val isSelected = pagerState.currentPage == index
                Box(
                    modifier = Modifier
                        .padding(horizontal = 4.dp)
                        .size(if (isSelected) 8.dp else 6.dp)
                        .clip(CircleShape)
                        .background(
                            if (isSelected) VenueBitColors.Indigo500
                            else VenueBitColors.Slate600
                        )
                )
            }
        }
    }
}
```

### 7.2 Search Screen

#### SearchViewModel.kt
```kotlin
@HiltViewModel
class SearchViewModel @Inject constructor(
    private val eventRepository: EventRepository,
    private val userIdentityManager: UserIdentityManager,
    private val optimizelyManager: OptimizelyManager,
    val serverConfig: ServerConfig
) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    private val _selectedCategory = MutableStateFlow<EventCategory?>(null)
    val selectedCategory: StateFlow<EventCategory?> = _selectedCategory.asStateFlow()

    private val _searchResults = MutableStateFlow<List<Event>>(emptyList())
    val searchResults: StateFlow<List<Event>> = _searchResults.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _hasSearched = MutableStateFlow(false)
    val hasSearched: StateFlow<Boolean> = _hasSearched.asStateFlow()

    init {
        // Debounced search
        viewModelScope.launch {
            _query
                .debounce(300)
                .filter { it.isNotEmpty() }
                .collectLatest { query ->
                    performSearch(query)
                }
        }
    }

    fun updateQuery(newQuery: String) {
        _query.value = newQuery
        if (newQuery.isEmpty()) {
            _searchResults.value = emptyList()
            _hasSearched.value = false
        }
    }

    fun selectCategory(category: EventCategory?) {
        _selectedCategory.value = category
    }

    private suspend fun performSearch(query: String) {
        _isLoading.value = true
        _hasSearched.value = true

        try {
            val userId = userIdentityManager.getUserId()

            // Track search event
            optimizelyManager.trackEvent(
                "search",
                mapOf("query" to query, "category" to (_selectedCategory.value?.name ?: "all"))
            )

            val result = eventRepository.searchEvents(query, userId)

            if (result.isSuccess) {
                var events = result.getOrNull()!!

                // Filter by category if selected
                _selectedCategory.value?.let { category ->
                    events = events.filter { it.category == category }
                }

                _searchResults.value = events
            } else {
                _searchResults.value = emptyList()
            }
        } catch (e: Exception) {
            _searchResults.value = emptyList()
        } finally {
            _isLoading.value = false
        }
    }

    val filteredResults: StateFlow<List<Event>> = combine(
        _searchResults,
        _selectedCategory
    ) { results, category ->
        if (category == null) results
        else results.filter { it.category == category }
    }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
}
```

#### SearchScreen.kt
```kotlin
@Composable
fun SearchScreen(
    viewModel: SearchViewModel = hiltViewModel(),
    onEventClick: (Event) -> Unit
) {
    val colors = LocalVenueBitColors.current
    val query by viewModel.query.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val searchResults by viewModel.filteredResults.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val hasSearched by viewModel.hasSearched.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
    ) {
        // Header
        Text(
            text = "Search",
            style = MaterialTheme.typography.headlineMedium,
            color = colors.textPrimary,
            modifier = Modifier.padding(16.dp)
        )

        // Search bar
        SearchBar(
            query = query,
            onQueryChange = viewModel::updateQuery,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Category filter
        CategorySelector(
            categories = EventCategory.values().toList(),
            selectedCategory = selectedCategory,
            onCategorySelected = viewModel::selectCategory
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Results
        when {
            isLoading -> LoadingView()

            !hasSearched -> EmptyStateView(
                icon = "🔍",
                title = "Search Events",
                message = "Find concerts, sports, theater, and more"
            )

            searchResults.isEmpty() -> EmptyStateView(
                icon = "🔍",
                title = "No Results",
                message = "Try a different search term or category"
            )

            else -> LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(searchResults) { event ->
                    SearchResultCard(
                        event = event,
                        serverConfig = viewModel.serverConfig,
                        onClick = { onEventClick(event) }
                    )
                }
            }
        }
    }
}
```

### 7.3 Event Detail Screen

#### EventDetailViewModel.kt
```kotlin
@HiltViewModel
class EventDetailViewModel @Inject constructor(
    private val eventRepository: EventRepository,
    private val optimizelyManager: OptimizelyManager,
    val serverConfig: ServerConfig,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val eventId: String = savedStateHandle.get<String>("eventId")!!

    private val _event = MutableStateFlow<Event?>(null)
    val event: StateFlow<Event?> = _event.asStateFlow()

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    init {
        loadEvent()
        trackPageView()
    }

    private fun loadEvent() {
        viewModelScope.launch {
            _isLoading.value = true

            val result = eventRepository.getEvent(eventId)

            if (result.isSuccess) {
                _event.value = result.getOrNull()
            } else {
                _error.value = result.exceptionOrNull()?.message
            }

            _isLoading.value = false
        }
    }

    private fun trackPageView() {
        viewModelScope.launch {
            optimizelyManager.trackEvent(
                "page_view",
                mapOf("page" to "event_detail", "event_id" to eventId)
            )
        }
    }
}
```

#### EventDetailScreen.kt
```kotlin
@Composable
fun EventDetailScreen(
    viewModel: EventDetailViewModel = hiltViewModel(),
    onBackClick: () -> Unit,
    onGetTicketsClick: (Event) -> Unit
) {
    val colors = LocalVenueBitColors.current
    val event by viewModel.event.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            Icons.Default.ArrowBack,
                            contentDescription = "Back",
                            tint = colors.textPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Transparent
                )
            )
        },
        bottomBar = {
            event?.let { evt ->
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = colors.surface,
                    shadowElevation = 8.dp
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "From",
                                style = MaterialTheme.typography.labelSmall,
                                color = colors.textSecondary
                            )
                            Text(
                                text = "$${evt.minPrice.toInt()}",
                                style = MaterialTheme.typography.titleLarge,
                                color = colors.textPrimary,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Button(
                            onClick = { onGetTicketsClick(evt) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = colors.primary
                            ),
                            modifier = Modifier.height(48.dp)
                        ) {
                            Text(
                                text = "Get Tickets",
                                style = MaterialTheme.typography.titleMedium
                            )
                        }
                    }
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(colors.background)
        ) {
            when {
                isLoading -> LoadingView()
                error != null -> ErrorView(
                    message = error!!,
                    onRetry = { /* reload */ }
                )
                event != null -> EventDetailContent(
                    event = event!!,
                    serverConfig = viewModel.serverConfig
                )
            }
        }
    }
}

@Composable
fun EventDetailContent(
    event: Event,
    serverConfig: ServerConfig
) {
    val colors = LocalVenueBitColors.current

    LazyColumn(
        modifier = Modifier.fillMaxSize()
    ) {
        // Hero image
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(250.dp)
                    .background(colors.surfaceSecondary),
                contentAlignment = Alignment.Center
            ) {
                event.fullImageUrl(serverConfig)?.let { url ->
                    AsyncImage(
                        model = url,
                        contentDescription = event.title,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } ?: Text(
                    text = event.displayEmoji,
                    fontSize = 80.sp
                )
            }
        }

        // Content
        item {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                // Category badge
                CategoryBadge(
                    icon = event.categoryIcon,
                    name = event.category.displayName
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Title
                Text(
                    text = event.title,
                    style = MaterialTheme.typography.headlineMedium,
                    color = colors.textPrimary,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Description
                Text(
                    text = event.description,
                    style = MaterialTheme.typography.bodyLarge,
                    color = colors.textSecondary
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Info rows
                EventInfoRow(
                    icon = Icons.Default.CalendarMonth,
                    label = "Date & Time",
                    value = "${event.formattedDate} at ${event.formattedTime}"
                )

                EventInfoRow(
                    icon = Icons.Default.LocationOn,
                    label = "Venue",
                    value = event.venue
                )

                EventInfoRow(
                    icon = Icons.Default.AttachMoney,
                    label = "Price Range",
                    value = event.priceRange
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Performer section
                Text(
                    text = "Performer",
                    style = MaterialTheme.typography.titleMedium,
                    color = colors.textPrimary
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(colors.surfaceSecondary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = event.performer.first().toString(),
                            style = MaterialTheme.typography.titleLarge,
                            color = colors.textPrimary
                        )
                    }

                    Text(
                        text = event.performer,
                        style = MaterialTheme.typography.bodyLarge,
                        color = colors.textPrimary
                    )
                }
            }
        }
    }
}

@Composable
fun EventInfoRow(
    icon: ImageVector,
    label: String,
    value: String
) {
    val colors = LocalVenueBitColors.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = colors.primary,
            modifier = Modifier.size(24.dp)
        )

        Spacer(modifier = Modifier.width(12.dp))

        Column {
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = colors.textSecondary
            )
            Text(
                text = value,
                style = MaterialTheme.typography.bodyLarge,
                color = colors.textPrimary
            )
        }
    }
}
```

### 7.4 My Tickets Screen

#### MyTicketsViewModel.kt
```kotlin
@HiltViewModel
class MyTicketsViewModel @Inject constructor(
    private val orderRepository: OrderRepository,
    private val userIdentityManager: UserIdentityManager
) : ViewModel() {

    // In-memory recent purchases (from this session)
    private val _recentPurchases = MutableStateFlow<List<Ticket>>(emptyList())
    val recentPurchases: StateFlow<List<Ticket>> = _recentPurchases.asStateFlow()

    // Orders from API
    private val _orders = MutableStateFlow<List<Order>>(emptyList())
    val orders: StateFlow<List<Order>> = _orders.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    init {
        loadOrders()
    }

    fun loadOrders() {
        viewModelScope.launch {
            _isLoading.value = true

            try {
                val userId = userIdentityManager.getUserId()
                val result = orderRepository.getUserOrders(userId)

                if (result.isSuccess) {
                    _orders.value = result.getOrNull()!!
                }
            } catch (e: Exception) {
                // Handle error
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun addPurchase(tickets: List<Ticket>) {
        _recentPurchases.update { current -> tickets + current }
    }

    fun removePurchase(ticket: Ticket) {
        _recentPurchases.update { current -> current - ticket }
    }

    fun clearAllPurchases() {
        _recentPurchases.value = emptyList()
    }
}
```

#### MyTicketsScreen.kt
```kotlin
@Composable
fun MyTicketsScreen(
    viewModel: MyTicketsViewModel = hiltViewModel()
) {
    val colors = LocalVenueBitColors.current
    val recentPurchases by viewModel.recentPurchases.collectAsState()
    val orders by viewModel.orders.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    var showClearDialog by remember { mutableStateOf(false) }

    val pullRefreshState = rememberPullRefreshState(
        refreshing = isLoading,
        onRefresh = { viewModel.loadOrders() }
    )

    if (showClearDialog) {
        AlertDialog(
            onDismissRequest = { showClearDialog = false },
            title = { Text("Clear All Tickets") },
            text = { Text("Are you sure you want to clear all recent purchases?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.clearAllPurchases()
                        showClearDialog = false
                    }
                ) {
                    Text("Clear", color = VenueBitColors.Red500)
                }
            },
            dismissButton = {
                TextButton(onClick = { showClearDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .pullRefresh(pullRefreshState)
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp)
        ) {
            // Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "My Tickets",
                        style = MaterialTheme.typography.headlineMedium,
                        color = colors.textPrimary
                    )

                    if (recentPurchases.isNotEmpty()) {
                        TextButton(onClick = { showClearDialog = true }) {
                            Text("Clear All", color = VenueBitColors.Red500)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }

            // Recent purchases section
            if (recentPurchases.isNotEmpty()) {
                item {
                    Text(
                        text = "Recent Purchases",
                        style = MaterialTheme.typography.titleMedium,
                        color = colors.textPrimary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                }

                items(
                    items = recentPurchases,
                    key = { it.id }
                ) { ticket ->
                    SwipeToDismissTicketRow(
                        ticket = ticket,
                        onDismiss = { viewModel.removePurchase(ticket) }
                    )
                }

                item { Spacer(modifier = Modifier.height(24.dp)) }
            }

            // Order history section
            if (orders.isNotEmpty()) {
                item {
                    Text(
                        text = "Order History",
                        style = MaterialTheme.typography.titleMedium,
                        color = colors.textPrimary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                }

                items(orders) { order ->
                    OrderCard(order = order)
                    Spacer(modifier = Modifier.height(12.dp))
                }
            }

            // Empty state
            if (recentPurchases.isEmpty() && orders.isEmpty() && !isLoading) {
                item {
                    EmptyStateView(
                        icon = "🎫",
                        title = "No Tickets Yet",
                        message = "Your purchased tickets will appear here"
                    )
                }
            }
        }

        PullRefreshIndicator(
            refreshing = isLoading,
            state = pullRefreshState,
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}

@Composable
fun OrderCard(order: Order) {
    val colors = LocalVenueBitColors.current

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = colors.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Order header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Order #${order.id.takeLast(8)}",
                        style = MaterialTheme.typography.titleSmall,
                        color = colors.textPrimary
                    )
                    Text(
                        text = order.formattedDate,
                        style = MaterialTheme.typography.bodySmall,
                        color = colors.textSecondary
                    )
                }

                StatusBadge(status = order.status)
            }

            Spacer(modifier = Modifier.height(12.dp))

            Divider(color = colors.border)

            Spacer(modifier = Modifier.height(12.dp))

            // Tickets
            order.tickets.forEach { ticket ->
                TicketRow(ticket = ticket)
                Spacer(modifier = Modifier.height(8.dp))
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Total
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "${order.tickets.size} ticket(s)",
                    style = MaterialTheme.typography.bodyMedium,
                    color = colors.textSecondary
                )
                Text(
                    text = "$${order.total.toInt()}",
                    style = MaterialTheme.typography.titleMedium,
                    color = colors.textPrimary,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun TicketRow(ticket: Ticket) {
    val colors = LocalVenueBitColors.current

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Icon(
                imageVector = Icons.Default.QrCode,
                contentDescription = "Ticket",
                tint = colors.primary,
                modifier = Modifier.size(32.dp)
            )

            Column {
                Text(
                    text = ticket.eventTitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = colors.textPrimary
                )
                Text(
                    text = "Sec ${ticket.section} • Row ${ticket.row} • Seat ${ticket.seatNumber}",
                    style = MaterialTheme.typography.bodySmall,
                    color = colors.textSecondary
                )
            }
        }

        Text(
            text = "$${ticket.price.toInt()}",
            style = MaterialTheme.typography.bodyMedium,
            color = colors.textPrimary
        )
    }
}
```

### 7.5 Settings Screen

#### SettingsViewModel.kt
```kotlin
@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val userIdentityManager: UserIdentityManager,
    private val optimizelyManager: OptimizelyManager,
    private val serverConfig: ServerConfig
) : ViewModel() {

    val userId = userIdentityManager.userIdFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, "")

    val featureDecisions = optimizelyManager.featureDecisions
    val recentEvents = optimizelyManager.recentEvents

    val serverAddress = serverConfig.serverAddressFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, "localhost")

    val isLocalServer: Boolean get() = serverConfig.isLocalServer

    fun generateNewUserId() {
        viewModelScope.launch {
            userIdentityManager.generateAndSaveNewUserId()
            optimizelyManager.refreshFeatures()
        }
    }

    fun copyUserIdToClipboard(context: Context) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("User ID", userId.value)
        clipboard.setPrimaryClip(clip)
    }

    fun setServerAddress(address: String) {
        viewModelScope.launch {
            serverConfig.setServerAddress(address)
        }
    }
}
```

#### SettingsScreen.kt
```kotlin
@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val colors = LocalVenueBitColors.current
    val context = LocalContext.current

    val userId by viewModel.userId.collectAsState()
    val featureDecisions by viewModel.featureDecisions.collectAsState()
    val recentEvents by viewModel.recentEvents.collectAsState()
    val serverAddress by viewModel.serverAddress.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background),
        contentPadding = PaddingValues(16.dp)
    ) {
        // Header
        item {
            Text(
                text = "Settings",
                style = MaterialTheme.typography.headlineMedium,
                color = colors.textPrimary
            )
            Spacer(modifier = Modifier.height(24.dp))
        }

        // Optimizely Debug Panel
        item {
            DebugPanelSection(
                userId = userId,
                featureDecisions = featureDecisions,
                recentEvents = recentEvents,
                onCopyUserId = { viewModel.copyUserIdToClipboard(context) },
                onGenerateNewId = { viewModel.generateNewUserId() }
            )
            Spacer(modifier = Modifier.height(24.dp))
        }

        // About Section
        item {
            AboutSection()
            Spacer(modifier = Modifier.height(24.dp))
        }

        // Server Configuration
        item {
            ServerConfigSection(
                serverAddress = serverAddress,
                isLocalServer = viewModel.isLocalServer,
                onAddressChange = { viewModel.setServerAddress(it) }
            )
        }
    }
}

@Composable
fun DebugPanelSection(
    userId: String,
    featureDecisions: List<FeatureDecision>,
    recentEvents: List<OptimizelyManager.TrackedEvent>,
    onCopyUserId: () -> Unit,
    onGenerateNewId: () -> Unit
) {
    val colors = LocalVenueBitColors.current

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = colors.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Optimizely Debug",
                style = MaterialTheme.typography.titleMedium,
                color = colors.textPrimary
            )

            Spacer(modifier = Modifier.height(16.dp))

            // User ID
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "User ID",
                        style = MaterialTheme.typography.labelSmall,
                        color = colors.textSecondary
                    )
                    Text(
                        text = userId,
                        style = MaterialTheme.typography.bodySmall,
                        color = colors.textPrimary,
                        fontFamily = FontFamily.Monospace
                    )
                }

                IconButton(onClick = onCopyUserId) {
                    Icon(
                        Icons.Default.ContentCopy,
                        contentDescription = "Copy",
                        tint = colors.primary
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick = onGenerateNewId,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = colors.surfaceSecondary
                )
            ) {
                Text("Generate New User ID", color = colors.textPrimary)
            }

            Spacer(modifier = Modifier.height(16.dp))
            Divider(color = colors.border)
            Spacer(modifier = Modifier.height(16.dp))

            // Feature Flags
            Text(
                text = "Feature Flags",
                style = MaterialTheme.typography.titleSmall,
                color = colors.textPrimary
            )

            Spacer(modifier = Modifier.height(12.dp))

            featureDecisions.forEach { decision ->
                FeatureFlagRow(decision = decision)
                Spacer(modifier = Modifier.height(8.dp))
            }

            if (recentEvents.isNotEmpty()) {
                Spacer(modifier = Modifier.height(16.dp))
                Divider(color = colors.border)
                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Recent Events",
                    style = MaterialTheme.typography.titleSmall,
                    color = colors.textPrimary
                )

                Spacer(modifier = Modifier.height(12.dp))

                recentEvents.forEach { event ->
                    TrackedEventRow(event = event)
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
        }
    }
}

@Composable
fun FeatureFlagRow(decision: FeatureDecision) {
    val colors = LocalVenueBitColors.current

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = decision.featureKey,
                style = MaterialTheme.typography.bodyMedium,
                color = colors.textPrimary
            )
            decision.variationKey?.let {
                Text(
                    text = "Variation: $it",
                    style = MaterialTheme.typography.bodySmall,
                    color = colors.textSecondary
                )
            }
        }

        Surface(
            shape = RoundedCornerShape(4.dp),
            color = if (decision.enabled) VenueBitColors.Green500.copy(alpha = 0.15f)
                    else VenueBitColors.Red500.copy(alpha = 0.15f)
        ) {
            Text(
                text = if (decision.enabled) "ON" else "OFF",
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                style = MaterialTheme.typography.labelSmall,
                color = if (decision.enabled) VenueBitColors.Green500 else VenueBitColors.Red500,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun AboutSection() {
    val colors = LocalVenueBitColors.current

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = colors.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "About",
                style = MaterialTheme.typography.titleMedium,
                color = colors.textPrimary
            )

            Spacer(modifier = Modifier.height(16.dp))

            AboutRow(label = "App Version", value = "1.0.0")
            AboutRow(label = "Build", value = "Demo")
            AboutRow(label = "Platform", value = "Android")
        }
    }
}

@Composable
fun AboutRow(label: String, value: String) {
    val colors = LocalVenueBitColors.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = colors.textSecondary
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = colors.textPrimary
        )
    }
}

@Composable
fun ServerConfigSection(
    serverAddress: String,
    isLocalServer: Boolean,
    onAddressChange: (String) -> Unit
) {
    val colors = LocalVenueBitColors.current
    var inputAddress by remember { mutableStateOf(serverAddress) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = colors.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Server Configuration",
                    style = MaterialTheme.typography.titleMedium,
                    color = colors.textPrimary
                )

                // Status indicator
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(
                                if (isLocalServer) VenueBitColors.Green500
                                else VenueBitColors.Orange500
                            )
                    )
                    Text(
                        text = if (isLocalServer) "Local" else "Remote",
                        style = MaterialTheme.typography.labelSmall,
                        color = colors.textSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = inputAddress,
                onValueChange = { inputAddress = it },
                label = { Text("Server Address") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = colors.textPrimary,
                    unfocusedTextColor = colors.textPrimary,
                    focusedBorderColor = colors.primary,
                    unfocusedBorderColor = colors.border
                )
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Preset buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = { inputAddress = "localhost" },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("localhost")
                }

                OutlinedButton(
                    onClick = { inputAddress = "venuebit.tedcharles.net" },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Remote")
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick = { onAddressChange(inputAddress) },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = colors.primary
                )
            ) {
                Text("Apply")
            }
        }
    }
}
```

---

## 8. WebView Integration

### 8.1 Native Bridge for WebView Communication

#### NativeBridge.kt
```kotlin
class NativeBridge(
    private val onPurchaseComplete: (orderId: String, total: Double) -> Unit,
    private val onCloseWebView: () -> Unit,
    private val onScrollToTop: () -> Unit
) {
    @JavascriptInterface
    fun postMessage(messageJson: String) {
        try {
            val json = JSONObject(messageJson)
            val action = json.optString("action")

            when (action) {
                "purchaseComplete" -> {
                    val orderId = json.optString("orderId")
                    val total = json.optDouble("total", 0.0)
                    onPurchaseComplete(orderId, total)
                }
                "closeWebView" -> onCloseWebView()
                "scrollToTop" -> onScrollToTop()
            }
        } catch (e: Exception) {
            Log.e("NativeBridge", "Failed to parse message", e)
        }
    }
}
```

### 8.2 Seat Selection WebView Screen

#### SeatSelectionWebViewScreen.kt
```kotlin
@Composable
fun SeatSelectionWebViewScreen(
    eventId: String,
    serverConfig: ServerConfig,
    userIdentityManager: UserIdentityManager,
    themeManager: ThemeManager,
    onPurchaseComplete: (orderId: String, total: Double) -> Unit,
    onClose: () -> Unit
) {
    val colors = LocalVenueBitColors.current
    val context = LocalContext.current
    var userId by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        userId = userIdentityManager.getUserId()
    }

    val webViewUrl = remember(eventId, userId) {
        if (userId.isNotEmpty()) {
            val baseUrl = serverConfig.webAppUrl
            val theme = themeManager.currentTheme.value.name.lowercase()
            "$baseUrl/event/$eventId?userId=$userId&theme=$theme"
        } else ""
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Select Seats") },
                navigationIcon = {
                    IconButton(onClick = onClose) {
                        Icon(
                            Icons.Default.Close,
                            contentDescription = "Close",
                            tint = colors.textPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = colors.surface
                )
            )
        }
    ) { paddingValues ->
        if (webViewUrl.isNotEmpty()) {
            AndroidView(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                factory = { ctx ->
                    WebView(ctx).apply {
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                        }

                        webViewClient = object : WebViewClient() {
                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                // Inject any necessary theme/config
                            }
                        }

                        // Add JavaScript interface for native bridge
                        addJavascriptInterface(
                            NativeBridge(
                                onPurchaseComplete = onPurchaseComplete,
                                onCloseWebView = onClose,
                                onScrollToTop = { scrollTo(0, 0) }
                            ),
                            "AndroidBridge"
                        )

                        loadUrl(webViewUrl)
                    }
                }
            )
        } else {
            LoadingView()
        }
    }
}
```

### 8.3 Update Webapp for Android Bridge

The webapp's `nativeBridge.ts` needs to be updated to support Android:

```typescript
// Check for Android bridge
interface WindowWithAndroid extends Window {
  AndroidBridge?: {
    postMessage: (message: string) => void;
  };
}

export const sendToNative = (action: string, data?: Record<string, unknown>): void => {
  const windowWithWebKit = window as WindowWithWebKit;
  const windowWithAndroid = window as WindowWithAndroid;

  // iOS
  if (windowWithWebKit.webkit?.messageHandlers?.nativeBridge) {
    try {
      windowWithWebKit.webkit.messageHandlers.nativeBridge.postMessage({
        action,
        ...data,
      });
    } catch (error) {
      console.error('Error sending to iOS:', error);
    }
  }
  // Android
  else if (windowWithAndroid.AndroidBridge) {
    try {
      windowWithAndroid.AndroidBridge.postMessage(JSON.stringify({
        action,
        ...data,
      }));
    } catch (error) {
      console.error('Error sending to Android:', error);
    }
  }
  else {
    console.log('Native bridge not available. Running in browser mode.');
  }
};

export const isNativeContext = (): boolean => {
  const windowWithWebKit = window as WindowWithWebKit;
  const windowWithAndroid = window as WindowWithAndroid;
  return !!windowWithWebKit.webkit?.messageHandlers?.nativeBridge ||
         !!windowWithAndroid.AndroidBridge;
};
```

---

## 9. Feature Flags (Optimizely)

### 9.1 Feature Flag Integration

The Android app will support the same feature flags as iOS:

| Feature Flag | Purpose | Implementation |
|--------------|---------|----------------|
| `app_theme` | Dynamic theme switching | ThemeManager.setTheme() |
| `venuebit_homescreen` | A/B test homescreen layouts | HomescreenModule configuration |
| `ticket_experience` | Checkout variations | WebView parameters |

### 9.2 Real-time Updates

WebSocket integration provides real-time feature flag updates:

```kotlin
@HiltViewModel
class MainViewModel @Inject constructor(
    private val webSocketService: WebSocketService,
    private val optimizelyManager: OptimizelyManager,
    private val themeManager: ThemeManager
) : ViewModel() {

    init {
        viewModelScope.launch {
            webSocketService.messages.collect { message ->
                when (message) {
                    is WebSocketService.WebSocketMessage.DatafileUpdate -> {
                        optimizelyManager.refreshFeatures()
                    }
                    is WebSocketService.WebSocketMessage.ThemeUpdate -> {
                        themeManager.setTheme(message.theme)
                    }
                    else -> {}
                }
            }
        }
    }

    fun connectWebSocket() {
        webSocketService.connect()
    }

    fun disconnectWebSocket() {
        webSocketService.disconnect()
    }
}
```

---

## 10. Theming System

### 10.1 Compose Theme Provider

```kotlin
@Composable
fun VenueBitTheme(
    themeManager: ThemeManager = hiltViewModel<MainViewModel>().themeManager,
    content: @Composable () -> Unit
) {
    val currentTheme by themeManager.currentTheme.collectAsState()
    val colorScheme = when (currentTheme) {
        VenueBitTheme.BLACK -> BlackColorScheme
        VenueBitTheme.DARK -> DarkColorScheme
        VenueBitTheme.BEIGE -> BeigeColorScheme
        VenueBitTheme.LIGHT -> LightColorScheme
    }

    CompositionLocalProvider(
        LocalVenueBitColors provides colorScheme
    ) {
        MaterialTheme(
            colorScheme = darkColorScheme(
                primary = colorScheme.primary,
                background = colorScheme.background,
                surface = colorScheme.surface
            ),
            typography = VenueBitTypography,
            content = content
        )
    }
}

val LocalVenueBitColors = staticCompositionLocalOf { DarkColorScheme }
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

```kotlin
// EventRepositoryTest.kt
@Test
fun `getEvents returns success when API succeeds`() = runTest {
    val mockEvents = listOf(mockEvent())
    coEvery { eventsApi.getEvents(any(), any()) } returns ApiResponse(true, mockEvents, 1)

    val result = repository.getEvents()

    assertTrue(result.isSuccess)
    assertEquals(mockEvents, result.getOrNull())
}

// SearchViewModelTest.kt
@Test
fun `search debounces input correctly`() = runTest {
    viewModel.updateQuery("test")

    advanceTimeBy(200)
    assertTrue(viewModel.searchResults.value.isEmpty())

    advanceTimeBy(200)
    // Search should have been triggered
}
```

### 11.2 UI Tests

```kotlin
@HiltAndroidTest
class DiscoveryScreenTest {

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun discovery_displaysLogo() {
        composeTestRule.onNodeWithText("VenueBit").assertIsDisplayed()
    }

    @Test
    fun discovery_displaysFeaturedEvents() {
        composeTestRule.onNodeWithText("Featured").assertIsDisplayed()
    }
}
```

---

## 12. Build & Release

### 12.1 Build Variants

```kotlin
// app/build.gradle.kts
android {
    buildTypes {
        debug {
            isDebuggable = true
            buildConfigField("String", "OPTIMIZELY_SDK_KEY", "\"your-dev-key\"")
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            buildConfigField("String", "OPTIMIZELY_SDK_KEY", "\"your-prod-key\"")
        }
    }

    flavorDimensions += "environment"
    productFlavors {
        create("local") {
            dimension = "environment"
            buildConfigField("String", "DEFAULT_SERVER", "\"localhost\"")
        }
        create("production") {
            dimension = "environment"
            buildConfigField("String", "DEFAULT_SERVER", "\"venuebit.tedcharles.net\"")
        }
    }
}
```

### 12.2 Release Checklist

1. **Pre-release**
   - [ ] All unit tests passing
   - [ ] All UI tests passing
   - [ ] Manual QA on physical devices
   - [ ] Performance profiling complete
   - [ ] Accessibility review

2. **Build**
   - [ ] Update version code/name
   - [ ] Generate signed APK/AAB
   - [ ] Test signed build on device

3. **Release**
   - [ ] Upload to Play Console
   - [ ] Fill store listing
   - [ ] Add screenshots for various device sizes
   - [ ] Submit for review

---

## Appendix A: iOS to Android Mapping Reference

| iOS (SwiftUI) | Android (Compose) |
|---------------|-------------------|
| `@State` | `remember { mutableStateOf() }` |
| `@StateObject` | `viewModel()` |
| `@ObservedObject` | `collectAsState()` |
| `@Published` | `MutableStateFlow` |
| `@EnvironmentObject` | Hilt injection / CompositionLocal |
| `NavigationStack` | `NavHost` |
| `NavigationLink` | `NavController.navigate()` |
| `TabView` | `BottomNavigation` |
| `List` | `LazyColumn` |
| `ForEach` | `items()` |
| `AsyncImage` | `AsyncImage (Coil)` |
| `.refreshable` | `pullRefresh()` |
| `.sheet` | `ModalBottomSheet` |
| `.fullScreenCover` | `Dialog` or new Activity |
| `UserDefaults` | `DataStore` |
| `URLSession` | `Retrofit/OkHttp` |
| `NotificationCenter` | `SharedFlow/EventBus` |

---

## Appendix B: File Mapping (iOS → Android)

| iOS File | Android File |
|----------|--------------|
| `VenueBitApp.swift` | `VenueBitApplication.kt` |
| `ContentView.swift` | `MainActivity.kt` + `NavGraph.kt` |
| `AppState.swift` | `AppState.kt` (StateFlow) |
| `DiscoveryView.swift` | `DiscoveryScreen.kt` |
| `DiscoveryViewModel.swift` | `DiscoveryViewModel.kt` |
| `SearchView.swift` | `SearchScreen.kt` |
| `EventDetailView.swift` | `EventDetailScreen.kt` |
| `MyTicketsView.swift` | `MyTicketsScreen.kt` |
| `SettingsView.swift` | `SettingsScreen.kt` |
| `APIClient.swift` | `ApiClient.kt` + `*Api.kt` interfaces |
| `Event.swift` | `Event.kt` |
| `Ticket.swift` | `Ticket.kt` |
| `Order.swift` | `Order.kt` |
| `UserIdentityManager.swift` | `UserIdentityManager.kt` |
| `OptimizelyManager.swift` | `OptimizelyManager.kt` |
| `ThemeManager.swift` | `ThemeManager.kt` |
| `ServerConfig.swift` | `ServerConfig.kt` |
| `WebSocketService.swift` | `WebSocketService.kt` |
| `WebViewContainer.swift` | `SeatSelectionWebViewScreen.kt` |
| `EventCard.swift` | `EventCard.kt` |
| `CategoryPill.swift` | `CategoryPill.kt` |
| `EmptyStateView.swift` | `EmptyStateView.kt` |
| `LoadingView.swift` | `LoadingView.kt` |
| `VenueBitLogo.swift` | `VenueBitLogo.kt` |
| `Color+Extensions.swift` | `Color.kt` |

---

## Summary

This plan provides a complete roadmap for porting the VenueBit iOS app to Android with full feature parity. The Android app will:

1. **Use modern Android development practices**: Kotlin, Jetpack Compose, Hilt, Coroutines
2. **Mirror the iOS architecture**: MVVM pattern with clean separation of concerns
3. **Support all existing features**: Discovery, Search, Event Details, My Tickets, Settings
4. **Integrate with existing infrastructure**: Same backend API and webapp containers
5. **Maintain feature flag support**: Optimizely integration with real-time updates
6. **Provide consistent theming**: Dynamic theme system matching iOS implementation

The implementation follows Android best practices while maintaining consistency with the iOS app's user experience and functionality.
