import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package } from 'lucide-react';
import { format } from 'date-fns';
import AdminLayout from '@/components/layout/admin-layout';

function StockHistoryContent() {
  const { data: movements = [], isLoading, error } = useQuery({
    queryKey: ["/api/admin/stock-movements"],
    retry: false,
  });

  const getReasonBadge = (reason: string) => {
    const reasonMap: { [key: string]: { color: string; label: string } } = {
      'ADMIN_ADJUST': { color: 'bg-blue-100 text-blue-800', label: '🔧 Admin Adjust' },
      'ORDER_PLACED': { color: 'bg-red-100 text-red-800', label: '📦 Order Placed' },
      'ORDER_CANCELLED': { color: 'bg-green-100 text-green-800', label: '↩️ Order Cancelled' },
      'RETURN': { color: 'bg-orange-100 text-orange-800', label: '🔄 Return' },
      'RESTOCK': { color: 'bg-purple-100 text-purple-800', label: '📥 Restock' },
    };
    const config = reasonMap[reason] || { color: 'bg-gray-100 text-gray-800', label: reason };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === 'IN' 
      ? <Badge className="bg-green-100 text-green-800">📈 IN</Badge>
      : <Badge className="bg-red-100 text-red-800">📉 OUT</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--eco-secondary))]">📊 Stock Movement History</h1>
          <p className="text-[hsl(var(--eco-text-muted))] font-semibold">Track all stock adjustments and changes</p>
        </div>
      </div>

      <Card className="eco-card">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardTitle className="text-[hsl(var(--eco-secondary))] flex items-center">
            <BarChart3 className="w-6 h-6 mr-3" />
            All Stock Movements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3 animate-pulse" />
              <p className="text-gray-500">Loading stock movements...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">❌ Failed to load stock movements</p>
            </div>
          ) : Array.isArray(movements) && movements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Product</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Reason</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Quantity</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Previous → New Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement: any) => (
                    <tr key={movement.id} className="border-b hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700">
                        {format(new Date(movement.createdAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">Product ID: {movement.productId}</td>
                      <td className="px-4 py-3">{getTypeBadge(movement.type)}</td>
                      <td className="px-4 py-3">{getReasonBadge(movement.reason)}</td>
                      <td className="px-4 py-3 text-right font-bold">
                        <span className={movement.type === 'IN' ? 'text-green-600' : 'text-red-600'}>
                          {movement.type === 'IN' ? '+' : ''}{movement.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-600">{movement.previousStock}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className="text-gray-600 font-bold">{movement.newStock}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No stock movements recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="eco-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{movements.length}</p>
              <p className="text-gray-600 font-semibold mt-2">Total Movements</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="eco-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{movements.filter((m: any) => m.type === 'IN').length}</p>
              <p className="text-gray-600 font-semibold mt-2">Stock IN</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="eco-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{movements.filter((m: any) => m.type === 'OUT').length}</p>
              <p className="text-gray-600 font-semibold mt-2">Stock OUT</p>
            </div>
          </CardContent>
        </Card>

        <Card className="eco-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{new Set(movements.map((m: any) => m.productId)).size}</p>
              <p className="text-gray-600 font-semibold mt-2">Products</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function StockHistoryPage() {
  return (
    <AdminLayout>
      <StockHistoryContent />
    </AdminLayout>
  );
}
