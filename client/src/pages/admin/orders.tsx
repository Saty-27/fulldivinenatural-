import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Filter } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { useToast } from "@/hooks/use-toast";

export default function OrdersAdmin() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      try {
        const url = statusFilter ? `/api/admin/orders?status=${statusFilter}` : "/api/admin/orders";
        const res = await fetch(url, { credentials: "include" });
        return res.ok ? res.json() : [];
      } catch {
        return [];
      }
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, paymentStatus }: any) => {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "✅ Order updated!" });
      refetch();
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.status === "PENDING").length;
  const deliveredOrders = orders.filter((o: any) => o.status === "DELIVERED").length;

  return (
    <AdminLayout>
      <div style={{ padding: "1.5rem" }}>
        {/* Header & Filters */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: "0 0 1rem 0" }}>
            📦 Orders Management
          </h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setStatusFilter("")}
              style={{
                padding: "0.5rem 1rem",
                background: !statusFilter ? "#16a34a" : "#e5e7eb",
                color: !statusFilter ? "white" : "#374151",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              All Orders ({totalOrders})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              style={{
                padding: "0.5rem 1rem",
                background: statusFilter === "PENDING" ? "#f59e0b" : "#e5e7eb",
                color: statusFilter === "PENDING" ? "white" : "#374151",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              ⏳ Pending ({pendingOrders})
            </button>
            <button
              onClick={() => setStatusFilter("DELIVERED")}
              style={{
                padding: "0.5rem 1rem",
                background: statusFilter === "DELIVERED" ? "#10b981" : "#e5e7eb",
                color: statusFilter === "DELIVERED" ? "white" : "#374151",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              ✅ Delivered ({deliveredOrders})
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "white", border: "2px solid #10b981", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Orders</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: "0.5rem 0 0 0" }}>{totalOrders}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #f59e0b", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Pending</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b", margin: "0.5rem 0 0 0" }}>{pendingOrders}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #10b981", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Delivered</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", margin: "0.5rem 0 0 0" }}>{deliveredOrders}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflowX: "auto" }}>
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>No orders found</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Order ID</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Customer</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Amount</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Status & Payment</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Date</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontFamily: "monospace", color: "#3b82f6", fontWeight: "600" }}>
                      #{order.id}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>
                      {order.userId?.substring(0, 8)}...
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#10b981" }}>
                      ₹{parseFloat(order.totalAmount || "0").toLocaleString()}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.25rem",
                            background: order.status === "PENDING" ? "#fef3c7" : "#d1fae5",
                            color: order.status === "PENDING" ? "#92400e" : "#065f46",
                            fontWeight: "600",
                            fontSize: "0.75rem",
                          }}
                        >
                          {order.status}
                        </span>
                        {order.paymentStatus && (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "0.25rem",
                              background: order.paymentStatus === "paid" ? "#d1fae5" : "#fee2e2",
                              color: order.paymentStatus === "paid" ? "#065f46" : "#991b1b",
                              fontWeight: "600",
                              fontSize: "0.75rem",
                            }}
                          >
                            💳 {order.paymentStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.75rem", display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                      <button
                        onClick={() => updateOrderMutation.mutate({ orderId: order.id, status: "DELIVERED" })}
                        style={{ padding: "0.25rem 0.5rem", background: "#10b981", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontWeight: "600" }}
                      >
                        ✅ Deliver
                      </button>
                      <button
                        onClick={() => updateOrderMutation.mutate({ orderId: order.id, paymentStatus: "paid" })}
                        style={{ padding: "0.25rem 0.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontWeight: "600" }}
                      >
                        💳 Pay
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Cancel order #${order.id}?`)) {
                            updateOrderMutation.mutate({ orderId: order.id, status: "CANCELLED" });
                          }
                        }}
                        style={{ padding: "0.25rem 0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontWeight: "600" }}
                      >
                        ✕ Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
