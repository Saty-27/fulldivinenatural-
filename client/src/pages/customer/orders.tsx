import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Phone, 
  Download, 
  ArrowLeft,
  Search,
  Star,
  Clock,
  Truck,
  Package,
  FileText,
  Heart,
  MessageCircle,
  RefreshCw,
  Filter
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function CustomerOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const allOrders = Array.isArray(orders) ? orders : [];

  const activeOrders = allOrders.filter((order: any) => 
    ["pending", "confirmed", "preparing", "out_for_delivery"].includes(order.status)
  );

  const pastOrders = allOrders.filter((order: any) => 
    ["delivered", "cancelled"].includes(order.status)
  );

  const filteredOrders = (activeTab === "active" ? activeOrders : pastOrders).filter((order: any) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const reorderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return orderId;
    },
    onSuccess: () => {
      toast({
        title: "Items added to cart!",
        description: "Your previous order items have been added to cart",
      });
    },
  });

  const rateOrderMutation = useMutation({
    mutationFn: async ({ orderId, rating, feedback }: { orderId: string; rating: number; feedback: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { orderId, rating, feedback };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Rating submitted!",
        description: "Thank you for your feedback",
      });
    },
  });

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
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex items-center space-x-4">
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
                My Orders
              </h1>
              <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                Track and manage your orders
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-blue-600">{activeOrders.length}</div>
              <div className="text-sm text-blue-700 font-semibold">Active Orders</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-green-600">{pastOrders.length}</div>
              <div className="text-sm text-green-700 font-semibold">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-purple-600">4.8</div>
              <div className="text-sm text-purple-700 font-semibold">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--eco-text-muted)] w-4 h-4" />
            <Input
              placeholder="Search by order ID or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="active" className="rounded-lg font-semibold">
              <Truck className="w-4 h-4 mr-2" />
              Active ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg font-semibold">
              <Package className="w-4 h-4 mr-2" />
              Past Orders ({pastOrders.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Orders Tab */}
          <TabsContent value="active" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order: any) => (
                <EnhancedOrderCard 
                  key={order.id} 
                  order={order} 
                  isActive={true}
                  onReorder={(orderId) => reorderMutation.mutate(orderId)}
                  onRate={(orderId, rating, feedback) => rateOrderMutation.mutate({ orderId, rating, feedback })}
                />
              ))
            ) : (
              <Card className="eco-card">
                <CardContent className="p-12 text-center">
                  <Truck className="w-16 h-16 text-[hsl(var(--eco-text-muted))] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">No active orders</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] mb-6">You don't have any orders in progress</p>
                  <Link href="/shop">
                    <Button className="eco-button">Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Past Orders Tab */}
          <TabsContent value="past" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order: any) => (
                <EnhancedOrderCard 
                  key={order.id} 
                  order={order} 
                  isActive={false}
                  onReorder={(orderId) => reorderMutation.mutate(orderId)}
                  onRate={(orderId, rating, feedback) => rateOrderMutation.mutate({ orderId, rating, feedback })}
                />
              ))
            ) : (
              <Card className="eco-card">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-[hsl(var(--eco-text-muted))] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">No past orders</h3>
                  <p className="text-[hsl(var(--eco-text-muted))]">Your order history will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </CustomerLayout>
  );
}

function EnhancedOrderCard({ 
  order, 
  isActive, 
  onReorder, 
  onRate 
}: { 
  order: any; 
  isActive: boolean;
  onReorder: (orderId: string) => void;
  onRate: (orderId: string, rating: number, feedback: string) => void;
}) {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(order.rating || 0);
  const [feedback, setFeedback] = useState(order.feedback || "");
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "preparing": return "bg-orange-100 text-orange-800";
      case "out_for_delivery": return "bg-[var(--eco-accent)]/20 text-[var(--eco-accent)]";
      case "delivered": return "bg-green-100 text-green-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "confirmed": return "Confirmed";
      case "preparing": return "Preparing";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const submitRating = () => {
    onRate(order.id, rating, feedback);
    setShowRating(false);
  };

  return (
    <Card className={`eco-card ${isActive ? "border-l-4 border-[var(--eco-accent)]" : ""}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-[hsl(var(--eco-secondary))]">Order {order.id}</h3>
            <p className="text-[hsl(var(--eco-text-muted))] text-sm">
              Placed on {formatDate(order.createdAt)}
            </p>
            {isActive && order.estimatedTime && (
              <p className="text-sm text-blue-600 font-semibold">
                ETA: {order.estimatedTime}
              </p>
            )}
          </div>
          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>

        {/* Order Items */}
        <div className="space-y-3 mb-4">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-semibold text-[hsl(var(--eco-secondary))] text-sm">{item.name}</p>
                <p className="text-xs text-[hsl(var(--eco-text-muted))]">
                  {item.quantity} × {item.unit} • ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Information */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Delivery Details</span>
          </div>
          <p className="text-sm text-blue-700">{order.address}</p>
          <p className="text-sm text-blue-600">
            {order.deliveryTime} • {formatDate(order.deliveryDate)}
          </p>
          {order.deliveryPartner && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200">
              <div>
                <p className="text-sm font-semibold text-blue-800">{order.deliveryPartner.name}</p>
                <p className="text-xs text-blue-600">{order.deliveryPartner.vehicle}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-blue-700">{order.deliveryPartner.rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Tracker for Active Orders */}
        {isActive && (
          <div className="flex items-center space-x-2 mb-4">
            <ProgressStep 
              isCompleted={["confirmed", "preparing", "out_for_delivery", "delivered"].includes(order.status)}
              label="Confirmed"
            />
            <div className={`flex-1 h-1 ${
              ["preparing", "out_for_delivery", "delivered"].includes(order.status) 
                ? "bg-[var(--eco-primary)]" 
                : "bg-[var(--eco-light)]"
            }`} />
            <ProgressStep 
              isCompleted={["out_for_delivery", "delivered"].includes(order.status)}
              label="Out for Delivery"
            />
            <div className={`flex-1 h-1 ${
              order.status === "delivered" 
                ? "bg-[var(--eco-primary)]" 
                : "bg-[var(--eco-light)]"
            }`} />
            <ProgressStep 
              isCompleted={order.status === "delivered"}
              label="Delivered"
            />
          </div>
        )}

        {/* Order Total */}
        <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-lg">
          <span className="font-semibold text-green-800">Total Amount</span>
          <span className="text-lg font-bold text-green-600">₹{parseFloat(order.totalAmount).toFixed(0)}</span>
        </div>

        {/* Rating Section for Delivered Orders */}
        {!isActive && order.status === "delivered" && !order.rating && (
          <div className="mb-4">
            {!showRating ? (
              <Button
                variant="outline"
                onClick={() => setShowRating(true)}
                className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50"
              >
                <Star className="w-4 h-4 mr-2" />
                Rate this order
              </Button>
            ) : (
              <div className="space-y-3 p-3 bg-yellow-50 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`w-8 h-8 ${
                          star <= rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Feedback (Optional)</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={submitRating} className="flex-1 bg-yellow-600 text-white hover:bg-yellow-700">
                    Submit Rating
                  </Button>
                  <Button variant="outline" onClick={() => setShowRating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show existing rating */}
        {order.rating && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-semibold text-green-800">Your Rating:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${
                      star <= order.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                    }`} 
                  />
                ))}
              </div>
            </div>
            {order.feedback && (
              <p className="text-sm text-green-700">"{order.feedback}"</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isActive ? (
            <>
              <Button className="flex-1 eco-button py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Live Track
              </Button>
              <Button variant="outline" className="flex-1 py-2">
                <Phone className="w-4 h-4 mr-2" />
                Call Partner
              </Button>
              <Button variant="outline" className="px-3 py-2">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1 py-2">
                <Download className="w-4 h-4 mr-2" />
                Invoice
              </Button>
              <Button 
                onClick={() => onReorder(order.id)}
                className="flex-1 eco-button py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reorder
              </Button>
              <Button variant="outline" className="px-3 py-2">
                <Heart className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressStep({ isCompleted, label }: { isCompleted: boolean; label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-4 h-4 rounded-full ${
        isCompleted ? "bg-[var(--eco-primary)]" : "bg-[var(--eco-light)]"
      }`} />
      <span className="text-sm eco-text-muted">{label}</span>
    </div>
  );
}
