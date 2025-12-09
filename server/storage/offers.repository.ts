import { db } from "../db";
import { } from "@shared/schema";
import type { Offer, Coupon } from "@shared/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export class OffersRepository {
  async getActiveOffers(): Promise<Offer[]> {
    const today = new Date().toISOString().split('T')[0];
    
    return await db.query.offers.findMany({
      where: and(
        eq(offers.isActive, true),
        sql`${offers.validFrom} <= ${today}`,
        sql`${offers.validTo} >= ${today}`
      ),
      orderBy: (offers, { desc }) => [desc(offers.createdAt)],
    });
  }

  async getOfferById(offerId: number): Promise<Offer | undefined> {
    return await db.query.offers.findFirst({
      where: eq(offers.id, offerId),
    });
  }

  async validateCoupon(code: string): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> {
    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, code.toUpperCase()),
    });

    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { valid: false, message: "This coupon is no longer active" };
    }

    const today = new Date();
    if (today < new Date(coupon.validFrom) || today > new Date(coupon.validTo)) {
      return { valid: false, message: "This coupon has expired" };
    }

    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return { valid: false, message: "This coupon has reached its usage limit" };
    }

    return { valid: true, coupon };
  }

  async applyCoupon(code: string, orderAmount: number): Promise<{ discount: number; coupon: Coupon }> {
    const validation = await this.validateCoupon(code);
    
    if (!validation.valid || !validation.coupon) {
      throw new Error(validation.message || "Invalid coupon");
    }

    const coupon = validation.coupon;

    if (coupon.minOrderValue && orderAmount < parseFloat(coupon.minOrderValue)) {
      throw new Error(`Minimum order value of ₹${coupon.minOrderValue} required`);
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * parseFloat(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
    } else {
      discount = parseFloat(coupon.discountValue);
    }

    return { discount, coupon };
  }

  async incrementCouponUsage(couponId: number): Promise<void> {
    await db
      .update(coupons)
      .set({ usageCount: sql`${coupons.usageCount} + 1` })
      .where(eq(coupons.id, couponId));
  }
}

export const offersRepository = new OffersRepository();
