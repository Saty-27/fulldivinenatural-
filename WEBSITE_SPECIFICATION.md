# Divine Naturals - Complete Website Specification & Prompt

## 🎯 Project Overview

**Divine Naturals** is a comprehensive enterprise-level dairy delivery application that connects customers with fresh, organic dairy products through a mobile-first web platform. The tagline is **"Pure. Fresh. Daily."**

## 🏢 Business Model

Divine Naturals operates as a multi-stakeholder dairy delivery ecosystem with four distinct user roles:

1. **Customers** - Order fresh dairy products and manage subscriptions
2. **Vendors** - Supply dairy products from their farms
3. **Delivery Partners** - Handle logistics and last-mile delivery
4. **Administrators** - Manage the entire platform and operations

## 🎨 Design System & Branding

### Core Design Philosophy
- **Simple and Clean**: Professional dairy business aesthetic without complex visual effects
- **No Premium Effects**: Avoid neumorphism, glassmorphism, or overly decorative elements
- **Eco-Friendly**: Natural, organic, and sustainable visual language
- **Mobile-First**: Optimized for mobile devices with responsive layouts for tablet and desktop

### Brand Identity
- **Logo**: Tree logo representing natural, organic origins (file: `WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg`)
- **Brand Name**: Divine Naturals (displayed consistently across all pages)
- **Tagline**: "Pure. Fresh. Daily."

### Color Palette (Eco-Friendly Theme)
```css
:root {
  /* Primary Colors - Soft Greens */
  --eco-primary: hsl(142, 71%, 45%);        /* Fresh green for primary actions */
  --eco-secondary: hsl(160, 84%, 20%);      /* Deep forest green for text */
  --eco-accent: hsl(142, 76%, 36%);         /* Vibrant green for highlights */
  
  /* Neutral Colors - Creamy Whites & Soft Grays */
  --eco-cream: hsl(47, 100%, 97%);          /* Warm cream background */
  --eco-light: hsl(138, 26%, 94%);          /* Light mint background */
  
  /* Text Colors */
  --eco-text-primary: hsl(160, 84%, 20%);   /* Dark green for headings */
  --eco-text-muted: hsl(160, 20%, 45%);     /* Muted green for secondary text */
  
  /* Accent Colors for Categories */
  --eco-blue: hsl(200, 70%, 50%);           /* Fresh blue for delivery/water */
  --eco-yellow: hsl(45, 95%, 60%);          /* Golden yellow for premium/butter */
  --eco-orange: hsl(25, 90%, 55%);          /* Warm orange for offers */
}
```

### Typography
- **Headings**: Bold, black weight (font-weight: 900) for maximum impact
- **Body Text**: Semi-bold (font-weight: 600) for readability
- **Hierarchy**: Clear distinction between h1 (2xl-3xl), h2 (xl), h3 (lg)

### UI Components Style
- **Cards**: Rounded corners (rounded-3xl, rounded-2xl), subtle shadows, border accents
- **Buttons**: 
  - Primary: Green gradient backgrounds with white text
  - Secondary: Outline style with green borders
  - Round corners and generous padding
- **Input Fields**: Clean borders, rounded corners, focus states with green accent
- **Icons**: Lucide React icons for consistency
- **Spacing**: Generous padding (p-4, p-6) for breathing room

## 📱 Application Architecture

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom eco-friendly color variables
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query v5 for server state
- **Forms**: React Hook Form with Zod validation

### Backend Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

## 🗂️ Complete Database Schema

```typescript
// Users Table
users {
  id: serial (primary key)
  email: text (unique)
  password: text
  role: text (enum: 'customer', 'admin', 'vendor', 'delivery')
  firstName: text
  lastName: text
  phone: text
  createdAt: timestamp
  isActive: boolean
}

// Products Table
products {
  id: serial (primary key)
  name: text
  description: text
  category: text (enum: 'milk', 'dairy', 'sweets', 'beverages')
  price: numeric
  unit: text
  stockQuantity: integer
  imageUrl: text
  nutritionInfo: json
  tags: text[]
  isAvailable: boolean
}

// Orders Table
orders {
  id: serial (primary key)
  userId: integer (foreign key -> users)
  customerName: text
  customerPhone: text
  deliveryAddress: text
  deliveryDate: date
  deliveryTime: text
  status: text (enum: 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')
  totalAmount: numeric
  paymentMethod: text
  paymentStatus: text
  deliveryPartnerId: integer (foreign key -> delivery_partners)
  createdAt: timestamp
}

// Order Items Table
orderItems {
  id: serial (primary key)
  orderId: integer (foreign key -> orders)
  productId: integer (foreign key -> products)
  quantity: integer
  price: numeric
  unit: text
}

// Milk Subscriptions Table
milkSubscriptions {
  id: serial (primary key)
  userId: integer (foreign key -> users)
  milkType: text
  quantity: numeric
  unit: text
  deliveryTime: text (enum: 'morning', 'evening', 'both')
  frequency: text (enum: 'daily', 'alternate', 'weekdays')
  startDate: date
  endDate: date
  status: text (enum: 'active', 'paused', 'cancelled')
  deliveryAddress: text
  specialInstructions: text
  autoPayment: boolean
  monthlyAmount: numeric
}

// Vendors Table
vendors {
  id: serial (primary key)
  businessName: text
  ownerName: text
  phone: text
  email: text
  address: text
  farmLocation: text
  licenseNumber: text
  rating: numeric
  totalProducts: integer
  monthlyRevenue: numeric
  status: text (enum: 'active', 'inactive', 'suspended')
  certifications: text[]
}

// Delivery Partners Table
deliveryPartners {
  id: serial (primary key)
  firstName: text
  lastName: text
  phone: text
  email: text
  vehicleType: text
  vehicleNumber: text
  licenseNumber: text
  zone: text
  rating: numeric
  totalDeliveries: integer
  status: text (enum: 'available', 'busy', 'offline')
  currentLocation: json
}

// Notifications Table
notifications {
  id: serial (primary key)
  userId: integer (foreign key -> users)
  title: text
  message: text
  type: text (enum: 'delivery', 'offer', 'subscription', 'system')
  priority: text (enum: 'high', 'medium', 'low')
  isRead: boolean
  createdAt: timestamp
}

// Wallet Transactions Table
walletTransactions {
  id: serial (primary key)
  userId: integer (foreign key -> users)
  type: text (enum: 'credit', 'debit')
  amount: numeric
  description: text
  balanceAfter: numeric
  referenceId: text
  createdAt: timestamp
}

// Addresses Table
addresses {
  id: serial (primary key)
  userId: integer (foreign key -> users)
  type: text (enum: 'home', 'work', 'other')
  name: text
  phone: text
  addressLine1: text
  addressLine2: text
  landmark: text
  city: text
  state: text
  pincode: text
  instructions: text
  isDefault: boolean
}

// Support Tickets Table
supportTickets {
  id: serial (primary key)
  userId: integer (foreign key -> users)
  category: text
  subject: text
  description: text
  status: text (enum: 'open', 'in-progress', 'resolved', 'closed')
  orderId: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🌟 Complete Feature List

### 1. Customer Application (16+ Major Features)

#### **A. Milk Subscription Management** (`/subscription`)
**Purpose**: Manage recurring milk deliveries

**Features**:
- Create new subscription with:
  - Milk type selection (Toned, Full Cream, A2 Cow, Buffalo, Skimmed)
  - Quantity and unit selection
  - Delivery time slots (Morning 6-8 AM, Evening 6-8 PM, Both)
  - Frequency options (Daily, Alternate Days, Weekdays Only)
  - Start and end dates
  - Auto-payment toggle
  - Delivery address selection
  - Special instructions field

- Subscription Management:
  - View active subscription details
  - Pause subscription temporarily
  - Resume paused subscription
  - Modify quantity and delivery time
  - Cancel subscription with confirmation
  - Upcoming deliveries calendar view
  - Billing history and next payment date

- Visual Elements:
  - Subscription status indicator (Active/Paused/Cancelled)
  - Monthly cost breakdown
  - Delivery schedule visualization
  - Quick action buttons (Pause, Resume, Modify, Cancel)

#### **B. Shopping Cart & Checkout** (`/cart`)
**Purpose**: Browse products and complete purchases

**Features**:
- Product Catalog:
  - Categories: Milk, Dairy Products, Sweets, Beverages
  - Product cards with image, name, price, unit
  - Quick add to cart buttons
  - Product search and filtering
  - Nutritional information display

- Shopping Cart:
  - Item list with quantity controls (+/-)
  - Remove items functionality
  - Real-time price calculations
  - Apply coupon codes
  - Saved items for later
  - Cart summary with subtotal, delivery fee, discounts, total

- Checkout Process:
  - Delivery address selection/add new
  - Delivery time slot picker (6-8 AM, 6-8 PM, Custom)
  - Preferred delivery date calendar
  - Payment method selection:
    - UPI (Google Pay, PhonePe, Paytm)
    - Credit/Debit Card
    - Net Banking
    - Cash on Delivery
    - Wallet Balance
  - Order review before confirmation
  - Special delivery instructions
  - Order confirmation with order ID

#### **C. Digital Wallet & Payments** (`/wallet`)
**Purpose**: Manage wallet balance and transactions

**Features**:
- Wallet Dashboard:
  - Current balance display (large, prominent)
  - Recent transactions list
  - Quick action buttons (Add Money, Send, Request)

- Add Money:
  - Preset amounts (₹100, ₹500, ₹1000, ₹2000)
  - Custom amount input
  - Payment method selection
  - Instant wallet credit

- Transaction History:
  - Chronological list with infinite scroll
  - Filter by type (All, Credit, Debit, Refund)
  - Date range filtering
  - Transaction details:
    - Type (Credit/Debit)
    - Amount with color coding (green/red)
    - Description
    - Date and time
    - Balance after transaction
    - Download receipt option

- Rewards & Cashback:
  - Reward points balance
  - Points to currency conversion
  - Cashback offers list
  - Redeem points functionality

- Auto-Pay Settings:
  - Enable/disable auto-deduction for subscriptions
  - Set auto-reload threshold
  - Configure auto-reload amount

#### **D. Offers & Loyalty Program** (`/offers`)
**Purpose**: View deals, earn rewards, and manage referrals

**Features**:
- Active Offers Section:
  - Banner offers with countdown timers
  - Discount coupons with codes
  - First-time user offers
  - Category-specific deals
  - Minimum order requirements
  - Validity dates
  - Apply/Copy code buttons

- Loyalty Rewards:
  - Points balance dashboard
  - Points earning rules:
    - ₹100 spent = 10 points
    - Daily login bonus
    - Order completion rewards
    - Review submission points
  - Points redemption options
  - Tier system (Silver, Gold, Platinum)
  - Benefits by tier
  - Progress to next tier

- Referral Program:
  - Personal referral code
  - Share via WhatsApp, SMS, Email, Social Media
  - Referral stats:
    - Friends referred
    - Successful signups
    - Earnings from referrals
  - Referral rewards (₹50 for referrer + ₹50 for referee)
  - Referral history

- Scratch Cards:
  - Daily scratch card opportunity
  - Animated scratch-to-reveal
  - Prizes (Cashback, Free delivery, Discount coupons)
  - Claim and auto-apply to wallet

- Seasonal Campaigns:
  - Festival offers
  - Limited-time flash sales
  - Bundle deals

#### **E. Address Management** (`/addresses`)
**Purpose**: Manage multiple delivery locations

**Features**:
- Address List:
  - All saved addresses displayed
  - Address type indicators (Home, Work, Other) with icons
  - Default address highlighted
  - Edit and Delete options
  - Set as default functionality

- Add/Edit Address Form:
  - Address type selection (Home/Work/Other)
  - Full name
  - Phone number
  - Address line 1 (mandatory)
  - Address line 2 (optional)
  - Landmark
  - City, State, Pincode
  - Delivery instructions
  - Mark as default checkbox

- Map Integration:
  - Pin-drop location picker
  - GPS auto-detect current location
  - Address autocomplete
  - Visual map display

- Delivery Tips:
  - Best practices for address entry
  - Importance of landmarks
  - Delivery instruction examples

#### **F. Customer Support & Help** (`/support`)
**Purpose**: Get help and resolve issues

**Features**:
- Quick Contact Options:
  - Live Chat (instant messaging)
  - Phone Support (+91 80123 45678, 24/7)
  - WhatsApp Support
  - Email Support (support@divinenaturals.com)
  - Response time indicators

- FAQ Section:
  - Categorized questions:
    - Delivery Related
    - Milk Quality & Sources
    - Subscription Management
    - Payments & Refunds
    - Product Information
  - Search functionality
  - Expandable accordion answers
  - Helpful/Not helpful feedback

- Support Ticket System:
  - Create New Ticket:
    - Category selection (Delivery Issue, Product Quality, Payment Problem, etc.)
    - Subject line
    - Detailed description
    - Order ID (optional)
    - Attach images/screenshots
  - My Tickets:
    - Ticket list with status
    - Ticket ID
    - Status badges (Open, In Progress, Resolved, Closed)
    - Created and last updated dates
    - View ticket details and conversation
    - Add follow-up messages

- Knowledge Base:
  - How-to guides
  - Video tutorials
  - Common issues and solutions

- Service Commitments:
  - Live chat: Instant response
  - Phone: Within 30 seconds
  - Email: Within 2 hours
  - Issue resolution: Within 24 hours

#### **G. Notifications Center** (`/notifications`)
**Purpose**: Manage all app notifications and preferences

**Features**:
- Notification Dashboard:
  - Unread count badge
  - Quick stats (Unread, Delivery, Offers, Products)
  - Filter options:
    - All notifications
    - Unread only
    - Delivery updates
    - Offers & promotions
    - Subscription reminders

- Notification List:
  - Chronological display
  - Visual priority indicators (high, medium, low)
  - Category icons (Delivery, Offer, System, Product)
  - Notification cards with:
    - Title
    - Message preview
    - Timestamp
    - Read/Unread status
    - Priority color coding
  - Mark as read/unread
  - Delete individual notifications
  - Bulk actions (Mark all as read, Clear all)

- Notification Types:
  - **Delivery Updates**: 
    - Order confirmed
    - Out for delivery
    - Delivered
    - Delayed notifications
  - **Offers**: 
    - New deals
    - Limited-time offers
    - Personalized discounts
  - **Subscription**: 
    - Renewal reminders
    - Payment confirmations
    - Pause/Resume confirmations
  - **Product**: 
    - New product launches
    - Stock availability
    - Price changes
  - **System**: 
    - App updates
    - Service announcements
    - Maintenance notifications

- Notification Preferences:
  - What to notify about:
    - Delivery updates (toggle)
    - Order updates (toggle)
    - Offers & promotions (toggle)
    - New products (toggle)
    - Subscription reminders (toggle)
    - Community updates (toggle)
  
  - How to receive:
    - Push notifications (toggle)
    - SMS notifications (toggle)
    - Email notifications (toggle)
    - WhatsApp notifications (toggle)
  
  - Quiet hours setting
  - Notification sound preferences

- Quick Actions:
  - Test notification button
  - Notification history (last 30 days)
  - Export notification log

#### **H. Wellness & Community** (`/wellness`)
**Purpose**: Track health goals and engage with community

**Features**:
- Wellness Tracking:
  - **Health Score Dashboard**:
    - Overall health score (0-100)
    - Score breakdown by category
    - Progress visualization
    - Achievement badges
  
  - **Daily Goals**:
    - Milk consumption target (liters)
    - Progress bar with current consumption
    - Goal completion percentage
    - Motivational messages
  
  - **Monthly Targets**:
    - Monthly consumption goal
    - Current month progress
    - Comparison with previous months
    - Trend chart
  
  - **Eco Impact**:
    - Plastic bags saved (by using reusable containers)
    - CO₂ reduced (local sourcing benefits)
    - Fresh milk consumed (vs packaged)
    - Environmental impact visualization

- Achievements System:
  - Badge collection:
    - Eco Warrior (saved 25+ plastic bags)
    - Health Champion (met monthly goals)
    - Community Helper (shared 5+ posts)
    - Recipe Master (tried 10+ recipes)
  - Locked and unlocked badges
  - Progress to unlock
  - Share achievements on social media

- Educational Content:
  - **Articles**:
    - Health benefits of A2 milk
    - Farm-to-table journey
    - Nutritional guides
    - Recipes with dairy
    - Organic farming practices
    - Read time indicators
    - Categories and tags
  
  - **Videos**:
    - Farm tours
    - Product making processes
    - Recipe tutorials
    - Expert interviews
    - Duration and view counts
    - Play inline or fullscreen

- Community Features:
  - **User Posts**:
    - Share experiences with Divine Naturals
    - Upload photos (recipes, products)
    - Like and comment on posts
    - User profiles with avatars
    - Timestamp display
  
  - **Create Post**:
    - Text post
    - Photo upload
    - Recipe sharing
    - Tips and tricks
    - Tag products

  - **Community Stats**:
    - Total community members
    - Stories shared
    - Average satisfaction rating

#### **I. Festival Specials & Seasonal Offers** (`/festivals`)
**Purpose**: Browse festival-specific products and offers

**Features**:
- Current Festival Banner:
  - Festival name and emoji
  - Festival description
  - Countdown timer:
    - Days remaining
    - Hours remaining
    - Minutes remaining
  - End date display
  - Visual festival theme

- Festival Products:
  - Special product collections:
    - Janmashtami: Sweets combos, butter, ghee
    - Ganesh Chaturthi: Modak ingredients
    - Diwali: Gift hampers, premium products
    - Christmas: Celebration packages
  
  - Product Cards:
    - High-quality images
    - Festival pricing
    - Original price (strikethrough)
    - Discount percentage badge
    - Limited edition badge
    - Star ratings and reviews
    - Add to cart button
  
  - Product Details:
    - Complete description
    - Ingredients/contents
    - Expiry/freshness dates
    - Storage instructions

- Gift Hampers:
  - Pre-curated gift boxes:
    - Premium Family Hamper
    - Traditional Celebration Box
    - Divine Naturals Special
  - Hamper contents list
  - Price and value proposition
  - Best seller badges
  - Send as gift option with greeting card
  - Delivery date selection

- Upcoming Festivals:
  - Calendar of upcoming festivals
  - Festival date
  - Planned special offers preview
  - "Notify Me" for advance alerts
  - Festival preparation tips

- Festival Offers:
  - Minimum order discounts
  - Free delivery thresholds
  - Complimentary gift items
  - Bundle deals
  - Validity period

- Customer Reviews:
  - Previous festival product reviews
  - Star ratings
  - Customer testimonials
  - Photo reviews

#### **J. Settings & Security** (`/settings`)
**Purpose**: Manage account, preferences, and security

**Features**:
- **Profile Information**:
  - Edit first name and last name
  - Update email address (with verification)
  - Change phone number (with OTP)
  - Profile photo upload
  - Bio/description

- **App Preferences**:
  - **Theme Settings**:
    - Light mode
    - Dark mode
    - System default
    - Theme preview
  
  - **Language Settings**:
    - English
    - Hindi (हिंदी)
    - Marathi (मराठी)
    - Kannada (ಕನ್ನಡ)
    - Tamil (தமிழ்)
  
  - **Currency Display**:
    - INR (₹)
    - USD ($)
  
  - **Measurement Units**:
    - Liters/Milliliters
    - Kilograms/Grams

- **Notification Preferences**:
  - Push notifications toggle
  - Email notifications toggle
  - SMS notifications toggle
  - Category-wise toggles:
    - Order updates
    - Delivery alerts
    - Offers and promotions
    - New products
    - Subscription reminders
    - Community updates

- **Security Settings**:
  - **Password Management**:
    - Change password form
    - Current password verification
    - New password (with strength meter)
    - Confirm new password
    - Password requirements display
  
  - **Two-Factor Authentication**:
    - Enable/disable 2FA
    - SMS-based OTP
    - Authenticator app option
    - Backup codes generation
  
  - **Biometric Login**:
    - Fingerprint authentication toggle
    - Face ID toggle (if supported)
  
  - **Session Management**:
    - Session timeout setting (15, 30, 60 minutes)
    - Auto-logout on inactivity

- **Device Management**:
  - Active sessions list:
    - Device name (iPhone, MacBook, etc.)
    - Device type icon
    - Location (city)
    - Last active timestamp
    - Current device indicator
    - Logout from device button
  - Logout from all devices option

- **Privacy Controls**:
  - Profile visibility (Public/Private)
  - Data sharing preferences
  - Analytics and tracking toggles
  - Marketing communications opt-in/out
  - Third-party data sharing

- **Data Management**:
  - Export account data:
    - Orders history
    - Subscription details
    - Transaction records
    - Personal information
    - Download as JSON/CSV
  
  - Import data from another service
  
  - Clear cache and app data

- **Danger Zone** (Red-bordered section):
  - Delete account permanently:
    - Warning message
    - Consequences explanation
    - Type "DELETE" confirmation
    - Final confirmation dialog
    - Account deletion with data removal

- **Legal & Policies**:
  - Privacy Policy link
  - Terms of Service link
  - Cookie Policy
  - Data Protection Policy
  - Refund and Cancellation Policy
  - Community Guidelines

#### **K. Enhanced Order Management** (`/orders`)
**Purpose**: Track all orders with comprehensive details

**Features**:
- Order Dashboard:
  - Summary cards:
    - Active orders count
    - Completed orders count
    - Average rating
  - Search orders by ID or product
  - Filter by status

- Tabs:
  - **Active Orders**: Pending, Confirmed, Preparing, Out for Delivery
  - **Past Orders**: Delivered, Cancelled

- Order Card Details:
  - Order ID
  - Order date
  - Status badge with color coding
  - Estimated time arrival (for active)
  
  - **Product Details**:
    - Product images
    - Product names
    - Quantity and unit
    - Price per item
  
  - **Delivery Information**:
    - Full delivery address
    - Delivery time slot
    - Delivery date
    - Delivery partner details:
      - Name
      - Phone number
      - Vehicle number
      - Partner rating
  
  - **Order Progress** (Active orders):
    - Visual progress tracker
    - Stages: Confirmed → Preparing → Out for Delivery → Delivered
    - Current stage highlighted
    - Completed stages in green
  
  - **Total Amount**:
    - Breakdown (Subtotal, Delivery fee, Discounts)
    - Final total
    - Payment method used
    - Payment status
  
  - **Action Buttons**:
    - Active Orders:
      - Live Track (opens map with real-time location)
      - Call Delivery Partner
      - Message Partner
      - Support/Help
    
    - Past Orders:
      - Download Invoice/Receipt (PDF)
      - Reorder (add items to cart)
      - Rate Order
      - Save to favorites
  
  - **Rating System** (Delivered orders):
    - 5-star rating interface
    - Feedback text area
    - Rate delivery partner separately
    - Rate product quality
    - Upload photos
    - Submit rating button
  
  - **Existing Ratings Display**:
    - Stars display
    - Written feedback
    - Date of rating
    - Photos uploaded

- Empty States:
  - "No active orders" with call-to-action
  - "No past orders" message
  - Encouraging messaging to start shopping

### 2. Core Customer Pages

#### **Home Page** (`/home`)
**Purpose**: Main landing page after login

**Features**:
- Welcome header with user name
- Quick action cards:
  - Schedule milk delivery
  - Browse shop
  - View orders
  - Check offers
- Today's delivery status
- Subscription overview widget
- Featured products carousel
- Recent orders summary
- Wallet balance widget
- Notification bell with unread count

#### **Milk Subscription** (`/milk`)
**Purpose**: Dedicated milk subscription interface

**Features**:
- Current subscription status card
- Milk type options with images
- Quantity selector
- Delivery schedule configurator
- Subscription management controls
- Delivery calendar
- Billing information

#### **Shop** (`/shop`)
**Purpose**: Product browsing and shopping

**Features**:
- Product categories tabs
- Product grid with images
- Add to cart functionality
- Quick view modal
- Product details page
- Filter and sort options
- Cart icon with item count

#### **Profile** (`/profile`)
**Purpose**: User account overview and quick access

**Features**:
- Profile header with avatar
- Personal information display
- Quick links to:
  - Edit profile
  - Subscription management
  - Wallet
  - Addresses
  - Orders history
  - Support
  - Settings
- Logout option
- Account statistics

### 3. Admin Dashboard (20+ Features)

**Admin Role**: Platform administrators manage the entire ecosystem

**Main Dashboard** (`/admin`)
- Key metrics overview
- Revenue statistics
- Active subscriptions count
- Total orders today
- Vendor and delivery partner stats
- Recent activities feed
- Quick action buttons

**Navigation Sections**:

1. **Vendors Management** (`/admin/vendors`)
   - List all vendors
   - Add new vendor
   - Edit vendor details
   - Vendor performance metrics
   - Product catalog by vendor
   - Revenue tracking

2. **Sub-Vendors Management** (`/admin/subvendors`)
   - Sub-vendor hierarchy
   - Territory assignments
   - Performance tracking
   - Commission management

3. **Delivery Partners** (`/admin/delivery`)
   - Active delivery partners list
   - Zone assignments
   - Delivery history
   - Performance ratings
   - Availability status
   - Route optimization

4. **Customers Management** (`/admin/customers`)
   - Customer database
   - Customer lifetime value
   - Subscription status
   - Order history per customer
   - Support tickets
   - Customer segmentation

5. **Order Circulation** (`/admin/circulation`)
   - Daily order dashboard
   - Route planning
   - Delivery assignments
   - Real-time tracking
   - Delivery confirmations

6. **Finance Management** (`/admin/finance`)
   - Revenue reports
   - Payment tracking
   - Vendor payouts
   - Delivery partner payments
   - Refund management
   - Tax calculations

7. **Requirements Planning** (`/admin/requirements`)
   - Demand forecasting
   - Inventory planning
   - Vendor capacity planning
   - Seasonal demand analysis

8. **Complaints & Support** (`/admin/complaints`)
   - All support tickets
   - Priority queue
   - Assignment to support staff
   - Resolution tracking
   - Customer satisfaction metrics

9. **Reports & Analytics** (`/admin/reports`)
   - Sales reports
   - Customer analytics
   - Vendor performance
   - Delivery metrics
   - Financial reports
   - Export options (PDF, Excel)

10. **Settings** (`/admin/settings`)
    - Platform configuration
    - Pricing rules
    - Delivery zones
    - Tax settings
    - Email templates
    - Notification templates

### 4. Vendor Dashboard

**Vendor Role**: Dairy farm owners and suppliers

**Main Dashboard** (`/vendor`)
- Product inventory
- Pending orders
- Revenue summary
- Customer reviews
- Add/edit products
- Order fulfillment status

**Sub-Vendor Dashboard** (`/Sub-Vendor`)
- Assigned territory
- Daily collection targets
- Supply chain coordination
- Performance metrics

**Main Vendor Dashboard** (`/main-vendor`)
- Multi-location management
- Aggregate analytics
- Sub-vendor oversight
- Quality control monitoring

### 5. Delivery Partner Dashboard

**Delivery Partner Role**: Logistics and last-mile delivery

**Main Dashboard** (`/delivery`)
- Today's delivery list
- Current route map
- Delivery status updates
- Earnings summary
- Customer ratings
- Vehicle and availability status
- Navigation integration
- Proof of delivery (photo upload)
- Customer signature capture

### 6. Authentication Flow

**Phone Entry** (`/auth/phone`)
- Phone number input with country code
- Terms and conditions acceptance
- Send OTP button
- Clean, simple interface

**OTP Verification** (`/auth/otp`)
- 6-digit OTP input
- Auto-focus and auto-submit
- Resend OTP option with countdown
- Edit phone number link

**Address Setup** (`/auth/address`)
- New user onboarding
- Add first delivery address
- GPS location option
- Skip option (can add later)

## 🎯 User Experience Guidelines

### Navigation Patterns

**Customer Navigation**:
- Bottom tab bar (mobile):
  - Home
  - Milk (Subscription)
  - Shop
  - Orders
  - Profile

- Profile menu links to:
  - Subscription
  - Cart
  - Wallet
  - Offers
  - Addresses
  - Support
  - Notifications
  - Wellness
  - Festivals
  - Settings

**Admin Navigation**:
- Sidebar menu with sections:
  - Dashboard
  - Vendors
  - Delivery Partners
  - Customers
  - Orders
  - Finance
  - Reports
  - Settings

### Responsive Design Requirements

**Mobile (320px - 768px)**:
- Single column layouts
- Bottom navigation tabs
- Floating action buttons
- Swipeable carousels
- Touch-friendly buttons (min 44px)
- Collapsible sections

**Tablet (768px - 1024px)**:
- Two-column layouts where appropriate
- Sidebar navigation option
- Card grids (2 columns)
- Expanded information display

**Desktop (1024px+)**:
- Multi-column layouts
- Persistent sidebar navigation
- Card grids (3-4 columns)
- Hover states and interactions
- Richer data visualization

### Loading States

- Skeleton loaders for content
- Spinner for actions (buttons)
- Progress bars for uploads
- Shimmer effects for images
- Optimistic UI updates

### Error Handling

- Inline validation messages
- Toast notifications for success/error
- Graceful error boundaries
- Retry mechanisms
- Offline state handling

### Empty States

- Friendly messaging
- Helpful illustrations
- Clear call-to-action
- Guidance for next steps

## 🔌 API Endpoints Structure

### Authentication
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/user
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products (admin)
PUT    /api/products/:id (admin)
DELETE /api/products/:id (admin)
```

### Orders
```
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
POST   /api/orders/:id/rate
```

### Subscriptions
```
GET    /api/milk-subscription
POST   /api/milk-subscription
PUT    /api/milk-subscription/:id
DELETE /api/milk-subscription/:id
POST   /api/milk-subscription/:id/pause
POST   /api/milk-subscription/:id/resume
```

### Wallet
```
GET    /api/wallet/balance
GET    /api/wallet/transactions
POST   /api/wallet/add-money
POST   /api/wallet/transfer
```

### Notifications
```
GET    /api/notifications
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id
PUT    /api/notifications/preferences
```

### Addresses
```
GET    /api/addresses
POST   /api/addresses
PUT    /api/addresses/:id
DELETE /api/addresses/:id
PUT    /api/addresses/:id/set-default
```

### Support
```
GET    /api/support/tickets
POST   /api/support/tickets
GET    /api/support/faq
```

### Admin
```
GET    /api/admin/vendors
GET    /api/admin/delivery-partners
GET    /api/admin/customers
GET    /api/admin/reports
```

## 📊 Key Business Logic

### Subscription Rules
- Subscriptions run from start date to end date
- Can be paused for up to 30 days
- Auto-payment attempted 1 day before delivery
- Missed payments pause subscription after 3 attempts
- Modifications take effect from next delivery

### Pricing Logic
- Base product prices from database
- Delivery fee: Free for orders above ₹500, otherwise ₹40
- Wallet cashback: 2% on all orders
- Loyalty points: 10 points per ₹100 spent
- Referral rewards: ₹50 for both parties

### Order Fulfillment Flow
1. Order placed by customer
2. Payment processed (wallet/card/COD)
3. Order assigned to vendor
4. Vendor prepares order
5. Delivery partner assigned
6. Out for delivery with live tracking
7. Delivered with proof
8. Customer can rate and review

### Notification Triggers
- Order confirmation
- Payment successful/failed
- Out for delivery (with ETA)
- Delivery completed
- Subscription renewal reminder
- New offers available
- Wallet cashback credited
- Support ticket updates

## 🎨 UI Component Library

### Custom Components (in shadcn/ui style)
- Card with eco-styling
- Button variants (eco-button, eco-button-secondary)
- Input with focus states
- Select dropdown with icons
- Badge for status indicators
- Progress bars
- Tabs for navigation
- Accordion for FAQs
- Modal/Dialog for confirmations
- Toast for notifications
- Skeleton loaders
- Avatar with fallback
- Rating stars
- Date picker
- Time slot picker

## 🔒 Security & Privacy

### Authentication
- JWT tokens for session management
- HTTP-only cookies
- CSRF protection
- Rate limiting on auth endpoints
- Password hashing with bcrypt

### Data Protection
- HTTPS only
- Environment variables for secrets
- Input sanitization
- SQL injection prevention (via ORM)
- XSS protection

### Privacy Compliance
- GDPR-compliant data handling
- User consent for data collection
- Right to data portability (export)
- Right to be forgotten (delete account)
- Transparent privacy policy

## 📱 Progressive Web App (PWA) Features

- Add to home screen
- Offline functionality for:
  - View past orders
  - View subscription details
  - Browse products (cached)
- Push notifications
- Background sync for:
  - Order status updates
  - Notification delivery

## 🎯 Success Metrics & KPIs

### Customer Metrics
- Monthly Active Users (MAU)
- Customer Retention Rate
- Average Order Value (AOV)
- Subscription renewal rate
- Net Promoter Score (NPS)

### Business Metrics
- Total Revenue
- Revenue per customer
- Delivery success rate
- Average delivery time
- Customer satisfaction rating

### Operational Metrics
- Order fulfillment time
- Vendor performance scores
- Delivery partner efficiency
- Support ticket resolution time
- App uptime and performance

## 🚀 Future Enhancements (Phase 2)

1. **AI-Powered Features**:
   - Smart subscription recommendations
   - Demand forecasting
   - Personalized offers
   - Chatbot support

2. **Advanced Tracking**:
   - Live delivery person location
   - Real-time traffic integration
   - Predicted delivery time

3. **Social Features**:
   - Recipe sharing community
   - User-generated content
   - Cooking tutorials
   - Farm visit bookings

4. **Gamification**:
   - Daily challenges
   - Leaderboards
   - Seasonal competitions
   - Achievement badges

5. **Integration**:
   - WhatsApp ordering
   - Voice assistant integration
   - Smart home devices
   - Calendar sync for deliveries

## 🎨 Complete Visual Design Specification

### Card Styles
```css
.eco-card {
  background: white;
  border-radius: 1.5rem; /* 24px */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid hsl(138, 26%, 94%);
  padding: 1.5rem;
}
```

### Button Styles
```css
.eco-button {
  background: linear-gradient(135deg, 
    hsl(142, 71%, 45%), 
    hsl(142, 76%, 36%)
  );
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
}

.eco-button-secondary {
  background: transparent;
  border: 2px solid hsl(142, 71%, 45%);
  color: hsl(142, 71%, 45%);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
}
```

### Typography Scale
```css
h1 { font-size: 2.25rem; font-weight: 900; } /* 36px */
h2 { font-size: 1.875rem; font-weight: 800; } /* 30px */
h3 { font-size: 1.5rem; font-weight: 700; } /* 24px */
h4 { font-size: 1.25rem; font-weight: 600; } /* 20px */
body { font-size: 1rem; font-weight: 400; } /* 16px */
small { font-size: 0.875rem; font-weight: 400; } /* 14px */
```

### Spacing System
```css
/* Use Tailwind spacing scale */
p-1: 0.25rem (4px)
p-2: 0.5rem (8px)
p-3: 0.75rem (12px)
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
```

## 🎯 Complete Implementation Checklist

### Phase 1: Foundation ✅
- [x] Project setup with Vite + React + TypeScript
- [x] Tailwind CSS configuration with eco colors
- [x] Database schema design
- [x] Authentication system
- [x] Basic routing structure

### Phase 2: Customer Features ✅
- [x] Home page with dashboard
- [x] Milk subscription management
- [x] Product catalog and shopping
- [x] Cart and checkout
- [x] Order management with tracking
- [x] Digital wallet
- [x] Offers and loyalty
- [x] Address management
- [x] Customer support
- [x] Notifications center
- [x] Wellness and community
- [x] Festival specials
- [x] Settings and security

### Phase 3: Admin Features ✅
- [x] Admin dashboard
- [x] Vendor management
- [x] Delivery partner management
- [x] Customer management
- [x] Order circulation
- [x] Finance tracking
- [x] Reports and analytics

### Phase 4: Polish & Optimization
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] PWA features
- [ ] Comprehensive testing
- [ ] Accessibility audit
- [ ] Security hardening

---

## 📝 Summary

This is a **comprehensive enterprise-level dairy delivery platform** called **Divine Naturals** with the tagline **"Pure. Fresh. Daily."** It features:

- **4 distinct user roles** (Customer, Admin, Vendor, Delivery Partner)
- **16+ major customer features** including subscription management, e-commerce, wallet, loyalty program, support system, and community features
- **Clean, eco-friendly design** with simple aesthetics (no complex visual effects)
- **Mobile-first responsive design** optimized for all devices
- **Complete business logic** for dairy delivery operations
- **Robust technical architecture** using React, TypeScript, PostgreSQL, and Express
- **Scalable database design** with 15+ interconnected tables
- **Professional UI/UX** with consistent branding and Divine Naturals tree logo

The platform enables customers to order fresh dairy products, manage recurring milk subscriptions, track deliveries in real-time, earn rewards, engage with the community, and access comprehensive customer support—all through a beautiful, eco-friendly interface.
