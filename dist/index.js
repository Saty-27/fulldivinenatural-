var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import fileUpload from "express-fileupload";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  addresses: () => addresses,
  addressesRelations: () => addressesRelations,
  admins: () => admins,
  adminsRelations: () => adminsRelations,
  alerts: () => alerts,
  cart: () => cart,
  cartItems: () => cartItems,
  cartItemsRelations: () => cartItemsRelations,
  cartRelations: () => cartRelations,
  categories: () => categories,
  coupons: () => coupons,
  dailyVendorPerformance: () => dailyVendorPerformance,
  delegationLogs: () => delegationLogs,
  deliveryPartners: () => deliveryPartners,
  deliveryPartnersRelations: () => deliveryPartnersRelations,
  drivers: () => drivers,
  driversRelations: () => driversRelations,
  faqs: () => faqs,
  insertAddressSchema: () => insertAddressSchema,
  insertMilkSubscriptionSchema: () => insertMilkSubscriptionSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertSupportTicketSchema: () => insertSupportTicketSchema,
  insertTicketMessageSchema: () => insertTicketMessageSchema,
  inwardLogs: () => inwardLogs,
  marketingStaff: () => marketingStaff,
  milkSubscriptions: () => milkSubscriptions,
  milkSubscriptionsRelations: () => milkSubscriptionsRelations,
  notifications: () => notifications,
  offers: () => offers,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orderRatings: () => orderRatings,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  productVendors: () => productVendors,
  productVendorsRelations: () => productVendorsRelations,
  products: () => products,
  productsRelations: () => productsRelations,
  referrals: () => referrals,
  rewardPoints: () => rewardPoints,
  sessions: () => sessions,
  stockMovements: () => stockMovements,
  subscriptionDeliveries: () => subscriptionDeliveries,
  subscriptionDeliveriesRelations: () => subscriptionDeliveriesRelations,
  supportTickets: () => supportTickets,
  ticketMessages: () => ticketMessages,
  users: () => users2,
  usersRelations: () => usersRelations,
  vendorDeliveryAssignments: () => vendorDeliveryAssignments,
  vendorRequirements: () => vendorRequirements,
  vendorSupply: () => vendorSupply,
  vendors: () => vendors,
  vendorsRelations: () => vendorsRelations,
  walletTransactions: () => walletTransactions
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users2 = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  passwordHash: varchar("password_hash"),
  // For simple email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  address: text("address"),
  gender: varchar("gender"),
  // male, female, other
  dob: date("dob"),
  // date of birth for STAGE 1
  role: varchar("role").notNull().default("customer"),
  // customer, admin, vendor, delivery, marketing_staff
  isActive: boolean("is_active").default(true),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  icon: varchar("icon"),
  // emoji or icon name - kept for compatibility, can store image URLs too
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  sku: varchar("sku").unique(),
  description: text("description"),
  category: varchar("category").notNull(),
  // References categories.name
  type: varchar("type").notNull(),
  // MILK, DAIRY
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit").notNull(),
  // L, kg, g, piece
  stock: integer("stock").default(0),
  expiryDate: date("expiry_date"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id),
  businessName: varchar("business_name").notNull(),
  licenseNumber: varchar("license_number"),
  locationName: varchar("location_name").notNull(),
  // Borivali, Santa Cruz, Andheri etc.
  vendorType: varchar("vendor_type").notNull().default("SUB_VENDOR"),
  // HEAD_VENDOR, VENDOR, SUB_VENDOR
  headVendorId: integer("head_vendor_id"),
  // self-reference, will add constraint later
  parentVendorId: integer("parent_vendor_id"),
  // self-reference, will add constraint later
  dailyCapacity: integer("daily_capacity"),
  // in liters
  currentQuota: integer("current_quota").default(0),
  requirementToday: integer("requirement_today").default(0),
  requirementTomorrowForecast: integer("requirement_tomorrow_forecast").default(0),
  circulatedLiters: integer("circulated_liters").default(0),
  revenueToday: decimal("revenue_today", { precision: 10, scale: 2 }).default("0"),
  revenueTotal: decimal("revenue_total", { precision: 10, scale: 2 }).default("0"),
  paymentsPending: decimal("payments_pending", { precision: 10, scale: 2 }).default("0"),
  weeklyEarnings: decimal("weekly_earnings", { precision: 10, scale: 2 }).default("0"),
  monthlyEarnings: decimal("monthly_earnings", { precision: 10, scale: 2 }).default("0"),
  zone: varchar("zone"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var deliveryPartners = pgTable("delivery_partners", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id),
  vehicleType: varchar("vehicle_type"),
  licenseNumber: varchar("license_number"),
  zone: varchar("zone"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  age: integer("age").notNull(),
  phone: varchar("phone").notNull(),
  aadharUrl: varchar("aadhar_url"),
  // optional KYC document
  panUrl: varchar("pan_url"),
  // optional KYC document
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id).notNull(),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  role: varchar("role").notNull(),
  // SUPER, HEAD, SUB
  locationScope: jsonb("location_scope"),
  // array of location strings
  permissions: jsonb("permissions").notNull(),
  // permission flags object
  createdByUserId: varchar("created_by_user_id").references(() => users2.id),
  createdAt: timestamp("created_at").defaultNow()
});
var delegationLogs = pgTable("delegation_logs", {
  id: serial("id").primaryKey(),
  fromVendorId: integer("from_vendor_id").references(() => vendors.id).notNull(),
  toVendorId: integer("to_vendor_id").references(() => vendors.id).notNull(),
  orderIds: jsonb("order_ids").notNull(),
  // array of order IDs
  delegatedByAdminId: integer("delegated_by_admin_id").references(() => admins.id).notNull(),
  reason: text("reason").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id),
  vendorId: integer("vendor_id").references(() => vendors.id),
  deliveryPartnerId: integer("delivery_partner_id").references(() => deliveryPartners.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  liters: integer("liters").default(0),
  // total milk liters in order
  status: varchar("status").notNull().default("PLACED"),
  // PLACED, PREPARING, OUT, DELIVERED, FAILED
  deliverySlot: varchar("delivery_slot"),
  // morning, evening etc.
  deliveryDate: date("delivery_date").notNull(),
  deliveryTime: varchar("delivery_time"),
  deliveryAddress: text("delivery_address").notNull(),
  paymentStatus: varchar("payment_status").default("pending"),
  // pending, paid, failed
  paymentMethod: varchar("payment_method").default("cash_on_delivery"),
  // cash_on_delivery, online, wallet, upi
  paymentDate: timestamp("payment_date"),
  // when payment was received
  delegationLogId: integer("delegation_log_id").references(() => delegationLogs.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull()
});
var milkSubscriptions = pgTable("milk_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id),
  productId: integer("product_id").references(() => products.id),
  quantity: decimal("quantity", { precision: 5, scale: 2 }).notNull(),
  // supports 0.5L, 1L, 1.5L, etc
  frequency: varchar("frequency").notNull(),
  // daily, weekly, alternate
  deliveryTime: varchar("delivery_time").notNull(),
  // 6-7 AM, 7-8 AM, etc
  startDate: date("start_date").notNull(),
  nextDeliveryDate: date("next_delivery_date"),
  endDate: date("end_date"),
  status: varchar("status").default("ACTIVE"),
  // ACTIVE, PAUSED, CANCELLED
  isActive: boolean("is_active").default(true),
  isPaused: boolean("is_paused").default(false),
  pauseRange: jsonb("pause_range"),
  // {from: date, to: date}
  vendorId: integer("vendor_id").references(() => vendors.id),
  pricePerL: decimal("price_per_l", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var subscriptionDeliveries = pgTable("subscription_deliveries", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => milkSubscriptions.id),
  userId: varchar("user_id").references(() => users2.id),
  deliveryDate: date("delivery_date").notNull(),
  quantity: decimal("quantity", { precision: 5, scale: 2 }).notNull(),
  status: varchar("status").default("UPCOMING"),
  // UPCOMING, DELIVERED, SKIPPED, MISSED
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  uniqueSubscriptionDate: index("unique_subscription_date").on(table.subscriptionId, table.deliveryDate)
}));
var vendorSupply = pgTable("vendor_supply", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  date: date("date").notNull(),
  requiredQuantity: integer("required_quantity"),
  // assigned by admin
  confirmedQuantity: integer("confirmed_quantity"),
  // confirmed by vendor
  actualQuantity: integer("actual_quantity"),
  // delivered quantity
  notes: text("notes"),
  status: varchar("status").default("pending"),
  // pending, confirmed, delivered
  createdAt: timestamp("created_at").defaultNow()
});
var inwardLogs = pgTable("inward_logs", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  litersArrived: integer("liters_arrived").notNull(),
  litersDelivered: integer("liters_delivered").notNull(),
  litersPending: integer("liters_pending").notNull(),
  driverInfo: jsonb("driver_info").notNull(),
  // {name, age, phone, aadharUrl?, panUrl?}
  reportedByUserId: varchar("reported_by_user_id").references(() => users2.id).notNull(),
  sentToAdmin: boolean("sent_to_admin").default(false),
  status: varchar("status").default("PENDING"),
  // PENDING, APPROVED, REJECTED
  adminComments: text("admin_comments"),
  approvedByUserId: varchar("approved_by_user_id").references(() => users2.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var dailyVendorPerformance = pgTable("daily_vendor_performance", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  date: date("date").notNull(),
  requirementSet: integer("requirement_set").default(0),
  // what was originally required
  milkCirculated: integer("milk_circulated").default(0),
  // what was actually received/procured
  milkDelivered: integer("milk_delivered").default(0),
  // what was delivered to customers
  milkPending: integer("milk_pending").default(0),
  // what's pending delivery
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  deliveryCompletionRate: decimal("delivery_completion_rate", { precision: 5, scale: 2 }).default("0"),
  // percentage
  paymentReceived: decimal("payment_received", { precision: 10, scale: 2 }).default("0"),
  paymentDue: decimal("payment_due", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow()
});
var vendorDeliveryAssignments = pgTable("vendor_delivery_assignments", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  deliveryPartnerId: integer("delivery_partner_id").references(() => drivers.id).notNull(),
  assignmentDate: date("assignment_date").notNull(),
  deliveryStatus: varchar("delivery_status").default("PENDING"),
  // PENDING, IN_PROGRESS, COMPLETED, FAILED
  route: text("route"),
  // delivery route information
  assignedLiters: integer("assigned_liters").default(0),
  deliveredLiters: integer("delivered_liters").default(0),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var vendorRequirements = pgTable("vendor_requirements", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  date: date("date").notNull(),
  requiredLiters: integer("required_liters").notNull(),
  forecastType: varchar("forecast_type").notNull().default("MANUAL"),
  // MANUAL, AI, HISTORICAL
  actualDemand: integer("actual_demand").default(0),
  // actual demand that day
  demandFulfilled: integer("demand_fulfilled").default(0),
  // how much was actually fulfilled
  shortfall: integer("shortfall").default(0),
  // difference between demand and fulfillment
  fulfillmentRate: decimal("fulfillment_rate", { precision: 5, scale: 2 }).default("0"),
  // percentage
  submittedByUserId: varchar("submitted_by_user_id").references(() => users2.id).notNull(),
  isSubmitted: boolean("is_submitted").default(false),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var marketingStaff = pgTable("marketing_staff", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id).notNull(),
  name: varchar("name").notNull(),
  role: varchar("role").default("MARKETING_EXEC"),
  assignedLocations: jsonb("assigned_locations").notNull(),
  // array of location strings
  createdByAdminId: integer("created_by_admin_id").references(() => admins.id).notNull(),
  offlineOrdersCaptured: jsonb("offline_orders_captured").default("[]"),
  // array of order IDs
  createdAt: timestamp("created_at").defaultNow()
});
var alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(),
  // DELAY, INWARD, COMPLAINT, LOW_STOCK
  scope: varchar("scope"),
  // location name or vendor ID
  severity: varchar("severity").notNull(),
  // INFO, WARNING, CRITICAL
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  resolved: boolean("resolved").default(false),
  assignedToUserId: varchar("assigned_to_user_id").references(() => users2.id),
  resolvedByUserId: varchar("resolved_by_user_id").references(() => users2.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(),
  // order, delivery, payment, general, alert
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").references(() => cart.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  addedAt: timestamp("added_at").defaultNow()
}, (table) => ({
  uniqueCartProduct: index("unique_cart_product").on(table.cartId, table.productId)
}));
var addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id).notNull(),
  type: varchar("type").notNull(),
  // home, work, other
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  landmark: text("landmark"),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  pincode: varchar("pincode").notNull(),
  instructions: text("instructions"),
  isDefault: boolean("is_default").default(false),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at").defaultNow()
});
var walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id).notNull(),
  type: varchar("type").notNull(),
  // credit, debit
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  referenceId: varchar("reference_id"),
  category: varchar("category"),
  // order, refund, cashback, topup, withdrawal
  createdAt: timestamp("created_at").defaultNow()
});
var offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(),
  // discount, cashback, bundle, seasonal
  discountType: varchar("discount_type"),
  // percentage, fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to").notNull(),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow()
});
var coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code").unique().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  discountType: varchar("discount_type").notNull(),
  // percentage, fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to").notNull(),
  usageLimit: integer("usage_limit"),
  usagePerUser: integer("usage_per_user").default(1),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var rewardPoints = pgTable("reward_points", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id).notNull(),
  points: integer("points").default(0),
  tier: varchar("tier").default("silver"),
  // silver, gold, platinum
  lifetimePoints: integer("lifetime_points").default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});
var referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: varchar("referrer_id").references(() => users2.id).notNull(),
  referredUserId: varchar("referred_user_id").references(() => users2.id),
  referralCode: varchar("referral_code").unique().notNull(),
  status: varchar("status").default("pending"),
  // pending, completed, rewarded
  referrerReward: decimal("referrer_reward", { precision: 10, scale: 2 }),
  referredReward: decimal("referred_reward", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at")
});
var supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users2.id).notNull(),
  category: varchar("category").notNull(),
  // delivery, payment, quality, technical, other
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("open"),
  // open, in_progress, resolved, closed
  priority: varchar("priority").default("medium"),
  // low, medium, high
  orderId: integer("order_id").references(() => orders.id),
  assignedToUserId: varchar("assigned_to_user_id").references(() => users2.id),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});
var ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTickets.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users2.id).notNull(),
  message: text("message").notNull(),
  isStaff: boolean("is_staff").default(false),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow()
});
var faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  category: varchar("category").notNull(),
  // delivery, products, subscription, payment
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var orderRatings = pgTable("order_ratings", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  userId: varchar("user_id").references(() => users2.id).notNull(),
  productRating: integer("product_rating"),
  // 1-5
  deliveryRating: integer("delivery_rating"),
  // 1-5
  overallRating: integer("overall_rating").notNull(),
  // 1-5
  review: text("review"),
  images: jsonb("images"),
  createdAt: timestamp("created_at").defaultNow()
});
var stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  type: varchar("type").notNull(),
  // "IN" or "OUT"
  reason: varchar("reason").notNull(),
  // "ADMIN_ADJUST" | "ORDER_PLACED" | "ORDER_CANCELLED" | "RETURN" | "RESTOCK"
  quantity: integer("quantity").notNull(),
  // positive for IN, negative for OUT
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  createdBy: varchar("created_by").references(() => users2.id),
  orderId: integer("order_id").references(() => orders.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var productVendors = pgTable("product_vendors", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  stock: integer("stock").default(0),
  priceOverride: decimal("price_override", { precision: 10, scale: 2 }),
  // vendor-specific pricing
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users2, ({ many, one }) => ({
  orders: many(orders),
  milkSubscriptions: many(milkSubscriptions),
  vendor: one(vendors, {
    fields: [users2.id],
    references: [vendors.userId]
  }),
  deliveryPartner: one(deliveryPartners, {
    fields: [users2.id],
    references: [deliveryPartners.userId]
  }),
  admin: one(admins, {
    fields: [users2.id],
    references: [admins.userId]
  })
}));
var productsRelations = relations(products, ({ many }) => ({
  subscriptions: many(milkSubscriptions)
}));
var milkSubscriptionsRelations = relations(milkSubscriptions, ({ one, many }) => ({
  user: one(users2, {
    fields: [milkSubscriptions.userId],
    references: [users2.id]
  }),
  product: one(products, {
    fields: [milkSubscriptions.productId],
    references: [products.id]
  }),
  deliveries: many(subscriptionDeliveries)
}));
var subscriptionDeliveriesRelations = relations(subscriptionDeliveries, ({ one }) => ({
  subscription: one(milkSubscriptions, {
    fields: [subscriptionDeliveries.subscriptionId],
    references: [milkSubscriptions.id]
  }),
  user: one(users2, {
    fields: [subscriptionDeliveries.userId],
    references: [users2.id]
  })
}));
var ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  user: one(users2, {
    fields: [orders.userId],
    references: [users2.id]
  })
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));
var vendorsRelations = relations(vendors, ({ many, one }) => ({
  orders: many(orders),
  productVendors: many(productVendors),
  subscriptions: many(milkSubscriptions)
}));
var deliveryPartnersRelations = relations(deliveryPartners, ({ one }) => ({
  user: one(users2, {
    fields: [deliveryPartners.userId],
    references: [users2.id]
  })
}));
var driversRelations = relations(drivers, ({ one }) => ({
  vendor: one(vendors, {
    fields: [drivers.vendorId],
    references: [vendors.id]
  })
}));
var adminsRelations = relations(admins, ({ one }) => ({
  user: one(users2, {
    fields: [admins.userId],
    references: [users2.id]
  })
}));
var cartRelations = relations(cart, ({ many }) => ({
  items: many(cartItems)
}));
var cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));
var addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users2, {
    fields: [addresses.userId],
    references: [users2.id]
  })
}));
var productVendorsRelations = relations(productVendors, ({ one }) => ({
  product: one(products, {
    fields: [productVendors.productId],
    references: [products.id]
  }),
  vendor: one(vendors, {
    fields: [productVendors.vendorId],
    references: [vendors.id]
  })
}));
var insertAddressSchema = createInsertSchema(addresses);
var insertOrderSchema = createInsertSchema(orders);
var insertSubscriptionSchema = createInsertSchema(milkSubscriptions);
var insertMilkSubscriptionSchema = createInsertSchema(milkSubscriptions);
var insertSupportTicketSchema = createInsertSchema(supportTickets);
var insertTicketMessageSchema = createInsertSchema(ticketMessages);
var insertProductSchema = createInsertSchema(products);

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc, asc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations - mandatory for Replit Auth
  async getUser(id) {
    const [user] = await db.select().from(users2).where(eq(users2.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users2).values(userData).onConflictDoUpdate({
      target: users2.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Get user by email
  async getUserByEmail(email) {
    const [user] = await db.select().from(users2).where(eq(users2.email, email));
    return user;
  }
  // Create user with password (for simple auth)
  async createUserWithPassword(userData) {
    const [user] = await db.insert(users2).values(userData).returning();
    return user;
  }
  // Category operations
  async getCategories() {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name));
  }
  async createCategory(category) {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  async updateCategory(id, category) {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    if (!result || result.length === 0) {
      throw new Error("Category not found");
    }
    return result[0];
  }
  async deleteCategory(id) {
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  }
  // Product operations
  async getProducts() {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(asc(products.name));
  }
  async getProductsByCategory(category) {
    return await db.select().from(products).where(and(eq(products.category, category), eq(products.isActive, true))).orderBy(asc(products.name));
  }
  async createProduct(product) {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  async updateProduct(id, product) {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    if (!result || result.length === 0) {
      throw new Error("Product not found");
    }
    return result[0];
  }
  // Order operations
  async getOrdersByUser(userId) {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }
  async getOrderById(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  async createOrder(order) {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  async updateOrderStatus(id, status) {
    const [updatedOrder] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updatedOrder;
  }
  async getOrdersForDelivery(deliveryPartnerId) {
    return await db.select().from(orders).where(eq(orders.deliveryPartnerId, deliveryPartnerId)).orderBy(asc(orders.deliveryDate));
  }
  // Order items operations
  async getOrderItemsByOrder(orderId) {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  async createOrderItem(orderItem) {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }
  // Milk subscription operations
  async getMilkSubscriptionByUser(userId) {
    const [subscription] = await db.select().from(milkSubscriptions).where(and(eq(milkSubscriptions.userId, userId), eq(milkSubscriptions.isActive, true)));
    return subscription;
  }
  async createMilkSubscription(subscription) {
    const [newSubscription] = await db.insert(milkSubscriptions).values(subscription).returning();
    return newSubscription;
  }
  async updateMilkSubscription(id, subscription) {
    const [updatedSubscription] = await db.update(milkSubscriptions).set(subscription).where(eq(milkSubscriptions.id, id)).returning();
    return updatedSubscription;
  }
  // Vendor operations
  async getVendors() {
    return await db.select().from(vendors).orderBy(asc(vendors.businessName));
  }
  async getVendorByUser(userId) {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor;
  }
  async createVendor(vendor) {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }
  // Delivery partner operations
  async getDeliveryPartners() {
    return await db.select().from(deliveryPartners);
  }
  async getDeliveryPartnerByUser(userId) {
    const [partner] = await db.select().from(deliveryPartners).where(eq(deliveryPartners.userId, userId));
    return partner;
  }
  async createDeliveryPartner(partner) {
    const [newPartner] = await db.insert(deliveryPartners).values(partner).returning();
    return newPartner;
  }
  // Vendor supply operations
  async getVendorSuppliesByVendor(vendorId) {
    return await db.select().from(vendorSupply).where(eq(vendorSupply.vendorId, vendorId)).orderBy(desc(vendorSupply.date));
  }
  async createVendorSupply(supply) {
    const [newSupply] = await db.insert(vendorSupply).values(supply).returning();
    return newSupply;
  }
  async updateVendorSupply(id, supply) {
    const [updatedSupply] = await db.update(vendorSupply).set(supply).where(eq(vendorSupply.id, id)).returning();
    return updatedSupply;
  }
  // Notification operations
  async getNotificationsByUser(userId) {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }
  async createNotification(notification) {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }
  async markNotificationAsRead(id) {
    const [updatedNotification] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
    return updatedNotification;
  }
  // Cart operations
  async addToCart(userId, productId, quantity) {
    let userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    let cartId;
    if (userCart.length === 0) {
      const [newCart] = await db.insert(cart).values({ userId }).returning();
      cartId = newCart.id;
    } else {
      cartId = userCart[0].id;
    }
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) {
      throw new Error("Product not found");
    }
    const existingItem = await db.select().from(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))).limit(1);
    if (existingItem.length > 0) {
      const [updatedItem] = await db.update(cartItems).set({ quantity: existingItem[0].quantity + quantity }).where(eq(cartItems.id, existingItem[0].id)).returning();
      return updatedItem;
    } else {
      const [newItem] = await db.insert(cartItems).values({ cartId, productId, quantity, price: product.price }).returning();
      return newItem;
    }
  }
  async getCartItems(userId) {
    const userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    if (userCart.length === 0) {
      return [];
    }
    const items = await db.select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      price: cartItems.price,
      productName: products.name,
      productImage: products.imageUrl,
      productUnit: products.unit
    }).from(cartItems).innerJoin(products, eq(cartItems.productId, products.id)).where(eq(cartItems.cartId, userCart[0].id));
    return items;
  }
  async clearCart(userId) {
    const userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    if (userCart.length > 0) {
      await db.delete(cartItems).where(eq(cartItems.cartId, userCart[0].id));
    }
  }
  // Inward log operations
  async createInwardLog(inwardLog) {
    const [newLog] = await db.insert(inwardLogs).values(inwardLog).returning();
    return newLog;
  }
  // Vendor approval
  async approveVendor(vendorId) {
    const [updatedVendor] = await db.update(vendors).set({ isVerified: true }).where(eq(vendors.id, vendorId)).returning();
    return updatedVendor;
  }
  // Admin order management
  async getAllOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  async assignDeliveryPartner(orderId, deliveryPartnerId) {
    const [partner] = await db.select().from(deliveryPartners).where(
      and(eq(deliveryPartners.id, deliveryPartnerId), eq(deliveryPartners.isAvailable, true))
    );
    if (!partner) {
      throw new Error("Delivery partner not found or not available");
    }
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      throw new Error("Order not found");
    }
    const result = await db.update(orders).set({ deliveryPartnerId }).where(eq(orders.id, orderId)).returning();
    if (!result || result.length === 0) {
      throw new Error("Failed to update order");
    }
    return result[0];
  }
  async updateOrderPayment(orderId, paymentData) {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      throw new Error("Order not found");
    }
    if (paymentData.paymentStatus) {
      const validStatuses = ["pending", "paid", "failed", "refunded"];
      if (!validStatuses.includes(paymentData.paymentStatus)) {
        throw new Error("Invalid payment status");
      }
    }
    const result = await db.update(orders).set(paymentData).where(eq(orders.id, orderId)).returning();
    if (!result || result.length === 0) {
      throw new Error("Failed to update order payment");
    }
    return result[0];
  }
  // Driver management
  async addDriver(driver) {
    const [newDriver] = await db.insert(drivers).values(driver).returning();
    return newDriver;
  }
  async getDriversByVendor(vendorId) {
    return await db.select().from(drivers).where(eq(drivers.vendorId, vendorId)).orderBy(desc(drivers.createdAt));
  }
  // Customer management - get all customers
  async getAllCustomers() {
    return await db.select().from(users2).where(eq(users2.role, "customer")).orderBy(desc(users2.createdAt));
  }
  // Subscription management - get all subscriptions
  async getAllSubscriptions() {
    const allSubscriptions = await db.select().from(milkSubscriptions).orderBy(desc(milkSubscriptions.createdAt));
    const enrichedSubscriptions = await Promise.all(
      allSubscriptions.map(async (sub) => {
        const user = await this.getUser(sub.userId);
        return { ...sub, user };
      })
    );
    return enrichedSubscriptions;
  }
  // Admin stats
  async getAdminStats() {
    const allOrders = await db.select().from(orders);
    const allProducts = await db.select().from(products);
    const allVendors = await db.select().from(vendors);
    const allDeliveryPartners = await db.select().from(deliveryPartners);
    const allCustomers = await db.select().from(users2).where(eq(users2.role, "customer"));
    const totalRevenue = allOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.totalAmount) || 0);
    }, 0);
    const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
    const completedOrders = allOrders.filter((o) => o.status === "completed").length;
    const lowStockProducts = allProducts.filter((p) => p.stock && p.stock <= 50).length;
    return {
      totalOrders: allOrders.length,
      pendingOrders,
      completedOrders,
      totalRevenue: Math.round(totalRevenue),
      totalCustomers: allCustomers.length,
      totalProducts: allProducts.length,
      totalVendors: allVendors.length,
      totalDeliveryPartners: allDeliveryPartners.length,
      lowStockProducts
    };
  }
  // Stock movement operations
  async recordStockMovement(movement) {
    const [newMovement] = await db.insert(stockMovements).values(movement).returning();
    return newMovement;
  }
  async getStockMovementsByProduct(productId) {
    return await db.select().from(stockMovements).where(eq(stockMovements.productId, productId)).orderBy(desc(stockMovements.createdAt));
  }
  async getAllStockMovements() {
    return await db.select().from(stockMovements).orderBy(desc(stockMovements.createdAt));
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-replace-in-production-1bbb8dc397432601dbfd287a827825dfa4b44f0dca956dd83527bd6f94e0cbac5c144424ec2c2819725d1abe72d2894d72f0086fcc23f2a87bf28e235348cddb",
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
      sameSite: "lax",
      path: "/"
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  const sessionMiddleware = getSession();
  app2.use((req, res, next) => {
    console.log("\u{1F4E5} Before session middleware:", {
      method: req.method,
      path: req.path,
      cookiesHeader: req.headers.cookie?.substring(0, 100)
    });
    next();
  });
  app2.use(sessionMiddleware);
  app2.use((req, res, next) => {
    console.log("\u{1F4E4} After session middleware:", {
      method: req.method,
      path: req.path,
      sessionId: req.sessionID,
      sessionUserId: req.session?.userId
    });
    next();
  });
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    const claims = tokens.claims();
    if (claims && claims["sub"]) {
      const dbUser = await storage.getUser(claims["sub"]);
      if (dbUser) {
        user.role = dbUser.role;
        user.id = dbUser.id;
      }
    }
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  console.log("\u{1F510} isAuthenticated middleware:", {
    method: req.method,
    path: req.path,
    sessionId: req.sessionID,
    hasSession: !!req.session,
    sessionUserId: req.session?.userId,
    cookies: req.headers.cookie?.substring(0, 100)
  });
  if (req.session && req.session.userId) {
    console.log("\u2705 Session auth PASSED for", req.method, req.path);
    return next();
  }
  console.log("\u274C No session userId, checking OIDC for", req.method, req.path);
  const user = req.user;
  if (!req.isAuthenticated() || !user?.expires_at) {
    console.log("\u274C OIDC auth also failed");
    return res.status(401).json({ message: "Unauthorized - Please log in" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes/auth.routes.ts
import { nanoid } from "nanoid";
import bcryptjs from "bcryptjs";
function setupAuthRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: "User not found. Please sign up first.",
          code: "USER_NOT_FOUND"
        });
      }
      const passwordMatch = await bcryptjs.compare(
        password,
        user.passwordHash || ""
      );
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.userEmail = user.email;
      console.log("\u{1F4DD} Setting session:", {
        sessionId: req.sessionID,
        userId: user.id,
        email: user.email
      });
      req.session.save((err) => {
        if (err) {
          console.error("\u274C Session save error:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }
        console.log("\u2705 Session saved successfully:", {
          sessionId: req.sessionID,
          userId: req.session.userId
        });
        res.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role
          }
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone, address } = req.body;
      const profilePhoto = req.files?.profilePhoto;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters"
        });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "Email already registered. Please login instead.",
          code: "USER_EXISTS"
        });
      }
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(password, salt);
      let profileImageUrl = void 0;
      if (profilePhoto) {
        profileImageUrl = `/uploads/${profilePhoto.name}`;
      }
      const newUser = await storage.createUserWithPassword({
        id: nanoid(),
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        address,
        profileImageUrl,
        role: "customer"
      });
      req.session.userId = newUser.id;
      req.session.userRole = newUser.role;
      req.session.userEmail = newUser.email;
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to create session" });
        }
        res.status(201).json({
          message: "Signup successful",
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
          }
        });
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed" });
    }
  });
  app2.get("/api/auth/current-user", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        profileImageUrl: user.profileImageUrl,
        role: user.role
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });
}

// server/routes/cart.routes.ts
import { Router } from "express";

// server/storage/cart.repository.ts
import { eq as eq2, and as and2 } from "drizzle-orm";
var CartRepository = class {
  async getOrCreateCart(userId) {
    const existing = await db.query.cart.findFirst({
      where: eq2(cart.userId, userId)
    });
    if (existing) {
      return existing;
    }
    const [newCart] = await db.insert(cart).values({ userId }).returning();
    return newCart;
  }
  async getCartWithItems(userId) {
    const userCart = await this.getOrCreateCart(userId);
    const items = await db.query.cartItems.findMany({
      where: eq2(cartItems.cartId, userCart.id),
      with: {
        product: true
      }
    });
    return {
      cart: userCart,
      items
    };
  }
  async addOrUpdateItem(userId, productId, quantity) {
    const userCart = await this.getOrCreateCart(userId);
    const product = await db.query.products.findFirst({
      where: eq2(products.id, productId)
    });
    if (!product) {
      throw new Error("Product not found");
    }
    const existingItem = await db.query.cartItems.findFirst({
      where: and2(
        eq2(cartItems.cartId, userCart.id),
        eq2(cartItems.productId, productId)
      )
    });
    if (existingItem) {
      const [updated] = await db.update(cartItems).set({ quantity: existingItem.quantity + quantity }).where(eq2(cartItems.id, existingItem.id)).returning();
      return updated;
    }
    const [newItem] = await db.insert(cartItems).values({
      cartId: userCart.id,
      productId,
      quantity,
      price: product.price
    }).returning();
    return newItem;
  }
  async updateItemQuantity(userId, cartItemId, quantity) {
    const userCart = await this.getOrCreateCart(userId);
    if (quantity <= 0) {
      await this.removeItem(userId, cartItemId);
      return null;
    }
    const [updated] = await db.update(cartItems).set({ quantity }).where(
      and2(eq2(cartItems.id, cartItemId), eq2(cartItems.cartId, userCart.id))
    ).returning();
    return updated;
  }
  async removeItem(userId, cartItemId) {
    const userCart = await this.getOrCreateCart(userId);
    await db.delete(cartItems).where(
      and2(eq2(cartItems.id, cartItemId), eq2(cartItems.cartId, userCart.id))
    );
  }
  async clearCart(userId) {
    const userCart = await this.getOrCreateCart(userId);
    await db.delete(cartItems).where(eq2(cartItems.cartId, userCart.id));
  }
  async getCartSummary(userId) {
    const { items } = await this.getCartWithItems(userId);
    const subtotal = items.reduce((sum, item) => {
      const itemTotal = parseFloat(item.price) * item.quantity;
      return sum + itemTotal;
    }, 0);
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryFee;
    return {
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }
};
var cartRepository = new CartRepository();

// server/routes/cart.routes.ts
import { z } from "zod";
var router = Router();
router.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    const result = await cartRepository.getCartWithItems(userId);
    res.json(result.items || []);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});
router.get("/summary", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const summary = await cartRepository.getCartSummary(userId);
    res.json(summary);
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    res.status(500).json({ message: "Failed to fetch cart summary" });
  }
});
var addItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive().default(1)
});
router.post("/items", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { productId, quantity } = addItemSchema.parse(req.body);
    const item = await cartRepository.addOrUpdateItem(userId, productId, quantity);
    res.json(item);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});
var updateItemSchema = z.object({
  quantity: z.number().min(0)
});
router.patch("/items/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const itemId = parseInt(req.params.id);
    const { quantity } = updateItemSchema.parse(req.body);
    const item = await cartRepository.updateItemQuantity(userId, itemId, quantity);
    res.json(item);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
});
router.delete("/items/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const itemId = parseInt(req.params.id);
    await cartRepository.removeItem(userId, itemId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Failed to remove cart item" });
  }
});
router.delete("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await cartRepository.clearCart(userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});
var cart_routes_default = router;

// server/routes/address.routes.ts
import { Router as Router2 } from "express";

// server/storage/address.repository.ts
import { eq as eq3, and as and3 } from "drizzle-orm";
var AddressRepository = class {
  async getAddressesByUser(userId) {
    return await db.query.addresses.findMany({
      where: eq3(addresses.userId, userId),
      orderBy: (addresses2, { desc: desc3 }) => [desc3(addresses2.isDefault)]
    });
  }
  async getAddressById(addressId) {
    return await db.query.addresses.findFirst({
      where: eq3(addresses.id, addressId)
    });
  }
  async createAddress(data) {
    if (data.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq3(addresses.userId, data.userId));
    }
    const [address] = await db.insert(addresses).values(data).returning();
    return address;
  }
  async updateAddress(addressId, userId, data) {
    if (data.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq3(addresses.userId, userId));
    }
    const [updated] = await db.update(addresses).set(data).where(and3(eq3(addresses.id, addressId), eq3(addresses.userId, userId))).returning();
    return updated;
  }
  async deleteAddress(addressId, userId) {
    await db.delete(addresses).where(and3(eq3(addresses.id, addressId), eq3(addresses.userId, userId)));
  }
  async setDefaultAddress(addressId, userId) {
    await db.update(addresses).set({ isDefault: false }).where(eq3(addresses.userId, userId));
    const [updated] = await db.update(addresses).set({ isDefault: true }).where(and3(eq3(addresses.id, addressId), eq3(addresses.userId, userId))).returning();
    return updated;
  }
  async getDefaultAddress(userId) {
    return await db.query.addresses.findFirst({
      where: and3(eq3(addresses.userId, userId), eq3(addresses.isDefault, true))
    });
  }
};
var addressRepository = new AddressRepository();

// server/routes/address.routes.ts
var router2 = Router2();
router2.use(isAuthenticated);
router2.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addresses2 = await addressRepository.getAddressesByUser(userId);
    res.json(addresses2);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});
router2.get("/:id", async (req, res) => {
  try {
    const addressId = parseInt(req.params.id);
    const address = await addressRepository.getAddressById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
});
router2.post("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressData = insertAddressSchema.parse({ ...req.body, userId });
    const address = await addressRepository.createAddress(addressData);
    res.json(address);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Failed to create address" });
  }
});
router2.patch("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    const addressData = req.body;
    const address = await addressRepository.updateAddress(addressId, userId, addressData);
    res.json(address);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
});
router2.delete("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    await addressRepository.deleteAddress(addressId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
});
router2.patch("/:id/set-default", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    const address = await addressRepository.setDefaultAddress(addressId, userId);
    res.json(address);
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ message: "Failed to set default address" });
  }
});
var address_routes_default = router2;

// server/routes/order.routes.ts
import { Router as Router3 } from "express";
import { eq as eq4, and as and4 } from "drizzle-orm";
import { z as z2 } from "zod";
var router3 = Router3();
var createOrderSchema = z2.object({
  items: z2.array(z2.any()).optional(),
  total: z2.number(),
  paymentMethod: z2.enum(["cash", "razorpay", "cod", "upi", "card", "netbanking"]).default("cod"),
  paymentStatus: z2.string().default("pending"),
  userInfo: z2.object({
    firstName: z2.string().optional(),
    lastName: z2.string().optional(),
    phone: z2.string(),
    address: z2.string(),
    email: z2.string().optional()
  }).optional()
});
router3.post("/", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = createOrderSchema.parse(req.body);
    const userCart = await db.query.cart.findFirst({
      where: eq4(cart.userId, userId)
    });
    if (!userCart) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const cartItemsList = await db.query.cartItems.findMany({
      where: eq4(cartItems.cartId, userCart.id)
    });
    if (cartItemsList.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    let totalAmount = 0;
    for (const item of cartItemsList) {
      totalAmount += parseFloat(item.price) * item.quantity;
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    let paymentMethod = payload.paymentMethod;
    if (paymentMethod === "cash") paymentMethod = "cod";
    const deliveryAddress = payload.userInfo?.address || "Delivery Address";
    const [newOrder] = await db.insert(orders).values({
      userId,
      totalAmount: totalAmount.toString(),
      deliveryAddress,
      paymentMethod,
      paymentStatus: payload.paymentStatus,
      status: "PLACED",
      deliveryDate: today,
      liters: cartItemsList.reduce((sum, item) => sum + item.quantity, 0)
    }).returning();
    for (const item of cartItemsList) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: (parseFloat(item.price) * item.quantity).toString()
      });
      const product = await db.query.products.findFirst({
        where: eq4(products.id, item.productId)
      });
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await db.update(products).set({ stock: newStock }).where(eq4(products.id, item.productId));
      }
    }
    await db.delete(cartItems).where(eq4(cartItems.cartId, userCart.id));
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid order data" });
    }
    res.status(500).json({ message: "Failed to create order" });
  }
});
router3.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userOrders = await db.select().from(orders).where(eq4(orders.userId, userId));
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq4(orderItems.orderId, order.id));
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const product = await db.query.products.findFirst({
              where: eq4(products.id, item.productId)
            });
            return { ...item, product };
          })
        );
        return { ...order, items: itemsWithProducts };
      })
    );
    res.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
router3.get("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId;
    const orderId = parseInt(req.params.id);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const [order] = await db.select().from(orders).where(and4(eq4(orders.id, orderId), eq4(orders.userId, userId)));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const items = await db.select().from(orderItems).where(eq4(orderItems.orderId, orderId));
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await db.query.products.findFirst({
          where: eq4(products.id, item.productId)
        });
        return { ...item, product };
      })
    );
    res.json({ ...order, items: itemsWithProducts });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});
var order_routes_default = router3;

// server/routes/support.routes.ts
import { Router as Router4 } from "express";

// server/storage/support.repository.ts
import { eq as eq5, desc as desc2 } from "drizzle-orm";
var SupportRepository = class {
  async getTicketsByUser(userId) {
    return await db.query.supportTickets.findMany({
      where: eq5(supportTickets.userId, userId),
      orderBy: [desc2(supportTickets.createdAt)]
    });
  }
  async getTicketById(ticketId) {
    const ticket = await db.query.supportTickets.findFirst({
      where: eq5(supportTickets.id, ticketId)
    });
    if (!ticket) return null;
    const messages = await db.query.ticketMessages.findMany({
      where: eq5(ticketMessages.ticketId, ticketId),
      orderBy: (ticketMessages2, { asc: asc2 }) => [asc2(ticketMessages2.createdAt)]
    });
    return { ticket, messages };
  }
  async createTicket(data) {
    const [ticket] = await db.insert(supportTickets).values(data).returning();
    return ticket;
  }
  async addMessage(data) {
    const [message] = await db.insert(ticketMessages).values(data).returning();
    await db.update(supportTickets).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq5(supportTickets.id, data.ticketId));
    return message;
  }
  async updateTicketStatus(ticketId, status) {
    const [updated] = await db.update(supportTickets).set({
      status,
      updatedAt: /* @__PURE__ */ new Date(),
      ...status === "resolved" || status === "closed" ? { resolvedAt: /* @__PURE__ */ new Date() } : {}
    }).where(eq5(supportTickets.id, ticketId)).returning();
    return updated;
  }
  async getFaqs(category) {
    if (category) {
      return await db.query.faqs.findMany({
        where: eq5(faqs.category, category),
        orderBy: (faqs2, { asc: asc2 }) => [asc2(faqs2.order)]
      });
    }
    return await db.query.faqs.findMany({
      where: eq5(faqs.isActive, true),
      orderBy: (faqs2, { asc: asc2 }) => [asc2(faqs2.order)]
    });
  }
};
var supportRepository = new SupportRepository();

// server/routes/support.routes.ts
var router4 = Router4();
var requireAuth = (req, res, next) => {
  if (req.path.startsWith("/faqs")) {
    return next();
  }
  return isAuthenticated(req, res, next);
};
router4.use(requireAuth);
router4.get("/tickets", async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const tickets = await supportRepository.getTicketsByUser(userId);
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
});
router4.get("/tickets/:id", async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const result = await supportRepository.getTicketById(ticketId);
    if (!result) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
});
router4.post("/tickets", async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const ticketData = insertSupportTicketSchema.parse({ ...req.body, userId });
    const ticket = await supportRepository.createTicket(ticketData);
    res.json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create support ticket" });
  }
});
router4.post("/tickets/:id/messages", async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const ticketId = parseInt(req.params.id);
    const messageData = insertTicketMessageSchema.parse({
      ...req.body,
      ticketId,
      userId,
      isStaff: false
    });
    const message = await supportRepository.addMessage(messageData);
    res.json(message);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to add message" });
  }
});
router4.get("/faqs", async (req, res) => {
  try {
    const category = req.query.category;
    const faqs2 = await supportRepository.getFaqs(category);
    res.json(faqs2);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});
var support_routes_default = router4;

// server/routes/offers.routes.ts
import { Router as Router5 } from "express";

// server/storage/offers.repository.ts
import { eq as eq6, and as and5, sql } from "drizzle-orm";
var OffersRepository = class {
  async getActiveOffers() {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return await db.query.offers.findMany({
      where: and5(
        eq6(offers.isActive, true),
        sql`${offers.validFrom} <= ${today}`,
        sql`${offers.validTo} >= ${today}`
      ),
      orderBy: (offers2, { desc: desc3 }) => [desc3(offers2.createdAt)]
    });
  }
  async getOfferById(offerId) {
    return await db.query.offers.findFirst({
      where: eq6(offers.id, offerId)
    });
  }
  async validateCoupon(code) {
    const coupon = await db.query.coupons.findFirst({
      where: eq6(coupons.code, code.toUpperCase())
    });
    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }
    if (!coupon.isActive) {
      return { valid: false, message: "This coupon is no longer active" };
    }
    const today = /* @__PURE__ */ new Date();
    if (today < new Date(coupon.validFrom) || today > new Date(coupon.validTo)) {
      return { valid: false, message: "This coupon has expired" };
    }
    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return { valid: false, message: "This coupon has reached its usage limit" };
    }
    return { valid: true, coupon };
  }
  async applyCoupon(code, orderAmount) {
    const validation = await this.validateCoupon(code);
    if (!validation.valid || !validation.coupon) {
      throw new Error(validation.message || "Invalid coupon");
    }
    const coupon = validation.coupon;
    if (coupon.minOrderValue && orderAmount < parseFloat(coupon.minOrderValue)) {
      throw new Error(`Minimum order value of \u20B9${coupon.minOrderValue} required`);
    }
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = orderAmount * parseFloat(coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
    } else {
      discount = parseFloat(coupon.discountValue);
    }
    return { discount, coupon };
  }
  async incrementCouponUsage(couponId) {
    await db.update(coupons).set({ usageCount: sql`${coupons.usageCount} + 1` }).where(eq6(coupons.id, couponId));
  }
};
var offersRepository = new OffersRepository();

// server/routes/offers.routes.ts
import { z as z3 } from "zod";
var router5 = Router5();
router5.get("/", async (req, res) => {
  try {
    const offers2 = await offersRepository.getActiveOffers();
    res.json(offers2);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});
router5.get("/:id", async (req, res) => {
  try {
    const offerId = parseInt(req.params.id);
    const offer = await offersRepository.getOfferById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.json(offer);
  } catch (error) {
    console.error("Error fetching offer:", error);
    res.status(500).json({ message: "Failed to fetch offer" });
  }
});
var validateCouponSchema = z3.object({
  code: z3.string()
});
router5.post("/validate-coupon", async (req, res) => {
  try {
    const { code } = validateCouponSchema.parse(req.body);
    const result = await offersRepository.validateCoupon(code);
    res.json(result);
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Failed to validate coupon" });
  }
});
var applyCouponSchema = z3.object({
  code: z3.string(),
  orderAmount: z3.number().positive()
});
router5.post("/apply-coupon", async (req, res) => {
  try {
    const { code, orderAmount } = applyCouponSchema.parse(req.body);
    const result = await offersRepository.applyCoupon(code, orderAmount);
    res.json(result);
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(400).json({ message: error.message || "Failed to apply coupon" });
  }
});
var offers_routes_default = router5;

// server/routes/subscription.routes.ts
import { Router as Router6 } from "express";
import { eq as eq7, and as and6 } from "drizzle-orm";
var router6 = Router6();
router6.use(isAuthenticated);
router6.post("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { productId, quantity, frequency, deliveryTime, startDate } = req.body;
    const productIdInt = parseInt(productId);
    const product = await db.query.products.findFirst({
      where: eq7(products.id, productIdInt)
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const newSub = await db.insert(milkSubscriptions).values({
      userId,
      productId: productIdInt,
      quantity: parseFloat(quantity).toString(),
      frequency,
      deliveryTime,
      startDate: new Date(startDate),
      status: "ACTIVE",
      isActive: true,
      isPaused: false,
      pricePerL: product.price,
      nextDeliveryDate: new Date(startDate)
    }).returning();
    res.status(201).json({ message: "Subscription created", subscription: newSub[0] });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});
router6.get("/me", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscription = await db.query.milkSubscriptions.findFirst({
      where: and6(eq7(milkSubscriptions.userId, userId), eq7(milkSubscriptions.status, "ACTIVE"))
    });
    res.json(subscription || null);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Failed to fetch subscription" });
  }
});
router6.put("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const { quantity, frequency, deliveryTime } = req.body;
    const updated = await db.update(milkSubscriptions).set({ quantity: parseFloat(quantity), frequency, deliveryTime }).where(and6(eq7(milkSubscriptions.id, subscriptionId), eq7(milkSubscriptions.userId, userId))).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});
router6.put("/:id/pause", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const updated = await db.update(milkSubscriptions).set({ status: "PAUSED", isPaused: true }).where(and6(eq7(milkSubscriptions.id, subscriptionId), eq7(milkSubscriptions.userId, userId))).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error pausing subscription:", error);
    res.status(500).json({ message: "Failed to pause subscription" });
  }
});
router6.put("/:id/resume", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const updated = await db.update(milkSubscriptions).set({ status: "ACTIVE", isPaused: false }).where(and6(eq7(milkSubscriptions.id, subscriptionId), eq7(milkSubscriptions.userId, userId))).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error resuming subscription:", error);
    res.status(500).json({ message: "Failed to resume subscription" });
  }
});
router6.put("/:id/skip-tomorrow", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await db.insert(subscriptionDeliveries).values({
      subscriptionId,
      userId,
      deliveryDate: tomorrow,
      quantity: 0,
      status: "SKIPPED"
    });
    res.json({ message: "Tomorrow's delivery skipped" });
  } catch (error) {
    console.error("Error skipping delivery:", error);
    res.status(500).json({ message: "Failed to skip delivery" });
  }
});
router6.delete("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const updated = await db.update(milkSubscriptions).set({ status: "CANCELLED" }).where(and6(eq7(milkSubscriptions.id, subscriptionId), eq7(milkSubscriptions.userId, userId))).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json({ message: "Subscription cancelled" });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
});
router6.get("/me/history", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const deliveries = await db.select().from(subscriptionDeliveries).where(eq7(subscriptionDeliveries.userId, userId));
    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching delivery history:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});
var subscription_routes_default = router6;

// server/routes/admin-orders.routes.ts
import { Router as Router7 } from "express";
import { eq as eq8 } from "drizzle-orm";
var router7 = Router7();
router7.use(isAuthenticated);
router7.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq8(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const status = req.query.status;
    let allOrders = await db.select().from(orders);
    if (status) {
      allOrders = allOrders.filter((o) => o.status === status);
    }
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
router7.get("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq8(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const orderId = parseInt(req.params.id);
    const order = await db.select().from(orders).where(eq8(orders.id, orderId));
    if (!order.length) {
      return res.status(404).json({ message: "Order not found" });
    }
    const items = await db.select().from(orderItems).where(eq8(orderItems.orderId, orderId));
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await db.query.products.findFirst({
          where: eq8(products.id, item.productId)
        });
        return { ...item, product };
      })
    );
    res.json({ ...order[0], items: itemsWithProducts });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});
router7.patch("/:id/status", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq8(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const orderId = parseInt(req.params.id);
    const { status, paymentStatus } = req.body;
    const updated = await db.update(orders).set({
      status: status || void 0,
      paymentStatus: paymentStatus || void 0
    }).where(eq8(orders.id, orderId)).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
});
var admin_orders_routes_default = router7;

// server/routes/admin-subscriptions.routes.ts
import { Router as Router8 } from "express";
import { eq as eq9 } from "drizzle-orm";
var router8 = Router8();
router8.use(isAuthenticated);
router8.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq9(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const allSubs = await db.select().from(milkSubscriptions);
    const withDetails = await Promise.all(
      allSubs.map(async (sub) => {
        const customer = await db.query.users.findFirst({
          where: eq9(users2.id, sub.userId)
        });
        const product = await db.query.products.findFirst({
          where: eq9(products.id, sub.productId)
        });
        return { ...sub, customer, product };
      })
    );
    res.json(withDetails);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});
router8.get("/today/requirement", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq9(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const deliveries = await db.select().from(subscriptionDeliveries).where(eq9(subscriptionDeliveries.deliveryDate, new Date(today)));
    const totalRequired = deliveries.reduce((sum, d) => sum + parseFloat(d.quantity.toString()), 0);
    res.json({
      date: today,
      totalRequired,
      deliveryCount: deliveries.length,
      deliveries
    });
  } catch (error) {
    console.error("Error fetching daily requirement:", error);
    res.status(500).json({ message: "Failed to fetch daily requirement" });
  }
});
router8.patch("/:id/status", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq9(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const subId = parseInt(req.params.id);
    const { status } = req.body;
    const updated = await db.update(milkSubscriptions).set({ status }).where(eq9(milkSubscriptions.id, subId)).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});
var admin_subscriptions_routes_default = router8;

// server/routes/admin-customers.routes.ts
import { Router as Router9 } from "express";
import { eq as eq10 } from "drizzle-orm";
var router9 = Router9();
router9.use(isAuthenticated);
router9.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq10(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const allCustomers = await db.query.users.findMany({
      where: (table, { ne }) => ne(table.role, "admin")
    });
    const customersWithStats = await Promise.all(
      allCustomers.map(async (customer) => {
        const customerOrders = await db.select().from(orders).where(eq10(orders.userId, customer.id));
        const customerSubs = await db.select().from(milkSubscriptions).where(eq10(milkSubscriptions.userId, customer.id));
        let totalSpending = "0";
        if (customerOrders.length > 0) {
          const total = customerOrders.reduce((sum, order) => {
            return sum + parseFloat(order.totalAmount || "0");
          }, 0);
          totalSpending = total.toString();
        }
        return {
          id: customer.id,
          name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown",
          phone: customer.phone || "N/A",
          email: customer.email || "N/A",
          orderCount: customerOrders.length,
          subscriptionCount: customerSubs.length,
          totalSpending,
          joinedDate: customer.createdAt
        };
      })
    );
    res.json(customersWithStats);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});
router9.get("/:id/orders", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq10(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const customerId = req.params.id;
    const customerOrders = await db.select().from(orders).where(eq10(orders.userId, customerId));
    res.json(customerOrders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
});
router9.get("/:id/subscriptions", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq10(users2.id, userId) });
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const customerId = req.params.id;
    const customerSubs = await db.select().from(milkSubscriptions).where(eq10(milkSubscriptions.userId, customerId));
    res.json(customerSubs);
  } catch (error) {
    console.error("Error fetching customer subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch customer subscriptions" });
  }
});
var admin_customers_routes_default = router9;

// server/routes/rbac.routes.ts
import { Router as Router10 } from "express";

// server/middleware/auth.ts
function checkRole(allowedRoles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    try {
      const freshUser = await storage.getUser(req.user.id);
      const userRole = freshUser?.role || req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Forbidden - This endpoint requires one of these roles: ${allowedRoles.join(", ")}`,
          yourRole: userRole
        });
      }
      req.user.role = userRole;
      next();
    } catch (error) {
      console.error("Error checking user role:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
var requireCustomer = checkRole(["customer"]);
var requireVendor = checkRole(["vendor"]);
var requireDelivery = checkRole(["delivery"]);
var requireAdmin = checkRole(["admin"]);
var requireCustomerOrAdmin = checkRole(["customer", "admin"]);
var requireVendorOrAdmin = checkRole(["vendor", "admin"]);

// server/routes/rbac.routes.ts
import { eq as eq11 } from "drizzle-orm";
var router10 = Router10();
router10.post("/auth/verify-phone", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
    if (otp !== "1234") {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    const userId = `user_${phone.replace(/\D/g, "").slice(-10)}`;
    let user = await storage.getUser(userId);
    if (!user) {
      user = await storage.upsertUser({
        id: userId,
        phone,
        role: "customer"
      });
    }
    req.session.userId = userId;
    req.session.user = { id: userId, phone };
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
router10.post("/auth/register", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
    if (otp !== "1234") {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    const userId = `user_${phone.replace(/\D/g, "").slice(-10)}`;
    const user = await storage.upsertUser({
      id: userId,
      phone,
      role: "customer"
    });
    req.session.userId = userId;
    req.session.user = { id: userId, phone };
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
router10.get("/auth/user", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
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
router10.get("/products", async (req, res) => {
  try {
    const products3 = await storage.getProducts();
    res.json(products3);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});
router10.get("/categories", async (req, res) => {
  try {
    const categories2 = await storage.getCategories();
    res.json(categories2);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});
router10.post("/cart", requireCustomer, async (req, res) => {
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
router10.get("/cart", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const cartItems2 = await storage.getCartItems(userId);
    res.json(cartItems2);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});
router10.post("/orders", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { deliveryAddress, deliveryDate } = req.body;
    if (!deliveryAddress || !deliveryDate) {
      return res.status(400).json({ message: "Delivery address and date are required" });
    }
    const cartItems2 = await storage.getCartItems(userId);
    if (!cartItems2 || cartItems2.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const totalAmount = cartItems2.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);
    const orderData = {
      userId,
      totalAmount: totalAmount.toFixed(2),
      deliveryAddress,
      deliveryDate,
      status: "pending"
    };
    const order = await storage.createOrder(orderData);
    for (const item of cartItems2) {
      await storage.createOrderItem({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: (parseFloat(item.price) * item.quantity).toFixed(2)
      });
      const product = await db.select().from(products).where(eq11(products.id, item.productId));
      if (product.length > 0) {
        const newStock = Math.max(0, (product[0].stock || 0) - item.quantity);
        await storage.updateProduct(item.productId, { stock: newStock });
        await storage.recordStockMovement({
          productId: item.productId,
          type: "OUT",
          reason: "ORDER_PLACED",
          quantity: item.quantity,
          previousStock: product[0].stock || 0,
          newStock,
          adminId: null,
          notes: `Order #${order.id} placed`
        });
      }
    }
    await storage.clearCart(userId);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});
router10.get("/milk-subscription", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    res.json(subscription || null);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Failed to fetch subscription" });
  }
});
router10.post("/milk-subscription", requireCustomer, async (req, res) => {
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
router10.patch("/milk-subscription/:id/pause", requireCustomer, async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    const userId = req.user.claims.sub;
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    if (!subscription || subscription.id !== subscriptionId) {
      return res.status(403).json({ message: "Not authorized to pause this subscription" });
    }
    const updated = await storage.updateMilkSubscription(subscriptionId, {
      isPaused: true,
      status: "PAUSED"
    });
    res.json({ success: true, subscription: updated, message: "Subscription paused successfully" });
  } catch (error) {
    console.error("Error pausing subscription:", error);
    res.status(500).json({ message: "Failed to pause subscription" });
  }
});
router10.patch("/milk-subscription/:id/resume", requireCustomer, async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    const userId = req.user.claims.sub;
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    if (!subscription || subscription.id !== subscriptionId) {
      return res.status(403).json({ message: "Not authorized to resume this subscription" });
    }
    const updated = await storage.updateMilkSubscription(subscriptionId, {
      isPaused: false,
      status: "ACTIVE"
    });
    res.json({ success: true, subscription: updated, message: "Subscription resumed successfully" });
  } catch (error) {
    console.error("Error resuming subscription:", error);
    res.status(500).json({ message: "Failed to resume subscription" });
  }
});
router10.put("/personal-details", requireCustomer, async (req, res) => {
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
      gender: gender || void 0,
      dob: dob || void 0
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
router10.get("/vendors/dashboard", requireVendor, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const vendor = await storage.getVendorByUser(userId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    const metrics = {
      dailyRequirement: vendor.requirementToday || 0,
      weeklyRevenue: vendor.weeklyEarnings || "0.00",
      fulfillmentRate: vendor.requirementToday > 0 ? (vendor.circulatedLiters / vendor.requirementToday * 100).toFixed(2) : "0.00",
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
router10.post("/vendors/inward", requireVendor, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { litersArrived, litersDelivered, litersPending, driverInfo } = req.body;
    if (!litersArrived || !litersDelivered || litersPending === void 0 || !driverInfo) {
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
router10.post("/vendors/driver", requireVendor, async (req, res) => {
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
router10.get("/vendors/drivers", requireVendor, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const vendor = await storage.getVendorByUser(userId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    const drivers2 = await storage.getDriversByVendor(vendor.id);
    res.json(drivers2);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
});
router10.get("/delivery/assignments", requireDelivery, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const deliveryPartner = await storage.getDeliveryPartnerByUser(userId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner profile not found" });
    }
    const assignments = await storage.getOrdersForDelivery(deliveryPartner.id);
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching delivery assignments:", error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
});
router10.put("/delivery/status/:id", requireDelivery, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const userId = req.user.claims.sub;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const validStatuses = ["pending", "processing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
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
router10.get("/admin/vendors", requireAdmin, async (req, res) => {
  try {
    const vendors2 = await storage.getVendors();
    const vendorList = vendors2.map((vendor) => ({
      id: vendor.id,
      businessName: vendor.businessName,
      locationName: vendor.locationName,
      licenseNumber: vendor.licenseNumber,
      vendorType: vendor.vendorType,
      isApproved: vendor.isVerified,
      // isVerified serves as isApproved
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
router10.post("/admin/vendors/approve/:id", requireAdmin, async (req, res) => {
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
router10.post("/admin/update-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await db.query.users.findFirst({
      where: eq11(users.email, email)
    });
    if (!user) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    await storage.updateUser(user.id, { password: newPassword });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
});
router10.post("/admin/categories", requireAdmin, async (req, res) => {
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
router10.put("/admin/categories/:id", requireAdmin, async (req, res) => {
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
router10.delete("/admin/categories/:id", requireAdmin, async (req, res) => {
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
router10.post("/admin/products", requireAdmin, async (req, res) => {
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
router10.put("/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updates = req.body;
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const currentProduct = await storage.getProducts();
    const existingProduct = currentProduct.find((p) => p.id === productId);
    const product = await storage.updateProduct(productId, updates);
    if (updates.stock !== void 0 && existingProduct && existingProduct.stock !== updates.stock) {
      const userId = req.user?.claims?.sub;
      const quantityDiff = updates.stock - existingProduct.stock;
      await storage.recordStockMovement({
        productId,
        type: quantityDiff > 0 ? "IN" : "OUT",
        reason: "ADMIN_ADJUST",
        quantity: quantityDiff,
        previousStock: existingProduct.stock,
        newStock: updates.stock,
        createdBy: userId,
        notes: "Manual stock adjustment by admin"
      });
    }
    res.json({ success: true, product, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});
router10.delete("/admin/products/:id", requireAdmin, async (req, res) => {
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
router10.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const orders2 = await storage.getAllOrders();
    res.json(orders2);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
router10.put("/admin/orders/:id/assign-delivery", requireAdmin, async (req, res) => {
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
router10.put("/admin/orders/:id/payment", requireAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { paymentStatus, paymentMethod, paymentDate } = req.body;
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    const order = await storage.updateOrderPayment(orderId, {
      paymentStatus,
      paymentMethod,
      paymentDate: paymentDate ? new Date(paymentDate) : /* @__PURE__ */ new Date()
    });
    res.json({ success: true, order, message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Failed to update payment" });
  }
});
router10.get("/admin/delivery-partners", requireAdmin, async (req, res) => {
  try {
    const partners = await storage.getDeliveryPartners();
    res.json(partners);
  } catch (error) {
    console.error("Error fetching delivery partners:", error);
    res.status(500).json({ message: "Failed to fetch delivery partners" });
  }
});
router10.get("/admin/customers", requireAdmin, async (req, res) => {
  try {
    const customers = await storage.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});
router10.get("/admin/subscriptions", requireAdmin, async (req, res) => {
  try {
    const subscriptions = await storage.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});
router10.get("/admin/vendors", requireAdmin, async (req, res) => {
  try {
    const vendors2 = await storage.getVendors();
    res.json(vendors2);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});
router10.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const stats = await storage.getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});
router10.put("/admin/orders/:id", requireAdmin, async (req, res) => {
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
router10.get("/admin/stock-movements", requireAdmin, async (req, res) => {
  try {
    const movements = await storage.getAllStockMovements();
    res.json(movements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
});
router10.get("/admin/stock-movements/:productId", requireAdmin, async (req, res) => {
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
router10.post("/storage/upload", requireAdmin, async (req, res) => {
  try {
    const { file, path: path3, data, dataUrl } = req.body;
    if (dataUrl) {
      const timestamp2 = Date.now();
      const uniquePath = `${path3}-${timestamp2}`.replace(/\s+/g, "-");
      return res.json({ url: dataUrl });
    }
    if (data) {
      const timestamp2 = Date.now();
      const uniquePath = `${path3}-${timestamp2}`.replace(/\s+/g, "-");
      const dataURLPrefix = "data:image/jpeg;base64,";
      return res.json({ url: `${dataURLPrefix}${data}` });
    }
    return res.status(400).json({ message: "Please upload via URL or try again" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});
var rbac_routes_default = router10;

// server/jobs/auto-delivery.ts
import { eq as eq12 } from "drizzle-orm";
async function generateDailyDeliveries() {
  try {
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const activeSubscriptions = await db.select().from(milkSubscriptions).where(eq12(milkSubscriptions.status, "ACTIVE"));
    for (const sub of activeSubscriptions) {
      if (sub.frequency === "daily") {
        await db.insert(subscriptionDeliveries).values({
          subscriptionId: sub.id,
          userId: sub.userId,
          deliveryDate: new Date(tomorrowStr),
          quantity: sub.quantity,
          status: "UPCOMING"
        }).catch(() => null);
      } else if (sub.frequency === "weekly") {
        const dayOfWeek = tomorrow.getDay();
        if (dayOfWeek === 0) {
          await db.insert(subscriptionDeliveries).values({
            subscriptionId: sub.id,
            userId: sub.userId,
            deliveryDate: new Date(tomorrowStr),
            quantity: sub.quantity,
            status: "UPCOMING"
          }).catch(() => null);
        }
      } else if (sub.frequency === "alternate") {
        const lastDelivery = await db.select().from(subscriptionDeliveries).where(eq12(subscriptionDeliveries.subscriptionId, sub.id));
        if (lastDelivery.length === 0) {
          await db.insert(subscriptionDeliveries).values({
            subscriptionId: sub.id,
            userId: sub.userId,
            deliveryDate: new Date(tomorrowStr),
            quantity: sub.quantity,
            status: "UPCOMING"
          }).catch(() => null);
        }
      }
    }
    console.log(`\u2705 Generated deliveries for ${tomorrow.toDateString()}`);
  } catch (error) {
    console.error("\u274C Error generating daily deliveries:", error);
  }
}
function startDeliveryScheduler() {
  const midnight = () => {
    const now = /* @__PURE__ */ new Date();
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0);
    return tomorrow.getTime() - now.getTime();
  };
  setInterval(generateDailyDeliveries, midnight());
}

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  setupAuthRoutes(app2);
  startDeliveryScheduler();
  app2.use("/api/cart", cart_routes_default);
  app2.use("/api/addresses", address_routes_default);
  app2.use("/api/orders", order_routes_default);
  app2.use("/api/admin-orders", admin_orders_routes_default);
  app2.use("/api/admin/customers", admin_customers_routes_default);
  app2.use("/api/support", support_routes_default);
  app2.use("/api/offers", offers_routes_default);
  app2.use("/api/subscriptions", subscription_routes_default);
  app2.use("/api/admin-subscriptions", admin_subscriptions_routes_default);
  app2.use("/api", rbac_routes_default);
  app2.get("/api/auth/user", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications2 = await storage.getNotificationsByUser(userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/seed.ts
import * as bcryptjs2 from "bcryptjs";
async function seedDatabase() {
  try {
    const existingUsers = await db.select().from(users2).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }
    console.log("Seeding database with mock data...");
    const salt = await bcryptjs2.genSalt(10);
    const adminPasswordHash = await bcryptjs2.hash("admin123", salt);
    const customerPasswordHash = await bcryptjs2.hash("customer123", salt);
    const mockUsers = [
      // Customers
      { id: "user-customer-1", email: "customer1@divine.com", firstName: "Priya", lastName: "Patel", role: "customer", phone: "+91-9876543210", walletBalance: "500.00", passwordHash: customerPasswordHash },
      { id: "user-customer-2", email: "customer2@divine.com", firstName: "Rahul", lastName: "Mehta", role: "customer", phone: "+91-9876543211", walletBalance: "300.00", passwordHash: customerPasswordHash },
      // Vendors
      { id: "user-vendor-1", email: "vendor1@divine.com", firstName: "Rajesh", lastName: "Kumar", role: "vendor", phone: "+91-9876543212", walletBalance: "0", passwordHash: customerPasswordHash },
      { id: "user-vendor-2", email: "vendor2@divine.com", firstName: "Amit", lastName: "Shah", role: "vendor", phone: "+91-9876543213", walletBalance: "0", passwordHash: customerPasswordHash },
      // Delivery Partners
      { id: "user-delivery-1", email: "delivery1@divine.com", firstName: "Suresh", lastName: "Singh", role: "delivery", phone: "+91-9876543214", walletBalance: "0", passwordHash: customerPasswordHash },
      { id: "user-delivery-2", email: "delivery2@divine.com", firstName: "Vijay", lastName: "Sharma", role: "delivery", phone: "+91-9876543215", walletBalance: "0", passwordHash: customerPasswordHash },
      // Admins - WITH PASSWORDS
      { id: "user-admin-1", email: "admin1@divine.com", firstName: "Admin", lastName: "Super", role: "admin", phone: "+91-9876543216", walletBalance: "0", passwordHash: adminPasswordHash },
      { id: "user-admin-2", email: "admin2@divine.com", firstName: "Admin", lastName: "Manager", role: "admin", phone: "+91-9876543217", walletBalance: "0", passwordHash: adminPasswordHash }
    ];
    for (const user of mockUsers) {
      await db.insert(users2).values(user);
    }
    console.log("\u2713 Created 8 mock users (2 per role)");
    await db.insert(vendors).values([
      {
        userId: "user-vendor-1",
        businessName: "Fresh Dairy Co.",
        licenseNumber: "DL-2018-MH-001",
        locationName: "Andheri West",
        vendorType: "VENDOR",
        dailyCapacity: 2e3,
        requirementToday: 500,
        circulatedLiters: 425,
        revenueToday: "21250.00",
        weeklyEarnings: "148750.00",
        isVerified: true
      },
      {
        userId: "user-vendor-2",
        businessName: "Divine Naturals Farm",
        licenseNumber: "DL-2019-MH-002",
        locationName: "Santa Cruz",
        vendorType: "VENDOR",
        dailyCapacity: 1500,
        requirementToday: 400,
        circulatedLiters: 380,
        revenueToday: "19000.00",
        weeklyEarnings: "133000.00",
        isVerified: false
      }
    ]);
    console.log("\u2713 Created 2 vendor profiles");
    await db.insert(deliveryPartners).values([
      {
        userId: "user-delivery-1",
        vehicleType: "Electric Scooter",
        licenseNumber: "DL-123456",
        zone: "Andheri-Santacruz",
        isAvailable: true
      },
      {
        userId: "user-delivery-2",
        vehicleType: "Bike",
        licenseNumber: "DL-789012",
        zone: "Borivali-Malad",
        isAvailable: true
      }
    ]);
    console.log("\u2713 Created 2 delivery partner profiles");
    const vendorList = await db.select().from(vendors);
    const mockProducts = [
      {
        name: "Full Cream Milk",
        sku: "MILK-FC-001",
        description: "Rich and creamy full cream milk",
        category: "MILK",
        type: "MILK",
        price: "60.00",
        unit: "L",
        stock: 100,
        imageUrl: "/images/full-cream-milk.jpg",
        isActive: true
      },
      {
        name: "Toned Milk",
        sku: "MILK-TN-002",
        description: "Healthy toned milk with reduced fat",
        category: "MILK",
        type: "MILK",
        price: "50.00",
        unit: "L",
        stock: 150,
        imageUrl: "/images/toned-milk.jpg",
        isActive: true
      },
      {
        name: "Fresh Curd",
        sku: "DAIRY-CURD-001",
        description: "Thick and creamy fresh curd",
        category: "DAIRY",
        type: "DAIRY",
        price: "40.00",
        unit: "500g",
        stock: 80,
        imageUrl: "/images/curd.jpg",
        isActive: true
      },
      {
        name: "Paneer",
        sku: "DAIRY-PANEER-001",
        description: "Fresh cottage cheese",
        category: "DAIRY",
        type: "DAIRY",
        price: "120.00",
        unit: "250g",
        stock: 50,
        imageUrl: "/images/paneer.jpg",
        isActive: true
      },
      {
        name: "Buttermilk",
        sku: "DAIRY-BM-001",
        description: "Refreshing traditional buttermilk",
        category: "DAIRY",
        type: "DAIRY",
        price: "25.00",
        unit: "500ml",
        stock: 120,
        imageUrl: "/images/buttermilk.jpg",
        isActive: true
      }
    ];
    for (const product of mockProducts) {
      await db.insert(products).values(product);
    }
    console.log("\u2713 Created 5 products");
    await db.insert(milkSubscriptions).values([
      {
        userId: "user-customer-1",
        quantity: 2,
        frequency: "daily",
        deliveryTime: "6:00 AM",
        startDate: "2025-01-01",
        isActive: true,
        pricePerL: "60.00",
        status: "ACTIVE"
      },
      {
        userId: "user-customer-1",
        quantity: 1,
        frequency: "daily",
        deliveryTime: "6:30 AM",
        startDate: "2025-01-01",
        isActive: true,
        pricePerL: "50.00",
        status: "ACTIVE"
      },
      {
        userId: "user-customer-2",
        quantity: 1,
        frequency: "daily",
        deliveryTime: "7:00 AM",
        startDate: "2025-01-05",
        isActive: true,
        pricePerL: "60.00",
        status: "ACTIVE"
      }
    ]);
    console.log("\u2713 Created 3 active subscriptions");
    console.log("\u2705 Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
app.use(fileUpload());
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await seedDatabase();
  } catch (error) {
    log("Error seeding database, continuing anyway...");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
