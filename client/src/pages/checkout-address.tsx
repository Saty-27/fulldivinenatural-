import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface CartItem {
  id: number;
  quantity: number;
  product?: {
    name: string;
    price: number;
  };
}

interface User {
  id?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
}

export default function CheckoutAddressPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<User>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart items
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart_items"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/cart", { credentials: "include" });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.items || []);
      } catch {
        return [];
      }
    },
  });

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/auth/current-user", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum: number, item: any) => {
        const itemPrice = item.product?.price || 0;
        return sum + itemPrice * (item.quantity || 1);
      }, 0)
    : 0;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!userInfo.phone || !userInfo.address) {
      toast({
        title: "Error",
        description: "Please fill in phone and address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total: total,
          paymentMethod: paymentMethod,
          paymentStatus: "pending",
          userInfo: userInfo,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        toast({
          title: "✅ Order Placed Successfully!",
          description: `Order ID: ${order.id}`,
        });
        
        await fetch("/api/cart", { method: "DELETE", credentials: "include" });
        setTimeout(() => setLocation("/orders"), 1500);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
          <Button
            onClick={() => setLocation("/shop")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
                <Button
                  onClick={() => setEditMode(!editMode)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editMode ? "Done" : "Edit"}
                </Button>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={userInfo.firstName || ""}
                      onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={userInfo.lastName || ""}
                      onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userInfo.email || ""}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone * (Required)</label>
                    <input
                      type="tel"
                      value={userInfo.phone || ""}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address * (Required)</label>
                    <textarea
                      value={userInfo.address || ""}
                      onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter full delivery address with landmark"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-900 font-bold">{userInfo.firstName || "Name"} {userInfo.lastName || ""}</p>
                  <p className="text-gray-600">📧 {userInfo.email}</p>
                  <p className="text-gray-600">📱 {userInfo.phone || "No phone added"}</p>
                  <p className="text-gray-600">📍 {userInfo.address || "No address added"}</p>
                </div>
              )}
            </div>

            {/* Cart Items Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between pb-3 border-b border-gray-200">
                    <div>
                      <p className="font-bold text-gray-900">{item.product?.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ₹{(item.product?.price || 0) * (item.quantity || 1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{borderColor: paymentMethod === "cash" ? "#16a34a" : "#e5e7eb"}}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">💵 Cash on Delivery</p>
                    <p className="text-gray-600 text-sm">Pay when your order arrives</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{borderColor: paymentMethod === "razorpay" ? "#16a34a" : "#e5e7eb"}}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">💳 Online Payment (Razorpay)</p>
                    <p className="text-gray-600 text-sm">Secure online payment</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span className="text-green-600">₹{total.toFixed(2)}</span>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing || editMode || !userInfo.phone || !userInfo.address}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg disabled:bg-gray-400"
            >
              {isProcessing ? "Processing..." : "Place Order →"}
            </Button>
            {(!userInfo.phone || !userInfo.address) && (
              <p className="text-red-600 text-xs mt-4 text-center font-bold">
                Phone & Address required
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
