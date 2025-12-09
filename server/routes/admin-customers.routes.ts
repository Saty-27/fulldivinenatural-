import { Router } from "express";
import { db } from "../db";
import { users, orders, milkSubscriptions, orderItems, products } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Admin: Get all customers with stats
router.get("/", async (req: any, res) => {
  try {

    // Get all customers (non-admin users)
    const allCustomers = await db.query.users.findMany({
      where: (table, { ne }) => ne(table.role, "admin"),
    });

    // Calculate stats for each customer
    const customersWithStats = await Promise.all(
      allCustomers.map(async (customer) => {
        // Get customer orders count
        const customerOrders = await db
          .select()
          .from(orders)
          .where(eq(orders.userId, customer.id));

        // Get customer subscriptions count
        const customerSubs = await db
          .select()
          .from(milkSubscriptions)
          .where(eq(milkSubscriptions.userId, customer.id));

        // Calculate total spending
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
          joinedDate: customer.createdAt,
        };
      })
    );

    res.json(customersWithStats);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

// Admin: Get customer orders
router.get("/:id/orders", async (req: any, res) => {
  try {

    const customerId = req.params.id;
    const customerOrders = await db.select().from(orders).where(eq(orders.userId, customerId));

    res.json(customerOrders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
});

// Admin: Get customer subscriptions
router.get("/:id/subscriptions", async (req: any, res) => {
  try {

    const customerId = req.params.id;
    const customerSubs = await db
      .select()
      .from(milkSubscriptions)
      .where(eq(milkSubscriptions.userId, customerId));

    res.json(customerSubs);
  } catch (error) {
    console.error("Error fetching customer subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch customer subscriptions" });
  }
});

export default router;
