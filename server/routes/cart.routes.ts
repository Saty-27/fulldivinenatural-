import { Router } from "express";
import { cartRepository } from "../storage/cart.repository";
import { z } from "zod";

const router = Router();

// GET /api/cart - View all items in cart
router.get("/", async (req: any, res) => {
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

// GET /api/cart/summary - Get cart summary
router.get("/summary", async (req: any, res) => {
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

// POST /api/cart/items - Add item to cart
const addItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive().default(1),
});

router.post("/items", async (req: any, res) => {
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

// PATCH /api/cart/items/:id - Update item quantity
const updateItemSchema = z.object({
  quantity: z.number().min(0),
});

router.patch("/items/:id", async (req: any, res) => {
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

// DELETE /api/cart/items/:id - Remove item from cart
router.delete("/items/:id", async (req: any, res) => {
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

// DELETE /api/cart - Clear entire cart
router.delete("/", async (req: any, res) => {
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

export default router;
