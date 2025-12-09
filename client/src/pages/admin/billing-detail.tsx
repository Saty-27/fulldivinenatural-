import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";

interface BillDetail {
  id: number;
  userId: string;
  month: number;
  year: number;
  items: any[];
  subscriptionTotal: number;
  ordersTotal: number;
  penalty: number;
  discount: number;
  finalAmount: number;
  status: string;
  dueDate: string;
  paymentDate?: string;
  user?: { firstName?: string; lastName?: string; email?: string; phone?: string };
}

export default function AdminBillingDetailPage() {
  const [location, setLocation] = useLocation();
  const billId = parseInt(location.split("/").pop() || "0");
  const [actionMode, setActionMode] = useState<"none" | "extend" | "penalty" | "discount">("none");
  const [actionValue, setActionValue] = useState("");

  const { data: bill, refetch } = useQuery({
    queryKey: ["admin-bill-detail", billId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/admin/billing/${billId}`, { credentials: "include" });
        return res.ok ? res.json() : null;
      } catch {
        return null;
      }
    },
  });

  const handleAction = async (action: string) => {
    // Mark as Paid doesn't need actionValue
    if (!bill) return;
    if (action !== "mark-paid" && !actionValue) return;

    try {
      let endpoint = "";
      let body: any = {};

      if (action === "extend") {
        endpoint = `/api/admin/billing/${billId}/extend-due`;
        body = { newDueDate: actionValue };
      } else if (action === "penalty") {
        endpoint = `/api/admin/billing/${billId}/penalty`;
        body = { penaltyAmount: parseFloat(actionValue) };
      } else if (action === "discount") {
        endpoint = `/api/admin/billing/${billId}/discount`;
        body = { discountAmount: parseFloat(actionValue) };
      } else if (action === "mark-paid") {
        endpoint = `/api/admin/billing/${billId}/mark-paid`;
        body = { paymentMethod: "manual" };
      }

      const res = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setActionMode("none");
        setActionValue("");
        refetch();
      } else {
        console.error("Failed:", await res.json());
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  if (!bill) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading bill details...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <button
          onClick={() => setLocation("/admin/billing")}
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "1.5rem",
          }}
        >
          ← Back to Bills
        </button>

        {/* Bill Summary Card */}
        <div style={{ background: "white", padding: "2rem", borderRadius: "12px", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
              Bill for {bill.user?.firstName} {bill.user?.lastName}
            </h1>
            <p style={{ color: "#6b7280", margin: 0 }}>
              {new Date(bill.year, bill.month - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", margin: "0 0 8px 0", textTransform: "uppercase" }}>
                Subscription Total
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", margin: 0 }}>
                ₹{Number(bill.subscriptionTotal).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", margin: "0 0 8px 0", textTransform: "uppercase" }}>
                Orders Total
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6", margin: 0 }}>
                ₹{Number(bill.ordersTotal).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", margin: "0 0 8px 0", textTransform: "uppercase" }}>
                Penalty
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ef4444", margin: 0 }}>
                ₹{Number(bill.penalty).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", margin: "0 0 8px 0", textTransform: "uppercase" }}>
                Discount
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b", margin: 0 }}>
                -₹{Number(bill.discount).toLocaleString()}
              </p>
            </div>
          </div>

          <div style={{ background: "#f0fdf4", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}>Final Amount Payable</p>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#15803d", margin: 0 }}>
              ₹{Number(bill.finalAmount).toLocaleString()}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", margin: 0 }}>Status</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: bill.status === "paid" ? "#10b981" : "#f59e0b", margin: "0 0 1rem 0" }}>
                {bill.status === "paid" ? "✅ Paid" : "⏳ Unpaid"}
              </p>
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", margin: 0 }}>Due Date</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                {new Date(bill.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Bill Items Table */}
        <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Type</th>
                <th style={{ padding: "1rem", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Product</th>
                <th style={{ padding: "1rem", textAlign: "right", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Qty</th>
                <th style={{ padding: "1rem", textAlign: "right", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Price</th>
                <th style={{ padding: "1rem", textAlign: "right", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items?.map((item: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "1rem", fontSize: "14px", color: "#6b7280" }}>
                    <span
                      style={{
                        background: item.type === "subscription" ? "#dbeafe" : "#f3e8ff",
                        color: item.type === "subscription" ? "#1e40af" : "#6b21a8",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "14px", color: "#111827" }}>{item.productName}</td>
                  <td style={{ padding: "1rem", fontSize: "14px", color: "#6b7280", textAlign: "right" }}>{item.quantity}</td>
                  <td style={{ padding: "1rem", fontSize: "14px", color: "#6b7280", textAlign: "right" }}>
                    ₹{Number(item.pricePerUnit).toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "14px", fontWeight: "600", color: "#111827", textAlign: "right" }}>
                    ₹{Number(item.total).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Admin Actions */}
        <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", margin: "0 0 1.5rem 0" }}>🔧 Admin Actions</h3>

          {actionMode === "none" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
              {bill.status !== "paid" && (
                <button
                  onClick={() => handleAction("mark-paid")}
                  style={{
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ✅ Mark as Paid
                </button>
              )}
              <button
                onClick={() => setActionMode("extend")}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                📅 Extend Due Date
              </button>
              <button
                onClick={() => setActionMode("penalty")}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ⚠️ Add Penalty
              </button>
              <button
                onClick={() => setActionMode("discount")}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                💰 Add Discount
              </button>
            </div>
          ) : (
            <div style={{ background: "#f9fafb", padding: "1.5rem", borderRadius: "8px" }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 1rem 0" }}>
                {actionMode === "extend" && "Enter new due date:"}
                {actionMode === "penalty" && "Enter penalty amount (₹):"}
                {actionMode === "discount" && "Enter discount amount (₹):"}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type={actionMode === "extend" ? "date" : "number"}
                  value={actionValue}
                  onChange={(e) => setActionValue(e.target.value)}
                  placeholder={actionMode === "extend" ? "" : "Amount"}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
                <button
                  onClick={() => handleAction(actionMode)}
                  style={{
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setActionMode("none");
                    setActionValue("");
                  }}
                  style={{
                    background: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
