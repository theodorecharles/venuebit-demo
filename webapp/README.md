# VenueBit Web Application

A complete React + TypeScript + Vite + Tailwind web application for the VenueBit demo with Optimizely feature experimentation.

## Features

- **Seat Selection**: Interactive seat map with section and individual seat selection
- **A/B Testing**: Optimizely-powered feature flags with two variations:
  - **Control**: Standard ticket purchasing experience
  - **Enhanced**: Premium experience with urgency banners, seat previews, and recommendations
- **Checkout**: Complete payment flow with mock payment processing
- **Order Confirmation**: Success page with native app integration
- **Debug Tools**: User ID management and variation visibility

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **Optimizely React SDK** - Feature experimentation
- **Axios** - HTTP client

## Prerequisites

- Node.js 20+
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
VITE_OPTIMIZELY_SDK_KEY=your_optimizely_sdk_key
VITE_API_BASE_URL=http://localhost:4001/api
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:4000

## Docker

Build and run with Docker:

```bash
docker build -t venuebit-webapp .
docker run -p 4000:4000 venuebit-webapp
```

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # React components
│   ├── common/       # Reusable components
│   ├── debug/        # Debug tools
│   ├── seats/        # Seat selection components
│   └── checkout/     # Checkout components
├── hooks/            # Custom React hooks
├── optimizely/       # Optimizely configuration
├── pages/            # Page components
├── store/            # Zustand stores
├── types/            # TypeScript types
├── utils/            # Utility functions
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Feature Variations

### Control Variation
- Standard seat map
- Basic checkout form (all fields visible)
- Standard confirmation

### Enhanced Variation
- **Urgency Banner**: "Only X seats left at this price!"
- **Seat Preview**: Hover over seats to see simulated view
- **Similar Seats**: AI-powered seat recommendations
- **Streamlined Checkout**: Collapsible form sections
- **Urgency Messaging**: Time-sensitive purchase prompts

## Pages

### Seat Selection (`/seats/:eventId`)
- Event details header
- Interactive seat map with section selection
- Selected seats panel
- Real-time price calculation
- Add to cart functionality

### Checkout (`/checkout?userId=xxx&cartId=xxx`)
- Order summary
- Payment form (pre-filled test data)
- Price breakdown with service fees
- Complete purchase

### Confirmation (`/confirmation/:orderId?userId=xxx`)
- Success message
- Order details
- Ticket information
- Return to app (native bridge)

## Debug Features

All pages include a debug banner with:
- Current User ID
- Active variation (Control/Enhanced)
- "New User ID" button to test different variations

## API Integration

The app expects a backend API at `http://localhost:4001/api` with these endpoints:

- `GET /events/:id` - Get event details
- `GET /events/:id/sections` - Get event sections
- `GET /events/:id/seats` - Get available seats
- `POST /carts` - Create cart
- `GET /carts/:id` - Get cart
- `POST /carts/:id/items` - Add seats to cart
- `POST /checkout` - Complete purchase
- `GET /orders/:id` - Get order details

## Native Bridge

The app includes iOS WKWebView bridge functionality:

```typescript
// Notify purchase complete
notifyPurchaseComplete(orderId, total);

// Request close webview
requestCloseWebView();

// Send custom message
sendToNative('action', data);
```

## Color Palette

- Primary: #6366F1 (Indigo-500)
- Secondary: #EC4899 (Pink-500)
- Success: #10B981 (Emerald-500)
- Warning: #F59E0B (Amber-500)
- Error: #EF4444 (Red-500)
- Background: #0F172A (Slate-900)
- Surface: #1E293B (Slate-800)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Development Notes

- The app uses mock data for demonstrations
- Test credit card: 4242 4242 4242 4242
- All prices are in USD
- Service fee is calculated at 15% of subtotal
