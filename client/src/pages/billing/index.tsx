import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  const [, setLocation] = useLocation();

  // Get current bill
  const { data: currentBill, isLoading } = useQuery({
    queryKey: ["current-bill"],
    queryFn: async () => {
      const res = await fetch("/api/billing/current", { credentials: "include" });
      return res.ok ? res.json() : null;
    },
  });

  // Get all bills
  const { data: allBills = [] } = useQuery({
    queryKey: ["all-bills"],
    queryFn: async () => {
      const res = await fetch("/api/billing", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (billId: number) => {
      const res = await fetch(`/api/billing/${billId}/mark-paid`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to mark as paid");
      return res.json();
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  const downloadPDF = (billId: number) => {
    window.open(`/api/bills/${billId}/pdf`, "_blank");
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading billing information...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: "0 0 0.5rem 0" }}>
          💳 Billing & Payments
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>Manage your monthly bills and payments</p>
      </div>

      {/* Current Month Bill */}
      {currentBill && (
        <Card style={{ padding: "2rem", marginBottom: "2rem", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            {/* Month */}
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0", fontWeight: "600" }}>
                📅 MONTH
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>{currentBill.month}</p>
            </div>

            {/* Amount */}
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0", fontWeight: "600" }}>
                💰 TOTAL AMOUNT
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>₹{currentBill.amount?.toLocaleString()}</p>
            </div>

            {/* Status */}
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0", fontWeight: "600" }}>
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
                    currentBill.status === "PAID"
                      ? "#d1fae5"
                      : currentBill.status === "OVERDUE"
                      ? "#fee2e2"
                      : "#fef3c7",
                  color:
                    currentBill.status === "PAID"
                      ? "#065f46"
                      : currentBill.status === "OVERDUE"
                      ? "#991b1b"
                      : "#92400e",
                }}
              >
                {currentBill.status === "PAID"
                  ? "✅ PAID"
                  : currentBill.status === "OVERDUE"
                  ? "⚠️ OVERDUE"
                  : "🟧 UNPAID"}
              </Badge>
            </div>
          </div>

          {/* Due Date & Days Left */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ background: "#f3f4f6", padding: "1rem", borderRadius: "0.5rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>📆 DUE DATE</p>
              <p style={{ fontSize: "1rem", fontWeight: "600", color: "#111827" }}>
                {new Date(currentBill.dueDate).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div style={{ background: "#f3f4f6", padding: "1rem", borderRadius: "0.5rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>⏰ DAYS LEFT</p>
              <p style={{ fontSize: "1rem", fontWeight: "600", color: currentBill.daysLeft > 0 ? "#10b981" : "#ef4444" }}>
                {currentBill.daysLeft > 0 ? `${currentBill.daysLeft} days` : "Overdue"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button
              onClick={() => downloadPDF(currentBill.billId)}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              📥 Download PDF Invoice
            </Button>
            {currentBill.status !== "PAID" && (
              <Button
                onClick={() => markAsPaidMutation.mutate(currentBill.billId)}
                disabled={markAsPaidMutation.isPending}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  opacity: markAsPaidMutation.isPending ? 0.5 : 1,
                }}
              >
                💵 Mark as Paid (Cash)
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Bill Breakdown */}
      {currentBill?.subscriptionItems?.length > 0 || currentBill?.orderItems?.length > 0 ? (
        <Card style={{ padding: "2rem", marginBottom: "2rem", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: "0 0 1.5rem 0" }}>
            📋 Bill Breakdown
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Description
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Qty
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Rate
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBill.subscriptionItems?.map((item: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#111827" }}>{item.name}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "center", color: "#6b7280" }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "right", color: "#6b7280" }}>
                      ₹{item.rate?.toLocaleString()}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "right", fontWeight: "600", color: "#10b981" }}>
                      ₹{item.total?.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {currentBill.orderItems?.map((item: any, idx: number) => (
                  <tr key={`order-${idx}`} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#111827" }}>{item.name}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "center", color: "#6b7280" }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "right", color: "#6b7280" }}>
                      ₹{item.rate?.toLocaleString()}
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
      ) : null}

      {/* Previous Bills */}
      {allBills.length > 0 && (
        <Card style={{ padding: "2rem", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: "0 0 1.5rem 0" }}>
            📚 Previous Bills
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Month
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Amount
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Status
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Paid On
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allBills.map((bill: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>
                      {new Date(0, bill.month - 1).toLocaleDateString("en-IN", { month: "long" })} {bill.year}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#10b981", textAlign: "right" }}>
                      ₹{Number(bill.finalAmount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                      <Badge
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
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
                          ? "✅ Paid"
                          : bill.status === "overdue"
                          ? "⚠️ Overdue"
                          : "🟧 Unpaid"}
                      </Badge>
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                      {bill.paymentDate
                        ? new Date(bill.paymentDate).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>
                      <Button
                        onClick={() => setLocation(`/billing/${bill.id}`)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        View →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
