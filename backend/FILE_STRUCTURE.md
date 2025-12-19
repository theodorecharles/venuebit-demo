# VenueBit Backend - File Structure

Complete directory structure with file descriptions.

```
backend/
│
├── src/
│   ├── types/                          # TypeScript type definitions
│   │   ├── venue.ts                    # Venue interface (id, name, city, capacity, type)
│   │   ├── event.ts                    # Event interface and EventCategory type
│   │   ├── seat.ts                     # Seat interface and SeatStatus type
│   │   ├── cart.ts                     # Cart and CartItem interfaces
│   │   └── order.ts                    # Order, OrderItem, and PaymentInfo interfaces
│   │
│   ├── data/                           # Mock data layer
│   │   ├── venues.ts                   # 6 venues with full details
│   │   ├── events.ts                   # 12 events with descriptions, prices
│   │   └── seats.ts                    # Dynamic seat generator + seat management
│   │
│   ├── services/                       # Business logic layer
│   │   ├── optimizelyService.ts        # Optimizely SDK init, decisions, tracking
│   │   ├── eventService.ts             # Event filtering, search, seat retrieval
│   │   ├── cartService.ts              # Cart CRUD + seat reservation
│   │   └── orderService.ts             # Order creation + user order history
│   │
│   ├── routes/                         # API route handlers
│   │   ├── index.ts                    # Route aggregation + health endpoint
│   │   ├── events.ts                   # GET /events, /events/:id, /events/:id/seats
│   │   ├── search.ts                   # GET /search?q=query
│   │   ├── cart.ts                     # POST/GET/DELETE cart operations
│   │   ├── checkout.ts                 # POST /checkout
│   │   ├── orders.ts                   # GET /orders/:id, /users/:userId/orders
│   │   ├── features.ts                 # GET /features/:userId (Optimizely)
│   │   └── track.ts                    # POST /track (Optimizely events)
│   │
│   ├── utils/                          # Utility functions
│   │   ├── generateId.ts               # UUID generators for cart, order, items
│   │   └── pricing.ts                  # Pricing calculation (15% + $5)
│   │
│   ├── config.ts                       # Environment configuration (port, SDK key)
│   ├── app.ts                          # Express app setup (CORS, middleware, routes)
│   └── index.ts                        # Server entry point (initialization, startup)
│
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript compiler configuration
├── nodemon.json                        # Nodemon configuration for dev server
├── Dockerfile                          # Docker container (Node 20 Alpine)
├── .env.example                        # Environment variable template
├── .gitignore                          # Git ignore rules
│
├── README.md                           # Complete setup and usage guide
├── API_EXAMPLES.md                     # API testing with curl examples
├── IMPLEMENTATION_SUMMARY.md           # Implementation details and status
├── CHANGELOG.md                        # Version history and changes
├── FILE_STRUCTURE.md                   # This file
└── start.sh                            # Quick start script

```

## File Count Summary

- **TypeScript Source Files**: 25
- **Configuration Files**: 6
- **Documentation Files**: 6
- **Scripts**: 1

**Total**: 38 files

## Lines of Code (Approximate)

| Category | Files | Lines |
|----------|-------|-------|
| Types | 5 | ~100 |
| Data | 3 | ~300 |
| Services | 4 | ~350 |
| Routes | 8 | ~400 |
| Utils | 2 | ~50 |
| Core | 3 | ~150 |
| Config | 6 | ~150 |
| Docs | 6 | ~1,500 |
| **Total** | **37** | **~3,000** |

## File Sizes (Approximate)

| File Type | Count | Average Size | Total Size |
|-----------|-------|--------------|------------|
| TypeScript | 25 | 1-2 KB | ~40 KB |
| JSON Config | 3 | 0.5 KB | ~1.5 KB |
| Docker/Shell | 2 | 0.2 KB | ~0.4 KB |
| Markdown Docs | 6 | 5 KB | ~30 KB |
| **Total** | **36** | - | **~72 KB** |

## Key File Descriptions

### Configuration

| File | Purpose | Key Contents |
|------|---------|--------------|
| `package.json` | npm package configuration | Dependencies, scripts, metadata |
| `tsconfig.json` | TypeScript compiler options | Strict mode, ES2020 target, module config |
| `nodemon.json` | Development server config | Watch patterns, restart settings |
| `Dockerfile` | Container definition | Node 20 Alpine, port 4001 |
| `.env.example` | Environment template | PORT, OPTIMIZELY_SDK_KEY, NODE_ENV |
| `.gitignore` | Git ignore rules | node_modules, dist, .env |

### Types (src/types/)

| File | Exports | Purpose |
|------|---------|---------|
| `venue.ts` | Venue, VenueType | Venue entity and type enum |
| `event.ts` | Event, EventCategory | Event entity and category enum |
| `seat.ts` | Seat, SeatStatus | Seat entity and status enum |
| `cart.ts` | Cart, CartItem | Shopping cart entities |
| `order.ts` | Order, OrderItem, PaymentInfo | Order and payment entities |

### Data (src/data/)

| File | Exports | Purpose |
|------|---------|---------|
| `venues.ts` | venues[], getVenueById() | 6 venue records |
| `events.ts` | events[], getEventById(), searchEvents() | 12 event records + search |
| `seats.ts` | generateSeatsForEvent(), seat management | Dynamic seat generation + CRUD |

### Services (src/services/)

| File | Key Functions | Purpose |
|------|---------------|---------|
| `optimizelyService.ts` | initializeOptimizely(), getFeatureDecisions(), trackEvent() | Optimizely integration |
| `eventService.ts` | getEvents(), getEvent(), getEventSeats(), searchEventsService() | Event business logic |
| `cartService.ts` | createCart(), getCart(), addItemToCart(), removeItemFromCart() | Cart management |
| `orderService.ts` | createOrder(), getOrder(), getUserOrders() | Order processing |

### Routes (src/routes/)

| File | Endpoints | Methods |
|------|-----------|---------|
| `events.ts` | /events, /events/:id, /events/:id/seats | GET |
| `search.ts` | /search | GET |
| `cart.ts` | /cart, /cart/:id, /cart/:id/items, /cart/:id/items/:itemId | POST, GET, DELETE |
| `checkout.ts` | /checkout | POST |
| `orders.ts` | /orders/:id, /users/:userId/orders | GET |
| `features.ts` | /features/:userId | GET |
| `track.ts` | /track | POST |
| `index.ts` | /health | GET |

### Utils (src/utils/)

| File | Exports | Purpose |
|------|---------|---------|
| `generateId.ts` | generateCartId(), generateOrderId(), generateCartItemId() | UUID generation |
| `pricing.ts` | calculatePricing(), PricingBreakdown | Pricing calculations |

### Core (src/)

| File | Purpose |
|------|---------|
| `config.ts` | Environment variable configuration |
| `app.ts` | Express app setup with middleware |
| `index.ts` | Server initialization and startup |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Setup, usage, and API overview |
| `API_EXAMPLES.md` | Curl command examples for all endpoints |
| `IMPLEMENTATION_SUMMARY.md` | Complete implementation details |
| `CHANGELOG.md` | Version history and features |
| `FILE_STRUCTURE.md` | This file - directory structure |

### Scripts

| File | Purpose |
|------|---------|
| `start.sh` | Quick start script (install + run) |

## Import Dependency Graph

```
index.ts
  └── app.ts
      └── routes/index.ts
          ├── routes/events.ts → services/eventService.ts → data/events.ts, data/seats.ts
          ├── routes/search.ts → services/eventService.ts
          ├── routes/cart.ts → services/cartService.ts → data/events.ts, data/seats.ts
          ├── routes/checkout.ts → services/orderService.ts → services/cartService.ts
          ├── routes/orders.ts → services/orderService.ts
          ├── routes/features.ts → services/optimizelyService.ts
          └── routes/track.ts → services/optimizelyService.ts

data/events.ts → types/event.ts, data/venues.ts
data/seats.ts → types/seat.ts, types/event.ts, data/venues.ts
data/venues.ts → types/venue.ts

services/eventService.ts → types/event.ts, data/events.ts, data/seats.ts
services/cartService.ts → types/cart.ts, data/events.ts, data/seats.ts
services/orderService.ts → types/order.ts, services/cartService.ts, utils/pricing.ts
services/optimizelyService.ts → @optimizely/optimizely-sdk
```

## Technology Stack

### Runtime
- Node.js 20 (LTS)
- Express.js 4.18.2

### Language
- TypeScript 5.3.3 (strict mode)

### Libraries
- @optimizely/optimizely-sdk 5.3.4
- cors 2.8.5
- uuid 9.0.1

### Development
- ts-node 10.9.2
- nodemon 3.0.3
- @types/* (TypeScript definitions)

## Architecture Pattern

```
┌─────────────────────────────────────────┐
│           Client (REST API)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Routes Layer                    │
│  - Request validation                   │
│  - Response formatting                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Services Layer                    │
│  - Business logic                       │
│  - Data transformation                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Data Layer                     │
│  - In-memory storage (Map)              │
│  - Mock data                            │
└─────────────────────────────────────────┘
```

## Notes

- All TypeScript files use strict mode
- No `any` types in the codebase
- All functions have return type annotations
- Consistent error handling across all routes
- In-memory storage (no database required)
- CORS enabled for all origins (demo purposes)

---

Last Updated: 2025-12-18
Version: 1.0.0
