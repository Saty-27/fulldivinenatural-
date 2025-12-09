# Divine Naturals Customer App - Ultra Detailed Guide

## Complete User Experience Documentation

---

## TABLE OF CONTENTS

1. [App Overview](#app-overview)
2. [Authentication Flow](#authentication-flow)
3. [Bottom Navigation](#bottom-navigation)
4. [Each Page - Comprehensive Breakdown](#each-page-comprehensive-breakdown)
5. [User Journeys](#user-journeys)
6. [API Endpoints Used](#api-endpoints-used)
7. [Data Models](#data-models)
8. [UI Components](#ui-components)

---

## APP OVERVIEW

### **App Name:** Divine Naturals
### **Tagline:** Pure. Fresh. Daily.
### **Platform:** Mobile-First Web App (Responsive to Desktop)
### **Tech Stack:** React, TypeScript, Tailwind CSS, Wouter (routing), React Query (state)
### **Design Philosophy:** Minimalist, eco-friendly, clean (no complex themes)

### **Key Features:**
- 🥛 Recurring milk subscriptions with flexible scheduling
- 🛍️ E-commerce shop for dairy products
- 📦 Order tracking and management
- 👛 Digital wallet for payments
- 🎁 Loyalty points and referral rewards
- 📱 Mobile-optimized interface with bottom navigation
- 🔔 Real-time notifications
- 🏠 Address management for deliveries

### **Color Scheme (Eco-Friendly):**
```
Primary: Green (#10B981) - Nature, freshness, dairy
Secondary: Cream/Beige (#F5F3FF) - Pure, dairy products
Accent: Teal (#0D9488) - Trust, reliability
Neutral: Gray (#6B7280) - Professional, readable
Success: Green (#34D399) - Positive actions
Warning: Amber (#F59E0B) - Alerts, caution
Danger: Red (#EF4444) - Errors, cancellations
```

### **Typography:**
- Headlines: Bold, large font (24px+)
- Body Text: Regular, readable (16px)
- Labels: Semi-bold, clear (14px)
- Small Text: Subtle, secondary info (12px)

---

## AUTHENTICATION FLOW

### **Step 1: Landing Page**
**Path:** `/`  
**What User Sees:**
- Divine Naturals logo with tagline "Pure. Fresh. Daily."
- Hero section with app benefits
- "Get Started" or "Login" button
- Features overview (if not logged in)

**User Action:**
- Click "Get Started" → Redirects to phone entry
- Already have account? → Click "Login" → Phone entry

### **Step 2: Phone Number Entry**
**Path:** `/auth/phone-entry`  
**What User Sees:**
- Centered form with title "Welcome to Divine Naturals"
- Phone number input field (Indian format: +91)
- "Get OTP" button
- Privacy notice at bottom

**What Happens Behind Scenes:**
```javascript
// User enters: 98765 43210
// App validates: Is valid Indian phone? Yes
// API calls: POST /api/auth/send-otp
// Backend: Sends SMS with 6-digit OTP
// User gets SMS: "Your Divine Naturals OTP is: 123456"
```

**User Action:**
- Enter phone number
- Click "Get OTP"
- SMS arrives with one-time password

### **Step 3: OTP Verification**
**Path:** `/auth/otp-verification`  
**What User Sees:**
- 6 input boxes (one digit per box)
- "Verify OTP" button
- "Resend OTP" link
- Phone number displayed for reference

**How OTP Entry Works:**
```
Box 1: [1]
Box 2: [2]
Box 3: [3]
Box 4: [4]
Box 5: [5]
Box 6: [6]

User types: 123456
Auto-focuses next box after each digit
Can paste entire code at once
Auto-submits when 6 digits entered
```

**What Happens:**
```javascript
// User enters: 123456
// Validation: Is 6 digits? Yes, is correct? Yes
// API calls: POST /api/auth/verify-otp
// Backend: Checks OTP validity (5 min expiry)
// Result: Valid OTP
// Check: Is existing user?
  // YES → Login complete → Redirect to /home
  // NO → Go to address setup
```

**Error Scenarios:**
- ❌ Wrong OTP → "Incorrect OTP. Please try again."
- ❌ OTP expired → "OTP expired. Request a new one."
- ❌ Too many attempts → "Too many attempts. Please try again later."

**Resend OTP:**
- User clicks "Resend OTP"
- New OTP sent via SMS
- 60-second cooldown before can resend again
- User can try new OTP

### **Step 4: Address Setup (New Users Only)**
**Path:** `/auth/address-setup`  
**What User Sees:**
- Title: "Set Your Delivery Location"
- Subtitle: "Where should we deliver your orders?"
- Google Maps search input
- Address suggestion dropdown
- Apartment/Suite number field
- Landmark field (optional)
- "Complete Setup" button

**Address Form Fields:**
```
1. Search Address:
   - User types: "Koramangala, Bangalore"
   - Autocomplete suggestions appear
   - User selects: "Koramangala, Bangalore 560034"
   - Coordinates auto-filled: lat: 12.9352, lng: 77.6245

2. Apartment/Suite (optional):
   - Input: "Apt 42, Tower B"
   - Helps delivery partner find exact location

3. Landmark (optional):
   - Input: "Next to Big Bazaar"
   - Additional reference for delivery

4. Default Address:
   - Checkbox: "Set as default delivery address"
```

**What Happens:**
```javascript
// User submits address
// Validation: Valid pincode? Check coverage area
  // YES → Address saved
  // NO → "Delivery not available in this area"
// API calls: POST /api/addresses
// Database: Stores address linked to user
// Redirect: /home (Dashboard)
```

**Output:**
```javascript
{
  userId: "user-123",
  streetAddress: "Koramangala, Bangalore",
  apartment: "Apt 42, Tower B",
  landmark: "Next to Big Bazaar",
  coordinates: { lat: 12.9352, lng: 77.6245 },
  pincode: "560034",
  isDefault: true,
  createdAt: "2025-08-23T10:30:00Z"
}
```

---

## BOTTOM NAVIGATION

### **Navigation Bar Layout:**
Located at bottom of screen, sticky (always visible when scrolling)

```
┌─────────────────────────────────────┐
│  HOME   MILK   SHOP   ORDERS PROFILE │
│  🏠     🥛     🛍️     📦      👤     │
└─────────────────────────────────────┘
```

### **Navigation Tabs:**

| Tab | Icon | Path | Purpose |
|-----|------|------|---------|
| **HOME** | 🏠 | /home | Dashboard, quick access |
| **MILK** | 🥛 | /milk | Subscription management |
| **SHOP** | 🛍️ | /shop | Browse & buy products |
| **ORDERS** | 📦 | /orders | Track orders |
| **PROFILE** | 👤 | /profile | Account settings |

### **Active Tab Indicator:**
- Current tab highlighted in green (#10B981)
- Active tab shows color, others gray
- Text bold for active tab

### **Floating Elements:**
- 🛒 **Cart Button** - Floating action button showing item count
  - Location: Bottom-right above navigation
  - Shows cart item count badge: "3"
  - Tappable to go to cart
  - Animates when item added

---

## EACH PAGE - COMPREHENSIVE BREAKDOWN

---

## PAGE 1: HOME (Customer Dashboard)

**Path:** `/home`  
**Accessible From:** Navigation (HOME tab)  
**Scroll:** Yes (vertical scroll)

### **HEADER SECTION**
```
┌────────────────────────────────────┐
│ Welcome Back, Rajesh! 👋           │
│ Sunday 23 November, 2025 03:01 PM  │
│                        🔔 🟢 👤    │
└────────────────────────────────────┘
```

**Header Elements:**
1. **Greeting** 
   - "Welcome Back, [First Name]! 👋"
   - Dynamic greeting based on time of day
   - Morning (5-11): "Good Morning!"
   - Afternoon (11-17): "Good Afternoon!"
   - Evening (17-21): "Good Evening!"
   - Night (21-5): "Sleep well!"

2. **Date & Time**
   - Shows current date: "Sunday 23 November, 2025"
   - Shows current time: "03:01 PM"
   - Updates real-time

3. **Notification Bell**
   - 🔔 Icon clickable → Links to `/notifications`
   - Red badge shows unread count: "3"
   - Visible only if unread notifications exist

4. **User Avatar**
   - 👤 Circular profile picture
   - Gradient background if no image
   - Clickable → Links to `/profile`

### **QUICK ACCESS CARDS**

**Card 1: Milk Subscription Card**
```
┌────────────────────────────────────┐
│ 🥛 YOUR MILK SUBSCRIPTION          │
├────────────────────────────────────┤
│ Status: ACTIVE                     │
│ Current Quantity: 2 Liters         │
│ Frequency: Daily                   │
│ Next Delivery: Tomorrow 6:30 AM    │
│ Monthly Cost: ₹1,800               │
│                                    │
│  [MODIFY]    [PAUSE]    [DETAILS]  │
└────────────────────────────────────┘
```

**Card Details:**
- Shows current subscription status
- Quantity in liters
- Delivery frequency
- Next scheduled delivery with time
- Monthly cost breakdown
- Three buttons:
  - **MODIFY** → Go to `/milk` to change
  - **PAUSE** → Temporarily stop deliveries
  - **DETAILS** → View full subscription info

**If No Subscription:**
```
┌────────────────────────────────────┐
│ 🥛 START DAILY MILK SUBSCRIPTION   │
├────────────────────────────────────┤
│ Get fresh milk delivered every day │
│ at 6:30 AM to your doorstep        │
│                                    │
│       [SET UP SUBSCRIPTION]        │
│                                    │
│ Save ₹100/month vs. one-time      │
└────────────────────────────────────┘
```

**Card 2: Quick Shop Card**
```
┌────────────────────────────────────┐
│ 🛍️  FRESH DAIRY PRODUCTS           │
├────────────────────────────────────┤
│ Browse 8 Premium Products          │
│                                    │
│ [🥛] [🧀] [🧈]                    │
│ Milk  Paneer Ghee                 │
│                                    │
│       [BROWSE SHOP]                │
└────────────────────────────────────┘
```

**Card Details:**
- Shows product categories as icons
- Links to `/shop`
- Shows product count available
- Quick category preview

**Card 3: Active Orders Card**
```
┌────────────────────────────────────┐
│ 📦 YOUR ACTIVE ORDERS              │
├────────────────────────────────────┤
│ Order #ORD-12345                   │
│ Status: Out for Delivery 🚚        │
│ Items: Fresh Paneer (200g)         │
│ Estimated: Today 3:45 PM           │
│ Total: ₹235                        │
│                                    │
│       [TRACK ORDER]                │
└────────────────────────────────────┘
```

**Card Details:**
- Shows latest active order
- Order status with icon
- Items in order
- Estimated delivery time
- Order total
- "TRACK ORDER" links to `/orders`

**If No Active Orders:**
```
┌────────────────────────────────────┐
│ 📦 NO ACTIVE ORDERS                │
│                                    │
│ You're all set! Start shopping     │
│ for fresh dairy products.          │
│                                    │
│       [SHOP NOW]                   │
└────────────────────────────────────┘
```

**Card 4: Offers & Rewards Card**
```
┌────────────────────────────────────┐
│ 🎁 SPECIAL OFFERS FOR YOU          │
├────────────────────────────────────┤
│ Loyalty Points: 1,250 pts          │
│ Next Reward: 750 points needed     │
│                                    │
│ Active Offers:                     │
│ • Daily Milk: ₹50 OFF (MILKSUB50)  │
│ • First Time: 25% OFF (FIRST25)    │
│                                    │
│       [VIEW ALL OFFERS]            │
└────────────────────────────────────┘
```

**Card Details:**
- Loyalty points balance
- Progress to next reward tier
- Shows 1-2 active coupons
- Links to `/offers`

### **RECENT ACTIVITY WIDGET**
```
┌────────────────────────────────────┐
│ 📝 RECENT ACTIVITY                 │
├────────────────────────────────────┤
│ ✅ Order Delivered                 │
│    Fresh Milk 500ml                │
│    2 hours ago                     │
│                                    │
│ 🚚 Out for Delivery                │
│    Fresh Paneer 200g               │
│    Today at 3:45 PM                │
│                                    │
│ 💳 Payment Confirmed               │
│    ₹230 for subscription           │
│    Yesterday                       │
│                                    │
│       [VIEW ALL ACTIVITY]          │
└────────────────────────────────────┘
```

**Activity Types:**
- ✅ **Delivered** - Order successfully delivered
- 🚚 **Out for Delivery** - Delivery in progress
- 💳 **Payment** - Payment processed
- 🔄 **Subscription Updated** - Subscription modified
- 🎁 **Reward Earned** - Points earned
- 📧 **Notification** - Special messages

### **DATA SOURCES (API CALLS)**
```javascript
// Home page makes these API calls on mount:

1. GET /api/auth/user
   // Returns: Current user info
   // Data: firstName, lastName, email, phone

2. GET /api/milk-subscription
   // Returns: User's milk subscription
   // Data: quantity, frequency, deliveryTime, nextDeliveryDate

3. GET /api/orders
   // Returns: All user orders
   // Data: orders array (id, status, items, total, createdAt)

4. GET /api/notifications
   // Returns: All unread notifications
   // Data: notifications array with unread count
```

---

## PAGE 2: MILK (Subscription Management)

**Path:** `/milk`  
**Accessible From:** Navigation (MILK tab) or HOME card

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← MILK SUBSCRIPTION                │
├────────────────────────────────────┤
│                                    │
│ Current Subscription               │
│ ┌──────────────────────────────┐  │
│ │ 🥛 Fresh Toned Milk          │  │
│ │ Status: ACTIVE ✓             │  │
│ │ Quantity: 2 Liters           │  │
│ │ Time: 6:00 AM - 8:00 AM      │  │
│ │ Cost: ₹1,800 / month         │  │
│ │ [MODIFY] [PAUSE] [CANCEL]    │  │
│ └──────────────────────────────┘  │
│                                    │
│ Customize Your Subscription        │
│ ┌──────────────────────────────┐  │
│ │ Quantity: [- 2 +]            │  │
│ │                              │  │
│ │ Frequency: [Daily ▼]         │  │
│ │ • Daily (Every day)          │  │
│ │ • Weekly (Same day each)     │  │
│ │ • Monthly (Once a month)     │  │
│ │                              │  │
│ │ Delivery Time:               │  │
│ │ • 6:00 AM - 8:00 AM ✓        │  │
│ │ • 7:00 AM - 9:00 AM          │  │
│ │ • 8:00 AM - 10:00 AM         │  │
│ │ • 6:00 PM - 8:00 PM          │  │
│ │                              │  │
│ │ Monthly Cost: ₹1,800         │  │
│ │                              │  │
│ │   [SAVE CHANGES]             │  │
│ └──────────────────────────────┘  │
│                                    │
│ Next 30 Days Schedule              │
│ ┌──────────────────────────────┐  │
│ │ 24 Aug: 2L at 6:30 AM ✓      │  │
│ │ 25 Aug: 2L at 6:30 AM        │  │
│ │ 26 Aug: 2L at 6:30 AM        │  │
│ │ 27 Aug: 2L at 6:30 AM        │  │
│ │ ... (continue for 30 days)   │  │
│ └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

### **CURRENT SUBSCRIPTION SECTION**

**Shows If User Has Active Subscription:**
```javascript
{
  productType: "Fresh Toned Milk",
  status: "ACTIVE",
  quantity: 2,
  frequency: "daily",
  deliveryTime: "6:00 AM - 8:00 AM",
  monthlyPrice: 1800,
  nextDelivery: "2025-08-24 06:30:00"
}
```

**Display Format:**
```
🥛 Fresh Toned Milk
Status: ACTIVE ✓ (Green checkmark)
Quantity: 2 Liters
Time: 6:00 AM - 8:00 AM
Cost: ₹1,800 / month

[MODIFY] [PAUSE] [CANCEL]
```

**Button Actions:**
1. **MODIFY** → Opens customization section
2. **PAUSE** → Pauses deliveries temporarily
   - User can set "Pause for 7 days" or "Pause for 14 days"
   - Resumes automatically after period
3. **CANCEL** → Cancels subscription permanently
   - Shows confirmation dialog
   - "Are you sure you want to cancel? You'll lose benefits."

**If No Subscription:**
```
🥛 NO ACTIVE SUBSCRIPTION

Start your daily milk delivery!
Fresh milk delivered to your doorstep
every morning at a time that suits you.

Benefits:
✓ 10% discount vs one-time purchase
✓ Flexible modification anytime
✓ Free delivery
✓ Premium quality guaranteed

[START SUBSCRIPTION]
```

### **CUSTOMIZATION SECTION**

**1. Quantity Selector:**
```
Quantity:
[−] 1 [+]  → Shows: 1 Liter | ₹30/unit | ₹900/month
[−] 2 [+]  → Shows: 2 Liters | ₹30/unit | ₹1,800/month
[−] 3 [+]  → Shows: 3 Liters | ₹30/unit | ₹2,700/month
```

**Quantity Options:** 1L, 1.5L, 2L, 2.5L, 3L  
**Per Liter Price:** ₹30 (standard rate)

**2. Frequency Selector:**
```
Frequency:
○ Daily     → Delivered every single day
○ Weekly    → Delivered same day every week
○ Monthly   → Delivered once a month (specific date)
```

**Monthly Cost Calculation:**
```javascript
Daily:    quantity × 30 × ₹30
Weekly:   quantity × 4.3 × ₹30  (approx 4-5 per month)
Monthly:  quantity × ₹30  (one-time per month)

Examples:
2L Daily:  2 × 30 × 30 = ₹1,800
2L Weekly: 2 × 4.3 × 30 = ₹258
2L Monthly: 2 × 30 = ₹60
```

**3. Delivery Time Selector:**
```
Delivery Time:
◆ 6:00 AM - 8:00 AM   (Most popular)
○ 7:00 AM - 9:00 AM
○ 8:00 AM - 10:00 AM
○ 6:00 PM - 8:00 PM   (Evening option)
```

**Time Slot Details:**
- Each slot is 2 hours wide
- Morning slots 6-10 AM (fresh milk)
- Evening slot 6-8 PM (for alternate option)
- Delivery happens within selected window

### **MONTHLY COST BREAKDOWN**

```
Milk Subscription Cost Calculator

Quantity Selected: 2 Liters
Price per Liter: ₹30
Frequency: Daily

Calculation:
  Base Price: 2L × ₹30 = ₹60/day
  Days per Month: 30 days
  Total: ₹60 × 30 = ₹1,800/month

Additional Benefits:
  ✓ Savings vs one-time: 10% = ₹200/month
  ✓ Free delivery (worth ₹20/day)
  ✓ Priority status
  ✓ Loyalty points: 54 points/month

Final Monthly Cost: ₹1,800
```

### **NEXT 30 DAYS SCHEDULE**

```
Calendar view showing:
24 Aug (Sun): 2L at 6:30 AM ✓ (Today)
25 Aug (Mon): 2L at 6:30 AM
26 Aug (Tue): 2L at 6:30 AM
27 Aug (Wed): 2L at 6:30 AM
28 Aug (Thu): 2L at 6:30 AM
29 Aug (Fri): 2L at 6:30 AM
30 Aug (Sat): 2L at 6:30 AM
31 Aug (Sun): 2L at 6:30 AM
... (continue for full month)
```

**Schedule Features:**
- ✓ Green checkmark for delivered days
- 🔄 Current day highlighted
- 🚚 Upcoming days shown with time
- Can skip specific days
- Can modify quantity for specific days

### **SAVE CHANGES BUTTON**

When user modifies subscription:
```javascript
// User changes: Quantity from 2L to 3L
// User changes: Frequency from Daily to Weekly

// Click [SAVE CHANGES]
// API Call: PATCH /api/milk-subscription/:id
// Payload: {
//   quantity: 3,
//   frequency: "weekly",
//   deliveryTime: "6:00 AM - 8:00 AM"
// }

// Response: 200 OK
// Message: "✓ Subscription updated! New cost: ₹387/month"
// Recalculate: Next 30 days schedule updates
```

### **API CALLS**

```javascript
// On Page Load:
GET /api/milk-subscription
// Returns current subscription or empty if none

// On Save:
PATCH /api/milk-subscription/:id
// Updates subscription with new settings

// On Cancel:
DELETE /api/milk-subscription/:id
// Marks subscription as cancelled

// On Pause:
PATCH /api/milk-subscription/:id
// Updates status to "paused" with resume date
```

---

## PAGE 3: SHOP (E-Commerce)

**Path:** `/shop`  
**Accessible From:** Navigation (SHOP tab) or HOME card

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← SHOP                   [Search]  │
├────────────────────────────────────┤
│ Categories:                        │
│ [All] [🥛 Milk] [🧀 Paneer]       │
│ [🧈 Ghee] [🍌 Butter]             │
├────────────────────────────────────┤
│ Product Grid (2 columns):          │
│                                    │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ [Product 1]  │ │ [Product 2]  │ │
│ │ Fresh Toned  │ │ Full Cream   │ │
│ │ Milk         │ │ Milk         │ │
│ │ ₹28/500ml    │ │ ₹32/500ml    │ │
│ │              │ │              │ │
│ │ [+ Add Cart] │ │ [+ Add Cart] │ │
│ └──────────────┘ └──────────────┘ │
│                                    │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ [Product 3]  │ │ [Product 4]  │ │
│ │ Fresh Paneer │ │ Pure Ghee    │ │
│ │ ₹80/200g     │ │ ₹150/200ml   │ │
│ │              │ │              │ │
│ │ [+ Add Cart] │ │ [+ Add Cart] │ │
│ └──────────────┘ └──────────────┘ │
│                                    │
│ (8 products total in grid)         │
│                                    │
└────────────────────────────────────┘
```

### **SEARCH BAR**

```
┌─────────────────────────────────────┐
│ 🔍 Search products...              │
└─────────────────────────────────────┘
```

**Features:**
- Real-time search as user types
- Searches by product name
- Case-insensitive
- Clears when clicked again

**Search Examples:**
- User types: "milk" → Shows only milk products
- User types: "paneer" → Shows paneer products
- User types: "fresh" → Shows all "fresh" products

### **CATEGORY FILTERS**

```
[All] [Milk] [Paneer] [Ghee] [Butter] [Yogurt]
```

**Filter Behavior:**
- **All** - Shows all 8 products
- **Milk** - Shows toned milk, full cream milk
- **Paneer** - Shows fresh paneer, mozzarella
- **Ghee** - Shows pure ghee
- **Butter** - Shows fresh butter
- **Yogurt** - Shows curd, buttermilk

**Active Filter:**
- Currently selected filter highlighted in green
- Others in gray

### **PRODUCT CARDS**

**Each Product Card Shows:**
```
┌─────────────────────────────┐
│                             │
│  [Product Image]            │ (square, 200x200px)
│                             │
├─────────────────────────────┤
│ Product Name                │
│ Fresh Toned Milk            │
│                             │
│ Price: ₹28                  │ (in green)
│ Unit: 500ml                 │
│                             │
│  [+ ADD TO CART]            │ (green button)
│                             │
└─────────────────────────────┘
```

### **ALL 8 REAL PRODUCTS**

```
1. Fresh Toned Milk
   Price: ₹28
   Unit: 500ml
   Category: milk
   Stock: 100 units
   Description: Pure toned milk, skimmed
   Image: milk-toned.jpg

2. Full Cream Milk
   Price: ₹32
   Unit: 500ml
   Category: milk
   Stock: 95 units
   Description: Rich, full-cream milk
   Image: milk-fullcream.jpg

3. Fresh Paneer
   Price: ₹80
   Unit: 200g
   Category: paneer
   Stock: 50 units
   Description: Fresh cottage cheese
   Image: paneer-fresh.jpg

4. Pure Ghee
   Price: ₹150
   Unit: 200ml
   Category: ghee
   Stock: 45 units
   Description: Clarified butter, 100% pure
   Image: ghee-pure.jpg

5. Fresh Butter
   Price: ₹60
   Unit: 100g
   Category: butter
   Stock: 40 units
   Description: Fresh unsalted butter
   Image: butter-fresh.jpg

6. Thick Curd
   Price: ₹25
   Unit: 250g
   Category: yogurt
   Stock: 60 units
   Description: Thick, creamy yogurt
   Image: curd-thick.jpg

7. Buttermilk
   Price: ₹20
   Unit: 500ml
   Category: yogurt
   Stock: 45 units
   Description: Tangy buttermilk
   Image: buttermilk.jpg

8. Mozzarella Cheese
   Price: ₹120
   Unit: 200g
   Category: paneer
   Stock: 20 units
   Description: Melting mozzarella cheese
   Image: cheese-mozzarella.jpg
```

### **ADD TO CART FLOW**

**User clicks "ADD TO CART" on product:**

```javascript
// Step 1: Click button
// Step 2: Toast notification appears
Toast: "✓ Fresh Paneer added to your cart"

// Step 3: Cart count updates
// Before: Cart is empty (0)
// After: Cart shows "1" badge

// Step 4: Cart item stored locally (React state)
CartItem: {
  id: 3,
  name: "Fresh Paneer",
  price: 80,
  quantity: 1,
  unit: "200g"
}

// Step 5: Button color changes (optional)
// From: Green button
// To: Light button with "✓ In Cart" text
```

**Multiple Adds of Same Product:**
```
// User clicks ADD TO CART on Fresh Paneer
// First time: quantity = 1
// Second time: 
  // Instead of creating duplicate
  // Updates existing item: quantity = 2
  // Toast: "✓ Fresh Paneer quantity updated to 2"
```

### **CART SUMMARY AT BOTTOM**

```
┌────────────────────────────────────┐
│ 🛒 CART: 3 items | ₹235            │
│                   [VIEW CART →]    │
└────────────────────────────────────┘
```

**Floating Cart Button:**
- Always visible at bottom
- Shows item count: "3 items"
- Shows total price: "₹235"
- Tappable link to `/cart`
- Updates in real-time as items added

### **API CALLS**

```javascript
// On Page Load:
GET /api/products
// Returns all 8 products with details
// Cached in React Query

// On Add to Cart:
// No API call - stored in local React state
// Data synced to cart when user navigates
```

---

## PAGE 4: ORDERS (Order Tracking)

**Path:** `/orders`  
**Accessible From:** Navigation (ORDERS tab)

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← ORDERS                           │
├────────────────────────────────────┤
│                                    │
│ Tabs: [ACTIVE] [PAST]              │
│                                    │
│ Filter: [All ▼]  Search: [Search] │
│                                    │
│ ACTIVE ORDERS:                     │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Order #ORD-12345             │  │
│ │ Status: 🚚 Out for Delivery   │  │
│ │ Items: 2                     │  │
│ │ • Fresh Paneer 200g × 1      │  │
│ │ • Pure Ghee 200ml × 1        │  │
│ │                              │  │
│ │ Total: ₹235                  │  │
│ │ Expected: Today 3:45 PM      │  │
│ │ Delivery To: Koramangala     │  │
│ │ Partner: Ramesh (📞 98765...)│  │
│ │                              │  │
│ │ [TRACK] [DETAILS] [SUPPORT]  │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Order #ORD-12346             │  │
│ │ Status: 📦 Preparing         │  │
│ │ ... (similar layout)          │  │
│ │ [TRACK] [DETAILS] [SUPPORT]  │  │
│ └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

### **TAB SWITCHING**

**Default:** ACTIVE tab selected (showing pending/processing orders)

**Tab 1: ACTIVE ORDERS**
```javascript
Statuses Shown:
- pending (Order received)
- confirmed (Vendor confirmed)
- preparing (Vendor preparing)
- out_for_delivery (Driver on way)

Filter Query:
orders.filter(o => 
  ["pending", "confirmed", "preparing", "out_for_delivery"]
  .includes(o.status)
)

Result: Shows only current/in-progress orders
Sorted: Newest first (most recent at top)
```

**Tab 2: PAST ORDERS**
```javascript
Statuses Shown:
- delivered (Successfully completed)
- cancelled (Order was cancelled)

Filter Query:
orders.filter(o => 
  ["delivered", "cancelled"].includes(o.status)
)

Result: Shows only completed/cancelled orders
Sorted: Newest first
```

### **SEARCH & FILTER**

**Search Box:**
- Searches by: Order ID or item name
- Example: User types "ORD-12345" → Shows that order
- Example: User types "Paneer" → Shows orders containing paneer

**Filter Dropdown:**
```
[All ▼]
├─ All (show all)
├─ Pending
├─ Confirmed
├─ Preparing
├─ Out for Delivery
├─ Delivered
└─ Cancelled
```

### **ORDER CARD DETAILS**

**Each Order Shows:**

```
Order ID: ORD-12345
Status Badge: 🚚 Out for Delivery (Orange)

ITEMS ORDERED:
• Fresh Paneer 200g × 1 .... ₹80
• Pure Ghee 200ml × 1 ...... ₹150

TOTALS:
Subtotal .... ₹230
Delivery .... ₹20 (or Free)
Discount ... -₹15 (if coupon used)
─────────────────────
TOTAL: ₹235

DELIVERY INFO:
Estimated: Today 3:45 PM
Address: Apt 42, Koramangala, Bangalore
Landmark: Next to Big Bazaar

DELIVERY PARTNER:
Name: Ramesh Kumar
Rating: ⭐ 4.8
Phone: 📞 +91 98765 43210 (Clickable to call)

ACTION BUTTONS:
[TRACK] [DETAILS] [SUPPORT]
```

### **STATUS FLOW WITH TIMELINE**

```
Status Journey:
┌──────────────────────────────────────┐
│ Order Placed                         │
│ ✓ 22 Aug, 10:30 AM                  │
├──────────────────────────────────────┤
│ ✓ Order Confirmed                    │
│   22 Aug, 10:45 AM                  │
├──────────────────────────────────────┤
│ ✓ Preparing                          │
│   22 Aug, 11:00 AM                  │
├──────────────────────────────────────┤
│ ● Out for Delivery (CURRENT)         │
│   22 Aug, 2:00 PM                   │
│   Ramesh is 2km away, ETA 3:45 PM   │
├──────────────────────────────────────┤
│ ○ Delivered                          │
│   (Pending)                          │
└──────────────────────────────────────┘
```

### **ORDER CARD BUTTONS**

**1. TRACK Button**
- Opens real-time tracking map
- Shows delivery partner location
- Shows order route
- Updates live as driver moves
- Displays ETA countdown

**2. DETAILS Button**
- Expands full order details
- Shows itemized breakdown
- Payment method used
- Invoice/receipt
- Tracking history

**3. SUPPORT Button**
- Opens support ticket creation
- Pre-fills order number
- Common issues suggested
- Direct contact options

### **IF NO ORDERS**

**When No Active Orders:**
```
📦 NO ACTIVE ORDERS

No deliveries scheduled.
Ready to order some fresh dairy?

[SHOP NOW]
```

**When No Past Orders:**
```
📋 NO ORDER HISTORY

You haven't placed any orders yet.
Start with our bestsellers!

[BROWSE PRODUCTS]
```

### **REORDER FEATURE (Past Orders Only)**

```
For each past delivered order:

[REORDER] Button appears

User clicks [REORDER]:
- All items from that order added to new cart
- Toast: "✓ Items added to your cart!"
- Can modify quantities before checkout
- Jump to cart page
```

### **RATING & REVIEW (Delivered Orders)**

```
After order delivered:

[RATE & REVIEW] button appears

User clicks:
1. Star rating (1-5 stars)
2. Write review (optional text)
3. Photos (optional)
4. Submit

Stored in database for admin analytics
```

### **API CALLS**

```javascript
// On Page Load:
GET /api/orders
// Returns all user orders (active + past)
// Sorted by createdAt DESC

// Response Format:
[
  {
    id: "ORD-12345",
    status: "out_for_delivery",
    items: [
      { id: 3, name: "Fresh Paneer", quantity: 1, price: 80 },
      { id: 4, name: "Pure Ghee", quantity: 1, price: 150 }
    ],
    total: 235,
    deliveryAddress: "Apt 42, Koramangala",
    createdAt: "2025-08-22T10:30:00Z",
    estimatedDelivery: "2025-08-22T15:45:00Z",
    deliveryPartner: {
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      rating: 4.8
    }
  }
]
```

---

## PAGE 5: PROFILE (Account Overview)

**Path:** `/profile`  
**Accessible From:** Navigation (PROFILE tab)

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← PROFILE                          │
├────────────────────────────────────┤
│                                    │
│ PROFILE CARD:                      │
│ ┌──────────────────────────────┐  │
│ │ [Avatar Photo]               │  │
│ │ Rajesh Kumar                 │  │
│ │ +91 98765 43210              │  │
│ │ rajesh@gmail.com             │  │
│ │                    [EDIT]    │  │
│ └──────────────────────────────┘  │
│                                    │
│ QUICK STATS:                       │
│ ┌──────────────────────────────┐  │
│ │ Total Orders: 145            │  │
│ │ Total Spent: ₹12,500         │  │
│ │ This Month: 12 orders        │  │
│ │ Month Spent: ₹3,250          │  │
│ └──────────────────────────────┘  │
│                                    │
│ ACCOUNT MENU:                      │
│ [🏠 Addresses]                     │
│ [🎁 Loyalty & Rewards]             │
│ [💳 Payment Methods]               │
│ [📋 Order History]                 │
│ [❓ Support]                       │
│ [⚙️ Settings]                      │
│ [🚪 Logout]                        │
│                                    │
└────────────────────────────────────┘
```

### **PROFILE CARD SECTION**

**Visual:**
```
┌─────────────────────────────────┐
│                                 │
│  [Circular Avatar - 64x64px]    │
│                                 │
│  Rajesh Kumar                   │
│  (Full Name - Bold, 18px)       │
│                                 │
│  +91 98765 43210                │
│  (Phone Number - Gray, 14px)    │
│                                 │
│  rajesh@gmail.com               │
│  (Email - Gray, 14px)           │
│                                 │
│                       [EDIT]    │
│                       (Button)  │
│                                 │
└─────────────────────────────────┘
```

**Avatar:**
- User's uploaded profile photo
- If no photo: Gradient avatar with initials "RK"
- 64x64 pixels, circular, rounded corners

**Edit Button:**
- Takes to profile edit page
- Can change: Name, email, phone, photo

### **QUICK STATISTICS**

```
Total Orders: 145
(Lifetime count of all orders placed)

Total Spent: ₹12,500
(Sum of all order totals)

This Month Orders: 12
(Orders placed in current month only)

This Month Spent: ₹3,250
(Amount spent in current month)
```

**How Calculated:**
```javascript
// Total Orders
count = orders.length

// Total Spent
total = orders.reduce((sum, order) => sum + order.total, 0)

// This Month
thisMonthOrders = orders.filter(o => 
  o.createdAt.month === currentMonth
).length

thisMonthSpent = orders
  .filter(o => o.createdAt.month === currentMonth)
  .reduce((sum, order) => sum + order.total, 0)
```

### **MENU OPTIONS**

**1. 🏠 Addresses**
- **Path:** `/addresses`
- Shows all saved delivery addresses
- Can add, edit, delete addresses
- Set default address

**2. 🎁 Loyalty & Rewards**
- **Path:** `/offers` (Loyalty tab)
- Shows loyalty points balance
- Progress to next tier
- Rewards history
- How to earn/redeem

**3. 💳 Payment Methods**
- Manage saved payment methods
- Add new credit/debit card
- Add UPI ID
- Set default payment method

**4. 📋 Order History**
- **Path:** `/orders`
- Full history of all past orders
- Can reorder from past orders
- Rate and review

**5. ❓ Support**
- **Path:** `/support`
- Contact customer service
- FAQ section
- Raise support tickets
- Live chat

**6. ⚙️ Settings**
- **Path:** `/settings`
- Notification preferences
- App theme (light/dark)
- Language selection
- Security settings
- Privacy & data

**7. 🚪 Logout**
- Clears user session
- Removes auth token
- Redirects to login page
- Confirms: "Are you sure you want to logout?"

### **DATA SOURCES**

```javascript
// Profile page makes these API calls:

1. GET /api/auth/user
   // Returns: User name, email, phone, profilePhoto
   
2. GET /api/orders
   // Returns: All orders for statistics
   
3. GET /api/addresses
   // Returns: All saved addresses
```

---

## PAGE 6: SUBSCRIPTION (Advanced Management)

**Path:** `/subscription`  
**Accessible From:** Profile menu or `/milk` link

### **PAGE LAYOUT** (Similar to MILK page but more detailed)

```
This is a more comprehensive version of the MILK page
with advanced features:

- Multiple subscriptions (user can have more than one)
- Create new subscription alongside existing
- Edit multiple active subscriptions
- Skip delivery for specific dates
- Modify quantity for future dates only
- Detailed subscription history
- Pause/resume history log
```

### **KEY DIFFERENCES FROM /milk:**

1. **Multiple Subscriptions Support:**
   ```
   User can have:
   - Daily milk subscription (2L)
   - Weekly paneer subscription (200g)
   - Monthly ghee subscription (200ml)
   
   All shown as separate tabs
   ```

2. **Advanced Controls:**
   - Skip next delivery (checkbox)
   - Modify quantity for specific future date
   - Temporarily pause for X days
   - Reschedule delivery time

---

## PAGE 7: CART (Checkout)

**Path:** `/cart`  
**Accessible From:** Shop page, floating cart button

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← SHOPPING CART                    │
├────────────────────────────────────┤
│                                    │
│ CART ITEMS:                        │
│                                    │
│ Fresh Paneer 200g                  │
│ ├─ [Item Image - 100px]            │
│ ├─ Price: ₹80 per item             │
│ ├─ Quantity: [−] 1 [+]             │
│ ├─ Subtotal: ₹80                   │
│ └─ [🗑 Remove]                     │
│                                    │
│ Pure Ghee 200ml                    │
│ ├─ [Item Image - 100px]            │
│ ├─ Price: ₹150 per item            │
│ ├─ Quantity: [−] 1 [+]             │
│ ├─ Subtotal: ₹150                  │
│ └─ [🗑 Remove]                     │
│                                    │
│ ─────────────────────────────────  │
│ PRICING:                           │
│ Subtotal ............... ₹230      │
│ Coupon Discount ........ -₹0       │
│ Delivery Fee ........... ₹20       │
│ ────────────────────────────────── │
│ TOTAL ................. ₹250       │
│                                    │
│ APPLY COUPON:                      │
│ [Enter code] [APPLY]               │
│                                    │
│ DELIVERY OPTIONS:                  │
│ Time Slot: [Today 2PM ▼]           │
│ Address: [Koramangala ▼]           │
│                                    │
│ PAYMENT METHOD:                    │
│ ○ UPI (Google Pay, PhonePe)        │
│ ○ Credit/Debit Card                │
│ ○ Net Banking                      │
│ ○ Wallet Balance                   │
│ ○ Cash on Delivery                 │
│                                    │
│    [PLACE ORDER]  [CONTINUE]       │
│                                    │
└────────────────────────────────────┘
```

### **CART ITEMS DISPLAY**

**Each Item Shows:**
```
Product Image (100x100px square)
Product Name (Bold, 16px)
Price per unit: ₹80
Unit: 200g

Quantity Controls:
[−] 1 [+]
(- decreases, + increases)

Subtotal: ₹80 × 1 = ₹80 (total for this item)

[🗑 Remove] Button (delete item)
```

**Quantity Logic:**
```javascript
// User clicks + (increase)
quantity = 1 + 1 = 2
subtotal = ₹80 × 2 = ₹160
total recalculates

// User clicks − (decrease)
if (quantity > 1) {
  quantity = 2 - 1 = 1
  subtotal = ₹80 × 1 = ₹80
}
else {
  // quantity = 1, don't go below
  Toast: "Remove item with trash icon"
}

// User clicks trash icon
// Item removed from cart entirely
// Quantity becomes 0
// Item disappears from list
// Toast: "Fresh Paneer removed from cart"
```

### **ORDER SUMMARY**

**Pricing Breakdown:**
```
Subtotal: Sum of all item subtotals
  Fresh Paneer: ₹80 × 1 = ₹80
  Pure Ghee: ₹150 × 1 = ₹150
  Total Subtotal = ₹230

Coupon Discount: -₹0 (if no coupon applied)
  or -₹15 (if FIRST15 coupon applied)

Delivery Fee: ₹20 (standard)
  or ₹0 (if subtotal > ₹200)
  
TOTAL = Subtotal - Discount + Delivery
      = ₹230 - ₹0 + ₹20 = ₹250
```

**Discount Rules:**
```javascript
if (subtotal > 200) {
  deliveryFee = 0; // Free delivery
} else {
  deliveryFee = 20;
}

if (couponApplied) {
  discount = calculateCouponValue(coupon);
} else {
  discount = 0;
}
```

### **COUPON APPLICATION**

**Enter Coupon Code:**
```
Input Field: [____________________]
            "Enter coupon code"

Button: [APPLY]

Available Coupons:
- FIRST25 (25% off, new users, min ₹100)
- MILKSUB50 (₹50 off, min ₹200)
- JANMA30 (30% off, min ₹300)
- WEEKEND15 (15% off, weekends only)
```

**Coupon Application Flow:**
```javascript
// User types: FIRST25
// User clicks: APPLY
// Validation:
  // Is coupon valid? YES
  // Is customer eligible? (new user?) YES
  // Min order met? ₹230 > ₹100? YES
// Result: Applied successfully
// Toast: "✓ Coupon applied! Saved ₹57.50"
// New total = ₹230 × 0.75 + ₹20 = ₹192.50

// If invalid coupon:
// Toast: "✗ Coupon not found or expired"

// If not eligible:
// Toast: "✗ Coupon not applicable to you"
```

### **DELIVERY OPTIONS**

**1. Time Slot:**
```
[Today 2PM ▼]

Dropdown options:
- Today 2PM - 4PM
- Today 4PM - 6PM
- Tomorrow 6AM - 8AM
- Tomorrow 8AM - 10AM
- (other available slots)
```

**2. Delivery Address:**
```
[Koramangala ▼]

Saved Addresses:
- Apt 42, Koramangala (Default) ✓
- Office, MG Road
- Home, Indiranagar

User can select or add new address
```

### **PAYMENT METHOD SELECTION**

**Options:**
```
(○) UPI (Google Pay, PhonePe, Paytm)
(○) Credit/Debit Card
(○) Net Banking
(○) Wallet Balance
(○) Cash on Delivery
```

**Select Payment Method:**
- Click radio button to select
- Shows last 4 digits if saved payment

### **ACTION BUTTONS**

**1. PLACE ORDER Button**
- Primary green button
- When clicked:
  ```javascript
  // Validate all required fields
  if (!deliveryAddress || !deliveryTime || !paymentMethod) {
    Toast: "Please fill in all required fields"
    return;
  }
  
  // Create order
  POST /api/orders {
    items: cartItems,
    deliveryAddress: selectedAddress,
    deliveryTime: selectedTime,
    paymentMethod: selectedPayment,
    total: calculatedTotal,
    coupon: appliedCoupon
  }
  
  // On success:
  // Show: "Order placed successfully! #ORD-12345"
  // Redirect to /orders page
  // Clear cart
  ```

**2. CONTINUE SHOPPING Button**
- Secondary button
- Returns to `/shop` page
- Keeps cart items saved

### **IF CART IS EMPTY**

```
🛒 YOUR CART IS EMPTY

Browse our fresh dairy products
and add items to get started!

        [START SHOPPING]
```

---

## PAGE 8: WALLET (Digital Wallet)

**Path:** `/wallet`  
**Accessible From:** Profile menu

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← WALLET                           │
├────────────────────────────────────┤
│                                    │
│ WALLET BALANCE:                    │
│ ┌──────────────────────────────┐  │
│ │ 💰 Available Balance          │  │
│ │    ₹350                       │  │
│ │                              │  │
│ │ 🎁 Rewards Points             │  │
│ │    1,250 points              │  │
│ │                              │  │
│ │ 💵 Cashback Earned            │  │
│ │    ₹85                        │  │
│ │                              │  │
│ │          [ADD MONEY]          │  │
│ └──────────────────────────────┘  │
│                                    │
│ TRANSACTION HISTORY:               │
│                                    │
│ ✓ Cashback from order #ORD-123    │
│   Credit: +₹50                    │
│   Date: 23 Aug, 10:30 AM         │
│   Status: Success                │
│                                    │
│ ✓ Payment for subscription        │
│   Debit: -₹120                   │
│   Date: 23 Aug, 06:00 AM         │
│   Status: Success                │
│                                    │
│ ✓ Money added via UPI             │
│   Credit: +₹200                  │
│   Date: 22 Aug, 02:15 PM         │
│   Status: Success                │
│                                    │
│ (Scroll to see more)              │
│                                    │
└────────────────────────────────────┘
```

### **WALLET BALANCE CARD**

**Three Main Metrics:**

1. **💰 Available Balance**
   ```
   Current: ₹350
   
   What it is: Prepaid balance in wallet
   Used for: Payment at checkout
   Sources: Added by user, cashback, rewards
   ```

2. **🎁 Rewards Points**
   ```
   Current: 1,250 points
   Next Level: 2,000 points needed
   Points to Next: 750 points
   
   What it is: Loyalty points from purchases
   How earned: 1 point per ₹1 spent
   Redeem: At checkout or for rewards
   ```

3. **💵 Cashback Earned**
   ```
   Total: ₹85
   
   What it is: Total cashback received
   How earned: From orders, referrals, promos
   Applied: Automatically to wallet
   ```

### **ADD MONEY BUTTON**

When user clicks "ADD MONEY":
```javascript
// Opens modal form:

Enter Amount: [_________]  (required)
              Min ₹100, Max ₹10,000

Select Payment Method:
○ Debit Card
○ Credit Card
○ UPI
○ Net Banking

[ADD] [CANCEL]

// User enters ₹500
// Selects UPI
// Clicks [ADD]
// Redirected to payment gateway
// On success: ₹500 added to wallet
// Toast: "✓ ₹500 added! Balance: ₹850"
```

### **TRANSACTION HISTORY**

**Each Transaction Shows:**
```
Icon (✓ for credit, ✗ for debit)
Description: What triggered the transaction
Amount: +₹50 (green for credit) or -₹120 (red for debit)
Date & Time: When it happened
Status: Success, Pending, Failed
```

**Transaction Types:**

1. **Credit Transactions (Green, +)**
   - Cashback from order
   - Money added by user
   - Referral bonus
   - Birthday reward
   - Loyalty redemption

2. **Debit Transactions (Red, −)**
   - Order payment
   - Subscription payment
   - Wallet transfer
   - Reversal/refund

**Example Transactions:**
```
1. ✓ Cashback from order #ORD-123
   +₹50 | 23 Aug, 10:30 AM | Success

2. ✗ Payment for subscription
   -₹120 | 23 Aug, 06:00 AM | Success

3. ✓ Money added via UPI
   +₹200 | 22 Aug, 02:15 PM | Success

4. ✓ Referral bonus from invite
   +₹25 | 22 Aug, 11:45 AM | Success

5. ✗ Order payment #ORD-122
   -₹80 | 21 Aug, 07:20 PM | Success
```

### **WALLET AT CHECKOUT**

When user has wallet balance:
```
PAYMENT METHOD OPTIONS:
(○) Use Wallet Balance ₹350
(○) UPI
(○) Card
(○) Net Banking
(○) Cash on Delivery

If user selects wallet:
Order Total: ₹250
Wallet Balance: ₹350
After Payment: ₹100

Toast: "Payment from wallet successful!"
```

### **AUTO-RECHARGE (Optional)**

```
[ENABLE AUTO-RECHARGE]

When wallet balance drops below ₹100:
Automatically add: ₹1,000
From saved payment method: [Debit Card]
Frequency: As needed

Enable: [✓] [✗]
```

### **API CALLS**

```javascript
// On Page Load:
GET /api/wallet
// Returns: Balance, points, cashback history

GET /api/wallet/transactions
// Returns: All wallet transactions

// On Add Money:
POST /api/wallet/add-money
// Payload: { amount, paymentMethod }

// At Checkout:
POST /api/orders
// Can include: paymentMethod: "wallet"
```

---

## PAGE 9: OFFERS & LOYALTY

**Path:** `/offers`  
**Accessible From:** Profile menu or HOME card

### **TABS LAYOUT**

```
[OFFERS] [LOYALTY] [REFERRAL]
```

### **TAB 1: OFFERS**

```
ACTIVE COUPONS:
┌──────────────────────────────────┐
│ 🎉 First Order Special           │
│                                  │
│ Get 25% off on your first order │
│ Valid until: 2025-12-31         │
│ Min order: ₹100                 │
│ Code: FIRST25                   │
│                                  │
│ [COPY CODE] [APPLY NOW]         │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ 🥛 Daily Milk Subscription      │
│                                  │
│ Subscribe to daily milk and     │
│ save ₹50 every month            │
│ Valid until: 2025-09-30         │
│ Min order: ₹200                 │
│ Code: MILKSUB50                 │
│                                  │
│ [COPY CODE] [APPLY NOW]         │
└──────────────────────────────────┘

(More offers...)
```

**Offer Card Elements:**
- Emoji icon
- Offer title
- Description
- Valid until date
- Minimum order requirement
- Coupon code
- Copy button (copies to clipboard)
- Apply button (goes to shop with code pre-filled)

### **TAB 2: LOYALTY**

```
LOYALTY PROGRAM:

Current Level: SILVER
Current Points: 1,250 pts
Next Level: GOLD (2,000 pts needed)
Progress: 750 points to next level

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BRONZE → SILVER → GOLD → PLATINUM
  (0)    (500)  (2000)  (5000)
         🟢

YOUR BENEFITS:
✓ 5% extra points on every purchase
✓ Free delivery on all orders
✓ Birthday bonus: +50 points
✓ Priority support

PROGRESS TO GOLD:
[████░░░░░░░░░░░] 750 points remaining

Estimated time: ~4 months (based on your purchase rate)

HOW TO EARN POINTS:
• 1 point per ₹1 spent
• 50 points for referral signup
• 25 points for birthday
• Bonus points during festivals

HOW TO REDEEM:
• Accumulate 50 points = ₹25 reward
• Accumulate 100 points = ₹50 reward
• Accumulate 250 points = ₹150 reward
• Accumulate 500 points = ₹300 reward

REWARD HISTORY:
✓ Earned 50 points - Order #ORD-123 | 23 Aug
✓ Redeemed 100 points - Got ₹50 reward | 20 Aug
✓ Earned 25 points - Birthday bonus | 15 Aug
```

### **TAB 3: REFERRAL PROGRAM**

```
REFER & EARN:

Your Referral Code: DN2025RAJESH

SHARE YOUR CODE:
┌──────────────────────────────────┐
│ DN2025RAJESH                     │
│              [COPY] [SHARE]      │
└──────────────────────────────────┘

HOW IT WORKS:
1️⃣ Share code with friends
   "Use my code: DN2025RAJESH"

2️⃣ Friend signs up with your code
   Gets ₹50 bonus in their wallet

3️⃣ Friend places first order
   You get ₹50 bonus in your wallet

4️⃣ Repeat unlimited!
   No limit on referrals

TOTAL REFERRALS: 5
REWARDS EARNED: ₹250 (5 × ₹50)

RECENT REFERRALS:
✓ Priya Sharma - Joined 15 Aug - ₹50 earned
✓ Amit Patel - Joined 10 Aug - ₹50 earned
✓ Neha Singh - Joined 8 Aug - ₹50 earned
✓ Vikram Kumar - Joined 3 Aug - ₹50 earned
✓ Anjali Reddy - Joined 25 Jul - ₹50 earned

SHARE ON:
[WhatsApp] [Email] [SMS] [Copy Link]
```

---

## PAGE 10: ADDRESSES

**Path:** `/addresses`  
**Accessible From:** Profile menu

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← ADDRESSES                        │
├────────────────────────────────────┤
│                                    │
│                    [+ ADD ADDRESS] │
│                                    │
│ SAVED ADDRESSES:                   │
│                                    │
│ ⭐ HOME (DEFAULT)                   │
│ ├─ Apt 42, Tower B                │
│ ├─ Koramangala, Bangalore 560034  │
│ ├─ Landmark: Next to Big Bazaar   │
│ │                                 │
│ ├─ [EDIT] [DELETE]               │
│ └─ [USE THIS ADDRESS]             │
│                                    │
│ OFFICE                             │
│ ├─ 5th Floor, TechPark            │
│ ├─ MG Road, Bangalore 560001      │
│ ├─ Landmark: Near Metro           │
│ │                                 │
│ ├─ [EDIT] [DELETE]               │
│ └─ [USE THIS ADDRESS]             │
│                                    │
│ HOME - PARENTS                     │
│ ├─ House No. 42, Indiranagar      │
│ ├─ Bangalore 560038               │
│ │                                 │
│ ├─ [EDIT] [DELETE]               │
│ └─ [USE THIS ADDRESS]             │
│                                    │
└────────────────────────────────────┘
```

### **ADDRESS CARD DETAILS**

**Each Address Shows:**
```
⭐ ADDRESS NAME (or OFFICE, HOME)
Full Address
Landmark (if saved)

Buttons:
[EDIT] - Modify address details
[DELETE] - Remove address
[USE THIS ADDRESS] - Set as default for next order
```

### **ADD ADDRESS FLOW**

User clicks "ADD ADDRESS":

```
Modal opens:

ADDRESS DETAILS:
├─ Address Name: [Home / Office / Other]
├─ Search Address: [Search with Google Maps]
│  "Koramangala, Bangalore"
│  (Shows autocomplete suggestions)
├─ Apartment/Suite (optional):
│  "Apt 42, Tower B"
├─ Landmark (optional):
│  "Next to Big Bazaar"
├─ Default Address: [☐ Set as default]
│
└─ [SAVE ADDRESS] [CANCEL]

// On Save:
POST /api/addresses {
  name: "Home",
  streetAddress: "Koramangala, Bangalore",
  apartment: "Apt 42, Tower B",
  landmark: "Next to Big Bazaar",
  isDefault: false
}

// Response:
{
  id: "addr-123",
  userId: "user-123",
  name: "Home",
  streetAddress: "Koramangala, Bangalore",
  apartment: "Apt 42, Tower B",
  landmark: "Next to Big Bazaar",
  coordinates: { lat: 12.9352, lng: 77.6245 },
  pincode: "560034",
  isDefault: false,
  createdAt: "2025-08-23T10:30:00Z"
}
```

### **EDIT ADDRESS FLOW**

User clicks "EDIT" on saved address:

```
Modal opens (pre-filled with current data):

ADDRESS DETAILS:
├─ Address Name: [Home] (editable)
├─ Search Address: [Koramangala, Bangalore] (editable)
├─ Apartment/Suite: [Apt 42, Tower B] (editable)
├─ Landmark: [Next to Big Bazaar] (editable)
├─ Default Address: [☑ Set as default]
│
└─ [SAVE CHANGES] [CANCEL]

// On Save:
PATCH /api/addresses/:id {
  // Updated fields only
}
```

---

## PAGE 11: SUPPORT

**Path:** `/support`  
**Accessible From:** Profile menu

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← SUPPORT                          │
├────────────────────────────────────┤
│                                    │
│ CONTACT US:                        │
│                                    │
│ 📱 WhatsApp                        │
│ Chat with support team instantly  │
│ Usually replies in 2-5 minutes    │
│               [CHAT ON WHATSAPP]   │
│                                    │
│ 📞 Phone Support                   │
│ Call our support center           │
│ Monday-Sunday 9AM-10PM            │
│ Toll Free: 1800-DAIRY-1           │
│               [CALL NOW]           │
│                                    │
│ 💬 Live Chat                       │
│ Chat with support agent           │
│ Online: 9AM-10PM                  │
│               [OPEN CHAT]          │
│                                    │
│ 📧 Email Support                   │
│ support@divinenaturals.com        │
│ Typical reply: Within 24 hours    │
│               [SEND EMAIL]         │
│                                    │
│ ─────────────────────────────────  │
│ FAQ:                               │
│                                    │
│ ▸ Account & Profile               │
│   ▸ How do I reset my password?   │
│   ▸ How do I update my profile?   │
│                                    │
│ ▸ Subscriptions                   │
│   ▸ Can I pause my subscription?  │
│   ▸ How do I change quantity?     │
│                                    │
│ ▸ Orders & Delivery               │
│   ▸ How do I track my order?      │
│   ▸ What if delivery is late?     │
│                                    │
│ ▸ Payments                        │
│   ▸ What payment methods are OK?  │
│   ▸ Is my payment secure?         │
│                                    │
│ ▸ Refunds & Returns               │
│   ▸ Can I return a product?       │
│   ▸ How long for refund?          │
│                                    │
│ ─────────────────────────────────  │
│ REPORT AN ISSUE:                   │
│                                    │
│ [CREATE NEW TICKET]                │
│                                    │
└────────────────────────────────────┘
```

### **CONTACT CHANNELS**

**1. WhatsApp**
- Direct chat with support team
- Fastest response time (2-5 min)
- Available 24/7
- Click button → Opens WhatsApp

**2. Phone**
- Call support center
- Toll-free number: 1800-DAIRY-1
- Hours: 9AM-10PM daily
- Average wait: 2-3 minutes

**3. Live Chat**
- Chat widget on app
- Real support agent
- Hours: 9AM-10PM daily
- Type message, get instant response

**4. Email**
- support@divinenaturals.com
- Typical reply: 24 hours
- Best for detailed issues
- Auto-reply with ticket number

### **FAQ CATEGORIES**

**Expandable FAQ Sections:**

1. **Account & Profile**
   - How do I reset my password?
   - How do I update my profile info?
   - How do I change my phone number?
   - How do I delete my account?

2. **Subscriptions**
   - How do I start a milk subscription?
   - Can I pause my subscription?
   - Can I change the quantity?
   - When can I cancel?
   - How much do I save with subscription?

3. **Orders & Delivery**
   - How do I place an order?
   - How do I track my order?
   - What if my delivery is late?
   - Can I change delivery address?
   - Do you deliver on holidays?

4. **Payments**
   - What payment methods do you accept?
   - Is my payment secure?
   - How do I save a payment method?
   - Can I get a refund?

5. **Refunds & Returns**
   - What's your return policy?
   - How do I request a refund?
   - How long does refund take?
   - What if product is damaged?

### **CREATE SUPPORT TICKET**

User clicks "CREATE NEW TICKET":

```
Modal opens:

SUPPORT TICKET FORM:

Issue Type: [Select Issue ▼]
├─ Delivery Problem
├─ Product Quality
├─ Payment Issue
├─ Account Issue
├─ Subscription Problem
├─ Refund Request
├─ Technical Issue
└─ Other

Subject: [Enter subject]
"My order arrived late"

Description: [Detailed description]
"My order #ORD-12345 was supposed 
to arrive at 3PM but arrived at 6PM"

Attachments: [Add photos/screenshots]

Order Number (optional): [ORD-12345]

[SUBMIT TICKET] [CANCEL]

// On Submit:
POST /api/support/tickets {
  userId: "user-123",
  issueType: "delivery",
  subject: "My order arrived late",
  description: "...",
  orderId: "ORD-12345",
  attachments: [...]
}

// Response:
Ticket Created!
Ticket #: SUP-45678
Your ticket number for reference
Support team will contact within 24 hours
```

---

## PAGE 12: NOTIFICATIONS

**Path:** `/notifications`  
**Accessible From:** Bell icon or Profile menu

### **PAGE LAYOUT**

```
┌────────────────────────────────────┐
│ ← NOTIFICATIONS                    │
├────────────────────────────────────┤
│                                    │
│ Filters: [All] [Unread] [Offers]  │
│ Search: [Search notifications]    │
│                                    │
│ TODAY:                             │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ 📦 Order #ORD-12345          │  │
│ │    Out for Delivery          │  │
│ │ Your order is on the way!    │  │
│ │ Estimated: 3:45 PM          │  │
│ │                              │  │
│ │ 10:30 AM  [TRACK] [×]        │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ 🎁 Special Offer             │  │
│ │    Get 25% off on milk       │  │
│ │ Limited time offer for you   │  │
│ │                              │  │
│ │ 10:15 AM  [VIEW] [×]         │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ 💳 Payment Confirmed         │  │
│ │    ₹250 for Order #ORD-12346 │  │
│ │                              │  │
│ │ 06:00 AM  [RECEIPT] [×]      │  │
│ └──────────────────────────────┘  │
│                                    │
│ YESTERDAY:                         │
│ (older notifications...)          │
│                                    │
└────────────────────────────────────┘
```

### **NOTIFICATION TYPES**

**Icons & Badges:**
- 📦 Order Updates (Blue)
- 🚚 Delivery Updates (Orange)
- 🎁 Offers & Promotions (Green)
- 💳 Payments (Purple)
- 🔔 General Alerts (Gray)

**Notification Messages:**
```
1. ORDER PLACED
   "Order #ORD-12345 placed successfully!"

2. ORDER CONFIRMED
   "Vendor confirmed your order #ORD-12345"

3. PREPARING
   "Your order is being prepared"

4. OUT FOR DELIVERY
   "Your order is on the way! ETA: 3:45 PM"

5. DELIVERED
   "Order delivered! Rate your experience"

6. PAYMENT CONFIRMED
   "₹250 payment confirmed for order #ORD-12345"

7. OFFER
   "Get 25% off on milk! Use code: FIRST25"

8. SUBSCRIPTION CREATED
   "Milk subscription active! First delivery: tomorrow"

9. REWARD EARNED
   "You earned 50 loyalty points!"

10. REFERRAL SUCCESS
    "Your friend signed up! ₹50 bonus added"
```

### **NOTIFICATION ACTIONS**

**Buttons Per Notification:**
- **[TRACK]** - Track order delivery
- **[VIEW]** - View offer details
- **[RECEIPT]** - Download payment receipt
- **[×]** - Dismiss/delete notification

### **NOTIFICATION SETTINGS**

When user taps gear icon:

```
NOTIFICATION PREFERENCES:

✓ Order Updates
  Notify on order status changes

✓ Delivery Alerts
  Notify when delivery nearby

✓ Offers & Promotions
  Notify about special deals

✓ Payment Alerts
  Notify on payment success/failure

✓ Subscription Updates
  Notify on subscription changes

NOTIFICATION METHOD:

✓ Push Notifications (App)
✓ Email Notifications
✓ SMS Notifications

DO NOT DISTURB:

From: 10:00 PM
To:   8:00 AM
(No notifications during these hours)

[SAVE PREFERENCES]
```

---

## PAGE 13: SETTINGS

**Path:** `/settings`  
**Accessible From:** Profile menu

### **SETTINGS SECTIONS**

**1. Profile Information**
```
Edit Name
- First Name: [Rajesh]
- Last Name: [Kumar]

Edit Email
- Current: rajesh@gmail.com
- New: [________]
- Verify: [Verify email]

Edit Phone
- Current: +91 98765 43210
- New: [________]
- Verify: [Verify phone]

Profile Photo
- [Upload Photo]
- [Remove Photo]
```

**2. Notification Preferences**
```
✓ Order notifications
✓ Delivery alerts
✓ Offer notifications
✓ Marketing emails
✓ SMS notifications
✓ Push notifications

Frequency: [Daily ▼]
Do Not Disturb: 10PM - 8AM
```

**3. App Preferences**
```
Theme:
○ Light Mode
○ Dark Mode
○ System Default

Language: [English ▼]
Default Address: [Koramangala ▼]
Currency: [INR (₹) ▼]
Font Size: [Normal ▼]
Accessibility: [Options...]
```

**4. Security Settings**
```
Change Password
- Current Password: [••••••••]
- New Password: [••••••••]
- Confirm Password: [••••••••]
[CHANGE PASSWORD]

Two-Factor Authentication: [Enable]

Active Sessions
- iPhone (Current Location)
- Samsung Galaxy (3 days ago)
- [Logout all other sessions]

Login History
- 23 Aug, 3:01 PM - iPhone
- 22 Aug, 6:15 AM - Android
- 20 Aug, 10:30 PM - Web
```

**5. Privacy & Data**
```
Privacy Policy: [Read]
Terms of Service: [Read]

Data Export: [Download my data]
Delete Account: [Delete permanently]

Tracking: [Allow / Deny]
Cookies: [Manage preferences]
```

**6. Help & Support**
```
About App
- Version: 1.0.0
- Build: 2024.08.23
- Last Updated: 23 Aug 2025

Help Center: [Open]
Report Issue: [Report bug]
Send Feedback: [Feedback form]
```

---

## USER JOURNEYS

### **JOURNEY 1: New Customer - First Order**

```
Step 1: Landing Page
├─ User sees app
├─ Clicks "Get Started"
└─ Redirected to phone entry

Step 2: Phone Entry
├─ Enters: +91 98765 43210
├─ Clicks "Get OTP"
└─ SMS received with OTP

Step 3: OTP Verification
├─ Enters: 123456
├─ Clicks "Verify"
└─ Redirected to address setup

Step 4: Address Setup
├─ Enters delivery address
├─ Selects Koramangala
├─ Clicks "Complete Setup"
└─ Redirected to /home

Step 5: Browse Products
├─ Clicks SHOP tab
├─ Sees 8 products
├─ Clicks "ADD TO CART" on 3 items
└─ Cart has 3 items

Step 6: Checkout
├─ Clicks floating cart button
├─ Reviews items and pricing
├─ Enters coupon: FIRST25 (25% off for new user)
├─ Selects delivery time: Today 6PM
├─ Selects payment: UPI
└─ Clicks "PLACE ORDER"

Step 7: Order Placed
├─ Toast: "✓ Order placed! #ORD-12345"
├─ Redirected to /orders
├─ Order shows status: Pending
└─ Can track order

TIME: ~5 minutes
SUCCESS: ✓ First order complete
```

### **JOURNEY 2: Existing Customer - Setup Milk Subscription**

```
Step 1: Home Dashboard
├─ Logged in
├─ Sees "NO MILK SUBSCRIPTION" card
└─ Clicks "SET UP SUBSCRIPTION"

Step 2: Milk Page
├─ Sees subscription form
├─ Sets quantity: 2 Liters
├─ Sets frequency: Daily
├─ Sets time: 6:00 AM - 8:00 AM
├─ Monthly cost shows: ₹1,800
└─ Clicks "SAVE"

Step 3: Subscription Active
├─ Toast: "✓ Subscription created!"
├─ /milk page shows active subscription
├─ Next 30 days schedule visible
├─ Can see first delivery: Tomorrow 6:30 AM
└─ Monthly billing set up

Step 4: Automatic Deliveries
├─ Every day at 6:30 AM
├─ 2 Liters delivered
├─ Auto-charged ₹60/day from wallet
├─ Can modify/pause anytime
└─ Loyalty points earned (54 pts/month)

TIME: ~2 minutes
SUCCESS: ✓ Subscription active for 30 days
```

### **JOURNEY 3: Track Delivery**

```
Step 1: Home or Orders Page
├─ See active order
├─ Status: "Out for Delivery"
└─ Clicks "TRACK"

Step 2: Real-Time Map
├─ Google Maps loads
├─ Delivery partner location shown
├─ Order route visible
├─ ETA: 15 minutes
├─ Can see delivery partner:
│  ├─ Name: Ramesh Kumar
│  ├─ Rating: ⭐ 4.8
│  ├─ Phone: +91 98765 43210
│  └─ Vehicle: Bike
└─ Location updates in real-time

Step 3: Arrival
├─ Delivery partner gets closer
├─ ETA updates: 5 min → 2 min → 0 min
├─ Doorbell rings
├─ User receives items
└─ Can accept/decline

Step 4: Order Complete
├─ Order marked as "Delivered"
├─ Toast: "✓ Order delivered!"
├─ Rating & review prompt appears
├─ Can rate 1-5 stars
├─ Can write review
└─ Cashback applied: ₹10

TIME: ~30 minutes (delivery time varies)
SUCCESS: ✓ Order tracking complete
```

---

## API ENDPOINTS USED

### **Authentication**
```
POST /api/auth/send-otp
- Sends OTP to phone via SMS

POST /api/auth/verify-otp
- Verifies OTP and creates/logs in user

GET /api/auth/user
- Returns current user info
```

### **Milk Subscription**
```
GET /api/milk-subscription
- Returns user's milk subscription or empty

POST /api/milk-subscription
- Creates new milk subscription

PATCH /api/milk-subscription/:id
- Updates subscription (quantity, frequency, time)

DELETE /api/milk-subscription/:id
- Cancels subscription
```

### **Products & Shop**
```
GET /api/products
- Returns all 8 products with details

GET /api/products?category=milk
- Returns products filtered by category
```

### **Orders**
```
GET /api/orders
- Returns all user orders (active + past)

POST /api/orders
- Creates new order

GET /api/orders/:id
- Returns specific order details

PUT /api/orders/:id
- Updates order (tracking, status)
```

### **Addresses**
```
GET /api/addresses
- Returns all saved addresses

POST /api/addresses
- Creates new address

PATCH /api/addresses/:id
- Updates address details

DELETE /api/addresses/:id
- Deletes address
```

### **Wallet**
```
GET /api/wallet
- Returns wallet balance and points

GET /api/wallet/transactions
- Returns transaction history

POST /api/wallet/add-money
- Adds money to wallet

GET /api/wallet/rewards
- Returns loyalty points info
```

### **Notifications**
```
GET /api/notifications
- Returns all notifications

PUT /api/notifications/:id
- Marks notification as read

DELETE /api/notifications/:id
- Deletes notification
```

### **Support**
```
POST /api/support/tickets
- Creates support ticket

GET /api/support/tickets
- Returns user's support tickets

GET /api/support/faq
- Returns FAQ content
```

---

## DATA MODELS

### **User Model**
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImageUrl?: string;
  role: "customer" | "admin" | "vendor" | "delivery";
  createdAt: Date;
  updatedAt: Date;
}
```

### **Order Model**
```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  total: number;
  deliveryAddress: Address;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  paymentMethod: "upi" | "card" | "wallet" | "cash";
  paymentStatus: "pending" | "completed" | "failed";
  deliveryPartner?: {
    name: string;
    phone: string;
    rating: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}
```

### **Product Model**
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  stock: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Subscription Model**
```typescript
interface Subscription {
  id: string;
  userId: string;
  productType: string;
  quantity: number;
  frequency: "daily" | "weekly" | "monthly";
  deliveryTime: string;
  status: "active" | "paused" | "cancelled";
  startDate: Date;
  nextDeliveryDate: Date;
  pausedUntil?: Date;
  monthlyPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Wallet Model**
```typescript
interface Wallet {
  id: string;
  userId: string;
  balance: number;
  rewardsPoints: number;
  cashbackEarned: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  status: "success" | "pending" | "failed";
  createdAt: Date;
}
```

### **Address Model**
```typescript
interface Address {
  id: string;
  userId: string;
  name: string;
  streetAddress: string;
  apartment?: string;
  landmark?: string;
  coordinates: { lat: number; lng: number };
  pincode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## UI COMPONENTS

### **Reusable Components Used**

1. **Cards** - Display data in contained boxes
2. **Buttons** - Primary (green), Secondary (outline), Tertiary (text)
3. **Input Fields** - Text, email, phone, number inputs
4. **Dropdowns** - Select from options
5. **Modals** - Pop-ups for forms and confirmations
6. **Toast Notifications** - Success/error messages
7. **Badges** - Status indicators
8. **Tabs** - Switch between sections
9. **Rating Stars** - 1-5 star ratings
10. **Search Bar** - Filter/search functionality
11. **Floating Buttons** - Fixed cart button
12. **Bottom Navigation** - Fixed nav tabs
13. **Loading Spinners** - Loading states
14. **Empty States** - When no data
15. **Charts** - Data visualization (if used)

---

This completes the ultra-detailed customer app documentation!
