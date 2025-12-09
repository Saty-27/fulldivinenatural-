import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Store, TrendingUp, Users, Plus, Search, Filter, Eye, MoreHorizontal, MapPin, Clock, Star, Phone, Mail } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Hook to fetch real vendor data
function useVendors() {
  return useQuery({
    queryKey: ["admin-vendors"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vendors", { 
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const error = await res.json();
        if (res.status === 403) {
          throw new Error("You don't have admin access. Please contact your administrator.");
        }
        throw new Error(error.message || "Failed to fetch vendors");
      }
      return res.json();
    },
    retry: 2,
  });
}

const mockVendorData = [
  { id: "VEN-001", name: "Nandini Dairy Farm", status: "Active", revenue: 45000, supply: 98, rating: 4.8, location: "Bangalore North", contact: "+91 98765 43210", email: "contact@nandinidairy.com", joinedDate: "2023-01-15", capacity: "2000L", lastDelivery: "2025-08-22" },
  { id: "VEN-002", name: "Amul Cooperative", status: "Active", revenue: 38500, supply: 95, rating: 4.6, location: "Bangalore East", contact: "+91 98765 43211", email: "info@amul.coop", joinedDate: "2023-02-20", capacity: "1800L", lastDelivery: "2025-08-22" },
  { id: "VEN-003", name: "Mother Dairy Hub", status: "Inactive", revenue: 0, supply: 0, rating: 4.2, location: "Bangalore South", contact: "+91 98765 43212", email: "support@motherdairy.in", joinedDate: "2023-03-10", capacity: "1500L", lastDelivery: "2025-08-15" },
  { id: "VEN-004", name: "Heritage Foods", status: "Active", revenue: 52000, supply: 99, rating: 4.9, location: "Bangalore West", contact: "+91 98765 43213", email: "orders@heritage.com", joinedDate: "2023-01-05", capacity: "2200L", lastDelivery: "2025-08-22" },
  { id: "VEN-005", name: "Fresh Valley Dairy", status: "Active", revenue: 41200, supply: 92, rating: 4.5, location: "Whitefield", contact: "+91 98765 43214", email: "hello@freshvalley.in", joinedDate: "2023-04-12", capacity: "1600L", lastDelivery: "2025-08-21" },
  { id: "VEN-006", name: "Green Pastures Co", status: "Active", revenue: 35800, supply: 88, rating: 4.3, location: "Electronic City", contact: "+91 98765 43215", email: "care@greenpastures.co", joinedDate: "2023-05-18", capacity: "1400L", lastDelivery: "2025-08-22" },
];

const revenueData = [
  { month: 'Jan', nandini: 42000, amul: 38000, heritage: 48000 },
  { month: 'Feb', nandini: 45000, amul: 35000, heritage: 52000 },
  { month: 'Mar', nandini: 41000, amul: 42000, heritage: 49000 },
  { month: 'Apr', nandini: 48000, amul: 40000, heritage: 55000 },
  { month: 'May', nandini: 52000, amul: 38000, heritage: 58000 },
  { month: 'Jun', nandini: 49000, amul: 41000, heritage: 53000 },
];

const supplyData = [
  { name: 'On Time', value: 85, color: '#10B981' },
  { name: 'Delayed', value: 12, color: '#F59E0B' },
  { name: 'Cancelled', value: 3, color: '#EF4444' },
];

const vendorColumns = [
  {
    accessorKey: 'id',
    header: 'Vendor ID',
    cell: ({ row }: any) => (
      <div className="font-mono text-sm text-blue-600">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Vendor Name',
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{row.getValue('name')}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {row.original.location}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    cell: ({ row }: any) => (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center text-xs text-gray-600">
          <Phone className="w-3 h-3 mr-1" />
          {row.getValue('contact')}
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Mail className="w-3 h-3 mr-1" />
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'revenue',
    header: 'Monthly Revenue',
    cell: ({ row }: any) => (
      <div className="text-sm font-semibold text-green-600">
        ₹{row.getValue('revenue')?.toLocaleString() || '0'}
      </div>
    ),
  },
  {
    accessorKey: 'supply',
    header: 'Supply Rate',
    cell: ({ row }: any) => {
      const supply = row.getValue('supply') as number;
      const color = supply >= 95 ? 'text-green-600' : supply >= 85 ? 'text-yellow-600' : 'text-red-600';
      return <div className={`text-sm font-medium ${color}`}>{supply}%</div>;
    },
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }: any) => (
      <div className="flex items-center text-sm">
        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
        {row.getValue('rating')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      return (
        <Badge 
          className={`${status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'} border`}
          data-testid={`status-${status}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          data-testid={`view-vendor-${row.original.id}`}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-50"
          data-testid={`vendor-menu-${row.original.id}`}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    ),
  },
];

export default function VendorsPage() {
  const { data: vendors = [], isLoading, error } = useVendors();

  const activeVendors = vendors.filter((v: any) => v.isVerified).length;
  const totalRevenue = vendors.reduce((sum: number, v: any) => sum + parseFloat(v.revenueToday || 0), 0);

  const stats = [
    { title: "Total Vendors", value: vendors.length.toString(), icon: Store, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Vendors", value: activeVendors.toString(), icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Total Revenue", value: `₹${Math.round(totalRevenue).toLocaleString()}`, icon: DollarSign, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Avg Rating", value: "4.6", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-8 space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <div>
            <p className="text-red-600 font-semibold text-lg">Failed to load vendors</p>
            <p className="text-gray-600 text-sm mt-2">{(error as any)?.message || "An error occurred while fetching data"}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendors Management</h1>
            <p className="text-gray-600 mt-1">Manage your vendor network and performance</p>
          </div>
          <Button className="eco-button" data-testid="add-vendor">
            <Plus className="w-4 h-4 mr-2" />
            Add New Vendor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="eco-card stats-card" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="vendor-revenue-chart">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendors Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: '12px', fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: '12px', fill: '#6B7280' }}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="nandini" stroke="#3B82F6" strokeWidth={3} name="Nandini Dairy" />
                <Line type="monotone" dataKey="amul" stroke="#10B981" strokeWidth={3} name="Amul Coop" />
                <Line type="monotone" dataKey="heritage" stroke="#F59E0B" strokeWidth={3} name="Heritage Foods" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Supply Performance Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100" data-testid="supply-performance-chart">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Performance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={supplyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {supplyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {supplyData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vendors Data Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vendor Directory</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Export
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading vendors...</div>
          ) : (
            <DataTable
              columns={vendorColumns}
              data={vendors}
              searchPlaceholder="Search vendors..."
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="payment-alerts">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-orange-50">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Alerts</h3>
                  <p className="text-gray-600 text-sm">3 vendors have pending payments</p>
                  <Button variant="outline" size="sm" className="mt-2 text-orange-600 border-orange-200">
                    Review Payments
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="top-performer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-green-50">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Top Performer</h3>
                  <p className="text-gray-600 text-sm">Heritage Foods - 99% supply rate</p>
                  <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-200">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow" data-testid="new-onboarding">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-blue-50">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">New Onboarding</h3>
                  <p className="text-gray-600 text-sm">5 vendors in progress</p>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-600 border-blue-200">
                    Manage Queue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}