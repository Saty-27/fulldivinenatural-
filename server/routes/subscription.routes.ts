import { Router } from "express";
import { db } from "../db";
import { milkSubscriptions, subscriptionDeliveries, products, users } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { isAuthenticated } from "../replitAuth";

const router = Router();
router.use(isAuthenticated);

// POST - Create subscription
router.post("/", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { productId, quantity, frequency, deliveryTime, startDate } = req.body;
    const productIdInt = parseInt(productId);

    // Get product for pricing
    const product = await db.query.products.findFirst({
      where: eq(products.id, productIdInt),
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
      nextDeliveryDate: new Date(startDate),
    }).returning();

    res.status(201).json({ message: "Subscription created", subscription: newSub[0] });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

// GET - Get all my subscriptions
router.get("/me", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const subscriptions = await db
      .select()
      .from(milkSubscriptions)
      .where(eq(milkSubscriptions.userId, userId));

    // Get product details for each subscription
    const subscriptionsWithProducts = await Promise.all(
      subscriptions.map(async (sub) => {
        const product = await db.query.products.findFirst({
          where: eq(products.id, sub.productId),
        });
        return { ...sub, product };
      })
    );

    res.json(subscriptionsWithProducts || []);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});

// PUT - Update subscription
router.put("/:id", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const subscriptionId = parseInt(req.params.id);
    const { quantity, frequency, deliveryTime } = req.body;

    const updated = await db
      .update(milkSubscriptions)
      .set({ quantity: parseFloat(quantity), frequency, deliveryTime })
      .where(and(eq(milkSubscriptions.id, subscriptionId), eq(milkSubscriptions.userId, userId)))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});

// PUT - Pause subscription
router.put("/:id/pause", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const subscriptionId = parseInt(req.params.id);

    const updated = await db
      .update(milkSubscriptions)
      .set({ status: "PAUSED", isPaused: true })
      .where(and(eq(milkSubscriptions.id, subscriptionId), eq(milkSubscriptions.userId, userId)))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error pausing subscription:", error);
    res.status(500).json({ message: "Failed to pause subscription" });
  }
});

// PUT - Resume subscription
router.put("/:id/resume", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const subscriptionId = parseInt(req.params.id);

    const updated = await db
      .update(milkSubscriptions)
      .set({ status: "ACTIVE", isPaused: false })
      .where(and(eq(milkSubscriptions.id, subscriptionId), eq(milkSubscriptions.userId, userId)))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error resuming subscription:", error);
    res.status(500).json({ message: "Failed to resume subscription" });
  }
});

// PUT - Skip tomorrow
router.put("/:id/skip-tomorrow", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const subscriptionId = parseInt(req.params.id);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await db.insert(subscriptionDeliveries).values({
      subscriptionId,
      userId,
      deliveryDate: tomorrow,
      quantity: 0,
      status: "SKIPPED",
    });

    res.json({ message: "Tomorrow's delivery skipped" });
  } catch (error) {
    console.error("Error skipping delivery:", error);
    res.status(500).json({ message: "Failed to skip delivery" });
  }
});

// DELETE - Cancel subscription
router.delete("/:id", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const subscriptionId = parseInt(req.params.id);

    const updated = await db
      .update(milkSubscriptions)
      .set({ status: "CANCELLED" })
      .where(and(eq(milkSubscriptions.id, subscriptionId), eq(milkSubscriptions.userId, userId)))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({ message: "Subscription cancelled" });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
});

// GET - History of deliveries
router.get("/me/history", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const deliveries = await db
      .select()
      .from(subscriptionDeliveries)
      .where(eq(subscriptionDeliveries.userId, userId));

    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching delivery history:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

export default router;
