import { Router } from "express";
import { db } from "../db";
import { ethosCards, productDeals, statsCounters, faqs, newsletterSettings, footerSettings, products } from "@shared/schema";
import { eq, asc, desc, and, lte, gte, isNull, or } from "drizzle-orm";
import { isAuthenticated } from "../replitAuth";

const router = Router();

// Middleware to check if user is admin - checks both session.userRole and database
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.session?.userRole === "admin") {
      return next();
    }
    
    const { users } = await import("@shared/schema");
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user?.role === "admin") {
      req.session.userRole = "admin";
      return next();
    }
    
    return res.status(403).json({ message: "Admin access required" });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ message: "Error checking permissions" });
  }
};

// ============================================================================
// ETHOS CARDS
// ============================================================================

// Public: Get active ethos cards
router.get("/ethos/public", async (req, res) => {
  try {
    const cards = await db
      .select()
      .from(ethosCards)
      .where(eq(ethosCards.isActive, true))
      .orderBy(asc(ethosCards.displayOrder));
    res.json(cards);
  } catch (error) {
    console.error("Error fetching ethos cards:", error);
    res.status(500).json({ message: "Failed to fetch ethos cards" });
  }
});

// Admin: Get all ethos cards
router.get("/ethos", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const cards = await db
      .select()
      .from(ethosCards)
      .orderBy(asc(ethosCards.displayOrder));
    res.json(cards);
  } catch (error) {
    console.error("Error fetching ethos cards:", error);
    res.status(500).json({ message: "Failed to fetch ethos cards" });
  }
});

// Admin: Create ethos card
router.post("/ethos", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, icon, displayOrder, isActive } = req.body;
    const [card] = await db.insert(ethosCards).values({
      title,
      description,
      icon,
      displayOrder: displayOrder || 0,
      isActive: isActive !== false,
    }).returning();
    res.status(201).json(card);
  } catch (error) {
    console.error("Error creating ethos card:", error);
    res.status(500).json({ message: "Failed to create ethos card" });
  }
});

// Admin: Update ethos card
router.put("/ethos/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, icon, displayOrder, isActive } = req.body;
    const [card] = await db.update(ethosCards)
      .set({ title, description, icon, displayOrder, isActive, updatedAt: new Date() })
      .where(eq(ethosCards.id, id))
      .returning();
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json(card);
  } catch (error) {
    console.error("Error updating ethos card:", error);
    res.status(500).json({ message: "Failed to update ethos card" });
  }
});

// Admin: Delete ethos card
router.delete("/ethos/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [card] = await db.delete(ethosCards).where(eq(ethosCards.id, id)).returning();
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting ethos card:", error);
    res.status(500).json({ message: "Failed to delete ethos card" });
  }
});

// ============================================================================
// STATS COUNTERS
// ============================================================================

// Public: Get active stats counters
router.get("/stats/public", async (req, res) => {
  try {
    const counters = await db
      .select()
      .from(statsCounters)
      .where(eq(statsCounters.isActive, true))
      .orderBy(asc(statsCounters.displayOrder));
    res.json(counters);
  } catch (error) {
    console.error("Error fetching stats counters:", error);
    res.status(500).json({ message: "Failed to fetch stats counters" });
  }
});

// Admin: Get all stats counters
router.get("/stats", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const counters = await db
      .select()
      .from(statsCounters)
      .orderBy(asc(statsCounters.displayOrder));
    res.json(counters);
  } catch (error) {
    console.error("Error fetching stats counters:", error);
    res.status(500).json({ message: "Failed to fetch stats counters" });
  }
});

// Admin: Create stats counter
router.post("/stats", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { label, value, suffix, icon, displayOrder, isActive } = req.body;
    const [counter] = await db.insert(statsCounters).values({
      label,
      value,
      suffix,
      icon,
      displayOrder: displayOrder || 0,
      isActive: isActive !== false,
    }).returning();
    res.status(201).json(counter);
  } catch (error) {
    console.error("Error creating stats counter:", error);
    res.status(500).json({ message: "Failed to create stats counter" });
  }
});

// Admin: Update stats counter
router.put("/stats/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { label, value, suffix, icon, displayOrder, isActive } = req.body;
    const [counter] = await db.update(statsCounters)
      .set({ label, value, suffix, icon, displayOrder, isActive, updatedAt: new Date() })
      .where(eq(statsCounters.id, id))
      .returning();
    if (!counter) return res.status(404).json({ message: "Counter not found" });
    res.json(counter);
  } catch (error) {
    console.error("Error updating stats counter:", error);
    res.status(500).json({ message: "Failed to update stats counter" });
  }
});

// Admin: Delete stats counter
router.delete("/stats/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [counter] = await db.delete(statsCounters).where(eq(statsCounters.id, id)).returning();
    if (!counter) return res.status(404).json({ message: "Counter not found" });
    res.json({ message: "Counter deleted successfully" });
  } catch (error) {
    console.error("Error deleting stats counter:", error);
    res.status(500).json({ message: "Failed to delete stats counter" });
  }
});

// ============================================================================
// FAQS
// ============================================================================

// Public: Get active FAQs
router.get("/faqs/public", async (req, res) => {
  try {
    const faqList = await db
      .select()
      .from(faqs)
      .where(eq(faqs.isActive, true))
      .orderBy(asc(faqs.displayOrder));
    res.json(faqList);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});

// Admin: Get all FAQs
router.get("/faqs", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const faqList = await db
      .select()
      .from(faqs)
      .orderBy(asc(faqs.displayOrder));
    res.json(faqList);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});

// Admin: Create FAQ
router.post("/faqs", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { question, answer, category, displayOrder, isActive } = req.body;
    const [faq] = await db.insert(faqs).values({
      question,
      answer,
      category: category || "General",
      displayOrder: displayOrder || 0,
      isActive: isActive !== false,
    }).returning();
    res.status(201).json(faq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ message: "Failed to create FAQ" });
  }
});

// Admin: Update FAQ
router.put("/faqs/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { question, answer, category, displayOrder, isActive } = req.body;
    const [faq] = await db.update(faqs)
      .set({ question, answer, category, displayOrder, isActive, updatedAt: new Date() })
      .where(eq(faqs.id, id))
      .returning();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Failed to update FAQ" });
  }
});

// Admin: Delete FAQ
router.delete("/faqs/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [faq] = await db.delete(faqs).where(eq(faqs.id, id)).returning();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
});

// ============================================================================
// PRODUCT DEALS
// ============================================================================

// Public: Get active deals with product info
router.get("/deals/public", async (req, res) => {
  try {
    const now = new Date();
    const deals = await db
      .select({
        id: productDeals.id,
        productId: productDeals.productId,
        dealType: productDeals.dealType,
        dealValue: productDeals.dealValue,
        badgeText: productDeals.badgeText,
        priority: productDeals.priority,
        product: products,
      })
      .from(productDeals)
      .innerJoin(products, eq(productDeals.productId, products.id))
      .where(
        and(
          eq(productDeals.isActive, true),
          eq(products.isActive, true),
          or(isNull(productDeals.startsAt), lte(productDeals.startsAt, now)),
          or(isNull(productDeals.endsAt), gte(productDeals.endsAt, now))
        )
      )
      .orderBy(asc(productDeals.priority));
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
});

// Admin: Get all deals
router.get("/deals", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const deals = await db
      .select({
        id: productDeals.id,
        productId: productDeals.productId,
        dealType: productDeals.dealType,
        dealValue: productDeals.dealValue,
        badgeText: productDeals.badgeText,
        priority: productDeals.priority,
        startsAt: productDeals.startsAt,
        endsAt: productDeals.endsAt,
        isActive: productDeals.isActive,
        product: products,
      })
      .from(productDeals)
      .leftJoin(products, eq(productDeals.productId, products.id))
      .orderBy(asc(productDeals.priority));
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
});

// Admin: Create deal
router.post("/deals", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { productId, dealType, dealValue, badgeText, priority, startsAt, endsAt, isActive } = req.body;
    const [deal] = await db.insert(productDeals).values({
      productId,
      dealType: dealType || "PERCENT",
      dealValue,
      badgeText,
      priority: priority || 0,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      isActive: isActive !== false,
    }).returning();
    res.status(201).json(deal);
  } catch (error) {
    console.error("Error creating deal:", error);
    res.status(500).json({ message: "Failed to create deal" });
  }
});

// Admin: Update deal
router.put("/deals/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { productId, dealType, dealValue, badgeText, priority, startsAt, endsAt, isActive } = req.body;
    const [deal] = await db.update(productDeals)
      .set({
        productId,
        dealType,
        dealValue,
        badgeText,
        priority,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(productDeals.id, id))
      .returning();
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json(deal);
  } catch (error) {
    console.error("Error updating deal:", error);
    res.status(500).json({ message: "Failed to update deal" });
  }
});

// Admin: Delete deal
router.delete("/deals/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [deal] = await db.delete(productDeals).where(eq(productDeals.id, id)).returning();
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Error deleting deal:", error);
    res.status(500).json({ message: "Failed to delete deal" });
  }
});

// ============================================================================
// NEW PRODUCTS (uses products table with isNew flag)
// ============================================================================

// Public: Get new products
router.get("/new-products/public", async (req, res) => {
  try {
    const newProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), eq(products.isNew, true)))
      .orderBy(desc(products.launchedAt), desc(products.createdAt))
      .limit(8);
    res.json(newProducts);
  } catch (error) {
    console.error("Error fetching new products:", error);
    res.status(500).json({ message: "Failed to fetch new products" });
  }
});

// ============================================================================
// NEWSLETTER SETTINGS (singleton)
// ============================================================================

// Public: Get newsletter settings
router.get("/newsletter/public", async (req, res) => {
  try {
    const [settings] = await db
      .select()
      .from(newsletterSettings)
      .where(eq(newsletterSettings.isActive, true))
      .limit(1);
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching newsletter settings:", error);
    res.status(500).json({ message: "Failed to fetch newsletter settings" });
  }
});

// Admin: Get newsletter settings
router.get("/newsletter", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [settings] = await db.select().from(newsletterSettings).limit(1);
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching newsletter settings:", error);
    res.status(500).json({ message: "Failed to fetch newsletter settings" });
  }
});

// Admin: Update newsletter settings
router.put("/newsletter", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, subtitle, ctaText, placeholderText, isActive } = req.body;
    
    // Check if settings exist
    const [existing] = await db.select().from(newsletterSettings).limit(1);
    
    if (existing) {
      const [updated] = await db.update(newsletterSettings)
        .set({ title, subtitle, ctaText, placeholderText, isActive, updatedAt: new Date() })
        .where(eq(newsletterSettings.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(newsletterSettings)
        .values({ title, subtitle, ctaText, placeholderText, isActive })
        .returning();
      res.status(201).json(created);
    }
  } catch (error) {
    console.error("Error updating newsletter settings:", error);
    res.status(500).json({ message: "Failed to update newsletter settings" });
  }
});

// ============================================================================
// FOOTER SETTINGS (singleton)
// ============================================================================

// Public: Get footer settings
router.get("/footer/public", async (req, res) => {
  try {
    const [settings] = await db
      .select()
      .from(footerSettings)
      .where(eq(footerSettings.isActive, true))
      .limit(1);
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    res.status(500).json({ message: "Failed to fetch footer settings" });
  }
});

// Admin: Get footer settings
router.get("/footer", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [settings] = await db.select().from(footerSettings).limit(1);
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    res.status(500).json({ message: "Failed to fetch footer settings" });
  }
});

// Admin: Update footer settings
router.put("/footer", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { companyName, tagline, description, phone, email, address, socialLinks, footerLinks, copyrightText, isActive } = req.body;
    
    // Check if settings exist
    const [existing] = await db.select().from(footerSettings).limit(1);
    
    if (existing) {
      const [updated] = await db.update(footerSettings)
        .set({ companyName, tagline, description, phone, email, address, socialLinks, footerLinks, copyrightText, isActive, updatedAt: new Date() })
        .where(eq(footerSettings.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(footerSettings)
        .values({ companyName, tagline, description, phone, email, address, socialLinks, footerLinks, copyrightText, isActive })
        .returning();
      res.status(201).json(created);
    }
  } catch (error) {
    console.error("Error updating footer settings:", error);
    res.status(500).json({ message: "Failed to update footer settings" });
  }
});

export default router;
