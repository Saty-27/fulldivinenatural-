import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, TrendingUp, DollarSign, UserPlus, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function SubVendorsPage() {
  const subvendors = [
    { id: 1, name: "Raj Kumar", parent: "Nandini Dairy", area: "Koramangala", status: "Active", revenue: "₹8,500", attendance: "95%" },
    { id: 2, name: "Suresh Patil", parent: "Amul Cooperative", area: "Indiranagar", status: "Active", revenue: "₹7,200", attendance: "88%" },
    { id: 3, name: "Mohan Singh", parent: "Heritage Foods", area: "Whitefield", status: "Inactive", revenue: "₹0", attendance: "0%" },
    { id: 4, name: "Lakshmi Devi", parent: "Mother Dairy", area: "Jayanagar", status: "Active", revenue: "₹9,800", attendance: "98%" },
  ];

  const stats = [
    { title: "Total Subvendors", value: "186", icon: Users, color: "text-blue-500" },
    { title: "Active Today", value: "142", icon: MapPin, color: "text-green-500" },
    { title: "Total Revenue", value: "₹1.8L", icon: DollarSign, color: "text-orange-500" },
    { title: "Avg Attendance", value: "92%", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Subvendors Management</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Manage area-wise subvendor network</p>
          </div>
          <Button className="eco-button">
            <UserPlus className="w-4 h-4 mr-2" />
            Assign New Subvendor
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

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Daily Circulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p>Area-wise circulation chart</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Supply vs Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>Region-wise analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subvendors Table */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Subvendor List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--eco-border))]">
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Name</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Parent Vendor</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Area</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Status</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Revenue</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Attendance</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subvendors.map((subvendor) => (
                    <tr key={subvendor.id} className="border-b border-[hsl(var(--eco-border))]">
                      <td className="p-4 text-[hsl(var(--eco-text))]">{subvendor.name}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{subvendor.parent}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{subvendor.area}</td>
                      <td className="p-4">
                        <Badge className={subvendor.status === 'Active' ? 'eco-badge-success' : 'eco-badge-error'}>
                          {subvendor.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{subvendor.revenue}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{subvendor.attendance}</td>
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

        {/* Alerts & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Missing Delivery</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">2 subvendors missed delivery</p>
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
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Lakshmi Devi - 98% attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Pending Dues</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">₹24,500 pending collection</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}