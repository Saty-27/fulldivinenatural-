import { Router } from "express";
import { addressRepository } from "../storage/address.repository";
import { insertAddressSchema } from "@shared/schema";
import { isAuthenticated } from "../replitAuth";
import { z } from "zod";

const router = Router();

// All address routes require authentication
router.use(isAuthenticated);

router.get("/", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addresses = await addressRepository.getAddressesByUser(userId);
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});

router.get("/:id", async (req: any, res) => {
  try {
    const addressId = parseInt(req.params.id);
    const address = await addressRepository.getAddressById(addressId);
    
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
});

router.post("/", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressData = insertAddressSchema.parse({ ...req.body, userId });
    
    const address = await addressRepository.createAddress(addressData);
    res.json(address);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Failed to create address" });
  }
});

router.patch("/:id", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    const addressData = req.body;
    
    const address = await addressRepository.updateAddress(addressId, userId, addressData);
    res.json(address);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
});

router.delete("/:id", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    
    await addressRepository.deleteAddress(addressId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
});

router.patch("/:id/set-default", async (req: any, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    
    const address = await addressRepository.setDefaultAddress(addressId, userId);
    res.json(address);
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ message: "Failed to set default address" });
  }
});

export default router;
