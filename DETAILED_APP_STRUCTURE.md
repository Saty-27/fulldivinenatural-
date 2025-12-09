# Divine Naturals - Complete App Structure Documentation

---

## 🏠 **PART 1: CUSTOMER APP (User-Facing Application)**
**Access:** `/` (root) | Requires authentication
**Entry Point:** `client/src/App.tsx` → Routes to customer pages when authenticated

### **1.1 Login Page**
**Path:** `/auth/login` or `/` (if not authenticated)  
**File:** `client/src/pages/simple-login.tsx`

**Features:**
- Email & password login form
- Sign-up form for new users
- Form validation (email format, password length)
- Session-based authentication via backend
- Error toast notifications
- Loading spinner during authentication
- Persistent session with PostgreSQL storage

**Form Fields:**
- **Login Tab:**
  - Email address input
  - Password input (masked)
  - "Remember me" checkbox
  - Sign-up link

- **Sign-up Tab:**
  - Email address input
  - Password input (with strength indicator)
  - Confirm password input
  - Terms & conditions checkbox
  - Already have account link

**API Calls:**
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/signup` - Create new account
- Session stored in cookies

---

### **1.2 Home Page**
**Path:** `/home` or `/`  
**File:** `client/src/pages/home.tsx`

**Overview Tab:**
- Dashboard with personalized greeting
- Billing status alert (if payment pending)
- Quick action buttons linking to main features
- Recent orders summary
- Active subscriptions display

**Sections:**

**A. Header Section**
- Logo with dairy emoji (🥛)
- Welcome message with user's name
- Logout button
- Theme toggle (if applicable)

**B. Billing Alert (Conditional)**
- Shows if billing status is "PENDING"
- Displays pending amount due
- Link to billing page
- Yellow background with warning icon
- Direct payment link button

**C. Quick Action Buttons**
- Shop Products → Links to `/shop`
- View Orders → Links to `/orders`
- Active Subscriptions → Links to `/subscription`
- Manage Addresses → Links to checkout-address
- View Billing → Links to `/billing`

**D. Profile Section (Tab: Profile)**
- View Mode:
  - First Name, Last Name
  - Email address
  - Phone number
  - Address (multi-line)
  - Gender (male/female/other)
  - Date of Birth
  - Edit button

- Edit Mode:
  - All fields become editable input boxes
  - Save button
  - Cancel button
  - Success/error toast on submission

**E. Statistics Cards**
- Total Orders
- Active Subscriptions
- Pending Payments
- Wallet Balance (if applicable)

**API Calls:**
- `GET /api/auth/current-user` - Fetch logged-in user details
- `GET /api/billing/current` - Fetch billing status
- `PATCH /api/auth/profile` - Update profile information
- `POST /api/auth/logout` - Logout user

---

### **1.3 Shop Page**
**Path:** `/shop`  
**File:** `client/src/pages/shop.tsx`

**Main Sections:**

**A. Header**
- Page title "Shop Products"
- Search bar (searches by product name)
- Filter options dropdown

**B. Category Filter**
- Dropdown or horizontal scrollable list
- Categories fetched from database (Milk, Paneer, Ghee, Yogurt, etc.)
- "All Products" default option
- Click to filter products by category

**C. Product Grid**
- Responsive grid layout (1 col mobile, 2 cols tablet, 4 cols desktop)
- Each product card shows:
  - Product image (from imageUrl)
  - Product name
  - Category
  - Price per unit (₹XX/unit)
  - Unit type (L, kg, piece, etc.)
  - Stock status (In Stock / Out of Stock)
  - Star rating (if applicable)
  - "Add to Cart" button

**D. Product Card Features**
- Hover effect (shadow, scale)
- Quick view button
- Add to cart directly from card
- Quantity selector (if adding to cart from card)

**E. Sorting Options**
- Sort by Price (Low to High / High to Low)
- Sort by Latest
- Sort by Best Selling

**F. Empty State**
- If no products in category
- Message: "No products available"
- Link to shop all products

**API Calls:**
- `GET /api/categories` - Fetch all categories
- `GET /api/products` - Fetch all products (with optional category filter)
- `POST /api/cart` - Add item to cart (redirects to product detail)

---

### **1.4 Product Detail Page**
**Path:** `/product/:id`  
**File:** `client/src/pages/product-detail.tsx`

**Left Section: Product Image**
- Large product image display
- Image carousel (if multiple images available)
- Zoom on hover capability
- Image gallery thumbnails below

**Right Section: Product Information**

**A. Product Header**
- Product name (large, bold)
- Category badge
- Star rating & review count
- SKU code

**B. Pricing Section**
- Price per unit (e.g., ₹150/L)
- Original price (if on sale) - strikethrough
- Discount percentage (if applicable)
- Wallet/loyalty points applicable

**C. Quantity Selector**
- Large +/- buttons
- Quantity input box
- Max quantity based on stock
- Minimum quantity = 1

**D. Add to Cart Section**
- Large "Add to Cart" button (green)
- Add to Wishlist button (heart icon)
- Quantity display showing how many in cart

**E. Product Details Tabs**

**Tab 1: Description**
- Full product description
- Ingredients (for dairy products)
- Nutritional information
- Preparation/usage instructions
- Storage instructions
- Shelf life/Expiry information

**Tab 2: Specifications**
- Product type (Milk, Dairy, etc.)
- Unit (Liters, Kg, etc.)
- Category
- Vendor name
- Stock available
- Manufactured date
- Expiry date

**Tab 3: Reviews**
- Customer reviews list
- Average rating with stars
- Review form (if user hasn't reviewed)
- Filter by rating
- Sort by newest/helpful

**F. Related Products Section**
- 4-5 related products shown
- Same category or similar type
- Add to cart button on each

**G. Stock Alert**
- If out of stock: "Out of Stock" badge (red)
- If low stock (<5): "Only 3 left" warning
- If no units available: Notify me button

**API Calls:**
- `GET /api/products/:id` - Fetch product details
- `GET /api/products/:id/reviews` - Fetch product reviews
- `GET /api/products?category=:category` - Fetch related products
- `POST /api/cart` - Add to cart

---

### **1.5 Cart Page**
**Path:** `/cart`  
**File:** `client/src/pages/cart.tsx`

**Layout: Two Column**

**Left Column: Cart Items**

**A. Cart Header**
- "Shopping Cart" title
- Item count (e.g., "3 items")
- Continue shopping link

**B. Cart Items List**
- For each item:
  - Product image (small)
  - Product name
  - Price per unit
  - Quantity selector (+/- buttons, input)
  - Subtotal (quantity × price)
  - Remove button (trash icon)
  - Move to wishlist option

**C. Empty Cart State**
- Large cart emoji
- Message: "Your cart is empty"
- Link to continue shopping

**D. Coupon/Promo Code**
- Input field for coupon code
- Apply button
- Discount applied message
- Remove coupon link

**Right Column: Order Summary**

**A. Price Breakdown**
- Subtotal: ₹XXX
- Discount (if coupon): -₹XX
- Delivery charges: ₹XX (free if applicable)
- Wallet balance applied: -₹XX (if applicable)
- **Total Amount: ₹XXX** (large, bold)

**B. Action Buttons**
- "Proceed to Checkout" button (green, large)
- "Continue Shopping" button (outline)
- "Save for Later" option

**C. Trust Indicators**
- "Free delivery on orders above ₹XXX"
- "Secure checkout"
- "100% Fresh guarantee"

**API Calls:**
- `GET /api/cart` - Fetch cart items
- `POST /api/cart` - Add item
- `PATCH /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item
- `POST /api/cart/apply-coupon` - Apply discount code

---

### **1.6 Checkout - Address Page**
**Path:** `/checkout`  
**File:** `client/src/pages/checkout-address.tsx`

**Step Indicator**
- Step 1: Address (Current)
- Step 2: Payment
- Step 3: Review & Place Order

**Left Section: Address Management**

**A. Saved Addresses List**
- For each saved address:
  - Address type badge (Home, Work, Other)
  - Full address display
  - Edit button
  - Delete button
  - Set as default checkbox
  - Select button (to choose this address)

**B. Add New Address Form**
- Address type selector (Home/Work/Other)
- Street address input
- City input
- State input
- Postal code input
- Phone number input
- Mark as default checkbox
- Save address button

**C. Edit Address Modal**
- Same fields as add new
- Update button
- Cancel button

**Right Section: Order Summary**
- Reconfirm items in cart
- Item count
- Subtotal
- Delivery charges
- Total amount
- Edit cart link

**Delivery Options**
- Select delivery slot:
  - Morning (6 AM - 10 AM)
  - Afternoon (10 AM - 2 PM)
  - Evening (4 PM - 8 PM)
- Select delivery date (with calendar)
- Special instructions textarea

**Bottom Action Buttons**
- Continue to Payment (green, large)
- Back to Cart (outline)

**API Calls:**
- `GET /api/addresses` - Fetch saved addresses
- `POST /api/addresses` - Create new address
- `PATCH /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `POST /api/orders/validate-checkout` - Validate checkout before proceeding

---

### **1.7 Checkout - Payment Page**
**Path:** `/checkout/payment` (continuation)

**Payment Method Selection**

**A. Payment Options**
- Cash on Delivery (COD)
  - Most popular for dairy delivery
  - Pay at your doorstep
  - ₹XX delivery fee

- UPI Payment
  - Google Pay, PhonePe, Paytm options
  - Instant confirmation
  - Transaction ID required

- Credit/Debit Card
  - Visa, MasterCard support
  - Card details input (if not saved)
  - CVV input
  - Billing address selector

- Net Banking
  - Bank selection dropdown
  - Redirect to bank portal
  - OTP verification

- Wallet Balance
  - If user has wallet
  - Use full balance / Partial balance
  - Top-up option

**B. Order Review Section**
- Items breakdown with prices
- Delivery address confirmation
- Delivery slot confirmation
- Subtotal breakdown
- Final total amount

**C. Terms & Conditions**
- Checkbox: Agree to terms
- Link to policies

**Bottom Actions**
- Place Order button (green, large)
- Back to address button
- Estimated delivery time display

**API Calls:**
- `POST /api/orders/create` - Create order (for COD)
- `POST /api/orders/payment-initiate` - Initiate online payment
- `POST /api/orders/payment-verify` - Verify payment status
- `GET /api/orders/estimate-delivery` - Get estimated delivery time

---

### **1.8 Orders Page**
**Path:** `/orders`  
**File:** `client/src/pages/orders.tsx`

**Header Section**
- Page title "My Orders"
- Filter options dropdown
- Search by order ID

**Filter Tabs**
- All Orders
- Pending
- Out for Delivery
- Delivered
- Cancelled
- Returned

**Orders List**

**For Each Order Card:**
- Order ID (#12345)
- Order date & time
- Items preview (first 2 items shown)
- Delivery status badge with progress indicator
- Total amount
- Delivery address preview
- View Details button (expands or navigates to detail page)

**Order Status Progress Indicator**
- Step 1: Order Placed (checkmark if done)
- Step 2: Preparing (checkmark if done)
- Step 3: Out for Delivery (checkmark if done)
- Step 4: Delivered (checkmark if done)

**Order Details Modal/Page**

**A. Order Header**
- Order ID & date
- Status badge
- Track button (if out for delivery)

**B. Items Section**
- For each item:
  - Product image
  - Product name
  - Quantity × Price
  - Subtotal

**C. Delivery Details**
- Delivery address
- Delivery date & time slot
- Delivery partner name (if assigned)
- Delivery partner phone (if available)
- Special instructions

**D. Payment Details**
- Payment method used
- Transaction ID
- Amount paid
- Payment status

**E. Actions**
- Reorder button (add same items to cart)
- Report issue button
- View receipt/invoice button
- Share order link
- Cancel order button (if eligible)
- Return button (if eligible)

**Empty State**
- If no orders: "You haven't placed any orders yet"
- Browse products button

**API Calls:**
- `GET /api/orders` - Fetch user's orders (with status filter)
- `GET /api/orders/:id` - Fetch single order details
- `POST /api/orders/:id/track` - Get real-time tracking info
- `POST /api/orders/:id/cancel` - Cancel order (if eligible)
- `GET /api/orders/:id/invoice` - Download invoice

---

### **1.9 Subscriptions - Main Page**
**Path:** `/subscription`  
**File:** `client/src/pages/subscription.tsx`

**Header**
- Page title "Milk Subscriptions"
- Create new subscription button

**Active Subscriptions Section**

**For Each Subscription Card:**
- Subscription ID
- Product name & image
- Quantity (e.g., "1.5L daily")
- Frequency badge (Daily/Weekly/Alternate)
- Next delivery date
- Status badge (Active/Paused/Expired)
- Edit button
- Pause/Resume button
- Cancel button
- View history link

**Subscription Details Card**

**A. Delivery Schedule**
- Frequency (Daily at 6 AM / 3 days a week, etc.)
- Delivery address
- Start date
- End date (if applicable)
- Next delivery info

**B. Pricing**
- Price per unit (₹XXX/L)
- Monthly cost estimate
- Total saved vs on-demand

**C. Past Deliveries**
- Calendar view
- Checkmarks for completed deliveries
- Missed deliveries highlighted
- View detailed history link

**Inactive/Paused Subscriptions Section**
- Similar card layout
- Resume button prominent
- Reason for pause (if mentioned)

**Empty State**
- No subscriptions message
- Create subscription button

**API Calls:**
- `GET /api/subscriptions` - Fetch user's subscriptions
- `GET /api/subscriptions/:id/history` - Fetch delivery history
- `PATCH /api/subscriptions/:id/pause` - Pause subscription
- `PATCH /api/subscriptions/:id/resume` - Resume subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription

---

### **1.10 Subscription - Create Page**
**Path:** `/subscription/create`  
**File:** `client/src/pages/subscription-create.tsx`

**Step 1: Select Product**
- Product list/grid
- Each product shows:
  - Image
  - Name
  - Available units/quantities
  - Price per unit
  - Select button

**Step 2: Customize Delivery**
- Quantity selector
- Frequency selector:
  - Daily (every day)
  - Alternate (every other day)
  - Specific days (Mon/Wed/Fri, etc.)
  - Weekly
- Delivery time preference:
  - 6 AM - 8 AM
  - 8 AM - 10 AM
  - 5 PM - 7 PM
- Start date picker
- End date picker (optional)

**Step 3: Delivery Address**
- Select from saved addresses
- Add new address option
- Confirm address button

**Step 4: Review & Price**
- Product details confirmation
- Subscription details:
  - Quantity: 1.5L
  - Frequency: Daily
  - Duration: 30 days
- Price calculation:
  - Price per L: ₹75
  - Days in subscription: 30
  - Total cost: ₹3,375
  - Monthly cost: ₹3,375
- Edit links for each section

**Bottom Actions**
- Create Subscription button (green)
- Cancel button

**Confirmation Message**
- Success! Subscription created
- First delivery date
- View subscription link

**API Calls:**
- `GET /api/products/subscriptionEligible` - Get products available for subscription
- `POST /api/subscriptions/create` - Create subscription
- `POST /api/subscriptions/validate` - Validate subscription details

---

### **1.11 Subscription - History Page**
**Path:** `/subscription/history`  
**File:** `client/src/pages/subscription-history.tsx`

**Page Purpose:** Track all past deliveries for all subscriptions

**Header**
- Title "Subscription History"
- Date range picker (From / To)
- Export CSV button

**Filters**
- By product
- By subscription
- By status (Delivered/Missed/Rescheduled)

**Delivery Timeline/Table**

**For Each Delivery:**
- Delivery date
- Product name & quantity
- Subscription ID
- Status (Delivered/Missed/Rescheduled)
- Delivery time slot
- Amount charged
- Payment status (if applicable)

**Sortable Columns**
- Date (newest first)
- Product
- Status
- Amount

**Statistics Summary**
- Total deliveries (this period)
- Completed: X
- Missed: Y
- Rescheduled: Z

**Export Options**
- Download as PDF
- Download as CSV
- Email report

**API Calls:**
- `GET /api/subscriptions/history` - Fetch all delivery history
- `GET /api/subscriptions/:id/history` - Fetch specific subscription history

---

### **1.12 Billing Page**
**Path:** `/billing`  
**File:** `client/src/pages/billing.tsx`

**Outstanding Payments Section**

**If Payment Pending:**
- Alert box (yellow/red based on urgency)
- Amount due: ₹XXX
- Due date
- Days overdue (if applicable)
- Pay now button (red/urgent)

**Payment Methods Available:**
- UPI
- Card
- Net Banking
- Wallet

**Billing Summary**

**A. Current Month Charges**
- Orders total: ₹XXXX
- Subscriptions total: ₹YYYY
- Delivery charges: ₹ZZZ
- Adjustments/Discounts: -₹ABC
- **Total due: ₹XXXX**

**B. Payment Status**
- Status: Pending/Paid
- Last payment date
- Last payment amount
- Payment method used

**Invoice History Section**

**For Each Invoice/Bill:**
- Billing period (e.g., "1 Dec - 31 Dec 2024")
- Invoice date
- Total amount
- Payment status (Paid/Pending/Overdue)
- Download PDF button
- View details button
- Pay button (if pending)

**Sortable/Filterable:**
- By date
- By status
- By amount

**Wallet Section (if enabled)**
- Current wallet balance: ₹XXX
- Add money button
- Recent wallet transactions

**Refunds/Credits Section**
- If any pending refunds
- Credited to wallet or bank account option

**Subscription Charges**
- Active subscription charges breakdown
- Daily/monthly cost
- Next billing date

**Tax Information**
- GST percentage shown (if applicable)
- GST details in invoices

**Bottom Actions**
- Download all invoices (ZIP)
- Contact billing support button
- Email statements option

**API Calls:**
- `GET /api/billing/current` - Current billing status
- `GET /api/billing/history` - Billing history
- `GET /api/billing/invoices/:id` - Fetch specific invoice
- `POST /api/billing/pay` - Initiate payment
- `POST /api/billing/invoice/download` - Download invoice

---

## 🛠️ **PART 2: ADMIN APP (Management Dashboard)**
**Access:** `/admin` | No authentication required (accessible to anyone)
**Entry Point:** `client/src/pages/admin/index.tsx`

### **2.1 Admin Dashboard**
**Path:** `/admin` or `/admin/dashboard`  
**File:** `client/src/pages/admin/dashboard.tsx`

**Header Navigation**
- Logo
- Admin section title
- Quick stats links
- Navigation menu (collapsible on mobile)

**Navigation Menu (Sidebar/Top)**
- Dashboard (current)
- Orders
- Subscriptions
- Products
- Categories
- Customers
- Delivery Partners
- Billing
- Settings
- Reports/Analytics

**Main Dashboard Content**

**A. Key Statistics Cards (4 cards in a row)**
- Total Orders: 1,234 (↑ 12% vs last month)
- Active Users: 456 (↑ 8% vs last month)
- Revenue Today: ₹45,678 (↑ 5% vs yesterday)
- Pending Payments: ₹23,456 (↓ 3% vs last week)

Each card shows:
- Metric name
- Current value (large)
- Percentage change + trend arrow
- Color coding (green for positive, red for negative)

**B. Revenue Chart**
- Line graph showing revenue over last 30 days
- Toggleable: Daily/Weekly/Monthly view
- Hover shows exact values
- Export button

**C. Top Selling Products**
- Table with columns:
  - Product name
  - Units sold
  - Revenue
  - Growth %
- Top 5-10 products listed
- View all link

**D. Recent Orders Table**
- Columns:
  - Order ID
  - Customer name
  - Total amount
  - Status
  - Date
  - Actions (View/Edit)
- Shows last 10-15 orders
- Pagination
- Sort by date/amount
- View all link

**E. Recent Activity Feed**
- Timeline format
- Recent events:
  - New order placed
  - Payment received
  - Customer registered
  - Delivery completed
  - Subscription started
- Timestamps
- Filter by activity type

**F. Quick Actions**
- Create new order
- Add product
- Manage customers
- View reports
- System settings

**API Calls:**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/revenue` - Revenue data
- `GET /api/admin/top-products` - Top selling products
- `GET /api/admin/orders` - Recent orders
- `GET /api/admin/activity-feed` - Recent activity

---

### **2.2 Orders Management**
**Path:** `/admin/orders`  
**File:** `client/src/pages/admin/orders.tsx`

**Header**
- Page title "Orders Management"
- Create order button
- Export orders button

**Filters & Search**
- Search by order ID or customer name
- Date range picker (From / To)
- Status filter (All/Placed/Preparing/Out/Delivered/Failed/Cancelled)
- Payment status filter (Paid/Pending/Failed)
- Delivery method filter (All options)

**Orders Table**

**Columns:**
- Order ID (clickable, blue)
- Customer Name
- Total Amount
- Items Count
- Status (with color badge)
- Payment Status
- Delivery Date
- Assigned Partner (if any)
- Actions (View/Edit/Delete)

**Row Features:**
- Clickable row expands to show details
- Status update via dropdown
- Payment mark as paid button
- Reassign delivery button
- Print/export button

**Bulk Actions**
- Select multiple orders (checkbox column)
- Bulk update status
- Bulk export
- Bulk reassign delivery partner

**Order Detail Modal/Page**

**A. Order Information**
- Order ID
- Order date & time
- Customer details (name, phone, address)
- Status timeline (visual progress indicator)

**B. Items Section**
- For each item:
  - Product image
  - Product name
  - Quantity
  - Unit price
  - Line total
- Subtotal
- Discounts applied
- Tax
- Delivery charges
- **Grand Total**

**C. Delivery Information**
- Delivery address
- Preferred delivery date
- Delivery time slot
- Special instructions
- Assigned delivery partner (with phone)
- Actual delivery date (if delivered)

**D. Payment Section**
- Payment method
- Payment status (Paid/Pending)
- Amount paid
- Payment date
- Transaction ID (if online)
- Mark as paid button (if pending)

**E. Actions**
- Update status dropdown
- Reassign delivery partner button
- Send notification to customer
- Generate invoice
- Print order
- Cancel order
- Edit order

**Pagination**
- Show X rows per page (10/25/50/100)
- Previous/Next buttons
- Jump to page

**API Calls:**
- `GET /api/admin/orders` - Fetch orders (with filters)
- `GET /api/admin/orders/:id` - Fetch single order
- `PATCH /api/admin/orders/:id/status` - Update order status
- `PATCH /api/admin/orders/:id/payment-status` - Mark payment as paid
- `PATCH /api/admin/orders/:id/assign-delivery` - Assign delivery partner
- `DELETE /api/admin/orders/:id` - Delete/cancel order

---

### **2.3 Subscriptions Management**
**Path:** `/admin/subscriptions`  
**File:** `client/src/pages/admin/subscriptions.tsx`

**Header**
- Page title "Subscriptions"
- New subscription button
- Export subscriptions button

**Filters**
- Search by customer/subscription ID
- Status filter (Active/Paused/Cancelled/Expired)
- Date range picker
- Product filter

**Subscriptions Table**

**Columns:**
- Subscription ID
- Customer name
- Product name
- Quantity & Frequency
- Start date
- End date
- Status (badge)
- Revenue/Month
- Actions

**Bulk Actions**
- Pause multiple subscriptions
- Cancel multiple subscriptions
- Export data

**Subscription Detail View**

**A. Basic Information**
- Subscription ID
- Customer details
- Created date
- Status

**B. Subscription Details**
- Product name & image
- Quantity per delivery
- Frequency (daily/weekly/alternate)
- Unit price
- Monthly cost calculation

**C. Delivery Schedule**
- Delivery address
- Delivery time slot
- Days (if specific days selected)
- Next delivery date

**D. Payment Information**
- Billing amount per month
- Billing cycle
- Last payment date
- Next billing date
- Payment method

**E. Delivery History**
- Calendar view showing all deliveries
- Checkmarks for completed
- X marks for missed
- Rescheduled dates highlighted
- Detailed list below

**F. Actions**
- Pause subscription
- Resume subscription
- Modify subscription (quantity/frequency)
- Cancel subscription
- Send notification to customer
- View customer details
- Change delivery address

**API Calls:**
- `GET /api/admin/subscriptions` - Fetch all subscriptions
- `GET /api/admin/subscriptions/:id` - Fetch single subscription
- `PATCH /api/admin/subscriptions/:id/status` - Update status
- `PATCH /api/admin/subscriptions/:id/edit` - Edit subscription
- `GET /api/admin/subscriptions/:id/history` - Delivery history

---

### **2.4 Products Management**
**Path:** `/admin/products`  
**File:** `client/src/pages/admin/products.tsx`

**Header**
- Page title "Products"
- Add new product button
- Bulk upload button
- Export products button

**Filters & Search**
- Search by product name/SKU
- Category filter (dropdown)
- Stock status (In stock / Low stock / Out of stock)
- Active/Inactive status

**Products Table**

**Columns:**
- Product image (thumbnail)
- Product name
- SKU
- Category
- Price
- Stock quantity
- Unit type
- Status (Active/Inactive)
- Actions (Edit/Delete/Duplicate)

**Row Actions**
- Quick view (expands inline details)
- Edit button
- Delete button
- Duplicate button
- View sales data
- Toggle active/inactive

**Add/Edit Product Modal**

**A. Basic Information**
- Product name
- Description (textarea)
- Category dropdown
- Product type (Milk/Dairy/Other)
- SKU (auto-generated or manual)

**B. Pricing**
- Price per unit
- Unit type (L, kg, g, piece, etc.)
- Compare at price (for original/discount)

**C. Media**
- Product image upload
- Image preview
- Image gallery (multiple images)
- Featured image selector

**D. Inventory**
- Current stock
- Reorder level
- Reorder quantity
- Track inventory checkbox

**E. Details**
- Expiry date
- Manufactured date
- Ingredients (textarea)
- Nutritional information (textarea)
- Storage instructions
- Usage instructions

**F. Status**
- Active/Inactive toggle
- Featured product toggle
- Visibility (Public/Hidden)

**G. SEO (if applicable)**
- Meta title
- Meta description
- URL slug

**Bottom Actions**
- Save product button
- Cancel button
- Save & add another button

**Delete Confirmation**
- Warning message
- Affected orders note
- Confirm delete button

**Bulk Upload**
- CSV file upload template
- Drag & drop area
- Preview before upload
- Import button

**API Calls:**
- `GET /api/admin/products` - Fetch products
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/bulk-upload` - Bulk upload
- `GET /api/admin/products/:id/sales` - Product sales data

---

### **2.5 Categories Management**
**Path:** `/admin/categories`  
**File:** `client/src/pages/admin/categories.tsx`

**Header**
- Page title "Categories"
- Add category button

**Categories List**

**For Each Category:**
- Category name (editable)
- Description (editable)
- Icon/emoji (editable)
- Product count
- Active status toggle
- Actions (Edit/Delete)

**Add Category Form**
- Category name input
- Description textarea
- Icon/emoji selector
- Active checkbox
- Save button

**Edit Category Modal**
- Same fields as add
- Update button
- Cancel button

**Delete Confirmation**
- Warning about products in this category
- Confirm delete button

**Drag & Drop Reordering**
- Reorder categories by dragging
- Save order button

**API Calls:**
- `GET /api/categories` - Fetch all categories
- `POST /api/admin/categories` - Create category
- `PATCH /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `POST /api/admin/categories/reorder` - Save category order

---

### **2.6 Customers Management**
**Path:** `/admin/customers`  
**File:** `client/src/pages/admin/customers.tsx`

**Header**
- Page title "Customers"
- Export customers button

**Filters & Search**
- Search by name/email/phone
- Registration date range
- Total spend range
- Status (Active/Inactive)

**Customers Table**

**Columns:**
- Customer name
- Email
- Phone
- Total orders
- Total spent
- Registration date
- Last order date
- Status (Active/Inactive)
- Actions (View details/Edit/Contact)

**Customer Detail Page**

**A. Personal Information**
- Full name
- Email
- Phone
- Address
- Gender
- Date of birth
- Member since (registration date)

**B. Contact Information**
- Primary email
- Secondary email (if any)
- Primary phone
- Alternate phone
- Saved addresses list

**C. Order History**
- Total orders: X
- Total spent: ₹XXXX
- Last order date
- Average order value
- Table showing recent orders (last 10)

**D. Subscriptions**
- Active subscriptions list
- Paused subscriptions
- Cancelled subscriptions history

**E. Wallet (if enabled)**
- Current balance: ₹XXX
- Top-up history
- Transaction logs

**F. Notifications**
- Order updates
- Promotional emails
- SMS notifications
- Notification preferences

**G. Actions**
- Edit customer details
- Send email notification
- Send SMS
- Process refund
- Suspend/activate customer
- Export customer data
- Delete customer account

**API Calls:**
- `GET /api/admin/customers` - Fetch customers
- `GET /api/admin/customers/:id` - Fetch customer details
- `PATCH /api/admin/customers/:id` - Update customer
- `DELETE /api/admin/customers/:id` - Delete customer
- `GET /api/admin/customers/:id/orders` - Customer order history
- `POST /api/admin/customers/:id/send-notification` - Send notification

---

### **2.7 Delivery Partners Management**
**Path:** `/admin/delivery-partners`  
**File:** `client/src/pages/admin/delivery-partners.tsx`

**Header Section**
- Page title "Delivery Partners"
- Statistics Cards (4 in a row):
  - Total Partners: 25
  - Active Today: 18
  - Verified: 22
  - Blocked: 1

**Filters**
- Search by name/phone/ID
- Status filter (Active/Blocked/Suspended/Pending Verification)
- Zone filter (Bandra/Santa Cruz/etc.)
- Verification status (Verified/Pending)
- Availability status (Available/Busy/Offline)

**Partners Table**

**Columns:**
- Partner ID
- Full Name
- Phone
- Zone
- Vehicle Type
- Status (badge)
- Verification (checkmark/pending)
- Availability
- Today's deliveries
- Today's earnings
- Actions

**Table Features:**
- Sortable columns
- Pagination
- Bulk actions (block/verify multiple)
- Export partners list

**Statistics Charts (Below Table)**
- Weekly earnings chart
- Deliveries completed trend
- Performance metrics

**Add Partner Modal** ← **[Currently Implemented]**

**Modal Features:**
- Loading spinner while submitting
- Success screen with credentials
- Reset form after success

**Success Screen After Creation:**
- "✅ Partner Created Successfully!" header
- Partner name displayed
- Auto-generated username (format: driver_XXXXX)
- Plain password (visible, copyable)
- Eye button to show/hide password
- Copy buttons for each credential
- Success message: "Important: Save these credentials. Share with the delivery partner for login."
- Done button to close modal

**Partner Detail Modal**

**A. Personal Information**
- Full name
- Email
- Phone
- Address
- Date of birth
- Gender

**B. Document Information**
- Aadhaar number (last 4 digits only for privacy)
- PAN number
- License number
- License document (if uploaded)

**C. Delivery Details**
- Zone assigned
- Vehicle type (Bike/Scooter/Auto/Van/Car)
- License number
- Address on file

**D. Account Status**
- Status (Active/Blocked/Suspended)
- Verified status (Yes/Pending)
- Available status (Yes/No/Busy)

**E. Credentials** ← **[New Feature]**
- Username (auto-generated)
- Password (hidden by default, eye icon to show)
- "Copy" buttons next to each
- Last password changed date
- Reset password option

**F. Performance Stats**
- Total deliveries: 250
- Completed successfully: 245
- Failed: 5
- Success rate: 98%
- Average rating: 4.8/5
- Today's earnings: ₹450
- This week's earnings: ₹2,400

**G. Recent Deliveries**
- Table showing last 10 deliveries
- Order ID
- Customer name
- Delivery address
- Status
- Delivery date
- Amount collected (if COD)

**H. Actions**
- Verify/Unverify button
- Block/Unblock button
- Edit partner details
- Reassign zone
- Reset password button
- Send notification
- View detailed stats
- Download partner report
- Delete button (with confirmation)

**Partner Edit Modal**
- All editable fields from detail modal
- Save changes button
- Cancel button
- Success/error toast

**API Calls:**
- `GET /api/admin/delivery-partners` - Fetch all partners
- `GET /api/admin/delivery-partners/:id` - Fetch partner details
- `POST /api/admin/delivery-partners` - Create new partner
- `PATCH /api/admin/delivery-partners/:id` - Update partner
- `PATCH /api/admin/delivery-partners/:id/verify` - Verify partner
- `PATCH /api/admin/delivery-partners/:id/block` - Block partner
- `POST /api/admin/delivery-partners/:id/reset-password` - Reset password
- `DELETE /api/admin/delivery-partners/:id` - Delete partner
- `GET /api/admin/delivery-partners/:id/stats` - Partner statistics
- `GET /api/admin/delivery-partners/:id/earnings` - Earnings data

---

### **2.8 Billing Management**
**Path:** `/admin/billing`  
**File:** `client/src/pages/admin/billing.tsx`

**Header**
- Page title "Billing"
- Date range picker
- Export reports button

**Overview Cards**
- Total Revenue (Today): ₹XXX
- Pending Payments: ₹XXXX
- Completed Payments: ₹XXXXX
- Failed Transactions: 5

**Revenue Metrics**
- Today's revenue
- This week's revenue
- This month's revenue
- Year-to-date revenue
- Comparison vs previous period

**Payments List**

**Columns:**
- Order ID
- Customer name
- Amount
- Payment method
- Payment status (Paid/Pending/Failed)
- Payment date
- Actions (View/Download receipt)

**Filters**
- Date range
- Payment status
- Payment method (COD/UPI/Card/Net Banking)
- Amount range

**Failed Transactions Section**
- List of failed transactions
- Retry button
- Contact customer button
- Mark as refunded

**Invoice Management**
- View all generated invoices
- Download invoice
- Send invoice to customer
- Regenerate invoice

**API Calls:**
- `GET /api/admin/billing` - Billing overview
- `GET /api/admin/billing/revenue` - Revenue data
- `GET /api/admin/billing/payments` - Payment list
- `POST /api/admin/billing/invoice/:id/resend` - Resend invoice

---

### **2.9 Billing Detail Page**
**Path:** `/admin/billing/:id`  
**File:** `client/src/pages/admin/billing-detail.tsx`

**Detailed invoice/bill view**
- Customer details
- Itemized breakdown
- Taxes & charges
- Total amount
- Payment history
- Download/print options

---

## 🚚 **PART 3: DELIVERY PARTNER APP**
**Access:** `/delivery` | Separate login system
**Entry Point:** `client/src/pages/delivery/login.tsx`

### **3.1 Delivery Login Page**
**Path:** `/delivery` or `/delivery/login`  
**File:** `client/src/pages/delivery/login.tsx`

**Login Form**

**A. Form Header**
- Logo/emoji (🚗 or 🚚)
- "Delivery Partner Login"
- Subtitle: "Welcome to Divine Naturals Delivery"

**B. Form Fields**
- Username input (auto-generated format: driver_XXXXX)
- Password input (masked)
- Show password checkbox (eye icon toggle)
- Remember me checkbox

**C. Form Features**
- Input validation
- Error messages below each field
- Loading spinner during login
- Error toast on failure
- Success notification on login

**D. Action Buttons**
- Login button (green, large)
- Forgot password link → Shows password reset form
- Admin contact link

**E. Additional Section**
- "New delivery partner?" message
- "Contact admin for registration" link
- Admin support phone number/email

**Forgot Password Flow**
- Enter email/phone
- OTP verification
- Reset password form
- Success message

**API Calls:**
- `POST /api/delivery/login` - Authenticate partner
- `POST /api/delivery/forgot-password` - Send reset link
- `POST /api/delivery/reset-password` - Reset password

---

### **3.2 Delivery Dashboard**
**Path:** `/delivery/dashboard`  
**File:** `client/src/pages/delivery/dashboard.tsx`

**Page Header**
- "Today's Route" title
- Delivery partner name (if logged in)
- Logout button
- Profile button

**Statistics Cards Row (5 columns - responsive)**

**Card 1: Total Deliveries**
- Icon: Package
- Value: 12
- Label: "Total"
- Color: Blue background

**Card 2: Completed**
- Icon: CheckCircle
- Value: 8
- Label: "Completed"
- Color: Green background

**Card 3: Pending**
- Icon: Truck
- Value: 3
- Label: "Pending"
- Color: Orange background

**Card 4: Failed**
- Icon: AlertCircle
- Value: 1
- Label: "Failed"
- Color: Red background

**Card 5: COD Amount**
- Icon: DollarSign
- Value: ₹1,250
- Label: "COD ₹"
- Color: Purple background

**Today's Earnings Card**
- Large green gradient background
- Earnings icon
- Title: "Today's Earnings"
- Large amount: ₹2,450 (or calculation based on completed deliveries)
- Subtitle: "15 deliveries × ₹XXX per delivery"

**Deliveries List**

**For Each Delivery Card:**

**A. Header Section**
- Customer name (bold)
- Delivery address (address line)
- Status badge (pending/out_for_delivery/delivered/failed)

**B. Details Section**
- Delivery ID/Order ID
- Phone number (clickable, calls phone)
- Special instructions (if any)
- COD amount (if payment on delivery) - highlighted

**C. Timeline/Progress**
- Visual representation of delivery status
- Time started (if started)
- Time delivered (if completed)
- Elapsed time

**D. Action Buttons**

**If Status = "Pending":**
- "Start Delivery" button (blue)
- "📍 Navigate" button (opens maps)

**If Status = "Out for Delivery":**
- "Delivered" button (green) - marks as complete
- "Failed" button (red outline) - opens failure reason form
- "📍 Navigate" button

**If Status = "Delivered":**
- "Completed" status (checkmark)
- Time delivered displayed
- View details button

**If Status = "Failed":**
- "Retry" button
- View failure reason
- Report issue button

**E. Optional Actions**
- Call customer button
- Message customer button
- View order details button
- Cancel delivery (if eligible)

**Empty State**
- If no deliveries for the day
- Large truck emoji
- "No deliveries assigned today"
- "Check back later" message

**Bottom Section: Additional Features**

**A. Route Summary**
- Total distance today: XX km
- Estimated time remaining: XX mins
- Next delivery: X

**B. Earnings Breakdown**
- Base earning per delivery: ₹XXX
- Bonus deliveries: X → +₹XXX
- COD incentive: ₹XXX
- Total today: ₹XXXX

**C. Quick Links**
- View full stats
- Report issue
- Contact support
- Settings

**D. Notifications**
- New delivery assigned notification (if any)
- Order cancellation notification
- Bonus earning notification

**Delivery Detail Modal**

**When Clicking on Delivery Card:**

**A. Order Information**
- Order ID
- Customer name & phone
- Delivery address (full)
- Special instructions
- Delivery time slot

**B. Order Items**
- For each item:
  - Product name
  - Quantity
  - Subtotal
- Total amount

**C. Payment Information**
- Payment method (COD/Online/etc.)
- Amount to collect (if COD)
- Amount paid (if online)
- Payment status

**D. Status Updates**
- Timeline of status changes
- Timestamps
- Who updated (system/manual)

**E. Action Buttons**
- Start delivery
- Mark delivered
- Mark failed
- Collect payment (if COD)
- Navigate to address
- Contact customer

**Start Delivery Action**

**Modal/Dialog:**
- Confirmation message
- "Start your delivery now?"
- Start button
- Cancel button
- Automatically updates status to "out_for_delivery"
- Notification sent to customer

**Delivery Success Action**

**Modal:**
- "Delivery Completed!"
- Address confirmation
- Photo upload (optional)
- COD collection amount (if applicable)
- Signature/fingerprint (if required)
- Confirm delivery button
- Automatically updates status to "delivered"
- Payment collection recorded
- Customer notification sent

**Delivery Failed Action**

**Modal:**
- "Report Delivery Failure"
- Reason dropdown:
  - Customer not home
  - Address incorrect
  - Customer refused delivery
  - Vehicle breakdown
  - Other
- Additional notes textarea
- Photo upload (proof of attempt)
- Rescheduling options:
  - Suggest new date/time
  - Auto-reschedule options
- Report button
- Status updated to "failed"
- Automatic notification to customer and admin

**Profile Page** (Accessible from dashboard)

**Personal Information**
- Name
- Phone
- Email
- Address
- Zone assigned
- Vehicle details

**Account Settings**
- Change password
- Notification preferences
- Payment method
- Bank details (for earnings withdrawal)

**API Calls:**
- `GET /api/delivery/today/:partnerId` - Fetch today's deliveries
- `GET /api/delivery/earnings/:partnerId` - Fetch earnings data
- `PATCH /api/delivery/:deliveryId/start` - Start delivery
- `PATCH /api/delivery/:deliveryId/complete` - Mark as delivered
- `PATCH /api/delivery/:deliveryId/failed` - Mark as failed with reason
- `POST /api/delivery/:deliveryId/collect-cod` - Record COD collection
- `GET /api/delivery/:partnerId/stats` - Fetch partner statistics
- `POST /api/delivery/logout` - Logout partner
- `GET /api/delivery/profile/:partnerId` - Fetch profile details
- `PATCH /api/delivery/profile/:partnerId` - Update profile

---

## 📊 **Database Schema Overview**

**Key Tables:**
1. **users** - All system users
2. **delivery_partners** - Delivery partner accounts
3. **orders** - Customer orders
4. **order_items** - Individual items in orders
5. **milk_subscriptions** - Recurring delivery subscriptions
6. **subscription_deliveries** - Tracking each subscription delivery
7. **delivery_assignments** - Assignment of orders/subscriptions to partners
8. **products** - Product catalog
9. **categories** - Product categories
10. **vendors** - Vendor/supplier information
11. **billing** - Payment and billing records
12. **sessions** - User session storage

---

## 🔗 **API Route Organization**

**Authentication Routes** (`/api/auth/*`)
- Login, signup, logout, profile management

**Customer Routes** (`/api/*`)
- Products, cart, orders, subscriptions, addresses, billing

**Admin Routes** (`/api/admin/*`)
- Customer management, order management, delivery partner management, billing, products

**Delivery Routes** (`/api/delivery/*`)
- Login, today's deliveries, earnings, status updates, profile

---

## 🎨 **Design System & Components**

**Color Palette:**
- Primary Green: #16a34a (eco-friendly)
- Secondary Blue: #2563eb
- Alert Red: #dc2626
- Warning Orange: #ea580c
- Success Green: #10b981
- Neutral Gray: #6b7280

**Typography:**
- Headings: Bold weights
- Body: Regular weight
- All text dark gray on light backgrounds

**Component Library:**
- shadcn/ui built on Radix UI
- Tailwind CSS utilities
- Lucide React icons

---

This comprehensive documentation covers every page, section, and subsection of all three applications with complete details about functionality, UI elements, user interactions, and API integrations.
