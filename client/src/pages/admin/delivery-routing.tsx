import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Package, ArrowRight, CheckCircle } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function DeliveryRoutingPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchPartners();
    fetchOrders();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/admin/delivery-partners", { credentials: "include" });
      const data = await res.json();
      setPartners(data.filter((p: any) => p.status === "active"));
      setLoadingPartners(false);
    } catch (err) {
      console.error("Failed to fetch partners:", err);
      setLoadingPartners(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { credentials: "include" });
      const data = await res.json();
      setOrders(data.filter((o: any) => o.status === "PLACED" && !o.deliveryPartnerId));
      setLoadingOrders(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setLoadingOrders(false);
    }
  };

  const assignOrder = async (orderId: number, partnerId: number) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ deliveryPartnerId: partnerId }),
      });

      if (res.ok) {
        setAssignments([...assignments, { orderId, partnerId }]);
        setOrders(orders.filter(o => o.id !== orderId));
      }
    } catch (err) {
      console.error("Failed to assign order:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-green-600" />
            Delivery Routing
          </h1>
          <p className="text-gray-600 mt-1">Assign orders to delivery partners and manage routes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Delivery Partners */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                Active Delivery Partners ({partners.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPartners ? (
                <p className="text-gray-500 text-sm">Loading partners...</p>
              ) : partners.length === 0 ? (
                <p className="text-gray-500 text-sm">No active partners available</p>
              ) : (
                <div className="space-y-2">
                  {partners.map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPartner(p)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPartner?.id === p.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-300"
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900">{p.fullName}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {p.zone || "Unassigned"}
                      </div>
                      <Badge className="mt-2 text-xs bg-green-100 text-green-800">{p.vehicleType}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unassigned Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Pending Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <p className="text-gray-500 text-sm">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2 opacity-50" />
                  <p className="text-gray-500 text-sm">All orders assigned!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map((order: any) => (
                    <div key={order.id} className="p-3 rounded-lg border border-gray-200 bg-white">
                      <div className="font-medium text-sm text-gray-900">Order #{order.id}</div>
                      <div className="text-xs text-gray-600 mt-1">{order.deliveryAddress}</div>
                      <div className="text-xs text-gray-600 mt-1">₹{order.totalAmount}</div>
                      {selectedPartner && (
                        <Button
                          size="sm"
                          className="w-full mt-3 bg-green-600 hover:bg-green-700"
                          onClick={() => assignOrder(order.id, selectedPartner.id)}
                        >
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Assign to {selectedPartner.fullName}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assignments Summary */}
        {assignments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Today's Assignments ({assignments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assignments.map((a: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-900">
                        Order #{a.orderId} assigned to Partner #{a.partnerId}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
