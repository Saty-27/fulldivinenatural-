import { db } from "../db";
import { cart, cartItems, products } from "@shared/schema";
import type { InsertCart, InsertCartItem, Cart, CartItem } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export class CartRepository {
  async getOrCreateCart(userId: string): Promise<Cart> {
    const existing = await db.query.cart.findFirst({
      where: eq(cart.userId, userId),
    });

    if (existing) {
      return existing;
    }

    const [newCart] = await db.insert(cart).values({ userId }).returning();
    return newCart;
  }

  async getCartWithItems(userId: string) {
    const userCart = await this.getOrCreateCart(userId);
    
    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, userCart.id),
      with: {
        product: true,
      },
    });

    return {
      cart: userCart,
      items,
    };
  }

  async addOrUpdateItem(
    userId: string,
    productId: number,
    quantity: number
  ): Promise<CartItem> {
    const userCart = await this.getOrCreateCart(userId);

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, userCart.id),
        eq(cartItems.productId, productId)
      ),
    });

    if (existingItem) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updated;
    }

    const [newItem] = await db
      .insert(cartItems)
      .values({
        cartId: userCart.id,
        productId,
        quantity,
        price: product.price,
      })
      .returning();

    return newItem;
  }

  async updateItemQuantity(
    userId: string,
    cartItemId: number,
    quantity: number
  ): Promise<CartItem | null> {
    const userCart = await this.getOrCreateCart(userId);

    if (quantity <= 0) {
      await this.removeItem(userId, cartItemId);
      return null;
    }

    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, userCart.id))
      )
      .returning();

    return updated;
  }

  async removeItem(userId: string, cartItemId: number): Promise<void> {
    const userCart = await this.getOrCreateCart(userId);

    await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, userCart.id))
      );
  }

  async clearCart(userId: string): Promise<void> {
    const userCart = await this.getOrCreateCart(userId);
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
  }

  async getCartSummary(userId: string) {
    const { items } = await this.getCartWithItems(userId);

    const subtotal = items.reduce((sum, item) => {
      const itemTotal = parseFloat(item.price) * item.quantity;
      return sum + itemTotal;
    }, 0);

    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryFee;

    return {
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}

export const cartRepository = new CartRepository();
