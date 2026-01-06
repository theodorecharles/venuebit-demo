# VenueBit iOS App

A complete SwiftUI iOS application for the VenueBit demo with Optimizely feature experimentation.

## Features

- **Event Discovery**: Browse and search for events with category filtering
- **Event Details**: View detailed event information with ticket options
- **WebView Integration**: Seat selection and checkout via embedded WebViews
- **Shared User ID**: Consistent user identity across native and web views
- **A/B Testing**: Optimizely-powered feature flags with two variations
- **Debug Panel**: User ID management, variation display, and event tracking history

## Tech Stack

- **Swift 5.9+**
- **SwiftUI** - Declarative UI framework
- **Optimizely Swift SDK** - Feature experimentation
- **WKWebView** - Embedded web content
- **Combine** - Reactive programming
- **MVVM Architecture** - Clean separation of concerns

## Prerequisites

- Xcode 15+
- iOS 17.0+ deployment target
- macOS Sonoma or later

## Setup

### 1. Open the Project

Open the `VenueBitApp` folder in Xcode. You can use File > Open and select the folder containing `Package.swift`, or double-click the Package.swift file directly.

### 2. Configure Optimizely SDK Key

Set your Optimizely SDK key in `OptimizelyManager.swift`:

```swift
private let sdkKey = "YOUR_SDK_KEY_HERE"
```

Or pass it via environment variable in Xcode's scheme settings.

### 3. Configure Backend URL

Update the API base URL in `APIClient.swift`:

```swift
private let baseURL = "http://localhost:4001/api"
```

### 4. Run the App

1. Select your target device/simulator
2. Press Cmd+R to build and run

## Project Structure

```
VenueBitApp/
├── App/
│   ├── VenueBitApp.swift      # App entry point
│   ├── ContentView.swift       # Main tab view
│   └── AppState.swift          # Global app state
├── Core/
│   ├── UserIdentity/
│   │   └── UserIdentityManager.swift   # User ID management
│   ├── Optimizely/
│   │   └── OptimizelyManager.swift     # Feature flag decisions
│   ├── Networking/
│   │   ├── APIClient.swift             # REST API client
│   │   └── Models/                     # Data models
│   ├── WebView/
│   │   ├── WebViewContainer.swift      # WKWebView wrapper
│   │   ├── WebViewBridge.swift         # JS bridge handler
│   │   └── WebViewURLBuilder.swift     # URL construction
│   └── Extensions/
│       └── Color+Extensions.swift      # Custom colors
├── Components/
│   ├── EventCard.swift         # Event card UI
│   ├── CategoryPill.swift      # Category filter pills
│   ├── PriceRangeView.swift    # Price display
│   ├── DebugBadge.swift        # Variation indicator
│   ├── LoadingView.swift       # Loading spinner
│   ├── EmptyStateView.swift    # Empty state placeholder
│   └── GenerateUserButton.swift # New User ID button
└── Features/
    ├── Discovery/
    │   ├── DiscoveryView.swift         # Event browsing
    │   └── DiscoveryViewModel.swift    # Discovery logic
    ├── Search/
    │   ├── SearchView.swift            # Event search
    │   └── SearchViewModel.swift       # Search logic
    ├── EventDetail/
    │   ├── EventDetailView.swift       # Event details page
    │   └── EventDetailViewModel.swift  # Detail logic
    ├── Tickets/
    │   ├── SeatSelectionWebView.swift  # Seat selection WebView
    │   └── CheckoutWebView.swift       # Checkout WebView
    ├── MyTickets/
    │   └── MyTicketsView.swift         # Purchased tickets
    └── Settings/
        └── SettingsView.swift          # Debug panel
```

## Key Features

### User Identity Management

The `UserIdentityManager` handles user ID generation and persistence:

```swift
// Generate a new user ID
userManager.generateNewUserId()

// Access current user ID
let userId = userManager.userId
```

### Optimizely Integration

Feature decisions are managed by `OptimizelyManager`:

```swift
// Get current decision
let decision = optimizelyManager.currentDecision

// Check variation
if decision.isEnhanced {
    // Enhanced variation features
}

// Track events
optimizelyManager.trackEvent(eventKey: "add_to_cart", tags: ["price": 100])
```

### WebView Bridge

The native app communicates with WebViews via JavaScript bridge:

```swift
// Set up bridge handlers
bridge.onPurchaseComplete = { orderId, total in
    // Handle purchase completion
}

bridge.onCartCreated = { cartId in
    // Navigate to checkout
}
```

### Color System

Custom colors matching the web app design:

```swift
Color.slate900    // Background
Color.slate800    // Surface
Color.indigo500   // Primary
Color.indigo400   // Primary light
```

## Feature Variations

### Control Variation
- Standard event browsing
- Basic checkout flow
- Simple confirmation

### Enhanced Variation
- Urgency banners
- Similar seat recommendations
- Countdown timer on checkout

## API Integration

The app communicates with the backend at `http://localhost:4001/api`:

- `GET /events` - List events
- `GET /events/:id` - Event details
- `GET /search?q=query` - Search events
- `GET /users/:userId/orders` - User's orders
- `GET /orders/:orderId` - Order details

## WebView URLs

WebViews load from `http://localhost:4000`:

- `/seats/:eventId?userId=xxx` - Seat selection
- `/checkout?userId=xxx&cartId=xxx` - Checkout
- `/confirmation/:orderId?userId=xxx` - Order confirmation

## Debug Features

The Settings tab includes a comprehensive debug panel:

- **User ID Display**: Shows current user ID with copy button
- **Generate New User ID**: Test different variations
- **Feature Flag Status**: Current variation and variables
- **Event Tracking Log**: Recent tracked events

## Building for Production

1. Update bundle identifier and team
2. Configure production Optimizely SDK key
3. Update API URLs for production environment
4. Archive and distribute via App Store Connect

## Dependencies

Add via Swift Package Manager:

- `OptimizelySwiftSDK` - Feature experimentation

## Notes

- The app requires the backend and webapp running locally
- WebViews need network access to localhost
- Test card: 4242 4242 4242 4242
- All prices are in USD
