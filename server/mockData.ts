// Comprehensive mock data for development

export const mockUser = {
  id: "123",
  email: "rajesh.kumar@gmail.com", 
  firstName: "Rajesh",
  lastName: "Kumar",
  profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  role: "customer",
  address: "Andheri West, Mumbai",
  phone: "+91 9845612378",
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockOrders = [
  {
    id: "ORD-001",
    userId: "123",
    customerName: "Rajesh Kumar",
    status: "delivered",
    items: [
      { name: "Toned Milk", quantity: 2, price: 28, unit: "L" },
      { name: "Fresh Curd", quantity: 1, price: 45, unit: "500g" }
    ],
    total: 101,
    deliveryAddress: "Andheri West, Sector 1, Mumbai",
    deliveryDate: new Date().toISOString(),
    deliveryTime: "06:00 AM",
    paymentMethod: "UPI",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "ORD-002", 
    userId: "124",
    customerName: "Priya Sharma",
    status: "pending",
    items: [
      { name: "Full Cream Milk", quantity: 1, price: 32, unit: "L" },
      { name: "Paneer", quantity: 1, price: 85, unit: "250g" }
    ],
    total: 117,
    deliveryAddress: "Santacruz East, 4th Block, Mumbai",
    deliveryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    deliveryTime: "06:30 AM",
    paymentMethod: "Cash",
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: "ORD-003",
    userId: "125", 
    customerName: "Arjun Reddy",
    status: "in_transit",
    items: [
      { name: "Buffalo Milk", quantity: 3, price: 35, unit: "L" }
    ],
    total: 105,
    deliveryAddress: "Vile Parle East, 2nd Stage, Mumbai",
    deliveryDate: new Date().toISOString(),
    deliveryTime: "07:00 AM",
    paymentMethod: "Online",
    createdAt: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: "ORD-004",
    userId: "126",
    customerName: "Sneha Patel",
    status: "confirmed",
    items: [
      { name: "Organic Milk", quantity: 1, price: 45, unit: "L" },
      { name: "Greek Yogurt", quantity: 2, price: 55, unit: "200g" }
    ],
    total: 155,
    deliveryAddress: "Whitefield, ITPL Main Road, Bangalore",
    deliveryDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    deliveryTime: "06:00 PM",
    paymentMethod: "UPI",
    createdAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: "ORD-005",
    userId: "127",
    customerName: "Vikram Singh",
    status: "cancelled",
    items: [
      { name: "A2 Milk", quantity: 1, price: 55, unit: "L" }
    ],
    total: 55,
    deliveryAddress: "Indiranagar, 100 Feet Road, Bangalore",
    deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryTime: "07:30 AM",
    paymentMethod: "UPI",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

export const mockProducts = [
  {
    id: "PROD-001",
    name: "Toned Milk",
    price: 28,
    mrp: 32,
    category: "milk",
    description: "Fresh toned milk with 3% fat content",
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300",
    inStock: true,
    stockQuantity: 2500,
    unit: "L",
    brand: "Divine Naturals",
    supplier: "Nandini Dairy"
  },
  {
    id: "PROD-002",
    name: "Full Cream Milk", 
    price: 32,
    mrp: 36,
    category: "milk",
    description: "Rich full cream milk with 6% fat content",
    imageUrl: "https://images.unsplash.com/photo-1571212515416-19eb8ac5c9c0?w=300",
    inStock: true,
    stockQuantity: 1800,
    unit: "L",
    brand: "Divine Naturals",
    supplier: "Nandini Dairy"
  },
  {
    id: "PROD-003",
    name: "Buffalo Milk",
    price: 35,
    mrp: 40,
    category: "milk", 
    description: "Pure buffalo milk with rich taste",
    imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300",
    inStock: true,
    stockQuantity: 1200,
    unit: "L",
    brand: "Divine Naturals",
    supplier: "Karnataka Milk Federation"
  },
  {
    id: "PROD-004",
    name: "Organic Milk",
    price: 45,
    mrp: 50,
    category: "milk",
    description: "Certified organic milk from grass-fed cows",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300",
    inStock: true,
    stockQuantity: 500,
    unit: "L",
    brand: "Krishna Chaitanya Organic",
    supplier: "Organic Valley Farm"
  },
  {
    id: "PROD-005",
    name: "Fresh Curd",
    price: 45,
    mrp: 50,
    category: "dairy",
    description: "Fresh homemade style curd",
    imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300",
    inStock: true,
    stockQuantity: 800,
    unit: "500g",
    brand: "Divine Naturals",
    supplier: "Local Dairy"
  },
  {
    id: "PROD-006",
    name: "Paneer",
    price: 85,
    mrp: 95,
    category: "dairy",
    description: "Fresh cottage cheese made daily",
    imageUrl: "https://images.unsplash.com/photo-1631003874768-832c2bd3ce91?w=300",
    inStock: true,
    stockQuantity: 200,
    unit: "250g",
    brand: "Divine Naturals",
    supplier: "Fresh Dairy Co"
  },
  {
    id: "PROD-007",
    name: "A2 Milk",
    price: 55,
    mrp: 62,
    category: "milk",
    description: "Pure A2 protein milk from desi cows",
    imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300",
    inStock: true,
    stockQuantity: 350,
    unit: "L",
    brand: "Krishna Chaitanya A2",
    supplier: "Goshala Farm"
  },
  {
    id: "PROD-008",
    name: "Ghee",
    price: 280,
    mrp: 320,
    category: "dairy",
    description: "Pure cow ghee made from traditional methods",
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f746db87?w=300",
    inStock: true,
    stockQuantity: 120,
    unit: "500g",
    brand: "Krishna Chaitanya Traditional",
    supplier: "Heritage Dairy"
  }
];

export const mockCustomers = [
  {
    id: "CUST-001",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@gmail.com",
    phone: "+91 9845612378",
    address: "Andheri West, Sector 1, Mumbai - 400053",
    subscriptionType: "Daily 2L Toned Milk",
    joinDate: "2023-04-15",
    lastOrder: "Today",
    totalOrders: 245,
    lifetimeValue: 12500,
    status: "active",
    paymentMethod: "UPI"
  },
  {
    id: "CUST-002", 
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@infosys.com",
    phone: "+91 9876123450",
    address: "Santacruz East, 4th Block, Mumbai - 400055",
    subscriptionType: "Alternate Days 1L Full Cream",
    joinDate: "2023-08-22",
    lastOrder: "Yesterday",
    totalOrders: 89,
    lifetimeValue: 4800,
    status: "active",
    paymentMethod: "Cash"
  },
  {
    id: "CUST-003",
    firstName: "Arjun",
    lastName: "Reddy",
    email: "arjun.reddy@wipro.com",
    phone: "+91 9988776655",
    address: "Vile Parle East, 2nd Stage, Mumbai - 400057",
    subscriptionType: "Daily 3L Buffalo Milk",
    joinDate: "2022-11-10",
    lastOrder: "Today",
    totalOrders: 456,
    lifetimeValue: 28500,
    status: "active",
    paymentMethod: "Online"
  },
  {
    id: "CUST-004",
    firstName: "Sneha",
    lastName: "Patel",
    email: "sneha.patel@tcs.com",
    phone: "+91 9123456789",
    address: "Whitefield, ITPL Main Road, Bangalore - 560066",
    subscriptionType: "Daily 1L Organic Milk + Curd",
    joinDate: "2023-01-08",
    lastOrder: "2 days ago",
    totalOrders: 198,
    lifetimeValue: 15600,
    status: "active",
    paymentMethod: "UPI"
  },
  {
    id: "CUST-005",
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram.singh@gmail.com",
    phone: "+91 9345678912",
    address: "JP Nagar 7th Phase, Bangalore - 560078",
    subscriptionType: "Weekly 5L Toned Milk",
    joinDate: "2023-06-14",
    lastOrder: "5 days ago",
    totalOrders: 67,
    lifetimeValue: 3200,
    status: "paused",
    paymentMethod: "Cash"
  }
];

export const mockVendors = [
  {
    id: "VEN-001",
    businessName: "Nandini Dairy Farm",
    contactPerson: "Suresh Patil",
    email: "suresh@nandinidairy.com",
    phone: "+91 9845123456",
    address: "Devanahalli, Bangalore Rural - 562110",
    specialization: ["Cow Milk", "Buffalo Milk", "Curd"],
    dailyCapacity: 2500,
    currentStock: 2100,
    paymentStatus: "paid",
    lastPayment: "₹1,25,000",
    paymentDate: "2024-01-15",
    rating: 4.8,
    joinDate: "2022-03-15",
    status: "active",
    deliveryZones: ["Andheri West", "Vile Parle East", "Juhu"],
    pricePerLiter: 24,
    qualityCertification: "FSSAI Certified"
  },
  {
    id: "VEN-002",
    businessName: "Karnataka Milk Federation",
    contactPerson: "Ramesh Gowda",
    email: "ramesh@kmf.coop",
    phone: "+91 9876543210",
    address: "KMF Complex, Mysore Road, Bangalore - 560026",
    specialization: ["Buffalo Milk", "Ghee", "Paneer"],
    dailyCapacity: 3200,
    currentStock: 2800,
    paymentStatus: "pending",
    lastPayment: "₹1,85,000",
    paymentDate: "2024-01-10",
    rating: 4.9,
    joinDate: "2021-08-20",
    status: "active",
    deliveryZones: ["Santacruz East", "Bandra West", "Powai"],
    pricePerLiter: 26,
    qualityCertification: "ISO 22000"
  }
];

export const mockDeliveryPartners = [
  {
    id: "DEL-001",
    firstName: "Ramesh",
    lastName: "Kumar",
    email: "ramesh.delivery@gmail.com",
    phone: "+91 9876543210",
    address: "Andheri West, Mumbai - 400053",
    vehicleType: "Electric Scooter",
    vehicleNumber: "KA-05-AB-1234",
    zone: "Western Mumbai",
    isActive: true,
    rating: 4.8,
    totalDeliveries: 1250,
    earnings: {
      thisMonth: 25000,
      lastMonth: 22000,
      total: 285000
    },
    joinDate: "2022-06-15",
    documents: {
      license: "verified",
      aadhar: "verified",
      vehicleRC: "verified"
    }
  },
  {
    id: "DEL-002",
    firstName: "Pradeep",
    lastName: "Singh",
    email: "pradeep.delivery@outlook.com",
    phone: "+91 9123456789",
    address: "Santacruz East, Mumbai - 400055",
    vehicleType: "Motorcycle",
    vehicleNumber: "KA-03-CD-5678",
    zone: "Central Mumbai",
    isActive: true,
    rating: 4.9,
    totalDeliveries: 1580,
    earnings: {
      thisMonth: 28500,
      lastMonth: 26000,
      total: 345000
    },
    joinDate: "2021-11-20",
    documents: {
      license: "verified",
      aadhar: "verified",
      vehicleRC: "verified"
    }
  }
];

export const mockComplaints = [
  {
    id: "COMP-001",
    customerId: "CUST-001",
    customerName: "Rajesh Kumar",
    subject: "Late Delivery",
    description: "Milk delivery was 2 hours late today morning. Caused inconvenience for family breakfast.",
    category: "delivery",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Support Team",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: "COMP-002",
    customerId: "CUST-003",
    customerName: "Arjun Reddy",
    subject: "Quality Issue - Sour Milk",
    description: "Yesterday's buffalo milk delivery was sour. Requesting refund and quality check.",
    category: "quality",
    priority: "high",
    status: "resolved",
    assignedTo: "Quality Team",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];

export const mockMilkSubscription = {
  id: "sub-1",
  userId: "123",
  quantity: 2,
  frequency: "daily",
  deliveryTime: "6:00 AM",
  isActive: true
};

export const mockNotifications = [
  {
    id: "NOTIF-001",
    userId: "123",
    title: "Order Delivered Successfully",
    message: "Your morning milk delivery (2L Toned Milk) has been delivered to Andheri West",
    type: "delivery",
    isRead: false,
    priority: "normal",
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: "NOTIF-002",
    userId: "123",
    title: "Tomorrow's Delivery Confirmed",
    message: "Your regular milk subscription for tomorrow (2L Toned Milk + 500g Fresh Curd) is confirmed",
    type: "subscription",
    isRead: true,
    priority: "normal",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000)
  }
];

export const mockAnalytics = {
  todayStats: {
    totalOrders: 45,
    revenue: 15650,
    customersServed: 42,
    deliveriesCompleted: 38,
    pendingDeliveries: 7
  },
  weeklyStats: {
    orders: [35, 42, 38, 45, 52, 48, 45],
    revenue: [12500, 15200, 13800, 15650, 18900, 17200, 15650],
    customers: [32, 38, 35, 42, 48, 45, 42]
  },
  topProducts: [
    { name: "Toned Milk", sales: 180, revenue: 5040 },
    { name: "Buffalo Milk", sales: 95, revenue: 3325 },
    { name: "Paneer", sales: 45, revenue: 3825 },
    { name: "Fresh Curd", sales: 78, revenue: 3510 }
  ]
};