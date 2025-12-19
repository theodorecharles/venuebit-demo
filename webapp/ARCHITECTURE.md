# VenueBit WebApp - Architecture Documentation

## Application Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / WebView                     │
├─────────────────────────────────────────────────────────┤
│                      React App                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │         OptimizelyProvider (User Context)          │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │          React Router (BrowserRouter)        │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │          Page Components              │  │  │  │
│  │  │  │  - SeatSelectionPage                  │  │  │  │
│  │  │  │  - CheckoutPage                       │  │  │  │
│  │  │  │  - ConfirmationPage                   │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  State Management (Zustand)                             │
│  - User Store (userId)                                  │
│  - Cart Store (cart, cartId)                            │
├─────────────────────────────────────────────────────────┤
│  API Layer (Axios)                                       │
│  - Events API                                            │
│  - Cart API                                              │
│  - Checkout API                                          │
└─────────────────────────────────────────────────────────┘
         │                           │
         ↓                           ↓
┌──────────────────┐      ┌──────────────────────┐
│  Backend API     │      │  Optimizely Service  │
│  (Port 4001)     │      │  (Feature Flags)     │
└──────────────────┘      └──────────────────────┘
```

## Component Hierarchy

### SeatSelectionPage

```
SeatSelectionPage
├── DebugBanner
│   └── VariationBadge
├── (if isEnhanced) UrgencyBanner
├── SeatMap
│   ├── SeatLegend
│   ├── VenueSection (multiple)
│   └── SeatGrid
│       ├── Seat (multiple)
│       └── (stage indicator)
├── SelectedSeats (sidebar)
│   └── Card
│       ├── Selected seat items
│       └── Price summary
├── (if isEnhanced) SimilarSeats
│   └── Card
│       └── Recommended seat items
├── Button (Add to Cart)
└── (if isEnhanced && hovering) SeatPreview
```

### CheckoutPage

```
CheckoutPage
├── DebugBanner
│   └── VariationBadge
├── (if isEnhanced) Urgency Message Banner
├── OrderSummary
│   └── Card
│       ├── Event details
│       └── TicketList
├── PaymentForm
│   └── Card
│       ├── Contact Information Section
│       │   ├── (if isEnhanced) Collapsible header
│       │   └── Form fields (email, name)
│       ├── Payment Details Section
│       │   ├── (if isEnhanced) Collapsible header
│       │   └── Form fields (card, expiry, CVV)
│       └── Submit button
└── PriceBreakdown (sidebar)
    └── Card
        ├── Subtotal
        ├── Service Fee
        └── Total
```

### ConfirmationPage

```
ConfirmationPage
├── DebugBanner
│   └── VariationBadge
└── Confirmation
    └── Card
        ├── Success icon
        ├── Congratulations message
        ├── Order number
        ├── Event details
        ├── Ticket list
        ├── Price breakdown
        └── Button (Return to App)
```

## Data Flow

### 1. Initial Load

```
User opens /seats/:eventId?userId=xxx
    ↓
useUserId hook extracts userId from URL
    ↓
User store updated with userId
    ↓
OptimizelyWrapper receives userId
    ↓
Optimizely bucketing decision made
    ↓
useFeatureFlag returns variation
    ↓
Components render with variation logic
    ↓
useTracking sends page_view event
```

### 2. Seat Selection Flow

```
User clicks section
    ↓
SeatMap fetches seats for section
    ↓
User clicks individual seats
    ↓
Local state updates (selectedSeats)
    ↓
SelectedSeats component re-renders
    ↓
Price calculations update
    ↓
User clicks "Add to Cart"
    ↓
API: Create cart (POST /carts)
    ↓
API: Add seats (POST /carts/:id/items)
    ↓
Cart store updated
    ↓
useTracking sends add_to_cart event
    ↓
Navigate to /checkout
```

### 3. Checkout Flow

```
CheckoutPage loads
    ↓
Fetch cart from API (GET /carts/:id)
    ↓
Fetch event details (GET /events/:id)
    ↓
useTracking sends checkout event
    ↓
User fills payment form
    ↓
User clicks "Complete Purchase"
    ↓
API: Create order (POST /checkout)
    ↓
useTracking sends purchase event (with revenue)
    ↓
Navigate to /confirmation/:orderId
```

### 4. Confirmation Flow

```
ConfirmationPage loads
    ↓
Fetch order details (GET /orders/:id)
    ↓
useTracking sends page_view event
    ↓
useNativeBridge sends purchase_complete
    ↓
User clicks "Return to App"
    ↓
useNativeBridge sends close_webview
    ↓
(Fallback) Redirect to home
```

## State Management

### User Store (Zustand)

```typescript
{
  userId: string | null,
  setUserId: (userId: string) => void,
  clearUserId: () => void
}
```

**Persistence**: localStorage key `venuebit-user`

**Usage**:
- Extract from URL on page load
- Used for Optimizely bucketing
- Passed to all API calls
- Displayed in debug banner

### Cart Store (Zustand)

```typescript
{
  cart: Cart | null,
  cartId: string | null,
  setCart: (cart: Cart) => void,
  setCartId: (cartId: string) => void,
  clearCart: () => void
}
```

**Persistence**: localStorage key `venuebit-cart`

**Usage**:
- Created when adding first seats
- Passed to checkout
- Cleared after successful order

## API Client Architecture

### Client Configuration

```typescript
// Base client with interceptors
apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor
- Add auth headers (if needed)
- Log requests (dev mode)

// Response interceptor
- Handle errors globally
- Transform responses
- Log errors
```

### API Modules

**Events API**:
- `getEvent(id)` - Event details
- `getEvents()` - All events
- `getSections(eventId)` - Venue sections
- `getSeats(eventId, sectionId?)` - Available seats
- `reserveSeats(eventId, seatIds, userId)` - Temporary hold

**Cart API**:
- `createCart(userId, eventId)` - New cart
- `getCart(cartId)` - Cart details
- `addToCart(cartId, seatIds)` - Add seats
- `removeFromCart(cartId, seatId)` - Remove seat
- `clearCart(cartId)` - Delete cart

**Checkout API**:
- `checkout(cartId, userId, payment)` - Create order
- `getOrder(orderId)` - Order details
- `getUserOrders(userId)` - User's orders

## Optimizely Integration

### SDK Initialization

```
createInstance({
  sdkKey: VITE_OPTIMIZELY_SDK_KEY,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 300000 // 5 minutes
  }
})
```

### Bucketing Logic

```
User ID → Hash → Bucket → Variation
```

**Consistent**: Same user always gets same variation

### Event Tracking

```typescript
track(eventName, userId?, tags?)
```

**Events**:
1. `page_view` - All pages
2. `add_to_cart` - Seat selection complete
3. `checkout` - Checkout page view
4. `purchase` - Order complete (revenue tag)

## Hook Architecture

### useUserId

```typescript
// Extracts userId from URL query param
// Updates user store
// Returns current userId
```

**URL Format**: `?userId=xxx-xxx-xxx-xxx`

### useFeatureFlag

```typescript
// Wraps Optimizely useDecision
// Returns: { variation, isEnhanced, isControl, enabled }
```

**Usage**: Conditional rendering based on variation

### useTracking

```typescript
// Wraps Optimizely track
// Provides typed tracking methods
// Returns: { trackPageView, trackAddToCart, trackCheckout, trackPurchase }
```

**Usage**: Track user actions for analytics

### useNativeBridge

```typescript
// Communicates with iOS WKWebView
// Returns: { handlePurchaseComplete, handleCloseWebView, sendCustomMessage }
```

**Usage**: Native app integration

## Routing Structure

```
BrowserRouter
├── Route: /seats/:eventId → SeatSelectionPage
├── Route: /checkout → CheckoutPage
├── Route: /confirmation/:orderId → ConfirmationPage
└── Route: / → Navigate to /seats/event-001
```

**Query Params**:
- All routes: `?userId=xxx` (required)
- Checkout: `?userId=xxx&cartId=xxx` (both required)

## CSS Architecture

### Tailwind Configuration

```javascript
theme: {
  extend: {
    colors: {
      primary: '#6366F1',
      secondary: '#EC4899',
      success: '#10B981',
      // ... more colors
    }
  }
}
```

### Custom CSS Classes

```css
.btn - Base button styles
.btn-primary - Primary button variant
.btn-secondary - Secondary button variant
.btn-outline - Outline button variant
.card - Card container
.input - Form input
.label - Form label
```

### Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Usage**: Mobile-first with lg/md breakpoints

## Performance Considerations

### Code Splitting

- React Router automatic code splitting
- Routes loaded on demand
- Shared chunks for common code

### Re-render Optimization

**Current**: Standard React rendering
**Potential**: Add React.memo to expensive components

### State Updates

- Zustand: Minimal re-renders (subscribe to specific fields)
- Local state: Component-level, no prop drilling
- URL state: React Router manages

### API Optimization

- Axios timeout: 15s
- Error handling: Graceful fallbacks
- Loading states: User feedback

## Type System

### Core Types

```typescript
Event - Event details and metadata
Section - Venue section with pricing
Seat - Individual seat with status
Cart - Shopping cart with items
CartItem - Seat in cart
Order - Completed purchase
OrderTicket - Ticket in order
```

### API Types

```typescript
GetSeatsParams - Seat query params
CreateCartRequest - Cart creation
AddToCartRequest - Add seats to cart
CheckoutRequest - Order creation
```

### Feature Types

```typescript
VariationType - "control" | "enhanced"
PaymentFormData - Form data structure
```

## Security Considerations

### Environment Variables

- Never commit `.env` file
- Use `.env.example` for template
- Prefix with `VITE_` for client exposure

### API Communication

- HTTPS in production
- CORS handling on backend
- No sensitive data in URL params (except userId)

### Payment Form

- Mock data only (not real payment processing)
- No card data sent to backend in this demo
- Pre-filled test card for demonstrations

## Deployment Architecture

### Development

```
Vite Dev Server (Port 4000)
- Hot Module Replacement
- Fast refresh
- Source maps
```

### Production

```
npm run build
    ↓
Vite builds to dist/
    ↓
Static files: HTML, CSS, JS
    ↓
Deploy to CDN / Static hosting
    ↓
Nginx / Apache / Vercel / Netlify
```

### Docker

```
Node 20 Alpine
    ↓
npm install
    ↓
Copy source files
    ↓
Expose port 4000
    ↓
npm run dev (with --host 0.0.0.0)
```

## Error Handling

### API Errors

```typescript
try {
  await api.call()
} catch (error) {
  console.error('Error:', error)
  alert('User-friendly message')
  // Fallback behavior
}
```

### Loading States

- `loading` state variable
- `<Loading />` component
- Disabled buttons during actions

### Not Found Handling

- Event not found → Show message
- Cart not found → Redirect home
- Order not found → Show error

## Testing Strategy

### Unit Tests (Recommended)

- Components: Render, props, events
- Hooks: State updates, side effects
- Utils: Pure function logic
- API: Mock responses

### Integration Tests (Recommended)

- Page flows: Seat selection → Checkout
- API integration: Real endpoints
- State management: Store updates

### E2E Tests (Recommended)

- Complete purchase flow
- Variation differences
- Native bridge calls

## Future Enhancements

### Performance

- [ ] React.memo for expensive components
- [ ] useMemo for calculations
- [ ] useCallback for handlers
- [ ] Virtual scrolling for large seat lists

### Features

- [ ] Real-time seat updates (WebSocket)
- [ ] Seat hold timer
- [ ] Multiple ticket types
- [ ] Discount codes
- [ ] Social sharing

### Developer Experience

- [ ] Storybook for components
- [ ] Jest + React Testing Library
- [ ] Playwright E2E tests
- [ ] ESLint + Prettier
- [ ] Husky pre-commit hooks

### Production

- [ ] Error boundary components
- [ ] Sentry error tracking
- [ ] Analytics (GA4, Segment)
- [ ] A/B test result dashboard
- [ ] Performance monitoring
