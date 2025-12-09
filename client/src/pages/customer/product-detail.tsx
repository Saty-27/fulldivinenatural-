import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import CustomerLayout from "@/components/layout/customer-layout";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    retry: false,
  }) as any;

  const product = (products as any[])?.find((p: any) => p.id === parseInt(params?.id || "0"));

  if (!product) {
    return (
      <CustomerLayout>
        <div className="p-4">
          <Link href="/shop">
            <Button variant="ghost" size="icon" className="text-[var(--eco-primary)]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center py-8">
            <p className="eco-text-muted">Product not found</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} x${quantity} added to your cart`,
    });
    setQuantity(1);
  };

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Link href="/shop">
            <Button variant="ghost" size="icon" className="text-[var(--eco-primary)]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold eco-text">Product Details</h1>
        </div>

        {/* Product Image */}
        <Card className="eco-card overflow-hidden">
          <CardContent className="p-0">
            <img
              src={product.imageUrl || getProductImage(product.category)}
              alt={product.name}
              className="w-full h-80 object-cover"
            />
          </CardContent>
        </Card>

        {/* Product Info */}
        <Card className="eco-card">
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-3xl font-bold eco-text mb-2">{product.name}</h2>
              <p className="eco-text-muted text-sm">{product.unit}</p>
            </div>

            <div className="border-t border-[var(--eco-light)] pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="eco-text">Price:</span>
                <span className="text-2xl font-bold text-[var(--eco-primary)]">
                  ₹{parseFloat(product.price).toFixed(0)}/{product.unit}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="eco-text">Stock:</span>
                <span className={product.stock > 0 ? "eco-text" : "text-red-600"}>
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </span>
              </div>
            </div>

            {product.description && (
              <div className="border-t border-[var(--eco-light)] pt-4">
                <h3 className="font-semibold eco-text mb-2">Description</h3>
                <p className="eco-text-muted text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-t border-[var(--eco-light)] pt-4">
              <div className="flex items-center space-x-4">
                <span className="eco-text">Quantity:</span>
                <div className="flex items-center border border-[var(--eco-light)] rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[var(--eco-primary)]"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[var(--eco-primary)]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-[var(--eco-primary)] hover:bg-[var(--eco-primary)]/90 text-white font-semibold py-4 rounded-xl text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add {quantity > 1 ? `${quantity}x` : ""} to Cart - ₹{(parseFloat(product.price) * quantity).toFixed(0)}
        </Button>

        {/* Back to Shop */}
        <Link href="/shop">
          <Button variant="outline" className="w-full rounded-xl border-[var(--eco-light)]">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </CustomerLayout>
  );
}

function getProductImage(category: string): string {
  const images = {
    paneer: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
    ghee: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
    butter: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
    yogurt: "https://images.unsplash.com/photo-1571212515321-ee8f8b5fd3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
    milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
    dairy: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
  };
  return images[category as keyof typeof images] || images.dairy;
}
