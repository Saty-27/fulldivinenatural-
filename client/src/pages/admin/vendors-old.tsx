import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, TrendingUp, Users, DollarSign, AlertTriangle, Plus } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function VendorsPage() {
  const vendors = [
    { id: 1, name: "Nandini Dairy Farm", status: "Active", revenue: "₹45,000", supply: "98%", rating: 4.8 },
    { id: 2, name: "Amul Cooperative", status: "Active", revenue: "₹38,500", supply: "95%", rating: 4.6 },
    { id: 3, name: "Mother Dairy Hub", status: "Inactive", revenue: "₹0", supply: "0%", rating: 4.2 },
    { id: 4, name: "Heritage Foods", status: "Active", revenue: "₹52,000", supply: "99%", rating: 4.9 },
  ];

  const stats = [
    { title: "Total Vendors", value: "124", icon: Store, color: "text-blue-500" },
    { title: "Active Vendors", value: "98", icon: Users, color: "text-green-500" },
    { title: "Total Revenue", value: "₹2.4L", icon: DollarSign, color: "text-orange-500" },
    { title: "Avg Rating", value: "4.6", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Vendors Management</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Manage your vendor network and performance</p>
          </div>
          <Button className="eco-button">
            <Plus className="w-4 h-4 mr-2" />
            Add New Vendor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="eco-card stats-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[hsl(var(--eco-text-muted))] text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-[hsl(var(--eco-text))] mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vendor Performance Chart */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Vendor Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <p>Revenue & Supply Performance Chart</p>
                <p className="text-sm">Interactive charts showing vendor KPIs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Vendor List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--eco-border))]">
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Vendor Name</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Status</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Revenue</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Supply Rate</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Rating</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b border-[hsl(var(--eco-border))]">
                      <td className="p-4 text-[hsl(var(--eco-text))]">{vendor.name}</td>
                      <td className="p-4">
                        <Badge className={vendor.status === 'Active' ? 'eco-badge-success' : 'eco-badge-error'}>
                          {vendor.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{vendor.revenue}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{vendor.supply}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">⭐ {vendor.rating}</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Payment Alerts</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">3 vendors have pending payments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Top Performer</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Heritage Foods - 99% supply rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">New Onboarding</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">5 vendors in progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}