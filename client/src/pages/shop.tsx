import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearch } from "wouter";
import { useState, useEffect } from "react";
import SiteHeader from "@/components/landing/site-header";
import SiteFooter from "@/components/landing/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Grid, List, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  unit?: string;
}

export default function ShopPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const search = params.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchString]);

  const clearSearch = () => {
    setSearchQuery("");
    setLocation("/shop");
  };

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  // Filter products by category and search query
  const filteredProducts = products.filter((p: Product) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.ok) {
        toast({
          title: "Added to cart!",
          description: "Product added successfully",
        });
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.message || "Failed to add to cart",
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

  const isLoading = categoriesLoading || productsLoading;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="bg-gradient-to-r from-green-600 to-green-700 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Our Products</h1>
            <p className="text-green-100">Fresh dairy products delivered to your doorstep</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:hidden mb-4">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                <Card className="sticky top-20">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === null
                            ? "bg-green-100 text-green-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        All Products ({products.length})
                      </button>
                      {categories.map((category: Category) => {
                        const count = products.filter((p: Product) => p.category === category.name).length;
                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedCategory === category.name
                                ? "bg-green-100 text-green-700 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {category.name} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            <div className="flex-1">
              {searchQuery && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                  <span className="text-gray-600 text-sm">Search results for:</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    "{searchQuery}"
                    <button
                      onClick={clearSearch}
                      className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid" ? "bg-green-100 text-green-700" : "text-gray-400"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list" ? "bg-green-100 text-green-700" : "text-gray-400"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🥛</div>
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                </div>
              ) : productsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">Failed to load products. Please try again.</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
                }>
                  {filteredProducts.map((product: Product) => (
                    viewMode === "grid" ? (
                      <Card
                        key={product.id}
                        className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => setLocation(`/product/${product.id}`)}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-5xl">
                                🥛
                              </div>
                            )}
                            {product.stock <= 5 && product.stock > 0 && (
                              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Only {product.stock} left
                              </div>
                            )}
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-green-600 font-medium mb-1">{product.category}</p>
                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                              {product.description || "No description"}
                            </p>
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-green-600 font-bold text-xl">
                                ₹{parseFloat(String(product.price)).toFixed(0)}
                              </span>
                              {product.unit && (
                                <span className="text-gray-400 text-sm">/{product.unit}</span>
                              )}
                            </div>
                            <Button
                              onClick={(e) => handleAddToCart(e, product.id)}
                              disabled={product.stock === 0}
                              className={`w-full rounded-full ${
                                product.stock > 0
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-300 cursor-not-allowed"
                              }`}
                            >
                              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card
                        key={product.id}
                        className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setLocation(`/product/${product.id}`)}
                      >
                        <CardContent className="p-0">
                          <div className="flex">
                            <div className="w-32 h-32 flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-3xl">
                                  🥛
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-4 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-green-600 font-medium mb-1">{product.category}</p>
                                <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-1">
                                  {product.description || "No description"}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-green-600 font-bold text-xl">
                                  ₹{parseFloat(String(product.price)).toFixed(0)}
                                </span>
                                <Button
                                  onClick={(e) => handleAddToCart(e, product.id)}
                                  disabled={product.stock === 0}
                                  className={`rounded-full ${
                                    product.stock > 0
                                      ? "bg-green-600 hover:bg-green-700 text-white"
                                      : "bg-gray-300 cursor-not-allowed"
                                  }`}
                                >
                                  {product.stock > 0 ? "Add" : "Out"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📦</div>
                  <p className="text-gray-600 text-lg">
                    {selectedCategory
                      ? "No products in this category"
                      : "No products available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
