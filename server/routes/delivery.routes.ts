import { Router } from "express";
import { db } from "../db";
import { deliveryPartners, deliveryAssignments, orders, milkSubscriptions, products, users, addresses } from "@shared/schema";
import { eq, and, gt, or } from "drizzle-orm";
import bcryptjs from "bcryptjs";

const router = Router();

// ===== ENHANCED LOGIN WITH USERNAME/PASSWORD (not phone) =====
router.post("/login", async (req: any, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.username, username),
    });

    if (!partner) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if partner is blocked
    if (partner.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
    }

    // Check if partner is verified
    if (!partner.isVerified || partner.status !== "active") {
      return res.status(403).json({ message: "Your account is not yet approved. Please wait for admin verification." });
    }

    // Verify password
    if (!partner.passwordHash || !bcryptjs.compareSync(password, partner.passwordHash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.deliveryPartnerId = partner.id;
    res.json({ 
      id: partner.id, 
      name: partner.fullName, 
      area: partner.zone,
      username: partner.username,
      phone: partner.phone,
      profileCompleted: partner.profileCompleted || false
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// ===== FILE UPLOAD ENDPOINT (for documents) =====
router.post("/:partnerId/upload-document", async (req: any, res) => {
  try {
    const { partnerId } = req.params;
    const { docType, fileUrl } = req.body; // fileUrl from Replit Object Storage or S3

    if (!docType || !fileUrl) {
      return res.status(400).json({ message: "Document type and file URL required" });
    }

    // Validate document type
    const validDocTypes = ["aadhaar_front", "aadhaar_back", "pan", "license", "address_proof", "profile"];
    if (!validDocTypes.includes(docType)) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    // Update partner with document URL based on type
    const updateData: any = {};
    if (docType === "profile") updateData.profileImageUrl = fileUrl;
    else if (docType === "aadhaar_front" || docType === "aadhaar_back") updateData.aadhaarImageUrl = fileUrl;
    else if (docType === "pan") updateData.panImageUrl = fileUrl;
    else if (docType === "license") updateData.licenseImageUrl = fileUrl;

    const updated = await db.update(deliveryPartners)
      .set(updateData)
      .where(eq(deliveryPartners.id, parseInt(partnerId)))
      .returning();

    res.json({ 
      message: "Document uploaded successfully", 
      document: { type: docType, url: fileUrl }
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ===== ORDER ASSIGNMENT ENDPOINT (admin assigns orders to partners by zone) =====
router.post("/assign-orders", async (req: any, res) => {
  try {
    const { partnerId, orderIds, zoneFilter } = req.body;

    if (!partnerId || !orderIds || orderIds.length === 0) {
      return res.status(400).json({ message: "Partner ID and order IDs required" });
    }

    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(partnerId))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    if (partner.status === "blocked") {
      return res.status(403).json({ message: "Cannot assign orders to blocked partner" });
    }

    // Assign orders to partner
    const assignments = await Promise.all(
      orderIds.map((orderId: number) => 
        db.insert(deliveryAssignments).values({
          orderId,
          partnerId: parseInt(partnerId),
          assignmentDate: new Date().toISOString().split("T")[0] as any,
          status: "assigned",
        }).returning()
      )
    );

    // Send in-app notification (TODO: implement push)
    console.log(`[Notification] ${partner.fullName}, you have ${orderIds.length} new deliveries assigned!`);

    res.json({ 
      message: `Assigned ${orderIds.length} orders to ${partner.fullName}`,
      assignments: assignments.flat()
    });
  } catch (error: any) {
    console.error("Assignment error:", error);
    res.status(500).json({ message: "Assignment failed" });
  }
});

// ===== EARNINGS TRACKING =====
router.get("/earnings/:partnerId", async (req: any, res) => {
  try {
    const { partnerId } = req.params;
    const { period = "today" } = req.query; // today, week, month, total

    let dateFilter: any = null;
    const today = new Date();
    
    if (period === "today") {
      dateFilter = today.toISOString().split("T")[0];
    } else if (period === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { start: weekAgo, end: today };
    } else if (period === "month") {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { start: monthAgo, end: today };
    }

    // Fetch completed deliveries
    let completedDeliveries = await db.query.deliveryAssignments.findMany({
      where: and(
        eq(deliveryAssignments.partnerId, parseInt(partnerId)),
        eq(deliveryAssignments.status, "delivered")
      )
    });

    // Filter by date if needed
    if (period !== "total" && dateFilter && typeof dateFilter === "object" && dateFilter.start) {
      completedDeliveries = completedDeliveries.filter((d: any) => {
        const assignDate = new Date(d.assignmentDate);
        return assignDate >= dateFilter.start && assignDate <= dateFilter.end;
      });
    } else if (period === "today") {
      completedDeliveries = completedDeliveries.filter((d: any) => {
        return d.assignmentDate === dateFilter;
      });
    }

    // Calculate earnings
    const perDeliveryRate = 50; // ₹50 per delivery
    const codCollected = completedDeliveries.reduce((sum: number, d: any) => 
      sum + (parseFloat(d.collectedCash?.toString() || "0")), 0
    );
    const deliveryEarnings = completedDeliveries.length * perDeliveryRate;
    const totalEarnings = deliveryEarnings + codCollected;

    res.json({
      period,
      deliveriesCompleted: completedDeliveries.length,
      perDeliveryRate,
      deliveryEarnings,
      codCollected: parseFloat(codCollected.toFixed(2)),
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
    });
  } catch (error: any) {
    console.error("Earnings error:", error);
    res.status(500).json({ message: "Failed to fetch earnings" });
  }
});

// ===== CREDENTIALS NOTIFICATION SYSTEM =====
// This is called when admin approves a partner
router.post("/send-credentials/:partnerId", async (req: any, res) => {
  try {
    const { partnerId } = req.params;
    const { username, tempPassword, method = "sms" } = req.body;

    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(partnerId))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // SMS MESSAGE
    const smsMessage = `Hello ${partner.fullName}, your Divine Naturals delivery account is ready! 🚚
Username: ${username}
Temporary Password: ${tempPassword}
Please login and change your password: https://deliverynaturals.app/partner/login
Need help? Call +91-XXXX-XXXX`;

    // EMAIL MESSAGE
    const emailMessage = `
Dear ${partner.fullName},

Your Divine Naturals Delivery Partner account has been approved! 🎉

📱 Login Credentials:
• Username: ${username}
• Temporary Password: ${tempPassword}

🔗 Login Here: https://deliverynaturals.app/partner/login

⚠️ Please change your password on first login for security.

Questions? Contact our support team.

Best regards,
Divine Naturals Team
    `;

    // TODO: Replace with actual SMS/Email integration
    if (method === "sms" && partner.phone) {
      console.log(`[SMS to ${partner.phone}] ${smsMessage}`);
      // Implement: Twilio SMS or AWS SNS
    } else if (method === "email" && partner.email) {
      console.log(`[EMAIL to ${partner.email}] ${emailMessage}`);
      // Implement: SendGrid or AWS SES
    }

    res.json({ 
      message: "Credentials notification sent",
      sentVia: method,
      contact: method === "sms" ? partner.phone : partner.email
    });
  } catch (error: any) {
    console.error("Notification error:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
});

// ===== DELIVERY PARTNER PROFILE ENDPOINTS =====
router.get("/me/:partnerId", async (req: any, res) => {
  try {
    const { partnerId } = req.params;
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq(deliveryPartners.id, parseInt(partnerId))
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Get today's earnings
    const today = new Date().toISOString().split("T")[0];
    const todayDeliveries = await db.query.deliveryAssignments.findMany({
      where: and(
        eq(deliveryAssignments.partnerId, parseInt(partnerId)),
        eq(deliveryAssignments.assignmentDate, today as any)
      )
    });

    res.json({
      ...partner,
      todayDeliveries: todayDeliveries.length,
      todayCompleted: todayDeliveries.filter((d: any) => d.status === "delivered").length
    });
  } catch (error: any) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ===== TODAY'S DELIVERIES =====
router.get("/today/:partnerId", async (req: any, res) => {
  try {
    const { partnerId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const assignments = await db.query.deliveryAssignments.findMany({
      where: and(
        eq(deliveryAssignments.partnerId, parseInt(partnerId)),
        eq(deliveryAssignments.assignmentDate, today as any)
      )
    });

    const deliveries = await Promise.all(
      assignments.map(async (a) => {
        let item = null;
        if (a.orderId) {
          item = await db.query.orders.findFirst({ where: eq(orders.id, a.orderId) });
        } else if (a.subscriptionId) {
          item = await db.query.milkSubscriptions.findFirst({
            where: eq(milkSubscriptions.id, a.subscriptionId),
          });
        }

        const customer = item && 'userId' in item ? await db.query.users.findFirst({
          where: eq(users.id, item.userId),
        }) : null;

        return {
          ...a,
          item,
          customer,
        };
      })
    );

    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deliveries" });
  }
});

// ===== SUBMIT PROFILE (Onboarding) =====
router.post("/:partnerId/submit-profile", async (req: any, res) => {
  try {
    const { partnerId } = req.params;

    // Validate partnerId
    if (!partnerId || partnerId === "null" || isNaN(parseInt(partnerId))) {
      return res.status(400).json({ message: "Invalid partner ID. Please login again." });
    }

    const {
      dob,
      gender,
      alternatePhone,
      address,
      city,
      state,
      pincode,
      aadhaarNumber,
      panNumber,
      licenseNumber,
      licenseValidity,
      vehicleNumber,
      bankAccount,
      bankIfsc,
      bankName,
      bankHolder,
    } = req.body;

    // Validate required fields
    if (!aadhaarNumber || !panNumber || !licenseNumber || !bankAccount) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Validate pincode is numeric
    if (pincode && isNaN(parseInt(pincode))) {
      return res.status(400).json({ message: "Pincode must be numeric" });
    }

    // Update partner with profile data
    const updated = await db.update(deliveryPartners)
      .set({
        dob: dob ? new Date(dob) : undefined,
        gender: gender || undefined,
        aadhaarNumber,
        panNumber,
        licenseNumber,
        vehicleType: vehicleNumber || undefined,
        address: address ? `${address}, ${city}, ${state} - ${pincode}` : undefined,
        zone: city || undefined,
        bankAccountNumber: bankAccount,
        bankIfscCode: bankIfsc || undefined,
        bankName: bankName || undefined,
        bankHolderName: bankHolder || undefined,
        profileCompleted: true,
        status: "pending_verification",
        documentsSubmittedDate: new Date(),
      })
      .where(eq(deliveryPartners.id, parseInt(partnerId)))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json({
      message: "Profile submitted successfully! Your documents are being verified.",
      partner: updated[0],
    });
  } catch (error: any) {
    console.error("Profile submission error:", error);
    res.status(500).json({ message: "Failed to submit profile: " + (error.message || "Unknown error") });
  }
});

// ===== DELIVERY STATUS UPDATES =====
router.patch("/start/:assignmentId", async (req: any, res) => {
  try {
    await db.update(deliveryAssignments)
      .set({ status: "picked_up", timeStarted: new Date() })
      .where(eq(deliveryAssignments.id, parseInt(req.params.assignmentId)));

    res.json({ message: "Delivery started" });
  } catch (error) {
    res.status(500).json({ message: "Failed to start delivery" });
  }
});

router.patch("/complete/:assignmentId", async (req: any, res) => {
  try {
    const { proofPhoto } = req.body;
    
    await db.update(deliveryAssignments)
      .set({ status: "delivered", timeDelivered: new Date(), failedPhoto: proofPhoto })
      .where(eq(deliveryAssignments.id, parseInt(req.params.assignmentId)));

    res.json({ message: "Delivery completed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete delivery" });
  }
});

router.patch("/failed/:assignmentId", async (req: any, res) => {
  try {
    const { reason, photo } = req.body;
    await db.update(deliveryAssignments)
      .set({ status: "failed", failedReason: reason, failedPhoto: photo })
      .where(eq(deliveryAssignments.id, parseInt(req.params.assignmentId)));

    res.json({ message: "Delivery marked as failed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark delivery as failed" });
  }
});

router.patch("/collect-cash/:assignmentId", async (req: any, res) => {
  try {
    const { amount } = req.body;
    await db.update(deliveryAssignments)
      .set({ collectionStatus: "received", collectedCash: amount as any })
      .where(eq(deliveryAssignments.id, parseInt(req.params.assignmentId)));

    res.json({ message: "Cash collected" });
  } catch (error) {
    res.status(500).json({ message: "Failed to collect cash" });
  }
});

export default router;
