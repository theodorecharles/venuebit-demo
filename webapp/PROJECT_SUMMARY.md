# VenueBit WebApp - Project Summary

## Overview

Complete React web application for ticket purchasing with Optimizely A/B testing integration. Built with React, TypeScript, Vite, and Tailwind CSS.

## Key Features

### 1. A/B Testing with Optimizely
- **Control Variation**: Standard ticket purchasing experience
- **Enhanced Variation**: Premium features including:
  - Urgency banners ("Only X seats left!")
  - Seat preview on hover
  - Similar seat recommendations
  - Streamlined checkout with collapsible sections
  - Time-sensitive purchase prompts

### 2. Complete Ticket Purchasing Flow
1. **Seat Selection** - Browse sections and select seats
2. **Cart Management** - Add/remove seats with real-time pricing
3. **Checkout** - Payment form with mock processing
4. **Confirmation** - Order details and native app integration

### 3. Debug Tools
- Persistent debug banner on all pages
- User ID display and management
- Variation badge (Control/Enhanced)
- "New User ID" button for testing different variations

### 4. Native App Integration
- iOS WKWebView message bridge
- Purchase completion notifications
- Webview close requests

## Project Structure

```
webapp/
├── src/
│   ├── api/                    # API client and endpoints
│   │   ├── client.ts           # Axios instance
│   │   ├── events.ts           # Event/seat endpoints
│   │   ├── cart.ts             # Cart management
│   │   └── checkout.ts         # Order processing
│   │
│   ├── components/
│   │   ├── common/             # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── PriceDisplay.tsx
│   │   │
│   │   ├── debug/              # Debug tools
│   │   │   ├── DebugBanner.tsx
│   │   │   └── VariationBadge.tsx
│   │   │
│   │   ├── seats/              # Seat selection
│   │   │   ├── SeatMap.tsx
│   │   │   ├── VenueSection.tsx
│   │   │   ├── SeatGrid.tsx
│   │   │   ├── Seat.tsx
│   │   │   ├── SeatLegend.tsx
│   │   │   ├── SelectedSeats.tsx
│   │   │   ├── SeatPreview.tsx      # Enhanced only
│   │   │   ├── SimilarSeats.tsx     # Enhanced only
│   │   │   └── UrgencyBanner.tsx    # Enhanced only
│   │   │
│   │   └── checkout/           # Checkout flow
│   │       ├── OrderSummary.tsx
│   │       ├── TicketList.tsx
│   │       ├── PriceBreakdown.tsx
│   │       ├── PaymentForm.tsx
│   │       └── Confirmation.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useUserId.ts        # URL param extraction
│   │   ├── useFeatureFlag.ts   # Optimizely wrapper
│   │   ├── useTracking.ts      # Event tracking
│   │   └── useNativeBridge.ts  # iOS communication
│   │
│   ├── optimizely/             # Optimizely config
│   │   ├── client.ts
│   │   ├── features.ts
│   │   └── OptimizelyWrapper.tsx
│   │
│   ├── pages/                  # Route components
│   │   ├── SeatSelectionPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   └── ConfirmationPage.tsx
│   │
│   ├── store/                  # Zustand stores
│   │   ├── userStore.ts
│   │   └── cartStore.ts
│   │
│   ├── types/                  # TypeScript types
│   │   ├── event.ts
│   │   ├── seat.ts
│   │   ├── cart.ts
│   │   └── order.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── formatters.ts
│   │   └── nativeBridge.ts
│   │
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   └── vite-env.d.ts          # Vite types
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── Dockerfile
├── .env.example
└── README.md
```

## Technical Decisions

### State Management
- **Zustand**: Lightweight state management for user and cart data
- **Persistent storage**: User ID and cart ID saved to localStorage
- **URL params**: User ID passed via query string for sharing

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Dark theme**: Slate-based color palette
- **Custom components**: Reusable button, card, and input styles
- **Responsive**: Mobile-first design with lg/md breakpoints

### Type Safety
- **TypeScript**: Full type coverage across the application
- **Strict mode**: Enabled for maximum safety
- **Interface definitions**: Clear contracts for all data structures

### API Integration
- **Axios**: HTTP client with interceptors
- **Error handling**: Graceful fallbacks and user feedback
- **Base URL**: Configurable via environment variables

### Feature Flags
- **Optimizely React SDK**: Official integration
- **User-based bucketing**: Consistent experience per user
- **Auto-update**: Datafile refreshes every 5 minutes
- **Event tracking**: Page views, cart actions, purchases

## Component Highlights

### SeatMap
- Hierarchical navigation: Sections → Seats
- Visual grid layout with row/seat indicators
- Real-time availability updates
- Color-coded seat status

### Enhanced Features
All conditional on `isEnhanced` flag:

1. **UrgencyBanner**: Animated, shows limited availability
2. **SeatPreview**: Fixed position hover card with simulated view
3. **SimilarSeats**: AI-style recommendations with savings badges

### PaymentForm
- Pre-filled test data for demos
- Validation on all fields
- Collapsible sections in enhanced variation
- Mock payment processing

### DebugBanner
- Sticky top position
- Monospace user ID display
- Color-coded variation badge
- UUID generation for new users

## Data Flow

1. **User arrives** → URL param parsed → User store updated
2. **Optimizely loads** → User bucketed into variation
3. **Seat selection** → Local state → Add to cart
4. **Create cart** → API call → Cart store updated
5. **Checkout** → Payment form → Order created
6. **Confirmation** → Native bridge notified → Order displayed

## Environment Variables

```
VITE_OPTIMIZELY_SDK_KEY=your_sdk_key_here
VITE_API_BASE_URL=http://localhost:4001/api
```

## Test Data

- **Event ID**: event-001 (default route)
- **Credit Card**: 4242 4242 4242 4242
- **Expiry**: Any future date (12/25)
- **CVV**: Any 3 digits (123)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Code splitting via React Router
- Lazy loading of routes (can be added)
- Optimized re-renders with React.memo (can be added)
- Zustand's minimal bundle size
- Vite's fast HMR

## Future Enhancements

Potential additions (not implemented):
- Real-time seat updates via WebSocket
- Seat hold timer/countdown
- Multiple ticket types (VIP, GA, etc.)
- Discount codes
- Social sharing
- Calendar integration
- Print tickets
- QR codes

## Testing Recommendations

1. **Unit tests**: Component logic with Jest/Vitest
2. **Integration tests**: API interactions with MSW
3. **E2E tests**: User flows with Playwright/Cypress
4. **A/B test validation**: Variation rendering
5. **Mobile testing**: iOS Safari, Chrome Mobile

## Deployment

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
# Outputs to dist/
```

### Docker
```bash
docker build -t venuebit-webapp .
docker run -p 4000:4000 venuebit-webapp
```

### Environment Setup
- Set Optimizely SDK key in `.env`
- Configure API base URL
- Ensure backend is running on port 4001

## Success Metrics

Track these via Optimizely:
- **Conversion rate**: Checkout completion
- **Cart abandonment**: Users who add but don't purchase
- **Seat selection time**: Time to choose seats
- **Average order value**: Revenue per transaction
- **Feature engagement**: Preview/recommendation clicks

## Variation Differences Summary

| Feature | Control | Enhanced |
|---------|---------|----------|
| Urgency Banner | ❌ | ✅ |
| Seat Preview | ❌ | ✅ |
| Similar Seats | ❌ | ✅ |
| Checkout Layout | Standard | Collapsible |
| Urgency Messages | ❌ | ✅ |

## Key Files to Review

1. **src/pages/SeatSelectionPage.tsx** - Main seat selection logic
2. **src/components/seats/SeatMap.tsx** - Seat map implementation
3. **src/hooks/useFeatureFlag.ts** - Variation determination
4. **src/optimizely/OptimizelyWrapper.tsx** - SDK integration
5. **src/components/debug/DebugBanner.tsx** - Debug tools
