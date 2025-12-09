import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BillDetailPage() {
  const params = useParams<{ billId: string }>();
  const [, setLocation] = useLocation();
  const billId = params.billId;

  const { data: bill, isLoading } = useQuery({
    queryKey: ["bill", billId],
    queryFn: async () => {
      const res = await fetch(`/api/billing/${billId}`, { credentials: "include" });
      return res.ok ? res.json() : null;
    },
  });

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading bill details...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#ef4444" }}>Bill not found</p>
        <Button onClick={() => setLocation("/billing")} style={{ marginTop: "1rem" }}>
          ← Back to Billing
        </Button>
      </div>
    );
  }

  const items = typeof bill.items === "string" ? JSON.parse(bill.items) : bill.items;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
            📄 Bill #{bill.id}
          </h1>
          <p style={{ color: "#6b7280", margin: "0.5rem 0 0 0" }}>
            {monthNames[bill.month - 1]} {bill.year}
          </p>
        </div>
        <Button onClick={() => setLocation("/billing")} style={{ padding: "0.5rem 1rem", background: "#6b7280", color: "white" }}>
          ← Back
        </Button>
      </div>

      {/* Bill Summary Card */}
      <Card style={{ padding: "2rem", marginBottom: "2rem", background: "white" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          {/* Customer Info */}
          <div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600", margin: "0 0 0.5rem 0" }}>
              👤 CUSTOMER
            </p>
            <p style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", margin: 0 }}>
              {bill.user?.firstName} {bill.user?.lastName}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.5rem 0 0 0" }}>
              {bill.user?.email}
            </p>
          </div>

          {/* Total Amount */}
          <div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600", margin: "0 0 0.5rem 0" }}>
              💰 TOTAL AMOUNT
            </p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", margin: 0 }}>
              ₹{Number(bill.finalAmount || 0).toLocaleString()}
            </p>
          </div>

          {/* Status */}
          <div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600", margin: "0 0 0.5rem 0" }}>
              📊 STATUS
            </p>
            <Badge
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                background:
                  bill.status === "paid"
                    ? "#d1fae5"
                    : bill.status === "overdue"
                    ? "#fee2e2"
                    : "#fef3c7",
                color:
                  bill.status === "paid"
                    ? "#065f46"
                    : bill.status === "overdue"
                    ? "#991b1b"
                    : "#92400e",
              }}
            >
              {bill.status === "paid"
                ? "✅ PAID"
                : bill.status === "overdue"
                ? "⚠️ OVERDUE"
                : "🟧 UNPAID"}
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ background: "#f3f4f6", padding: "1rem", borderRadius: "0.5rem" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>📆 DUE DATE</p>
            <p style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", margin: 0 }}>
              {new Date(bill.dueDate).toLocaleDateString("en-IN")}
            </p>
          </div>
          <div style={{ background: "#f3f4f6", padding: "1rem", borderRadius: "0.5rem" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>📅 CREATED</p>
            <p style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", margin: 0 }}>
              {new Date(bill.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </Card>

      {/* Bill Items Table */}
      <Card style={{ padding: "2rem", marginBottom: "2rem", background: "white" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: "0 0 1.5rem 0" }}>
          📋 Bill Line Items
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
              <tr>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                  Date
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                  Description
                </th>
                <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                  Qty
                </th>
                <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                  Price
                </th>
                <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>{item.date}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#111827" }}>{item.description}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "center", color: "#6b7280" }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "right", color: "#6b7280" }}>
                    ₹{item.price?.toLocaleString()}
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "right", fontWeight: "600", color: "#10b981" }}>
                    ₹{item.total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Totals Summary */}
      <Card style={{ padding: "2rem", background: "white", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: "0 0 1.5rem 0" }}>
          📊 Summary
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Subscriptions:</span>
              <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>
                ₹{Number(bill.subscriptionTotal || 0).toLocaleString()}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Orders:</span>
              <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>
                ₹{Number(bill.ordersTotal || 0).toLocaleString()}
              </span>
            </div>
            {Number(bill.previousPending || 0) > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Previous Due:</span>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>
                  ₹{Number(bill.previousPending || 0).toLocaleString()}
                </span>
              </div>
            )}
            {Number(bill.penalty || 0) > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "0.875rem", color: "#991b1b", fontWeight: "600" }}>⚠️ Penalty:</span>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#991b1b" }}>
                  ₹{Number(bill.penalty || 0).toLocaleString()}
                </span>
              </div>
            )}
            {Number(bill.discount || 0) > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "0.875rem", color: "#065f46", fontWeight: "600" }}>✅ Discount:</span>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#065f46" }}>
                  -₹{Number(bill.discount || 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div style={{ background: "#f3f4f6", padding: "1.5rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600", margin: "0 0 0.75rem 0" }}>
              💰 GRAND TOTAL
            </p>
            <p style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981", margin: 0 }}>
              ₹{Number(bill.finalAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Button
          onClick={() => window.open(`/api/bills/${bill.id}/pdf`, "_blank")}
          style={{ padding: "0.75rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
        >
          📥 Download PDF
        </Button>
        <Button
          onClick={() => setLocation("/billing")}
          style={{ padding: "0.75rem 1.5rem", background: "#6b7280", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
        >
          ← Back to Billing
        </Button>
      </div>
    </div>
  );
}
