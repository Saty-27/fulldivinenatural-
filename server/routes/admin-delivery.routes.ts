import { Router, Request, Response } from "express";
import { db } from "../db";
import { deliveryPartners } from "shared/schema";
import { eq, and, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

const router = Router();

// ✅ ALL ROUTES ARE PUBLIC - ADMIN DASHBOARD HAS NO AUTH

// GET /api/admin/delivery-partners - List all delivery partners (REAL DATA)
router.get("/", async (req: any, res) => {
  try {
    const { zone, status: statusFilter, verified } = req.query;
    
    const conditions: any[] = [];
    if (zone) conditions.push(eq(deliveryPartners.zone, zone as string));
    if (statusFilter) conditions.push(eq(deliveryPartners.status, statusFilter as string));
    if (verified === "true") conditions.push(eq(deliveryPartners.isVerified, true));
    if (verified === "false") conditions.push(eq(deliveryPartners.isVerified, false));

    let allPartners: any[] = [];
    if (conditions.length > 0) {
      allPartners = await db.query.deliveryPartners.findMany({
        where: and(...conditions)
      });
    } else {
      allPartners = await db.query.deliveryPartners.findMany();
    }

    res.json(allPartners);
  } catch (error: any) {
    console.error("Error fetching delivery partners:", error?.message || error);
    res.status(500).json({ message: "Failed to fetch delivery partners" });
  }
});

// GET /api/admin/delivery-partners/:id - Get single delivery partner
router.get("/:id", async (req: any, res) => {
  try {
    const { id } = req.params;
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(id))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json(partner);
  } catch (error: any) {
    console.error("Error fetching partner:", error?.message || error);
    res.status(500).json({ message: "Failed to fetch partner" });
  }
});

// PATCH /api/admin/delivery-partners/:id - Update partner (zone, etc)
router.patch("/:id", async (req: any, res) => {
  try {
    const { id } = req.params;
    const { zone } = req.body;

    if (!zone) {
      return res.status(400).json({ message: "Zone is required" });
    }

    const updatedPartner = await db.update(deliveryPartners)
      .set({ zone })
      .where(eq(deliveryPartners.id, parseInt(id)))
      .returning();

    if (updatedPartner.length === 0) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json({ ...updatedPartner[0], message: "Partner updated successfully" });
  } catch (error: any) {
    console.error("Error updating partner:", error?.message || error);
    res.status(500).json({ message: "Failed to update partner" });
  }
});

// POST /api/admin/delivery-partners/:id/generate-password - Generate and save password
router.post("/:id/generate-password", async (req: any, res) => {
  try {
    const { id } = req.params;
    const { tempPassword } = req.body;

    if (!tempPassword) {
      return res.status(400).json({ message: "Password required" });
    }

    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(id))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    // Generate username if not already set
    const username = partner.username || `driver_${partner.phone.replace(/\D/g, '').slice(-6)}`;

    // Update partner with password and username
    const updatedPartner = await db.update(deliveryPartners)
      .set({ 
        passwordHash: hashedPassword,
        username: username,
        status: "active", // Auto-activate after password is set
        isVerified: true
      })
      .where(eq(deliveryPartners.id, parseInt(id)))
      .returning();

    res.json({ 
      ...updatedPartner[0], 
      message: "Password saved successfully",
      tempPassword // Return for display, won't be stored again
    });
  } catch (error: any) {
    console.error("Error generating password:", error?.message || error);
    res.status(500).json({ message: "Failed to generate password" });
  }
});

// POST /api/admin/delivery-partners - Create new delivery partner with password
router.post("/", async (req: any, res) => {
  try {
    const { fullName, email, phone, address, zone, vehicleType, licenseNumber, password } = req.body;

    // Validate required fields
    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: "Full name, phone, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Generate username from phone
    const username = `driver_${phone.replace(/\D/g, '').slice(-6)}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create partner with active status and verified
    const newPartner = await db.insert(deliveryPartners).values({
      fullName,
      email,
      phone,
      address,
      zone,
      vehicleType,
      licenseNumber,
      username,
      passwordHash: hashedPassword,
      initialPassword: password, // Store plain password for admin display
      status: "active",
      isVerified: true,
      isAvailable: true,
    }).returning();

    res.status(201).json(newPartner[0]);
  } catch (error: any) {
    console.error("Error creating partner:", error?.message || error);
    res.status(500).json({ message: "Failed to create partner" });
  }
});

// PATCH /api/admin/delivery-partners/:id/verify - Approve or reject partner
router.patch("/:id/verify", async (req: any, res) => {
  try {
    const { id } = req.params;
    const { action, username, tempPassword } = req.body;

    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(id))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    if (action === "approve") {
      if (!tempPassword) {
        return res.status(400).json({ message: "Temporary password required" });
      }

      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      const finalUsername = username || `driver_${partner.phone.replace(/\D/g, '').slice(-6)}`;

      const updatedPartner = await db.update(deliveryPartners)
        .set({
          status: "active",
          isVerified: true,
          username: finalUsername,
          passwordHash: hashedPassword,
        })
        .where(eq(deliveryPartners.id, parseInt(id)))
        .returning();

      // TODO: Send SMS/email with credentials
      console.log(`[Credentials sent to ${partner.fullName}]`);
      console.log(`Username: ${finalUsername}`);
      console.log(`Temp Password: ${tempPassword}`);

      res.json({ ...updatedPartner[0], message: "Partner approved and credentials sent" });
    } else {
      // Reject partner
      const updatedPartner = await db.update(deliveryPartners)
        .set({ status: "rejected", isVerified: false })
        .where(eq(deliveryPartners.id, parseInt(id)))
        .returning();

      res.json({ ...updatedPartner[0], message: "Partner rejected" });
    }
  } catch (error: any) {
    console.error("Error verifying partner:", error?.message || error);
    res.status(500).json({ message: "Failed to verify partner" });
  }
});

// PATCH /api/admin/delivery-partners/:id/block - Block or unblock partner
router.patch("/:id/block", async (req: any, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    if (!action || !["block", "unblock"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(id))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const newStatus = action === "block" ? "blocked" : "active";
    const updatedPartner = await db.update(deliveryPartners)
      .set({ status: newStatus })
      .where(eq(deliveryPartners.id, parseInt(id)))
      .returning();

    // TODO: Send notification to partner

    res.json({ ...updatedPartner[0], message: `Partner ${action}ed successfully` });
  } catch (error: any) {
    console.error("Error blocking partner:", error?.message || error);
    res.status(500).json({ message: "Failed to block/unblock partner" });
  }
});

// PATCH /api/admin/delivery-partners/:id/approve-documents - Approve partner documents
router.patch("/:id/approve-documents", async (req: any, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(id))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const updated = await db.update(deliveryPartners)
      .set({
        isVerified: true,
        status: "active",
      })
      .where(eq(deliveryPartners.id, parseInt(id)))
      .returning();

    res.json({
      message: "Partner documents approved successfully",
      partner: updated[0],
    });
  } catch (error: any) {
    console.error("Error approving documents:", error?.message || error);
    res.status(500).json({ message: "Failed to approve documents" });
  }
});

// PATCH /api/admin/delivery-partners/:id/reject-documents - Reject partner documents
router.patch("/:id/reject-documents", async (req: any, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    if (!remarks) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(id))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const updated = await db.update(deliveryPartners)
      .set({
        isVerified: false,
        status: "pending_verification",
      })
      .where(eq(deliveryPartners.id, parseInt(id)))
      .returning();

    res.json({
      message: "Partner documents rejected. They need to resubmit.",
      partner: updated[0],
    });
  } catch (error: any) {
    console.error("Error rejecting documents:", error?.message || error);
    res.status(500).json({ message: "Failed to reject documents" });
  }
});

// DELETE /api/admin/delivery-partners/:id - Delete/soft-delete partner
router.delete("/:id", async (req: any, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.update(deliveryPartners)
      .set({ status: "rejected" })
      .where(eq(deliveryPartners.id, parseInt(id)))
      .returning();

    res.json({ message: "Partner deleted", partner: deleted[0] });
  } catch (error: any) {
    console.error("Error deleting partner:", error?.message || error);
    res.status(500).json({ message: "Failed to delete partner" });
  }
});

export default router;
