import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, CheckCircle, AlertCircle, DollarSign, LogOut } from "lucide-react";

export default function DeliveryDashboard() {
  const [, navigate] = useLocation();
  const partnerId = localStorage.getItem("deliveryPartnerId") || "1";

  // Fetch partner info to check profile completion
  const { data: partnerInfo } = useQuery({
    queryKey: [`/api/admin/delivery-partners/${partnerId}`],
    queryFn: async () => {
      const res = await fetch(`/api/admin/delivery-partners/${partnerId}`, { credentials: "include" });
      return res.ok ? res.json() : null;
    },
  });

  // Redirect to profile completion if not completed
  useEffect(() => {
    if (partnerInfo && !partnerInfo.profileCompleted) {
      navigate("/delivery/profile-completion");
    }
  }, [partnerInfo, navigate]);

  const { data: deliveries = [] } = useQuery({
    queryKey: [`/api/delivery/today/${partnerId}`],
    queryFn: async () => {
      const res = await fetch(`/api/delivery/today/${partnerId}`, { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const { data: earnings = {} } = useQuery({
    queryKey: [`/api/delivery/earnings/${partnerId}`],
    queryFn: async () => {
      const res = await fetch(`/api/delivery/earnings/${partnerId}`, { credentials: "include" });
      return res.ok ? res.json() : {};
    },
  });

  const stats = {
    total: deliveries.length,
    completed: deliveries.filter((d: any) => d.status === "delivered").length,
    pending: deliveries.filter((d: any) => d.status !== "delivered" && d.status !== "failed").length,
    failed: deliveries.filter((d: any) => d.status === "failed").length,
    codAmount: deliveries.reduce((sum: number, d: any) => sum + (Number(d.codAmount) || 0), 0),
  };

  const handleLogout = () => {
    localStorage.removeItem("deliveryPartnerId");
    navigate("/delivery/login");
  };

  // Show loading state while checking profile
  if (!partnerInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <Truck className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-bounce" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Redirect happens in useEffect, but show loading during redirect
  if (!partnerInfo.profileCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Redirecting to profile completion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Truck className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-emerald-900">Today's Route</h1>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard title="Total" value={stats.total} icon={<Package className="w-5 h-5" />} color="blue" />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <StatCard title="Pending" value={stats.pending} icon={<Truck className="w-5 h-5" />} color="orange" />
        <StatCard title="Failed" value={stats.failed} icon={<AlertCircle className="w-5 h-5" />} color="red" />
        <StatCard title="COD ₹" value={stats.codAmount} icon={<DollarSign className="w-5 h-5" />} color="purple" />
      </div>

      {/* Earnings */}
      <div className="max-w-4xl mx-auto mb-6">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">₹{earnings.todayEarnings || 0}</div>
            <p className="text-emerald-100 text-sm mt-2">{earnings.deliveriesCompleted} deliveries × ₹{earnings.perDelivery}</p>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries List */}
      <div className="max-w-4xl mx-auto space-y-3">
        <h2 className="text-lg font-bold text-gray-800">Deliveries</h2>
        {deliveries.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <Truck className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No deliveries assigned today</p>
          </Card>
        ) : (
          deliveries.map((delivery: any) => (
            <Card key={delivery.id} className="hover:shadow-lg transition">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{delivery.customer?.firstName || "Customer"}</h3>
                    <p className="text-sm text-gray-600">{delivery.address?.address || "Address pending"}</p>
                    <Badge className="mt-2" variant={delivery.status === "delivered" ? "default" : "secondary"}>
                      {delivery.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    {delivery.codAmount > 0 && (
                      <div className="text-lg font-bold text-emerald-600">₹{delivery.codAmount}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {delivery.status === "pending" && (
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Start
                    </Button>
                  )}
                  {delivery.status === "out_for_delivery" && (
                    <>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        Delivered
                      </Button>
                      <Button size="sm" variant="outline">
                        Failed
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    📍 Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    red: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  const colorClass = colorMap[color as string] || "bg-gray-50";

  return (
    <Card className={`border ${colorClass}`}>
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-2">{icon}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs font-semibold opacity-75">{title}</div>
      </CardContent>
    </Card>
  );
}
