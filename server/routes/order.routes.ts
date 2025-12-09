import { Router } from "express";
import { db } from "../db";
import { orders, orderItems, products, cartItems, cart as cartTable } from "@shared/schema";
import { isAuthenticated } from "../replitAuth";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const createOrderSchema = z.object({
  items: z.array(z.any()).optional(),
  total: z.number(),
  paymentMethod: z.enum(["cash", "razorpay", "cod", "upi", "card", "netbanking"]).default("cod"),
  paymentStatus: z.string().default("pending"),
  userInfo: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string(),
    address: z.string(),
    email: z.string().optional(),
  }).optional(),
});

// Create order from cart
router.post("/", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = createOrderSchema.parse(req.body);

    // Get cart items using direct query
    const userCart = await db.query.cart.findFirst({
      where: eq(cartTable.userId, userId),
    });

    if (!userCart) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Get cart items
    const cartItemsList = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, userCart.id),
    });

    if (cartItemsList.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of cartItemsList) {
      totalAmount += parseFloat(item.price) * item.quantity;
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize payment method
    let paymentMethod = payload.paymentMethod;
    if (paymentMethod === "cash") paymentMethod = "cod";

    // Get delivery address from userInfo or userCart
    const deliveryAddress = payload.userInfo?.address || "Delivery Address";

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId,
        totalAmount: totalAmount.toString(),
        deliveryAddress,
        paymentMethod,
        paymentStatus: payload.paymentStatus,
        status: "PLACED",
        deliveryDate: today,
        liters: cartItemsList.reduce((sum, item) => sum + item.quantity, 0),
      })
      .returning();

    // Create order items and reduce stock
    for (const item of cartItemsList) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: (parseFloat(item.price) * item.quantity).toString(),
      });

      // Get current product stock and reduce it
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      });
      
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await db
          .update(products)
          .set({ stock: newStock })
          .where(eq(products.id, item.productId));
      }
    }

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error("Error creating order:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid order data" });
    }
    res.status(500).json({ message: "Failed to create order" });
  }
});

// GET orders
router.get("/", async (req: any, res) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const product = await db.query.products.findFirst({
              where: eq(products.id, item.productId),
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

// GET single order
router.get("/:id", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    const orderId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await db.query.products.findFirst({
          where: eq(products.id, item.productId),
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

export default router;
