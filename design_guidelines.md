# Divine Naturals Dairy Delivery - Design Guidelines

## Design Approach
**System-Based Approach**: Clean Material Design principles with eco-friendly simplification. Inspired by modern utility apps (Instacart, Shopify) prioritizing clarity and efficiency over visual complexity.

**Core Principles**: 
- Trust through cleanliness and simplicity
- Eco-conscious visual language
- Mobile-first functionality
- Clear information hierarchy

---

## Typography System

**Font Families** (Google Fonts):
- Primary: Inter (400, 500, 600, 700) - UI elements, body text
- Accent: Quicksand (500, 600) - Headings, brand touchpoints

**Type Scale**:
- Hero Headlines: text-4xl md:text-5xl lg:text-6xl, font-600 (Quicksand)
- Section Headers: text-2xl md:text-3xl, font-600 (Quicksand)
- Card Titles: text-lg md:text-xl, font-600 (Inter)
- Body Text: text-base, font-400 (Inter)
- Small Labels: text-sm, font-500 (Inter)
- Micro Text: text-xs, font-400 (Inter)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Tight spacing: p-2, gap-2 (badges, chips)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Section padding: py-12 md:py-20 (page sections)
- Container margins: px-4 md:px-6 lg:px-8

**Grid Structure**:
- Mobile: Single column, full-width cards
- Tablet: 2-column grids (md:grid-cols-2)
- Desktop: 3-4 column grids (lg:grid-cols-3, xl:grid-cols-4)

**Container Widths**:
- Marketing pages: max-w-7xl
- App screens: max-w-6xl
- Forms/Content: max-w-2xl

---

## Component Library

### Customer App Components

**Hero Section** (Landing):
- Full-width image: Fresh dairy products in natural setting (milk bottles on wooden table with morning light, green plants)
- Overlay with semi-transparent backdrop-blur treatment
- Centered content: Hero headline, subheadline (2-line value prop), dual CTAs (primary "Start Subscription" + secondary "Browse Products")
- Height: 85vh on desktop, 70vh on mobile
- Trust indicators below hero: "100% Organic • Farm Fresh • Daily Delivery"

**Navigation**:
- Sticky header with logo left, menu right
- Mobile: Hamburger menu with slide-in drawer
- Cart icon with badge counter
- Profile/account dropdown

**Product Cards**:
- Square product images (1:1 ratio) with subtle shadow
- Product name, volume/quantity, price
- Quick-add button or subscription toggle
- Hover state: subtle lift (transform scale-105)
- Grid layout: 2 cols mobile, 3 cols tablet, 4 cols desktop

**Subscription Dashboard**:
- Active subscription card: Large card showing next delivery date, items list, modify/pause buttons
- Delivery schedule calendar widget
- Quick action buttons: Add items, Change frequency, Payment method
- Order history timeline with status indicators

**Wallet Section**:
- Balance card with recharge button
- Transaction history list (icon + description + amount)
- Auto-recharge toggle switch with threshold input

### Admin Panel Components

**Dashboard**:
- Stats cards in 4-column grid: Total Orders, Active Vendors, Deliveries Today, Revenue
- Line chart for order trends
- Recent orders table (5 latest)
- Quick actions sidebar

**Data Tables**:
- Sticky header row with sort indicators
- Row actions menu (3-dot overflow)
- Pagination controls
- Search and filter bar above table
- Status badges (color-coded: active, pending, completed)

**Forms**:
- Single-column layout (max-w-2xl)
- Clear field labels above inputs
- Helper text below fields when needed
- Primary action button right-aligned
- Cancel/secondary action left-aligned

---

## Images Section

**Required Images**:

1. **Hero Image**: High-quality photograph of fresh dairy products (milk bottles, yogurt jars) on rustic wooden surface with natural morning light filtering through, some green plants in soft focus background. Clean, inviting, organic aesthetic. Size: 1920x1080px minimum.

2. **Product Images**: Individual product photos on clean white background. Consistent lighting and angle. Square format (800x800px). Include: milk bottles, paneer, ghee, yogurt, buttermilk.

3. **About/Values Section**: Farm scene image showing happy cows in green pasture with farmer in background. Natural, authentic, not overly staged. Landscape orientation.

4. **Mobile App Mockup**: For marketing page, showing app interface on phone screen held in hand against blurred natural background.

5. **Delivery Partner Image**: Friendly delivery person with branded bag/uniform at doorstep. Warm, trustworthy feel.

---

## Icons
**Library**: Heroicons (outline style for consistency)
- Use 20px (w-5 h-5) for inline icons
- Use 24px (w-6 h-6) for standalone icons
- Use 32px (w-8 h-8) for feature section icons

---

## Animations
**Minimal Approach**:
- Page transitions: Simple fade-in (200ms)
- Button interactions: Subtle scale on hover (transform scale-105)
- Card hover: Soft shadow increase
- Loading states: Simple spinner, no complex skeleton screens
- No scroll-triggered animations

---

## Accessibility
- Minimum touch target: 44x44px for all interactive elements
- Form inputs: Clear visible focus states with outline
- Color contrast: WCAG AA compliant minimum
- Alt text for all images
- Keyboard navigation support throughout
- Screen reader labels for icon-only buttons