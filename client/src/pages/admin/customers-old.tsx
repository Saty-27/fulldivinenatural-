import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, CreditCard, Heart, TrendingUp, Mail } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@gmail.com", subscription: "Daily", payment: "Paid", loyalty: 850, status: "Active" },
    { id: 2, name: "Priya Sharma", email: "priya@gmail.com", subscription: "Weekly", payment: "Pending", loyalty: 1200, status: "Active" },
    { id: 3, name: "Amit Patel", email: "amit@gmail.com", subscription: "Monthly", payment: "Paid", loyalty: 450, status: "Inactive" },
    { id: 4, name: "Sunita Devi", email: "sunita@gmail.com", subscription: "Daily", payment: "Paid", loyalty: 1500, status: "Active" },
  ];

  const stats = [
    { title: "Total Customers", value: "2,847", icon: Users, color: "text-blue-500" },
    { title: "Active Customers", value: "2,156", icon: UserPlus, color: "text-green-500" },
    { title: "Pending Payments", value: "₹45,200", icon: CreditCard, color: "text-orange-500" },
    { title: "Loyalty Points", value: "125K", icon: Heart, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--eco-text))]">Customers Management</h1>
            <p className="text-[hsl(var(--eco-text-muted))] mt-1">Manage customer base and subscriptions</p>
          </div>
          <div className="flex space-x-3">
            <Button className="eco-button-secondary">
              <Mail className="w-4 h-4 mr-2" />
              Send Invoice
            </Button>
            <Button className="eco-button">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Customer
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

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Customer Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p>New vs Returning customers</p>
                  <p className="text-sm">Monthly growth analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--eco-text))]">Subscription Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[hsl(var(--eco-text-muted))]">
                <div className="text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>Daily vs Weekly vs Monthly</p>
                  <p className="text-sm">Subscription type breakdown</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--eco-text))]">Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--eco-border))]">
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Customer Name</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Email</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Subscription</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Payment</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Loyalty Points</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Status</th>
                    <th className="text-left p-4 text-[hsl(var(--eco-text))] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-[hsl(var(--eco-border))]">
                      <td className="p-4 text-[hsl(var(--eco-text))]">{customer.name}</td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{customer.email}</td>
                      <td className="p-4">
                        <Badge className="eco-badge">{customer.subscription}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={customer.payment === 'Paid' ? 'eco-badge-success' : 'eco-badge-warning'}>
                          {customer.payment}
                        </Badge>
                      </td>
                      <td className="p-4 text-[hsl(var(--eco-text))]">{customer.loyalty}</td>
                      <td className="p-4">
                        <Badge className={customer.status === 'Active' ? 'eco-badge-success' : 'eco-badge-error'}>
                          {customer.status}
                        </Badge>
                      </td>
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

        {/* Customer Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <CreditCard className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Payment Pending</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">156 customers need follow-up</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Heart className="w-8 h-8 text-pink-500" />
                <div>
                  <h3 className="font-semibold text-[hsl(var(--eco-text))]">Top Loyal Customer</h3>
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">Sunita Devi - 1500 points</p>
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
                  <p className="text-[hsl(var(--eco-text-muted))] text-sm">23 customers this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}