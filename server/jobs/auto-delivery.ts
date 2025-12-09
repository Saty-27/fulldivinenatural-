import { db } from "../db";
import { milkSubscriptions, subscriptionDeliveries } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function generateDailyDeliveries() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    // Get all active subscriptions with daily frequency
    const activeSubscriptions = await db
      .select()
      .from(milkSubscriptions)
      .where(eq(milkSubscriptions.status, "ACTIVE"));

    for (const sub of activeSubscriptions) {
      // Check frequency
      if (sub.frequency === "daily") {
        // Create delivery for tomorrow
        await db.insert(subscriptionDeliveries).values({
          subscriptionId: sub.id,
          userId: sub.userId,
          deliveryDate: new Date(tomorrowStr),
          quantity: sub.quantity,
          status: "UPCOMING",
        }).catch(() => null); // Ignore duplicates
      } else if (sub.frequency === "weekly") {
        // Only generate on Sundays
        const dayOfWeek = tomorrow.getDay();
        if (dayOfWeek === 0) {
          await db.insert(subscriptionDeliveries).values({
            subscriptionId: sub.id,
            userId: sub.userId,
            deliveryDate: new Date(tomorrowStr),
            quantity: sub.quantity,
            status: "UPCOMING",
          }).catch(() => null);
        }
      } else if (sub.frequency === "alternate") {
        // Check if last delivery was 2 days ago
        const lastDelivery = await db
          .select()
          .from(subscriptionDeliveries)
          .where(eq(subscriptionDeliveries.subscriptionId, sub.id));
        
        if (lastDelivery.length === 0) {
          // First delivery
          await db.insert(subscriptionDeliveries).values({
            subscriptionId: sub.id,
            userId: sub.userId,
            deliveryDate: new Date(tomorrowStr),
            quantity: sub.quantity,
            status: "UPCOMING",
          }).catch(() => null);
        }
      }
    }

    console.log(`✅ Generated deliveries for ${tomorrow.toDateString()}`);
  } catch (error) {
    console.error("❌ Error generating daily deliveries:", error);
  }
}

// Schedule daily generation at midnight
export function startDeliveryScheduler() {
  const midnight = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0);
    return tomorrow.getTime() - now.getTime();
  };

  setInterval(generateDailyDeliveries, midnight());
}
