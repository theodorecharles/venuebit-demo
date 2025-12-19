# Variation Guide - Control vs Enhanced

This guide explains the visual and functional differences between the two variations in the VenueBit A/B test.

## Feature Flag

**Flag Name**: `ticket_experience`

**Variations**:
- `control` - Standard experience
- `enhanced` - Premium experience with additional features

## How to Test Different Variations

1. Click "New User ID" button in the debug banner
2. The new user will be randomly assigned to a variation
3. The variation badge shows which experience you're viewing
4. Keep clicking until you see both variations

## Page-by-Page Differences

### Seat Selection Page (`/seats/:eventId`)

#### Control Variation
- Standard seat map with section selection
- Basic seat grid with availability colors
- Selected seats panel on the right
- "Add to Cart" button
- No hover previews or recommendations

#### Enhanced Variation
**Additional Features**:

1. **Urgency Banner** (top of page)
   - Orange/red gradient background
   - Warning icon (animated pulse)
   - Text: "Only X seats left at this price!"
   - Subtitle: "Popular event - seats are selling fast"

2. **Seat Preview** (on hover)
   - Fixed position card (bottom-right)
   - Appears when hovering over available seats
   - Shows:
     - Section, row, seat number
     - Simulated stage view visualization
     - View rating badge (8-9/10)
     - Price display
   - Smooth slide-in animation

3. **Similar Seats Recommendations**
   - Card appears below seat map
   - Lightbulb icon header
   - Title: "You might also like"
   - 3 recommended seats with:
     - Section, row, seat info
     - Reason badge (blue) - "Similar view, better price"
     - Savings badge (green) - "Save $20"
     - Hover effect with primary border
     - Clickable to add to selection

**Visual Cues**:
- More vibrant, engaging UI
- Additional motion/animations
- Increased urgency messaging

### Checkout Page (`/checkout`)

#### Control Variation
- Standard form layout
- All sections expanded by default
- Contact information visible
- Payment details visible
- No urgency messaging

#### Enhanced Variation
**Differences**:

1. **Urgency Message** (top of page)
   - Warning/orange background
   - Clock icon
   - Text: "Hurry! Tickets are in high demand. Complete your purchase now to secure your seats."

2. **Collapsible Form Sections**
   - "Contact Information" section
     - Clickable header with chevron icon
     - Can expand/collapse
     - Contains email and name fields

   - "Payment Details" section
     - Clickable header with chevron icon
     - Can expand/collapse
     - Contains card number, expiry, CVV

   - Sections start expanded but can be collapsed
   - Chevron rotates when toggled
   - Smoother, more streamlined experience

**Visual Cues**:
- More compact, cleaner layout
- Interactive section headers
- Urgency reinforcement

### Confirmation Page (`/confirmation/:orderId`)

#### Both Variations (Same)
- Success checkmark icon
- "You're going to see [Artist]!" message
- Order number display
- Event details
- Ticket list
- Price breakdown
- "Return to App" button
- No variation differences on this page

## Color Coding

### Variation Badge Colors

**Control**:
- Blue background (`bg-blue-500/20`)
- Blue text (`text-blue-400`)
- Blue border (`border-blue-500/50`)

**Enhanced**:
- Green background (`bg-success/20`)
- Green text (`text-success`)
- Green border (`border-success/50`)

## Component Visibility Matrix

| Component | Control | Enhanced |
|-----------|---------|----------|
| DebugBanner | ✅ | ✅ |
| SeatMap | ✅ | ✅ |
| SeatLegend | ✅ | ✅ |
| SelectedSeats | ✅ | ✅ |
| **UrgencyBanner** | ❌ | ✅ |
| **SeatPreview** | ❌ | ✅ |
| **SimilarSeats** | ❌ | ✅ |
| OrderSummary | ✅ | ✅ |
| PaymentForm | ✅ (expanded) | ✅ (collapsible) |
| PriceBreakdown | ✅ | ✅ |
| Confirmation | ✅ | ✅ |

## Code Implementation

### Checking Variation in Components

```typescript
import { useFeatureFlag } from '../hooks/useFeatureFlag';

const MyComponent = () => {
  const { isEnhanced, isControl, variation } = useFeatureFlag();

  return (
    <div>
      {/* Show only in enhanced */}
      {isEnhanced && <EnhancedFeature />}

      {/* Show only in control */}
      {isControl && <ControlFeature />}

      {/* Different props based on variation */}
      <SharedComponent streamlined={isEnhanced} />
    </div>
  );
};
```

### Conditional Rendering Patterns

**Pattern 1: Component Visibility**
```typescript
{isEnhanced && <UrgencyBanner availableSeats={total} />}
```

**Pattern 2: Props Variation**
```typescript
<PaymentForm
  onSubmit={handleSubmit}
  loading={processing}
  isEnhanced={isEnhanced}  // Component handles internal logic
/>
```

**Pattern 3: Optional Callbacks**
```typescript
<SeatMap
  eventId={eventId}
  selectedSeats={selectedSeats}
  onSeatSelect={handleSeatSelect}
  onSeatHover={isEnhanced ? setHoveredSeat : undefined}  // Only in enhanced
/>
```

## Testing Checklist

Use this checklist when testing variations:

### Control Variation
- [ ] No urgency banner on seat selection page
- [ ] No seat preview on hover
- [ ] No similar seats recommendations
- [ ] All checkout form fields visible
- [ ] No urgency message on checkout
- [ ] Variation badge shows "CONTROL" in blue

### Enhanced Variation
- [ ] Urgency banner visible with warning icon
- [ ] Seat preview appears when hovering seats
- [ ] Similar seats section below seat map
- [ ] Checkout sections are collapsible
- [ ] Urgency message on checkout page
- [ ] Variation badge shows "ENHANCED" in green

### Both Variations
- [ ] Debug banner always visible
- [ ] User ID displayed correctly
- [ ] "New User ID" button generates new UUID
- [ ] Seat selection works properly
- [ ] Cart updates in real-time
- [ ] Checkout processes successfully
- [ ] Confirmation page shows order details

## Optimization Metrics

Track these events for both variations:

### Tracked Events
1. **page_view** - All page loads
2. **add_to_cart** - Seat selection completion
3. **checkout** - Checkout page view
4. **purchase** - Order completion (with revenue)

### Custom Events (Enhanced Only)
- `seat_preview_viewed` - Hover interactions
- `similar_seat_clicked` - Recommendation engagement
- `form_section_toggled` - Checkout interaction

### Expected Outcomes

**Hypothesis**: Enhanced variation will increase conversion rate by:
- Reducing decision fatigue (seat recommendations)
- Increasing urgency (scarcity messaging)
- Improving confidence (seat previews)
- Streamlining checkout (collapsible sections)

**Target Metrics**:
- 15-20% increase in conversion rate
- 10% increase in average order value
- 25% reduction in cart abandonment
- Higher engagement with enhanced features

## Troubleshooting

### "Variation not changing"
- User ID determines variation
- Same user ID = same variation
- Click "New User ID" to get re-bucketed
- Clear localStorage if needed

### "Enhanced features not showing"
- Check Optimizely SDK key is set
- Verify SDK loaded successfully (check console)
- Ensure variation is actually "enhanced" (check badge)
- Check browser console for errors

### "Both variations look the same"
- Verify Optimizely experiment is running
- Check that feature flag name matches: `ticket_experience`
- Ensure variation keys are: `control` and `enhanced`
- Review network tab for Optimizely datafile

## Quick Reference

**Feature Flag**: `ticket_experience`

**Import**:
```typescript
import { useFeatureFlag } from '../hooks/useFeatureFlag';
```

**Usage**:
```typescript
const { isEnhanced, isControl, variation } = useFeatureFlag();
```

**Variations**:
- `control` - Standard
- `enhanced` - Premium

**Enhanced Components**:
- UrgencyBanner
- SeatPreview
- SimilarSeats
- Collapsible PaymentForm
