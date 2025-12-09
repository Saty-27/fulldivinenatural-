import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: number;
  userId: string;
  quantity: number;
  frequency: string;
  deliveryTime: string;
  status: string;
  startDate: string;
  customer?: any;
  product?: any;
}

export default function SubscriptionsManagement() {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [dailyRequirement, setDailyRequirement] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
    fetchDailyRequirement();
    const interval = setInterval(fetchDailyRequirement, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/admin-subscriptions", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (error) {
      toast({ title: "Error fetching subscriptions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyRequirement = async () => {
    try {
      const res = await fetch("/api/admin-subscriptions/today/requirement", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setDailyRequirement(data.totalRequired);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateStatus = async (subId: number, status: string) => {
    try {
      const res = await fetch(`/api/admin-subscriptions/${subId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast({ title: "✅ Subscription updated" });
        fetchSubscriptions();
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const activeCount = subscriptions.filter((s) => s.status === "ACTIVE").length;
  const pausedCount = subscriptions.filter((s) => s.status === "PAUSED").length;

  if (loading) return <div>Loading subscriptions...</div>;

  return (
    <div className="space-y-6">
      {/* Daily Requirement Card */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Today's Milk Required</p>
          <p className="text-3xl font-bold text-green-600">{dailyRequirement}L</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Active Subscriptions</p>
          <p className="text-3xl font-bold text-blue-600">{activeCount}</p>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Paused Subscriptions</p>
          <p className="text-3xl font-bold text-yellow-600">{pausedCount}</p>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Customer</th>
              <th className="px-4 py-3 text-left font-bold">Product</th>
              <th className="px-4 py-3 text-left font-bold">Quantity</th>
              <th className="px-4 py-3 text-left font-bold">Frequency</th>
              <th className="px-4 py-3 text-left font-bold">Time</th>
              <th className="px-4 py-3 text-left font-bold">Status</th>
              <th className="px-4 py-3 text-left font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{sub.customer?.firstName} {sub.customer?.lastName}</td>
                <td className="px-4 py-3">{sub.product?.name}</td>
                <td className="px-4 py-3">{sub.quantity}L</td>
                <td className="px-4 py-3 capitalize">{sub.frequency}</td>
                <td className="px-4 py-3">{sub.deliveryTime}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-sm font-bold ${
                    sub.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                    sub.status === "PAUSED" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {sub.status === "ACTIVE" ? (
                    <Button
                      onClick={() => updateStatus(sub.id, "PAUSED")}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={() => updateStatus(sub.id, "ACTIVE")}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      Resume
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
