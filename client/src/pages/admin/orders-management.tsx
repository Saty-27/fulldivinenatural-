import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: number;
  userId: string;
  totalAmount: string;
  status: string;
  paymentStatus: string;
  deliveryDate: string;
  deliveryAddress: string;
  createdAt: string;
}

export default function OrdersManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const url = statusFilter ? `/api/admin-orders?status=${statusFilter}` : "/api/admin-orders";
      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      toast({ title: "Error fetching orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`/api/admin-orders/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (res.ok) {
        toast({ title: "✅ Order updated" });
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const statuses = ["PLACED", "PREPARING", "OUT", "DELIVERED", "FAILED"];
  const paymentStatuses = ["pending", "paid", "failed"];

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">📦 Order Management</h2>
        
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2 rounded ${!statusFilter ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Order ID</th>
                <th className="px-4 py-3 text-left font-bold">Amount</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-left font-bold">Payment</th>
                <th className="px-4 py-3 text-left font-bold">Delivery Date</th>
                <th className="px-4 py-3 text-left font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">#{order.id}</td>
                  <td className="px-4 py-3">₹{order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded text-sm font-bold ${
                      order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                      order.status === "OUT" ? "bg-blue-100 text-blue-800" :
                      order.status === "FAILED" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded text-sm font-bold ${
                      order.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
                      order.paymentStatus === "failed" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Update Order #{selectedOrder.id}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-bold mb-2">Status</label>
              <select
                defaultValue={selectedOrder.status}
                onChange={(e) => {
                  const status = e.target.value;
                  updateOrderStatus(selectedOrder.id, status, selectedOrder.paymentStatus);
                }}
                className="w-full border rounded p-2"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold mb-2">Payment Status</label>
              <select
                defaultValue={selectedOrder.paymentStatus}
                onChange={(e) => {
                  const paymentStatus = e.target.value;
                  updateOrderStatus(selectedOrder.id, selectedOrder.status, paymentStatus);
                }}
                className="w-full border rounded p-2"
              >
                {paymentStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={() => setSelectedOrder(null)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
