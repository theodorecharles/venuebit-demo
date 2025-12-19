# VenueBit Demo App

A multi-platform demo application showcasing Optimizely Feature Experimentation across native iOS, embedded web views, and backend services.

## Overview

VenueBit is an event discovery and ticket purchasing app that demonstrates how Optimizely feature flags can deliver consistent experiences across:

- **Native iOS** (Swift SDK)
- **Web Views** (JavaScript SDK)
- **Backend API** (Node.js SDK)

The same user ID receives identical feature flag decisions across all platforms.

## Key Demo Features

- **Generate New User ID Button** - Demonstrates how different user IDs get bucketed into different variations
- **Debug Panel** - Shows current user ID, variation assignment, and feature variables
- **Visual Variation Differences** - Control vs Enhanced experiences with visible UI changes

## Project Structure

```
venuebit-demo/
├── VenueBitApp/           # iOS Xcode project (Swift/SwiftUI)
├── webapp/                # React web application (Vite + Tailwind)
├── backend/               # Express.js API server
└── docker-compose.yml     # Docker orchestration
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Xcode 15+ (for iOS app)
- Optimizely Feature Experimentation account

### 1. Configure Optimizely

Create a feature flag in your Optimizely project:

- **Feature Key**: `ticket_experience`
- **Variations**: `control` (50%), `enhanced` (50%)
- **Variables**:
  - `show_seat_preview` (boolean): false / true
  - `show_recommendations` (boolean): false / true
  - `checkout_layout` (string): "standard" / "streamlined"
  - `show_urgency_banner` (boolean): false / true

### 2. Set Environment Variables

```bash
cp .env.example .env
# Edit .env and add your OPTIMIZELY_SDK_KEY
```

### 3. Start Backend & Web App

```bash
docker-compose up
```

- Web App: http://localhost:4000
- Backend API: http://localhost:4001

### 4. Run iOS App

1. Open `VenueBitApp/` folder in Xcode (it uses Swift Package Manager)
2. Update the SDK key in `OptimizelyManager.swift`
3. Select a simulator and run (Cmd+R)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    iPhone App (Swift)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Native Views │  │  WKWebView   │  │ Optimizely Swift │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│                           │                                  │
│                    userId via URL                            │
└───────────────────────────┼──────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐
│  Web App :4000  │  │ Backend API │  │    Optimizely   │
│  (React + JS    │  │   :4001     │  │     CDN         │
│   SDK)          │  │ (Node SDK)  │  │                 │
└─────────────────┘  └─────────────┘  └─────────────────┘
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | List all events |
| `/api/events/:id` | GET | Get event details |
| `/api/events/:id/seats` | GET | Get available seats |
| `/api/search` | GET | Search events |
| `/api/cart` | POST | Create cart |
| `/api/cart/:id` | GET | Get cart |
| `/api/cart/:id/items` | POST | Add items to cart |
| `/api/checkout` | POST | Process purchase |
| `/api/features/:userId` | GET | Get feature decisions |
| `/api/track` | POST | Track analytics event |

## Tracked Events

| Event | Description |
|-------|-------------|
| `page_view` | Page/screen viewed |
| `search` | Search performed |
| `add_to_cart` | Tickets added to cart |
| `checkout` | Checkout initiated |
| `purchase` | Purchase completed (with revenue) |

## Demo Script

1. **Show the app** - Browse events, demonstrate the UI
2. **Check the Debug Panel** - Show current user ID and variation
3. **Navigate to seat selection** - Point out variation-specific features
4. **Generate New User ID** - Tap the button to get a new user
5. **Show variation change** - May see different UI (enhanced vs control)
6. **Complete a purchase** - Show the full flow works
7. **Check consistency** - Same user ID = same variation everywhere

## License

Demo project for Optimizely Feature Experimentation.
