import { Router } from "express";
import { db } from "../db";
import { orders, orderItems, products, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Admin: Get all orders with filtering
router.get("/", async (req: any, res) => {
  try {

    const status = req.query.status as string;
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

// Admin: Get order details with items
router.get("/:id", async (req: any, res) => {
  try {

    const orderId = parseInt(req.params.id);
    const order = await db.select().from(orders).where(eq(orders.id, orderId));

    if (!order.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await db.query.products.findFirst({
          where: eq(products.id, item.productId),
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

// Admin: Update order status
router.patch("/:id/status", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const orderId = parseInt(req.params.id);
    const { status, paymentStatus } = req.body;

    const updated = await db
      .update(orders)
      .set({
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
});

export default router;
