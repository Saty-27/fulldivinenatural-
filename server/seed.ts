import { db } from "./db";
import { users, vendors, deliveryPartners, products, milkSubscriptions } from "@shared/schema";
import { eq } from "drizzle-orm";
import * as bcryptjs from "bcryptjs";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with mock data...");

    // Hash password for admin users
    const salt = await bcryptjs.genSalt(10);
    const adminPasswordHash = await bcryptjs.hash("admin123", salt);
    const customerPasswordHash = await bcryptjs.hash("customer123", salt);

    // Create mock users for each role (2 per role = 8 total)
    const mockUsers = [
      // Customers
      { id: "user-customer-1", email: "customer1@divine.com", firstName: "Priya", lastName: "Patel", role: "customer", phone: "+91-9876543210", walletBalance: "500.00", passwordHash: customerPasswordHash },
      { id: "user-customer-2", email: "customer2@divine.com", firstName: "Rahul", lastName: "Mehta", role: "customer", phone: "+91-9876543211", walletBalance: "300.00", passwordHash: customerPasswordHash },
      
      // Vendors
      { id: "user-vendor-1", email: "vendor1@divine.com", firstName: "Rajesh", lastName: "Kumar", role: "vendor", phone: "+91-9876543212", walletBalance: "0", passwordHash: customerPasswordHash },
      { id: "user-vendor-2", email: "vendor2@divine.com", firstName: "Amit", lastName: "Shah", role: "vendor", phone: "+91-9876543213", walletBalance: "0", passwordHash: customerPasswordHash },
      
      // Delivery Partners
      { id: "user-delivery-1", email: "delivery1@divine.com", firstName: "Suresh", lastName: "Singh", role: "delivery", phone: "+91-9876543214", walletBalance: "0", passwordHash: customerPasswordHash },
      { id: "user-delivery-2", email: "delivery2@divine.com", firstName: "Vijay", lastName: "Sharma", role: "delivery", phone: "+91-9876543215", walletBalance: "0", passwordHash: customerPasswordHash },
      
      // Admins - WITH PASSWORDS
      { id: "user-admin-1", email: "admin1@divine.com", firstName: "Admin", lastName: "Super", role: "admin", phone: "+91-9876543216", walletBalance: "0", passwordHash: adminPasswordHash },
      { id: "user-admin-2", email: "admin2@divine.com", firstName: "Admin", lastName: "Manager", role: "admin", phone: "+91-9876543217", walletBalance: "0", passwordHash: adminPasswordHash }
    ];

    // Insert users
    for (const user of mockUsers) {
      await db.insert(users).values(user);
    }
    console.log("✓ Created 8 mock users (2 per role)");

    // Create vendor profiles for vendor users
    await db.insert(vendors).values([
      {
        userId: "user-vendor-1",
        businessName: "Fresh Dairy Co.",
        licenseNumber: "DL-2018-MH-001",
        locationName: "Andheri West",
        vendorType: "VENDOR",
        dailyCapacity: 2000,
        requirementToday: 500,
        circulatedLiters: 425,
        revenueToday: "21250.00",
        weeklyEarnings: "148750.00",
        isVerified: true
      },
      {
        userId: "user-vendor-2",
        businessName: "Divine Naturals Farm",
        licenseNumber: "DL-2019-MH-002",
        locationName: "Santa Cruz",
        vendorType: "VENDOR",
        dailyCapacity: 1500,
        requirementToday: 400,
        circulatedLiters: 380,
        revenueToday: "19000.00",
        weeklyEarnings: "133000.00",
        isVerified: false
      }
    ]);
    console.log("✓ Created 2 vendor profiles");

    // Create delivery partner profiles
    await db.insert(deliveryPartners).values([
      {
        userId: "user-delivery-1",
        vehicleType: "Electric Scooter",
        licenseNumber: "DL-123456",
        zone: "Andheri-Santacruz",
        isAvailable: true
      },
      {
        userId: "user-delivery-2",
        vehicleType: "Bike",
        licenseNumber: "DL-789012",
        zone: "Borivali-Malad",
        isAvailable: true
      }
    ]);
    console.log("✓ Created 2 delivery partner profiles");

    // Get the vendor IDs for products
    const vendorList = await db.select().from(vendors);

    // Create mock products (at least 5)
    const mockProducts = [
      {
        name: "Full Cream Milk",
        sku: "MILK-FC-001",
        description: "Rich and creamy full cream milk",
        category: "MILK",
        type: "MILK",
        price: "60.00",
        unit: "L",
        stock: 100,
        imageUrl: "/images/full-cream-milk.jpg",
        isActive: true
      },
      {
        name: "Toned Milk",
        sku: "MILK-TN-002",
        description: "Healthy toned milk with reduced fat",
        category: "MILK",
        type: "MILK",
        price: "50.00",
        unit: "L",
        stock: 150,
        imageUrl: "/images/toned-milk.jpg",
        isActive: true
      },
      {
        name: "Fresh Curd",
        sku: "DAIRY-CURD-001",
        description: "Thick and creamy fresh curd",
        category: "DAIRY",
        type: "DAIRY",
        price: "40.00",
        unit: "500g",
        stock: 80,
        imageUrl: "/images/curd.jpg",
        isActive: true
      },
      {
        name: "Paneer",
        sku: "DAIRY-PANEER-001",
        description: "Fresh cottage cheese",
        category: "DAIRY",
        type: "DAIRY",
        price: "120.00",
        unit: "250g",
        stock: 50,
        imageUrl: "/images/paneer.jpg",
        isActive: true
      },
      {
        name: "Buttermilk",
        sku: "DAIRY-BM-001",
        description: "Refreshing traditional buttermilk",
        category: "DAIRY",
        type: "DAIRY",
        price: "25.00",
        unit: "500ml",
        stock: 120,
        imageUrl: "/images/buttermilk.jpg",
        isActive: true
      }
    ];

    for (const product of mockProducts) {
      await db.insert(products).values(product);
    }
    console.log("✓ Created 5 products");

    // Create mock subscriptions (3-5 active subscriptions)
    await db.insert(milkSubscriptions).values([
      {
        userId: "user-customer-1",
        quantity: 2,
        frequency: "daily",
        deliveryTime: "6:00 AM",
        startDate: "2025-01-01",
        isActive: true,
        pricePerL: "60.00",
        status: "ACTIVE"
      },
      {
        userId: "user-customer-1",
        quantity: 1,
        frequency: "daily",
        deliveryTime: "6:30 AM",
        startDate: "2025-01-01",
        isActive: true,
        pricePerL: "50.00",
        status: "ACTIVE"
      },
      {
        userId: "user-customer-2",
        quantity: 1,
        frequency: "daily",
        deliveryTime: "7:00 AM",
        startDate: "2025-01-05",
        isActive: true,
        pricePerL: "60.00",
        status: "ACTIVE"
      }
    ]);
    console.log("✓ Created 3 active subscriptions");

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
