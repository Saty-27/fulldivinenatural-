import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, Star, UserPlus, Navigation } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function DeliveryPartnersPage() {
  const deliveryPartners = [
    { id: 1, name: "Ramesh Kumar", status: "Active", routes: 12, completed: 45, pending: 3, rating: 4.8, efficiency: "98%" },
    { id: 2, name: "Sunil Patil", status: "Active", routes: 8, completed: 32, pending: 1, rating: 4.6, efficiency: "95%" },
    { id: 3, name: "Vijay Singh", status: "Inactive", routes: 0, completed: 0, pending: 0, rating: 4.2, efficiency: "0%" },
    { id: 4, name: "Anil Sharma", status: "Active", routes: 15, completed: 58, pending: 5, rating: 4.9, efficiency: "92%" },
  ];

  const stats = [
    { title: "Total Partners", value: "45", icon: Truck, color: "text-blue-500" },
    { title: "Active Today", value: "38", icon: MapPin, color: "text-green-500" },
    { title: "Deliveries Today", value: "234", icon: Clock, color: "text-orange-500" },
    { title: "Avg Rating", value: "4.7", icon: Star, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Delivery Partners</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Manage delivery network and route assignments</p>
          </div>
          <div className="flex space-x-3">
            <Button className="eco-button-secondary">
              <Navigation className="w-4 h-4 mr-2" />
              Live Tracking
            </Button>
            <Button className="eco-button">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </div>
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

        {/* Map and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Live Route Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p>Real-time GPS tracking map</p>
                  <p className="text-sm">Interactive map showing delivery routes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Delivery Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>Completed vs Pending deliveries</p>
                  <p className="text-sm">Real-time performance metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partners Table */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Delivery Partners List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--eco-border))]">
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Partner Name</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Status</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Routes</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Completed</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Pending</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Rating</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Efficiency</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryPartners.map((partner) => (
                    <tr key={partner.id} className="border-b border-[hsl(var(--eco-border))]">
                      <td className="p-4 text-[hsl(var(--eco-text))]">{partner.name}</td>
                      <td className="p-4">
                        <Badge className={partner.status === 'Active' ? 'eco-badge-success' : 'eco-badge-error'}>
                          {partner.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{partner.routes}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{partner.completed}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{partner.pending}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">⭐ {partner.rating}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{partner.efficiency}</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" className="mr-2">Track</Button>
                        <Button variant="outline" size="sm">Edit</Button>
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
                <Clock className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Delayed Deliveries</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">7 deliveries running late</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Top Performer</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Anil Sharma - 4.9 rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Truck className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Route Assignments</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">5 new routes to assign</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}