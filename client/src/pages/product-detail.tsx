import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        return products.find((p: Product) => p.id === parseInt(productId));
      } catch {
        return null;
      }
    },
    enabled: !!productId,
  });

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      console.log("📌 Adding to cart:", { productId: product.id, quantity });
      const res = await fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      console.log("Add to cart response:", res.status, res.statusText);
      const data = await res.json();
      console.log("Add to cart data:", data);

      if (res.ok) {
        toast({
          title: "✅ Added to cart!",
          description: `${product.name} added successfully`,
        });
        setQuantity(1);
      } else {
        toast({
          title: "❌ Error",
          description: data.message || "Failed to add to cart",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (res.ok) {
        setLocation("/checkout");
      } else {
        toast({
          title: "Error",
          description: "Failed to add to cart",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🥛</div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
          <Button onClick={() => setLocation("/shop")}>← Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => setLocation("/shop")}
            variant="outline"
            className="mb-4"
          >
            ← Back to Shop
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-96">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <div className="text-8xl mb-4">🥛</div>
                <p className="text-gray-600">No image available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-500 font-semibold mb-2">
                {product.category.toUpperCase()}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-4xl font-bold text-green-600">₹{product.price}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Stock Available
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p
                  className={`font-bold text-sm ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock} units
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1))
                      )
                    }
                    className="w-16 px-3 py-2 border border-gray-300 rounded text-center"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg"
              >
                🛒 Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg"
              >
                💳 Buy Now
              </Button>
            </div>

            {product.stock === 0 && (
              <p className="text-center text-red-600 font-bold mt-4">
                Out of Stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
