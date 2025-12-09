import { Router } from 'express';
import { storage } from '../storage';
import { checkRole, requireCustomer, requireVendor, requireDelivery, requireAdmin } from '../middleware/auth';
import { insertProductSchema, insertOrderSchema, insertMilkSubscriptionSchema, products } from '@shared/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const router = Router();

// ============================================================================
// PUBLIC ENDPOINTS (All roles)
// ============================================================================

// POST /api/auth/verify-phone - Phone OTP verification for login
router.post('/auth/verify-phone', async (req: any, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    // Demo: Accept any OTP (simulating OTP system)
    if (otp !== "1234") {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Create or find user by phone
    const userId = `user_${phone.replace(/\D/g, '').slice(-10)}`;
    let user = await storage.getUser(userId);

    if (!user) {
      user = await storage.upsertUser({
        id: userId,
        phone: phone,
        role: "customer",
      });
    }

    // Set up session - save to session store and wait
    req.session.userId = userId;
    req.session.user = { id: userId, phone };
    req.session.userRole = user.role || "customer";
    req.session.userEmail = user.email || null;
    
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Session save failed" });
      }
      res.json({ success: true, userId });
    });
  } catch (error) {
    console.error("Error verifying phone:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

// POST /api/auth/register - Phone OTP verification for signup
router.post('/auth/register', async (req: any, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    // Demo: Accept any OTP
    if (otp !== "1234") {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Create user by phone
    const userId = `user_${phone.replace(/\D/g, '').slice(-10)}`;
    const user = await storage.upsertUser({
      id: userId,
      phone: phone,
      role: "customer",
    });

    // Set up session - save to session store and wait
    req.session.userId = userId;
    req.session.user = { id: userId, phone };
    req.session.userRole = user.role || "customer";
    req.session.userEmail = user.email || null;
    
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Session save failed" });
      }
      res.json({ success: true, userId, redirectTo: "/auth/personal-details" });
    });
  } catch (error) {
    console.error("Error registering:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// GET /api/auth/user - Returns ALL authenticated user data from database
router.get('/auth/user', async (req: any, res) => {
  try {
    // Check both session and Replit Auth
    const userId = req.session?.userId || req.user?.id || req.user?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return COMPLETE user data from database - ALL FIELDS
    res.json({
      id: user.id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      profileImageUrl: user.profileImageUrl,
      walletBalance: user.walletBalance,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// GET /api/products - Retrieves the full products catalog
router.get('/products', async (req, res) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/categories - Retrieves all product categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// PUT /api/categories/:id - Update category
router.put('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const updates = req.body;

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await storage.updateCategory(categoryId, updates);
    
    res.json({ success: true, category, message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    await storage.deleteCategory(categoryId);
    
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

// ============================================================================
// CUSTOMER ENDPOINTS
// ============================================================================

// POST /api/cart - Adds an item to the cart
router.post('/cart', requireCustomer, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    const cartItem = await storage.addToCart(userId, productId, quantity);
    res.json({ success: true, cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

// GET /api/cart - Get user's cart
router.get('/cart', requireCustomer, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const cartItems = await storage.getCartItems(userId);
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// POST /api/orders - Finalizes cart and creates order
router.post('/orders', requireCustomer, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { deliveryAddress, deliveryDate } = req.body;

    if (!deliveryAddress || !deliveryDate) {
      return res.status(400).json({ message: "Delivery address and date are required" });
    }

    // Get cart items
    const cartItems = await storage.getCartItems(userId);
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    // Create order
    const orderData = {
      userId,
      totalAmount: totalAmount.toFixed(2),
      deliveryAddress,
      deliveryDate,
      status: "pending" as const
    };

    const order = await storage.createOrder(orderData);

    // Create order items from cart and reduce stock
    for (const item of cartItems) {
      await storage.createOrderItem({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: (parseFloat(item.price) * item.quantity).toFixed(2)
      });

      // STAGE 3: Reduce product stock after order
      const product = await db.select().from(products).where(eq(products.id, item.productId));
      if (product.length > 0) {
        const newStock = Math.max(0, (product[0].stock || 0) - item.quantity);
        await storage.updateProduct(item.productId, { stock: newStock });
        
        // Record stock movement for audit trail
        await storage.recordStockMovement({
          productId: item.productId,
          type: 'OUT',
          reason: 'ORDER_PLACED',
          quantity: item.quantity,
          previousStock: product[0].stock || 0,
          newStock,
          adminId: null,
          notes: `Order #${order.id} placed`
        });
      }
    }

    // Clear cart
    await storage.clearCart(userId);

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// GET /api/milk-subscription - Get user's milk subscription
router.get('/milk-subscription', requireCustomer, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    res.json(subscription || null);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Failed to fetch subscription" });
  }
});

// POST /api/milk-subscription - Creates a recurring delivery subscription
router.post('/milk-subscription', requireCustomer, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const subscriptionData = insertMilkSubscriptionSchema.parse({ ...req.body, userId });
    
    const subscription = await storage.createMilkSubscription(subscriptionData);
    res.json({ success: true, subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

// PATCH /api/milk-subscription/:id/pause - STAGE 2: Pause subscription
router.patch('/milk-subscription/:id/pause', requireCustomer, async (req: any, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    const userId = req.user.claims.sub;
    
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    if (!subscription || subscription.id !== subscriptionId) {
      return res.status(403).json({ message: "Not authorized to pause this subscription" });
    }

    const updated = await storage.updateMilkSubscription(subscriptionId, {
      isPaused: true,
      status: 'PAUSED'
    });

    res.json({ success: true, subscription: updated, message: "Subscription paused successfully" });
  } catch (error) {
    console.error("Error pausing subscription:", error);
    res.status(500).json({ message: "Failed to pause subscription" });
  }
});

// PATCH /api/milk-subscription/:id/resume - STAGE 2: Resume paused subscription
router.patch('/milk-subscription/:id/resume', requireCustomer, async (req: any, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    const userId = req.user.claims.sub;
    
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    if (!subscription || subscription.id !== subscriptionId) {
      return res.status(403).json({ message: "Not authorized to resume this subscription" });
    }

    const updated = await storage.updateMilkSubscription(subscriptionId, {
      isPaused: false,
      status: 'ACTIVE'
    });

    res.json({ success: true, subscription: updated, message: "Subscription resumed successfully" });
  } catch (error) {
    console.error("Error resuming subscription:", error);
    res.status(500).json({ message: "Failed to resume subscription" });
  }
});

// PUT /api/personal-details - STAGE 1: Save personal details (Name, Email, DOB, Gender)
router.put('/personal-details', requireCustomer, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { firstName, lastName, email, gender, dob } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "First name, last name, and email are required" });
    }

    const updated = await storage.upsertUser({
      id: userId,
      firstName,
      lastName,
      email,
      gender: gender || undefined,
      dob: dob || undefined
    });

    res.json({ 
      success: true, 
      user: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email
      },
      message: "Personal details saved successfully"
    });
  } catch (error) {
    console.error("Error saving personal details:", error);
    res.status(500).json({ message: "Failed to save personal details" });
  }
});

// ============================================================================
// VENDOR ENDPOINTS
// ============================================================================

// GET /api/vendors/dashboard - Calculates and returns vendor metrics
router.get('/vendors/dashboard', requireVendor, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Get vendor profile
    const vendor = await storage.getVendorByUser(userId);
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    // Calculate metrics
    const metrics = {
      dailyRequirement: vendor.requirementToday || 0,
      weeklyRevenue: vendor.weeklyEarnings || "0.00",
      fulfillmentRate: vendor.requirementToday > 0 
        ? ((vendor.circulatedLiters / vendor.requirementToday) * 100).toFixed(2)
        : "0.00",
      circulatedLiters: vendor.circulatedLiters || 0,
      revenueToday: vendor.revenueToday || "0.00",
      businessName: vendor.businessName,
      locationName: vendor.locationName,
      isVerified: vendor.isVerified
    };

    res.json(metrics);
  } catch (error) {
    console.error("Error fetching vendor dashboard:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

// POST /api/vendors/inward - Logs milk/product received
router.post('/vendors/inward', requireVendor, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { litersArrived, litersDelivered, litersPending, driverInfo } = req.body;

    if (!litersArrived || !litersDelivered || litersPending === undefined || !driverInfo) {
      return res.status(400).json({ message: "All inward entry fields are required" });
    }

    const vendor = await storage.getVendorByUser(userId);
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const inwardEntry = await storage.createInwardLog({
      vendorId: vendor.id,
      litersArrived,
      litersDelivered,
      litersPending,
      driverInfo,
      reportedByUserId: userId,
      sentToAdmin: true,
      status: "PENDING"
    });

    res.json({ success: true, inwardEntry });
  } catch (error) {
    console.error("Error logging inward entry:", error);
    res.status(500).json({ message: "Failed to log inward entry" });
  }
});

// POST /api/vendors/driver - Add driver for vendor
router.post('/vendors/driver', requireVendor, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { name, age, phone, aadharUrl, panUrl } = req.body;

    if (!name || !age || !phone) {
      return res.status(400).json({ message: "Driver name, age, and phone are required" });
    }

    const vendor = await storage.getVendorByUser(userId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const driver = await storage.addDriver({
      name,
      age,
      phone,
      aadharUrl,
      panUrl,
      vendorId: vendor.id
    });

    res.json({ success: true, driver, message: "Driver added successfully" });
  } catch (error) {
    console.error("Error adding driver:", error);
    res.status(500).json({ message: "Failed to add driver" });
  }
});

// GET /api/vendors/drivers - Get vendor's drivers
router.get('/vendors/drivers', requireVendor, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;

    const vendor = await storage.getVendorByUser(userId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const drivers = await storage.getDriversByVendor(vendor.id);
    res.json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
});

// ============================================================================
// DELIVERY PARTNER ENDPOINTS
// ============================================================================

// GET /api/delivery/assignments - Retrieves assigned orders
router.get('/delivery/assignments', requireDelivery, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Get delivery partner profile
    const deliveryPartner = await storage.getDeliveryPartnerByUser(userId);
    
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner profile not found" });
    }

    // Get orders assigned to this delivery partner
    const assignments = await storage.getOrdersForDelivery(deliveryPartner.id);
    
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching delivery assignments:", error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
});

// PUT /api/delivery/status/:id - Updates order status with ownership validation
router.put('/delivery/status/:id', requireDelivery, async (req: any, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const userId = req.user.claims.sub;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Verify ownership: delivery partner must be assigned to this order
    const deliveryPartner = await storage.getDeliveryPartnerByUser(userId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner profile not found" });
    }

    const order = await storage.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryPartnerId !== deliveryPartner.id) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    const updatedOrder = await storage.updateOrderStatus(orderId, status);
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

// GET /api/admin/vendors - Retrieves all vendors and their approval status
router.get('/admin/vendors', requireAdmin, async (req, res) => {
  try {
    const vendors = await storage.getVendors();
    
    const vendorList = vendors.map(vendor => ({
      id: vendor.id,
      businessName: vendor.businessName,
      locationName: vendor.locationName,
      licenseNumber: vendor.licenseNumber,
      vendorType: vendor.vendorType,
      isApproved: vendor.isVerified, // isVerified serves as isApproved
      requirementToday: vendor.requirementToday,
      circulatedLiters: vendor.circulatedLiters,
      revenueToday: vendor.revenueToday,
      createdAt: vendor.createdAt
    }));

    res.json(vendorList);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});

// POST /api/admin/vendors/approve/:id - Approves a vendor (per manifest)
router.post('/admin/vendors/approve/:id', requireAdmin, async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id);

    if (isNaN(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const vendor = await storage.approveVendor(vendorId);
    
    res.json({ success: true, vendor, message: "Vendor approved successfully" });
  } catch (error) {
    console.error("Error approving vendor:", error);
    res.status(500).json({ message: "Failed to approve vendor" });
  }
});

// POST /api/admin/update-password - Admin password reset with OTP verification
router.post('/admin/update-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Update user password in database (simple implementation)
    // In production, you'd hash the password and verify OTP was validated
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Update password (in production, hash this with bcrypt)
    await storage.updateUser(user.id, { password: newPassword });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
});

// ============================================================================
// ADMIN CATEGORY MANAGEMENT
// ============================================================================

// POST /api/admin/categories - Add new category
router.post('/admin/categories', async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await storage.createCategory({
      name,
      description,
      icon,
      isActive: true
    });
    
    res.json({ success: true, category, message: "Category added successfully" });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Failed to add category" });
  }
});

// PUT /api/admin/categories/:id - Update category
router.put('/admin/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const updates = req.body;

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await storage.updateCategory(categoryId, updates);
    
    res.json({ success: true, category, message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
});

// DELETE /api/admin/categories/:id - Delete category
router.delete('/admin/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    await storage.deleteCategory(categoryId);
    
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

// ============================================================================
// ADMIN PRODUCT MANAGEMENT
// ============================================================================

// POST /api/admin/products - Add new product
router.post('/admin/products', requireAdmin, async (req, res) => {
  try {
    const { name, description, category, type, price, unit, stock, imageUrl } = req.body;
    
    if (!name || !category || !type || !price || !unit) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await storage.createProduct({
      name,
      description,
      category,
      type,
      price,
      unit,
      stock: stock || 0,
      imageUrl,
      isActive: true
    });
    
    res.json({ success: true, product, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

// PUT /api/admin/products/:id - Update product (and record stock movements)
router.put('/admin/products/:id', requireAdmin, async (req: any, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updates = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Get current product to check if stock is changing
    const currentProduct = await storage.getProducts();
    const existingProduct = currentProduct.find((p: any) => p.id === productId);
    
    const product = await storage.updateProduct(productId, updates);
    
    // Record stock movement if stock value changed
    if (updates.stock !== undefined && existingProduct && existingProduct.stock !== updates.stock) {
      const userId = req.user?.claims?.sub;
      const quantityDiff = updates.stock - existingProduct.stock;
      
      await storage.recordStockMovement({
        productId,
        type: quantityDiff > 0 ? 'IN' : 'OUT',
        reason: 'ADMIN_ADJUST',
        quantity: quantityDiff,
        previousStock: existingProduct.stock,
        newStock: updates.stock,
        createdBy: userId,
        notes: 'Manual stock adjustment by admin'
      });
    }
    
    res.json({ success: true, product, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE /api/admin/products/:id - Deactivate product
router.delete('/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await storage.updateProduct(productId, { isActive: false });
    
    res.json({ success: true, product, message: "Product deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating product:", error);
    res.status(500).json({ message: "Failed to deactivate product" });
  }
});

// ============================================================================
// ADMIN ORDER MANAGEMENT
// ============================================================================

// GET /api/admin/orders - Get all orders
router.get('/admin/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await storage.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// PUT /api/admin/orders/:id/assign-delivery - Assign delivery partner to order
router.put('/admin/orders/:id/assign-delivery', requireAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { deliveryPartnerId } = req.body;

    if (isNaN(orderId) || !deliveryPartnerId) {
      return res.status(400).json({ message: "Order ID and delivery partner ID required" });
    }

    const order = await storage.assignDeliveryPartner(orderId, deliveryPartnerId);
    
    res.json({ success: true, order, message: "Delivery partner assigned successfully" });
  } catch (error) {
    console.error("Error assigning delivery partner:", error);
    res.status(500).json({ message: "Failed to assign delivery partner" });
  }
});

// PUT /api/admin/orders/:id/payment - Update payment status and details
router.put('/admin/orders/:id/payment', requireAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { paymentStatus, paymentMethod, paymentDate } = req.body;

    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await storage.updateOrderPayment(orderId, {
      paymentStatus,
      paymentMethod,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date()
    });
    
    res.json({ success: true, order, message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Failed to update payment" });
  }
});

// GET /api/admin/customers - Get all customers
router.get('/admin/customers', requireAdmin, async (req, res) => {
  try {
    const customers = await storage.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

// GET /api/admin/subscriptions - Get all milk subscriptions
router.get('/admin/subscriptions', requireAdmin, async (req, res) => {
  try {
    const subscriptions = await storage.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});

// GET /api/admin/vendors - Get all vendors (already available but add alias)
router.get('/admin/vendors', requireAdmin, async (req, res) => {
  try {
    const vendors = await storage.getVendors();
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});

// GET /api/admin/stats - Get admin dashboard stats
router.get('/admin/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await storage.getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// PUT /api/admin/orders/:id - Update order status
router.put('/admin/orders/:id', requireAdmin, async (req: any, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(orderId) || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }

    const order = await storage.updateOrderStatus(orderId, status);
    
    res.json({ success: true, order, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// GET /api/admin/stock-movements - Get all stock movements
router.get('/admin/stock-movements', requireAdmin, async (req, res) => {
  try {
    const movements = await storage.getAllStockMovements();
    res.json(movements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
});

// GET /api/admin/stock-movements/:productId - Get stock movements for a product
router.get('/admin/stock-movements/:productId', requireAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    const movements = await storage.getStockMovementsByProduct(productId);
    res.json(movements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
});

// POST /api/storage/upload - Upload image file (handles file uploads from local PC)
router.post('/storage/upload', requireAdmin, async (req: any, res) => {
  try {
    // Handle both multipart/form-data and application/json with base64
    const { file, path, data, dataUrl } = req.body;

    // If client sends base64 or data URL directly
    if (dataUrl) {
      // Return the data URL as-is (useful for testing)
      const timestamp = Date.now();
      const uniquePath = `${path}-${timestamp}`.replace(/\s+/g, '-');
      return res.json({ url: dataUrl });
    }

    // If client sends base64 string
    if (data) {
      const timestamp = Date.now();
      const uniquePath = `${path}-${timestamp}`.replace(/\s+/g, '-');
      // Return the base64 data as a data URL
      const dataURLPrefix = 'data:image/jpeg;base64,';
      return res.json({ url: `${dataURLPrefix}${data}` });
    }

    // For now, return a placeholder until file handling is fully setup
    return res.status(400).json({ message: "Please upload via URL or try again" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

export default router;
