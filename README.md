# VenueBit Demo App

A multi-platform demo application showcasing Optimizely Feature Experimentation across native iOS, embedded web views, and backend services.

## Overview

VenueBit is an event discovery and ticket purchasing app that demonstrates how Optimizely feature flags can deliver consistent experiences across:

- **Native iOS** (Swift SDK)
- **Web Views** (JavaScript SDK)
- **Backend API** (Node.js SDK)

The same user ID receives identical feature flag decisions across all platforms.

## How It Works

### Architecture

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

### Data Flow

1. **iOS App Initialization**: The iOS app initializes the Optimizely Swift SDK and generates/stores a user ID
2. **Feature Decisions**: When displaying UI, the app requests feature flag decisions from Optimizely using the user ID
3. **Web View Integration**: When embedding the web app, the iOS app passes the user ID via URL parameters to ensure consistent bucketing
4. **Backend API**: The backend also uses the Optimizely Node SDK, receiving the user ID from API requests to make server-side decisions
5. **Event Tracking**: All platforms track user events (page views, purchases, etc.) to Optimizely for experiment analysis

### Datafile Updates

The backend supports two methods for receiving Optimizely datafile updates, controlled by the `POLLING_INTERVAL` environment variable:

#### Webhook Mode (Recommended for Production)

Set `POLLING_INTERVAL=` (empty) or `POLLING_INTERVAL=-1`:

1. Configure an Optimizely webhook to POST to `https://your-server.com/api/datafileUpdated`
2. When changes are published in Optimizely, the webhook notifies the backend
3. The backend fetches the latest datafile from Optimizely's CDN and reinitializes the SDK
4. All connected iOS clients are notified via WebSocket to refresh their feature flags

This is the most efficient approach—no polling overhead, near-instant propagation.

#### Polling Mode (Useful for Local Development)

Set `POLLING_INTERVAL=1000` (or any positive number in milliseconds):

1. The backend polls Optimizely's CDN at the specified interval
2. When a datafile revision change is detected, the SDK is reinitialized
3. All connected iOS clients are notified via WebSocket to refresh their feature flags
4. Webhook requests are ignored when polling is enabled

Use this for local development when webhooks aren't reachable.

### Real-Time Updates to iOS App

The iOS app receives feature flag updates in real-time via WebSocket:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Optimizely    │  ──►    │  Backend :4001  │  ──►    │   iOS App       │
│   (Webhook or   │         │  (Detects       │         │  (WebSocket     │
│    CDN Poll)    │         │   change)       │         │   listener)     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                    │
                                    ▼
                            WebSocket broadcast
                            { type: "datafile_updated" }
```

1. **Backend receives update** - Either via webhook POST or by detecting a revision change during polling
2. **WebSocket broadcast** - Backend sends `datafile_updated` message to all connected clients
3. **iOS refreshes** - The app's `WebSocketService` receives the message and posts a `datafileDidUpdate` notification
4. **UI updates** - Views listening for `datafileDidUpdate` re-fetch their feature decisions from the backend API

## Project Structure

```
venuebit-demo/
├── VenueBitApp/           # iOS Xcode project (Swift/SwiftUI)
│   └── VenueBitApp/
│       ├── App/           # App entry point and configuration
│       ├── Components/    # Reusable UI components
│       ├── Core/          # Networking, Optimizely integration
│       ├── Features/      # Feature modules (Events, Tickets, etc.)
│       └── Resources/     # Assets and images
├── webapp/                # React web application (Vite + Tailwind)
│   └── src/
│       ├── api/           # API client for backend
│       ├── components/    # React components
│       ├── hooks/         # Custom React hooks
│       ├── optimizely/    # Optimizely JS SDK integration
│       ├── pages/         # Page components
│       └── theme/         # Theme configuration
├── backend/               # Express.js API server
│   └── src/
│       ├── data/          # Mock event and venue data
│       ├── routes/        # API route handlers
│       ├── services/      # Optimizely service, business logic
│       └── types/         # TypeScript type definitions
└── docker-compose.yml     # Docker orchestration
```

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Xcode 15+ (for iOS app)
- Optimizely Feature Experimentation account

### 1. Clone and Install

```bash
git clone https://github.com/theodorecharles/venuebit-demo.git
cd venuebit-demo
npm install
```

### 2. Configure Your SDK Key

```bash
npm run config
```

This will prompt you for your Optimizely SDK key and create a `.env` file with 1-second polling for real-time updates.

### 3. Start the Demo

```bash
npm run start
```

- Web App: http://localhost:4000
- Backend API: http://localhost:4001

### 4. Run iOS App (Optional)

1. Open `VenueBitApp/` folder in Xcode
2. Select a simulator and run (Cmd+R)

### Other Commands

| Command | Description |
|---------|-------------|
| `npm run stop` | Stop all containers |
| `npm run logs` | View container logs |
| `npm run rebuild` | Rebuild containers from scratch |
| `npm run clean` | Remove containers and images |

---

## Optimizely Setup

Create the following feature flags in your Optimizely project:

#### App Theme (`app_theme`)

Controls the app's color theme in real-time.

- **Feature Key**: `app_theme`
- **Variations**: `off`, `black`, `dark`, `beige`, `light`
- **Variables**: None (the variation key itself determines the theme)

| Variation | Description |
|-----------|-------------|
| `off` | Default system theme |
| `black` | Dark theme with pure black background |
| `dark` | Dark theme with dark gray background |
| `beige` | Light theme with warm beige tones |
| `light` | Light theme with white background |

#### Homescreen Configuration (`venuebit_homescreen`)

Controls the layout and modules displayed on the homescreen.

- **Feature Key**: `venuebit_homescreen`
- **Variations**: `off`, `on` (or custom variation names)
- **Variables**:
  - `homescreen_configuration` (JSON): Array of module configurations

Example `homescreen_configuration` value:

```json
{"modules":[
  {
    "module": "hero_carousel",
    "config": {
      "categories": ["concerts", "sports", "theater", "comedy"],
      "length": 10
    }
  },
  {
    "module": "categories",
    "config": {
      "categories": ["concerts", "sports", "theater", "comedy"]
    }
  },
  {
    "module": "trending_now",
    "config": {
      "categories": ["concerts", "sports", "theater", "comedy"],
      "length": 10
    }
  },
  {
    "module": "this_weekend",
    "config": {
      "categories": ["concerts", "sports", "theater", "comedy"],
      "length": 10
    }
  },
  {
    "module": "all_events",
    "config": {
      "sortBy": "date_asc",
      "categories": ["concerts", "sports", "theater", "comedy"],
      "length": 10
    }
  }
]}
```

Available module types: `hero_carousel`, `categories`, `trending_now`, `this_weekend`, `all_events`

---

## Remote Deployment

The app supports connecting to a remote server instead of localhost:

### iOS App Configuration

1. Open the VenueBit app and go to the **Settings** tab
2. Scroll to the bottom and enter your server address (e.g., `venuebit.example.com`)
3. The app will use HTTPS and omit port numbers for remote servers

### Server Requirements

When deploying remotely, configure your reverse proxy (nginx) to:

- Route `/api/*` requests to the backend (port 4001)
- Route `/images/*` requests to the backend (port 4001)
- Route all other requests to the webapp (port 4000)
- Enable HTTPS with valid certificates

### Webhook Configuration

To enable real-time datafile updates:

1. In Optimizely, go to **Settings** → **Webhooks**
2. Add a webhook URL: `https://your-server.com/api/datafileUpdated`
3. Select "Datafile updated" as the trigger event

## Key Demo Features

- **Generate New User ID Button** - Demonstrates how different user IDs get bucketed into different variations
- **Debug Panel** - Shows current user ID, variation assignment, and feature variables
- **Visual Variation Differences** - Control vs Enhanced experiences with visible UI changes
- **Cross-Platform Consistency** - Same user sees same variation in native, web, and API responses

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
| `/api/homescreen/:userId` | GET | Get homescreen configuration |
| `/api/track` | POST | Track analytics event |
| `/api/datafileUpdated` | POST | Webhook for Optimizely datafile updates |
| `/api/health` | GET | Health check endpoint |

## Tracked Events

| Event | Description |
|-------|-------------|
| `page_view` | Page/screen viewed |
| `search` | Search performed |
| `add_to_cart` | Tickets added to cart |
| `checkout` | Checkout initiated |
| `purchase` | Purchase completed (with revenue) |

## Demo Script

1. **Show the app** - Browse events on the homescreen, demonstrate the UI
2. **Change theme in Optimizely** - Update the `app_theme` flag to a different variation (e.g., `dark` or `beige`)
3. **Watch the app update** - The theme changes in real-time via WebSocket
4. **Modify homescreen layout** - Change the `venuebit_homescreen` configuration to show different modules
5. **Generate New User ID** - Tap the button in Settings to get a new user and potentially different variations
6. **Check consistency** - Same user ID = same variation everywhere

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
