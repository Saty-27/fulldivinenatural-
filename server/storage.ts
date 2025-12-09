import {
  users,
  categories,
  products,
  orders,
  orderItems,
  milkSubscriptions,
  vendors,
  deliveryPartners,
  notifications,
  cart,
  cartItems,
  drivers,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type MilkSubscription,
  type InsertMilkSubscription,
  type Vendor,
  type InsertVendor,
  type DeliveryPartner,
  type InsertDeliveryPartner,
  type Notification,
  type InsertNotification,
  type CartItem,
  type Driver,
  type InsertDriver,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  
  // Order operations
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  getOrdersForDelivery(deliveryPartnerId: number): Promise<Order[]>;
  
  // Order items operations
  getOrderItemsByOrder(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Milk subscription operations
  getMilkSubscriptionByUser(userId: string): Promise<MilkSubscription | undefined>;
  createMilkSubscription(subscription: InsertMilkSubscription): Promise<MilkSubscription>;
  updateMilkSubscription(id: number, subscription: Partial<InsertMilkSubscription>): Promise<MilkSubscription>;
  
  // Vendor operations
  getVendors(): Promise<Vendor[]>;
  getVendorByUser(userId: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  
  // Delivery partner operations
  getDeliveryPartners(): Promise<DeliveryPartner[]>;
  getDeliveryPartnerByUser(userId: string): Promise<DeliveryPartner | undefined>;
  createDeliveryPartner(partner: InsertDeliveryPartner): Promise<DeliveryPartner>;
  
  // Vendor supply operations
  
  // Notification operations
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  
  // Cart operations
  addToCart(userId: string, productId: number, quantity: number): Promise<CartItem>;
  getCartItems(userId: string): Promise<any[]>;
  clearCart(userId: string): Promise<void>;
  
  // Inward log operations
  createInwardLog(inwardLog: InsertInwardLog): Promise<InwardLog>;
  
  // Vendor approval
  approveVendor(vendorId: number): Promise<Vendor>;
  
  // Admin order management
  getAllOrders(): Promise<Order[]>;
  assignDeliveryPartner(orderId: number, deliveryPartnerId: number): Promise<Order>;
  updateOrderPayment(orderId: number, paymentData: { paymentStatus?: string; paymentMethod?: string; paymentDate?: Date }): Promise<Order>;
  
  // Driver management
  addDriver(driver: InsertDriver): Promise<Driver>;
  getDriversByVendor(vendorId: number): Promise<Driver[]>;
  
  // Subscription management - get all subscriptions
  getAllSubscriptions(): Promise<(MilkSubscription & { user?: User })[]>;

  // Stock movement operations
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Create user with password (for simple auth)
  async createUserWithPassword(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    const result = await db.update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    
    if (!result || result.length === 0) {
      throw new Error("Category not found");
    }
    
    return result[0];
  }

  async deleteCategory(id: number): Promise<void> {
    await db.update(categories)
      .set({ isActive: false })
      .where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(asc(products.name));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(eq(products.category, category), eq(products.isActive, true)))
      .orderBy(asc(products.name));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const result = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
      
    if (!result || result.length === 0) {
      throw new Error("Product not found");
    }
    
    return result[0];
  }

  // Order operations
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrdersForDelivery(deliveryPartnerId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.deliveryPartnerId, deliveryPartnerId))
      .orderBy(asc(orders.deliveryDate));
  }

  // Order items operations
  async getOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Milk subscription operations
  async getMilkSubscriptionByUser(userId: string): Promise<MilkSubscription | undefined> {
    const [subscription] = await db.select().from(milkSubscriptions)
      .where(and(eq(milkSubscriptions.userId, userId), eq(milkSubscriptions.isActive, true)));
    return subscription;
  }

  async createMilkSubscription(subscription: InsertMilkSubscription): Promise<MilkSubscription> {
    const [newSubscription] = await db.insert(milkSubscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateMilkSubscription(id: number, subscription: Partial<InsertMilkSubscription>): Promise<MilkSubscription> {
    const [updatedSubscription] = await db.update(milkSubscriptions)
      .set(subscription)
      .where(eq(milkSubscriptions.id, id))
      .returning();
    return updatedSubscription;
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors).orderBy(asc(vendors.businessName));
  }

  async getVendorByUser(userId: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor;
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  // Delivery partner operations
  async getDeliveryPartners(): Promise<DeliveryPartner[]> {
    return await db.select().from(deliveryPartners);
  }

  async getDeliveryPartnerByUser(userId: string): Promise<DeliveryPartner | undefined> {
    const [partner] = await db.select().from(deliveryPartners).where(eq(deliveryPartners.userId, userId));
    return partner;
  }

  async createDeliveryPartner(partner: InsertDeliveryPartner): Promise<DeliveryPartner> {
    const [newPartner] = await db.insert(deliveryPartners).values(partner).returning();
    return newPartner;
  }

  // Notification operations
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [updatedNotification] = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }
  
  // Cart operations
  async addToCart(userId: string, productId: number, quantity: number): Promise<CartItem> {
    // Get or create cart for user
    let userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    let cartId: number;
    
    if (userCart.length === 0) {
      const [newCart] = await db.insert(cart).values({ userId }).returning();
      cartId = newCart.id;
    } else {
      cartId = userCart[0].id;
    }
    
    // Get product price
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) {
      throw new Error("Product not found");
    }
    
    // Check if item already in cart
    const existingItem = await db.select().from(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
      .limit(1);
    
    if (existingItem.length > 0) {
      // Update quantity
      const [updatedItem] = await db.update(cartItems)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      return updatedItem;
    } else {
      // Add new item
      const [newItem] = await db.insert(cartItems)
        .values({ cartId, productId, quantity, price: product.price })
        .returning();
      return newItem;
    }
  }
  
  async getCartItems(userId: string): Promise<any[]> {
    // Get user's cart
    const userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    
    if (userCart.length === 0) {
      return [];
    }
    
    // Get cart items with product details
    const items = await db
      .select({
        id: cartItems.id,
        cartId: cartItems.cartId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        price: cartItems.price,
        productName: products.name,
        productImage: products.imageUrl,
        productUnit: products.unit
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, userCart[0].id));
    
    return items;
  }
  
  async clearCart(userId: string): Promise<void> {
    const userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    
    if (userCart.length > 0) {
      await db.delete(cartItems).where(eq(cartItems.cartId, userCart[0].id));
    }
  }
  
  // Inward log operations (deprecated - table removed from schema)
  async createInwardLog(inwardLog: any): Promise<any> {
    // Inward logs functionality deprecated - table not in active schema
    // Return empty object for backwards compatibility
    return {};
  }
  
  // Vendor approval
  async approveVendor(vendorId: number): Promise<Vendor> {
    const [updatedVendor] = await db.update(vendors)
      .set({ isVerified: true })
      .where(eq(vendors.id, vendorId))
      .returning();
    return updatedVendor;
  }
  
  // Admin order management
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  
  async assignDeliveryPartner(orderId: number, deliveryPartnerId: number): Promise<Order> {
    // Validate delivery partner exists and is available
    const [partner] = await db.select().from(deliveryPartners).where(
      and(eq(deliveryPartners.id, deliveryPartnerId), eq(deliveryPartners.isAvailable, true))
    );
    if (!partner) {
      throw new Error("Delivery partner not found or not available");
    }
    
    // Validate order exists
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      throw new Error("Order not found");
    }
    
    const result = await db.update(orders)
      .set({ deliveryPartnerId })
      .where(eq(orders.id, orderId))
      .returning();
    
    if (!result || result.length === 0) {
      throw new Error("Failed to update order");
    }
    
    return result[0];
  }
  
  async updateOrderPayment(orderId: number, paymentData: { paymentStatus?: string; paymentMethod?: string; paymentDate?: Date }): Promise<Order> {
    // Validate order exists
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Validate payment status transitions if provided
    if (paymentData.paymentStatus) {
      const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
      if (!validStatuses.includes(paymentData.paymentStatus)) {
        throw new Error("Invalid payment status");
      }
    }
    
    const result = await db.update(orders)
      .set(paymentData)
      .where(eq(orders.id, orderId))
      .returning();
      
    if (!result || result.length === 0) {
      throw new Error("Failed to update order payment");
    }
    
    return result[0];
  }
  
  // Driver management
  async addDriver(driver: InsertDriver): Promise<Driver> {
    const [newDriver] = await db.insert(drivers).values(driver).returning();
    return newDriver;
  }
  
  async getDriversByVendor(vendorId: number): Promise<Driver[]> {
    return await db.select().from(drivers)
      .where(eq(drivers.vendorId, vendorId))
      .orderBy(desc(drivers.createdAt));
  }
  
  // Customer management - get all customers
  async getAllCustomers(): Promise<User[]> {
    return await db.select().from(users)
      .where(eq(users.role, 'customer'))
      .orderBy(desc(users.createdAt));
  }
  
  // Subscription management - get all subscriptions
  async getAllSubscriptions(): Promise<(MilkSubscription & { user?: User })[]> {
    const allSubscriptions = await db.select().from(milkSubscriptions)
      .orderBy(desc(milkSubscriptions.createdAt));
    
    // Enrich with user data
    const enrichedSubscriptions = await Promise.all(
      allSubscriptions.map(async (sub) => {
        const user = await this.getUser(sub.userId);
        return { ...sub, user };
      })
    );
    
    return enrichedSubscriptions;
  }
  
  // Admin stats
  async getAdminStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    totalVendors: number;
    totalDeliveryPartners: number;
    lowStockProducts: number;
  }> {
    const allOrders = await db.select().from(orders);
    const allProducts = await db.select().from(products);
    const allVendors = await db.select().from(vendors);
    const allDeliveryPartners = await db.select().from(deliveryPartners);
    const allCustomers = await db.select().from(users).where(eq(users.role, 'customer'));
    
    const totalRevenue = allOrders.reduce((sum: number, order: any) => {
      return sum + (parseFloat(order.totalAmount) || 0);
    }, 0);
    
    const pendingOrders = allOrders.filter((o: any) => o.status === 'pending').length;
    const completedOrders = allOrders.filter((o: any) => o.status === 'completed').length;
    const lowStockProducts = allProducts.filter((p: any) => p.stock && p.stock <= 50).length;
    
    return {
      totalOrders: allOrders.length,
      pendingOrders,
      completedOrders,
      totalRevenue: Math.round(totalRevenue),
      totalCustomers: allCustomers.length,
      totalProducts: allProducts.length,
      totalVendors: allVendors.length,
      totalDeliveryPartners: allDeliveryPartners.length,
      lowStockProducts,
    };
  }

  // Stock movement functions removed - table not in schema
}


export const storage = new DatabaseStorage();
