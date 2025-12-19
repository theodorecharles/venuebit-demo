# VenueBit Demo App - Build Progress

This file tracks the build progress for the VenueBit demo app. Use this to resume work if context is lost.

---

## Project Overview

- **Spec**: See `spec.md` for full specification
- **Purpose**: Demo Optimizely feature experimentation across iOS native, WebViews, and backend
- **Key Feature**: "Generate New User ID" button to demonstrate bucketing

---

## Current Status

**Phase**: COMPLETE
**Last Updated**: 2025-12-18
**Blocked By**: None

---

## Build Phases

### Phase 1: Project Setup & Infrastructure
- [x] 1.1 Create root project structure
- [x] 1.2 Create docker-compose.yml
- [x] 1.3 Create .env.example
- [x] 1.4 Create .gitignore

### Phase 2: Backend (Express.js)
- [x] 2.1 Initialize Node.js project (package.json)
- [x] 2.2 Configure TypeScript (tsconfig.json)
- [x] 2.3 Create Dockerfile
- [x] 2.4 Create base Express app structure
  - [x] src/index.ts (entry point)
  - [x] src/app.ts (Express configuration)
  - [x] src/config.ts (environment config)

#### 2.5 Data Layer
- [ ] 2.5.1 Create type definitions
  - [ ] src/types/event.ts
  - [ ] src/types/venue.ts
  - [ ] src/types/seat.ts
  - [ ] src/types/cart.ts
  - [ ] src/types/order.ts
- [ ] 2.5.2 Create mock data
  - [ ] src/data/venues.ts (6 venues)
  - [ ] src/data/events.ts (12 events)
  - [ ] src/data/seats.ts (seat generator)

#### 2.6 Services
- [ ] 2.6.1 src/services/optimizelyService.ts
- [ ] 2.6.2 src/services/eventService.ts
- [ ] 2.6.3 src/services/cartService.ts (in-memory cart storage)
- [ ] 2.6.4 src/services/orderService.ts (in-memory order storage)
- [ ] 2.6.5 src/utils/generateId.ts
- [ ] 2.6.6 src/utils/pricing.ts

#### 2.7 API Routes & Controllers
- [ ] 2.7.1 Events API
  - [ ] GET /api/events
  - [ ] GET /api/events/:id
  - [ ] GET /api/events/:id/seats
- [ ] 2.7.2 Search API
  - [ ] GET /api/search
- [ ] 2.7.3 Cart API
  - [ ] POST /api/cart
  - [ ] GET /api/cart/:cartId
  - [ ] POST /api/cart/:cartId/items
  - [ ] DELETE /api/cart/:cartId/items/:itemId
- [ ] 2.7.4 Checkout API
  - [ ] POST /api/checkout
- [ ] 2.7.5 Orders API
  - [ ] GET /api/orders/:orderId
  - [ ] GET /api/users/:userId/orders
- [ ] 2.7.6 Features API
  - [ ] GET /api/features/:userId
- [ ] 2.7.7 Tracking API
  - [ ] POST /api/track

- [ ] 2.8 Test backend manually with curl/Postman

### Phase 3: Web App (React)
- [ ] 3.1 Initialize Vite + React + TypeScript project
- [ ] 3.2 Configure Tailwind CSS
- [ ] 3.3 Create Dockerfile
- [ ] 3.4 Set up project structure

#### 3.5 Core Setup
- [ ] 3.5.1 src/main.tsx (entry point)
- [ ] 3.5.2 src/App.tsx (router setup)
- [ ] 3.5.3 src/index.css (Tailwind imports + dark theme)
- [ ] 3.5.4 Configure environment variables

#### 3.6 API Client
- [ ] 3.6.1 src/api/client.ts (Axios instance)
- [ ] 3.6.2 src/api/events.ts
- [ ] 3.6.3 src/api/cart.ts
- [ ] 3.6.4 src/api/checkout.ts

#### 3.7 Types
- [ ] 3.7.1 src/types/event.ts
- [ ] 3.7.2 src/types/seat.ts
- [ ] 3.7.3 src/types/cart.ts
- [ ] 3.7.4 src/types/order.ts

#### 3.8 State Management
- [ ] 3.8.1 src/store/userStore.ts (Zustand - userId from URL)
- [ ] 3.8.2 src/store/cartStore.ts (Zustand - cart state)

#### 3.9 Optimizely Setup
- [ ] 3.9.1 src/optimizely/client.ts
- [ ] 3.9.2 src/optimizely/OptimizelyWrapper.tsx
- [ ] 3.9.3 src/optimizely/features.ts (constants)

#### 3.10 Hooks
- [ ] 3.10.1 src/hooks/useUserId.ts
- [ ] 3.10.2 src/hooks/useFeatureFlag.ts
- [ ] 3.10.3 src/hooks/useTracking.ts
- [ ] 3.10.4 src/hooks/useNativeBridge.ts

#### 3.11 Utility Functions
- [ ] 3.11.1 src/utils/formatters.ts (price, date)
- [ ] 3.11.2 src/utils/nativeBridge.ts (iOS communication)

#### 3.12 Common Components
- [ ] 3.12.1 src/components/common/Button.tsx
- [ ] 3.12.2 src/components/common/Card.tsx
- [ ] 3.12.3 src/components/common/Loading.tsx
- [ ] 3.12.4 src/components/common/PriceDisplay.tsx

#### 3.13 Debug Components
- [ ] 3.13.1 src/components/debug/DebugBanner.tsx
- [ ] 3.13.2 src/components/debug/VariationBadge.tsx

#### 3.14 Seat Selection Components
- [ ] 3.14.1 src/components/seats/SeatMap.tsx
- [ ] 3.14.2 src/components/seats/VenueSection.tsx
- [ ] 3.14.3 src/components/seats/SeatGrid.tsx
- [ ] 3.14.4 src/components/seats/Seat.tsx
- [ ] 3.14.5 src/components/seats/SeatLegend.tsx
- [ ] 3.14.6 src/components/seats/SelectedSeats.tsx
- [ ] 3.14.7 src/components/seats/SeatPreview.tsx (enhanced variation)
- [ ] 3.14.8 src/components/seats/SimilarSeats.tsx (enhanced variation)
- [ ] 3.14.9 src/components/seats/UrgencyBanner.tsx (enhanced variation)

#### 3.15 Checkout Components
- [ ] 3.15.1 src/components/checkout/OrderSummary.tsx
- [ ] 3.15.2 src/components/checkout/TicketList.tsx
- [ ] 3.15.3 src/components/checkout/PriceBreakdown.tsx
- [ ] 3.15.4 src/components/checkout/PaymentForm.tsx (mock)
- [ ] 3.15.5 src/components/checkout/Confirmation.tsx

#### 3.16 Pages
- [ ] 3.16.1 src/pages/SeatSelectionPage.tsx
  - [ ] Control variation layout
  - [ ] Enhanced variation layout
- [ ] 3.16.2 src/pages/CheckoutPage.tsx
  - [ ] Control (standard) layout
  - [ ] Enhanced (streamlined) layout
- [ ] 3.16.3 src/pages/ConfirmationPage.tsx

- [ ] 3.17 Test webapp in browser standalone

### Phase 4: Docker Integration
- [ ] 4.1 Test docker-compose up (backend only)
- [ ] 4.2 Test docker-compose up (webapp only)
- [ ] 4.3 Test docker-compose up (both services)
- [ ] 4.4 Verify webapp can reach backend at localhost:4001
- [ ] 4.5 Test API calls from webapp to backend

### Phase 5: iOS App (Swift/SwiftUI)
- [ ] 5.1 Create Xcode project (VenueBitApp)
- [ ] 5.2 Configure Swift Package Manager for Optimizely SDK
- [ ] 5.3 Set up project structure

#### 5.4 Core Layer
- [ ] 5.4.1 App/VenueBitApp.swift (entry point)
- [ ] 5.4.2 App/ContentView.swift (tab view)
- [ ] 5.4.3 App/AppState.swift (global state)

#### 5.5 User Identity
- [ ] 5.5.1 Core/UserIdentity/UserIdentityManager.swift
  - [ ] Generate initial userId
  - [ ] Persist to UserDefaults
  - [ ] generateNewUserId() function
  - [ ] Notification for userId changes

#### 5.6 Optimizely Integration
- [ ] 5.6.1 Core/Optimizely/OptimizelyManager.swift
  - [ ] SDK initialization
  - [ ] getDecision() function
  - [ ] trackEvent() function
  - [ ] Listen for userId changes
- [ ] 5.6.2 Core/Optimizely/EventTracker.swift

#### 5.7 Networking
- [ ] 5.7.1 Core/Networking/APIClient.swift
- [ ] 5.7.2 Core/Networking/Endpoints.swift
- [ ] 5.7.3 Core/Networking/Models/Event.swift
- [ ] 5.7.4 Core/Networking/Models/Venue.swift
- [ ] 5.7.5 Core/Networking/Models/Ticket.swift
- [ ] 5.7.6 Core/Networking/Models/Cart.swift
- [ ] 5.7.7 Core/Networking/Models/Order.swift

#### 5.8 WebView Infrastructure
- [ ] 5.8.1 Core/WebView/WebViewContainer.swift (SwiftUI wrapper)
- [ ] 5.8.2 Core/WebView/WebViewBridge.swift (JS message handler)

#### 5.9 Reusable Components
- [ ] 5.9.1 Components/EventCard.swift
- [ ] 5.9.2 Components/PriceRangeView.swift
- [ ] 5.9.3 Components/CategoryPill.swift
- [ ] 5.9.4 Components/LoadingView.swift
- [ ] 5.9.5 Components/GenerateUserButton.swift (FAB)
- [ ] 5.9.6 Components/DebugBadge.swift

#### 5.10 Discovery Feature (Tab 1)
- [ ] 5.10.1 Features/Discovery/DiscoveryView.swift
- [ ] 5.10.2 Features/Discovery/DiscoveryViewModel.swift
- [ ] 5.10.3 Features/Discovery/FeaturedEventCard.swift
- [ ] 5.10.4 Features/Discovery/CategorySection.swift

#### 5.11 Search Feature (Tab 2)
- [ ] 5.11.1 Features/Search/SearchView.swift
- [ ] 5.11.2 Features/Search/SearchViewModel.swift
- [ ] 5.11.3 Features/Search/SearchResultRow.swift

#### 5.12 Event Detail Feature
- [ ] 5.12.1 Features/EventDetail/EventDetailView.swift
- [ ] 5.12.2 Features/EventDetail/EventDetailViewModel.swift
- [ ] 5.12.3 Features/EventDetail/EventInfoSection.swift

#### 5.13 Tickets Feature (WebViews)
- [ ] 5.13.1 Features/Tickets/SeatSelectionWebView.swift
- [ ] 5.13.2 Features/Tickets/CheckoutWebView.swift

#### 5.14 My Tickets Feature (Tab 3)
- [ ] 5.14.1 Features/MyTickets/MyTicketsView.swift
- [ ] 5.14.2 Features/MyTickets/TicketRow.swift

#### 5.15 Settings Feature (Tab 4 - Debug Panel)
- [ ] 5.15.1 Features/Settings/SettingsView.swift
- [ ] 5.15.2 Features/Settings/DebugPanelView.swift
  - [ ] User ID display
  - [ ] Copy User ID button
  - [ ] Generate New User ID button
  - [ ] Feature flag status display
  - [ ] Variable values display
  - [ ] Recent events tracked list

#### 5.16 Resources
- [ ] 5.16.1 Configure Assets.xcassets (app icon, colors)
- [ ] 5.16.2 Create Config.xcconfig (SDK key)

### Phase 6: Integration Testing
- [ ] 6.1 Start Docker services (webapp + backend)
- [ ] 6.2 Run iOS app in Simulator
- [ ] 6.3 Test Discovery tab loads events from API
- [ ] 6.4 Test Search functionality
- [ ] 6.5 Test Event Detail navigation
- [ ] 6.6 Test WebView seat selection loads correctly
- [ ] 6.7 Test userId is passed to WebView
- [ ] 6.8 Verify same variation shown in iOS and WebView
- [ ] 6.9 Test Add to Cart flow
- [ ] 6.10 Test Checkout WebView
- [ ] 6.11 Test purchase completion
- [ ] 6.12 Test My Tickets shows purchased tickets
- [ ] 6.13 Test Generate New User ID
  - [ ] iOS native variation changes
  - [ ] WebView variation changes
  - [ ] Backend decisions change

### Phase 7: Polish & Demo Features
- [ ] 7.1 Ensure FAB is visible on all iOS screens
- [ ] 7.2 Ensure Debug Banner is visible on all WebView pages
- [ ] 7.3 Add variation-specific visual differences
  - [ ] Control: Standard seat map
  - [ ] Enhanced: Seat preview on hover
  - [ ] Enhanced: Similar seats recommendations
  - [ ] Enhanced: Urgency banners
  - [ ] Control: Standard checkout layout
  - [ ] Enhanced: Streamlined checkout layout
- [ ] 7.4 Test variation consistency across platforms
- [ ] 7.5 Verify event tracking works (check console logs)
- [ ] 7.6 Final visual polish

### Phase 8: Documentation
- [ ] 8.1 Update README.md with setup instructions
- [ ] 8.2 Document required Optimizely project setup
- [ ] 8.3 Add demo script/talking points

---

## Notes & Context

### Optimizely Setup Required (Manual)
The demo requires an Optimizely Feature Experimentation project with:
1. Feature flag: `ticket_experience`
2. Variations: `control` (50%), `enhanced` (50%)
3. Variables:
   - `show_seat_preview` (boolean)
   - `show_recommendations` (boolean)
   - `checkout_layout` (string)
   - `show_urgency_banner` (boolean)
4. Events: `page_view`, `search`, `add_to_cart`, `checkout`, `purchase`

### Tech Stack Summary
- **iOS**: Swift 5.9+, SwiftUI, iOS 16+, Optimizely Swift SDK
- **Web**: React 18, TypeScript, Vite, Tailwind CSS, Optimizely React SDK
- **Backend**: Node.js 20, Express.js, TypeScript, Optimizely Node SDK

### Port Configuration
- Web App: localhost:4000
- Backend: localhost:4001

### Key Files to Reference
- `spec.md` - Full specification
- `docker-compose.yml` - Service orchestration
- `.env` - SDK key configuration

---

## Resumption Instructions

If resuming after context loss:

1. Check this file for current status
2. Read `spec.md` for full specification
3. Check which phase/task is next
4. Look at existing code to understand current state
5. Continue from the next unchecked item

### Quick Status Check Commands
```bash
# Check if Docker services exist
ls -la docker-compose.yml

# Check backend status
ls -la backend/

# Check webapp status
ls -la webapp/

# Check iOS app status
ls -la VenueBitApp/
```

---

## Completion Checklist

Before marking project complete:
- [ ] All Docker services start without errors
- [ ] iOS app runs in Simulator
- [ ] Events load from backend
- [ ] Search works
- [ ] Event detail shows correctly
- [ ] WebView seat selection works
- [ ] Same userId shows in iOS and WebView
- [ ] Same variation shows across all platforms
- [ ] Generate New User ID works and changes variation
- [ ] Full purchase flow completes
- [ ] My Tickets shows purchased items
- [ ] Debug panel shows correct information
