import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, ArrowLeft, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CustomerLayout from "@/components/layout/customer-layout";

export default function CustomerMilk() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(2);
  const [frequency, setFrequency] = useState("daily");
  const [deliveryTime, setDeliveryTime] = useState("6:00 AM - 8:00 AM");

  const { data: milkSubscription, isLoading } = useQuery({
    queryKey: ["/api/milk-subscription"],
    retry: false,
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      if (milkSubscription) {
        return apiRequest("PATCH", `/api/milk-subscription/${milkSubscription.id}`, data);
      } else {
        return apiRequest("POST", "/api/milk-subscription", {
          ...data,
          startDate: new Date().toISOString().split('T')[0],
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milk-subscription"] });
      toast({
        title: "Success",
        description: "Milk subscription updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update milk subscription",
        variant: "destructive",
      });
    },
  });

  // Initialize form with existing subscription data
  useState(() => {
    if (milkSubscription) {
      setQuantity(milkSubscription.quantity || 2);
      setFrequency(milkSubscription.frequency || "daily");
      setDeliveryTime(milkSubscription.deliveryTime || "6:00 AM - 8:00 AM");
    }
  });

  const handleSave = () => {
    updateSubscriptionMutation.mutate({
      quantity,
      frequency,
      deliveryTime,
      isActive: true,
    });
  };

  const calculateMonthlyTotal = () => {
    const pricePerLiter = 30;
    const daysInMonth = 30;
    let deliveryDays = daysInMonth;
    
    if (frequency === "alternate") deliveryDays = 15;
    if (frequency === "weekly") deliveryDays = 4;
    
    return quantity * pricePerLiter * deliveryDays;
  };

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
          <h1 className="text-2xl font-bold eco-text">Schedule Milk</h1>
        </div>

        {/* Reminder Bar */}
        <Card className="bg-yellow-50 border border-yellow-200">
          <CardContent className="p-3 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">Order before 9 PM for next-day delivery</p>
          </CardContent>
        </Card>

        {/* Monthly Calendar Preview */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <h3 className="font-semibold eco-text mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Delivery Calendar</span>
            </h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-semibold eco-text-muted p-2">{day}</div>
              ))}
              
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={`p-2 rounded-lg ${
                  i === 1 ? "bg-[var(--eco-primary)] text-white" : 
                  frequency === "daily" && i > 1 && i < 6 ? "bg-[var(--eco-secondary)]/20" :
                  frequency === "alternate" && i % 2 === 1 ? "bg-[var(--eco-secondary)]/20" :
                  ""
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quantity Selection */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <h3 className="font-semibold eco-text mb-4">Daily Quantity</h3>
            <div className="flex items-center justify-between bg-[var(--eco-light)] rounded-xl p-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-[var(--eco-primary)] text-white border-0 hover:bg-[var(--eco-primary)]/90"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <span className="text-3xl font-bold eco-text">{quantity}</span>
                <p className="eco-text-muted text-sm">Liters</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="bg-[var(--eco-primary)] text-white border-0 hover:bg-[var(--eco-primary)]/90"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Frequency */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <h3 className="font-semibold eco-text mb-4">Delivery Frequency</h3>
            <div className="space-y-2">
              {[
                { value: "daily", label: "Daily" },
                { value: "alternate", label: "Alternate Days" },
                { value: "weekly", label: "Weekly" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    frequency === option.value
                      ? "bg-[var(--eco-primary)]/5 border border-[var(--eco-primary)]"
                      : "hover:bg-[var(--eco-light)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={frequency === option.value}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="text-[var(--eco-primary)]"
                  />
                  <span className="eco-text">{option.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Time */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <h3 className="font-semibold eco-text mb-4">Preferred Time</h3>
            <Select value={deliveryTime} onValueChange={setDeliveryTime}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6:00 AM - 8:00 AM">6:00 AM - 8:00 AM</SelectItem>
                <SelectItem value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</SelectItem>
                <SelectItem value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Billing Preview */}
        <Card className="eco-gradient text-white">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Monthly Preview</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80">Daily: {quantity}L × ₹30</p>
                <p className="text-white/80">Monthly (30 days)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₹{calculateMonthlyTotal().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={updateSubscriptionMutation.isPending}
          className="w-full eco-button py-4 text-lg"
        >
          {updateSubscriptionMutation.isPending ? "Updating..." : "Update Schedule"}
        </Button>
      </div>
    </CustomerLayout>
  );
}
