import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
}

export default function SubscriptionCreatePage() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    productId: 0,
    quantity: "1",
    frequency: "daily",
    deliveryTime: "6-7 AM",
    startDate: "",
  });

  useEffect(() => {
    if (user) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData((prev) => ({
        ...prev,
        startDate: tomorrow.toISOString().split("T")[0],
      }));
    }
  }, [user]);

  const { data: products = [] } = useQuery({
    queryKey: ["milk-products"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/products", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const milkProducts = data.filter((p: any) => p.category?.toLowerCase() === "milk" || p.name?.toLowerCase().includes("milk"));
          if (milkProducts.length === 0) return data;
          return milkProducts;
        }
        return [];
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });

  useEffect(() => {
    if (products.length > 0 && formData.productId === 0) {
      setFormData((prev) => ({ ...prev, productId: products[0].id }));
    }
  }, [products]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create subscription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      toast({ title: "✅ Subscription created successfully!" });
      setLocation("/subscription");
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const handleCreate = async () => {
    createMutation.mutate(formData);
  };

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const monthlyPrice = selectedProduct
    ? (parseFloat(selectedProduct.price) * parseFloat(formData.quantity) * 30).toFixed(2)
    : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => setLocation("/subscription")} className="bg-gray-600 hover:bg-gray-700">
            ← Back
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🥛 Create Milk Subscription</h1>
          <p className="text-gray-600 mb-6">Step {step} of 5</p>

          {/* Step 1: Choose Product */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Choose Your Product</h2>
              <div className="space-y-3 mb-6">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setFormData({ ...formData, productId: product.id })}
                    className={`w-full p-4 border-2 rounded-lg text-left ${
                      formData.productId === product.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <p className="font-bold">{product.name}</p>
                    <p className="text-gray-600">₹{product.price}/L</p>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                Next →
              </Button>
            </div>
          )}

          {/* Step 2: Quantity */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">How Much Milk Daily?</h2>
              <div className="space-y-3 mb-6">
                {["0.5", "1", "1.5", "2", "3"].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setFormData({ ...formData, quantity: qty })}
                    className={`w-full p-4 border-2 rounded-lg font-bold text-lg ${
                      formData.quantity === qty
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {qty}L
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} className="flex-1 bg-gray-400 hover:bg-gray-500">
                  ← Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Frequency */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Delivery Frequency</h2>
              <div className="space-y-3 mb-6">
                {["daily", "alternate", "weekly"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFormData({ ...formData, frequency: freq })}
                    className={`w-full p-4 border-2 rounded-lg font-bold capitalize ${
                      formData.frequency === freq
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {freq === "daily" ? "Daily (Every Day)" : freq === "alternate" ? "Alternate Days" : "Weekly"}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} className="flex-1 bg-gray-400 hover:bg-gray-500">
                  ← Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Time Slot */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Delivery Time Slot</h2>
              <div className="space-y-3 mb-6">
                {["6-7 AM", "7-8 AM", "8-9 AM", "9-10 AM"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setFormData({ ...formData, deliveryTime: time })}
                    className={`w-full p-4 border-2 rounded-lg font-bold ${
                      formData.deliveryTime === time
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setStep(3)} className="flex-1 bg-gray-400 hover:bg-gray-500">
                  ← Back
                </Button>
                <Button
                  onClick={() => setStep(5)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Review →
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Review Your Subscription</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Product</p>
                  <p className="font-bold">{selectedProduct?.name}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Quantity</p>
                  <p className="font-bold">{formData.quantity}L per day</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Frequency</p>
                  <p className="font-bold capitalize">{formData.frequency}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Time</p>
                  <p className="font-bold">{formData.deliveryTime}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg col-span-2">
                  <p className="text-gray-600 text-sm">Monthly Cost</p>
                  <p className="text-2xl font-bold text-yellow-600">₹{monthlyPrice}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setStep(4)} className="flex-1 bg-gray-400 hover:bg-gray-500">
                  ← Back
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                >
                  ✓ Create Subscription
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
