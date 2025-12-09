import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product?: {
    name: string;
    price: number;
    description: string;
  };
}

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  // Fetch cart items
  const { data: cartItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ["cart_items"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/cart", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        return Array.isArray(data) ? data : (data.items || []);
      } catch (err: any) {
        throw err;
      }
    },
  });

  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum: number, item: any) => {
        const itemPrice = item.product?.price || 0;
        return sum + itemPrice * (item.quantity || 1);
      }, 0)
    : 0;

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, { 
        method: "PATCH", 
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (res.ok) {
        refetch();
        toast({ title: "✅ Quantity updated" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        toast({ title: "✅ Item removed from cart" });
        refetch();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-bold">❌ Error Loading Cart:</p>
            <p className="text-sm mt-2">{(error as any).message || "Something went wrong"}</p>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="bg-blue-100 border-2 border-blue-500 text-blue-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-bold">⏳ Loading your cart...</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">🛒 Your Cart</h1>
            <p className="text-gray-600 mt-1">
              {cartItems.length} item(s) in your cart
            </p>
          </div>
          <Button
            onClick={() => setLocation("/shop")}
            variant="outline"
            className="px-6 py-2"
          >
            ← Continue Shopping
          </Button>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.product?.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.product?.description}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        ₹{item.product?.price} per unit
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(item.product?.price || 0) * (item.quantity || 1)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-600 text-sm">Quantity:</span>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                      <Button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.id) || item.quantity <= 1}
                        className="bg-gray-300 hover:bg-gray-400 text-black w-8 h-8 p-0"
                      >
                        −
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.id)}
                        className="bg-gray-300 hover:bg-gray-400 text-black w-8 h-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Remove Item
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
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
                onClick={() => setLocation("/checkout")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg"
              >
                Proceed to Checkout →
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 text-lg mb-6">
              Your cart is empty. Start shopping!
            </p>
            <Button
              onClick={() => setLocation("/shop")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold"
            >
              Go to Shop
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
