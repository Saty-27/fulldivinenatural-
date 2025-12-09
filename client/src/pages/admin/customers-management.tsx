import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CustomersManagement() {
  const [searchText, setSearchText] = useState("");
  const [filterSub, setFilterSub] = useState("all"); // all, has, no

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin_customers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/customers", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  // Filter customers
  const filtered = customers.filter((c: any) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      c.phone?.includes(searchText) ||
      c.email?.toLowerCase().includes(searchText.toLowerCase());

    const matchesFilter =
      filterSub === "all" ||
      (filterSub === "has" && c.subscriptionCount > 0) ||
      (filterSub === "no" && c.subscriptionCount === 0);

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "1rem" }}>
        👥 Customer Management
      </h2>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, phone, email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            flex: 1,
            minWidth: "200px",
          }}
        />
        <select
          value={filterSub}
          onChange={(e) => setFilterSub(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
          }}
        >
          <option value="all">All Customers</option>
          <option value="has">Has Subscription</option>
          <option value="no">No Subscription</option>
        </select>
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>Loading customers...</p>
      ) : filtered.length > 0 ? (
        <div style={{ overflowX: "auto", background: "white", borderRadius: "0.5rem" }}>
          <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
              <tr>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>
                  Name
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>
                  Phone
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>
                  Email
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>
                  Orders
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>
                  Subscriptions
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>
                  Total Spending
                </th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb", cursor: "pointer" }}>
                  <td style={{ padding: "1rem", color: "#111827", fontWeight: "500" }}>{customer.name}</td>
                  <td style={{ padding: "1rem", color: "#6b7280" }}>{customer.phone}</td>
                  <td style={{ padding: "1rem", color: "#6b7280" }}>{customer.email}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        background: "#dbeafe",
                        color: "#1e40af",
                        fontWeight: "600",
                      }}
                    >
                      {customer.orderCount}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        background: customer.subscriptionCount > 0 ? "#dcfce7" : "#fee2e2",
                        color: customer.subscriptionCount > 0 ? "#166534" : "#991b1b",
                        fontWeight: "600",
                      }}
                    >
                      {customer.subscriptionCount}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "#16a34a", fontWeight: "600" }}>
                    ₹{customer.totalSpending}
                  </td>
                  <td style={{ padding: "1rem", color: "#6b7280", fontSize: "0.75rem" }}>
                    {new Date(customer.joinedDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>No customers found</p>
      )}
    </div>
  );
}
