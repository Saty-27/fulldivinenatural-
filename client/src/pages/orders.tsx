import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product?: { name: string; description: string };
}

interface Order {
  id: number;
  totalAmount: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryDate: string;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [, setLocation] = useLocation();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/orders", { credentials: "include" });
        if (!res.ok) return [];
        const data = await res.json();
        console.log("Orders fetched:", data);
        return Array.isArray(data) ? data : (data.orders || []);
      } catch (error) {
        console.error("Orders fetch error:", error);
        return [];
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      PLACED: { bg: "#dbeafe", text: "#1e40af" },
      PENDING: { bg: "#fef3c7", text: "#92400e" },
      PROCESSING: { bg: "#ddd6fe", text: "#5b21b6" },
      OUT_FOR_DELIVERY: { bg: "#e9d5ff", text: "#6b21a8" },
      DELIVERED: { bg: "#d1fae5", text: "#065f46" },
      CANCELLED: { bg: "#fee2e2", text: "#991b1b" },
      FAILED: { bg: "#fee2e2", text: "#991b1b" },
    };
    return colors[status] || { bg: "#f3f4f6", text: "#374151" };
  };

  const getPaymentColor = (status: string) => {
    if (status === "paid") return { bg: "#d1fae5", text: "#065f46" };
    if (status === "pending") return { bg: "#fef3c7", text: "#92400e" };
    return { bg: "#fee2e2", text: "#991b1b" };
  };

  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || "0"), 0);
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom right, #f0fdf4, #eff6ff)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
          <p style={{ color: "#6b7280" }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f0fdf4, #eff6ff)", padding: "1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button
            onClick={() => setLocation("/home")}
            style={{
              background: "white",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: 0 }}>📦 My Orders</h1>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>Track your orders</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", borderLeft: "4px solid #3b82f6" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Orders</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6", margin: "0.5rem 0 0 0" }}>{orders.length}</p>
          </div>
          <div style={{ background: "white", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", borderLeft: "4px solid #10b981" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Delivered</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", margin: "0.5rem 0 0 0" }}>{delivered}</p>
          </div>
          <div style={{ background: "white", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", borderLeft: "4px solid #f59e0b" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Spent</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b", margin: "0.5rem 0 0 0" }}>₹{totalSpent.toLocaleString()}</p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div style={{ background: "white", borderRadius: "0.5rem", padding: "3rem", textAlign: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
            <p style={{ color: "#6b7280", marginBottom: "1rem" }}>No orders yet</p>
            <button
              onClick={() => setLocation("/shop")}
              style={{
                padding: "0.5rem 1.5rem",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {orders.map((order, idx) => {
              const statusColor = getStatusColor(order.status);
              const paymentColor = getPaymentColor(order.paymentStatus);

              return (
                <div key={idx} style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  {/* Order Header */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Order ID</p>
                      <p style={{ fontSize: "1.25rem", fontFamily: "monospace", fontWeight: "bold", color: "#3b82f6", margin: "0.5rem 0 0 0" }}>
                        #{order.id}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Amount</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#16a34a", margin: "0.5rem 0 0 0" }}>
                        ₹{parseFloat(order.totalAmount || "0").toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status & Payment */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Status</p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "0.5rem",
                          padding: "0.35rem 0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          borderRadius: "0.25rem",
                          background: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Payment</p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "0.5rem",
                          padding: "0.35rem 0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          borderRadius: "0.25rem",
                          background: paymentColor.bg,
                          color: paymentColor.text,
                        }}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Ordered</p>
                      <p style={{ fontSize: "0.875rem", color: "#111827", margin: "0.25rem 0 0 0" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Delivery Date</p>
                      <p style={{ fontSize: "0.875rem", color: "#111827", margin: "0.25rem 0 0 0" }}>
                        {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method & Address */}
                  <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Payment Method</p>
                      <p style={{ fontSize: "0.875rem", color: "#111827", margin: "0.25rem 0 0 0" }}>
                        {order.paymentMethod || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Delivery Address</p>
                      <p style={{ fontSize: "0.875rem", color: "#111827", margin: "0.25rem 0 0 0", lineHeight: "1.4" }}>
                        {order.deliveryAddress || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  {order.items && order.items.length > 0 && (
                    <div style={{ paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#111827", margin: "0 0 0.75rem 0" }}>
                        Items ({order.items.length})
                      </p>
                      <div style={{ display: "grid", gap: "0.5rem" }}>
                        {order.items.map((item, itemIdx) => (
                          <div key={itemIdx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", padding: "0.5rem", background: "#f9fafb", borderRadius: "0.25rem" }}>
                            <span>
                              {item.product?.name || `Product ${item.productId}`} × {item.quantity}
                            </span>
                            <span style={{ fontWeight: "600", color: "#16a34a" }}>₹{parseFloat(item.price || "0").toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Button */}
        {orders.length > 0 && (
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setLocation("/shop")}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ➕ Order More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
