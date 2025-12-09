import { Router } from "express";
import { offersRepository } from "../storage/offers.repository";
import { z } from "zod";

const router = Router();

router.get("/", async (req: any, res) => {
  try {
    const offers = await offersRepository.getActiveOffers();
    res.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});

router.get("/:id", async (req: any, res) => {
  try {
    const offerId = parseInt(req.params.id);
    const offer = await offersRepository.getOfferById(offerId);
    
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    
    res.json(offer);
  } catch (error) {
    console.error("Error fetching offer:", error);
    res.status(500).json({ message: "Failed to fetch offer" });
  }
});

const validateCouponSchema = z.object({
  code: z.string(),
});

router.post("/validate-coupon", async (req: any, res) => {
  try {
    const { code } = validateCouponSchema.parse(req.body);
    const result = await offersRepository.validateCoupon(code);
    res.json(result);
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Failed to validate coupon" });
  }
});

const applyCouponSchema = z.object({
  code: z.string(),
  orderAmount: z.number().positive(),
});

router.post("/apply-coupon", async (req: any, res) => {
  try {
    const { code, orderAmount } = applyCouponSchema.parse(req.body);
    const result = await offersRepository.applyCoupon(code, orderAmount);
    res.json(result);
  } catch (error: any) {
    console.error("Error applying coupon:", error);
    res.status(400).json({ message: error.message || "Failed to apply coupon" });
  }
});

export default router;
