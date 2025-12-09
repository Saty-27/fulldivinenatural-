import { Router } from "express";
import { db } from "../db";
import { bills, orders, milkSubscriptions, products, users } from "@shared/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

const router = Router();

// GET all bills with filters
router.get("/", async (req: any, res) => {
  try {
    const status = req.query.status as string;
    const userId = req.query.userId as string;

    let whereConditions: any[] = [];
    
    if (status && status !== "all") {
      whereConditions.push(eq(bills.status, status));
    }
    if (userId) {
      whereConditions.push(eq(bills.userId, userId));
    }

    let query = db.select().from(bills);
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    const allBills = await query;
    
    // Fetch user details for each bill
    const billsWithUsers = await Promise.all(
      allBills.map(async (bill) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, bill.userId),
        });
        return { ...bill, user };
      })
    );

    res.json(billsWithUsers);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Failed to fetch bills" });
  }
});

// GET bill by ID
router.get("/:id", async (req: any, res) => {
  try {
    const billId = parseInt(req.params.id);
    const bill = await db.query.bills.findFirst({
      where: eq(bills.id, billId),
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, bill.userId),
    });

    res.json({ ...bill, user });
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ message: "Failed to fetch bill" });
  }
});

// PATCH mark bill as paid
router.patch("/:id/mark-paid", async (req: any, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { paymentMethod } = req.body;

    const updated = await db
      .update(bills)
      .set({
        status: "paid",
        paymentDate: sql`now()`,
        paymentMethod: paymentMethod || "manual",
        updatedAt: sql`now()`,
      })
      .where(eq(bills.id, billId))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json({ success: true, bill: updated[0], message: "Bill marked as paid" });
  } catch (error) {
    console.error("Error marking bill as paid:", error);
    res.status(500).json({ message: "Failed to mark bill as paid" });
  }
});

// PATCH extend due date
router.patch("/:id/extend-due", async (req: any, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { newDueDate } = req.body;

    if (!newDueDate) {
      return res.status(400).json({ message: "New due date is required" });
    }

    const updated = await db
      .update(bills)
      .set({
        dueDate: new Date(newDueDate).toISOString().split('T')[0] as any,
        updatedAt: sql`now()`,
      })
      .where(eq(bills.id, billId))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json({ success: true, bill: updated[0], message: "Due date extended" });
  } catch (error) {
    console.error("Error extending due date:", error);
    res.status(500).json({ message: "Failed to extend due date" });
  }
});

// PATCH add penalty
router.patch("/:id/penalty", async (req: any, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { penaltyAmount } = req.body;

    if (!penaltyAmount || penaltyAmount <= 0) {
      return res.status(400).json({ message: "Invalid penalty amount" });
    }

    const bill = await db.query.bills.findFirst({
      where: eq(bills.id, billId),
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const newPenalty = Number(bill.penalty || 0) + Number(penaltyAmount);
    const newFinal = Number(bill.finalAmount) - Number(bill.penalty || 0) + newPenalty;

    const updated = await db
      .update(bills)
      .set({
        penalty: newPenalty as any,
        finalAmount: newFinal as any,
        updatedAt: sql`now()`,
      })
      .where(eq(bills.id, billId))
      .returning();

    res.json({ success: true, bill: updated[0], message: `Penalty of ₹${penaltyAmount} added` });
  } catch (error) {
    console.error("Error adding penalty:", error);
    res.status(500).json({ message: "Failed to add penalty" });
  }
});

// PATCH add discount / waive charges
router.patch("/:id/discount", async (req: any, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { discountAmount } = req.body;

    if (!discountAmount || discountAmount < 0) {
      return res.status(400).json({ message: "Invalid discount amount" });
    }

    const bill = await db.query.bills.findFirst({
      where: eq(bills.id, billId),
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const newDiscount = Number(bill.discount || 0) + Number(discountAmount);
    const newFinal = Number(bill.finalAmount) - Number(bill.discount || 0) + newDiscount;

    const updated = await db
      .update(bills)
      .set({
        discount: newDiscount as any,
        finalAmount: Math.max(0, newFinal) as any,
        updatedAt: sql`now()`,
      })
      .where(eq(bills.id, billId))
      .returning();

    res.json({ success: true, bill: updated[0], message: `Discount of ₹${discountAmount} applied` });
  } catch (error) {
    console.error("Error adding discount:", error);
    res.status(500).json({ message: "Failed to add discount" });
  }
});

// POST generate bill (manual trigger)
router.post("/generate", async (req: any, res) => {
  try {
    const { userId, month, year } = req.body;

    if (!userId || !month || !year) {
      return res.status(400).json({ message: "userId, month, and year are required" });
    }

    // Check if bill already exists
    const existingBill = await db
      .select()
      .from(bills)
      .where(
        and(
          eq(bills.userId, userId),
          eq(bills.month, month),
          eq(bills.year, year)
        )
      );

    if (existingBill.length > 0) {
      return res.status(400).json({ message: "Bill already exists for this month" });
    }

    // Get subscriptions for this user
    const userSubs = await db
      .select()
      .from(milkSubscriptions)
      .where(eq(milkSubscriptions.userId, userId));

    // Get orders for this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

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

    // Calculate totals
    let subscriptionTotal = 0;
    const billItems: any[] = [];

    for (const sub of userSubs) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, sub.productId!),
      });

      if (product && sub.status === "ACTIVE") {
        const daysInMonth = new Date(year, month, 0).getDate();
        let deliveries = daysInMonth;

        if (sub.frequency === "weekly") {
          deliveries = Math.ceil(daysInMonth / 7);
        } else if (sub.frequency === "alternate") {
          deliveries = Math.ceil(daysInMonth / 2);
        }

        const total = Number(sub.quantity || 0) * Number(sub.pricePerL || product.price) * deliveries;
        subscriptionTotal += total;

        billItems.push({
          type: "subscription",
          productId: sub.productId,
          productName: product.name,
          quantity: deliveries,
          pricePerUnit: sub.pricePerL || product.price,
          total: Math.round(total),
        });
      }
    }

    let ordersTotal = 0;
    for (const order of monthOrders) {
      ordersTotal += Number(order.totalAmount || 0);
      billItems.push({
        type: "order",
        orderId: order.id,
        productName: `Order #${order.id}`,
        quantity: 1,
        pricePerUnit: Number(order.totalAmount || 0),
        total: Math.round(Number(order.totalAmount || 0)),
      });
    }

    // Calculate due date (5 days from bill date)
    const dueDate = new Date(year, month - 1, 5);

    const finalAmount = subscriptionTotal + ordersTotal;

    // Create bill
    const newBill = await db
      .insert(bills)
      .values({
        userId: userId as any,
        month: month as any,
        year: year as any,
        items: billItems as any,
        subscriptionTotal: subscriptionTotal as any,
        ordersTotal: ordersTotal as any,
        previousPending: 0 as any,
        penalty: 0 as any,
        discount: 0 as any,
        finalAmount: finalAmount as any,
        dueDate: dueDate.toISOString().split('T')[0] as any,
        status: "unpaid",
      })
      .returning();

    res.json({ success: true, bill: newBill[0], message: "Bill generated successfully" });
  } catch (error) {
    console.error("Error generating bill:", error);
    res.status(500).json({ message: "Failed to generate bill" });
  }
});

export default router;
