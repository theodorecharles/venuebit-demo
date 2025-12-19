# VenueBit Demo App Specification

A multi-platform demo application showcasing Optimizely Feature Experimentation across native iOS, embedded web views, and backend services with consistent user identity and feature flag decisions.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Demo Features](#demo-features)
4. [iPhone App (Swift)](#iphone-app-swift)
5. [Web App (React)](#web-app-react)
6. [Backend (Express.js)](#backend-expressjs)
7. [Optimizely Integration](#optimizely-integration)
8. [Project Structure](#project-structure)
9. [Docker Configuration](#docker-configuration)
10. [API Specification](#api-specification)
11. [Data Models](#data-models)
12. [Mock Data Catalog](#mock-data-catalog)

---

## Overview

### Purpose

VenueBit is a Ticketmaster-style event discovery and ticket purchasing application designed to demonstrate how Optimizely Feature Experimentation can be seamlessly integrated across:

- **Native iOS code** (Swift SDK)
- **Embedded web views** (JavaScript SDK)
- **Backend services** (Node.js SDK)

The key demonstration is that a single user receives **consistent feature flag decisions** across all three platforms by sharing a unique user identifier.

### Demo Context

This is a **local-only demo application** intended for presentations and proof-of-concept demonstrations. Security considerations (authentication, HTTPS, input validation, rate limiting) are intentionally omitted to keep the codebase simple and focused on the Optimizely integration patterns.

### Key Features

- Event discovery and browsing
- Event search with filters
- Event detail views
- Ticket selection and purchasing
- **Generate New User ID button** - Demonstrates random bucketing based on user ID hash
- **Debug Panel** - Shows current user ID, feature flag decisions, and variation assignment
- Consistent A/B testing across platforms

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         iPhone App (Swift)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │  Native Views   │  │   WKWebView     │  │  Optimizely Swift   │  │
│  │  (Discovery,    │  │  (Checkout,     │  │       SDK           │  │
│  │   Event List)   │  │   Seat Select)  │  │                     │  │
│  └────────┬────────┘  └────────┬────────┘  └──────────┬──────────┘  │
│           │                    │                      │             │
│           │         userId passed via URL/JS Bridge   │             │
│           │                    │                      │             │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  DEBUG PANEL: User ID | Variation | Generate New User Button  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────────┼────────────────────┼──────────────────────┼─────────────┘
            │                    │                      │
            │                    ▼                      │
            │    ┌───────────────────────────────────┐  │
            │    │    Web App (React) :4000          │  │
            │    │  ┌─────────────────────────────┐  │  │
            │    │  │  Optimizely JS SDK          │  │  │
            │    │  │  (same userId)              │  │  │
            │    │  └─────────────────────────────┘  │  │
            │    │  ┌─────────────────────────────┐  │  │
            │    │  │  Debug Banner (userId/var)  │  │  │
            │    │  └─────────────────────────────┘  │  │
            │    └───────────────┬───────────────────┘  │
            │                    │                      │
            ▼                    ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Backend (Express.js) :4001                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Optimizely Node SDK                        │    │
│  │                   (same userId for decisions)                │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │  Events  │  │  Search  │  │  Tickets │  │  Analytics/Track │    │
│  │   API    │  │   API    │  │   API    │  │       API        │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Port Configuration

| Service   | Port | URL                    |
|-----------|------|------------------------|
| Web App   | 4000 | http://localhost:4000  |
| Backend   | 4001 | http://localhost:4001  |

---

## Demo Features

### Generate New User ID Button

A prominent button available throughout the app that generates a new random user ID. This is the **key demo feature** for showing how Optimizely's deterministic bucketing works:

1. Each user ID is hashed by Optimizely to determine variation assignment
2. Generating a new user ID may result in a different variation
3. The same user ID will **always** get the same variation across iOS, Web, and Backend

**Placement:**
- **iOS App**: Floating button in bottom-right corner of all screens, plus in Settings/Account tab
- **Web App**: Fixed banner at top of all pages showing current user ID with "New User" button
- **Backend**: Returns variation info in all API responses

**Behavior:**
```
┌─────────────────────────────────────────────────────────────┐
│  Current User: user_a7f3b2c9d4e1                            │
│  Variation: enhanced                                         │
│                                                             │
│  [🔄 Generate New User ID]                                  │
│                                                             │
│  Tap to simulate a different user and potentially see      │
│  a different experience variation.                          │
└─────────────────────────────────────────────────────────────┘
```

### Debug Panel

A collapsible debug panel showing Optimizely state:

**iOS Debug Panel (Settings Tab + Floating Indicator):**
```
┌─────────────────────────────────────────────────────────────┐
│  🔬 Optimizely Debug                                        │
├─────────────────────────────────────────────────────────────┤
│  User ID:        user_a7f3b2c9d4e1                          │
│  SDK Status:     ● Ready                                    │
│                                                             │
│  Feature: ticket_experience                                  │
│  ├─ Enabled:     true                                       │
│  ├─ Variation:   enhanced                                   │
│  └─ Variables:                                              │
│      • show_seat_preview:    true                           │
│      • show_recommendations: true                           │
│      • checkout_layout:      streamlined                    │
│      • show_urgency_banner:  true                           │
│                                                             │
│  Recent Events Tracked:                                      │
│  • search (2 sec ago)                                       │
│  • page_view (5 sec ago)                                    │
│                                                             │
│  [🔄 Generate New User ID]        [📋 Copy User ID]         │
└─────────────────────────────────────────────────────────────┘
```

**Web Debug Banner:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔬 User: user_a7f3b2c9d4e1 | Variation: enhanced | [New ID] │
└─────────────────────────────────────────────────────────────┘
```

### Variation Visual Differences

The feature flag controls visible UI differences so demo audiences can clearly see variation changes:

**Control Variation:**
- Standard seat map (no hover previews)
- No "similar seats" recommendations
- Standard checkout layout with all fields visible
- No urgency messaging

**Enhanced Variation:**
- Seat hover shows preview tooltip with view from seat
- "You might also like" seat recommendations panel
- Streamlined checkout with progressive disclosure
- "Only X seats left at this price!" urgency banners

---

## iPhone App (Swift)

### Technology Stack

- **Language**: Swift 5.9+
- **Minimum iOS**: 16.0
- **UI Framework**: SwiftUI
- **Architecture**: MVVM
- **Dependencies**:
  - Optimizely Swift SDK (via SPM)
  - WebKit (WKWebView) - built-in

### App Structure

```
VenueBitApp/
├── VenueBitApp.xcodeproj/
├── VenueBitApp/
│   ├── App/
│   │   ├── VenueBitApp.swift              # App entry point
│   │   ├── ContentView.swift               # Main tab view
│   │   └── AppState.swift                  # Global app state
│   ├── Core/
│   │   ├── UserIdentity/
│   │   │   └── UserIdentityManager.swift   # Generates/stores/resets userId
│   │   ├── Optimizely/
│   │   │   ├── OptimizelyManager.swift     # SDK initialization & decisions
│   │   │   └── EventTracker.swift          # Event tracking wrapper
│   │   ├── Networking/
│   │   │   ├── APIClient.swift             # HTTP client
│   │   │   ├── Endpoints.swift             # API endpoint definitions
│   │   │   └── Models/                     # Codable API models
│   │   │       ├── Event.swift
│   │   │       ├── Venue.swift
│   │   │       ├── Ticket.swift
│   │   │       ├── Cart.swift
│   │   │       └── Order.swift
│   │   └── WebView/
│   │       ├── WebViewContainer.swift      # SwiftUI WKWebView wrapper
│   │       └── WebViewBridge.swift         # JS-Swift message handler
│   ├── Features/
│   │   ├── Discovery/
│   │   │   ├── DiscoveryView.swift
│   │   │   ├── DiscoveryViewModel.swift
│   │   │   ├── FeaturedEventCard.swift
│   │   │   └── CategorySection.swift
│   │   ├── Search/
│   │   │   ├── SearchView.swift
│   │   │   ├── SearchViewModel.swift
│   │   │   └── SearchResultRow.swift
│   │   ├── EventDetail/
│   │   │   ├── EventDetailView.swift
│   │   │   ├── EventDetailViewModel.swift
│   │   │   └── EventInfoSection.swift
│   │   ├── Tickets/
│   │   │   ├── SeatSelectionWebView.swift  # WebView wrapper for seat selection
│   │   │   └── CheckoutWebView.swift       # WebView wrapper for checkout
│   │   ├── MyTickets/
│   │   │   ├── MyTicketsView.swift
│   │   │   └── TicketRow.swift
│   │   └── Settings/
│   │       ├── SettingsView.swift          # Settings + Debug Panel
│   │       └── DebugPanelView.swift        # Full Optimizely debug info
│   ├── Components/
│   │   ├── EventCard.swift                 # Reusable event card
│   │   ├── PriceRangeView.swift
│   │   ├── CategoryPill.swift
│   │   ├── LoadingView.swift
│   │   ├── GenerateUserButton.swift        # Floating "New User" FAB
│   │   └── DebugBadge.swift                # Small variation indicator
│   └── Resources/
│       ├── Assets.xcassets
│       └── Config.xcconfig                 # SDK key configuration
└── VenueBitApp.xcodeproj/
    └── project.pbxproj
```

### Tab Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Current Screen]                         │
│                                                             │
│                                                             │
│                                          ┌─────────────────┐│
│                                          │  🔄 New User   ││
│                                          │     FAB        ││
│                                          └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│   🏠        🔍        🎫        ⚙️                          │
│ Discover  Search   My Tickets  Settings                     │
└─────────────────────────────────────────────────────────────┘
```

### Screens

#### 1. Discovery Tab (Home) - Native

The main landing screen showcasing events.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  VenueBit                                    [Debug Badge] │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │              FEATURED EVENT CARD                        ││
│  │           (Large hero image carousel)                   ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Categories                                                 │
│  [🎵 Concerts] [⚽ Sports] [🎭 Theater] [😂 Comedy]         │
│                                                             │
│  Trending Now                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │Event 1 │ │Event 2 │ │Event 3 │  →                       │
│  └────────┘ └────────┘ └────────┘                          │
│                                                             │
│  This Weekend                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │Event 4 │ │Event 5 │ │Event 6 │  →                       │
│  └────────┘ └────────┘ └────────┘                          │
│                                                             │
│                                          [🔄 New User FAB] │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Search Tab - Native

Full-text search with results.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Search events, artists, venues...                       │
├─────────────────────────────────────────────────────────────┤
│  [All] [Concerts] [Sports] [Theater] [Comedy]               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🎵  Taylor Swift - Eras Tour                            ││
│  │     SoFi Stadium • Aug 15 • From $99                    ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ⚽  Lakers vs Celtics                                   ││
│  │     Crypto.com Arena • Dec 25 • From $150               ││
│  └─────────────────────────────────────────────────────────┘│
│  ...                                                        │
│                                          [🔄 New User FAB] │
└─────────────────────────────────────────────────────────────┘
```

**Tracked Events:**
- `search` - When user submits a search query

#### 3. Event Detail - Native

Detailed view of a single event.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  ←  Taylor Swift - Eras Tour                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │              [Event Hero Image]                         ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  📅  Friday, August 15, 2025 • 7:30 PM                     │
│  📍  SoFi Stadium, Los Angeles, CA                         │
│  💰  $99 - $899                                            │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  About This Event                                           │
│  Experience the record-breaking Eras Tour, a journey       │
│  through Taylor Swift's musical eras...                    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │            [🎫 Get Tickets - Primary CTA]               ││
│  └─────────────────────────────────────────────────────────┘│
│                                          [🔄 New User FAB] │
└─────────────────────────────────────────────────────────────┘
```

#### 4. Seat Selection - WebView

Opens `http://localhost:4000/seats/{eventId}?userId={userId}`

The WebView loads the React seat selection page with the user ID passed in the URL.

#### 5. Checkout - WebView

Opens `http://localhost:4000/checkout?userId={userId}&cartId={cartId}`

The WebView loads the React checkout page.

**Tracked Events (from WebView):**
- `page_view` - When webview loads
- `add_to_cart` - When tickets added
- `checkout` - When checkout initiated
- `purchase` - When purchase completed (with revenue)

#### 6. My Tickets Tab - Native

User's purchased tickets.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  My Tickets                                                 │
├─────────────────────────────────────────────────────────────┤
│  Upcoming                                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Taylor Swift - Eras Tour                                ││
│  │ Aug 15, 2025 • Section 100, Row A, Seats 1-2           ││
│  │ [View Tickets]                                          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Past Events                                                │
│  (Empty state or past tickets)                             │
│                                          [🔄 New User FAB] │
└─────────────────────────────────────────────────────────────┘
```

#### 7. Settings Tab - Native (with Debug Panel)

Settings and comprehensive debug information.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Settings                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔬 OPTIMIZELY DEBUG                                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  User ID                                                ││
│  │  user_a7f3b2c9d4e1                    [📋 Copy]        ││
│  │                                                         ││
│  │  [🔄 Generate New User ID]                             ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Feature: ticket_experience                             ││
│  │  ──────────────────────────────────────────────────     ││
│  │  Status:     ● Enabled                                  ││
│  │  Variation:  enhanced                                   ││
│  │                                                         ││
│  │  Variables:                                             ││
│  │  • show_seat_preview:    ✓ true                        ││
│  │  • show_recommendations: ✓ true                        ││
│  │  • checkout_layout:      streamlined                   ││
│  │  • show_urgency_banner:  ✓ true                        ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Recent Events Tracked                                  ││
│  │  • search - "taylor swift" (3s ago)                     ││
│  │  • page_view - /seats/evt_001 (1m ago)                  ││
│  │  • add_to_cart - 2 tickets (2m ago)                     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ABOUT                                                      │
│  App Version: 1.0.0                                         │
│  SDK Key: KJh7...3kLm (masked)                             │
└─────────────────────────────────────────────────────────────┘
```

### User Identity Management

```swift
// UserIdentityManager.swift
import Foundation
import Combine

@MainActor
class UserIdentityManager: ObservableObject {
    static let shared = UserIdentityManager()

    @Published private(set) var userId: String

    private let userIdKey = "venuebit_user_id"

    init() {
        if let existingId = UserDefaults.standard.string(forKey: userIdKey) {
            self.userId = existingId
        } else {
            let newId = Self.generateUserId()
            UserDefaults.standard.set(newId, forKey: userIdKey)
            self.userId = newId
        }
    }

    /// Generates a new user ID and triggers Optimizely re-evaluation
    func generateNewUserId() {
        let newId = Self.generateUserId()
        UserDefaults.standard.set(newId, forKey: userIdKey)
        self.userId = newId

        // Notify Optimizely manager to re-evaluate decisions
        NotificationCenter.default.post(name: .userIdDidChange, object: newId)
    }

    private static func generateUserId() -> String {
        "user_\(UUID().uuidString.prefix(12).lowercased())"
    }
}

extension Notification.Name {
    static let userIdDidChange = Notification.Name("userIdDidChange")
}
```

### WebView Bridge

```swift
// WebViewBridge.swift
import WebKit

class WebViewBridge: NSObject, WKScriptMessageHandler {
    weak var webView: WKWebView?
    var onDismiss: (() -> Void)?
    var onPurchaseComplete: ((String, Double) -> Void)?

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard let body = message.body as? [String: Any],
              let action = body["action"] as? String else { return }

        switch action {
        case "closeWebView":
            onDismiss?()

        case "purchaseComplete":
            if let orderId = body["orderId"] as? String,
               let total = body["total"] as? Double {
                onPurchaseComplete?(orderId, total)
            }

        case "trackEvent":
            // Events are tracked via Optimizely JS SDK in webview
            // This is just for logging/debugging in native
            if let eventKey = body["eventKey"] as? String {
                print("[WebView Event] \(eventKey)")
            }

        default:
            break
        }
    }
}
```

### Generate User Button (FAB)

```swift
// GenerateUserButton.swift
import SwiftUI

struct GenerateUserButton: View {
    @ObservedObject var userManager = UserIdentityManager.shared
    @State private var showingConfirmation = false

    var body: some View {
        Button(action: {
            userManager.generateNewUserId()
            showingConfirmation = true
        }) {
            HStack {
                Image(systemName: "arrow.triangle.2.circlepath")
                Text("New User")
            }
            .font(.subheadline.bold())
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.indigo)
            .cornerRadius(24)
            .shadow(radius: 4)
        }
        .alert("New User Generated", isPresented: $showingConfirmation) {
            Button("OK", role: .cancel) { }
        } message: {
            Text("User ID: \(userManager.userId)\n\nFeature variations may have changed.")
        }
    }
}
```

---

## Web App (React)

### Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Dependencies**:
  - @optimizely/react-sdk
  - axios

### Project Structure

```
webapp/
├── public/
│   └── index.html
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Router setup
│   ├── index.css                   # Tailwind imports
│   ├── api/
│   │   ├── client.ts               # Axios instance
│   │   ├── events.ts               # Event API calls
│   │   ├── cart.ts                 # Cart API calls
│   │   └── checkout.ts             # Checkout API calls
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── PriceDisplay.tsx
│   │   ├── debug/
│   │   │   ├── DebugBanner.tsx     # Top banner with user ID
│   │   │   └── VariationBadge.tsx  # Small variation indicator
│   │   ├── seats/
│   │   │   ├── SeatMap.tsx         # Main seat map container
│   │   │   ├── VenueSection.tsx    # Clickable venue section
│   │   │   ├── SeatGrid.tsx        # Grid of selectable seats
│   │   │   ├── Seat.tsx            # Individual seat component
│   │   │   ├── SeatPreview.tsx     # Seat view preview (enhanced)
│   │   │   ├── SeatLegend.tsx      # Available/sold/selected legend
│   │   │   ├── SelectedSeats.tsx   # Selected seats summary
│   │   │   ├── SimilarSeats.tsx    # Recommendations (enhanced)
│   │   │   └── UrgencyBanner.tsx   # "X seats left" (enhanced)
│   │   └── checkout/
│   │       ├── OrderSummary.tsx    # Order details
│   │       ├── TicketList.tsx      # List of tickets in cart
│   │       ├── PriceBreakdown.tsx  # Subtotal, fees, total
│   │       ├── PaymentForm.tsx     # Mock payment form
│   │       └── Confirmation.tsx    # Order confirmed view
│   ├── hooks/
│   │   ├── useUserId.ts            # Extract userId from URL
│   │   ├── useFeatureFlag.ts       # Optimizely decision hook
│   │   ├── useTracking.ts          # Event tracking hook
│   │   └── useNativeBridge.ts      # Communication with iOS
│   ├── pages/
│   │   ├── SeatSelectionPage.tsx   # /seats/:eventId
│   │   ├── CheckoutPage.tsx        # /checkout
│   │   └── ConfirmationPage.tsx    # /confirmation/:orderId
│   ├── store/
│   │   ├── cartStore.ts            # Cart state (Zustand)
│   │   └── userStore.ts            # User ID state
│   ├── optimizely/
│   │   ├── client.ts               # Optimizely instance
│   │   ├── OptimizelyWrapper.tsx   # Provider wrapper
│   │   └── features.ts             # Feature flag constants
│   ├── types/
│   │   ├── event.ts
│   │   ├── seat.ts
│   │   ├── cart.ts
│   │   └── order.ts
│   └── utils/
│       ├── formatters.ts           # Price, date formatting
│       └── nativeBridge.ts         # iOS communication
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── Dockerfile
```

### Pages

#### 1. Seat Selection Page (`/seats/:eventId`)

**URL Parameters:**
- `userId` (required) - User identifier from native app

**Layout (Control Variation):**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔬 User: user_a7f3b2c9d4e1 | Variation: control | [New ID] │
├─────────────────────────────────────────────────────────────┤
│  ←  Taylor Swift - Eras Tour                                │
│      SoFi Stadium • Aug 15, 2025                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         ┌─────────────────────────────────┐                │
│         │          STAGE                   │                │
│         └─────────────────────────────────┘                │
│                                                             │
│    ┌─────┐     ┌─────────────┐     ┌─────┐                │
│    │FLOOR│     │   FLOOR     │     │FLOOR│                │
│    │ L   │     │   CENTER    │     │  R  │                │
│    └─────┘     └─────────────┘     └─────┘                │
│                                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │              LOWER BOWL 100s                  │          │
│  └──────────────────────────────────────────────┘          │
│  ┌──────────────────────────────────────────────┐          │
│  │              UPPER BOWL 200s                  │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Legend: ⬜ Available  🟦 Selected  ⬛ Sold                 │
├─────────────────────────────────────────────────────────────┤
│  Selected Seats (2)                             $598.00    │
│  Section 100, Row A: Seats 1, 2                            │
│                                                             │
│  [Clear Selection]                    [Add to Cart →]      │
└─────────────────────────────────────────────────────────────┘
```

**Layout (Enhanced Variation) - Additional Elements:**
```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Only 3 seats left at this price!        [Urgency]      │
├─────────────────────────────────────────────────────────────┤
│  ... (seat map with hover previews) ...                    │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 👀 View from Seat                      [Seat Preview] │ │
│  │ ┌─────────────────────────────────────────────────┐   │ │
│  │ │                                                 │   │ │
│  │ │   [Simulated view image from seat]             │   │ │
│  │ │                                                 │   │ │
│  │ └─────────────────────────────────────────────────┘   │ │
│  │ Section 100, Row A, Seat 1 • $299                     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 💡 Similar Seats You Might Like       [Recommendations]│ │
│  │ • Section 101, Row B: $275 (2 available)              │ │
│  │ • Section 99, Row C: $285 (4 available)               │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Checkout Page (`/checkout`)

**URL Parameters:**
- `userId` (required)
- `cartId` (required)

**Layout (Control - Standard):**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔬 User: user_a7f3b2c9d4e1 | Variation: control | [New ID] │
├─────────────────────────────────────────────────────────────┤
│  ←  Checkout                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ORDER SUMMARY                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Taylor Swift - Eras Tour                                ││
│  │ Aug 15, 2025 • 7:30 PM                                  ││
│  │ SoFi Stadium                                            ││
│  │                                                         ││
│  │ 2x Section 100, Row A                                   ││
│  │ Seats 1, 2                                              ││
│  │                                                    $598 ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  PAYMENT                                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Card Number                                             ││
│  │ [4242 4242 4242 4242                              ]     ││
│  │                                                         ││
│  │ Expiry          CVV                                     ││
│  │ [12/28    ]     [123 ]                                  ││
│  │                                                         ││
│  │ Name on Card                                            ││
│  │ [Demo User                                        ]     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  PROMO CODE                                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Enter code...              ] [Apply]                   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Subtotal                                          $598.00 │
│  Service Fee                                        $89.70 │
│  Order Processing Fee                                $5.00 │
│  ─────────────────────────────────────────────────────────  │
│  Total                                             $692.70 │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           [Complete Purchase - $692.70]                 ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Layout (Enhanced - Streamlined):**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔬 User: user_a7f3b2c9d4e1 | Variation: enhanced |[New ID] │
├─────────────────────────────────────────────────────────────┤
│  ←  Secure Checkout                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚡ Complete your purchase                                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🎵 Taylor Swift - Eras Tour          2 tickets  $598   ││
│  │    Aug 15 • Section 100, Row A                   [Edit]││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  💳 Payment                                   [Change ▼]   │
│  •••• •••• •••• 4242                                       │
│                                                             │
│  🎁 Add promo code                            [Add ▼]      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Total                                             $692.70 │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ⚠️ Hurry! Tickets are in high demand                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           [Pay $692.70 →]                               ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  🔒 Secure checkout • Tickets delivered instantly          │
└─────────────────────────────────────────────────────────────┘
```

#### 3. Confirmation Page (`/confirmation/:orderId`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔬 User: user_a7f3b2c9d4e1 | Variation: enhanced |[New ID] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ✅                                       │
│                                                             │
│           You're going to see                               │
│         Taylor Swift!                                       │
│                                                             │
│  Order #ORD-ABC123                                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Taylor Swift - Eras Tour                                ││
│  │ Friday, August 15, 2025 • 7:30 PM                       ││
│  │ SoFi Stadium, Los Angeles                               ││
│  │                                                         ││
│  │ Section 100, Row A                                      ││
│  │ Seats 1, 2                                              ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Your tickets have been added to My Tickets                │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              [Return to App]                            ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Debug Banner Component

```tsx
// components/debug/DebugBanner.tsx
import { useDecision } from '@optimizely/react-sdk';
import { useUserStore } from '../../store/userStore';

export function DebugBanner() {
  const { userId } = useUserStore();
  const [decision] = useDecision('ticket_experience');

  const handleNewUser = () => {
    // Generate new ID and reload page with new userId
    const newId = `user_${crypto.randomUUID().slice(0, 12)}`;
    const url = new URL(window.location.href);
    url.searchParams.set('userId', newId);
    window.location.href = url.toString();
  };

  return (
    <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-4">
        <span className="text-slate-400">🔬</span>
        <span>
          User: <code className="bg-slate-700 px-2 py-0.5 rounded">{userId}</code>
        </span>
        <span>
          Variation: <span className={`font-medium ${
            decision.variationKey === 'enhanced'
              ? 'text-green-400'
              : 'text-blue-400'
          }`}>
            {decision.variationKey || 'control'}
          </span>
        </span>
      </div>
      <button
        onClick={handleNewUser}
        className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
      >
        🔄 New User ID
      </button>
    </div>
  );
}
```

### Native Bridge Communication

```typescript
// utils/nativeBridge.ts
interface NativeBridge {
  postMessage: (message: any) => void;
}

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        nativeBridge?: NativeBridge;
      };
    };
  }
}

export function isInNativeApp(): boolean {
  return !!window.webkit?.messageHandlers?.nativeBridge;
}

export function sendToNative(action: string, data?: Record<string, any>) {
  const message = { action, ...data };

  if (window.webkit?.messageHandlers?.nativeBridge) {
    window.webkit.messageHandlers.nativeBridge.postMessage(message);
  }

  // Always log for debugging
  console.log('[NativeBridge]', message);
}

export function notifyPurchaseComplete(orderId: string, total: number) {
  sendToNative('purchaseComplete', { orderId, total });
}

export function requestCloseWebView() {
  sendToNative('closeWebView');
}
```

---

## Backend (Express.js)

### Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: In-memory (JavaScript Maps/Arrays)
- **Dependencies**:
  - @optimizely/optimizely-sdk
  - express
  - cors
  - uuid

### Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Entry point, server start
│   ├── app.ts                      # Express app configuration
│   ├── config.ts                   # Environment config
│   ├── routes/
│   │   ├── index.ts                # Route aggregator
│   │   ├── events.ts               # /api/events routes
│   │   ├── search.ts               # /api/search routes
│   │   ├── cart.ts                 # /api/cart routes
│   │   ├── checkout.ts             # /api/checkout routes
│   │   ├── orders.ts               # /api/orders routes
│   │   ├── features.ts             # /api/features routes
│   │   └── track.ts                # /api/track routes
│   ├── controllers/
│   │   ├── eventsController.ts
│   │   ├── searchController.ts
│   │   ├── cartController.ts
│   │   ├── checkoutController.ts
│   │   ├── ordersController.ts
│   │   ├── featuresController.ts
│   │   └── trackController.ts
│   ├── services/
│   │   ├── eventService.ts         # Event data operations
│   │   ├── cartService.ts          # Cart management
│   │   ├── orderService.ts         # Order processing
│   │   └── optimizelyService.ts    # Optimizely SDK wrapper
│   ├── data/
│   │   ├── events.ts               # Mock event data (10+ events)
│   │   ├── venues.ts               # Mock venue data
│   │   └── seats.ts                # Generated seat data
│   ├── types/
│   │   ├── event.ts
│   │   ├── venue.ts
│   │   ├── seat.ts
│   │   ├── cart.ts
│   │   └── order.ts
│   └── utils/
│       ├── generateId.ts           # ID generation helpers
│       └── pricing.ts              # Price calculation
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Optimizely Service

```typescript
// services/optimizelyService.ts
import * as optimizely from '@optimizely/optimizely-sdk';
import { config } from '../config';

class OptimizelyService {
  private client: optimizely.Client | null = null;
  private ready = false;

  async initialize(): Promise<void> {
    this.client = optimizely.createInstance({
      sdkKey: config.optimizelySdkKey,
    });

    await this.client.onReady();
    this.ready = true;
    console.log('Optimizely SDK initialized');
  }

  getDecision(userId: string, featureKey: string) {
    if (!this.client || !this.ready) {
      return { enabled: false, variationKey: null, variables: {} };
    }

    const userContext = this.client.createUserContext(userId);
    if (!userContext) {
      return { enabled: false, variationKey: null, variables: {} };
    }

    const decision = userContext.decide(featureKey);

    return {
      enabled: decision.enabled,
      variationKey: decision.variationKey,
      variables: decision.variables,
    };
  }

  trackEvent(
    userId: string,
    eventKey: string,
    tags?: Record<string, any>
  ): void {
    if (!this.client || !this.ready) return;

    const userContext = this.client.createUserContext(userId);
    if (userContext) {
      userContext.trackEvent(eventKey, tags);
      console.log(`[Optimizely] Tracked: ${eventKey}`, { userId, tags });
    }
  }
}

export const optimizelyService = new OptimizelyService();
```

### API Response Enhancement

All API responses include Optimizely decision info for debugging:

```typescript
// Example response wrapper
interface ApiResponse<T> {
  data: T;
  _optimizely?: {
    userId: string;
    decisions: {
      [featureKey: string]: {
        enabled: boolean;
        variationKey: string | null;
        variables: Record<string, any>;
      };
    };
  };
}
```

---

## Optimizely Integration

### SDK Key Configuration

All three platforms use the same Optimizely project SDK key:

| Platform | Environment Variable      | File                      |
|----------|---------------------------|---------------------------|
| iOS      | Hardcoded or Config.xcconfig | `Config.xcconfig`      |
| Web App  | `VITE_OPTIMIZELY_SDK_KEY` | `.env`                   |
| Backend  | `OPTIMIZELY_SDK_KEY`      | `.env`                   |

### Feature Flag: `ticket_experience`

Controls the ticket selection and checkout experience across all platforms.

**Variations:**

| Variation | Key        | Traffic | Description                              |
|-----------|------------|---------|------------------------------------------|
| Control   | `control`  | 50%     | Standard experience                      |
| Enhanced  | `enhanced` | 50%     | Enhanced UI with previews/recommendations|

**Variables:**

| Variable               | Type    | Control | Enhanced    | Description                    |
|------------------------|---------|---------|-------------|--------------------------------|
| `show_seat_preview`    | boolean | false   | true        | 3D seat view preview on hover  |
| `show_recommendations` | boolean | false   | true        | Similar seats suggestions      |
| `checkout_layout`      | string  | standard| streamlined | Checkout page layout           |
| `show_urgency_banner`  | boolean | false   | true        | "X seats left" messaging       |

### Tracked Events

| Event Key   | Description              | Tags                                   | Where Tracked    |
|-------------|--------------------------|----------------------------------------|------------------|
| `page_view` | Page/screen viewed       | `page`, `platform`                     | Web, iOS         |
| `search`    | Search performed         | `query`, `results_count`               | iOS, Backend     |
| `add_to_cart`| Tickets added to cart   | `event_id`, `quantity`, `value`        | Web              |
| `checkout`  | Checkout initiated       | `cart_id`, `item_count`, `value`       | Web              |
| `purchase`  | Purchase completed       | `order_id`, `revenue`, `item_count`    | Web, Backend     |

### Consistency Demonstration

The demo shows that the same user ID gets identical decisions:

```
User ID: user_a7f3b2c9d4e1
├── iOS App (Swift SDK)      → enhanced variation
├── WebView (JavaScript SDK) → enhanced variation
└── Backend (Node SDK)       → enhanced variation

User ID: user_x9y8z7w6v5u4
├── iOS App (Swift SDK)      → control variation
├── WebView (JavaScript SDK) → control variation
└── Backend (Node SDK)       → control variation
```

---

## Project Structure

```
demo-events-app/
├── VenueBitApp/                   # iOS Xcode project
│   ├── VenueBitApp.xcodeproj/
│   ├── VenueBitApp/
│   │   ├── App/
│   │   ├── Core/
│   │   ├── Features/
│   │   ├── Components/
│   │   └── Resources/
│   └── VenueBitApp.xcodeproj/
├── webapp/                         # React web application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── backend/                        # Express.js backend
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml              # Orchestration
├── .env.example                    # Environment template
├── spec.md                         # This specification
└── todo.md                         # Build progress tracking
```

---

## Docker Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  webapp:
    build:
      context: ./webapp
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - VITE_OPTIMIZELY_SDK_KEY=${OPTIMIZELY_SDK_KEY}
      - VITE_API_URL=http://localhost:4001
    depends_on:
      - backend
    networks:
      - venuebit

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4001:4001"
    environment:
      - OPTIMIZELY_SDK_KEY=${OPTIMIZELY_SDK_KEY}
      - PORT=4001
    networks:
      - venuebit

networks:
  venuebit:
    driver: bridge
```

### webapp/Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4000"]
```

### backend/Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4001

CMD ["npm", "run", "dev"]
```

### .env.example

```bash
# Optimizely SDK Key (same for all platforms)
OPTIMIZELY_SDK_KEY=your_sdk_key_here
```

---

## API Specification

### Base URL

```
http://localhost:4001/api
```

### Events

#### GET /api/events

List events with optional filters.

**Query Parameters:**
| Param      | Type   | Description                    |
|------------|--------|--------------------------------|
| category   | string | concerts, sports, theater, comedy |
| featured   | boolean| Only featured events           |
| limit      | number | Results per page (default: 20) |
| offset     | number | Pagination offset              |

**Response:**
```json
{
  "data": {
    "events": [...],
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

#### GET /api/events/:id

Get single event with full details.

#### GET /api/events/:id/seats

Get available seats for an event.

**Response:**
```json
{
  "data": {
    "eventId": "evt_001",
    "sections": [
      {
        "id": "floor",
        "name": "Floor",
        "rows": [
          {
            "row": "A",
            "seats": [
              { "id": "floor_A_1", "number": 1, "price": 499, "status": "available" },
              { "id": "floor_A_2", "number": 2, "price": 499, "status": "sold" }
            ]
          }
        ]
      }
    ]
  }
}
```

### Search

#### GET /api/search

Search events.

**Query Parameters:**
| Param | Type   | Description          |
|-------|--------|----------------------|
| q     | string | Search query         |
| category | string | Filter by category |

**Headers:**
| Header    | Description           |
|-----------|-----------------------|
| X-User-ID | User ID for tracking  |

### Cart

#### POST /api/cart

Create new cart.

**Request:**
```json
{
  "userId": "user_abc123"
}
```

#### POST /api/cart/:cartId/items

Add seats to cart.

**Request:**
```json
{
  "eventId": "evt_001",
  "seatIds": ["floor_A_1", "floor_A_2"]
}
```

#### GET /api/cart/:cartId

Get cart contents.

#### DELETE /api/cart/:cartId/items/:itemId

Remove item from cart.

### Checkout

#### POST /api/checkout

Process purchase.

**Request:**
```json
{
  "cartId": "cart_xyz",
  "userId": "user_abc123",
  "payment": {
    "cardLast4": "4242"
  }
}
```

**Response:**
```json
{
  "data": {
    "orderId": "ord_123",
    "status": "confirmed",
    "total": 692.70,
    "tickets": [...]
  }
}
```

### Orders

#### GET /api/orders/:orderId

Get order details.

#### GET /api/users/:userId/orders

Get user's orders.

### Features

#### GET /api/features/:userId

Get feature decisions for user.

**Response:**
```json
{
  "data": {
    "userId": "user_abc123",
    "features": {
      "ticket_experience": {
        "enabled": true,
        "variationKey": "enhanced",
        "variables": {
          "show_seat_preview": true,
          "show_recommendations": true,
          "checkout_layout": "streamlined",
          "show_urgency_banner": true
        }
      }
    }
  }
}
```

### Tracking

#### POST /api/track

Track analytics event.

**Request:**
```json
{
  "userId": "user_abc123",
  "eventKey": "purchase",
  "tags": {
    "revenue": 692.70,
    "order_id": "ord_123"
  }
}
```

---

## Data Models

### Event

```typescript
interface Event {
  id: string;
  title: string;
  category: 'concerts' | 'sports' | 'theater' | 'comedy';
  performer: {
    id: string;
    name: string;
    imageUrl: string;
  };
  venue: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  dateTime: string;
  priceRange: { min: number; max: number };
  imageUrl: string;
  description: string;
  status: 'on_sale' | 'sold_out';
  featured: boolean;
}
```

### Seat

```typescript
interface Seat {
  id: string;
  sectionId: string;
  sectionName: string;
  row: string;
  number: number;
  price: number;
  status: 'available' | 'held' | 'sold';
}
```

### Cart

```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  fees: number;
  total: number;
  createdAt: string;
  expiresAt: string;
}

interface CartItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDateTime: string;
  venueName: string;
  seats: Seat[];
  subtotal: number;
}
```

### Order

```typescript
interface Order {
  id: string;
  userId: string;
  status: 'confirmed' | 'cancelled';
  items: CartItem[];
  subtotal: number;
  fees: number;
  total: number;
  tickets: Ticket[];
  createdAt: string;
}

interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDateTime: string;
  venueName: string;
  section: string;
  row: string;
  seat: number;
  price: number;
}
```

---

## Mock Data Catalog

### Events (12 total)

| ID       | Title                           | Category | Venue                  | Price Range |
|----------|---------------------------------|----------|------------------------|-------------|
| evt_001  | Taylor Swift - Eras Tour        | concerts | SoFi Stadium, LA       | $99-$899    |
| evt_002  | Lakers vs Celtics               | sports   | Crypto.com Arena, LA   | $150-$1200  |
| evt_003  | Hamilton                        | theater  | Pantages Theatre, LA   | $89-$399    |
| evt_004  | Kevin Hart Live                 | comedy   | The Forum, LA          | $75-$250    |
| evt_005  | Coldplay - Music of the Spheres | concerts | Rose Bowl, Pasadena    | $79-$450    |
| evt_006  | Dodgers vs Yankees              | sports   | Dodger Stadium, LA     | $45-$500    |
| evt_007  | The Lion King                   | theater  | Hollywood Pantages     | $79-$299    |
| evt_008  | Dave Chappelle                  | comedy   | Hollywood Bowl, LA     | $95-$350    |
| evt_009  | Bad Bunny World Tour            | concerts | SoFi Stadium, LA       | $89-$599    |
| evt_010  | UFC 300                         | sports   | T-Mobile Arena, LV     | $200-$2500  |
| evt_011  | Wicked                          | theater  | Hollywood Pantages     | $69-$289    |
| evt_012  | John Mulaney                    | comedy   | Greek Theatre, LA      | $65-$195    |

### Venues (6 total)

| ID      | Name              | City        | Capacity |
|---------|-------------------|-------------|----------|
| ven_001 | SoFi Stadium      | Los Angeles | 70,000   |
| ven_002 | Crypto.com Arena  | Los Angeles | 20,000   |
| ven_003 | Pantages Theatre  | Los Angeles | 2,700    |
| ven_004 | The Forum         | Los Angeles | 17,500   |
| ven_005 | Rose Bowl         | Pasadena    | 90,000   |
| ven_006 | Dodger Stadium    | Los Angeles | 56,000   |

### Seat Sections (per venue type)

**Stadium (SoFi, Rose Bowl, Dodger):**
- Floor (A-F rows, 20 seats/row)
- Lower 100s (A-Z rows, 30 seats/row)
- Upper 200s (A-Z rows, 35 seats/row)

**Arena (Crypto.com, Forum):**
- Floor (A-D rows, 15 seats/row)
- Lower 100s (A-R rows, 25 seats/row)
- Upper 200s (A-P rows, 30 seats/row)

**Theater (Pantages):**
- Orchestra (A-W rows, 40 seats/row)
- Mezzanine (A-H rows, 35 seats/row)
- Balcony (A-F rows, 30 seats/row)

---

## UI/UX Guidelines

### Color Palette

```
Primary:       #6366F1 (Indigo-500)
Primary Dark:  #4F46E5 (Indigo-600)
Secondary:     #EC4899 (Pink-500)
Success:       #10B981 (Emerald-500)
Warning:       #F59E0B (Amber-500)
Error:         #EF4444 (Red-500)

Background:    #0F172A (Slate-900)
Surface:       #1E293B (Slate-800)
Surface Light: #334155 (Slate-700)

Text Primary:  #F8FAFC (Slate-50)
Text Secondary:#94A3B8 (Slate-400)
Text Muted:    #64748B (Slate-500)
```

### Seat Status Colors

```
Available:     #10B981 (Emerald-500)
Selected:      #6366F1 (Indigo-500)
Sold:          #475569 (Slate-600)
Held:          #F59E0B (Amber-500)
```

### Typography

**iOS:** System fonts (SF Pro)
**Web:** Inter (Google Fonts)

### Component Styling

- Border radius: 8px (small), 12px (medium), 16px (large)
- Shadows: Subtle for cards, more prominent for modals
- Transitions: 200ms ease-out for interactions
- Touch targets: Minimum 44x44 points on iOS
