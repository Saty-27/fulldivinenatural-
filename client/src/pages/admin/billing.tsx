import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";

interface Bill {
  id: number;
  userId: string;
  month: number;
  year: number;
  finalAmount: number;
  status: string;
  dueDate: string;
  user?: { firstName?: string; lastName?: string; email?: string };
}

export default function AdminBillingPage() {
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bills = [], refetch } = useQuery({
    queryKey: ["admin-bills", statusFilter],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/admin/billing?status=${statusFilter}`, { credentials: "include" });
        return res.ok ? res.json() : [];
      } catch {
        return [];
      }
    },
  });

  const stats = {
    total: bills.length,
    unpaid: bills.filter((b: any) => b.status === "unpaid").length,
    paid: bills.filter((b: any) => b.status === "paid").length,
    overdue: bills.filter((b: any) => b.status === "overdue").length,
    collected: bills
      .filter((b: any) => b.status === "paid")
      .reduce((sum: number, b: any) => sum + Number(b.finalAmount), 0),
    pending: bills
      .filter((b: any) => b.status !== "paid")
      .reduce((sum: number, b: any) => sum + Number(b.finalAmount), 0),
  };

  const monthName = new Date(2025, new Date().getMonth()).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <AdminLayout>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)", padding: "2rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => setLocation("/admin")}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            ← Back to Admin
          </button>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
            📑 Billing Management
          </h1>
          <p style={{ color: "#6b7280", margin: 0 }}>Current Month: {monthName}</p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}>Total Bills</p>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6", margin: 0 }}>{stats.total}</p>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}>Unpaid Bills</p>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ef4444", margin: 0 }}>{stats.unpaid}</p>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}>Paid Bills</p>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981", margin: 0 }}>{stats.paid}</p>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}>Overdue Bills</p>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b", margin: 0 }}>{stats.overdue}</p>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}>Revenue Collected</p>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#8b5cf6", margin: 0 }}>₹{stats.collected.toLocaleString()}</p>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}>Pending Revenue</p>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f97316", margin: 0 }}>₹{stats.pending.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem 0" }}>Filter by Status</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["all", "unpaid", "paid", "overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: statusFilter === status ? "2px solid #22c55e" : "1px solid #e5e7eb",
                  background: statusFilter === status ? "#dcfce7" : "white",
                  color: statusFilter === status ? "#15803d" : "#6b7280",
                  cursor: "pointer",
                  fontWeight: statusFilter === status ? "600" : "400",
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bills Table */}
        <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>#</th>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>User</th>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Month</th>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Amount</th>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Due Date</th>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill: Bill, index: number) => (
                <tr key={bill.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "1rem", fontSize: "14px", color: "#6b7280" }}>{index + 1}</td>
                  <td style={{ padding: "1rem", fontSize: "14px", color: "#111827", fontWeight: "500" }}>
                    {bill.user?.firstName} {bill.user?.lastName}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "14px", color: "#6b7280" }}>
                    {new Date(bill.year, bill.month - 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                    ₹{Number(bill.finalAmount).toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "14px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                          bill.status === "paid"
                            ? "#dcfce7"
                            : bill.status === "overdue"
                              ? "#fee2e2"
                              : "#fef3c7",
                        color:
                          bill.status === "paid"
                            ? "#15803d"
                            : bill.status === "overdue"
                              ? "#b91c1c"
                              : "#ca8a04",
                      }}
                    >
                      {bill.status === "paid" ? "✅ Paid" : bill.status === "overdue" ? "⚠️ Overdue" : "⏳ Unpaid"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "14px", color: "#6b7280" }}>
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => setLocation(`/admin/billing/${bill.id}`)}
                      style={{
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bills.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
              No bills found
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
