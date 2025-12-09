// TypeScript interfaces for Divine Naturals Platform

export type UserRole = 'customer' | 'vendor' | 'delivery' | 'admin';

export type OrderStatus = 'pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type SubscriptionFrequency = 'daily' | 'weekly';

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  phone?: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  walletBalance: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  userId: string;
  walletBalance: string;
}

export interface Vendor {
  id: number;
  userId?: string;
  businessName: string;
  licenseNumber?: string;
  locationName: string;
  vendorType: string;
  isVerified: boolean;
  dailyCapacity?: number;
  requirementToday: number;
  circulatedLiters: number;
  revenueToday: string;
  weeklyEarnings: string;
  createdAt: Date;
}

export interface DeliveryPartner {
  id: number;
  userId?: string;
  vehicleType?: string;
  licenseNumber?: string;
  zone?: string;
  isAvailable: boolean;
  createdAt: Date;
}

export interface Product {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  category: string;
  type: string;
  price: string;
  unit: string;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Order {
  id: number;
  userId?: string;
  vendorId?: number;
  deliveryPartnerId?: number;
  totalAmount: string;
  status: OrderStatus;
  deliveryDate: string;
  deliveryAddress: string;
  paymentStatus: string;
  createdAt: Date;
}

export interface OrderItem {
  id: number;
  orderId?: number;
  productId?: number;
  quantity: number;
  price: string;
  totalPrice: string;
}

export interface MilkSubscription {
  id: number;
  userId?: string;
  quantity: number;
  frequency: SubscriptionFrequency;
  deliveryTime: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Address {
  id: number;
  userId: string;
  type: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  price: string;
  addedAt: Date;
}

export interface Complaint {
  id: number;
  userId: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
}

// API Request/Response Types
export interface AuthUser {
  id: string;
  role: UserRole;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface VendorDashboardMetrics {
  dailyRequirement: number;
  weeklyRevenue: string;
  fulfillmentRate: number;
  circulatedLiters: number;
  revenueToday: string;
}

export interface DeliveryAssignment {
  id: number;
  customerId: string;
  customerName: string;
  address: string;
  phone: string;
  items: Array<{ name: string; quantity: string }>;
  amount: string;
  status: OrderStatus;
  deliveryTime: string;
}

export interface InwardEntry {
  litersArrived: number;
  litersDelivered: number;
  litersPending: number;
  driverInfo: {
    name: string;
    age: number;
    phone: string;
    aadharUrl?: string;
    panUrl?: string;
  };
}

export interface VendorApprovalRequest {
  vendorId: number;
  isApproved: boolean;
}
