import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Pause, 
  Play, 
  Trash2, 
  ArrowLeft,
  Milk,
  Package,
  CreditCard,
  MapPin
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function SubscriptionManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: subscriptions } = useQuery({
    queryKey: ["/api/milk-subscription"],
    retry: false,
  });

  const [newSubscription, setNewSubscription] = useState({
    productType: "",
    quantity: 1,
    frequency: "daily",
    deliveryTime: "06:00",
    startDate: new Date().toISOString().split('T')[0]
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock API call
      return { id: Date.now(), ...data, status: "active" };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milk-subscription"] });
      setShowCreateForm(false);
      setNewSubscription({
        productType: "",
        quantity: 1,
        frequency: "daily",
        deliveryTime: "06:00",
        startDate: new Date().toISOString().split('T')[0]
      });
      toast({
        title: "Subscription Created",
        description: "Your new subscription has been set up successfully",
      });
    },
  });

  const toggleSubscriptionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: "pause" | "resume" | "cancel" }) => {
      // Mock API call
      return { id, action };
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/milk-subscription"] });
      toast({
        title: `Subscription ${action}d`,
        description: `Your subscription has been ${action}d successfully`,
      });
    },
  });

  const handleCreateSubscription = () => {
    createSubscriptionMutation.mutate(newSubscription);
  };

  const mockSubscriptions = [
    {
      id: 1,
      productType: "Toned Milk",
      quantity: 2,
      frequency: "daily",
      deliveryTime: "06:00",
      status: "active",
      nextDelivery: "2025-08-24",
      totalAmount: 60
    },
    {
      id: 2,
      productType: "Fresh Curd",
      quantity: 1,
      frequency: "alternate",
      deliveryTime: "18:00",
      status: "paused",
      nextDelivery: "2025-08-25",
      totalAmount: 25
    }
  ];

  const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === "active");
  const pausedSubscriptions = mockSubscriptions.filter(sub => sub.status === "paused");

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Link href="/home">
                <Button variant="ghost" size="icon" className="text-[var(--eco-primary)] flex-shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 flex-shrink-0">
                <img 
                  src={logoImage} 
                  alt="Divine Naturals Tree Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[hsl(var(--eco-secondary))] mb-1 truncate">
                  Subscription Management
                </h1>
                <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                  Manage your recurring deliveries
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="eco-button flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Subscription
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Milk className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-green-600">{activeSubscriptions.length}</div>
              <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Active Subscriptions</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-blue-600">
                {activeSubscriptions.reduce((sum, sub) => sum + sub.quantity, 0)}L
              </div>
              <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Daily Delivery</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-purple-600">
                ₹{activeSubscriptions.reduce((sum, sub) => sum + sub.totalAmount, 0)}
              </div>
              <div className="text-sm text-[hsl(var(--eco-text-muted))] font-semibold">Monthly Cost</div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Subscription Form */}
        {showCreateForm && (
          <Card className="border-2 border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-black text-[hsl(var(--eco-secondary))] flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Type</label>
                  <Select value={newSubscription.productType} onValueChange={(value) => 
                    setNewSubscription(prev => ({ ...prev, productType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toned-milk">Toned Milk (500ml)</SelectItem>
                      <SelectItem value="full-cream-milk">Full Cream Milk (500ml)</SelectItem>
                      <SelectItem value="fresh-curd">Fresh Curd (200g)</SelectItem>
                      <SelectItem value="pure-ghee">Pure Ghee (100ml)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newSubscription.quantity}
                    onChange={(e) => setNewSubscription(prev => ({ 
                      ...prev, 
                      quantity: parseInt(e.target.value) || 1 
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Frequency</label>
                  <Select value={newSubscription.frequency} onValueChange={(value) => 
                    setNewSubscription(prev => ({ ...prev, frequency: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="alternate">Alternate Days</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Time</label>
                  <Select value={newSubscription.deliveryTime} onValueChange={(value) => 
                    setNewSubscription(prev => ({ ...prev, deliveryTime: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                      <SelectItem value="19:00">7:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleCreateSubscription}
                  disabled={!newSubscription.productType || createSubscriptionMutation.isPending}
                  className="eco-button flex-1"
                >
                  {createSubscriptionMutation.isPending ? "Creating..." : "Create Subscription"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Subscriptions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[hsl(var(--eco-secondary))] flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Active Subscriptions
          </h2>
          
          {activeSubscriptions.map((subscription) => (
            <SubscriptionCard 
              key={subscription.id} 
              subscription={subscription}
              onToggle={(action) => toggleSubscriptionMutation.mutate({ 
                id: subscription.id, 
                action 
              })}
            />
          ))}
        </div>

        {/* Paused Subscriptions */}
        {pausedSubscriptions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[hsl(var(--eco-secondary))]">Paused Subscriptions</h2>
            
            {pausedSubscriptions.map((subscription) => (
              <SubscriptionCard 
                key={subscription.id} 
                subscription={subscription}
                onToggle={(action) => toggleSubscriptionMutation.mutate({ 
                  id: subscription.id, 
                  action 
                })}
              />
            ))}
          </div>
        )}

        {/* Auto-Payment Setup */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-800">Auto-Payment</h3>
                  <p className="text-sm text-orange-600">Automatic payment for subscriptions</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Calendar View Button */}
        <Card className="eco-card">
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-[hsl(var(--eco-primary))] mx-auto mb-3" />
            <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-2">Calendar View</h3>
            <p className="text-[hsl(var(--eco-text-muted))] text-sm mb-4">
              View all your upcoming deliveries in a calendar format
            </p>
            <Button className="eco-button-secondary">
              Open Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}

function SubscriptionCard({ subscription, onToggle }: { 
  subscription: any; 
  onToggle: (action: "pause" | "resume" | "cancel") => void;
}) {
  const isActive = subscription.status === "active";
  
  return (
    <Card className={`border-2 ${isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              isActive ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <div>
              <h3 className="font-bold text-[hsl(var(--eco-secondary))]">{subscription.productType}</h3>
              <p className="text-sm text-[hsl(var(--eco-text-muted))]">
                {subscription.quantity} units • {subscription.frequency}
              </p>
            </div>
          </div>
          <Badge className={isActive ? 'bg-green-500' : 'bg-gray-500'}>
            {subscription.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[hsl(var(--eco-text-muted))]" />
            <span className="text-sm">Delivery: {subscription.deliveryTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[hsl(var(--eco-text-muted))]" />
            <span className="text-sm">Next: {subscription.nextDelivery}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-[hsl(var(--eco-text-muted))]" />
            <span className="text-sm">₹{subscription.totalAmount}/month</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[hsl(var(--eco-text-muted))]" />
            <span className="text-sm">Home</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggle(isActive ? "pause" : "resume")}
            className="flex-1"
          >
            {isActive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isActive ? "Pause" : "Resume"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggle("cancel")}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}