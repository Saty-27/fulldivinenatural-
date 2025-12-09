# Divine Naturals - Complete Feature Brief

## 📱 USER APP (Customer-Facing)

### 1. AUTHENTICATION & LOGIN
**Route**: `/` and `/auth/login`
- **Email/Password Login**: Customers login with email and password
- **Password Hashing**: Uses bcryptjs for secure password storage
- **Session Management**: Express sessions with PostgreSQL storage
- **Auto-redirect**: Logged-in users redirected to `/home`
- **Features**:
  - Email validation
  - Password validation (minimum length)
  - Session persistence across browser tabs
  - Secure session cookies

---

## 🏠 HOME PAGE (Customer Dashboard)
**Route**: `/home`
- **Welcome Section**: Personalized greeting with customer name
- **Profile Overview**: Display user info, phone, email, address
- **Quick Stats**: Shows total orders, active subscriptions, total spent
- **Navigation Buttons**:
  - 🛍️ Go to Shop
  - 🛒 View Cart
  - 📦 My Orders
  - 🥛 My Subscriptions
- **Features**:
  - Profile picture/avatar support
  - Clean, minimalist design
  - Mobile-responsive layout
  - Gradient background (green to blue theme)

---

## 🛍️ SHOP PAGE (Product Catalog)
**Route**: `/shop`

### Features:
1. **Category Filtering**
   - Filter by: Ghee, Milk, Paneer, Yogurt, Cheese, Butter, Curd, Ice Cream, Other
   - "All Products" view option
   - Category buttons with counts
   - Real-time filtering without page reload

2. **Product Grid Display**
   - Responsive grid (1-4 columns based on screen size)
   - Each product shows:
     - Product image (from URL or placeholder)
     - Product name
     - Price per unit
     - Stock status (in-stock/out-of-stock)
     - Description
     - Unit type (200g, 500ml, 1L, etc.)

3. **Product Interactions**
   - **Quantity Selector**: +/- buttons to adjust quantity
   - **Add to Cart**: Add product with selected quantity
   - **View Details**: Click product to see full detail page
   - **Out of Stock**: Disabled if stock = 0

4. **Shopping Experience**
   - Toast notifications for actions
   - Loading states
   - Error handling
   - Smooth animations

---

## 📄 PRODUCT DETAIL PAGE
**Route**: `/product/:id`

### Sections:
1. **Product Information**
   - Large product image
   - Full product name
   - Detailed description
   - Unit type and size

2. **Pricing & Stock**
   - Product price
   - Stock level display with progress bar
   - Stock percentage indicator
   - "Out of Stock" badge if unavailable

3. **Quantity Selection**
   - Quantity input field
   - +/- increment/decrement buttons
   - Manual input support
   - Stock validation (can't exceed available)

4. **Actions**
   - **Add to Cart**: Adds selected quantity
   - **Buy Now**: Adds to cart and redirects to checkout
   - **Back to Shop**: Return to shop page

5. **Features**
   - Real-time stock updates
   - Price calculation for quantity
   - Mobile-optimized layout
   - Image lazy loading

---

## 🛒 SHOPPING CART PAGE
**Route**: `/cart`

### Display:
1. **Cart Items Table**
   - Product name
   - Unit type
   - Quantity selector (+/- buttons)
   - Unit price
   - Total price per item (quantity × price)
   - Remove button (trash icon)

2. **Order Summary**
   - Subtotal calculation
   - Delivery charge (FREE)
   - Final total amount
   - Currency symbol (₹)

3. **Actions**
   - **Continue Shopping**: Back to shop
   - **Proceed to Checkout**: Go to checkout page
   - **Remove Items**: Delete individual items
   - **Clear Cart**: Empty entire cart

4. **Cart States**
   - Empty cart message
   - Loading state
   - Error handling
   - Real-time updates

---

## 💳 CHECKOUT PAGE
**Route**: `/checkout`

### Step 1: Delivery Address
1. **Address Selection**
   - Show user's saved addresses
   - Select default address or choose another
   - **Add New Address** button

2. **Address Form**
   - Address type (Home/Work/Other)
   - Full address with landmark
   - Phone number
   - City, State, Pincode
   - Set as default option

3. **Address Management**
   - Edit existing addresses
   - Delete addresses
   - Mark as default

### Step 2: Payment Method Selection
1. **Payment Options**
   - 💵 **Cash on Delivery (COD)** - Pay at doorstep
   - 📱 **UPI** - Digital payment
   - 💳 **Credit/Debit Card** - Online payment
   - 🏦 **Net Banking** - Bank transfer

2. **Payment Details**
   - Method selected displays with icon
   - Payment gateway integration ready (placeholder)

### Step 3: Order Review
1. **Order Summary**
   - All cart items listed
   - Quantities and prices
   - Subtotal
   - Delivery charge
   - **Final Total**

2. **Order Placement**
   - **Place Order** button
   - Order confirmation
   - Auto-redirect to orders page
   - Cart auto-clears after order

3. **Features**
   - Form validation
   - Error messages
   - Loading states
   - Toast notifications
   - Transaction security

---

## 📦 MY ORDERS PAGE
**Route**: `/orders`

### Order Listing:
1. **Orders Table Display**
   - Order ID with # prefix
   - Order date
   - Total amount (₹ currency)
   - Order status badge
   - Payment status badge
   - Payment method
   - Item count

2. **Order Status Indicators**
   - **PLACED** (Yellow)
   - **PENDING** (Orange)
   - **DELIVERED** (Green)
   - **CANCELLED** (Red)

3. **Payment Status**
   - **pending** (Gray)
   - **paid** (Green)
   - **failed** (Red)

4. **Payment Methods Display**
   - 💵 COD (Cash on Delivery)
   - 📱 UPI
   - 💳 Card
   - 🏦 Net Banking

### Order Details:
- **Expandable Rows**: Click to see order items
- **Items List**: Product name, quantity, unit price, total price
- **Complete Order Info**: Full details with timestamps

---

## 🥛 SUBSCRIPTIONS PAGE (My Subscriptions)
**Route**: `/subscription`

### Subscription Cards Display:
1. **Active Subscriptions**
   - Product name
   - Subscription ID
   - Quantity (in liters)
   - Frequency (Daily/Alternate/Weekly)
   - Start date
   - Price per liter
   - Status badge (ACTIVE/PAUSED)

2. **Subscription Features**
   - **Pause Subscription**: Temporarily stop deliveries
   - **Resume Subscription**: Restart paused subscriptions
   - **View Details**: Full subscription information
   - **Cancel Subscription**: Permanently stop

3. **Subscription Management**
   - Change frequency
   - Change quantity
   - Update delivery time (7-8 AM default)
   - Set pause date range

4. **Empty State**
   - Message when no subscriptions
   - **Start New Subscription** button

---

## ➕ CREATE SUBSCRIPTION PAGE
**Route**: `/subscription/create`

### Step-by-Step Wizard (5 Steps):

**Step 1: Choose Product**
- Product selection with images
- Price display
- Unit info
- Stock availability check

**Step 2: Select Quantity**
- Quantity input (in liters)
- +/- buttons
- Minimum/maximum limits
- Price calculation

**Step 3: Choose Frequency**
- Daily
- Alternate Days
- Weekly
- Price adjustment based on frequency

**Step 4: Set Delivery Time**
- Time slot selection
- 7-8 AM (default)
- 10-11 AM
- 4-5 PM
- Custom time option

**Step 5: Confirm & Subscribe**
- Review all details
- Monthly cost calculation
- **Confirm Subscription** button
- Redirect to subscriptions page on success

---

## 📜 SUBSCRIPTION HISTORY PAGE
**Route**: `/subscription/history`

### Features:
- Historical subscription data
- Paused subscriptions
- Cancelled subscriptions
- Archived subscription records
- Timeline view of subscription changes
- Reactivation options for cancelled subs

---

## 🎯 ADMIN PANEL (Management Dashboard)
**Route**: `/admin` (No authentication required)

### Main Dashboard
- **Admin Overview**: Key metrics
- **Sidebar Navigation**: All admin sections
- **Dark/Light theme support**
- **Real-time data updates**

---

## 👥 ADMIN - CUSTOMERS MANAGEMENT
**Route**: `/admin/customers`

### Customers List:
1. **Stats Cards**
   - Total Customers count
   - Active Customers (with orders)
   - Total Revenue (₹)
   - Customer growth metrics

2. **Customers Table**
   - **Columns**:
     - Name
     - Email
     - Phone Number
     - Total Orders
     - Total Subscriptions
     - Total Spent (₹)
     - Join Date
   - **Clickable Rows**: Click to see customer detail

3. **Search & Filter**
   - Search by name
   - Search by email
   - Filter by region
   - Sort by spending/orders

---

## 👤 ADMIN - CUSTOMER DETAIL PAGE
**Route**: `/admin/customers/:customerId`

### Customer Profile Section
- Customer name
- Email address
- Phone number
- Total lifetime spending (₹)
- Account creation date
- Address on file

### Customer Orders Section
1. **Orders Table**
   - Order ID
   - Order date
   - Total amount
   - Delivery status (PLACED/PENDING/DELIVERED/CANCELLED)
   - Payment status (pending/paid/failed)
   - Payment method (COD/UPI/Card/Net Banking)
   - Expandable items view

2. **Order Management**
   - View full order details
   - See items purchased
   - Update order status
   - Update payment status
   - View delivery address

### Customer Subscriptions Section
1. **Active Subscriptions**
   - Product name
   - Subscription ID
   - Quantity (liters)
   - Frequency
   - Start date
   - Monthly cost
   - Status badge

2. **Subscription Management**
   - **➕ Add New Subscription** button
   - Add subscription form:
     - Customer ID (auto-filled)
     - Product selector dropdown
     - Quantity input (liters)
     - Frequency selector (Daily/Alternate/Weekly)
     - Submit to create

3. **Pause/Resume**
   - Pause active subscriptions
   - Resume paused subscriptions
   - Set pause duration

---

## 📦 ADMIN - ORDERS MANAGEMENT
**Route**: `/admin/orders`

### Orders Overview
1. **Stats Cards**
   - Total Orders
   - Pending Orders
   - Delivered Orders
   - Cancelled Orders
   - Revenue (₹)

2. **Orders Table**
   - **Columns**:
     - Order ID
     - Customer Name
     - Order Date
     - Total Amount (₹)
     - Status badge (color-coded)
     - Payment Status (Paid/Pending)
     - Payment Method
     - Items Count
     - Actions (Edit/Delete)

3. **Order Actions**
   - **View Details**: Full order information
   - **Edit Status**: Update delivery status
   - **Update Payment**: Mark as paid/failed
   - **Cancel Order**: Remove order
   - **Generate Invoice**: Download receipt

### Order Details View
- Customer information
- Delivery address
- All ordered items (quantity, price, total)
- Order timeline
- Payment information
- Delivery partner assignment

---

## 🥛 ADMIN - SUBSCRIPTIONS MANAGEMENT
**Route**: `/admin/subscriptions`

### Subscriptions Overview
1. **Stats Cards**
   - Total Subscriptions
   - Active Subscriptions
   - Paused Subscriptions
   - Total Milk Delivery (liters)

2. **Status Filters**
   - All subscriptions
   - Active only
   - Paused only
   - Quick filter buttons

### Subscriptions Table
1. **Columns**:
   - Subscription ID
   - Customer Name
   - Product Name
   - Quantity (L)
   - Frequency
   - Status (ACTIVE/PAUSED)
   - Start Date
   - Actions (Edit/Delete)

2. **Subscription Actions**
   - **✏️ Edit Button**: 
     - Opens edit form
     - Select customer
     - Select product
     - Update quantity
     - Change frequency
     - Submit changes
   
   - **🗑️ Delete Button**:
     - Confirmation dialog
     - Removes subscription
     - Updates customer records

3. **Add New Subscription**
   - **➕ Add Subscription** button
   - Form with fields:
     - Customer dropdown (searchable)
     - Product dropdown (shows price/unit)
     - Quantity input (liters)
     - Frequency selector
     - Submit button
   - Form validation
   - Error handling
   - Success toast notification

---

## 📦 ADMIN - PRODUCTS MANAGEMENT
**Route**: `/admin/products`

### Products Overview
1. **Stats Cards**
   - Total Products
   - Low Stock Products (< 10)
   - Out of Stock
   - Total Inventory Value (₹)

2. **Products Table**
   - **Columns**:
     - Product ID
     - Product Name
     - Category
     - Price (₹)
     - Unit Type
     - Current Stock
     - Status (Active/Inactive)
     - Actions (Edit/Delete)

3. **Product Management**
   - **Add Product**: Form to create new product
   - **Edit Product**: Modify product details
   - **Delete Product**: Remove product
   - **Update Stock**: Adjust inventory

### Product Details
- Product name
- Category (dropdown)
- Description
- Price
- Unit type (200g, 500ml, 1L, etc.)
- Stock level
- Product image URL
- Active/Inactive toggle

---

## 📂 ADMIN - CATEGORIES MANAGEMENT
**Route**: `/admin/categories`

### Categories Overview
1. **Stats Cards**
   - Total Categories
   - Active Categories
   - Products per Category
   - Category Usage

2. **Categories Grid/Table**
   - Category name
   - Description
   - Category icon
   - Product count
   - Status
   - Actions (Edit/Delete)

### Category Operations
1. **Add Category**
   - Form with fields:
     - Category name
     - Description
     - Category icon
     - **Image Upload Options**:
       - Drag-drop file upload
       - Click to browse
       - URL input field
       - Preview image
   - Submit button

2. **Edit Category**
   - **✏️ Edit Button**: Opens edit form
   - Pre-filled with current data
   - All fields editable
   - Image replacement option
   - Update button

3. **Delete Category**
   - **🗑️ Delete Button**
   - Confirmation dialog
   - Checks product associations
   - Warning if products exist
   - Soft delete or hard delete option

### Image Management
- File upload with preview
- URL input support
- Drag-drop functionality
- Base64 encoding for storage
- Image resize/optimize
- Format support (JPEG, PNG, WebP)

---

## 📊 ADMIN - ANALYTICS & REPORTS
**Dashboard Charts & Metrics**

1. **Sales Overview**
   - Daily sales trend
   - Weekly comparison
   - Monthly revenue
   - Revenue by category

2. **Customer Analytics**
   - New customers this month
   - Repeat customers
   - Customer retention rate
   - Top customers by spending

3. **Order Analytics**
   - Total orders
   - Average order value
   - Order status distribution
   - Peak ordering times

4. **Subscription Analytics**
   - Active subscription count
   - Daily milk requirement
   - Revenue from subscriptions
   - Subscription growth trend

---

## 🔐 ADMIN - SECURITY & PERMISSIONS
- **No Authentication Required**: `/admin` accessible without login
- **Admin-only Operations**: Category CRUD, order management
- **Data Protection**: Secure session management
- **Role-based Access**: Admin designation in database
- **Audit Trails**: All operations logged (ready for implementation)

---

## 🔔 SYSTEM FEATURES (Both User & Admin)

### 1. Cart System
- **Add to Cart**: With quantity selection
- **Update Quantity**: +/- buttons
- **Remove Items**: Delete from cart
- **Clear Cart**: Empty entire cart
- **Persistent Storage**: Database-backed (not local storage)
- **Multi-product**: Support multiple different products

### 2. Delivery Addresses
- **Add Address**: New address entry form
- **Edit Address**: Modify existing addresses
- **Delete Address**: Remove addresses
- **Set Default**: Mark primary address
- **Address Types**: Home, Work, Other
- **Full Fields**: Street, City, State, Pincode, Landmark, Phone

### 3. Order Processing
- **Stock Reduction**: Auto-deduct from inventory when order placed
- **Order Confirmation**: Email/notification sent
- **Delivery Tracking**: Status updates (PLACED → PENDING → DELIVERED)
- **Invoice Generation**: Automatic receipt creation
- **Payment Recording**: Track payment method and status

### 4. Subscription System
- **Auto-Delivery**: Scheduled daily/weekly milk deliveries
- **Flexible Frequency**: Daily, Alternate days, Weekly
- **Pause/Resume**: Temporarily stop or restart
- **Custom Quantity**: Select desired liters
- **Delivery Time Slots**: Morning, Afternoon, Evening
- **Monthly Billing**: Recurring charges

### 5. Notification System
- **Order Confirmation**: When order placed
- **Delivery Updates**: Status changes
- **Subscription Reminders**: Upcoming deliveries
- **Payment Alerts**: Payment due/confirmation
- **Admin Alerts**: New orders, stock low, etc.

### 6. API Endpoints (RESTful)

**Authentication**
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User signup
- GET `/api/auth/current-user` - Get logged-in user

**Products**
- GET `/api/products` - All products
- GET `/api/categories` - All categories
- GET `/api/products/:id` - Single product

**Cart**
- GET `/api/cart` - User's cart
- POST `/api/cart/items` - Add to cart
- PATCH `/api/cart/items/:id` - Update quantity
- DELETE `/api/cart/items/:id` - Remove item
- DELETE `/api/cart` - Clear cart

**Addresses**
- GET `/api/addresses` - User's addresses
- POST `/api/addresses` - Add address
- PATCH `/api/addresses/:id` - Edit address
- DELETE `/api/addresses/:id` - Delete address
- PATCH `/api/addresses/:id/set-default` - Set default

**Orders**
- GET `/api/orders` - User's orders
- GET `/api/orders/:id` - Order details
- POST `/api/orders` - Create order

**Subscriptions**
- GET `/api/subscriptions` - User's subscriptions
- POST `/api/subscriptions` - Create subscription
- PATCH `/api/subscriptions/:id` - Update subscription
- DELETE `/api/subscriptions/:id` - Cancel subscription

**Admin APIs**
- GET `/api/admin/customers` - All customers
- GET `/api/admin/orders` - All orders
- GET `/api/admin/subscriptions` - All subscriptions
- GET `/api/categories` - All categories
- PUT `/api/categories/:id` - Edit category
- DELETE `/api/categories/:id` - Delete category

---

## 🎨 UI/UX FEATURES

### Design System
- **Color Palette**: Green (eco-friendly), Blue (water/trust), White (clean)
- **Typography**: Clean, minimalist fonts
- **Spacing**: Consistent padding and margins
- **Icons**: Emoji and lucide-react icons
- **Responsive**: Mobile-first design

### Components Used
- **Buttons**: Primary, secondary, destructive variants
- **Input Fields**: Text, number, email, select
- **Tables**: Sortable, filterable data tables
- **Cards**: Product cards, stat cards, subscription cards
- **Badges**: Status indicators (colors vary by state)
- **Toast Notifications**: Success, error, warning messages
- **Modals/Dialogs**: Confirmation dialogs, forms
- **Tabs**: Tabbed navigation in dashboard

### Animations
- **Smooth Transitions**: All state changes animated
- **Hover Effects**: Button hover states
- **Loading Spinners**: During data fetch
- **Success Animations**: Confirmation feedback

---

## 📱 MOBILE RESPONSIVENESS
- **Responsive Grid**: Adapts 1-4 columns based on screen
- **Touch-friendly**: Large buttons for mobile
- **Mobile Navigation**: Hamburger menu support
- **Optimized Forms**: Mobile-friendly input fields
- **Readable Text**: Font sizes for mobile viewing
- **Fast Load Times**: Optimized images and lazy loading

---

## 🔄 DATA FLOW

### User Order Flow
1. Login → Home Page
2. Browse Shop (filter by category)
3. View Product Details
4. Add to Cart (quantity selection)
5. View Cart (review items)
6. Checkout (address + payment)
7. Place Order (stock reduces, cart clears)
8. View My Orders (tracking)

### User Subscription Flow
1. Home → My Subscriptions
2. Create New Subscription (5-step wizard)
3. Select Product → Quantity → Frequency → Delivery Time
4. Confirm & Subscribe
5. View Active Subscriptions
6. Pause/Resume Subscriptions
7. Manage Subscription Details

### Admin Management Flow
1. Access `/admin` (no login needed)
2. View Customers → Click customer → See orders + subscriptions
3. Manage Orders (view, edit status, update payment)
4. Manage Subscriptions (add, edit, delete)
5. Manage Categories (add, edit, delete with image upload)
6. Manage Products (add, edit stock, delete)
7. View Analytics & Reports

---

## 🎯 KEY FEATURES SUMMARY

| Feature | User | Admin | Details |
|---------|------|-------|---------|
| Product Browsing | ✅ | ✅ | Browse all products, filter by category |
| Shopping Cart | ✅ | - | Add/remove items, manage quantities |
| Checkout | ✅ | - | Address selection, payment method choice |
| Orders | ✅ | ✅ | Place orders, track delivery, view history |
| Subscriptions | ✅ | ✅ | Create, pause, resume, manage recurring |
| Addresses | ✅ | - | Add, edit, delete delivery addresses |
| Cart Management | ✅ | - | View, update, clear shopping cart |
| Customer Profiles | - | ✅ | View all customer data and history |
| Order Management | - | ✅ | Edit status, payment, cancel orders |
| Product Management | - | ✅ | Add, edit, delete products |
| Category Management | - | ✅ | Add, edit, delete categories with images |
| Subscription Admin | - | ✅ | Create, edit, delete subscriptions for customers |
| Analytics | - | ✅ | Sales, customers, orders, subscription trends |
| Notifications | ✅ | ✅ | Order confirmations, delivery updates |

---

## 🚀 TECHNICAL STACK

**Frontend**
- React + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- shadcn/ui (Components)
- TanStack React Query (State management)
- Wouter (Routing)
- Lucide React (Icons)

**Backend**
- Node.js + TypeScript
- Express.js (API server)
- PostgreSQL (Database)
- Drizzle ORM (Database queries)
- Express Sessions (Authentication)
- bcryptjs (Password hashing)

**Database**
- PostgreSQL with Neon (Serverless)
- Drizzle ORM for type-safe queries
- Session storage in PostgreSQL
- Real-time data synchronization

---

## ✨ FUTURE ENHANCEMENTS
1. Real payment gateway (Razorpay/Stripe)
2. SMS/Email notifications
3. Delivery tracking with GPS
4. Vendor dashboard
5. Wallet system
6. Loyalty rewards
7. Customer reviews/ratings
8. Advanced analytics
9. Inventory forecasting
10. Multi-language support
