import { Router } from "express";
import { supportRepository } from "../storage/support.repository";
import { insertSupportTicketSchema, insertTicketMessageSchema } from "@shared/schema";
import { isAuthenticated } from "../replitAuth";

const router = Router();

// Tickets and messages require authentication, but FAQs are public
const requireAuth = (req: any, res: any, next: any) => {
  if (req.path.startsWith('/faqs')) {
    return next();
  }
  return isAuthenticated(req, res, next);
};

router.use(requireAuth);

router.get("/tickets", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const tickets = await supportRepository.getTicketsByUser(userId);
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
});

router.get("/tickets/:id", async (req: any, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const result = await supportRepository.getTicketById(ticketId);
    
    if (!result) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    res.json(result);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
});

router.post("/tickets", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const ticketData = insertSupportTicketSchema.parse({ ...req.body, userId });
    
    const ticket = await supportRepository.createTicket(ticketData);
    res.json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create support ticket" });
  }
});

router.post("/tickets/:id/messages", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const ticketId = parseInt(req.params.id);
    
    const messageData = insertTicketMessageSchema.parse({ 
      ...req.body, 
      ticketId,
      userId,
      isStaff: false
    });
    
    const message = await supportRepository.addMessage(messageData);
    res.json(message);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to add message" });
  }
});

router.get("/faqs", async (req: any, res) => {
  try {
    const category = req.query.category as string | undefined;
    const faqs = await supportRepository.getFaqs(category);
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});

export default router;
