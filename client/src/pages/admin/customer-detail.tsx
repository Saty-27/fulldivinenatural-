import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useParams } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/admin-layout";

function CustomerDetailPage() {
  const [, setLocation] = useLocation();
  const { customerId } = useParams() as { customerId: string };
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    frequency: "daily",
  });

  // Fetch all customers
  const { data: customers = [] } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/customers", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  // Fetch all orders
  const { data: allOrders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  // Fetch all subscriptions
  const { data: allSubscriptions = [] } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/subscriptions", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  // Fetch all products
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  // Add subscription mutation
  const addSubscriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: customerId,
          productId: parseInt(data.productId),
          quantity: parseFloat(data.quantity),
          frequency: data.frequency,
          deliveryTime: "7-8 AM",
          startDate: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error("Failed to add subscription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      toast({ title: "✅ Subscription added successfully!" });
      setShowAddSubscription(false);
      setFormData({ productId: "", quantity: "", frequency: "daily" });
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const customer = customers.find((c: any) => c.id === customerId);
  const customerOrders = allOrders.filter((o: any) => o.userId === customerId) || [];
  const customerSubscriptions = allSubscriptions.filter((s: any) => s.userId === customerId) || [];

  if (!customer) {
    return (
      <AdminLayout>
        <div style={{ padding: "1.5rem" }}>
          <p style={{ color: "#dc2626" }}>Customer not found</p>
          <Button onClick={() => setLocation("/admin/customers")} style={{ marginTop: "1rem" }}>
            ← Back to Customers
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <Button onClick={() => setLocation("/admin/customers")} style={{ marginBottom: "1rem" }}>
          ← Back to Customers
        </Button>

        {/* Customer Profile */}
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#111827", margin: "0 0 1rem 0" }}>
            👤 {customer.name}
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>Email</p>
              <p style={{ fontSize: "1rem", fontWeight: "500", color: "#111827", margin: 0 }}>{customer.email}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>Phone</p>
              <p style={{ fontSize: "1rem", fontWeight: "500", color: "#111827", margin: 0 }}>{customer.phone}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>Total Spent</p>
              <p style={{ fontSize: "1rem", fontWeight: "500", color: "#f59e0b", margin: 0 }}>₹{parseFloat(customer.totalSpending || "0").toLocaleString()}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>Joined</p>
              <p style={{ fontSize: "1rem", fontWeight: "500", color: "#111827", margin: 0 }}>{new Date(customer.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: "0 0 1rem 0" }}>
            📦 Orders ({customerOrders.length})
          </h2>
          {customerOrders.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>No orders found</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                  <tr>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Order ID</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Date</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Amount</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Status</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Payment</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {customerOrders.map((order: any) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#3b82f6" }}>#{order.id}</td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>
                        ₹{parseFloat(order.totalAmount || "0").toLocaleString()}
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                        <Badge style={{
                          background: order.status === "DELIVERED" ? "#10b981" : order.status === "PENDING" ? "#f59e0b" : "#ef4444",
                          color: "white",
                          padding: "0.25rem 0.75rem"
                        }}>
                          {order.status || "PLACED"}
                        </Badge>
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                        <Badge style={{
                          background: order.paymentStatus === "paid" ? "#10b981" : "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.75rem"
                        }}>
                          {order.paymentStatus || "pending"}
                        </Badge>
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        {order.paymentMethod === "cod" ? "💵 COD" : order.paymentMethod === "upi" ? "📱 UPI" : "💳 Card"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Subscriptions Section */}
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              🥛 Subscriptions ({customerSubscriptions.length})
            </h2>
            <Button 
              onClick={() => setShowAddSubscription(!showAddSubscription)}
              style={{ background: "#10b981", color: "white", padding: "0.5rem 1rem" }}
            >
              ➕ Add Subscription
            </Button>
          </div>

          {/* Add Subscription Form */}
          {showAddSubscription && (
            <div style={{ background: "#f9fafb", border: "2px solid #10b981", borderRadius: "0.5rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", margin: "0 0 1rem 0" }}>Add New Subscription</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.875rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>Product</label>
                  <select 
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "0.5rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    <option value="">Select Product</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{p.price}/{p.unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>Quantity (L)</label>
                  <Input 
                    type="number" 
                    step="0.5"
                    placeholder="1.5"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>Frequency</label>
                  <select 
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "0.5rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="alternate">Alternate Days</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button 
                  onClick={() => addSubscriptionMutation.mutate(formData)}
                  style={{ background: "#10b981", color: "white", padding: "0.5rem 1rem" }}
                >
                  ✅ Add Subscription
                </Button>
                <Button 
                  onClick={() => setShowAddSubscription(false)}
                  style={{ background: "#6b7280", color: "white", padding: "0.5rem 1rem" }}
                >
                  ✕ Cancel
                </Button>
              </div>
            </div>
          )}

          {customerSubscriptions.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>No active subscriptions</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {customerSubscriptions.map((sub: any) => (
                <div key={sub.id} style={{ border: "2px solid #e5e7eb", borderRadius: "0.5rem", padding: "1rem", background: "#f9fafb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", margin: "0 0 0.25rem 0" }}>
                        {sub.product?.name || "Product"}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>ID: {sub.id}</p>
                    </div>
                    <Badge style={{
                      background: sub.status === "ACTIVE" ? "#10b981" : "#ef4444",
                      color: "white",
                      padding: "0.25rem 0.75rem"
                    }}>
                      {sub.status}
                    </Badge>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.875rem" }}>
                    <div>
                      <p style={{ color: "#6b7280", margin: "0 0 0.25rem 0" }}>Quantity</p>
                      <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>{sub.quantity}L</p>
                    </div>
                    <div>
                      <p style={{ color: "#6b7280", margin: "0 0 0.25rem 0" }}>Frequency</p>
                      <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>{sub.frequency}</p>
                    </div>
                    <div>
                      <p style={{ color: "#6b7280", margin: "0 0 0.25rem 0" }}>Started</p>
                      <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>{new Date(sub.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p style={{ color: "#6b7280", margin: "0 0 0.25rem 0" }}>Price</p>
                      <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>₹{sub.pricePerL}/L</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default CustomerDetailPage;
