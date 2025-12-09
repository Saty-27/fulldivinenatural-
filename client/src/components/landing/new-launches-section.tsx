import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function NewLaunchesSection() {
  const { toast } = useToast();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const newProducts = products.slice(0, 4);

  const handleAddToCart = async (product: any) => {
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (res.ok) {
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-green-800 to-green-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Newly Launched</h2>
          <p className="text-green-100 max-w-2xl mx-auto">
            Discover our latest additions to the Divine Naturals family
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
          {newProducts.map((product: any) => (
            <Card
              key={product.id}
              className="flex-shrink-0 w-72 md:w-auto bg-white border-0 shadow-lg overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.imageUrl || "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-1">{product.description}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-green-600 font-bold text-lg">
                      ₹{parseFloat(product.price).toFixed(0)}
                    </span>
                    <span className="text-gray-400 text-sm">/{product.unit}</span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
