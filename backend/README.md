# VenueBit Backend

Complete Express.js + TypeScript backend for the VenueBit demo app - a ticketing platform with Optimizely integration.

## Features

- **Complete REST API** with TypeScript type safety
- **12 Events** across 4 categories (concerts, sports, theater, comedy)
- **6 Venues** with realistic configurations (stadiums, arenas, theaters)
- **Dynamic Seat Generation** based on venue type (~70% availability)
- **Shopping Cart** with in-memory storage
- **Order Management** with pricing calculations
- **Optimizely Integration** for feature flags and experimentation
- **CORS Enabled** for local development

## Tech Stack

- **Node.js 20** (Alpine)
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Optimizely SDK** - Feature flags & experimentation
- **UUID** - ID generation
- **CORS** - Cross-origin support

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set your Optimizely SDK key (optional):

```
PORT=4001
OPTIMIZELY_SDK_KEY=your_sdk_key_here
NODE_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

Server will start on http://localhost:4001

### 4. Build for Production

```bash
npm run build
npm start
```

## Docker Deployment

```bash
docker build -t venuebit-backend .
docker run -p 4001:4001 -e OPTIMIZELY_SDK_KEY=your_key venuebit-backend
```

## API Endpoints

### Events

- `GET /api/events` - List all events (with filters)
  - Query params: `category`, `featured`, `limit`, `offset`
- `GET /api/events/:id` - Get single event
- `GET /api/events/:id/seats` - Get seats for event

### Search

- `GET /api/search?q=query` - Search events by title, performer, or venue

### Cart

- `POST /api/cart` - Create cart
  - Body: `{ userId: string }`
- `GET /api/cart/:cartId` - Get cart
- `POST /api/cart/:cartId/items` - Add seats to cart
  - Body: `{ eventId: string, seatIds: string[] }`
- `DELETE /api/cart/:cartId/items/:itemId` - Remove item from cart

### Checkout

- `POST /api/checkout` - Process purchase
  - Body: `{ cartId: string, userId: string, payment: { cardLast4: string } }`

### Orders

- `GET /api/orders/:orderId` - Get order details
- `GET /api/users/:userId/orders` - Get user's order history

### Features (Optimizely)

- `GET /api/features/:userId` - Get feature decisions for user

### Tracking (Optimizely)

- `POST /api/track` - Track event
  - Body: `{ userId: string, eventKey: string, tags?: object }`

### Health

- `GET /api/health` - Health check

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express app setup
│   ├── config.ts             # Environment configuration
│   ├── types/                # TypeScript type definitions
│   │   ├── event.ts
│   │   ├── venue.ts
│   │   ├── seat.ts
│   │   ├── cart.ts
│   │   └── order.ts
│   ├── data/                 # Mock data
│   │   ├── venues.ts         # 6 venues
│   │   ├── events.ts         # 12 events
│   │   └── seats.ts          # Seat generator
│   ├── services/             # Business logic
│   │   ├── optimizelyService.ts
│   │   ├── eventService.ts
│   │   ├── cartService.ts
│   │   └── orderService.ts
│   ├── routes/               # API routes
│   │   ├── index.ts
│   │   ├── events.ts
│   │   ├── search.ts
│   │   ├── cart.ts
│   │   ├── checkout.ts
│   │   ├── orders.ts
│   │   ├── features.ts
│   │   └── track.ts
│   └── utils/                # Utilities
│       ├── generateId.ts
│       └── pricing.ts
├── package.json
├── tsconfig.json
├── nodemon.json
├── Dockerfile
└── .env.example
```

## Mock Data

### Venues (6)

1. **SoFi Stadium** - Los Angeles, 70,000 capacity (stadium)
2. **Crypto.com Arena** - Los Angeles, 20,000 capacity (arena)
3. **Pantages Theatre** - Los Angeles, 2,700 capacity (theater)
4. **The Forum** - Los Angeles, 17,500 capacity (arena)
5. **Rose Bowl** - Pasadena, 90,000 capacity (stadium)
6. **Dodger Stadium** - Los Angeles, 56,000 capacity (stadium)

### Events (12)

1. **Taylor Swift - Eras Tour** (Concerts) - $99-$899
2. **Lakers vs Celtics** (Sports) - $150-$1,200
3. **Hamilton** (Theater) - $89-$399
4. **Kevin Hart Live** (Comedy) - $75-$250
5. **Coldplay - Music of the Spheres** (Concerts) - $79-$450
6. **Dodgers vs Yankees** (Sports) - $45-$500
7. **The Lion King** (Theater) - $79-$299
8. **Dave Chappelle** (Comedy) - $95-$350
9. **Bad Bunny - Most Wanted Tour** (Concerts) - $89-$599
10. **UFC 300** (Sports) - $200-$2,500
11. **Wicked** (Theater) - $69-$289
12. **John Mulaney** (Comedy) - $65-$195

### Seat Generation

Seats are dynamically generated based on venue type:

- **Stadium**: Floor (A-F, 20 seats), Lower 100s (A-Z, 30 seats), Upper 200s (A-Z, 35 seats)
- **Arena**: Floor (A-D, 15 seats), Lower 100s (A-R, 25 seats), Upper 200s (A-P, 30 seats)
- **Theater**: Orchestra (A-W, 40 seats), Mezzanine (A-H, 35 seats), Balcony (A-F, 30 seats)

~30% of seats are randomly marked as "sold" to simulate real availability.

## Pricing

- **Subtotal**: Sum of all seat prices
- **Service Fee**: 15% of subtotal
- **Processing Fee**: $5.00 flat
- **Total**: Subtotal + Service Fee + Processing Fee

## Optimizely Integration

### Feature Flag: `ticket_experience`

Variables:
- `show_seat_preview` (boolean)
- `show_recommendations` (boolean)
- `checkout_layout` (string: "standard" | "enhanced")
- `show_urgency_banner` (boolean)

### Track Events

Supported event keys:
- `page_view`
- `search`
- `add_to_cart`
- `checkout`
- `purchase`

## Development Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run start:dev` - Run with ts-node (no build)

## Notes

- All data is stored in-memory (resets on server restart)
- No database required - perfect for demos
- CORS is enabled for all origins (local development only)
- Optimizely SDK key is optional - defaults will be used if not provided

## License

MIT
