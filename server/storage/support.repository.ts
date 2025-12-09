import { db } from "../db";
import { supportTickets, ticketMessages } from "@shared/schema";
import type { InsertSupportTicket, InsertTicketMessage, SupportTicket, TicketMessage, Faq } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export class SupportRepository {
  async getTicketsByUser(userId: string): Promise<SupportTicket[]> {
    return await db.query.supportTickets.findMany({
      where: eq(supportTickets.userId, userId),
      orderBy: [desc(supportTickets.createdAt)],
    });
  }

  async getTicketById(ticketId: number) {
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, ticketId),
    });

    if (!ticket) return null;

    const messages = await db.query.ticketMessages.findMany({
      where: eq(ticketMessages.ticketId, ticketId),
      orderBy: (ticketMessages, { asc }) => [asc(ticketMessages.createdAt)],
    });

    return { ticket, messages };
  }

  async createTicket(data: InsertSupportTicket): Promise<SupportTicket> {
    const [ticket] = await db.insert(supportTickets).values(data).returning();
    return ticket;
  }

  async addMessage(data: InsertTicketMessage): Promise<TicketMessage> {
    const [message] = await db.insert(ticketMessages).values(data).returning();
    
    await db
      .update(supportTickets)
      .set({ updatedAt: new Date() })
      .where(eq(supportTickets.id, data.ticketId));
    
    return message;
  }

  async updateTicketStatus(ticketId: number, status: string): Promise<SupportTicket> {
    const [updated] = await db
      .update(supportTickets)
      .set({ 
        status,
        updatedAt: new Date(),
        ...(status === 'resolved' || status === 'closed' ? { resolvedAt: new Date() } : {})
      })
      .where(eq(supportTickets.id, ticketId))
      .returning();
    
    return updated;
  }

  async getFaqs(category?: string): Promise<Faq[]> {
    if (category) {
      return await db.query.faqs.findMany({
        where: eq(faqs.category, category),
        orderBy: (faqs, { asc }) => [asc(faqs.order)],
      });
    }
    
    return await db.query.faqs.findMany({
      where: eq(faqs.isActive, true),
      orderBy: (faqs, { asc }) => [asc(faqs.order)],
    });
  }
}

export const supportRepository = new SupportRepository();
