import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface User {
  id?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  role?: string;
  profileImageUrl?: string;
}

export default function HomePage() {
  const { user, isLoading } = useAuth() as { user?: User; isLoading: boolean };
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "profile">("overview");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>(user || {});

  // Fetch current billing info
  const { data: billingData } = useQuery({
    queryKey: ["billing-current"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/billing/current", { credentials: "include" });
        return res.ok ? res.json() : null;
      } catch {
        return null;
      }
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        // Complete page reload to clear all state and fetch fresh auth
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Logout failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        toast({ title: "✅ Profile updated successfully!" });
        setEditMode(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="text-6xl font-bold text-green-600 mb-2">🥛</div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Home!</h1>
          <p className="text-gray-500 mt-1">Divine Naturals Dairy Delivery</p>
        </div>

        {/* Billing Alert */}
        {billingData && billingData.status === "PENDING" && (
          <div
            style={{
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              border: "2px solid #fcd34d",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#ca8a04", margin: "0 0 4px 0" }}>
                ⚠️ Bill Due Soon
              </p>
              <p style={{ fontSize: "13px", color: "#92400e", margin: 0 }}>
                You have a pending bill of ₹{billingData.amount?.toLocaleString()} due by {new Date(billingData.dueDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setLocation("/billing")}
              style={{
                background: "#ca8a04",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Pay Now →
            </button>
          </div>
        )}

        {/* Billing Paid Alert */}
        {billingData && billingData.status === "PAID" && (
          <div
            style={{
              background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
              border: "2px solid #86efac",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "18px" }}>✅</span>
            <p style={{ fontSize: "13px", color: "#15803d", margin: 0, fontWeight: "500" }}>
              Your {billingData.month} bill is paid! Thank you for your payment.
            </p>
          </div>
        )}

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.firstName}
                className="w-16 h-16 rounded-full object-cover border-2 border-green-600"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstName?.charAt(0) || "👤"}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
            >
              Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6 flex gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 font-bold ${
                activeTab === "overview"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 font-bold ${
                activeTab === "profile"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setLocation("/billing")}
              className="px-4 py-2 font-bold text-blue-600 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-300"
            >
              💳 Billing
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-lg font-bold text-gray-900">{user?.phone || "Not provided"}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-600 text-sm">Gender</p>
                <p className="text-lg font-bold text-gray-900">{user?.gender || "Not provided"}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-600 text-sm">Date of Birth</p>
                <p className="text-lg font-bold text-gray-900">{user?.dateOfBirth || "Not provided"}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-600 text-sm">Address</p>
                <p className="text-lg font-bold text-gray-900">{user?.address || "Not provided"}</p>
              </div>
            </div>
          )}

          {/* Profile Tab - Editable */}
          {activeTab === "profile" && (
            <div>
              {editMode ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName || ""}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName || ""}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                    <select
                      value={formData.gender || ""}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                    <textarea
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setEditMode(false);
                        setFormData(user || {});
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">First Name</p>
                      <p className="text-lg font-bold text-gray-900">{user?.firstName || "—"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Last Name</p>
                      <p className="text-lg font-bold text-gray-900">{user?.lastName || "—"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Phone</p>
                      <p className="text-lg font-bold text-gray-900">{user?.phone || "—"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Gender</p>
                      <p className="text-lg font-bold text-gray-900">{user?.gender || "—"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Date of Birth</p>
                      <p className="text-lg font-bold text-gray-900">{user?.dateOfBirth || "—"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Email</p>
                      <p className="text-lg font-bold text-gray-900">{user?.email || "—"}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg mb-6">
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="text-lg font-bold text-gray-900">{user?.address || "—"}</p>
                  </div>
                  <Button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setLocation("/shop")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-3xl mb-2">🛍️</div>
            <h3 className="font-bold text-lg text-gray-900">Shop Products</h3>
            <p className="text-gray-600 text-sm mt-1">Browse and order dairy products</p>
          </button>

          <button
            onClick={() => setLocation("/cart")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="font-bold text-lg text-gray-900">Your Cart</h3>
            <p className="text-gray-600 text-sm mt-1">View and manage your shopping cart</p>
          </button>

          <button
            onClick={() => setLocation("/orders")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-3xl mb-2">📦</div>
            <h3 className="font-bold text-lg text-gray-900">My Orders</h3>
            <p className="text-gray-600 text-sm mt-1">View your order history</p>
          </button>

          <button
            onClick={() => setLocation("/subscription")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-3xl mb-2">🥛</div>
            <h3 className="font-bold text-lg text-gray-900">Milk Subscription</h3>
            <p className="text-gray-600 text-sm mt-1">Daily milk delivery to your door</p>
          </button>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-bold text-lg text-gray-900">Support</h3>
            <p className="text-gray-600 text-sm mt-1">Call us at 1-800-DAIRY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
