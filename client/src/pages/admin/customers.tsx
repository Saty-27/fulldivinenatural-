import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/layout/admin-layout";

export default function CustomersAdmin() {
  const [, setLocation] = useLocation();
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/customers", { credentials: "include" });
        return res.ok ? res.json() : [];
      } catch {
        return [];
      }
    },
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c: any) => c.orderCount > 0).length;
  const totalRevenue = customers.reduce((sum: number, c: any) => sum + parseFloat(c.totalSpending || "0"), 0);

  return (
    <AdminLayout>
      <div style={{ padding: "1.5rem" }}>
        {/* Header */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: "0 0 1.5rem 0" }}>
          👥 Customers Management ({totalCustomers})
        </h2>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "white", border: "2px solid #3b82f6", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Customers</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6", margin: "0.5rem 0 0 0" }}>{totalCustomers}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #10b981", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Active Customers</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", margin: "0.5rem 0 0 0" }}>{activeCustomers}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #f59e0b", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Revenue</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b", margin: "0.5rem 0 0 0" }}>
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Customers Table */}
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflowX: "auto" }}>
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>Loading customers...</p>
          ) : error ? (
            <p style={{ textAlign: "center", color: "#dc2626", padding: "2rem" }}>Error loading customers</p>
          ) : customers.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>No customers found</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Name</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Email</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Phone</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Orders</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Subscriptions</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Spent</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer: any, idx: number) => (
                  <tr 
                    key={idx} 
                    onClick={() => setLocation(`/admin/customers/${customer.id}`)}
                    style={{ 
                      borderBottom: "1px solid #e5e7eb",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      "&:hover": { background: "#f3f4f6" }
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>{customer.name}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>{customer.email}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>{customer.phone}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#3b82f6" }}>
                      {customer.orderCount}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#10b981" }}>
                      {customer.subscriptionCount}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#f59e0b" }}>
                      ₹{parseFloat(customer.totalSpending || "0").toLocaleString()}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                      {new Date(customer.joinedDate).toLocaleDateString()}
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
