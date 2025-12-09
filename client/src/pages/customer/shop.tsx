import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Plus, Filter } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CustomerLayout from "@/components/layout/customer-layout";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function CustomerShop() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
    retry: false,
  });

  const categories = [
    { value: "all", label: "All" },
    { value: "milk", label: "Milk" },
    { value: "paneer", label: "Paneer" },
    { value: "ghee", label: "Ghee" },
    { value: "butter", label: "Butter" },
    { value: "yogurt", label: "Yogurt" },
  ];

  const [, navigate] = useLocation();

  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Match by category or type field
    const matchesCategory = selectedCategory === "all" || 
      product.category === selectedCategory || 
      product.type === selectedCategory ||
      product.category?.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  }) || [];

  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity: 1,
        }];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--eco-primary)]"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-[var(--eco-primary)]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold eco-text">Dairy Products</h1>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--eco-text-muted)] w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 border border-[var(--eco-light)] rounded-xl"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.value
                    ? "eco-button"
                    : "bg-[var(--eco-light)] text-[var(--eco-text)]"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product: any) => (
            <Card 
              key={product.id} 
              className="eco-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardContent className="p-4">
                <img
                  src={product.imageUrl || getProductImage(product.category)}
                  alt={product.name}
                  className="w-full h-24 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold eco-text">{product.name}</h3>
                <p className="eco-text-muted text-sm mb-2">{product.unit}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[var(--eco-primary)]">
                    ₹{parseFloat(product.price).toFixed(0)}
                  </span>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-[var(--eco-secondary)] text-white hover:bg-[var(--eco-secondary)]/90 px-3 py-1 rounded-full text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="eco-text-muted">No products found matching your criteria</p>
          </div>
        )}

        {/* Special Offers */}
        <Card className="bg-gradient-to-r from-[var(--eco-accent)]/20 to-[var(--eco-secondary)]/20 border border-[var(--eco-accent)]/30">
          <CardContent className="p-6">
            <h3 className="font-semibold eco-text mb-2">🎉 Special Offer</h3>
            <p className="eco-text-muted text-sm mb-3">
              Buy any 3 products and get 20% off on your total order!
            </p>
            <Button className="bg-[var(--eco-accent)] text-white px-4 py-2 rounded-full text-sm hover:bg-[var(--eco-accent)]/90">
              Shop Now
            </Button>
          </CardContent>
        </Card>

        {/* Floating Cart */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-24 right-4 z-50">
            <Button className="bg-[var(--eco-primary)] text-white w-14 h-14 rounded-full shadow-lg relative">
              <div className="text-center">
                <div className="text-xs">₹{cartTotal.toFixed(0)}</div>
                <div className="text-xs">{cartItemCount} items</div>
              </div>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            </Button>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}

function getProductImage(category: string): string {
  const images = {
    paneer: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    ghee: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    butter: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    yogurt: "https://images.unsplash.com/photo-1571212515321-ee8f8b5fd3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
  };
  return images[category as keyof typeof images] || images.milk;
}
