import { db } from "../db";
import { bills, milkSubscriptions, subscriptionDeliveries, orders, products, users } from "@shared/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export async function generateMonthlyBills() {
  console.log("🕐 Starting monthly bill generation...");
  
  try {
    // Get previous month
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const month = prevMonth.getMonth() + 1;
    const year = prevMonth.getFullYear();

    // Get all active users
    const allUsers = await db.select().from(users);

    for (const user of allUsers) {
      // Check if bill already exists for this month
      const existingBill = await db.select().from(bills).where(
        and(
          eq(bills.userId, user.id),
          eq(bills.month, month),
          eq(bills.year, year)
        )
      );

      if (existingBill.length > 0) {
        console.log(`⏭️  Bill already exists for user ${user.id} in ${month}/${year}`);
        continue;
      }

      // Get subscription deliveries for previous month (using string dates)
      const startDateStr = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDateStr = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;

      const subscriptionDeliveries_list = await db
        .select()
        .from(subscriptionDeliveries)
        .where(
          and(
            eq(subscriptionDeliveries.userId, user.id),
            gte(subscriptionDeliveries.deliveryDate, startDateStr),
            lte(subscriptionDeliveries.deliveryDate, endDateStr)
          )
        );

      // Get orders for previous month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const monthOrders = await db
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.userId, user.id),
            gte(orders.createdAt, startDate),
            lte(orders.createdAt, endDate)
          )
        );

      // Calculate subscription total
      let subscriptionTotal = 0;
      const billItems = [];

      for (const delivery of subscriptionDeliveries_list) {
        const sub = await db.query.milkSubscriptions.findFirst({
          where: eq(milkSubscriptions.id, delivery.subscriptionId),
        });

        if (sub) {
          const product = await db.query.products.findFirst({
            where: eq(products.id, sub.productId),
          });

          const total = Number(delivery.quantity) * Number(product?.price || 0);
          subscriptionTotal += total;

          billItems.push({
            date: String(delivery.deliveryDate),
            description: `${product?.name || "Product"} (Subscription)`,
            quantity: delivery.quantity,
            price: Number(product?.price || 0),
            total: total,
          });
        }
      }

      // Calculate orders total
      let ordersTotal = 0;
      for (const order of monthOrders) {
        const orderAmount = Number(order.totalAmount || 0);
        ordersTotal += orderAmount;

        billItems.push({
          date: new Date(order.createdAt).toISOString().split("T")[0],
          description: `Order #${order.id}`,
          quantity: 1,
          price: orderAmount,
          total: orderAmount,
        });
      }

      // Get previous unpaid bill
      const previousBill = await db
        .select()
        .from(bills)
        .where(
          and(
            eq(bills.userId, user.id),
            eq(bills.status, "unpaid")
          )
        );

      const previousPending = previousBill.length > 0
        ? Number(previousBill[0].finalAmount || 0)
        : 0;

      // Calculate penalty if previous bill was overdue
      let penalty = 0;
      if (previousBill.length > 0 && previousBill[0].status === "overdue") {
        penalty = 50; // ₹50 late fee
      }

      // Calculate final amount
      const finalAmount = subscriptionTotal + ordersTotal + previousPending + penalty;

      // Set due date (5 days from bill generation)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 5);
      const dueDateStr = dueDate.toISOString().split("T")[0];

      // Create bill
      await db.insert(bills).values({
        userId: user.id,
        month: month,
        year: year,
        items: JSON.stringify(billItems),
        subscriptionTotal: subscriptionTotal.toString(),
        ordersTotal: ordersTotal.toString(),
        previousPending: previousPending.toString(),
        penalty: penalty.toString(),
        discount: "0",
        finalAmount: finalAmount.toString(),
        dueDate: dueDateStr,
        status: "unpaid",
        paymentDate: null,
        paymentMethod: null,
      });

      console.log(`✅ Bill created for user ${user.id} in ${month}/${year} - Amount: ₹${finalAmount}`);
    }

    console.log("✅ Monthly bill generation completed!");
  } catch (error) {
    console.error("❌ Error generating monthly bills:", error);
  }
}

// Auto-update bill status to overdue if past due date
export async function updateOverdueBills() {
  console.log("🕐 Checking for overdue bills...");
  
  try {
    const allBills = await db.select().from(bills).where(eq(bills.status, "unpaid"));

    for (const bill of allBills) {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      if (today > dueDate) {
        await db
          .update(bills)
          .set({ status: "overdue" })
          .where(eq(bills.id, bill.id));
        
        console.log(`⚠️  Bill #${bill.id} marked as OVERDUE`);
      }
    }

    console.log("✅ Overdue check completed!");
  } catch (error) {
    console.error("❌ Error updating overdue bills:", error);
  }
}
