import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MapPin, Truck, Calendar, ShoppingBag, Tag } from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";

export default function CustomerHome() {
  const { user } = useAuth();
  
  const { data: milkSubscription } = useQuery({
    queryKey: ["/api/milk-subscription"],
    retry: false,
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    retry: false,
  });

  const unreadNotifications = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead) : [];
  const nextDelivery = Array.isArray(recentOrders) && recentOrders.length > 0 ? recentOrders[0] : null;

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent"></div>
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-6 bg-amber-700 rounded-sm relative">
                    <div className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 bg-green-300 rounded-full"></div>
                    <div className="absolute -top-1 left-0.5 w-3 h-3 bg-green-400 rounded-full opacity-90"></div>
                    <div className="absolute -top-0.5 right-0 w-2.5 h-2.5 bg-green-200 rounded-full"></div>
                    <div className="absolute -top-2 left-1.5 w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black text-[hsl(var(--eco-secondary))] mb-1 truncate">
                  Divine Naturals
                </h1>
                <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                  Customer Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="relative">
                <Bell className="w-5 h-5 text-[hsl(var(--eco-secondary))]" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center text-white">
                    {unreadNotifications.length}
                  </span>
                )}
              </div>
              <img 
                src={user && (user as any).profileImageUrl ? (user as any).profileImageUrl : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border-2 border-[hsl(var(--eco-accent))]"
              />
            </div>
          </div>
          <div className="eco-gradient p-4 text-white rounded-xl">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[hsl(var(--eco-accent))]" />
              <div>
                <p className="text-sm opacity-90">Delivering to</p>
                <p className="font-semibold">
                  {user && (user as any).address ? (user as any).address : "Koramangala, Bangalore"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="eco-gradient-light rounded-2xl p-4">
          <h1 className="text-2xl font-bold eco-text mb-1">
            Hi {user && (user as any).firstName ? (user as any).firstName : "there"} 👋
          </h1>
          <p className="eco-text-muted">Fresh dairy delivered to your doorstep</p>
        </div>

        {/* Upcoming Delivery Alert */}
        {nextDelivery && (
          <Card className="bg-[var(--eco-accent)]/10 border border-[var(--eco-accent)]/30">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="bg-[var(--eco-accent)]/20 p-2 rounded-full">
                <Truck className="w-5 h-5 text-[var(--eco-accent)]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold eco-text">Upcoming Delivery</p>
                <p className="text-sm eco-text-muted">
                  {(milkSubscription as any)?.quantity || 2}L milk arriving tomorrow at{" "}
                  {(milkSubscription as any)?.deliveryTime || "6:00 AM"}
                </p>
              </div>
              <Button variant="ghost" className="text-[var(--eco-accent)]">
                Track
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Action Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold eco-text">Quick Actions</h2>
          
          <Link href="/milk">
            <Card className="eco-card hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-[var(--eco-primary)]/10 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-[var(--eco-primary)]" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold eco-text text-lg">Schedule Milk</h3>
                  <p className="eco-text-muted text-sm">Set your daily milk delivery</p>
                </div>
                <div className="text-[var(--eco-primary)]">→</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shop">
            <Card className="eco-card hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-[var(--eco-secondary)]/20 p-3 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-[var(--eco-secondary)]" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold eco-text text-lg">Browse Dairy Products</h3>
                  <p className="eco-text-muted text-sm">Fresh cheese, butter & more</p>
                </div>
                <div className="text-[var(--eco-secondary)]">→</div>
              </CardContent>
            </Card>
          </Link>

          <Card className="eco-card hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-[var(--eco-accent)]/20 p-3 rounded-xl">
                <Tag className="w-6 h-6 text-[var(--eco-accent)]" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold eco-text text-lg">View Offers</h3>
                <p className="eco-text-muted text-sm">Special deals & discounts</p>
              </div>
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                20% OFF
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farm Fresh Section */}
        <Card className="bg-gradient-to-br from-[var(--eco-secondary)]/10 to-[var(--eco-primary)]/5 border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 text-[var(--eco-primary)]">🌱</div>
              <h3 className="font-semibold eco-text">Farm Fresh Promise</h3>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
              alt="Farm fresh dairy" 
              className="w-full h-32 object-cover rounded-xl mb-3"
            />
            <p className="eco-text-muted text-sm">
              Sourced directly from local organic farms. Delivered within 24 hours of milking.
            </p>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
