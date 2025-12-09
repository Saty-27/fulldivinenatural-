import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Package, Plus, Trash2, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductsAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    active: true,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [] } = useQuery({
    queryKey: ["admin_products_view"],
    queryFn: async () => {
      const res = await fetch("/api/products", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin_categories_list"],
    queryFn: async () => {
      const res = await fetch("/api/categories", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products_view"] });
      toast({ title: "✅ Product added successfully!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products_view"] });
      toast({ title: "✅ Product updated successfully!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products_view"] });
      toast({ title: "✅ Product deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      description: product.description || "",
      image: product.image || "",
      active: product.active !== false,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price || formData.stock === "") {
      toast({ title: "⚠️ Please fill all required fields", variant: "destructive" });
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description,
      image: formData.image,
      active: formData.active,
    };

    if (editingId) {
      updateProductMutation.mutate(payload);
    } else {
      addProductMutation.mutate(payload);
    }
  };

  const isLoading = addProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending;

  return (
    <div>
      {/* Add/Edit Product Form */}
      {showForm && (
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "2px solid #16a34a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              {editingId ? "✏️ Edit Product" : "➕ New Product"}
            </h3>
            <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem" }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Fresh Toned Milk"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) && categories.map((c: any) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Price (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Stock Units *
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Image URL
              </label>
              <input
                type="url"
                placeholder="e.g. https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Status
              </label>
              <select
                value={formData.active ? "active" : "inactive"}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === "active" })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              >
                <option value="active">✅ Active</option>
                <option value="inactive">❌ Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
              Description
            </label>
            <textarea
              placeholder="Product details and benefits..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                minHeight: "100px",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: "0.5rem 1.5rem",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Processing..." : editingId ? "💾 Update" : "✅ Add"}
            </button>
            <button
              onClick={resetForm}
              style={{
                padding: "0.5rem 1.5rem",
                background: "#e5e7eb",
                color: "#374151",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>📦 Products</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "0.5rem 1rem",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Plus size={18} /> Add Product
            </button>
          )}
        </div>

        {Array.isArray(products) && products.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Category</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Price</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Stock</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Status</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Active</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "1rem", fontWeight: "500" }}>{p.name}</td>
                    <td style={{ padding: "1rem", color: "#6b7280" }}>{p.category || "N/A"}</td>
                    <td style={{ padding: "1rem", color: "#16a34a", fontWeight: "600" }}>₹{p.price}</td>
                    <td style={{ padding: "1rem" }}>{p.stock} units</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700", background: p.stock > 50 ? "#dcfce7" : p.stock > 0 ? "#fef3c7" : "#fee2e2", color: p.stock > 50 ? "#166534" : p.stock > 0 ? "#92400e" : "#991b1b" }}>
                        {p.stock > 50 ? "✅ In Stock" : p.stock > 0 ? "⚠️ Low" : "❌ Out"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700", background: p.active !== false ? "#dcfce7" : "#fee2e2", color: p.active !== false ? "#166534" : "#991b1b" }}>
                        {p.active !== false ? "✅ Active" : "❌ Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(p)}
                        disabled={isLoading}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#dbeafe",
                          color: "#1e40af",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this product?")) {
                            deleteProductMutation.mutate(p.id);
                          }
                        }}
                        disabled={isLoading}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#fee2e2",
                          color: "#991b1b",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
            No products found. Click "Add Product" to create one.
          </p>
        )}
      </div>
    </div>
  );
}
