# VenueBit API - Usage Examples

Quick reference for testing the VenueBit backend API.

## Base URL

```
http://localhost:4001/api
```

## Example Requests

### 1. Get All Events

```bash
curl http://localhost:4001/api/events
```

### 2. Get Featured Events

```bash
curl http://localhost:4001/api/events?featured=true
```

### 3. Get Events by Category

```bash
curl http://localhost:4001/api/events?category=concerts
```

### 4. Get Single Event

```bash
curl http://localhost:4001/api/events/event-1
```

### 5. Get Seats for Event

```bash
curl http://localhost:4001/api/events/event-1/seats
```

### 6. Search Events

```bash
curl http://localhost:4001/api/search?q=taylor
```

### 7. Create Cart

```bash
curl -X POST http://localhost:4001/api/cart \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "cart-abc123",
    "userId": "user-123",
    "items": [],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 8. Add Seats to Cart

First, get seat IDs from the seats endpoint, then:

```bash
curl -X POST http://localhost:4001/api/cart/cart-abc123/items \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event-1",
    "seatIds": ["seat-id-1", "seat-id-2"]
  }'
```

### 9. Get Cart

```bash
curl http://localhost:4001/api/cart/cart-abc123
```

### 10. Remove Item from Cart

```bash
curl -X DELETE http://localhost:4001/api/cart/cart-abc123/items/item-xyz789
```

### 11. Checkout (Create Order)

```bash
curl -X POST http://localhost:4001/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "cart-abc123",
    "userId": "user-123",
    "payment": {
      "cardLast4": "4242"
    }
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "order-xyz789",
    "userId": "user-123",
    "items": [...],
    "subtotal": 500.00,
    "serviceFee": 75.00,
    "processingFee": 5.00,
    "total": 580.00,
    "payment": {
      "cardLast4": "4242"
    },
    "createdAt": "2025-01-15T10:35:00.000Z",
    "status": "completed"
  }
}
```

### 12. Get Order

```bash
curl http://localhost:4001/api/orders/order-xyz789
```

### 13. Get User's Orders

```bash
curl http://localhost:4001/api/users/user-123/orders
```

### 14. Get Feature Decisions (Optimizely)

```bash
curl http://localhost:4001/api/features/user-123
```

Response:
```json
{
  "success": true,
  "data": {
    "ticket_experience": true,
    "show_seat_preview": true,
    "show_recommendations": true,
    "checkout_layout": "standard",
    "show_urgency_banner": false
  }
}
```

### 15. Track Event (Optimizely)

```bash
curl -X POST http://localhost:4001/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "eventKey": "add_to_cart",
    "tags": {
      "eventId": "event-1",
      "numSeats": 2,
      "price": 500
    }
  }'
```

### 16. Health Check

```bash
curl http://localhost:4001/api/health
```

## Complete Workflow Example

### Step 1: Browse Events

```bash
# Get all concerts
curl http://localhost:4001/api/events?category=concerts
```

### Step 2: View Event Details

```bash
# Get Taylor Swift event
curl http://localhost:4001/api/events/event-1
```

### Step 3: View Available Seats

```bash
# Get seats for the event
curl http://localhost:4001/api/events/event-1/seats
```

### Step 4: Get Feature Flags

```bash
# Check what features are enabled for this user
curl http://localhost:4001/api/features/user-123
```

### Step 5: Create Shopping Cart

```bash
curl -X POST http://localhost:4001/api/cart \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123"}'

# Save the cart ID from response
```

### Step 6: Add Seats to Cart

```bash
# Add 2 seats (use real seat IDs from Step 3)
curl -X POST http://localhost:4001/api/cart/YOUR_CART_ID/items \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event-1",
    "seatIds": ["SEAT_ID_1", "SEAT_ID_2"]
  }'
```

### Step 7: Track Add to Cart Event

```bash
curl -X POST http://localhost:4001/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "eventKey": "add_to_cart",
    "tags": {
      "eventId": "event-1"
    }
  }'
```

### Step 8: Checkout

```bash
curl -X POST http://localhost:4001/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "YOUR_CART_ID",
    "userId": "user-123",
    "payment": {
      "cardLast4": "4242"
    }
  }'

# Save the order ID from response
```

### Step 9: Track Purchase Event

```bash
curl -X POST http://localhost:4001/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "eventKey": "purchase",
    "tags": {
      "orderId": "YOUR_ORDER_ID",
      "total": 580.00
    }
  }'
```

### Step 10: View Order History

```bash
curl http://localhost:4001/api/users/user-123/orders
```

## Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Event Categories

- `concerts` - Music concerts and tours
- `sports` - Sporting events
- `theater` - Broadway shows and plays
- `comedy` - Stand-up comedy shows

## Seat Statuses

- `available` - Can be purchased
- `reserved` - In someone's cart
- `sold` - Already purchased

## Notes

- Cart items expire when the server restarts (in-memory storage)
- Seats are automatically reserved when added to cart
- Seats are automatically released when removed from cart
- Seats are marked as sold after successful checkout
- All monetary values are in USD
