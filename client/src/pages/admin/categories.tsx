import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/admin-layout";

export default function CategoriesAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    active: true,
  });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: ["admin_categories"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/categories", { credentials: "include" });
        return res.ok ? res.json() : [];
      } catch {
        return [];
      }
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, image: base64 });
      setUploading(false);
      toast({ title: "✅ Image uploaded!" });
    };
    reader.onerror = () => {
      setUploading(false);
      toast({ title: "❌ Upload failed", variant: "destructive" });
    };
    reader.readAsDataURL(file);
  };

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_categories"] });
      toast({ title: "✅ Category added!" });
      refetch();
      resetForm();
    },
    onError: (e: any) => toast({ title: `❌ ${e.message}`, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_categories"] });
      toast({ title: "✅ Category updated!" });
      refetch();
      resetForm();
    },
    onError: (e: any) => toast({ title: `❌ ${e.message}`, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_categories"] });
      toast({ title: "✅ Category deleted!" });
      refetch();
    },
    onError: (e: any) => toast({ title: `❌ ${e.message}`, variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", image: "", active: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: any) => {
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "",
      active: cat.active !== false,
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: "⚠️ Enter category name", variant: "destructive" });
      return;
    }
    if (!formData.image.trim()) {
      toast({ title: "⚠️ Add category image", variant: "destructive" });
      return;
    }
    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      addMutation.mutate(formData);
    }
  };

  const isProcessing = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending || uploading;

  return (
    <AdminLayout>
      <div style={{ padding: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
            🏷️ Categories ({categories.length})
          </h2>
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
            <Plus size={18} /> Add Category
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: "white", border: "2px solid #16a34a", borderRadius: "0.5rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
                {editingId ? "✏️ Edit" : "➕ Add Category"}
              </h3>
              <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Milk, Ghee, Paneer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", minHeight: "60px", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", boxSizing: "border-box", marginBottom: "0.5rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Or Upload Image from PC
                </label>
                <label style={{ display: "block", padding: "1rem", border: "2px dashed #d1d5db", borderRadius: "0.5rem", textAlign: "center", cursor: "pointer", background: "#f9fafb" }}>
                  <Upload size={20} style={{ display: "inline", marginRight: "0.5rem" }} />
                  <span>Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {formData.image && (
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    Preview
                  </label>
                  <img src={formData.image} alt="Preview" style={{ maxHeight: "150px", maxWidth: "100%", borderRadius: "0.5rem" }} />
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Status
                </label>
                <select
                  value={formData.active ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === "active" })}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", boxSizing: "border-box" }}
                >
                  <option value="active">✅ Active</option>
                  <option value="inactive">❌ Inactive</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  style={{
                    padding: "0.5rem 1.5rem",
                    background: isProcessing ? "#9ca3af" : "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    fontWeight: "600",
                  }}
                >
                  {isProcessing ? "Processing..." : editingId ? "💾 Update" : "✅ Add"}
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
          </div>
        )}

        {/* Categories Grid */}
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>No categories. Click "Add Category" to create!</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
              {categories.map((cat: any) => (
                <div key={cat.id} style={{ border: "2px solid #e5e7eb", borderRadius: "0.5rem", overflow: "hidden", background: "white" }}>
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "1rem" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "bold", color: "#111827", margin: "0 0 0.5rem 0" }}>{cat.name}</h4>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.75rem 0" }}>{cat.description || "-"}</p>
                    <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: "600", background: cat.active ? "#d1fae5" : "#fee2e2", color: cat.active ? "#065f46" : "#991b1b", borderRadius: "0.25rem", marginBottom: "0.75rem" }}>
                      {cat.active ? "✅ Active" : "❌ Inactive"}
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleEdit(cat)} disabled={isProcessing} style={{ flex: 1, padding: "0.5rem", background: "#dbeafe", color: "#1e40af", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: "600" }}>
                        <Edit size={14} style={{ display: "inline" }} /> Edit
                      </button>
                      <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(cat.id); }} disabled={isProcessing} style={{ flex: 1, padding: "0.5rem", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: "600" }}>
                        <Trash2 size={14} style={{ display: "inline" }} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
