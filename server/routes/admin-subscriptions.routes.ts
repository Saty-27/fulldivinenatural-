import { Router } from "express";
import { db } from "../db";
import { milkSubscriptions, subscriptionDeliveries, users, products } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Admin: Get all subscriptions
router.get("/", async (req: any, res) => {
  try {

    const allSubs = await db.select().from(milkSubscriptions);
    
    const withDetails = await Promise.all(
      allSubs.map(async (sub) => {
        const customer = await db.query.users.findFirst({
          where: eq(users.id, sub.userId),
        });
        const product = await db.query.products.findFirst({
          where: eq(products.id, sub.productId),
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

// Admin: Get expected daily milk requirement
router.get("/today/requirement", async (req: any, res) => {
  try {

    const today = new Date().toISOString().split("T")[0];
    const deliveries = await db
      .select()
      .from(subscriptionDeliveries)
      .where(eq(subscriptionDeliveries.deliveryDate, new Date(today)));

    const totalRequired = deliveries.reduce((sum, d) => sum + parseFloat(d.quantity.toString()), 0);

    res.json({
      date: today,
      totalRequired,
      deliveryCount: deliveries.length,
      deliveries,
    });
  } catch (error) {
    console.error("Error fetching daily requirement:", error);
    res.status(500).json({ message: "Failed to fetch daily requirement" });
  }
});

// Admin: Pause/Resume subscription
router.patch("/:id/status", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const subId = parseInt(req.params.id);
    const { status } = req.body;

    const updated = await db
      .update(milkSubscriptions)
      .set({ status })
      .where(eq(milkSubscriptions.id, subId))
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

export default router;
