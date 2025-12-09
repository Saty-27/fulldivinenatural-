import { db } from "../db";
import { addresses } from "@shared/schema";
import type { InsertAddress, Address } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export class AddressRepository {
  async getAddressesByUser(userId: string): Promise<Address[]> {
    return await db.query.addresses.findMany({
      where: eq(addresses.userId, userId),
      orderBy: (addresses, { desc }) => [desc(addresses.isDefault)],
    });
  }

  async getAddressById(addressId: number): Promise<Address | undefined> {
    return await db.query.addresses.findFirst({
      where: eq(addresses.id, addressId),
    });
  }

  async createAddress(data: InsertAddress): Promise<Address> {
    if (data.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, data.userId));
    }

    const [address] = await db.insert(addresses).values(data).returning();
    return address;
  }

  async updateAddress(
    addressId: number,
    userId: string,
    data: Partial<InsertAddress>
  ): Promise<Address> {
    if (data.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId));
    }

    const [updated] = await db
      .update(addresses)
      .set(data)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .returning();

    return updated;
  }

  async deleteAddress(addressId: number, userId: string): Promise<void> {
    await db
      .delete(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
  }

  async setDefaultAddress(addressId: number, userId: string): Promise<Address> {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));

    const [updated] = await db
      .update(addresses)
      .set({ isDefault: true })
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .returning();

    return updated;
  }

  async getDefaultAddress(userId: string): Promise<Address | undefined> {
    return await db.query.addresses.findFirst({
      where: and(eq(addresses.userId, userId), eq(addresses.isDefault, true)),
    });
  }
}

export const addressRepository = new AddressRepository();
