import { Router } from "express";
import { db } from "../db";
import { milkSubscriptions, orders, orderItems, products, users, subscriptionDeliveries, addresses } from "@shared/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import Razorpay from "razorpay";

const router = Router();

// Lazy initialize Razorpay only when keys are provided
let razorpayInstance: any = null;
const getRazorpayInstance = () => {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// Get today's milk subscription requirements for admin
router.get("/today-requirements", async (req: any, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, etc.
    
    // Get all ACTIVE subscriptions
    const activeSubscriptions = await db
      .select()
      .from(milkSubscriptions)
      .where(eq(milkSubscriptions.status, "ACTIVE"));

    // Aggregate by subscription to get total liters needed
    let totalLiters = 0;
    let totalDeliveries = 0;
    const subscriptionMap = new Map();

    for (const sub of activeSubscriptions) {
      // Check if today is within subscription period
      const startDate = sub.startDate ? new Date(sub.startDate) : null;
      const endDate = sub.endDate ? new Date(sub.endDate) : null;
      
      if (startDate && startDate > today) continue; // Subscription hasn't started yet
      if (endDate && endDate < today) continue; // Subscription has ended

      // Check if today is a delivery day based on frequency
      let isDeliveryDay = false;
      
      if (sub.frequency === "daily") {
        isDeliveryDay = true;
      } else if (sub.frequency === "weekly") {
        // Deliver on same day of week as start date
        if (startDate) {
          const startDayOfWeek = startDate.getDay();
          isDeliveryDay = dayOfWeek === startDayOfWeek;
        }
      } else if (sub.frequency === "alternate") {
        // Alternate every other day from start date
        if (startDate) {
          const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          isDeliveryDay = daysDiff % 2 === 0; // Even days (0, 2, 4, etc.)
        }
      }

      if (!isDeliveryDay) continue;

      // Get user and product details
      const user = await db.query.users.findFirst({
        where: eq(users.id, sub.userId),
      });
      
      const product = await db.query.products.findFirst({
        where: eq(products.id, sub.productId),
      });

      if (user && product) {
        // Get default address for delivery (safely handle missing addresses)
        let defaultAddr = null;
        try {
          const addrs = await db
            .select()
            .from(addresses)
            .where(and(eq(addresses.userId, sub.userId), eq(addresses.isDefault, true)))
            .limit(1);
          defaultAddr = addrs[0] || null;
        } catch (err) {
          console.error("Error fetching address:", err);
        }

        const quantity = Number(sub.quantity || 0);
        totalLiters += quantity;
        totalDeliveries += 1;

        if (!subscriptionMap.has(sub.productId)) {
          subscriptionMap.set(sub.productId, {
            productId: sub.productId,
            productName: product.name || "Unknown",
            totalLiters: 0,
            byArea: new Map(), // Group by area
          });
        }

        const mapEntry = subscriptionMap.get(sub.productId);
        mapEntry.totalLiters += quantity;

        // Group by delivery area (city)
        const area = defaultAddr?.city || "Mumbai"; // Default to Mumbai if no address
        if (!mapEntry.byArea.has(area)) {
          mapEntry.byArea.set(area, []);
        }

        mapEntry.byArea.get(area).push({
          userId: user.id,
          customerName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          liters: quantity,
          deliveryTime: sub.deliveryTime || "Not specified",
          address: defaultAddr?.address || "Awaiting address details",
          landmark: defaultAddr?.landmark || "",
          city: defaultAddr?.city || "Mumbai",
          state: defaultAddr?.state || "Maharashtra",
          pincode: defaultAddr?.pincode || "",
          phone: defaultAddr?.phone || user.phone || "",
        });
      }
    }

    // Convert Map to array format for JSON response
    const requirements = Array.from(subscriptionMap.values()).map((req: any) => ({
      productId: req.productId,
      productName: req.productName,
      totalLiters: req.totalLiters,
      byArea: Object.fromEntries(req.byArea),
    }));

    res.json({
      date: todayStr,
      totalLitersNeeded: totalLiters,
      totalDeliveries: totalDeliveries,
      requirements: requirements,
    });
  } catch (error) {
    console.error("Error fetching today's requirements:", error);
    res.status(500).json({ message: "Failed to fetch requirements" });
  }
});

// Get current month billing data
router.get("/current", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get active subscriptions for current month
    const subscriptions = await db
      .select()
      .from(milkSubscriptions)
      .where(and(eq(milkSubscriptions.userId, userId), eq(milkSubscriptions.status, "ACTIVE")));

    // Get orders for current month
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const monthOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        )
      );

    // Calculate subscription costs
    let subscriptionTotal = 0;
    const subscriptionItems = [];

    for (const sub of subscriptions) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, sub.productId!),
      });

      if (product) {
        // Calculate days in month and deliveries
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        let deliveryDays = daysInMonth;

        if (sub.frequency === "weekly") {
          deliveryDays = Math.ceil(daysInMonth / 7);
        } else if (sub.frequency === "alternate") {
          deliveryDays = Math.ceil(daysInMonth / 2);
        }

        const total = Number(sub.quantity || 0) * Number(sub.pricePerL || product.price) * deliveryDays;
        subscriptionTotal += total;

        subscriptionItems.push({
          name: `${product.name} (Subscription)`,
          quantity: deliveryDays,
          rate: Number(sub.pricePerL || product.price),
          total: Math.round(total),
        });
      }
    }

    // Calculate order total for month
    let orderTotal = 0;
    for (const order of monthOrders) {
      orderTotal += Number(order.totalAmount || 0);
    }

    // Prepare adjustments
    const adjustments = [];
    let penalty = 0;

    // Check if payment is overdue
    const dueDate = new Date(currentYear, currentMonth + 1, 5);
    if (new Date() > dueDate) {
      penalty = 50; // ₹50 late fee
      adjustments.push({ type: "Penalty", amount: penalty });
    }

    const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });

    const totalAmount = subscriptionTotal + orderTotal + penalty;

    res.json({
      month: monthName,
      amount: Math.round(totalAmount),
      penalty,
      previousDue: 0,
      status: "PENDING",
      dueDate: new Date(currentYear, currentMonth + 1, 5).toISOString(),
      daysLeft: Math.max(0, Math.ceil((new Date(currentYear, currentMonth + 1, 5).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
      subscriptionItems,
      orderItems: monthOrders.map((o) => ({
        name: `Order #${o.id}`,
        quantity: 1,
        rate: Number(o.totalAmount || 0),
        total: Math.round(Number(o.totalAmount || 0)),
      })),
      adjustments,
    });
  } catch (error) {
    console.error("Error fetching billing:", error);
    res.status(500).json({ message: "Failed to fetch billing data" });
  }
});

// Get billing history
router.get("/history", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Get all orders for history (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const historyOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          gte(orders.createdAt, sixMonthsAgo)
        )
      );

    // Group by month
    const monthlyBills: any = {};

    historyOrders.forEach((order) => {
      const monthKey = new Date(order.createdAt!).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyBills[monthKey]) {
        monthlyBills[monthKey] = {
          month: monthKey,
          amount: 0,
          status: order.paymentStatus === "paid" ? "PAID" : "PENDING",
          paidDate: order.paymentDate?.toISOString() || "",
        };
      }

      monthlyBills[monthKey].amount += Number(order.totalAmount || 0);
    });

    res.json(Object.values(monthlyBills));
  } catch (error) {
    console.error("Error fetching billing history:", error);
    res.status(500).json({ message: "Failed to fetch billing history" });
  }
});

// Create Razorpay payment order
router.post("/pay", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { amount, currency = "INR" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `bill_${userId}_${Date.now()}`,
      payment_capture: 1,
    };

    const instance = getRazorpayInstance();
    if (!instance) {
      return res.status(500).json({ message: "Payment service not configured" });
    }

    const response = await instance.orders.create(options);

    res.json({
      orderId: response.id,
      amount: amount,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

// Verify Razorpay payment
router.post("/verify-payment", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const crypto = require("crypto");
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Payment verified - update orders as paid
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);

      await db
        .update(orders)
        .set({
          paymentStatus: "paid",
          paymentDate: new Date(),
        })
        .where(
          and(
            eq(orders.userId, userId),
            eq(orders.paymentStatus, "pending"),
            gte(orders.createdAt, startDate),
            lte(orders.createdAt, endDate)
          )
        );

      res.json({
        success: true,
        message: "Payment verified successfully",
        orderId: razorpay_order_id,
      });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
});

export default router;
