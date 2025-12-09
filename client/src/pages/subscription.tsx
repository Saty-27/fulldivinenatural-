import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: number;
  productId: number;
  quantity: number;
  frequency: string;
  deliveryTime: string;
  status: string;
  startDate: string;
  product?: { name: string; price: string; description: string };
}

export default function SubscriptionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch current user data
  const { data: userData } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/user", { credentials: "include" });
        return res.ok ? res.json() : null;
      } catch {
        return null;
      }
    },
  });

  // Fetch billing status for badge
  const { data: billingData } = useQuery({
    queryKey: ["billing-status"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/billing/current", { credentials: "include" });
        return res.ok ? res.json() : null;
      } catch {
        return null;
      }
    },
  });

  const { data: subscriptions = [], isLoading, refetch } = useQuery({
    queryKey: ["user-subscriptions"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/subscriptions/me", { credentials: "include" });
        const data = res.ok ? await res.json() : [];
        console.log("Subscriptions fetched:", data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Subscription fetch error:", error);
        return [];
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const handlePause = async (subId: number) => {
    try {
      const res = await fetch(`/api/subscriptions/${subId}/pause`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "✅ Subscription paused" });
        refetch();
      }
    } catch (e) {
      toast({ title: "❌ Error pausing subscription", variant: "destructive" });
    }
  };

  const handleResume = async (subId: number) => {
    try {
      const res = await fetch(`/api/subscriptions/${subId}/resume`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "✅ Subscription resumed" });
        refetch();
      }
    } catch (e) {
      toast({ title: "❌ Error resuming subscription", variant: "destructive" });
    }
  };

  const totalMonthly = subscriptions.reduce((sum: number, s: any) => {
    const price = parseFloat(s.product?.price || "0");
    return sum + price * parseFloat(s.quantity || 1);
  }, 0);

  const activeCount = subscriptions.filter((s: any) => s.status === "ACTIVE").length;

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom right, #f0fdf4, #eff6ff)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🥛</div>
          <p style={{ color: "#6b7280" }}>Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f0fdf4, #eff6ff)", padding: "1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Billing Alert on Subscriptions */}
        {billingData && billingData.status === "PENDING" && (
          <div
            style={{
              background: "#fef9c3",
              border: "1px solid #fcd34d",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
            }}
          >
            <span>⚠️ Pending bill: ₹{billingData.amount?.toLocaleString()}</span>
            <button
              onClick={() => setLocation("/billing")}
              style={{
                background: "#ca8a04",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Pay
            </button>
          </div>
        )}

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
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              🥛 Hi {userData?.firstName || "there"}!
            </h1>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>Here are your milk subscriptions</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", borderLeft: "4px solid #16a34a" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Active</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#16a34a", margin: "0.5rem 0 0 0" }}>{activeCount}</p>
          </div>
          <div style={{ background: "white", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", borderLeft: "4px solid #f59e0b" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Monthly Cost</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b", margin: "0.5rem 0 0 0" }}>₹{totalMonthly.toLocaleString()}</p>
          </div>
          <div style={{ background: "white", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", borderLeft: "4px solid #3b82f6" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6", margin: "0.5rem 0 0 0" }}>{subscriptions.length}</p>
          </div>
        </div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div style={{ background: "white", borderRadius: "0.5rem", padding: "3rem", textAlign: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
            <p style={{ color: "#6b7280", marginBottom: "1rem" }}>No subscriptions yet</p>
            <Button onClick={() => setLocation("/subscription/create")} style={{ background: "#16a34a", color: "white", padding: "0.5rem 1.5rem", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
              Start Subscription
            </Button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {subscriptions.map((sub: any, idx: number) => (
              <div key={idx} style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Product</p>
                    <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: "0.5rem 0 0 0" }}>
                      {sub.product?.name || "Unknown"}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>
                      {sub.quantity} L per {sub.frequency}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Price</p>
                    <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#16a34a", margin: "0.5rem 0 0 0" }}>
                      ₹{(parseFloat(sub.product?.price || "0") * parseFloat(sub.quantity || 1)).toLocaleString()}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>per {sub.frequency}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
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
                        background: sub.status === "ACTIVE" ? "#d1fae5" : "#fef3c7",
                        color: sub.status === "ACTIVE" ? "#065f46" : "#92400e",
                      }}
                    >
                      {sub.status === "ACTIVE" ? "✅ Active" : "⏸ Paused"}
                    </span>
                  </div>

                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Delivery Time</p>
                    <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#111827", margin: "0.5rem 0 0 0" }}>
                      {sub.deliveryTime || "Morning"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>Started</p>
                    <p style={{ fontSize: "0.875rem", color: "#111827", margin: "0.5rem 0 0 0" }}>
                      {new Date(sub.startDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    {sub.status === "ACTIVE" ? (
                      <button
                        onClick={() => handlePause(sub.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#fef3c7",
                          color: "#92400e",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Pause size={16} /> Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResume(sub.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#d1fae5",
                          color: "#065f46",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Play size={16} /> Resume
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Button */}
        {subscriptions.length > 0 && (
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <Button
              onClick={() => setLocation("/subscription/create")}
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
              ➕ New Subscription
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
