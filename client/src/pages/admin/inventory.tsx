import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/admin-layout";

export default function InventoryAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [stockAction, setStockAction] = useState<"add" | "reduce">("add");
  const [quantity, setQuantity] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/products", { credentials: "include" });
        return res.ok ? res.json() : [];
      } catch {
        return [];
      }
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ productId, newStock }: any) => {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      if (!res.ok) throw new Error("Failed to update stock");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      toast({ title: "✅ Stock updated!" });
      setEditingId(null);
      setQuantity("");
      refetch();
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const handleStockAction = (product: any) => {
    if (!quantity || isNaN(parseFloat(quantity))) {
      toast({ title: "❌ Enter a valid quantity", variant: "destructive" });
      return;
    }

    const qty = parseFloat(quantity);
    const currentStock = parseFloat(product.stock || "0");
    let newStock = currentStock;

    if (stockAction === "add") {
      newStock = currentStock + qty;
    } else {
      newStock = Math.max(0, currentStock - qty);
    }

    updateStockMutation.mutate({ productId: product.id, newStock });
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = products.filter((p: any) => parseFloat(p.stock || "0") <= 50).length;
  const totalValue = products.reduce((sum: number, p: any) => {
    return sum + parseFloat(p.price || "0") * parseFloat(p.stock || "0");
  }, 0);

  return (
    <AdminLayout>
      <div style={{ padding: "1.5rem" }}>
        {/* Header */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: "0 0 1.5rem 0" }}>
          📦 Inventory Management
        </h2>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "white", border: "2px solid #3b82f6", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Products</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6", margin: "0.5rem 0 0 0" }}>{products.length}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #f59e0b", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Low Stock</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b", margin: "0.5rem 0 0 0" }}>{lowStockCount}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #10b981", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Value</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", margin: "0.5rem 0 0 0" }}>₹{totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Input
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "0.75rem", fontSize: "0.875rem", borderRadius: "0.5rem" }}
          />
        </div>

        {/* Inventory Table */}
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflowX: "auto" }}>
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>Loading inventory...</p>
          ) : filteredProducts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>No products found</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Product</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Category</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Stock</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Price</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Value</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product: any, idx: number) => {
                  const stock = parseFloat(product.stock || "0");
                  const value = stock * parseFloat(product.price || "0");
                  const isEditing = editingId === product.id;

                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>
                        {product.name}
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        {product.category}
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.25rem",
                            background: stock <= 50 ? "#fee2e2" : stock <= 100 ? "#fef3c7" : "#d1fae5",
                            color: stock <= 50 ? "#991b1b" : stock <= 100 ? "#92400e" : "#065f46",
                            fontWeight: "600",
                          }}
                        >
                          {stock} {product.unit}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#111827", fontWeight: "600" }}>
                        ₹{parseFloat(product.price || "0").toLocaleString()}
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#10b981", fontWeight: "600" }}>
                        ₹{value.toLocaleString()}
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.75rem" }}>
                        {isEditing ? (
                          <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                            <select
                              value={stockAction}
                              onChange={(e) => setStockAction(e.target.value as "add" | "reduce")}
                              style={{ padding: "0.25rem", fontSize: "0.75rem", borderRadius: "0.25rem", border: "1px solid #d1d5db" }}
                            >
                              <option value="add">➕ Add</option>
                              <option value="reduce">➖ Reduce</option>
                            </select>
                            <Input
                              type="number"
                              step="0.5"
                              placeholder="Qty"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              style={{ padding: "0.25rem", fontSize: "0.75rem", width: "60px", borderRadius: "0.25rem" }}
                            />
                            <button
                              onClick={() => handleStockAction(product)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                background: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "0.25rem",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                background: "#6b7280",
                                color: "white",
                                border: "none",
                                borderRadius: "0.25rem",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingId(product.id)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              background: "#3b82f6",
                              color: "white",
                              border: "none",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            📊 Adjust
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
