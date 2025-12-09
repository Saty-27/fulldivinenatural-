import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface Delivery {
  id: number;
  deliveryDate: string;
  quantity: number;
  status: string;
  deliveredAt?: string;
}

export default function SubscriptionHistoryPage() {
  const { user, isLoading } = useAuth() as any;
  const [, setLocation] = useLocation();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDeliveryHistory();
    }
  }, [user]);

  const fetchDeliveryHistory = async () => {
    try {
      const res = await fetch("/api/subscriptions/me/history", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data.sort((a: any, b: any) => 
          new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
        ));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      DELIVERED: "bg-green-100 text-green-800",
      UPCOMING: "bg-blue-100 text-blue-800",
      SKIPPED: "bg-yellow-100 text-yellow-800",
      MISSED: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  if (isLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => setLocation("/subscription")} className="bg-gray-600 hover:bg-gray-700">
            ← Back to Subscription
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📋 Delivery History</h1>

          {deliveries.length > 0 ? (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {new Date(delivery.deliveryDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 text-sm">{delivery.quantity}L</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(delivery.status)}`}>
                    {delivery.status === "DELIVERED"
                      ? "✓ Delivered"
                      : delivery.status === "UPCOMING"
                      ? "📅 Upcoming"
                      : delivery.status === "SKIPPED"
                      ? "⏭️ Skipped"
                      : "❌ Missed"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No delivery history yet</p>
              <Button
                onClick={() => setLocation("/subscription")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Back to Subscription
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
