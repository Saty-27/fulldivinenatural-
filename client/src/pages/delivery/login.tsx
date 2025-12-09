import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Truck, User, Lock, AlertCircle } from "lucide-react";

export default function DeliveryLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/delivery/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("deliveryPartnerId", data.id);
        // If profile not completed, redirect to profile completion page
        if (!data.profileCompleted) {
          navigate("/delivery/profile-completion");
        } else {
          navigate("/delivery/dashboard");
        }
      } else {
        const errData = await res.json();
        setError(errData.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && username && password && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <Card className="w-full max-w-md shadow-2xl border-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-white">
            Delivery Hub
          </h1>
          <p className="text-center text-emerald-50 text-sm mt-2">
            Partner Login Portal
          </p>
        </div>

        <div className="px-6 py-8 space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              <User className="w-4 h-4 inline mr-2" />
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Start Delivery
              </span>
            )}
          </Button>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
            <p className="text-xs text-blue-900 leading-relaxed">
              <span className="font-semibold">Need Help?</span> Contact your admin to get your login credentials (username and password).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            Divine Naturals • <span className="font-semibold text-emerald-600">Pure. Fresh. Daily.</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
